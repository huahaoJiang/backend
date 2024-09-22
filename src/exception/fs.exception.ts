import { HttpException, HttpStatus } from '@nestjs/common'

export class FSException extends HttpException {
  constructor(res: any) {
    super({ code: res.code, msg: res.msg, desc: res.desc }, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
