import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom, Observable } from 'rxjs'
import { FSException } from '../../../exception/fs.exception'
import { ConfigService } from '@nestjs/config'
import { FSBaseDto, RecordsDto, ViewDto, ViewRes, WikiInfoRes } from '../Dto/fs.dto'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class FSService {
  constructor(private httpService: HttpService, private configService: ConfigService) {}

  async getWiKiInfo(tenantToken: string, wikiToken: string): Promise<WikiInfoRes> {
    const getWikiInfoUrl = this.configService.get<string>('fsUrl.getWikiInfo') + '?token=' + wikiToken
    const res = await lastValueFrom(
      this.httpService
        .get(getWikiInfoUrl, {
          headers: {
            Authorization: `Bearer ${tenantToken}`
          }
        })
        .pipe(
          map(x => x.data),
          catchError(err => {
            const errData = err.response.data
            return new Observable(observer => {
              observer.next({ ...errData, desc: '获取appToken失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 0) {
      return res.data.node
    } else {
      throw new FSException(res)
    }
  }
  async createView(viewDto: ViewDto): Promise<ViewRes> {
    const insertViewUrl = this.configService.get<string>('fsUrl.insertView')
    const res = await lastValueFrom(
      this.httpService
        .post(
          insertViewUrl.replace(':app_token', viewDto.appToken).replace(':table_id', viewDto.tableId),
          {
            view_name: '数据表格_TEST',
            view_type: 'grid'
          },
          {
            headers: {
              Authorization: `Bearer ${viewDto.token}`
            }
          }
        )
        .pipe(
          map(x => {
            return x.data
          }),
          catchError(err => {
            const errData = err.response.data
            return new Observable(observer => {
              observer.next({ ...errData, desc: '新增视图失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 0) {
      Logger.log('新增视图成功')
      return res.data.view
    } else {
      throw new FSException(res)
    }
  }
  async deleteView(viewDto: ViewDto): Promise<string> {
    const deleteViewUrl = this.configService
      .get<string>('fsUrl.deleteView')
      .replace(':app_token', viewDto.appToken)
      .replace(':table_id', viewDto.tableId)
      .replace(':view_id', viewDto.viewId)
    const res = await lastValueFrom(
      this.httpService
        .delete(deleteViewUrl, {
          headers: {
            Authorization: `Bearer ${viewDto.token}`
          }
        })
        .pipe(
          map(x => x.data),
          catchError(err => {
            const errData = err.response.data
            return new Observable(observer => {
              observer.next({ ...errData, desc: '新增视图失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 0) {
      Logger.log('视图删除成功')
      return '删除成功'
    } else {
      throw new FSException(res)
    }
  }

  async insertRecords(recordDto: RecordsDto): Promise<any> {
    const insertRecords = this.configService
      .get<string>('fsUrl.insertRecords')
      .replace(':app_token', recordDto.appToken)
      .replace(':table_id', recordDto.tableId)

    const res = await lastValueFrom(
      this.httpService
        .post(
          insertRecords,
          {
            records: JSON.parse(recordDto.records)
          },
          {
            headers: {
              Authorization: `Bearer ${recordDto.token}`
            }
          }
        )
        .pipe(
          map(x => x.data),
          catchError(err => {
            const errData = err.response.data
            return new Observable(observer => {
              observer.next({ ...errData, desc: '新增记录失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 0) {
      Logger.log('新增记录成功')
      return res.data.records
    } else {
      throw new FSException(res)
    }
  }

  async getRecords(baseDto: FSBaseDto): Promise<any> {
    const getRecordList = this.configService
      .get<string>('fsUrl.getRecordList')
      .replace(':app_token', baseDto.appToken)
      .replace(':table_id', baseDto.tableId)
    const url = baseDto.pageToken ? getRecordList + '&page_token=' + baseDto.pageToken : getRecordList
    const res = await lastValueFrom(
      this.httpService
        .get(url, {
          headers: {
            Authorization: `Bearer ${baseDto.token}`
          }
        })
        .pipe(
          map(x => {
            return x.data
          }),
          catchError(err => {
            const errData = err.response.data
            Logger.error(errData)
            return new Observable(observer => {
              observer.next({ ...errData, desc: '获取记录失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 0) {
      Logger.log('获取记录成功')
      return res.data
    } else {
      throw new FSException(res)
    }
  }

  async deleteRecords(baseDto: FSBaseDto, idList: string[]): Promise<any> {
    const deleteRecordList = this.configService
      .get<string>('fsUrl.deleteRecordList')
      .replace(':app_token', baseDto.appToken)
      .replace(':table_id', baseDto.tableId)

    const res = await lastValueFrom(
      this.httpService
        .post(
          deleteRecordList,
          { records: idList },
          {
            headers: {
              Authorization: `Bearer ${baseDto.token}`
            }
          }
        )
        .pipe(
          map(x => x.data),
          catchError(err => {
            const errData = err.response.data
            return new Observable(observer => {
              observer.next({ ...errData, desc: '删除记录失败' })
              observer.complete()
            })
          })
        )
    )
    if (res.code === 0) {
      Logger.log('删除记录成功')
      return res.data.records
    } else {
      throw new FSException(res)
    }
  }

  async columnsLink(baseDto: FSBaseDto, records: any[]): Promise<any> {
    const updateRecordList = this.configService
      .get<string>('fsUrl.updateRecords')
      .replace(':app_token', baseDto.appToken)
      .replace(':table_id', baseDto.tableId)

    const res = await lastValueFrom(
      this.httpService
        .post(
          updateRecordList,
          { records: records },
          {
            headers: {
              Authorization: `Bearer ${baseDto.token}`
            }
          }
        )
        .pipe(
          map(x => {
            const data = x.data
            if (data.code !== 0) {
              Logger.error({ ...data, desc: '更新记录失败' })
            }
            return data
          }),
          catchError(err => {
            const errData = err.response.data
            Logger.error({ ...errData, desc: '更新记录失败' })
            return errData
          })
        )
    )
    if (res.code === 0) {
      Logger.log('更新记录成功')
      return res.data.records
    } else {
      throw new FSException({ ...res, desc: '删除记录失败' })
    }
  }
}
