/*
import { Body, Controller, Get, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator'
import { FHService } from './fh.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { FSException } from '../../exception/fs.exception'

@Controller('fh')
@ApiTags('文件处理')
export class FHController {
  constructor(private readonly fhService: FHService) {}

  @Post('/downloadFile')
  @ApiOkResponse({
    description: '文件上传'
  })
  @UseInterceptors(
    FilesInterceptor('file', 500, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          file.path = ''
          cb(null, '/Users/jianghuahao/Documents/logoList')
        },
        filename: (req, file, cb) => {
          file.path = ''
          cb(null, file.originalname)
        }
      })
    })
  )
  uploadFile(@UploadedFile('file') file, @Body() body) {
    try {
      return '图片上传成功'
    } catch (e) {
      throw new FSException({ code: 500, msg: body.fileName, desc: '图片上传失败' })
    }
  }
  @Post('/htmlToImage')
  @ApiOkResponse({
    description: '生成图片'
  })
  async htmlToImage(@Body() body) {
    return await this.fhService.toImages(body)
  }
}
*/
