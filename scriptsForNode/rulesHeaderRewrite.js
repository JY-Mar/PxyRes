/*
 * NAME            : rulesHeaderRewrite
 * AUTHOR          : JY-Mar
 * REPO            : https://github.com/JY-Mar/PxyRes
 * UPDATER         : JY-Mar
 * UPDATED         : 2026-04-30 16:42:48 +0800
 * DESC            : 重写规则文件头信息
 */

const path = require('path')
const fs = require('fs')
const { checkFile, RULETYPE, genHeaderItem, getRepo, formatDate } = require('./utils')

let filepath = process.argv[2]
const filetype = 'Rules'

if (!checkFile(filepath)) {
  console.error(`文件不存在: ${filepath}`)
  process.exit(1)
}

filepath = filepath.replace(/\\/g, '/').replace(/\/+/, '/')

const extname = path.extname(filepath).substring(1)
const ruleExts = {
  Clash: ['yaml', 'list', 'txt'],
  Loon: ['lsr', 'list', 'txt']
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
let filecontent = fs.readFileSync(filepath, 'utf8')

// 1. 移除 文件名
const regexp_name = /(\s*#\s*NAME\s*:\s*)(.*)/g
if (regexp_name.test(filecontent)) {
  filecontent = filecontent.replace(regexp_name, '')
}

// 2. 移除 AUTHOR
const regexp_author = /(\s*#\s*AUTHOR\s*:\s*)(.*)/g
if (regexp_author.test(filecontent)) {
  filecontent = filecontent.replace(regexp_author, '')
}

// 3. 移除 REPO
const regexp_repo = /(\s*#\s*REPO\s*:\s*)(.*)/g
if (regexp_repo.test(filecontent)) {
  filecontent = filecontent.replace(regexp_repo, '')
}

// 4. 移除 UPDATED
const regexp_updated = /(\s*#\s*UPDATED\s*:\s*)(.*)/g
if (regexp_updated.test(filecontent)) {
  filecontent = filecontent.replace(regexp_updated, '')
}

// 5. 移除所有已有统计值
// 统计正则
const regexp = new RegExp(`\(# \(${RULETYPE.join('|')}\)\\s*:\\s*\)\\d+`, 'g')
if (regexp.test(filecontent)) {
  filecontent = filecontent.replace(regexp, '')
}

// 6. 重新插入基本信息
filecontent =
  [genHeaderItem('NAME', filename), genHeaderItem('AUTHOR', getRepo().ownerName), genHeaderItem('REPO', getRepo().repoUrl), genHeaderItem('UPDATED', formatDate())].join('\n') + '\n' + filecontent

// 移除最后一行文件头到第一行内容之间的空格行（保留一行）
const lines = filecontent.split(/\r?\n/)
let above = []
let insert = []
let below = []
const lastHeaderIndex = lines.findLastIndex((v) => /(# [a-zA-Z0-9-_]+\s*:\s*)\d+/.test(v))
const firstContentIndex = lines.findIndex((v, k) => {
  if (extname === 'yaml') {
    return /^payload:$/.test(v)
  } else if (extname === 'lsr' || extname === 'list') {
    return k > lastHeaderIndex && (/^\s*#\s*.+/.test(v) || new RegExp(`^\\s*\(${RULETYPE.join('|')}\),\.+`).test(v))
  }
})
if (lastHeaderIndex > -1 && firstContentIndex > -1 && lastHeaderIndex < firstContentIndex) {
  // 空格多于一行
  above = lines.slice(0, lastHeaderIndex + 1)
  below = lines.slice(firstContentIndex)
} else if (lastHeaderIndex <= -1 && firstContentIndex > -1) {
  above = []
  below = lines.slice(firstContentIndex)
} else {
  console.error(`${extname} line error`)
  process.exit(1)
}

// 生成新的统计数据
const insert_temp = []
RULETYPE.forEach((type) => {
  if (type !== RULETYPE.at(-1)) {
    const regexp = new RegExp(`^\(?!\\s*#\)\.*${type},`, 'gm')
    if (regexp.test(filecontent)) {
      insert_temp.push([type, (filecontent.match(regexp) || []).length])
    }
  }
})
insert = insert_temp.map((v) => {
  return genHeaderItem(v[0], v[1])
})
const insert_temp_1 = insert_temp.map((v) => v[1])
const insert_temp_sum = insert_temp_1.length > 0 ? insert_temp_1.reduce((a, b) => a + b) : 0
insert.push(`# ${RULETYPE.at(-1)}`.padEnd(18, ' ') + ': ' + insert_temp_sum)
insert.push('')

// 替换文件头里的数值
filecontent = [...above, ...insert, ...below].join('\r\n')

fs.writeFileSync(filepath, filecontent, 'utf8')
