import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { lastValueFrom, Observable } from 'rxjs'
import { FSException } from '../exception/fs.exception'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class BackendMiddleware implements NestMiddleware {
  private TENANT_TOKEN: string
  private EXPRESS_TIME: number
  constructor(private httpService: HttpService, private configService: ConfigService) {
    this.TENANT_TOKEN = ''
    this.EXPRESS_TIME = new Date().getTime()
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const backendSecret = this.configService.get<string>('backendSecret')
    const getBackendToken = this.configService.get<string>('backendUrl.authToken')
    if (new Date().getTime() >= this.EXPRESS_TIME) {
      const res = await lastValueFrom(
        this.httpService
          .get(getBackendToken, {
            headers: {
              Authorization: backendSecret
            }
          })
          .pipe(
            map(x => x.data),
            catchError(err => {
              const errData = err.response.data
              return new Observable(observer => {
                observer.next({ ...errData, desc: '获取后台token失败' })
                observer.complete()
              })
            })
          )
      )
      if (res) {
        req.body.backendToken = this.TENANT_TOKEN = res
        req.body.backendExpire = this.EXPRESS_TIME = new Date().getTime() + 60 * 60 * 3 * 1000
      } else {
        throw new FSException({ ...res, desc: '获取backendToken失败' })
      }
    } else {
      req.body.backendToken = this.TENANT_TOKEN
      req.body.backendExpire = this.EXPRESS_TIME
    }
    next()
  }
}
