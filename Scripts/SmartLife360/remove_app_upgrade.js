/*
 * NAME            : remove_app_upgrade
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-14 10:28:00 +0800
 * DESC            : 移除360智慧生活应用升级
 */

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (obj?.data?.result?.hasNew) {
    // 固定为0，不显示
    obj.data.result.hasNew = 0
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
