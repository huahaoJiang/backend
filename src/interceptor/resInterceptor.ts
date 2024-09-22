import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { SlsService } from '@/ali-sls/sls.service'

interface Response<T> {
  data: T
}

@Injectable()
export class ResInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(private slsService: SlsService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const now = Date.now()
    const ctx = context.switchToHttp()
    const request = ctx.getRequest()
    Logger.warn(`调用 ${request.url}开始`)
    return next.handle().pipe(
      map(data => {
        Logger.debug(`调用 ${request.url} 结束: ${Date.now() - now}ms`)
        this.slsService.putLogs({
          logData: '',
          requestUri: request.url,
          jobStatus: 'success',
          logLevel: 'info'
        })
        if (request.url.startsWith('/fsEvent')) {
          return data
        } else {
          return { data: data, code: 200, msg: 'success' }
        }
      })
    )
  }
}
