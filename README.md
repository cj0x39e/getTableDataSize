## 介绍

`getTableDataSize` 用于获取表格数据每列所需的宽度。

渲染表格时，在某些情况下，我们需要给每列数据设置列宽，但是数据长度的不确定性导致有时候很难设置一个满意的列宽。`getTableDataSize` 通过在渲染用户使用的表格前先获取每列数据所需的真实宽度，拿到宽度我们就可以用这些宽度完美的设置用户使用的表格的列宽了。

## 安装

```
yarn add getTableDataSize
npm install getTableDataSize
```


## 使用



```javascript
import { getTableDataSize } from 'getTableDataSize';

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
// [{"label":"姓名","field":"name","frozen":true,"width":184},{"label":"年龄","field":"age","width":32},{"label":"出生地","field":"birthplace","width":144}]

console.log(JSON.stringify(result));
// {"countWidth":360,"unfrozenCountWidth":176,"frozenCountWidth":184}
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
frozen | 该列是否为固定列 | boolean | 否 | false |

### data { Array }

必须，表格数据。


### options { Object }

可选，其它配置。


参数  | 说明 | 类型 | 默认值  |
--------- | --------| --------| --------|
columnMaxWidth | 最大的列宽度 | number | 512 |
font | 应该于文字的样式 | string ( [关于font](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font) ）| 默认获取应用于 `body` 的 `font` 值 |
widthAlias | 替代 `column` 配置对象 `width` 字段的字段配置 | string | 'width' |
labelAlias | 替代 `column` 配置对象 `label` 字段的字段配置 | string | 'label' |
fieldAlias | 替代 `column` 配置对象 `field` 字段的字段配置 | string | 'field' |
frozenAlias | 替代 `column` 配置对象 `frozen` 字段的字段配置 | string | 'frozen' | 

## 返回值说明

每次调用会返回一个对象，该对象包含以下属性：

属性  | 说明 | 类型 |
--------- | --------| --------|
countWidth | 所有列的宽度和 | number |
unfrozenCountWidth | 所有未固定列的宽度和   | number |
frozenCountWidth | 所有固定列的宽度和   | number |

## license

MIT
