import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { lastValueFrom } from 'rxjs'
import { FSException } from '@/exception/fs.exception'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FsMiddleware implements NestMiddleware {
  private TENANT_TOKEN: string
  private EXPRESS_TIME: number
  constructor(private httpService: HttpService, private configService: ConfigService) {
    this.TENANT_TOKEN = ''
    this.EXPRESS_TIME = new Date().getTime()
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const appInfo = this.configService.get<{ appId: string; appSecret: string }>('app')
    const getTenantToken = this.configService.get<string>('fsUrl.getTenantToken')
    if (new Date().getTime() >= this.EXPRESS_TIME) {
      const res = await lastValueFrom(
        this.httpService.post(getTenantToken, {
          app_id: appInfo.appId,
          app_secret: appInfo.appSecret
        })
      )
      if (res.data.code === 0) {
        req.body.token = this.TENANT_TOKEN = res.data.tenant_access_token
        req.body.expire = this.EXPRESS_TIME = new Date().getTime() + res.data.expire * 1000
      } else {
        throw new FSException({ ...res.data, desc: '获取tenant_token失败' })
      }
    } else {
      req.body.token = this.TENANT_TOKEN
      req.body.expire = this.EXPRESS_TIME
    }
    next()
  }
}
