import { ApiProperty } from '@nestjs/swagger'

export class MsgReqDto {
  department_ids?: string[]
  open_ids?: string[]
  msg_type: 'interactive' | 'text' | 'image' | 'post' | 'share_chat'
  card: any
  uuid?: string
  token: string
}

export class MsgSendDto {
  @ApiProperty({ description: '用户对应应用的唯一ID', required: true })
  openId: string

  @ApiProperty({ description: '交互操作', required: true })
  action: { value: any; tag: string }

  token: string
}

export class FsMsgBaseDto {
  token: string
  backendToken: string
}
