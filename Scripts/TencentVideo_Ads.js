/*
 * NAME            : TencentVideo_Ads
 * AUTHOR          : mieqq
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-08 16:52:10 +0800
 * DESC            : 引用地址：https://raw.githubusercontent.com/mieqq/mieqq/master/replace-body.js
 */
/*
用Loon的脚本实现Quantumult X的response-body和request-body重写类型

如Quantumult X的重写：
https://service.ilovepdf.com/v1/user url response-body false response-body true

可改写为Loon的脚本复写：
[Script]
http-response https://service.ilovepdf.com/v1/user requires-body=true, script-path = https://kelee.one/Resource/Script/CommonScript/replace-body.js, argument = false->true

argument=要匹配值=作为替换的值
支持正则：如argument=\w+->test
支持正则修饰符：如argument=/\w+/g->test
支持多参数，如：argument=匹配值1->替换值1&匹配值2->替换值2

支持改写响应体和请求体体[type=http-response或http-request]注意必须打开需要body[requires-body = true]

提示：
修改json格式的键值对可以这样：
argument=("key")\s?:\s?"(.+?)"->$1: "new_value"

s修饰符可以让.匹配换行符，如argument=/.+/s->hello

*/

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
  console.log('[TencentVideo_Ads] requires $argument')
} else {
  if (typeof $response !== 'undefined' && $response.body) {
    body = $response.body
    bodyType = 'response'
  } else if (typeof $request !== 'undefined' && $request.body) {
    body = $request.body
    bodyType = 'request'
  } else {
    body = undefined
    console.log('[TencentVideo_Ads] script type error')
  }
}
if (!!bodyType) {
  console.log('[TencentVideo_Ads] http-' + bodyType)
}

if (body) {
  // 用 '&' 分割多组替换规则
  $argument.split('&').forEach((item) => {
    // 用 '->' 分割“查找目标”和“替换内容”
    if (!!item && item.includes('->')) {
      let [source, target] = item.split('->')
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
  console.log('[TencentVideo_Ads] body Not Modify')
  $done({})
}
