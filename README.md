# PxyRes

configuration of proxy tools

## 项目结构

```text
├── .github/workflows/
│   └── run-jobs.yml           # GitHub Actions工作流
├── Clash/                     # Clash 配置
│   ├── Config/                # Clash 完整配置文件（无代理节点、代理组）.yaml
│   └── Rules/                 # Clash 远程规则文件 .yaml
├── Loon/                      # Loon 配置
│   ├── Config/                # Loon 完整配置文件（无代理节点、代理组）.lcf
│   ├── Plugins/               # Loon 插件文件目录 .plugin / .lpx
│   └── Rules/                 # Loon 远程规则文件 .lsr / .list
|── scriptsForNode/            # Node脚本
|── scriptsForPython/          # Python脚本
├── docs/                      # GitHub Pages输出目录
│   ├── index.html             # 主页面
目录下的 Clash 配置
│   │   ├── Config/            # 拷贝到doc目录下的 Clash 完整配置文件（无代理节点、代理组）.yaml
│   │   └── Rules/             # 拷贝到doc目录下的 Clash 远程规则文件 .yaml
│   └── Loon/                  # 拷贝到doc目录下的 Loon 配置
│       ├── Config/            # 拷贝到doc目录下的 Loon 完整配置文件（无代理节点、代理组）.lcf
│       └── Rules/             # 拷贝到doc目录下的 Loon 远程规则文件 .lsr
└── README.md
```

# 分流规则

## rule.kelee.one整理

[https://github.com/luestr/ShuntRules/blob/main/README.md](https://github.com/luestr/ShuntRules/blob/main/README.md)

## blackmatrix7规则

[https://github.com/blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script)
