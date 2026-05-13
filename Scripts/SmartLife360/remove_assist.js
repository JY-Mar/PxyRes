/*
 * NAME            : remove_assist
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-13 16:30:12 +0800
 * DESC            : 移除360智慧生活AI助手广告
 */

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (obj.data && typeof obj.data === 'object' && Object.prototype.hasOwnProperty.call(obj.data, 'is_show') && obj.data.is_show === 1) {
    obj.data.is_show = 0
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}