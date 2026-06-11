/*
 * NAME            : remove_ads
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-06-11 15:31:36 +0800
 * DESC            : 移除广告
 */

const url = $request.url

if ($response.body) {
  let obj = JSON.parse($response.body)
  if (/m5\.amap\.com\/ws\/c3frontend\/af-ai-search\/search/.test(url)) {
    if (obj.data && typeof obj.data === 'object') {
      if (Object.prototype.hasOwnProperty.call(obj.data, 'modules') && typeof obj.data.modules === 'object') {
        if (Object.prototype.hasOwnProperty.call(obj.data.modules, 'quickLink') && typeof obj.data.modules.quickLink === 'object') {
          if (Object.prototype.hasOwnProperty.call(obj.data.modules.quickLink, 'data') && typeof obj.data.modules.quickLink.data === 'object') {
            obj.data.modules.quickLink.data.list = []
          }
        }
      }
      if (Object.prototype.hasOwnProperty.call(obj.data, 'rankEntry') && typeof obj.data.rankEntry === 'object') {
        obj.data.rankEntry.data = []
      }
    }
  }
  if (/m5\.amap\.com\/ws\/shield\/frogserver\/aocs\/updatable/.test(url)) {
    if (obj.data && typeof obj.data === 'object') {
      const ps = [
        'adPerfSwitch',
        'adVenueConfig',
        'adImEntryConfig',
        'adStatementConfig',
        'aeroplane_tab',
        'airticket_service_switch',
        'bindTaobao',
        'calendar_hotel',
        'enable_watermark',
        'EndNaviC3AdCard',
        'footprint',
        'Footprint_hightlight_moment',
        'hitch_taxi',
        'home_message_guide',
        'hotcity',
        'hotel_portal_shading',
        'hotsaleConfig',
        'im',
        'map_weather_switch',
        'message_tab',
        'miniapp',
        'orderlistV1025',
        'order_list',
        'order_refund_page_switch',
        'search_service_adcode',
        'smallbiz_orderlist_tab',
        'small_biz_fun',
        'small_biz_new_pay_page_switch',
        'splashscreen',
        'splashview_config',
        'SplashScreenControl',
        'sportsHealthConfig',
        'sportsGroupConfig',
        'stepCounterSupportBrand',
        'taxi',
        'taxi_activity',
        'taxi_entrance',
        'taxi_pay_method',
        'trade_portal_config',
        'water_brand_video',
        'weather_restrict_config'
      ]
      ps.forEach((p) => {
        if (Object.prototype.hasOwnProperty.call(obj.data, p) && typeof obj.data[p] === 'object') {
          obj.data[p].status = 1
          obj.data[p].version = ''
          obj.data[p].value = ''
        }
      })
    }
  }
  $done({ body: JSON.stringify(obj) })
} else {
  $done({})
}
