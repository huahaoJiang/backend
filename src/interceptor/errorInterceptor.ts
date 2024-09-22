import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common'
import { Observable, timeout, TimeoutError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(25000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException()
        } else {
          throw err
        }
      })
    )
  }
}
