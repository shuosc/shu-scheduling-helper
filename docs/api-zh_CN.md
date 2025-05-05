# API不完全文档

此文档包括 [**后端接口**](#后端接口) 文档和 [**Vuex Store**](#vuex-store) 文档

## 后端接口

声明：此后端接口仅为本服务提供，禁止用于其他用途。

### API 1

#### URL

```
GET https://xk.shuosc.com/api/courses/info
```

#### 返回结果示例：

```json
{
  "backend": "http://xk.autoisp.shu.edu.cn:8084/", 
  "hash": "ec17f6e2", 
  "trimester": "2019-2020\u5b66\u5e74\u6625\u5b63\u5b66\u671f", 
  "url": "https://xk.shuosc.com/api/courses/ec17f6e2.json"
}
```

#### 返回字段说明

| 返回值字段 | 字段类型 | 字段说明                   |
| ---------- | -------- | -------------------------- |
| backend    | `String` | 选课后端地址，不用解释     |
| hash       | `String` | 课程列表的哈希值           |
| trimester  | `String` | 学期名称                   |
| url        | `String` | **废弃** 获取课程列表的URL |

### API 2

#### URL

```
GET https://xk.shuosc.com/api/courses/{hash}.json
```

#### <span id="api-2-example">返回结果示例</span>

```json
[
  {
    "campus": "\u5b9d\u5c71",
    "class_time": "\u4e0011-13",
    "course_id": "00000000",
    "course_name": "\u6d3b\u52a8\u8bfe",
    "credit": "0",
    "teacher_id": "1001",
    "teacher_name": "\u8f85\u5bfc\u5458"
  },
  ...
]
```

#### 返回字段说明

| 返回值字段   | 字段类型 | 字段说明             |
| ------------ | -------- | -------------------- |
| campus       | `String` | 校区：宝山/嘉定/延长 |
| class_time   | `String` | 上课时间             |
| course_id    | `String` | 课程号               |
| course_name  | `String` | 课程名称             |
| credit       | `String` | 学分                 |
| teacher_id   | `String` | 教师号               |
| teacher_name | `String` | 教师姓名             |

### API 3

#### URL

```
GET https://xk.shuosc.com/api/courses/extra
```

#### 返回结果示例

```json
{
  "data": {
    "00000000-1001": {
      "capacity": "1500",
      "limitations": [],
      "number": "819",
      "venue": "\u53e6\u884c\u901a\u77e5"
    },
    "00853002-3691": {
      "capacity": "0",
      "limitations": [
        "\u7981\u6b62\u9009\u8bfe",
        "\u9650\u5236\u4eba\u6570"
      ],
      "number": "0",
      "venue": "\u4e0d\u5f00"
    },
    ...
  },
  "hash": "b1beb3e5",
  "update_time": 1583158511502
}
```

#### 返回字段说明

| 返回值字段  | 字段类型 | 字段说明                   |
| ----------- | -------- | -------------------------- |
| data        | `Object` | 校区：宝山/嘉定/延长       |
| hash        | `String` | 附加课程信息对应的课程hash |
| update_time | `Number` | 最有一次更新的时间戳       |
| capacity    | `String` | 课程容量                   |
| limitations | `Array`  | 选课限制                   |
| number      | `String` | 课程人数                   |
| venue       | `String` | 上课地点                   |

## Vuex Store

[Vuex中文文档](https://vuex.vuejs.org/zh/)

`store.js`是处理用户数据的核心，组件读取State和Getter，通过Mutation和Action与数据交互。

### 名词解释

#### 课程列表的行

有以下形式的`Object`，和后端接口返回的一致，有时部分属性可省略。

```javascript
{
  campus: '宝山',
  class_time: '一11-13',
  course_id: '00000000',
  course_name: '活动课',
  credit: '0',
  teacher_id: '1001',
  teacher_name: '辅导员',
}
```

#### 序列化格式数据

有以下形式的`String`，格式为`${课程号}[+-]${教师号},${课程号}[+-]${教师号},...`，分隔课程号和教师号的分隔符为`+`表示已选，`-`表示未选，多个`${课程号}[+-]${教师号}`之间用`,`连接。

```
00000000+1002,00000000-1001
```

**变种：**跨浏览器/跨时间反序列化数据所需，前面加了`${课程列表的哈希值}:`。

```
ec17f6e2:00000000+1002,00000000-1001
```

### 目录

- [State](#state)
- [Getters](#getters)
- [Mutations](#mutations)
- [Actions](#actions)

### State

| 状态名                                                  | 状态类型                          | 默认值  | 说明                                           | 持久化 |
| ------------------------------------------------------- | --------------------------------- | ------- | ---------------------------------------------- | ------ |
| loaded                                                  | `Boolean`                         | `false` | 全局已载入Flag                                 |        |
| <span id="state-allclasses">allClasses</span>           | `Array` [说明](#allclasses)       | `[]`    | 所有课程列表，[API 2](#api-2) 返回             | ✅      |
| <span id="state-allcoursesmap">allCoursesMap</span>     | `Object` [示例](#allcoursesmap)   | `{}`    | 所有课程的键值对，以`${课程号}`为键            |        |
| <span id="state-allclassesmap">allClassesMap</span>     | `Object` [示例](#allclassesmap)   | `{}`    | 所有课程的键值对，以`${课程号}-${教师号}`为键  |        |
| allClassesHash                                          | `String?`                         | `null`  | 所有课程列表的哈希，[API 1](#api-1) 返回       | ✅      |
| <span id="state-allclassesextra">allClassesExtra</span> | `Object` [示例](#allclassesextra) | `{}`    | 课程扩展数据，[API 3](#api-3) 返回             | ✅      |
| allClassesExtraUpdateTime                               | `Number?`                         | `null`  | 课程扩展数据的更新时间戳，[API 3](#api-3) 返回 | ✅      |
| <span id="state-reservedclasses">reservedClasses</span> | `Object` [示例](#reservedclasses) | `{}`    | 待选课程的键值对，以`${课程号}`为键            | ✅      |
| <span id="state-selectedclasses">selectedClasses</span> | `Object` [示例](#selectedclasses) | `{}`    | 已选课程的键值对，以`${课程号}`为键            | ✅      |
| trimester                                               | `String?`                         | `null`  | 当前学期，[API 1](#api-1) 返回                 | ✅      |
| backend                                                 | `String?`                         | `null`  | 当前学期的选课系统后端，[API 1](#api-1) 返回   | ✅      |
| openedCourseId                                          | `String?`                         | `null`  | 待选列表展开课程的课程号                       |        |
| hoverCourseId                                           | `String?`                         | `null`  | 课程表里鼠标悬浮课程的课程号                   |        |
| previewClass                                            | `String?`                         | `null`  | 预览课程的课程号                               |        |
| <span id="state-previewclassconflicts">previewClassConflicts</span>                                   | `Object`                          | `{}` [示例](#previewclassconflicts)   | 预览课程的课程号                               |        |
| <span id="state-history">history</span>                 | `Array` [示例](#history)          | `[]`    | 历史记录                                       |        |
| historyPos                                              | `Number`                          | `0`     | 新历史记录将要处在的位置                       |        |
| historyHold                                             | `Boolean`                         | `false` | 为`true`时暂停历史记录写入                     |        |

#### 状态类型示例

##### [allClasses](#state-allclasses)

同 [API 2的返回值](#api-2-example)，服务器返回的数据使用下划线命名法。

##### [allCoursesMap](#state-allcoursesmap)

```javascript
{
  '00000000': {
    campus: '宝山',
    class_time: '一11-13',
    course_id: '00000000',
    course_name: '活动课',
    credit: '0',
    teacher_id: '1001',
    teacher_name: '辅导员',
  },
}
```

##### [allClassesMap](#state-allclassesmap)

```javascript
{
  '00000000-1001': {
    campus: '宝山',
    class_time: '一11-13',
    course_id: '00000000',
    course_name: '活动课',
    credit: '0',
    teacher_id: '1001',
    teacher_name: '辅导员',
  },
}
```

##### [allClassesExtra](#state-allclassesextra)

```javascript
{
  '00000000-1001': {
    capacity: '1000',
    limitations: [],
    number: '819',
    venue: '另行通知',
  },
}
```

##### [reservedClasses](#state-reservedclasses)

```javascript
{
  "00000000": {
    courseName: "活动课",
    credit: "0",
    classes: {
      "1001": {
        teacherName: "辅导员",
        classTime: "一11-13",
      },
    },
  },
}
```

##### [selectedClasses](#state-selectedclasses)

```javascript
{
  "00000000": {
    teacherId: "1001",
    periods: [
      [10, 0, true, 3, "单", false], // [第(0-12)节课, 周(0-4), 是否为时段第一节, periods的长度, 单双周信息, 是否为实验课]
      [11, 0, false, 3, "单", false],
      [12, 0, false, 3, "单", false],
    ],
    themeColor: "#7B1FA2",
  },
}
```

##### [previewClassesConflicts](#state-previewclassesconflicts)

```javascript
{
  "00853621": true,
  "08305074": true,
}
```

##### [history](#state-history)

```javascript
[
  {
    data: "00000000+1001",
    msg: null, // 从storage更新后会有一条空历史状态
  },
  {
    data: "00000000+1002,00000000-1001",
    msg: "添加待选并选择 活动课 (辅导员)",
  },
]
```

### Getters

| 属性名                                                       | 属性类型                             | 说明                 |
| ------------------------------------------------------------ | ------------------------------------ | -------------------- |
| <span id="getters-scheduletablerows">scheduleTableRows</span> | `Array[]` [示例](#scheduletablerows) | 课程表格             |
| credits                                                      | `Number`                             | 学分数               |
| currentData                                                  | `String`                             | 当前序列化格式数据   |
| currentAffairsAndStatePoliciesSelected                       | `Boolean`                            | 是否已选“形势与政策” |

#### 属性类型示例

##### [scheduleTableRows](#getters-scheduletablerows)

```javascript
[
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
  [[], [], [], [], []],
  [
    [],
    [
      {
        courseId: "00000000",
        courseName: "活动课",
        teacherId: "1001",
        teacherName: "辅导员",
        campus: "宝山",
        first: true,
        span: 3,
        color: "#7B1FA2",
        isPreview: false,
        fortnight: "单周",
        lab: false,
        clipPathMode: "top-left"
      },
      {
        courseId: "11111111",
        courseName: "高等数学",
        teacherId: "2001",
        teacherName: "张教授",
        campus: "宝山",
        first: true,
        span: 3,
        color: "#2196F3",
        isPreview: false,
        fortnight: "双周",
        lab: false,
        clipPathMode: "bottom-right"
      }
    ],
    [],
    [],
    []
  ],
  [[], [], [], [], []],
  [[], [], [], [], []]
]
```

### Mutations

略

### Actions

Actions全部返回`Promise`。

#### updateFromStorage

> 从本地获取所有内容

##### 示例

```javascript
this.$store.dispatch('updateFromStorage');
```

##### Payload

无

##### 成功

- 无返回值

#### checkUpdateAllClasses

> 从远程检查课程数据更新

##### 示例

```javascript
this.$store.dispatch('checkUpdateAllClasses');
```

##### Payload

无

##### 成功

- 无返回值
- 返回[API 1](#api-1)的结果

```javascript
{
  backend: "http://xk.autoisp.shu.edu.cn:8084/",
  hash: "ec17f6e2",
  trimester: "2019-2020\u5b66\u5e74\u6625\u5b63\u5b66\u671f",
}
```

##### 失败

- 无返回值

#### updateAllClasses

> 从远程更新所有课程数据

##### 示例

```javascript
this.$store.dispatch('updateAllClasses', {
  backend: "http://xk.autoisp.shu.edu.cn:8084/",
  hash: "ec17f6e2",
  trimester: "2019-2020\u5b66\u5e74\u6625\u5b63\u5b66\u671f",
});
```

##### Payload

[checkUpdateAllClasses](#checkUpdateAllClasses)的非空返回值

##### 成功

- 返回 **<span id="change-list">变更列表</span>**

```javascript
[
  {
    type: "delete", // delete: 已选课程在新的全部课程列表中被移除
    campus: '宝山',
    class_time: '一11-13',
    course_id: '00000000',
    course_name: '活动课',
    credit: '0',
    teacher_id: '1001',
    teacher_name: '辅导员',
  },
  {
    type: "delete-silent", // delete-silent: 已待选未选课程在新的全部课程列表中被移除
    campus: '宝山',
    class_time: '二11-13',
    course_id: '00000000',
    course_name: '活动课',
    credit: '0',
    teacher_id: '1002',
    teacher_name: '辅导员',
  },
  {
    type: "conflicted", // conflicted: 已选课程时间变动，与其他已选课程冲突了
    campus: '宝山',
    class_time: '三11-13',
    course_id: '00000000',
    course_name: '活动课',
    credit: '0',
    teacher_id: '1003',
    teacher_name: '辅导员',
  },
]
```

##### 失败

- 无返回值

#### updateAllClassesExtra

> 从远程更新课程扩展数据

##### 示例

```javascript
this.$store.dispatch('updateAllClassesExtra');
```

##### Payload

无

##### 成功

- 无返回值
- 返回新的HASH值（远程HASH与当前不匹配时）

##### 失败

- 无返回值

#### setColorSeed

> 设置色彩随机种子

##### 示例

```javascript
this.$store.dispatch('setColorSeed', 2);
```

##### Payload

随机种子，0 ~ 9,999,999,999整数

##### 成功

- 无返回值

#### reserveClass

> 添加待选课程

##### 示例

```javascript
this.$store.dispatch('reserveClass', {
  campus: '宝山',
  class_time: '一11-13',
  course_id: '00000000',
  course_name: '活动课',
  credit: '0',
  teacher_id: '1001',
  teacher_name: '辅导员',
});
```

##### Payload

课程列表的行

##### 成功

- 无返回值

#### reserveClassThenSelect

> 添加待选课程并选择之

##### 示例

```javascript
this.$store.dispatch('reserveClassThenSelect', {
  campus: '宝山',
  class_time: '一11-13',
  course_id: '00000000',
  course_name: '活动课',
  credit: '0',
  teacher_id: '1001',
  teacher_name: '辅导员',
});
```

##### Payload

课程列表的行

##### 成功

- 无返回值（不检查冲突）

#### removeReservedClass

> 移除待选课程

##### 示例

```javascript
this.$store.dispatch('removeReservedClass', {
  course_id: '00000000',
  teacher_id: '1001',
});
```

##### Payload

课程列表的行，只需`course_id`和`teacher_id`

##### 成功

- 无返回值

#### selectClass

> 选择课程

##### 示例

```javascript
this.$store.dispatch('selectClass', {
  course_id: '00000000',
  teacher_id: '1001',
});
```

##### Payload

课程列表的行，只需`course_id`和`teacher_id`

##### 成功

- 无返回值（不检查冲突）

#### unselectClass

> 取消选择课程

##### 示例

```javascript
this.$store.dispatch('unselectClass', {
  course_id: '00000000',
  teacher_id: '1001',
});
```

##### Payload

课程列表的行，只需`course_id`和`teacher_id`

##### 成功

- 无返回值

#### unselectClassesThenSelect

> 取消选择课程然后选择课程（解决冲突并选择）

##### 示例

```javascript
this.$store.dispatch('unselectClassesThenSelect', {
  unselect: [
    {course_id: '00814026'},
    {course_id: '01065034'},
  ],
  select: {
    course_id: '00000000',
    course_name: '活动课',
    teacher_id: '1001',
    teacher_name: '辅导员',
  },
});
```

##### Payload

| 属性名   | 值                                                           |
| -------- | ------------------------------------------------------------ |
| unselect | 课程列表的行，只需`course_id`                                |
| select   | 课程列表的行，需要`course_id`、`course_name`、`teacher_id`、`teacher_name` |

##### 成功

- 无返回值

#### clearAllUserData

> 清除所有用户数据

##### 示例

```javascript
this.$store.dispatch('clearAllUserData');
```

##### Payload

无

##### 成功

- 无返回值

#### updateFromDataString

> 以`XXXXXXXX+XXXX,XXXXXXXX-XXXX`格式的数据字符串更新数据

##### 示例

```javascript
this.$store.dispatch('updateFromDataString', '00000000+1002,00000000-1001');
```

##### Payload

`XXXXXXXX+XXXX,XXXXXXXX-XXXX`格式的数据字符串

##### 成功

- 无返回值

#### updateFromBackup

> 以`XXXXXXXX:XXXXXXXX+XXXX,XXXXXXXX-XXXX`格式的数据字符串更新数据

##### 示例

```javascript
this.$store.dispatch('updateFromDataString', 'ec17f6e2:00000000+1002,00000000-1001');
```

##### Payload

`XXXXXXXX:XXXXXXXX+XXXX,XXXXXXXX-XXXX`格式的数据字符串，开头8位为课程列表的哈希值

##### 成功

- 返回 [**变更列表**](#change-list)

##### 失败

- 无返回值

#### undo

> 撤销

##### 示例

```javascript
this.$store.dispatch('undo');
```

##### Payload

无

##### 成功

- 无返回值

#### redo

> 重做

##### 示例

```javascript
this.$store.dispatch('redo');
```

##### Payload

无

##### 成功

- 无返回值
