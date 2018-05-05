# Dialog #

>  一款移动端和PC端通用的弹出层插件

``` bash
## Build Setup ##

# 1.install dependencies
npm install（npm i）

# 2.serve with hot reload at localhost:8080
npm run dev

# 3.build for production with minification
npm run build
```

## 简介 ##
### 插件说明 ###
>一款能代替浏览器自带弹出层的插件，应该能满足当前web开发中的常见需求，暂未兼容老版本刘安琪，使用es6写的，故需要按以下方式引用（间下方调用方式），而具体的可根据需求去配置参数

### 参数说明 ###
message方法，传入一个对象，包含以下属性
|属性|说明|类型|默认值|
| :- | :- | :- | :- | 
|duration|显示的时间|number|3000|
|content|提示的内容|string|这里放提示的内容|
|type|提示图标的类型，可选'success', 'warning'，'error'|string|null|
|callback|duration时间后执行的回调，若配置了callback需手动关闭|function|null|

confirm方法，传入一个对象，包含以下属性
|属性|说明|类型|默认值|
| :- | :- | :- | :- | 
|maskClose|点击遮罩层是否关闭|boolean|true|
|content|提示的内容|string|这里放提示的内容|
|confirmText|确定按钮的文字|string|确定|
|onConfirm|点击确定的回调，配置后需手动调用close方法关闭|function|null|
|cancelText|取消按钮的文字|string|取消|
|onCancel|点击取消的回调，配置后需手动调用close方法关闭|function|null|
|title|标题（该参数仅在PC端有效）|string|这里是标题|
|showIconClose|是否显示右上角关闭按钮（该参数仅在PC端有效）|boolean|true|

alert方法，传入一个对象，包含以下属性
|属性|说明|类型|默认值|
| :- | :- | :- | :- | 
|maskClose|点击遮罩层是否关闭|boolean|true|
|content|提示的内容|string|这里放提示的内容|
|confirmText|确定按钮的文字|string|确定|
|onConfirm|点击确定的回调，配置后需手动调用close方法关闭|function|null|
|title|标题（该参数仅在PC端有效）|string|这里是标题|
|showIconClose|是否显示右上角关闭按钮（该参数仅在PC端有效）|boolean|true|

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