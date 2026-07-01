/*
 * NAME            : remove_ads
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-07-01 11:32:15 +0800
 * DESC            : 移除首页推广、弹窗、悬浮窗、底栏天气助手、和工具箱入口，移除我的页面广告横幅
 */

const url = $request.url
let obj = JSON.parse($response.body)
if (/\/api\.caiyunapp\.com\/v1\/activity/.test(url)) {
  if (url.includes('&type_id=A03&')) {
    // 底栏控制项目 主页图标 天气助手 彩云ai
    if (obj?.interval) {
      obj.interval = 2592000 // 30天===2592000秒
    }
    if (obj?.activities?.length > 0) {
      for (let item of obj.activities) {
        if (item?.name && item?.type && item?.feature) {
          item.feature = false
        }
      }
    }
  } else {
    // 其他请求
    obj = { status: 'ok', activities: [{ items: [] }] }
  }
} else if (/\/wrapper\.cyapi\.cn\/v1\/activity/.test(url)) {
  // 彩云推广
  if (url.includes('&type_id=A03&')) {
    // 天气助手 彩云ai
    if (obj?.interval) {
      obj.interval = 2592000 // 30天===2592000秒
    }
    // if (obj?.activities?.length > 0) {
    //   obj.activities = []
    // }
    if (obj?.activities?.length > 0) {
      for (let item of obj.activities) {
        if (item?.name && item?.type && item?.feature) {
          item.feature = false
        }
      }
    }
  } else {
    // 其他请求
    obj = { status: 'ok', activities: [{ items: [] }] }
  }
} else if (/\/starplucker\.cyapi\.cn\/v\d\/operation\/features/.test(url)) {
  // 工具箱
  if (obj?.data) {
    obj.data = []
  }
} else if (/\/starplucker\.cyapi\.cn\/v\d\/operation\/banners/.test(url)) {
  // Banner
  if (obj?.data) {
    obj.data = []
  }
} else if (/\/starplucker\.cyapi\.cn\/v\d\/campaigns/.test(url)) {
  // 推广信息
  if (obj?.campaigns) {
    obj.campaigns = []
  }
}
$done({ body: JSON.stringify(obj) })
