import { SlsService } from './sls.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [SlsService],
  exports: [SlsService]
})
export class SlsModule {}
