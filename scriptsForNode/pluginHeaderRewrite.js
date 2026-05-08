/*
 * NAME            : pluginHeaderRewrite
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-05-08 15:19:25 +0800
 * DESC            : 插件文件 头信息重写
 */

const path = require('path')
const fs = require('fs')
const { checkFile, genHeaderItem, getRepo, formatDate, readAsLine } = require('./utils')

let filepath = process.argv[2]
const filetype = 'Plugins'

if (!checkFile(filepath)) {
  console.error(`文件不存在: ${filepath}`)
  process.exit(1)
}

filepath = filepath.replace(/\\/g, '/').replace(/\/+/, '/')

const extname = path.extname(filepath).substring(1)
const ruleExts = {
  Clash: [],
  Loon: ['plugin', 'lpx']
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

let index = lines.findIndex((line) => line.startsWith('#!homepage'))
if (index > -1) {
  lines[index] = `#!homepage=${getRepo().repoUrl}`
}
index = lines.findIndex((line) => line.startsWith('#!date'))
if (index > -1) {
  lines[index] = `#!date=${formatDate(new Date())}`
}

filecontent = lines.join('\r\n')

fs.writeFileSync(filepath, filecontent, 'utf8')
