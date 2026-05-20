/*
 * NAME            : remove_comm_ads
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-20 11:32:49 +0800
 * DESC            : 移除广告
 */

const url = $request.url

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (/10010.com\/video_recommend\/content\/screenSwitch/.test(url)) {
    if (obj.data && typeof obj.data === 'object') {
      if (Object.prototype.hasOwnProperty.call(obj.data, 'detailsAdShow')) {
        obj.data.detailsAdShow = 'N'
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'advertShow')) {
        obj.data.advertShow = 'N'
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'chatRoomShow')) {
        obj.data.chatRoomShow = 'N'
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'recommendAdShow')) {
        obj.data.recommendAdShow = 'N'
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'recommendShow')) {
        obj.data.recommendShow = 'N'
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'theSameCityShow')) {
        obj.data.theSameCityShow = 'N'
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'guideShow')) {
        obj.data.guideShow = 'N'
      }
    }
  }
  if (/10010.com\/clientMyPage\/v1\/api\/aggregateFloorConfig/.test(url)) {
    // 移除“我的”页面的“合计配置”
    if (obj.data && typeof obj.data === 'object') {
      delete obj.data.aggregateFloorMore
      if (
        Object.prototype.hasOwnProperty.call(obj.data, 'aggregateFloorMore') &&
        obj.data.aggregateFloorMore &&
        typeof obj.data.aggregateFloorMore === 'object' &&
        Object.prototype.toString.call(obj.data.aggregateFloorMore) === '[object Object]'
      ) {
        obj.data.aggregateFloorMore.title = ''
        obj.data.aggregateFloorMore.titleUrl = ''
      }
      if (
        Object.prototype.hasOwnProperty.call(obj.data, 'browsingHistory') &&
        obj.data.browsingHistory &&
        typeof obj.data.browsingHistory === 'object' &&
        Object.prototype.toString.call(obj.data.browsingHistory) === '[object Object]'
      ) {
        obj.data.browsingHistory.iconJumpUrl = ''
        obj.data.browsingHistory.iconImg = ''
        obj.data.browsingHistory.configFlag = false
        obj.data.browsingHistory.redDotSwitch = false
      }
      if (
        Object.prototype.hasOwnProperty.call(obj.data, 'couponCollectionCenter') &&
        obj.data.couponCollectionCenter &&
        typeof obj.data.couponCollectionCenter === 'object' &&
        Object.prototype.toString.call(obj.data.couponCollectionCenter) === '[object Object]'
      ) {
        obj.data.couponCollectionCenter.iconJumpUrl = ''
        obj.data.couponCollectionCenter.iconImg = ''
        obj.data.couponCollectionCenter.configFlag = false
        obj.data.couponCollectionCenter.redDotSwitch = false
      }
      if (
        Object.prototype.hasOwnProperty.call(obj.data, 'myPacks') &&
        obj.data.myPacks &&
        typeof obj.data.myPacks === 'object' &&
        Object.prototype.toString.call(obj.data.myPacks) === '[object Object]'
      ) {
        obj.data.myPacks.iconJumpUrl = ''
        obj.data.myPacks.iconImg = ''
        obj.data.myPacks.configFlag = false
        obj.data.myPacks.redDotSwitch = false
      }
      if (
        Object.prototype.hasOwnProperty.call(obj.data, 'shoppingCart') &&
        obj.data.shoppingCart &&
        typeof obj.data.shoppingCart === 'object' &&
        Object.prototype.toString.call(obj.data.shoppingCart) === '[object Object]'
      ) {
        obj.data.shoppingCart.iconJumpUrl = ''
        obj.data.shoppingCart.iconImg = ''
        obj.data.shoppingCart.configFlag = false
        obj.data.shoppingCart.redDotSwitch = false
      }
    }
  }
  if (/10010.com\/edopinterface\/service\/getMenuAutoCheckConfig\/iphone_c@\d+\.\d+/.test(url)) {
    if (obj.response && typeof obj.response === 'object') {
      if (Object.prototype.hasOwnProperty.call(obj.response, 'body') && obj.response.body && typeof obj.response.body === 'object' && Object.prototype.toString.call(obj.response.body) === '[object Object]') {
        if (Object.prototype.hasOwnProperty.call(obj.response.body, 'configData') && obj.response.body.configData && typeof obj.response.body.configData === 'object' && Array.isArray(obj.response.body.configData)) {
          const blacklist = ['新人百元礼包', '影视', '小说', '联通祝福', '联通助理', '联通看家', '借钱', '饭票', 'PLUS会员', '福利活动-视频彩铃', '人人都是推荐官', '签到有礼', '领宽带', '直播LIVE', '小视频', '我的钱包']
          obj.response.body.configData.forEach((v) => {
            if (v && typeof v === 'object' && Object.prototype.toString.call(v) === '[object Object]') {
              if (blacklist.includes(v?.menuName)) {
                v.menuUrl = ''
              }
            }
          })
        }
      }
    }
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
