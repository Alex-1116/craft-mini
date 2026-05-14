# uni-basic-app

#### 介绍
{**uniapp快速开发基础框架，兼容APP MINI H5**}

#### 架构
基于uniapp & vue3 + vuex + ts + sass

#### 写在前面

1.  关于本地运行H5 访问本地ip请求服务端接口，需要使用vite.config.js proxy做代理转发，或者，在manifest.json中做H5服务代理转发，否则可能会抛跨域
2.  ps：作者虽然会有跨域的情况，是因为开了vpn，如果不开vpn，也不会跨域
3.  H5运行如果是连接外网，比如正式的环境，如果在nginx做了代理，则不需要 vite.config.js
4.  直接运行到小程序，小程序内置浏览器应该做了处理，所以无论是访问本地还是外网都不需要vite.config.js配置代理
5.  -------------------------------------------cut-off-------------------------------------------
6.  关于store改为使用pinia做全局数据存储，数据持久化 需要安装 pinia-plugin-persistedstate 依赖插件
7.  环境准备：
8.  node v20.16.0
9.  pnpm v9.10.0
10.  此环境时下载的数据持久化插件版本v4.0.1 运行倒小程序会报错 destr deep-pick-omit 缺少这两个依赖支持，安装即可
11. 亲测 pinia-plugin-persistedstate v3.2.1 版本 不会出现上述第10点错误
12. 

#### 安装教程

1.  hbuilderx [https://www.dcloud.io/hbuilderx.html](https://www.dcloud.io)
2.  hbuilderx 目前支持 4.15.2024050802，向下兼容未知
3.  iconfont库[https://www.iconfont.cn/collections/detail?spm=a313x.collections_index.i1.d9df05512.7cf73a81I1QNvo&cid=48978](https://www.iconfont.cn)

#### 使用说明

1.  自定义主题 `theme.scss` 需要在 `uni.scss` 中引入 `@import '@/static/styles/theme.scss';`
2.  下载后 如需运行在小程序使用，请在manifest.json中填写小程序的appid;
3.  xxxx
4.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 目录

```text
├── components        # 可复用业务组件
├── pages             # 页面与分包
│   ├── auth
│   ├── home
│   ├── tabbar
│   └── tools
├── platforms         # 平台专属页面
├── services          # API、请求、上传与加密等基础设施
│   ├── api
│   ├── crypto
│   └── http
├── shared            # 通用 composables / utils / config / constants
├── static            # 静态资源
├── store             # 全局状态
├── types             # 全局类型声明
├── uni_modules       # uni 插件市场模块
├── _legacy           # 历史备份代码，默认不参与业务开发
├── App.vue
├── main.js
├── manifest.json
├── pages.json
└── uni.scss
```

#### 相关问题描述

```

1. vue3 不再支持过滤器 filter
2. h5 目前只能识别 main.js .js结尾的入口文件（20240520）
3. 关于微信小程序，官方为保护用户隐私，不允许直接进行授权登录，需要用户先体验后，才可以进行登录，针对此情形，提供两点解决方案。
	【1、如需直接进度登录页，即针对企业型小程序，需在登录页添加 员工内部使用等相关描述，2、用户可正常浏览小程序，当用户执行相关操作后即可触发登录鉴权】
4. 使用component 渲染一个“元组件”为动态组件。依 is 的值，来决定哪个组件被渲染。【APP、H5支持 MINI暂不支持（20240531）】
5. 使用jsx、tsx语法【APP、H5支持 MINI暂不支持（20240531）】
6. 关于微信分享转发功能，需要现在微信后台完成微信认证，如不进行微信认证，onShareAppMessage api将无法进行自定义title image
7. vue3版本 关于引用uni_modules下组件，如果发现控制台报错，请重新运行小程序

```
