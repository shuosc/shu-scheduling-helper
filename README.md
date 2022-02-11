# SHU 排课助手 (v3)

![Work In Progress](https://img.shields.io/badge/Work-In_Progress-yellow)

> ### 重构说明
>
> SHU 排课助手 (v3) 使用 TypeScript + React 重构，目标在于追求更好的软件结构已提高可维护性，并支持任意的重课展示、响应式布局、深色模式等功能。
>
> #### 目前进度：
>
> - [x] 深色模式
> - [x] 响应式布局
> - [x] 课程检索
> - [ ] 星标 & 选课
>   - [ ] 撤销 & 重做
> - [ ] 课表
>   - [ ] 上课时间解析器
>   - [ ] 时间冲突分析
>   - [ ] 重课置顶
> - [ ] 快捷选课
> - [ ] 导出
> - [ ] 备份与还原

## 简介

> 一个用来排课的网站。

**SHU排课助手** 是一个帮助上海大学学生提前查看、预选和安排课程的网站，提供了课程查找、筛选和星标(收藏)，可调节颜色的课表，快捷选课，导出，备份，还原和冲突解决等功能。

## 开发

### 前端快速上手

```shell
$ yarn # 安装依赖
$ yarn start # 侦听 localhost:3000
```

### 生产环境构建

```shell
$ yarn build
```

## 致谢

本项目受 [cosformula/CourseSchedulingHelper](https://github.com/cosformula/CourseSchedulingHelper)
启发，感谢作者 [@cosformula](https://github.com/cosformula) 提供的灵感。

### 作者

[@ZKLlab](https://github.com/ZKLlab)

## 贡献

如果你发现了任何关于SHU排课助手的问题，或有新功能建议，你可以 [在Github上提issus](https://github.com/shuosc/shu-scheduling-helper/issues/new)
，[使用“腾讯兔小巢”平台反馈问题](https://support.qq.com/products/120502)
或 [Pull Request (PR)](https://github.com/shuosc/shu-scheduling-helper/pulls) 。

## 许可证

GPL-3.0-or-later &copy; SHUOSC