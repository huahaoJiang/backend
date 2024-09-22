import { ApiProperty } from '@nestjs/swagger'

export class AuthDto {
  @ApiProperty({ description: '用户名称', required: true })
  userName: string
}
