/*
 * NAME            : remove_ads
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-07-22 10:27:10 +0800
 * DESC            : 移除广告
 */

const url = $request.url

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (/10010\.com\/video_recommend\/content\/screenSwitch/.test(url)) {
    if (obj?.data?.detailsAdShow) {
      obj.data.detailsAdShow = 'N'
    }
    if (obj?.data?.advertShow) {
      obj.data.advertShow = 'N'
    }
    if (obj?.data?.chatRoomShow) {
      obj.data.chatRoomShow = 'N'
    }
    if (obj?.data?.recommendAdShow) {
      obj.data.recommendAdShow = 'N'
    }
    if (obj?.data?.recommendShow) {
      obj.data.recommendShow = 'N'
    }
    if (obj?.data?.theSameCityShow) {
      obj.data.theSameCityShow = 'N'
    }
    if (obj?.data?.guideShow) {
      obj.data.guideShow = 'N'
    }
  } else if (/10010\.com\/clientMyPage\/v1\/api\/aggregateFloorConfig/.test(url)) {
    // 移除“我的”页面的“合计配置”
    if (obj?.data?.aggregateFloorMore) {
      obj.data.aggregateFloorMore = null
    }
    if (obj?.data?.browsingHistory) {
      obj.data.browsingHistory.iconJumpUrl = ''
      obj.data.browsingHistory.iconImg = ''
      obj.data.browsingHistory.configFlag = false
      obj.data.browsingHistory.redDotSwitch = false
    }
    if (obj?.data?.couponCollectionCenter) {
      obj.data.couponCollectionCenter.iconJumpUrl = ''
      obj.data.couponCollectionCenter.iconImg = ''
      obj.data.couponCollectionCenter.configFlag = false
      obj.data.couponCollectionCenter.redDotSwitch = false
    }
    if (obj?.data?.myPacks) {
      obj.data.myPacks.iconJumpUrl = ''
      obj.data.myPacks.iconImg = ''
      obj.data.myPacks.configFlag = false
      obj.data.myPacks.redDotSwitch = false
    }
    if (obj?.data?.shoppingCart) {
      obj.data.shoppingCart.iconJumpUrl = ''
      obj.data.shoppingCart.iconImg = ''
      obj.data.shoppingCart.configFlag = false
      obj.data.shoppingCart.redDotSwitch = false
    }
  } else if (/10010\.com\/edopinterface\/service\/getMenuAutoCheckConfig\/iphone_c@\d+\.\d+/.test(url)) {
    if (obj?.response?.body?.configData) {
      const blacklist = [
        '新人百元礼包',
        '影视',
        '小说',
        '联通祝福',
        '联通助理',
        '联通看家',
        '借钱',
        '饭票',
        'PLUS会员',
        '福利活动-视频彩铃',
        '人人都是推荐官',
        '人人都是体验官',
        '签到有礼',
        '领宽带',
        '直播LIVE',
        '小视频',
        '我的钱包'
      ]
      obj.response.body.configData = obj.response.body.configData.filter((v) => !blacklist.includes(v?.menuName))
    }
  } else if (/10010\.com\/clientIndex\/api\/v1\/index\/queryIndexCfig\/\d+\/\d+\?adCode=.*/.test(url)) {
    // 移除首页元素配置
    if (obj?.data?.indexHeadTab?.tabCfgArray) {
      // 移除头部 Tab
      const whitelist = ['首页']
      obj.data.indexHeadTab.tabCfgArray = obj.data.indexHeadTab.tabCfgArray.filter((v) => whitelist.includes(v?.title))
    }
    if (obj?.data?.indexSelectedTab?.tabCfgArray) {
      // 移除顶部 Tab
      const whitelist = ['推荐', '出境', '套餐']
      const whitelist_EN = ['jingxuan', 'chujing', 'taocan']
      obj.data.indexSelectedTab.tabCfgArray = obj.data.indexSelectedTab.tabCfgArray.filter((v) => whitelist.includes(v?.navName) || whitelist_EN.includes(v?.navCode))
    }
    // 移除签到相关信息
    if (obj?.data?.signImg) {
      obj.data.signImg = ''
    }
    if (obj?.data?.signUrl) {
      obj.data.signUrl = ''
    }
    // 移除引导页
    if (obj?.data?.guidPageOpenFlag) {
      obj.data.guidPageOpenFlag = false
    }
  } else if (/10010\.com\/clientIndex\/v1\/api\/navHome/.test(url)) {
    // 移除首页导航
    if (obj?.datas?.homeMenuItems) {
      // 移除首页菜单
      const blacklist = ['PLUS', '开发票']
      obj.datas.homeMenuItems = obj.datas.homeMenuItems.filter((v) => v?.sysCode === 'ST5' && !blacklist.includes(v?.title))
    }
    if (obj?.datas?.homeTopMenuItems) {
      // 移除首页顶部菜单
      const blacklist = ['通通', '签到']
      obj.datas.homeTopMenuItems = obj.datas.homeTopMenuItems.filter((v) => !blacklist.includes(v?.menuName))
    }
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
