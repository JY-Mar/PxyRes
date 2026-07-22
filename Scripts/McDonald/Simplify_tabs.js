/*
 * NAME            : Simplify_tabs
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-15 10:07:23 +0800
 * DESC            : 精简Tab栏
 */

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (obj?.data?.tabBars) {
    obj.data.tabBars = obj.data.tabBars.filter((v) => v.nameEn !== 'My Gold' && v.name !== '麦金卡' && v.nameEn !== 'M-Mall' && v.name !== '麦麦商城')
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
