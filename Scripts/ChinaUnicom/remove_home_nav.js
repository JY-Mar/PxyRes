/*
 * NAME            : remove_home_nav
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-20 11:55:00 +0800
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
      const recursiveRemove = (val) => {
        const index =  obj.data.homeTopMenuItems.findIndex((v) => v?.urlType === '1' && v?.menuName === val)
        if (index > -1) {
          obj.data.homeTopMenuItems.splice(index, 1)
          recursiveRemove(val)
        }
      }
      blacklist.forEach((blackListItem) => {
        recursiveRemove(blackListItem)
      })
    }
    if (
      Object.prototype.hasOwnProperty.call(obj.data, 'homeMenuItems') &&
      obj.data.homeMenuItems &&
      typeof obj.data.homeMenuItems === 'object' &&
      Array.isArray(obj.data.homeMenuItems)
    ) {
      const blacklist = ['PLUS', '开发票']
      const recursiveRemove = (val) => {
        const index =  obj.data.homeMenuItems.findIndex((v) => v?.sysCode === 'ST5' && v?.title === val)
        if (index > -1) {
          obj.data.homeMenuItems.splice(index, 1)
          recursiveRemove(val)
        }
      }
      blacklist.forEach((blackListItem) => {
        recursiveRemove(blackListItem)
      })
    }
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
