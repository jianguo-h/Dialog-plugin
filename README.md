# Dialog #

>  一款移动端和PC端通用的弹出层插件

## Build Setup ##
``` bash

# git clone https://github.com/jianguo-h/Dialog-plugin.git

# 1.install dependencies
npm install（npm i）

# 2.serve with hot reload at localhost:8080
npm run dev

# 3.build for production with minification
npm run build

```

## 简介 ##
### 插件说明 ###
>一款能代替浏览器自带弹出层的插件，应该能满足当前web开发中的常见需求，暂未兼容老版本浏览器，使用es6写的，故需要按以下方式引用（间下方调用方式），而具体的可根据需求去配置参数

### 参数说明 ###
**message**方法，传入一个对象，包含以下属性
<table width='100%'>
  <thead>
    <tr align='left'>
      <th>属性</th>
      <th>说明</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr align='left'>
      <td>duration</td>
      <td>显示的时间</td>
      <td>number</td>
      <td>3000</td>
    </tr>
    <tr align='left'>
      <td>content</td>
      <td>提示的内容</td>
      <td>string</td>
      <td>这里放提示的内容</td>
    </tr>
    <tr align='left'>
      <td>type</td>
      <td>提示图标的类型，可选'success', 'warning'，'error'</td>
      <td>string</td>
      <td>null</td>
    </tr>
    <tr align='left'>
      <td>callback</td>
      <td>duration时间后执行的回调，若配置了callback需手动关闭</td>
      <td>function</td>
      <td>null</td>
    </tr>
  </tbody>
</table>

**confirm**方法，传入一个对象，包含以下属性
<table width='100%'>
  <thead>
    <tr align='left'>
      <th>属性</th>
      <th>说明</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr align='left'>
      <td>maskClose</td>
      <td>点击遮罩层是否关闭</td>
      <td>boolean</td>
      <td>true</td>
    </tr>
    <tr align='left'>
      <td>content</td>
      <td>提示的内容</td>
      <td>string</td>
      <td>这里放提示的内容</td>
    </tr>
    <tr align='left'>
      <td>confirmText</td>
      <td>确定按钮的文字</td>
      <td>string</td>
      <td>确定</td>
    </tr>
    <tr align='left'>
      <td>onConfirm</td>
      <td>点击确定的回调，配置后需手动调用close方法关闭</td>
      <td>function</td>
      <td>null</td>
    </tr>
    <tr align='left'>
      <td>cancelText</td>
      <td>取消按钮的文字</td>
      <td>string</td>
      <td>取消</td>
    </tr>
    <tr align='left'>
      <td>onCancel</td>
      <td>点击取消的回调，配置后需手动调用close方法关闭</td>
      <td>function</td>
      <td>null</td>
    </tr>
    <tr align='left'>
      <td>title</td>
      <td>标题（该参数仅在PC端有效）</td>
      <td>string</td>
      <td>这里是标题</td>
    </tr>
    <tr align='left'>
      <td>showIconClose</td>
      <td>是否显示右上角关闭按钮（该参数仅在PC端有效）</td>
      <td>boolean</td>
      <td>true</td>
    </tr>
  </tbody>
</table>

**alert**方法，传入一个对象，包含以下属性
<table width='100%'>
  <thead>
    <tr align='left'>
      <th>属性</th>
      <th>说明</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr align='left'>
      <td>maskClose</td>
      <td>点击遮罩层是否关闭</td>
      <td>boolean</td>
      <td>true</td>
    </tr>
    <tr align='left'>
      <td>content</td>
      <td>提示的内容</td>
      <td>string</td>
      <td>这里放提示的内容</td>
    </tr>
    <tr align='left'>
      <td>confirmText</td>
      <td>确定按钮的文字</td>
      <td>string</td>
      <td>确定</td>
    </tr>
    <tr align='left'>
      <td>onConfirm</td>
      <td>点击确定的回调，配置后需手动调用close方法关闭</td>
      <td>function</td>
      <td>null</td>
    </tr>
    <tr align='left'>
      <td>title</td>
      <td>标题（该参数仅在PC端有效）</td>
      <td>string</td>
      <td>这里是标题</td>
    </tr>
    <tr align='left'>
      <td>showIconClose</td>
      <td>是否显示右上角关闭按钮（该参数仅在PC端有效）</td>
      <td>boolean</td>
      <td>true</td>
    </tr>
  </tbody>
</table>

**close**方法可手动关闭, 例如下列方式点击确定按钮后1s后会进行关闭
```
const dialog = new Dialog();
dialog.confirm({
  onConfirm: () => {
    setTimeout(() => {
      dialog.close();
    }, 1000)
  }
});
```

### 调用方式 ###
es6 环境下使用如下方式，但是要注意**引入的路径**根据您自己的项目目录进行调整
```
import Dialog from "./src/js/dialog.js";
// 引入后先实例化
const dialog = new Dialog();
// 实例化后可调用任一方法, 参数配置见上方
dialog.message();
dialog.confirm();
dialog.alert();
```