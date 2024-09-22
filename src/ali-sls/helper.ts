import { SlsVo } from './sls.dto'

export const storeName = 'tz_shennong_usual'

export const registerConfig = {
  accessKeyId: '',
  secretAccessKey: '',
  endpoint: 'https://cn-shanghai.log.aliyuncs.com',
  apiVersion: '2015-06-01'
}

export const GenerateSLSDto = (SlsVo: SlsVo) => {
  const time = Math.floor(new Date().getTime() / 1000)
  return {
    time: time,
    contents: [
      { key: 'tenantId', value: '' },
      { key: 'serviceId', value: '' },
      { key: 'serverIp', value: '' },
      { key: 'serverHost', value: '' },
      { key: 'env', value: process.env.NODE_ENV || 'development' },
      { key: 'logLevel', value: SlsVo.logLevel },
      { key: 'logId', value: shouldPutLogRoutes[SlsVo.requestUri].logId },
      {
        key: 'logData',
        value: SlsVo.jobStatus === 'success' ? shouldPutLogRoutes[SlsVo.requestUri].successData : SlsVo.logData
      },
      { key: 'method', value: 'scheduler' },
      { key: 'requestUri', value: SlsVo.requestUri },
      { key: 'remoteIp', value: '' },
      { key: 'methodClass', value: '' },
      { key: 'methodName', value: '' },
      { key: 'userAgent', value: '' },
      { key: 'params', value: '' },
      { key: 'state', value: SlsVo.jobStatus },
      { key: 'createBy', value: 'tz-push-server' }
    ]
  }
}
export const shouldPutLogRoutes = {
  '/fs/msg/pushMessage': {
    logId: 'fsInfoPush',
    successData: '飞书资讯推送成功'
  },
  '/fs/msg/pushBigEvent': {
    logId: 'fsEventPush',
    successData: '大额事件推送成功'
  },
  '/dt/msg/pushMessage': {
    logId: 'dtInfoPush',
    successData: '钉钉资讯推送成功'
  }
}
/*{
    tenantId: '',
      serviceId: '',
    serverIp: '',
    serverHost: '',

    env: process.env, //系统环境
    logLevel: '3', //日志级别
    logId: SlsVo.logId, //日志业务id
    logData: SlsVo.logData, //日志数据
    method: 'scheduler', //操作方式
    requestUri: SlsVo.requestUri, //请求URI

    remoteIp: '', //操作IP地址
    methodClass: '', //方法类
    methodName: '', //方法名
    userAgent: '', //用户代理
    params: '', //操作提交的数据

    state: SlsVo.jobStatus, //执行状态
    createBy: 'tz-push-server' //创建者
  }
}*/
