/*
 * NAME            : remove_home_nav
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-20 12:00:38 +0800
 * DESC            : 移除首页无用导航项
 */

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (obj.datas && typeof obj.datas === 'object') {
    if (
      Object.prototype.hasOwnProperty.call(obj.datas, 'homeTopMenuItems') &&
      obj.datas.homeTopMenuItems &&
      typeof obj.datas.homeTopMenuItems === 'object' &&
      Array.isArray(obj.datas.homeTopMenuItems)
    ) {
      const blacklist = ['通通', '签到']
      const recursiveRemove = (val) => {
        const index =  obj.datas.homeTopMenuItems.findIndex((v) => v?.urlType === '1' && v?.menuName === val)
        if (index > -1) {
          obj.datas.homeTopMenuItems.splice(index, 1)
          recursiveRemove(val)
        }
      }
      blacklist.forEach((blackListItem) => {
        recursiveRemove(blackListItem)
      })
    }
    if (
      Object.prototype.hasOwnProperty.call(obj.datas, 'homeMenuItems') &&
      obj.datas.homeMenuItems &&
      typeof obj.datas.homeMenuItems === 'object' &&
      Array.isArray(obj.datas.homeMenuItems)
    ) {
      const blacklist = ['PLUS', '开发票']
      const recursiveRemove = (val) => {
        const index =  obj.datas.homeMenuItems.findIndex((v) => v?.sysCode === 'ST5' && v?.title === val)
        if (index > -1) {
          obj.datas.homeMenuItems.splice(index, 1)
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
