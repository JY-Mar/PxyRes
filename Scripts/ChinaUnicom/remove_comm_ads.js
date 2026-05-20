/*
 * NAME            : remove_comm_ads
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-20 11:04:57 +0800
 * DESC            : 移除广告
 */

const url = $request.url

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (obj.data && typeof obj.data === 'object') {
    if (/10010.com\/video_recommend\/content\/screenSwitch/.test(url)) {
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
    if (/10010.com\/clientMyPage\/v1\/api\/aggregateFloorConfig/.test(url)) {
      // 移除“我的”页面的“合计配置”
      delete obj.data.aggregateFloorMore
      if (Object.prototype.hasOwnProperty.call(obj.data, 'aggregateFloorMore') && obj.data.aggregateFloorMore && typeof obj.data.aggregateFloorMore === 'object' && Object.prototype.toString.call(obj.data.aggregateFloorMore) === '[object Object]') {
        obj.data.aggregateFloorMore.title = ''
        obj.data.aggregateFloorMore.titleUrl = ''
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'browsingHistory') && obj.data.browsingHistory && typeof obj.data.browsingHistory === 'object' && Object.prototype.toString.call(obj.data.browsingHistory) === '[object Object]') {
        obj.data.browsingHistory.iconJumpUrl = ''
        obj.data.browsingHistory.iconImg = ''
        obj.data.browsingHistory.configFlag = false
        obj.data.browsingHistory.redDotSwitch = false
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'couponCollectionCenter') && obj.data.couponCollectionCenter && typeof obj.data.couponCollectionCenter === 'object' && Object.prototype.toString.call(obj.data.couponCollectionCenter) === '[object Object]') {
        obj.data.couponCollectionCenter.iconJumpUrl = ''
        obj.data.couponCollectionCenter.iconImg = ''
        obj.data.couponCollectionCenter.configFlag = false
        obj.data.couponCollectionCenter.redDotSwitch = false
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'myPacks') && obj.data.myPacks && typeof obj.data.myPacks === 'object' && Object.prototype.toString.call(obj.data.myPacks) === '[object Object]') {
        obj.data.myPacks.iconJumpUrl = ''
        obj.data.myPacks.iconImg = ''
        obj.data.myPacks.configFlag = false
        obj.data.myPacks.redDotSwitch = false
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'shoppingCart') && obj.data.shoppingCart && typeof obj.data.shoppingCart === 'object' && Object.prototype.toString.call(obj.data.shoppingCart) === '[object Object]') {
        obj.data.shoppingCart.iconJumpUrl = ''
        obj.data.shoppingCart.iconImg = ''
        obj.data.shoppingCart.configFlag = false
        obj.data.shoppingCart.redDotSwitch = false
      }
    }
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
