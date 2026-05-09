/*
 * NAME            : WujiAds
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-09 08:44:48 +0800
 * DESC            : 移除无极广告
 */

// #region Surge4 / Loon
// [Script]
// http-response ^https?:\/\/cache\.wuji\.qq\.com\/x\/api\/wuji_cache\/object script-path=https://jy-mar.github.io/PxyRes/Scripts/TencentVideo/WujiAds.js, requires-body=true, timeout=20, tag=移除无极广告

// [MITM]
// hostname = cache.wuji.qq.com
// #endregion

function isObject(obj) {
  return !!obj && typeof obj === 'object'
}
function isArray(obj) {
  return isObject(obj) && obj instanceof Array
}

try {
  let obj = JSON.parse($response.body)
  if (obj.data && isArray(obj.data)) {
    // 定义需要屏蔽的黑名单关键词
    const blacklist = ['广告', '电商', '游戏', '拉动', '促销', '推广']

    obj.data = obj.data.filter((item) => {
      // 1. 根据名称过滤
      let isAd = blacklist.some((keyword) => item.name.includes(keyword))

      // 2. 根据举报信息(report)中的内容进一步判定
      if (!isAd && item.report) {
        if (item.report.includes('promotion') || item.report.includes('game')) {
          isAd = true
        }
      }

      if (isAd) {
        console.log('[TencentVideo_Ads] WujiAds: removed component ' + item.name)
        return false
      }
      return true
    })

    $done({ body: JSON.stringify(obj) })
  } else {
    $done({})
  }
} catch (e) {
  console.log('[TencentVideo_Ads] WujiAds: javascript error ' + e)
  $done({})
}
