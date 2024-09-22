import production from './prod.config'
import development from './dev.config'

console.log('env', process.env.NODE_ENV)
const envConfig = process.env.NODE_ENV === 'production' ? production : development

export default () => ({
  app: envConfig.app,
  slsProject: envConfig.slsProject,
  fsUrl: {
    getTenantToken: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    getWikiInfo: 'https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node',
    deleteView: 'https://open.feishu.cn/open-apis/bitable/v1/apps/:app_token/tables/:table_id/views/:view_id',
    insertView: 'https://open.feishu.cn/open-apis/bitable/v1/apps/:app_token/tables/:table_id/views',
    getRecordList: 'https://open.feishu.cn/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records?page_size=500',
    deleteRecordList:
      'https://open.feishu.cn/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/batch_delete',
    insertRecords: 'https://open.feishu.cn/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/batch_create',
    updateRecords: 'https://open.feishu.cn/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/batch_update'
  },
  dtUrl: {
    pushMsg: 'https://oapi.dingtalk.com/robot/send?access_token='
  },
  fsMsgUrl: {
    batchSendMsg: 'https://open.feishu.cn/open-apis/message/v4/batch_send/',
    getUserList: 'https://open.feishu.cn/open-apis/application/v2/app/visibility',
    sendMsgById: 'https://open.feishu.cn/open-apis/im/v1/messages'
  },
  backendSecret: 'Basic dmlldzp2aWV3X3NlY3JldA==',
  backendUrl: {
    authToken: envConfig.backendBaseUrl + '/tz-open-api/v1/auth/token',
    getDtMsgData: envConfig.backendBaseUrl + '/tz-info/info/infoListByTenant_dd?pageSize=10',
    getMsgData: envConfig.backendBaseUrl + '/tz-info/info/selectFsInfo',
    getBigEventData: envConfig.backendBaseUrl + '/tz-front/finevent/bigEventWeek'
  },
  skipBaseUrl: envConfig.skipBaseUrl,
  skipBaseUrlH5: envConfig.skipBaseUrlH5,
  selfBaseUrl: 'http://127.0.0.1:8000',
  dtConfig: envConfig.dtConfig
})
