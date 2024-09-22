import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './filter/allException.filter'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as bodyParser from 'body-parser'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { SlsService } from '@/ali-sls/sls.service'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)
  const slsService = app.get<SlsService>(SlsService)
  const port = configService.get('PORT')
  app.useGlobalFilters(new AllExceptionsFilter(slsService))
  const options = new DocumentBuilder()
    .setTitle('Nest接口文档')
    .setDescription('The NEST API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  app.useStaticAssets(join(__dirname, '../../', 'public/'), { prefix: '/static/' })
  await app.listen(port)
}
bootstrap().then()
