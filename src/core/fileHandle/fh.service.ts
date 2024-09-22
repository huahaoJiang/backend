/*
import { Injectable, Logger } from '@nestjs/common'
import { create } from 'phantom'

@Injectable()
export class FHService {
  async toImages(objs: any[]): Promise<any> {
    const instance = await create()
    const res = await Promise.all(objs.map(obj => this.toImage(instance, obj)))
    instance.exit()
    return res
  }
  async toImage(instance: any, obj: any): Promise<any> {
    const page = await instance.createPage()
    const fileName = obj.id + '.' + (obj.type || 'png')
    await page.on('onResourceRequested', function (requestData) {
      // console.info('Requesting', requestData.url)
    })
    const status = await page.open('http://192.168.5.140:8000/static/index.html')
    if (status === 'success') {
      page.property('viewportSize', { width: 400, height: 400 })
      await page.evaluate(function (obj) {
        const div = document.getElementById('content')
        if (obj.name.length <= 4) {
          div.setAttribute('style', 'font-size: 80px')
        } else {
          div.setAttribute('style', 'font-size: 56px')
        }
        div.innerText = obj.name
        return 'success'
      }, obj)
      await page.render('/Users/jianghuahao/Documents/orgLogoList/' + fileName)
      Logger.log(fileName + '渲染完成')
      return 'true:' + fileName
    } else {
      Logger.error(fileName + '渲染失败')
      return 'false:' + fileName
    }
  }
}
*/
