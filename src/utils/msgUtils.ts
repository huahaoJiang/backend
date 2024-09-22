import Config from 'config/fsConfiguration'
import { transTitleText, getDatesByWeek, isUrl } from 'tzjh-tools'
const btnLabels = [
  '投融资',
  '药',
  '生物技术',
  '医疗器械',
  '医美及消费品',
  '研发生产外包服务',
  '数字医疗及服务',
  '医疗服务',
  '动物保健',
  '合成生物学',
  '健康险'
]

const btnParams = [
  'eventType=1',
  'trackCode=1452',
  'trackCode=1457',
  'trackCode=1451',
  'trackCode=1456',
  'trackCode=1454',
  'trackCode=1450',
  'trackCode=1458',
  'trackCode=1455',
  'trackCode=1453',
  'trackCode=1459'
]
const config = Config()

function genSkipBtn() {
  const href = {}
  btnLabels.forEach((label, index) => {
    href[label] = {
      url: `${config.skipBaseUrl}?${btnParams[index]}`,
      android_url: `${config.skipBaseUrlH5}?${btnParams[index]}`,
      ios_url: `${config.skipBaseUrlH5}?${btnParams[index]}`,
      pc_url: `${config.skipBaseUrl}?${btnParams[index]}`
    }
  })
  return {
    tag: 'markdown',
    content: `${btnLabels.map(label => `[${label}]($${label})`).join('   ')}`,
    href
  }
}

function genContentBody(infoVOList: any[]) {
  if (!infoVOList.length) return '暂无内容\n'

  return infoVOList
    .map(vo => {
      return `· [${transTitleText(vo.title)}](${vo.sourceUrl}) ${transInfoNum(vo.infonum)}`
    })
    .join('\n\n')
}

function genTitle(infoVOList: any[]) {
  if (!infoVOList.length) return '无标题\n'
  return transTitleText(infoVOList[0].title).substring(0, 20)
}

function getCurrentDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const week = date.getDay()
  let weekStr = '星期'
  switch (week) {
    case 0:
      weekStr += '日'
      break
    case 1:
      weekStr += '一'
      break
    case 2:
      weekStr += '二'
      break
    case 3:
      weekStr += '三'
      break
    case 4:
      weekStr += '四'
      break
    case 5:
      weekStr += '五'
      break
    case 6:
      weekStr += '六'
      break
  }
  return `${year}年${month}月${day}日(${weekStr})`
}

function transInfoNum(num) {
  if (num > 0) {
    return `${num}家媒体报道`
  } else {
    return ''
  }
}

export const getDingTalkCardConfig = (data: { records: any[] }) => {
  const content = {
    msgtype: 'markdown',
    markdown: {
      title: `🗞️ ${genTitle(data.records)}...`,
      text: genDTContentBody(data.records)
    }
  }
  return content
}
function genDTContentBody(infoVOList: any[]) {
  // const title1 = `### 🗞️ ${genTitle(infoVOList)}...\n`
  const title = `### 早报 ${getCurrentDate()}\n`

  if (!infoVOList.length) return `${title} 暂无内容`

  const content = infoVOList
    .map(vo => {
      return `· [${transTitleText(vo.title)}](${vo.sourceUrl})\n`
    })
    .join('\n\n')
  return `${title} ${content}`
}

export const genCardConfig = (data: { trackCode: any; eventType: any; infoVOList: any[] }) => {
  return {
    config: {
      wide_screen_mode: true
    },
    header: {
      template: 'grey',
      title: {
        content: `🗞️ ${genTitle(data.infoVOList)}...`,
        tag: 'plain_text'
      }
    },
    elements: [
      {
        tag: 'markdown',
        content: `每日早报  ${getCurrentDate()}\n`
      },
      {
        tag: 'div',
        text: {
          content: genContentBody(data.infoVOList),
          tag: 'lark_md'
        }
      },
      {
        tag: 'action',
        actions: [
          {
            tag: 'button',
            text: {
              tag: 'lark_md',
              content: '查看更多'
            },
            multi_url: {
              url: config.skipBaseUrl,
              android_url: config.skipBaseUrlH5,
              ios_url: config.skipBaseUrlH5,
              pc_url: config.skipBaseUrl
            },
            type: 'primary'
          }
        ]
      },
      {
        tag: 'hr'
      },
      genSkipBtn()
    ]
  }
}

export const genEventCardConfig = (data: any) => ({
  config: {
    wide_screen_mode: true
  },
  header: {
    template: 'grey',
    title: {
      content: `💸 ${genDetail(data.list)}...`,
      tag: 'plain_text'
    }
  },
  elements: [
    {
      tag: 'markdown',
      content: `大额融资事件周报  ${getDatesByWeek('YYYY年M月D日').join(' - ')}\n`
    },
    {
      tag: 'div',
      text: {
        content: genColumnContentBody(data.list),
        tag: 'lark_md'
      }
    }
  ]
})
function genDetail(list: any[]) {
  if (!list.length) return '无标题\n'
  return transTitleText(list[0].detail).substring(0, 20)
}

function genColumnContentBody(infoVOList: any[]) {
  if (!infoVOList.length) return '上周没有大额融资事件\n'
  return infoVOList
    .map(vo => {
      return isUrl(vo.sourceUrl)
        ? `· [${transTitleText(vo.detail)}](${vo.sourceUrl})`
        : `· ${transTitleText(vo.detail)}`
    })
    .join('\n\n')
}
