import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator'
import { FSEventDto } from './Dto/fs.dto'

@Controller('fsEvent')
@ApiTags('飞书文档')
export class FSEventController {
  @Post('/valid')
  @ApiOkResponse({
    description: '事件订阅校验'
  })
  valid(@Body() validDto: FSEventDto): { challenge: string } {
    console.log(validDto, 99)
    return { challenge: validDto.challenge }
  }
}
