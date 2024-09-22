import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { AuthModule } from '../core/auth/auth.module'

@Module({
  imports: [HttpModule, AuthModule, ConfigModule, ScheduleModule.forRoot()],
  providers: [TaskService]
})
export class TaskModule {}
