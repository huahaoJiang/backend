import { Module } from '@nestjs/common'
import { FSModule } from './core/cutInFS/fs.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ResInterceptor } from './interceptor/resInterceptor'
import { ErrorsInterceptor } from './interceptor/errorInterceptor'

import { ConfigModule } from '@nestjs/config'
import fsConfiguration from '../config/fsConfiguration'
import { DTModule } from './core/dingTalk/dt.module'
import { TaskModule } from './schedule/task.module'
import { AuthModule } from './core/auth/auth.module'
import { SlsModule } from './ali-sls/sls.module'
// import { FHModule } from './fileHandle/fh.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [fsConfiguration],
      envFilePath: '.env.development',
      isGlobal: true,
      expandVariables: true
    }),
    SlsModule,
    AuthModule,
    TaskModule,
    FSModule,
    DTModule
  ],
  providers: [
    /* {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },*/
    {
      provide: APP_INTERCEPTOR,
      useClass: ResInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor
    }
  ]
})
export class AppModule {}
