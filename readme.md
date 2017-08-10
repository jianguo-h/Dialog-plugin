# Dialog #

>  一款移动端弹出层插件

## Build Setup ##

> #### 1.install dependencies ####
> npm install（npm i）

> #### 2.serve with hot reload at localhost:8080 ####
> npm run start

> #### build for production with minification ####
> npm run build

## 简介 ##
### 插件说明 ###
		一款能代替浏览器自带弹出层的插件，应该能满足当前web开发中的常见需求，请在chrome浏览器下的手机模式查看，使用es6写的，故需要按以下方式引用（间下方调用方式），而具体的可根据需求去配置参数
### opts参数说明 ###
<pre><code>
{
	imgSrc: "",							// 图片的路径(String), default: ""
	delay: null,						// 多少秒后自动关闭(Number), default: null
	width: null,						// 弹层的宽度(Number), default: null
	height: null,						// 弹层的高度(Number), default: null
	color: "#fff",						// 中间提示字体的颜色(String), default: #fff
	opacity: null,						// 弹层遮罩层的透明度(Number), default: null
	trigger: true,						// 点击遮罩层是否隐藏(Boolean), default: true
	fontSize: null,						// 中间提示字体的大小(Number), default: null
	maskShow: true,						// 是否显示遮罩层(Boolean), default: true
	borderRadius: null,					// 弹层的圆角大小(Number), default: null
	textAlign: "center",				// 中间提示字体的位置(String), default: center, 可选left, right
	backgroundColor: "",				// 弹层的背景颜色(String), default: ""
	message: "在这里填写您的信息",		// 提示的内容, default: ""
	btnArr: [							// 按钮数组, 默认为2个, 最多3个, 不需要时可设为null
		{
			color: "",					// 按钮字体的颜色, default: ""
			text: "取消",				// 按钮的内容, default: "取消"
			width: null,				// 按钮的宽度, default: null
			height: null,				// 按钮的高度, default: null
			callback: null,				// 点击时的回调, default: null
			fontSize: null,				// 按钮字体的大小, default: null
			borderRadius: null,			// 按钮的圆角大小, default: null
			backgroundColor: ""			// 按钮的背景颜色, default: null
		},
		{
			color: "",
			text: "确定",
			width: null,
			height: null,
			fontSize: null,
			callback: null,
			borderRadius: null,
			backgroundColor: ""
		}
	]
}
</pre></code>

### 调用方式 ###
es6 环境下使用如下方式，但是要注意**引入的路径**根据您自己的项目目录进行调整
<pre><code>
import "./sass/dialog.scss";
import Dialog from "./js/dialog.es6.js";
new Dialog({
	imgSrc: "./static/images/right.png",
	btnArr: [
		{	
			callback: function() {
				console.log(">>> cancel");
			}
		},
		{
			callback: function() {
				console.log(">>> confirm");
			}
		}
	]
});
</code></pre>