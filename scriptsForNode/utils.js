const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process');

function checkFile(filepath) {
  try {
    fs.accessSync(filepath, fs.constants.F_OK)
  } catch (error) {
    console.error('File not found:', filepath)
    return false
  }
  const filepathStat = fs.statSync(filepath)
  if (!filepathStat.isFile()) {
    console.error('Not a file:', filepath)
    return false
  }
  return true
}

function readAsLine(filepath) {
  if (!checkFile(filepath)) {
    return []
  }
  return fs
    .readFileSync(filepath, 'utf8')
    .split('\n')
    .map((v) => v.replace(/\r/g, ''))
}

function padZero(num) {
  return num < 10 ? '0' + num : num
}

function formatDate(date = new Date(), formatter = 'YYYY-MM-DD HH:mm:ss ZZ') {
  const zone8date = new Date(
    new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  )
  const time = {
    year: zone8date.getFullYear(),
    month: zone8date.getMonth() + 1,
    day: zone8date.getDate(),
    hour: zone8date.getHours(),
    minute: zone8date.getMinutes(),
    second: zone8date.getSeconds(),
    timezone: 'GMT+8'
  }

  const matcher = [
    ['YYYY', 'year'],
    ['YY', 'year'],
    ['MM', 'month-full'],
    ['M', 'month'],
    ['DD', 'day-full'],
    ['D', 'day'],
    ['HH', 'hour-full'],
    ['H', 'hour'],
    ['mm', 'minute-full'],
    ['m', 'minute'],
    ['ss', 'second-full'],
    ['s', 'second'],
    ['ZZ', 'timezone'],
    ['Z', 'timezone']
  ]

  let result = String(formatter)

  matcher.forEach((matcherItem) => {
    const matcherKey = matcherItem[0]
    let matcherValue = matcherItem[1]
    if (result.indexOf(matcherKey) > -1) {
      if (matcherValue.endsWith('-full')) {
        matcherValue = matcherValue.replace('-full', '')
        result = result.replace(new RegExp(matcherKey, 'g'), padZero(time[matcherValue]))
      } else {
        result = result.replace(new RegExp(matcherKey, 'g'), time[matcherValue])
      }
    }
  })

  return result
}

function genHeaderItem(label, value) {
  return `# ${String(label ?? '')}`.padEnd(18, ' ') + ': ' + String(value ?? '')
}

function getRepo() {
  const result = {
    repoUrl: '',
    repoName: '',
    branch: '',
    ownerName: ''
  }
  try {
    const gitConfigPath = path.join(process.cwd(), '.git', 'config')
    const content = fs.readFileSync(gitConfigPath, 'utf8')

    const regex_branch = /\[branch\s+"([^"]+)"\]/
    const match_branch = content.match(regex_branch)
    result.branch = match_branch[1] || ''

    // 匹配 git@github.com:owner/repo.git 或 https://github.com/owner/repo.git
    const regex_url = /github\.com[:/]([^/]+)\/([^/.]+)(\.git)?/
    const match_url = content.match(regex_url)
    result.ownerName = match_url[1] || ''
    result.repoName = match_url[2] || ''
    // result.repoUrl = result.branch && result.ownerName && result.repoName ? `https://github.com/${result.ownerName}/${result.repoName}/tree/${result.branch}` : ''
    result.repoUrl = result.branch && result.ownerName && result.repoName ? `https://github.com/${result.ownerName}/${result.repoName}` : ''
  } catch (err) {
    console.error('getGitHubRepoName error', err)
  }
  return result
}

/**
 * 规则类型
 */
const RULETYPE = [
  // #region 域名规则 (Domain Rules)
  'DOMAIN', // 精确匹配域名
  'DOMAIN-SUFFIX', // 匹配域名后缀（所有子域名）
  'DOMAIN-KEYWORD', // 域名包含关键字
  'DOMAIN-SET', // 【Clash】匹配大量域名
  'DOMAIN-REGEX', // 【Clash】域名正则匹配
  // #endregion
  // #region IP 地址规则 (IP Rules)
  'IP-CIDR', // IPv4 段
  'IP-CIDR6', // IPv6 段
  'GEOIP', // 国家 / 地区 IP（CN、US、JP…）
  'SRC-IP-CIDR', // 来源 IPv4 内网 / 设备 IPv4 段
  'SRC-IP-CIDR6', // 【Clash】来源 IPv6 内网 / 设备 IPv6 段
  'IP-SET', // 【Clash】匹配大量 IP 段
  // #endregion
  // #region 端口与协议
  'DST-PORT', // 【Clash】目标端口
  'DEST-PORT', // 【Loon】目标端口，等价于'DST-PORT'
  'SRC-PORT', // 源端口
  'PROTOCOL', // 【Loon】协议（TCP/UDP）
  // #endregion
  // #region 客户端与应用识别 (Client Identification)
  'USER-AGENT', // 【Loon】匹配 UA
  'PROCESS-NAME', // 【Clash】进程名
  'PROCESS-PATH', // 【Clash】进程路径
  'PACKAGE-NAME', // 【Clash】应用包名
  // #endregion
  // #region URL 类（PATH/REGEX）
  'URL-REGEX', // 【Loon】URL 正则匹配
  // #endregion
  // #region HTTP 请求头（含 USER-AGENT）
  'HTTP-HEADER', // 【Loon】匹配 HTTP 请求头中的特定字段
  // #endregion
  // #region 规则集与高级
  'RULE-SET', // 【Clash】引用外部规则文件（.list/.txt）
  'SCRIPT', //  JavaScript 自定义规则
  'MATCH', // 【Clash】兜底
  'FINAL', // 【Loon】兜底
  // #endregion

  'TOTAL' // 仅用于统计
]

exports.checkFile = checkFile
exports.readAsLine = readAsLine
exports.formatDate = formatDate
exports.genHeaderItem = genHeaderItem
exports.getRepo = getRepo
exports.RULETYPE = RULETYPE
