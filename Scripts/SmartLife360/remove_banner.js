/*
 * NAME            : remove_banner
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-13 17:53:48 +0800
 * DESC            : 移除360智慧生活banner广告
 */

if ($response.body) {
  let obj = JSON.parse($response.body)
  // if (obj.data && typeof obj.data === 'object' && Object.prototype.hasOwnProperty.call(obj.data, 'is_show') && obj.data.is_show === 1) {
  //   obj.data.is_show = 0
  // }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}