[![npm version](https://badge.fury.io/js/gettabledatasize.svg)](https://badge.fury.io/js/gettabledatasize)

## 介绍

`getTableDataSize` 用于获取表格数据每列所需的宽度。

渲染表格时，在某些情况下，我们需要给每列数据设置列宽，但是数据长度的不确定性导致有时候很难设置一个满意的列宽。`getTableDataSize` 通过在渲染用户使用的表格前先获取每列数据所需的真实宽度，拿到宽度我们就可以用这些宽度完美的设置用户使用的表格的列宽了。

## 安装

使用 `yarn` 或者 `npm`
```
yarn add gettabledatasize

npm install gettabledatasize
```

直接在页面上使用：

```html
<script src="https://unpkg.com/gettabledatasize@1.0.3/build/gettabledatasize.js"></script>
```

## 使用



```javascript
import { getTableDataSize } from 'gettabledatasize';

const columns = [
        { label: '姓名', field: 'name', frozen: true },
        { label: '年龄', field: 'age' },
        { label: '出生地', field: 'birthplace' },
    ];
const data = [
        { name: '纳撒尼尔·霍桑', age: 60, birthplace: '马萨诸塞州塞勒姆' },
        { name: '王小波', age: 45, birthplace: '北京' },
        { name: '加夫列尔·加西亚·马尔克斯', age: 87, birthplace: '哥伦比亚阿拉卡塔卡' },
    ];

const result = getTableDataSize(columns, data);

console.log(JSON.stringify(columns));
// [{"label":"姓名","field":"name","frozen":true,"width":183.703125,"_widthFromGTDS_":true},{"label":"年龄","field":"age","width":32,"_widthFromGTDS_":true},{"label":"出生地","field":"birthplace","width":144,"_widthFromGTDS_":true}]

console.log(JSON.stringify(result));
// {"totalWidth":359.703125,"unfrozenWidth":176,"frozenWidth":183.703125,"calculateColumnAmount":3,"notCalculateColumnAmount":0}
```



## 参数说明 getTableDataSize(columns, data, options?) 
参数的格式的设计，基本依照现在流行的表格的设计，大部分配置字段都可以配置别名。

### columns { Array }

必须，`columns` 为 `column` 配置对象数组，`column` 配置对象的可配置属性如下：


参数  |  说明  |  类型  |  是否必须  |  默认值  |
---- | ---- | ---- | ---- | ---- |
label | 该列显示的标题 | string | 是 | - |
field | 对应列内容的字段名 | string | 是 | - |
width | 该列的宽度 | number | 否 | - |
frozen | 该列是否为固定列，可能有些框架该值为字符串，所以可以配置为字符串 | boolean \| string | 否 | false |
\_widthFromGTDS_ | 用以标识该列的宽度是否为计算宽度，一般无需手动配置，如果配置了 width, 则会设置为 false，否则设置为 true | boolean | 否 | - |

### data { Array }

必须，表格数据。


### options { Object }

可选，其它配置。


参数  | 说明 | 类型 | 默认值  |
--------- | --------| --------| --------|
columnMaxWidth | 最大的列宽度 | number | 512 |
columnRedundancyWidth | 每列的冗余宽短，有些情况我们需要的列宽可能比计算的列宽一些，可以配置此值 | number | 0 |
font | 应该于文字的样式，( [关于font](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) ） | string | 默认获取应用于 `body` 的 `font` 值 |
widthAlias | 替代 `column` 配置对象 `width` 字段的字段配置 | string | 'width' |
labelAlias | 替代 `column` 配置对象 `label` 字段的字段配置 | string | 'label' |
fieldAlias | 替代 `column` 配置对象 `field` 字段的字段配置 | string | 'field' |
frozenAlias | 替代 `column` 配置对象 `frozen` 字段的字段配置 | string | 'frozen' | 

## 返回值说明

每次调用会返回一个对象，该对象包含以下属性：

属性  | 说明 | 类型 |
--------- | --------| --------|
totalWidth | 所有列的宽度和 | number |
unfrozenWidth | 所有未固定列的宽度和   | number |
frozenWidth | 所有固定列的宽度和   | number |
calculateColumnAmount | 所有设置了计算宽度的列的个数 | number
notCalculateColumnAmount | 所有未设置计算宽度的列的个数 | number

## license

MIT
