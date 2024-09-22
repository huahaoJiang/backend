import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator'
import { FSMsgService } from './fs.msg.service'
import { FsMsgBaseDto, MsgReqDto, MsgSendDto } from '../Dto/fs.msg.dto'
import { genCardConfig, genEventCardConfig } from '@/utils/msgUtils'
import { AuthGuard } from '@nestjs/passport'

@Controller('fs/msg')
@ApiBearerAuth()
@ApiTags('飞书文档')
export class FSMsgController {
  constructor(private readonly fsMsgService: FSMsgService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/pushMessage')
  async pushMessage(@Body() body: FsMsgBaseDto): Promise<any> {
    const dataList = await Promise.all([
      this.fsMsgService.getMsgData(body.backendToken),
      this.fsMsgService.getUserList(body.token)
    ])
    const data = dataList[1]

    const msgReqDto: MsgReqDto = {
      department_ids: data.departments?.map(item => item.id) || [],
      open_ids: data.users?.map(item => item.open_id) || [],
      msg_type: 'interactive',
      token: body.token,
      card: genCardConfig(dataList[0])
    }
    return await this.fsMsgService.batchPushMsg(msgReqDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/pushBigEvent')
  @ApiOkResponse({
    description: '推送大额融资事件卡片'
  })
  async pushBigEvent(@Body() body: FsMsgBaseDto): Promise<any> {
    const dataList = await Promise.all([
      this.fsMsgService.getBigEventData(body.backendToken),
      this.fsMsgService.getUserList(body.token)
    ])
    const data = dataList[1]
    const msgReqDto: MsgReqDto = {
      department_ids: data.departments?.map(item => item.id) || [],
      open_ids: data.users?.map(item => item.open_id) || [],
      msg_type: 'interactive',
      token: body.token,
      card: genEventCardConfig({ list: dataList[0] })
    }
    return await this.fsMsgService.batchPushMsg(msgReqDto)
  }

  @Post('/sendMessageByOpenId')
  @ApiOkResponse({
    description: '消息卡片交互'
  })
  async sendMessageByOpenId(@Body() msgSendDto: MsgSendDto): Promise<any> {
    const msgData = await this.fsMsgService.getMsgData(msgSendDto.action.value)
    return await this.fsMsgService.sendMsgById(msgSendDto, JSON.stringify(msgData))
  }
}
