/*
 * NAME            : RichmediaAds
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-09 14:31:01 +0800
 * DESC            : 移除富媒体广告
 */

// #region Surge4 / Loon
// [Script]
// http-response ^https?:\/\/richmedia\.video\.qq\.com\/get_rich_media_info script-path=https://jy-mar.github.io/PxyRes/Scripts/TencentVideo/RichmediaAds.js, requires-body=true, timeout=20, tag=移除富媒体广告

// [MITM]
// hostname = richmedia.video.qq.com
// #endregion

function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
}
function isObject(obj) {
  return !!obj && typeof obj === 'object'
}
function isArray(obj) {
  return isObject(obj) && obj instanceof Array
}

try {
  let obj = JSON.parse($response.body)
  if (obj.rich_media_info && isArray(obj.rich_media_info)) {
    obj.rich_media_info.forEach((v) => {
      if (v.type && v.type === 'ad_frame_time') {
        v.type = 'disabled_ad'
      }
      if (v.data && isObject(v.data) && v.data.result) {
        v.data.result = []
      }
    })
  }
  $done({ body: JSON.stringify(obj) })
} catch (error) {
  console.log('[TencentVideo_Ads] RichmediaAds: $response.body error', error)
  $done({})
}
