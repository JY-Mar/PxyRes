/*
 * NAME            : RichmediaAds
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-08 19:43:11 +0800
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

if ($response.body) {
  let obj
  let isError = false
  try {
    obj = JSON.parse($response.body)
    if (has(obj, 'rich_media_info')) {
      if (!obj.rich_media_info) {
        obj.rich_media_info = []
      }
      const index = obj.rich_media_info.findIndex((v) => v.type === 'ad_frame_time')
      if (index > -1) {
        obj.rich_media_info[index].type = 'disabled_ad'
        if (has(obj.rich_media_info[index], 'data') && isObject(obj.rich_media_info[index].data)) {
          obj.rich_media_info[index].data.result = []
        }
      } else {
        $done({ body: JSON.stringify(obj) })
      }
    } else {
      $done({ body: JSON.stringify(obj) })
    }
  } catch (error) {
    console.log('[TencentVideo_Ads] RichmediaAds: $response.body JSON.parse error', error)
    isError = true
    $done({})
  }
} else {
  $done({})
}
