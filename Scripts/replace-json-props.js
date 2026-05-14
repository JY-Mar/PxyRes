/*
 * NAME            : replace-json-props
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-14 11:05:48 +0800
 * DESC            : 替换请求体或响应体中的JSON指定属性的值
 */

// #region QuantumultX
// [rewrite_local]
// ^https?:\/\/vv\.video\.qq\.com\/getvinfo url script-path=https://jy-mar.github.io/PxyRes/Scripts/replace-json-props.js, requires-body=true, timeout=20, argument="http-request丨sppreviewtype>>->>0丨spsrt>>->>0", tag=移除视频片前广告

// [mitm]
// hostname = vv.video.qq.com
// #endregion

// #region Surge4 / Loon
// [Script]
// http-request ^https?:\/\/vv\.video\.qq\.com\/getvinfo script-path=https://jy-mar.github.io/PxyRes/Scripts/replace-json-props.js, requires-body=true, timeout=20, argument="sppreviewtype>>->>0丨spsrt>>->>0", tag=移除视频片前广告

// [MITM]
// hostname = vv.video.qq.com
// #endregion

// #region argument 说明
// 本质上就是利用JSON属性名和值进行替换的
// 注：只会修改请求体或响应体类型为可序列化JSON的属性
// 支持单层属性名：如argument=a>>->>test
// 支持多层属性名：如argument=a.b.c>>->>test
// 支持多参数，如：argument=属性名1>>->>替换值1丨属性名2>>->>替换值2
// 提示：只会替换存在的属性，不会创建新的属性

// 注：必须打开required-body=true，否则会报错
// Loon 必须加类型 http-request 或 http-response
// QuantumultX 在argument中必须加 http-request 或 http-response
// #endregion

const recursive = (obj, keyPath, value) => {
  const keys = Array.isArray(keyPath) ? keyPath : keyPath.split('.')
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]' || keys.length === 0) {
    return
  }
  const curKey = keys[0]
  if (keys.length > 1) {
    if (Object.prototype.hasOwnProperty.call(obj, curKey)) {
      recursive(obj[curKey], keys.slice(1), value)
    }
    return
  }
  if (Object.prototype.hasOwnProperty.call(obj, curKey)) {
    obj[curKey] = value
  }
}

let body
let bodyType = ''
if (typeof $argument === 'undefined' || $argument === undefined || $argument === null || $argument === '') {
  body = undefined
  console.log('[replace-json-props.js] requires $argument')
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
    bodyType = ''
    console.log('[replace-json-props.js] "$script.type" not specified')
  }
}
if (!!bodyType) {
  console.log('[replace-json-props.js] http-' + bodyType)
}

let obj
if (body) {
  try {
    obj = JSON.parse(body)
  } catch (error) {
    obj = null
    console.log('[replace-json-props.js] JSON.parse error: ' + error)
  }
} else {
  obj = null
}

if (obj) {
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
        recursive(obj, source, target)
      }
    }
  })
  // 将修改后的 Body 交还给系统，完成拦截修改
  $done({ body: JSON.stringify(obj) })
} else {
  console.log('[replace-json-props.js] "$request.body" Not Modify')
  $done({})
}
