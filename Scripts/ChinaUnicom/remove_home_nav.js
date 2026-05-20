/*
 * NAME            : remove_home_nav
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-20 10:26:27 +0800
 * DESC            : 移除首页无用导航项
 */

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (obj.data && typeof obj.data === 'object') {
    if (
      Object.prototype.hasOwnProperty.call(obj.data, 'homeTopMenuItems') &&
      obj.data.homeTopMenuItems &&
      typeof obj.data.homeTopMenuItems === 'object' &&
      Array.isArray(obj.data.homeTopMenuItems)
    ) {
      const blacklist = ['通通', '签到']
      obj.data.homeTopMenuItems.forEach((v) => {
        if (v && typeof v === 'object' && Object.prototype.toString.call(v) === '[object Object]') {
          if (v?.urlType === '1' && blacklist.includes(v?.menuName)) {
            v = null
          }
        }
      })
      obj.data.homeTopMenuItems = obj.data.homeTopMenuItems.filter((v) => !!v)
    }
    if (
      Object.prototype.hasOwnProperty.call(obj.data, 'homeMenuItems') &&
      obj.data.homeMenuItems &&
      typeof obj.data.homeMenuItems === 'object' &&
      Array.isArray(obj.data.homeMenuItems)
    ) {
      const blacklist = ['PLUS', '开发票']
      obj.data.homeMenuItems.forEach((v) => {
        if (v && typeof v === 'object' && Object.prototype.toString.call(v) === '[object Object]') {
          if (v?.sysCode === 'ST5' && blacklist.includes(v?.title)) {
            v = null
          }
        }
      })
      obj.data.homeMenuItems = obj.data.homeMenuItems.filter((v) => !!v)
    }
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
