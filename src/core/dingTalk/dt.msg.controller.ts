import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { getDingTalkCardConfig } from '@/utils/msgUtils'
import { DTMsgService } from './dt.msg.service'
import { DtBaseDto } from './Dto/dt.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('dt/msg')
@ApiBearerAuth()
@ApiTags('钉钉机器人')
export class DTMsgController {
  constructor(private readonly dtMsgService: DTMsgService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/pushMessage')
  async pushMessageDT(@Body() body: DtBaseDto): Promise<any> {
    const data = await this.dtMsgService.getMsgData(body.backendToken)
    return await this.dtMsgService.pushInfoMsg(getDingTalkCardConfig(data))
  }
}
