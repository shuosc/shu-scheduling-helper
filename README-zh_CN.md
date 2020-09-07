[English](./README.md) | 简体中文

<p align="center">
  <a href="https://xk.shuosc.com/">
    <img width="300px" src="https://xk2.zkllab.com/img/readme-logo.svg" alt="SHU排课助手 Logo" />
  </a>
</p>

<p align="center">
  <a href="https://xk.shuosc.com/">https://xk.shuosc.com/</a>
</p>

------

- [简介](#简介)
- [开发](#开发)
- [致谢](#致谢)
- [贡献](#贡献)
- [许可证](#许可证)

## 简介

> 一个用来排课的网站。

**SHU排课助手**(OL)是一个帮助上海大学学生提前查看、预选和安排课程的网站，提供了课程查找和筛选、待选列表、可调节颜色的课表、快捷选课、导出、备份、还原和冲突解决等功能。

|          | 框架和库（主要）                                  |
| -------- | ------------------------------------------------------------ |
| **前端** | **[vue](https://github.com/vuejs/vue)**<br />[ant-design-vue](https://github.com/vueComponent/ant-design-vue) (用户界面)<br />[axios](https://github.com/axios/axios) (HTTP请求库)<br />[localforage](https://github.com/localForage/localForage) (数据持久化)<br />[pako](https://github.com/nodeca/pako) (压缩)<br />[vuex](https://github.com/vuejs/vuex) (状态管理)<br />... |
| **后端** | **[flask](https://github.com/pallets/flask)**<br />...       |

## 开发

### [API文档](./docs/api-zh_CN.md)

### 前端快速上手

```shell
$ git clone https://github.com/ZKLlab/shu-scheduling-helper-frontend.git
$ cd shu-scheduling-helper-frontend
$ yarn # 安装依赖
$ yarn serve # 侦听localhost:8080
```

### 生产环境构建

```shell
$ yarn build
```

### 目录结构

```
.
├── babel.config.js
├── public
│   └── ......
├── src
│   ├── apiConfig.js
│   ├── assets
│   │   └── ......
│   ├── mixins   # 不同版本共同组件的混入
│   │   └── ......
│   ├── pages
│   │   ├── index   # 电脑版页面及组件
│   │   │   ├── App.vue
│   │   │   ├── components
│   │   │   │   └── ......
│   │   │   └── main.js
│   │   ├── m   # 移动版页面及组件
│   │   │   ├── App.vue
│   │   │   ├── components
│   │   │   │   └── ......
│   │   │   └── main.js
│   │   ├── quick-inputting   # 快捷选课
│   │   │   ├── App.vue
│   │   │   └── main.js
│   │   └── redirect   # 负责主页的跳转
│   │       └── main.js
│   ├── plugins
│   │   └── ant-design-vue.js
│   ├── workers   # 运行者
│   │   └── ......
│   ├── storage.js   # 处理数据压缩与持久化
│   ├── store.js   # 数据处理的核心部分
│   └── utils.js   # 一些可复用的逻辑
└── vue.config.js
```

## 致谢

本项目受 [cosformula/CourseSchedulingHelper](https://github.com/cosformula/CourseSchedulingHelper) 启发，感谢作者 [@cosformula](https://github.com/cosformula) 提供的灵感。

## 贡献

如果你发现了任何关于SHU排课助手的问题，或有新功能建议，你可以[在Github上提issus](https://github.com/shuosc/shu-scheduling-helper/issues/new)，[使用“腾讯兔小巢”平台反馈问题](https://support.qq.com/products/120502)或[Pull Request (PR)](https://github.com/ZKLlab/shu-scheduling-helper-frontend/pulls)。

**如果喜欢，请给项目点一颗小星星！** 🌟 **谢谢！**

### 作者

[@ZKLlab](https://github.com/ZKLlab) - 上海大学计算机科学与技术技术专业大二在读，[SHUOSC](https://github.com/shuosc)成员。

## 许可证

GPL-3.0-or-later &copy; SHUOSC
