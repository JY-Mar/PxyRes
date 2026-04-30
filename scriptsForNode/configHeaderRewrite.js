/*
 * NAME            : configHeaderRewrite
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-04-30 16:44:15 +0800
 * DESC            : 更新配置文件时间
 */

const path = require('path')
const fs = require('fs')
const { checkFile, genHeaderItem, getRepo, formatDate, readAsLine } = require('./utils')

let filepath = process.argv[2]
const filetype = 'Config'

if (!checkFile(filepath)) {
  console.error(`文件不存在: ${filepath}`)
  process.exit(1)
}

filepath = filepath.replace(/\\/g, '/').replace(/\/+/, '/')

const extname = path.extname(filepath).substring(1)
const ruleExts = {
  Clash: ['yaml'],
  Loon: ['lcf', 'conf'],
}

if (!Array.from(new Set([...ruleExts.Clash, ...ruleExts.Loon])).includes(extname)) {
  console.error(`不支持的文件扩展名: ${extname}`)
  process.exit(1)
}

/**
 * 仓库名
 */
const repoName = getRepo().repoName

const matched = filepath.match(new RegExp(`\/${repoName}\/(.+)\/${filetype}\/`))
if (!matched) {
  console.error(`错误的 ${filetype} 文件路径: ${filepath}`)
  process.exit(1)
}
/**
 * Clash 还是 Loon
 */
let toolName = (matched[1] || '').toLowerCase().replace(/^./, (c) => c.toUpperCase())
if (!Object.keys(ruleExts).includes(toolName)) {
  console.error(`不支持的工具: ${toolName}`)
  process.exit(1)
}
if (!new RegExp(`\/${repoName}\/${toolName}\/${filetype}\/(.+)\\.(${ruleExts[toolName].join('|')})$`).test(filepath)) {
  console.error(`不支持的 ${filetype} 文件路径: ${filepath}`)
  process.exit(1)
}

const basename = path.basename(filepath)
const filename = path.basename(basename, `.${extname}`)
const lines = readAsLine(filepath)

if (/^#\s*(Clash|Loon)\s*.+/i.test(lines[0])) {
  lines.shift()
}
let ptr = 0
while (ptr < lines.length) {
  if (/^#\s*(NAME|UPDATED|UPDATER)\s*.+/.test(lines[ptr])) {
    lines.splice(ptr, 1)
  } else if (lines[ptr] === '') {
    break
  } else {
    ptr++
  }
}
lines.unshift(...[genHeaderItem('NAME', `${filetype} For ${toolName}`), genHeaderItem('AUTHOR', getRepo().ownerName), genHeaderItem('REPO', getRepo().repoUrl), genHeaderItem('UPDATED', formatDate())])
filecontent = lines.join('\r\n')

fs.writeFileSync(filepath, filecontent, 'utf8')
