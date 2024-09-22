import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom, Observable } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { catchError, map } from 'rxjs/operators'
import { FSException } from '../../exception/fs.exception'

@Injectable()
export class DTMsgService {
  constructor(private httpService: HttpService, private configService: ConfigService) {}

  async getMsgData(token: string): Promise<any> {
    const backendSecret = this.configService.get<string>('backendSecret')
    const getMsgData = this.configService.get<string>('backendUrl.getDtMsgData')

    const res = await lastValueFrom(
      this.httpService
        .get(getMsgData, {
          headers: {
            Authorization: backendSecret,
            'Blade-Auth': `bearer ${token}`
          }
        })
        .pipe(
          map(x => x.data),
          catchError(err => {
            const errData = err.response.data
            return new Observable(observer => {
              observer.next({ ...errData, desc: '获取资讯信息失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 200) {
      Logger.log('获取资讯信息成功')
      return res.data
    } else {
      throw new FSException({ ...res, desc: '获取资讯信息失败' })
    }
  }

  async pushInfoMsg(msgReqDto: any): Promise<any> {
    const PushMsgUrl = this.configService.get<string>('dtUrl.pushMsg')
    const tokens = this.configService.get<string[]>('dtConfig.token')
    return await this.pushMessage(PushMsgUrl, tokens, msgReqDto, 0)
  }

  async pushMessage(PushMsgUrl: string, tokens: string[], msgReqDto: any, retryNum: number): Promise<any> {
    retryNum++
    const resList = await Promise.all(
      tokens.map(async (token: string) => {
        return await lastValueFrom(
          this.httpService.post(PushMsgUrl + token, msgReqDto).pipe(
            map((x: any) => {
              return { ...x.data, token: token }
            }),
            catchError(err => {
              const errData = err.response.data
              return new Observable(observer => {
                observer.next({ ...errData, token: token, desc: '钉钉消息推送失败' })
                observer.complete()
              })
            })
          )
        )
      })
    )
    const errList = resList.filter(res => res.errcode !== 0)
    if (errList.length === 0) {
      Logger.log('推送成功')
      return '消息全部推送成功'
    } else {
      Logger.error(JSON.stringify(errList, null, 2))
      setTimeout(() => {
        if (retryNum < 3) {
          Logger.log('失败部分重推，第' + retryNum + '次')
          this.pushMessage(
            PushMsgUrl,
            errList.map(err => err.token),
            msgReqDto,
            retryNum
          )
        }
      }, 5000)
      return '消息部分推送成功'
    }
  }
}
