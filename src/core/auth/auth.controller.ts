import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags } from '@nestjs/swagger'
import { AuthDto } from './auth.dto'

@Controller('open/auth')
@ApiTags('鉴权模块')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/token')
  async login(@Body() body: AuthDto) {
    return this.authService.login(body.userName)
  }
}
