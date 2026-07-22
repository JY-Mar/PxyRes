/*
 * NAME            : remove_banner_ads
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-07-22 10:33:54 +0800
 * DESC            : 移除360智慧生活推广横幅广告
 */

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (obj?.ad_conf) {
    obj.ad_conf.iotAdShowTimes = 0
    obj.ad_conf.adShowTimes = 0
  }
  if (obj?.topBannerServiceConfig?.data) {
    obj.topBannerServiceConfig.data = []
  }
  if (obj?.get_new_device_activity?.on) {
    obj.get_new_device_activity.on = '0'
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
