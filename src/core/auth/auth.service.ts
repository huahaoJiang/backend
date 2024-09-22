import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { USER_LIST } from './constants'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  validateUser(userName: string): any {
    return USER_LIST.find(item => item.name === userName)
  }

  async login(userName: string) {
    const payload = this.validateUser(userName)
    return {
      token: payload ? this.jwtService.sign(payload) : null
    }
  }
}
