import { Body, Controller, Delete, Post, Req } from '@nestjs/common'
import { FSService } from './fs.service'
import { ApiTags } from '@nestjs/swagger'
import { FSBaseDto, RecordsDto, ViewDto, WikiDto, WikiInfoRes } from '../Dto/fs.dto'
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator'

const params = {
  appToken: 'bascnnbJgs969qa2JheyEuj5jqd',
  tableId: 'tbldAevMPWLicim6'
}

@Controller('fs')
@ApiTags('飞书文档')
export class FSController {
  constructor(private readonly fsService: FSService) {}

  @Post('/getWiKiInfo')
  @ApiOkResponse({
    description: '获取知识库节点信息',
    type: WikiInfoRes
  })
  async getWiKiInfo(@Body() wikiDto: WikiDto): Promise<WikiInfoRes> {
    return this.fsService.getWiKiInfo(wikiDto.token, wikiDto.wikiToken)
  }

  @Post('/insertRecords')
  @ApiOkResponse({
    description: '添加表格记录'
  })
  async insertRecords(@Body() recordDto: RecordsDto): Promise<any> {
    return this.fsService.insertRecords(recordDto)
  }

  @Post('/getRecordList')
  @ApiOkResponse({
    description: '获取表格记录'
  })
  async getRecordList(@Body() baseDto: FSBaseDto): Promise<any> {
    return this.fsService.getRecords(baseDto)
  }

  @Post('/dataTableInit')
  @ApiOkResponse({
    description: '表格数据初始化'
  })
  async dataTableInit(@Body() baseDto: FSBaseDto): Promise<string> {
    const res = await this.fsService.getRecords(baseDto)
    if (res.items) {
      await this.fsService.deleteRecords(
        baseDto,
        res.items.map(_ => _.record_id)
      )
    }
    if (res.has_more) {
      return 'true'
    } else {
      return 'false'
    }
  }

  @Delete('/deleteView')
  @ApiOkResponse({
    description: '删除视图'
  })
  async deleteView(@Body() viewDto: ViewDto): Promise<any> {
    return this.fsService.deleteView(viewDto)
  }

  @Post('/createView')
  @ApiOkResponse({
    description: '创建视图'
  })
  async createView(@Body() viewDto: ViewDto): Promise<any> {
    return this.fsService.createView(viewDto)
  }

  /*@Post('/columnsLink')
  @ApiOkResponse({
    description: ''
  })
  async columnsLink(@Body() viewDto: FSBaseDto & { records: any }): Promise<any> {
    await this.fsService.columnsLink(viewDto, viewDto.records)
    return '成功'
  }

  @Post('/getRecords')
  @ApiOkResponse({
    description: '获取表格数据'
  })
  async getRecords(@Body() baseDto: FSBaseDto): Promise<string> {
    return await this.fsService.getRecords(baseDto)
  }*/
}
