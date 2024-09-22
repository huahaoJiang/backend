import { ApiProperty } from '@nestjs/swagger'

export class WikiInfoRes {
  @ApiProperty({ description: 'appToken' })
  obj_token: string

  @ApiProperty()
  node_token: string

  @ApiProperty()
  space_id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  has_child: boolean
}

export class ViewRes {
  @ApiProperty({ description: '视图ID' })
  view_id: string

  @ApiProperty({ description: '视图名称' })
  view_name: string

  @ApiProperty({ description: '视图类型' })
  view_type: string
}

export class WikiDto {
  @ApiProperty({ description: '知识库文档标识', required: true })
  wikiToken: string

  token: string
}

export class FSBaseDto {
  @ApiProperty({ description: '表格ID', required: true })
  tableId: string

  @ApiProperty({ description: '应用标识', required: true })
  appToken: string

  pageToken?: string
  token: string
}

export class FSEventDto {
  @ApiProperty({ description: 'challenge', required: true })
  challenge: string

  @ApiProperty({ description: 'Verification Token', required: true })
  token: string

  @ApiProperty({ description: '请求类型', required: true })
  type: string
}

export class ViewDto extends FSBaseDto {
  @ApiProperty({ description: '视图ID', required: true })
  viewId: string
}

export class RecordsDto extends FSBaseDto {
  @ApiProperty({ description: '记录', required: true })
  records: string
}
