/*
 * NAME            : replace-body
 * AUTHOR          : mieqq,JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-13 09:47:14 +0800
 * DESC            : 替换请求体或响应体
 */

// #region QuantumultX
// [rewrite_local]
// ^https?:\/\/vv\.video\.qq\.com\/getvinfo url script-path=https://jy-mar.github.io/PxyRes/Scripts/replace-body.js, requires-body=true, timeout=20, argument="http-request丨sppreviewtype=\d*>>->>sppreviewtype=0丨spsrt=\d*>>->>spsrt=0", tag=移除视频片前广告

// [mitm]
// hostname = vv.video.qq.com
// #endregion

// #region Surge4 / Loon
// [Script]
// http-request ^https?:\/\/vv\.video\.qq\.com\/getvinfo script-path=https://jy-mar.github.io/PxyRes/Scripts/replace-body.js, requires-body=true, timeout=20, argument="sppreviewtype=\d*>>->>sppreviewtype=0丨spsrt=\d*>>->>spsrt=0", tag=移除视频片前广告

// [MITM]
// hostname = vv.video.qq.com
// #endregion

// #region argument 说明
// 本质上就是利用正则表达式进行匹配和替换的
// 支持正则：如argument=\w+>>->>test
// 支持正则修饰符：如argument=/\w+/g>>->>test
// 支持多参数，如：argument=正则1>>->>替换值1丨正则2>>->>替换值2
// 提示：替换值支持 $1、$2 等占位符（与正则表达式匹配）

// 注：必须打开required-body=true，否则会报错
// Loon 必须加类型 http-request 或 http-response
// QuantumultX 在argument中必须加 http-request 或 http-response
// #endregion

function getRegexp(re_str) {
  let regParts = re_str.match(/^\/(.*?)\/([gims]*)$/)
  if (regParts) {
    return new RegExp(regParts[1], regParts[2])
  } else {
    return new RegExp(re_str)
  }
}

let body
let bodyType = ''
if (typeof $argument === 'undefined' || $argument === undefined || $argument === null || $argument === '') {
  body = undefined
  console.log('[replace-body.js] requires $argument')
} else {
  if (/(丨http-request)|(http-request丨)/.test($argument) && typeof $request !== 'undefined' && $request.body) {
    // Quantumult X 请求体重写
    body = $request.body
    bodyType = 'request'
  } else if (/(丨http-response)|(http-response丨)/.test($argument) && typeof $response !== 'undefined' && $response.body) {
    // Quantumult X 响应体重写
    body = $response.body
    bodyType = 'response'
  } else if (typeof $request !== 'undefined' && $request.body) {
    // Surge4 / Loon 请求体重写
    body = $request.body
    bodyType = 'request'
  } else if (typeof $response !== 'undefined' && $response.body) {
    // Surge4 / Loon 响应体重写
    body = $response.body
    bodyType = 'response'
  } else {
    body = undefined
    console.log('[replace-body.js] "$script.type" not specified')
  }
}
if (!!bodyType) {
  console.log('[replace-body.js] http-' + bodyType)
}

if (body) {
  // 中文字符 '丨'（gŭn）
  const separator = '丨'
  const indicator = '>>->>'
  const ignores = ['http-request', 'http-response']
  // 用 separator 分割多组替换规则
  $argument.split(separator).forEach((item) => {
    // 用 indicator 分割“查找目标”和“替换内容”
    if (!!item && !ignores.includes(item) && item.includes(indicator)) {
      let [source, target] = item.split(indicator)
      if (!!source) {
        // 调用上面的函数生成正则
        let re = getRegexp(source)
        // 执行替换
        body = body.replace(re, target)
      }
    }
  })
  // 将修改后的 Body 交还给系统，完成拦截修改
  $done({ body })
} else {
  console.log('[replace-body.js] "$request.body" Not Modify')
  $done({})
}
