import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { AuthService } from '../core/auth/auth.service'
import { DEFAULT_USER } from '../utils/constants'

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name)
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  @Cron('0 0 10 * * *')
  pushDtMsg() {
    this.SendRetry(0, async () => {
      this.logger.debug('钉钉早报推送定时器触发')
      const { token } = await this.authService.login(DEFAULT_USER)
      const pushDtMsg = this.configService.get<string>('selfBaseUrl') + '/dt/msg/pushMessage'
      const res = await lastValueFrom(
        this.httpService
          .post(
            pushDtMsg,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .pipe(
            map(x => x.data),
            catchError(err => {
              const errData = err.response.data
              return new Observable(observer => {
                observer.next({ ...errData, desc: '钉钉早报推送定时器执行失败' })
                observer.complete()
              })
            })
          )
      )
      if (res.code === 200) {
        this.logger.log('钉钉早报推送定时器执行成功')
        return true
      } else {
        this.logger.error('钉钉早报推送定时器执行失败', res)
        return false
      }
    })
  }

  @Cron('0 30 9 * * *')
  pushFsMsg() {
    this.SendRetry(0, async () => {
      this.logger.debug('飞书早报推送定时器触发')
      const { token } = await this.authService.login(DEFAULT_USER)
      const pushFsMsg = this.configService.get<string>('selfBaseUrl') + '/fs/msg/pushMessage'
      const res = await lastValueFrom(
        this.httpService
          .post(
            pushFsMsg,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .pipe(
            map(x => x.data),
            catchError(err => {
              const errData = err.response.data
              return new Observable(observer => {
                observer.next({ ...errData, desc: '飞书早报推送定时器执行失败' })
                observer.complete()
              })
            })
          )
      )
      if (res.code === 200) {
        this.logger.log('飞书早报推送定时器执行成功')
        return true
      } else {
        this.logger.error('飞书早报推送定时器执行失败', res)
        return false
      }
    })
  }

  @Cron('0 0 12 * * 1')
  pushFsEventMsg() {
    this.SendRetry(0, async () => {
      this.logger.debug('大额事件推送定时器触发')
      const { token } = await this.authService.login(DEFAULT_USER)
      const pushFsEventMsg = this.configService.get<string>('selfBaseUrl') + '/fs/msg/pushBigEvent'
      const res = await lastValueFrom(
        this.httpService
          .post(
            pushFsEventMsg,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .pipe(
            map(x => x.data),
            catchError(err => {
              const errData = err.response.data
              return new Observable(observer => {
                observer.next({ ...errData, desc: '大额事件推送定时器执行失败' })
                observer.complete()
              })
            })
          )
      )
      if (res.code === 200) {
        this.logger.log('大额事件推送定时器执行成功')
        return true
      } else {
        this.logger.error('大额事件推送定时器执行失败', res)
        return false
      }
    })
  }

  SendRetry(retryTime: number, callback: () => Promise<boolean>) {
    if (retryTime < 3) {
      retryTime++
      setTimeout(async () => {
        const flag = await callback.call(this)
        if (!flag) {
          this.logger.debug('第' + retryTime + '次重试。。。')
          this.SendRetry(retryTime, callback)
        }
      }, 5000)
    }
  }
}
