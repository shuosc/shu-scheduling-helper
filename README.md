English | [简体中文](./README-zh_CN.md)

<p align="center">
  <a href="https://xk.shuosc.com/">
    <img width="300px" src="https://xk.shuosc.com/img/readme-logo.svg" alt="SHU排课助手 Logo" />
  </a>
</p>

<p align="center">
  <a href="https://xk.shuosc.com/">https://xk.shuosc.com/</a>
</p>

------

- [Introduction](#introduction)
  - [Features](#features)
- [Development](#development)
  - [API doc (中文)](#api-doc-中文)
  - [Frontend quick start](#frontend-quick-start)
  - [Build for production](#build-for-production)
  - [Directory structure](#directory-structure)
- [Credits](#credits)
- [Contributing](#contributing)
  - [Author](#author)
- [License](#license)

## Introduction

> A web-based timetabler helping SHUers filter and preselect courses easily.

This is a continuation of [SHU-scheduling-helper](https://github.com/ZKLlab/SHU-scheduling-helper) (a Chrome extension). Considering that the update method of the extension cannot adapt to [the new online courses selecting system of Shanghai University](http://xk.autoisp.shu.edu.cn:8084/) in a timely way, we decided to make this project online.

The shu-scheduling-helper project has a frontend part and a backend part. For safety reasons, the backend part is private, but its APIs are open.

### Features

- Courses looking up and filtering
- Reserved courses list
- Colorful timetable with editable random seed
- Quick inputting
- Exporting text, backup and restoring
- Automatic conflicts solving
- Support for fortinight courses

|              | Frameworks & Main Libraries                                  |
| ------------ | ------------------------------------------------------------ |
| **Frontend** | **[vue](https://github.com/vuejs/vue)**<br />[ant-design-vue](https://github.com/vueComponent/ant-design-vue) (UI)<br />[axios](https://github.com/axios/axios) (HTTP client)<br />[localforage](https://github.com/localForage/localForage) (Data persistence)<br />[pako](https://github.com/nodeca/pako) (Compression)<br />[vuex](https://github.com/vuejs/vuex) (State management)<br />... |
| **Backend**  | **[flask](https://github.com/pallets/flask)**<br />...       |

## Development

### [API doc (中文)](./docs/api-zh_CN.md)

### Frontend quick start

```shell
$ git clone https://github.com/shuosc/shu-scheduling-helper.git
$ cd shu-scheduling-helper
$ yarn # install
$ yarn serve # serve at localhost:8080
```

### Build for production

```shell
$ yarn build
```

### Directory structure

```
.
├── babel.config.js
├── public
│   └── ......
├── src
│   ├── apiConfig.js
│   ├── assets
│   │   └── ......
│   ├── mixins   # Mixins for common components
│   │   └── ......
│   ├── pages
│   │   ├── index   # Desktop version
│   │   │   ├── App.vue
│   │   │   ├── components
│   │   │   │   └── ......
│   │   │   └── main.js
│   │   ├── mobile   # Mobile version (same component structure as desktop)
│   │   │   ├── App.vue
│   │   │   ├── components
│   │   │   │   └── ......
│   │   │   └── main.js
│   │   ├── quick-inputting
│   │   │   ├── App.vue
│   │   │   └── main.js
│   │   └── redirect
│   │       └── main.js
│   ├── plugins
│   │   └── ant-design-vue.js
│   ├── workers   # Workers
│   │   └── ......
│   ├── storage.js   # Data persistence (compression)
│   ├── store.js   # Core part processing data
│   ├── utils
│   │   ├── AdjustTextSize.js   # Adjust text size
│   │   ├── CheckConflict.js    # Check course conflicts
│   │   ├── color.js            # Color processing
│   │   └── course.js           # Course processing
└── vue.config.js
```

## Credits

As a former user of [cosformula/CourseSchedulingHelper](https://github.com/cosformula/CourseSchedulingHelper), I would like to thank the author [@cosformula](https://github.com/cosformula) for the excellent website and the great inspiration for this project.

## Contributing

[Open an issue](https://github.com/shuosc/shu-scheduling-helper/issues/new), [feedback](https://support.qq.com/products/120502) or send me [PRs](https://github.com/shuosc/shu-scheduling-helper/pulls) when you find any problems or want to request new features.

**Please leave us a star if you like.** 🌟 **Thank you!**

### Author

[@ZKLlab](https://github.com/ZKLlab)

## License

GPL-3.0-or-later &copy; SHUOSC
