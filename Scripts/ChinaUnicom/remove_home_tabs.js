/*
 * NAME            : remove_home_tabs
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-20 08:37:01 +0800
 * DESC            : 移除中国联通首页标签
 */

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (obj.data && typeof obj.data === 'object') {
    // 移除顶部标签
    if (
      Object.prototype.hasOwnProperty.call(obj.data, 'indexSelectedTab') &&
      obj.data.indexSelectedTab &&
      typeof obj.data.indexSelectedTab === 'object' &&
      Object.prototype.hasOwnProperty.call(obj.data.indexSelectedTab, 'tabCfgArray') &&
      Array.isArray(obj.data.indexSelectedTab.tabCfgArray)
    ) {
      const whitelist_CN = ['推荐', '出境', '套餐']
      const whitelist_EN = ['jingxuan', 'chujing', 'taocan']
      obj.data.indexSelectedTab.tabCfgArray = obj.data.indexSelectedTab.tabCfgArray.filter((v) => whitelist_CN.includes(v?.navName) || whitelist_EN.includes(v?.navCode))
    }
    // 移除签到相关信息
    if (Object.prototype.hasOwnProperty.call(obj.data, 'signImg')) {
      obj.data.signImg = ''
    }
    if (Object.prototype.hasOwnProperty.call(obj.data, 'signUrl')) {
      obj.data.signUrl = ''
    }
    // 移除引导页
    if (Object.prototype.hasOwnProperty.call(obj.data, 'guidPageOpenFlag')) {
      obj.data.guidPageOpenFlag = false
    }
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
