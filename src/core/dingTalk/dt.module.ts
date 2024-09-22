import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { DTMsgController } from './dt.msg.controller'
import { DTMsgService } from './dt.msg.service'
import { BackendMiddleware } from '../../middleware/backend.middleware'
@Module({
  imports: [HttpModule],
  controllers: [DTMsgController],
  providers: [DTMsgService, DTMsgController],
  exports: [DTMsgController]
})
export class DTModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BackendMiddleware).forRoutes(DTMsgController)
  }
}
