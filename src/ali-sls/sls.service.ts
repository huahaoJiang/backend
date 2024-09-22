import { Injectable, Logger } from '@nestjs/common'
import { GenerateSLSDto, registerConfig, shouldPutLogRoutes, storeName } from './helper'
import { SlsVo } from './sls.dto'
import { SLS } from 'aliyun-sdk'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SlsService {
  private slsServer: any
  constructor(private configService: ConfigService) {
    this.slsServer = new SLS(registerConfig)
  }

  putLogs(slsVo: SlsVo): void {
    if (!Object.keys(shouldPutLogRoutes).includes(slsVo.requestUri)) return

    const projectName = this.configService.get<string>('slsProject')
    this.slsServer.putLogs(
      {
        projectName: projectName,
        logStoreName: storeName,
        logGroup: {
          logs: [GenerateSLSDto(slsVo)]
        }
      },
      function (err) {
        Logger.log('SLS上报成功！')
        if (err) {
          Logger.error('SLS上报失败：' + err)
          return
        }
      }
    )
  }

  queryLogs() {
    const to = Math.floor(new Date().getTime() / 1000)
    const from = to - 3600

    const projectName = this.configService.get<string>('slsProject')

    const param = {
      projectName,
      logStoreName: storeName,
      from,
      to
    }

    this.slsServer.getLogs(param, function (err, data) {
      if (err) {
        console.error('error:', err)
      } else {
        console.log('查询近一个小时的日志', data)
      }
    })
  }
}
