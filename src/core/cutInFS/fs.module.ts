import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { FSController } from './document/fs.controller'
import { FSService } from './document/fs.service'
import { HttpModule } from '@nestjs/axios'
import { FsMiddleware } from '@/middleware/fs.middleware'
import { FSEventController } from './fs.event.controller'
import { FSMsgController } from './message/fs.msg.controller'
import { FSMsgService } from './message/fs.msg.service'
import { BackendMiddleware } from '@/middleware/backend.middleware'

@Module({
  imports: [HttpModule],
  controllers: [FSController, FSEventController, FSMsgController],
  providers: [FSService, FSMsgService],
  exports: [FSMsgService]
})
export class FSModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FsMiddleware).forRoutes(FSController, FSMsgController)
    consumer.apply(BackendMiddleware).forRoutes(FSMsgController)
  }
}
