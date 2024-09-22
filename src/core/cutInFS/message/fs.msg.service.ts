import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom, Observable } from 'rxjs'
import { FSException } from '@/exception/fs.exception'
import { ConfigService } from '@nestjs/config'
import { catchError, map } from 'rxjs/operators'
import { MsgReqDto, MsgSendDto } from '../Dto/fs.msg.dto'

@Injectable()
export class FSMsgService {
  constructor(private httpService: HttpService, private configService: ConfigService) {}

  async getMsgData(token: string, reqData?: Record<string, string>): Promise<any> {
    const backendSecret = this.configService.get<string>('backendSecret')
    const getMsgData = this.configService.get<string>('backendUrl.getMsgData')

    const res = await lastValueFrom(
      this.httpService
        .get(getMsgData, {
          headers: {
            Authorization: backendSecret,
            'Blade-Auth': `bearer ${token}`
          },
          params: reqData
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
      throw new FSException(res)
    }
  }

  async getBigEventData(token: string, reqData?: Record<string, string>): Promise<any> {
    const backendSecret = this.configService.get<string>('backendSecret')
    const getBigEventData = this.configService.get<string>('backendUrl.getBigEventData')

    const res = await lastValueFrom(
      this.httpService
        .get(getBigEventData, {
          headers: {
            Authorization: backendSecret,
            'Blade-Auth': `bearer ${token}`
          },
          params: reqData
        })
        .pipe(
          map(x => x.data),
          catchError(err => {
            const errData = err.response.data
            return new Observable(observer => {
              observer.next({ ...errData, desc: '获取大额融资事件失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 200) {
      Logger.log('获取大额融资事件:' + JSON.stringify(res))
      return res.data
    } else {
      throw new FSException(res)
    }
  }

  async getUserList(token: string): Promise<any> {
    const appId = this.configService.get<string>('app.appId')
    const getUserListUrl = this.configService.get<string>('fsMsgUrl.getUserList') + '?app_id=' + appId
    const res = await lastValueFrom(
      this.httpService
        .get(getUserListUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .pipe(
          map(x => x.data),
          catchError(err => {
            const errData = err.response.data
            return new Observable(observer => {
              observer.next({ ...errData, desc: '获取用户列表失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 0) {
      Logger.log('用户列表:' + JSON.stringify(res.data))
      return res.data
    } else {
      throw new FSException(res)
    }
  }

  async batchPushMsg(msgReqDto: MsgReqDto): Promise<any> {
    const batchPushUrl = this.configService.get<string>('fsMsgUrl.batchSendMsg')
    const res = await lastValueFrom(
      this.httpService
        .post(batchPushUrl, msgReqDto, {
          headers: {
            Authorization: `Bearer ${msgReqDto.token}`
          }
        })
        .pipe(
          map(x => x.data),
          catchError(err => {
            const errData = err.response.data
            return new Observable(observer => {
              observer.next({ ...errData, desc: '消息推送失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 0) {
      Logger.log('推送成功')
      return '消息推送成功'
    } else {
      throw new FSException(res)
    }
  }

  async sendMsgById(msgSendDto: MsgSendDto, content: string): Promise<any> {
    const sendMsgByIdUrl = this.configService.get<string>('fsMsgUrl.sendMsgById') + '?receive_id_type=open_id'
    const res = await lastValueFrom(
      this.httpService
        .post(
          sendMsgByIdUrl,
          {
            receive_id: msgSendDto.openId,
            msg_type: 'interactive',
            content: content
          },
          {
            headers: {
              Authorization: `Bearer ${msgSendDto.token}`
            }
          }
        )
        .pipe(
          map(x => x.data),
          catchError(err => {
            const errData = err.response.data
            return new Observable(observer => {
              observer.next({ ...errData, desc: '消息推送失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 0) {
      Logger.log('推送成功')
      return '消息推送成功'
    } else {
      throw new FSException(res)
    }
  }
}
