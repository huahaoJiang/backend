import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { SlsService } from '@/ali-sls/sls.service'

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor(private slsService: SlsService) {
    super()
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const isHttpErr = exception instanceof HttpException
    isHttpErr ? Logger.error(JSON.stringify(exception, null, 2)) : Logger.error(exception)
    // console.log(request.get('X-Forwarded-For'), 18)
    console.log(request.hostname, 18)
    const status = isHttpErr ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    response.status(status).json({
      code: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      message: exception.response || '内部异常'
    })

    this.slsService.putLogs({
      logData: exception.response ? JSON.stringify(exception.response) : '内部异常',
      requestUri: request.url,
      jobStatus: 'fail',
      logLevel: 'error'
    })
  }
}
