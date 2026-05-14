/*
 * NAME            : remove_banner_ads
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-14 10:25:41 +0800
 * DESC            : 移除360智慧生活推广横幅广告
 */

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (Object.prototype.hasOwnProperty.call(obj, 'ad_conf') && typeof obj.ad_conf === 'object') {
    obj.ad_conf = {
      ...obj.ad_conf,
      iotAdShowTimes: 0,
      adShowTimes: 0
    }
  }
  if (Object.prototype.hasOwnProperty.call(obj, 'topBannerServiceConfig') && typeof obj.topBannerServiceConfig === 'object') {
    if (Object.prototype.hasOwnProperty.call(obj.topBannerServiceConfig, 'data') && typeof obj.topBannerServiceConfig.data === 'object') {
      obj.topBannerServiceConfig.data = []
    }
  }
  if (Object.prototype.hasOwnProperty.call(obj, 'get_new_device_activity') && typeof obj.get_new_device_activity === 'object') {
    if (Object.prototype.hasOwnProperty.call(obj.get_new_device_activity, 'on')) {
      obj.get_new_device_activity.on = '0'
    }
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
