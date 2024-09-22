export class SlsDto {
  tenantId?: string //租户ID
  serviceId?: string //服务ID
  serverIp?: string //服务器IP地址
  serverHost?: string //服务器名

  env: string //系统环境
  logLevel: string //日志级别
  logId: string //日志业务id
  logData: string //日志数据
  method?: string //操作方式
  requestUri: string //请求URI

  remoteIp?: string //操作IP地址
  methodClass?: string //方法类
  methodName?: string //方法名
  userAgent?: string //用户代理
  params?: string //操作提交的数据

  state?: string //执行状态
  createBy?: string //创建者
}
export class SlsVo {
  logData: string
  requestUri: string
  jobStatus: 'success' | 'fail'
  logLevel: 'info' | 'error'
}
