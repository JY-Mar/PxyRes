/*
 * NAME            : remove_assist
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-14 10:28:11 +0800
 * DESC            : 移除360智慧生活AI助手广告
 */

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (obj.data && typeof obj.data === 'object') {
    if (Object.prototype.hasOwnProperty.call(obj.data, 'is_show')) {
      // 固定为0，不显示
      obj.data.is_show = 0
    }
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
