<p align="center">
    <img src="https://raw.githubusercontent.com/zhanxiaoge/usine/main/src/assets/logo.png" width="200" height="200"><br>
</p>
<h1 align="center">Usine</h1>
<p align="center">多页面多环境开发脚手架</p>
<br>

## 🚀 项目介绍
- 以目录划分项目，每个目录都可以是独立成型的小项目
- 抽离公用类库和样式，实现多个项目共用代码，提高复用性
- 生成的文件都有对应的ContentHash，线上旧项目不受影响
- 支持导入Vue、React等允许通过script标签引入的前端框架
- 支持导入各类前端工具库，比如axios、lodash，省心省事
- 内置微型模版引擎，提高使用原生JavaScript开发时的效率
- 特色自定义CSS单位插件，支持编写计算公式转换成对应单位

## 📖 目录介绍
```
|-- assets                      -> 公共资源目录 (图片文件小于8192KB, 在CSS中自动启用Base64转码)
|-- library                     -> 公共类库目录 (打包时会与页面代码合并输出)
|   |-- template                -> 公共模版目录
|-- pages                       -> 项目目录
|   |-- demo                    -> 项目名
|       |-- assets              -> 项目资源目录 (图片文件小于8192KB, 在CSS中自动启用Base64转码)
|       |-- library             -> 项目类库目录 (打包时会与页面代码合并输出)
|       |-- utils               -> 项目类库目录 (不参与打包, 用于大文件或可独立运行的第三方类库)
|       |-- index.art           -> 项目页面模版 (优先.art，其次.html，最后公共默认模版)
|       |-- index.js            -> 项目页面入口
|       |-- index.scss          -> 项目页面样式
|-- styles                      -> 公共样式目录
|-- utils                       -> 公共类库目录 (不参与打包, 用于大文件或可独立运行的第三方类库)
```

## 📦 安装、开发、打包
```bash
// 安装
npm install

// 参数说明
npm run start -ub(打包) -ui(内联资源) -unt(不压缩) -unp(不使用语法转换)
npm run gzip -unt(不压缩) -unp(不使用语法转换)

// 开发 - 单页面
npm run start 多级目录名 页面文件入口
// 举例
npm run start JavaScript HelloWorld index.js

// 开发 - 多页面
npm run start 多级目录名
// 举例
npm run start JavaScript HelloWorld

// 打包 - 单页面
npm run start 多级目录名 页面文件入口 -ub
// 举例
npm run start JavaScript HelloWorld index.js -ub

// 打包 - 多页面
npm run start 多级目录名 -ub
// 举例
npm run start JavaScript HelloWorld -ub

// 打包 - 独立类库 (输出大文件或可独立运行的类库)
npm run gzip 目录名 类库文件入口
// 举例
npm run start library storage.js
```

## 👀 项目配置(package.json)
```bash
// 浏览器兼容
"browserslist": [
    "Chrome >= 50",
    "Safari >= 9"
]
```
```bash
// 自定义单位转换
"unitList": [
    {
        "math": "$word / 100",
        "word": "rpx",
        "unit": "rem"
    },
    {
        "math": "$word / 100",
        "word": "repx",
        "unit": "em"
    },
    {
        "math": "100 / 750 * $word",
        "word": "vpx",
        "unit": "vw"
    }
]
```
```bash
// 不参与打包的UMD模块，设置后需要通过<script src="...">引入模块
"externalsConfig": {
    "template": "template",
    "jquery": "jQuery"
}
```
```bash
// 设置运行环境需要注入的配置数据，在项目中通过$env读取，publicHost字段必须存在
"envConfig": {
    "development": {
        "publicHost": "https://cdn/development/",
        ...配置数据
    },
    "test": {
        "publicHost": "https://cdn/test/",
        ...配置数据
    },
    "production": {
        "publicHost": "https://cdn/production/",
        ...配置数据
    }
}
```

## 🦄 有无计划出 Webpack5、Vite、Rollup 的版本？
有计划的，学无止境...

## 📄 License

MIT License © 2021 [ZhanXiaoGe](https://github.com/zhanxiaoge)
