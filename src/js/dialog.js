// 自定义对话框插件 Dialog
;(function(body) {
	"use strict";
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}
	var Dialog = function(opts) {
		if(!(this instanceof Dialog)) {
			return new Dialog(opts);
		}
		// 默认参数
		this.defaults = {
			imgSrc: "",
			delay: null,
			width: null,
			height: null,
			color: "#fff",
			opacity: null,
			trigger: true,
			fontSize: null,
			maskShow: true,
			borderRadius: null,
			textAlign: "center",
			backgroundColor: "",
			message: "在这里填写您的信息",
			btnArr: [
				{
					color: "",
					text: "取消",
					width: null,
					height: null,
					callback: null,
					fontSize: null,
					borderRadius: null,
					backgroundColor: ""
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
		};
		// 参数扩展
		this.opts = this._extend(this.defaults, opts);
		// 初始化
		this.init();   
	};
	Dialog.prototype = {
		// 渲染dom
		init: function() {	
			this.dialogMask = this.createDom("div");
			this.dialogBox = this.createDom("div");
			this.dialogContent = this.createDom("p");
			this.dialogImg = this.createDom("img");
			this.dialogBtnsBox = this.createDom("div");
			this.dialogMask.className = "dialog-mask";
			this.dialogBox.className = "dialog-box";
			this.eventType = (this.judgePlatform() === "pc") ? "click" : "touchstart";
			this.isSupportFlex = this._prefix("flex") || this._prefix("box") || this._prefix("flexbox");
			this.ua = navigator.userAgent.toLowerCase();

			if(window.ActiveXObject) {
				this.ieVersion = parseInt(this.ua.match(/msie ([\d.]+)/)[1]);
			}
			if(this.ieVersion < 9) {
				this.opts.maskShow = false;
				alert("您的浏览器版本过低，建议您下载并使用最新的chrome浏览器！");
			}

			var	self = this,
				opts = self.opts,
				dialogBox = self.dialogBox,
				dialogImg = self.dialogImg,
				dialogMask = self.dialogMask,
				dialogContent = this.dialogContent,
				platform = self.judgePlatform(),
				imgSrc = (typeof opts.imgSrc === "string") ? opts.imgSrc : "",
				btnArr = (typeof opts.btnArr === "object") ? opts.btnArr : null,
				message = (typeof opts.message === "string") ? opts.message : "";	
	
			if(imgSrc.trim() !== "") {
				dialogImg.src = imgSrc;
				dialogImg.className = "dialog-img";
				dialogBox.appendChild(dialogImg);
			}
			if(message.trim() !== "") {
				dialogContent.innerHTML = message;
				dialogContent.className = "dialog-content";
				dialogBox.appendChild(dialogContent);
				self.setDialogContent(dialogContent);
			}
			if(btnArr !== null && btnArr.length >= 1) {
				self.createButtons(dialogBox, btnArr);
			}
			if(platform === "pc") {
				self._addClass(dialogBox, "dialog-box-pc");
			}	
			self.setAttribute();
		},	
		// 设置属性
		setAttribute: function() {	
			var self = this,
				opts = self.opts,
				dialogBox = self.dialogBox,
				eventType = self.eventType,
				dialogMask = self.dialogMask,
				opacity = (typeof opts.opacity === "number") ? opts.opacity : null,
				trigger = (typeof opts.trigger === "boolean") ? opts.trigger : true,
				maskShow = (typeof opts.maskShow === "boolean") ? opts.maskShow : true,
				delay = (typeof opts.delay === "number" && opts.delay >= 0) ? opts.delay : null,
				backgroundColor = (typeof opts.backgroundColor === "string") ? opts.backgroundColor : "",
				width = (typeof opts.width === "number" && opts.width >= 0) ? parseInt(opts.width) : null,
				height = (typeof opts.height === "number" && opts.height >= 0) ? parseInt(opts.height) : null,
				borderRadius = (typeof opts.borderRadius === "number" && opts.borderRadius >= 0) ? parseInt(opts.borderRadius) : null;

			self._on(dialogBox, self.eventType, function(e) {
				e = e || window.event;
				if(e.stopPropagation) {
					e.stopPropagation();
					e.preventDefault();
				}
				else {		
					e.cancelBubble = true;
					e.returnValue = false;
				}
			});
			if(width !== null) {
				self._css(dialogBox, "width", width + "px");
			}
			if(height !== null) {
				self._css(dialogBox, "height", height + "px");
			}
			if(borderRadius !== null) {
				self._css(dialogBox, "borderRadius", borderRadius + "px");
			}	
			if(backgroundColor.trim() !== "") {
				self._css(dialogBox, "backgroundColor", backgroundColor);
			}
			if(opacity && opacity >= 0 && opacity <= 1) {
				self._css(dialogMask, "backgroundColor", "rgba(0, 0, 0, "+ opacity +")");
			}	
			if(delay !== null) {
				setTimeout(function() {
					self._close();
				}, delay);
			}
			if(trigger) {
				self._on(dialogMask, eventType, function() {
					self._close();
				});
			}
			if(maskShow) {
				dialogMask.appendChild(dialogBox);
				body.appendChild(dialogMask);
			}
			else {
				self._addClass(dialogBox, "dialog-box-no-mask dialog-box-no-flex");
				body.appendChild(dialogBox);
			}
			self.setDialogBoxCenter();
		},
		// 设置DialogBox居中
		setDialogBoxCenter: function() {
			var	self = this,
				ieVersion = self.ieVersion,
				dialogBox = self.dialogBox,
				dialogImg = self.dialogImg,
				dialogMask = self.dialogMask,
				maskShow = (typeof self.opts.maskShow === "boolean") ? self.opts.maskShow : true;

			if(maskShow && !self.isSupportFlex) {
				self._addClass(dialogMask, "dialog-mask-no-flex");		
			}
			else if(maskShow && self.isSupportFlex) {
				return;
			}
			var setCenter = function() {
				var dialogBoxWidth = dialogBox.offsetWidth,
					dialogBoxHeight = dialogBox.offsetHeight,
					marginTop = -(dialogBoxHeight / 2) + "px",
					marginLeft = -(dialogBoxWidth / 2) + "px";
				self._css(dialogBox, {
					marginLeft: marginLeft,
					marginTop: marginTop
				});
			}
			if(dialogImg) {	
				dialogImg.onload = setCenter;
				if(ieVersion && ieVersion <= 8) {
					dialogImg.src = self.opts.imgSrc;
				}
			}
			else {
				setCenter();
			}
		},
		// 设置dialog字体
		setDialogContent: function(dialogContent) {
			var self = this,
				color = (typeof self.opts.color === "string") ? self.opts.color : "#fff",
				fontSize = (typeof self.opts.fontSize === "number" && self.opts.fontSize >= 0) ? parseInt(self.opts.fontSize) : null,
				textAlign = (typeof self.opts.textAlign === "string") ? self.opts.textAlign : "center";

			if(color.trim() !== "#fff") {
				self._css(dialogContent, "color", color);
			}
			if(fontSize !== null) {
				self._css(dialogContent, "fontSize", fontSize + "px");
			}
			if(textAlign.trim() !== "center") {
				self._css(dialogContent, "textAlign", textAlign);
			}
		},
		//创建dom的方法
		createDom: function(tag) {	
			return document.createElement(tag);
		},	
		// 关闭
		_close: function() {	 
			var dialogMask = this.dialogMask;
			dialogMask.parentNode.removeChild(dialogMask);
		},	
		// 创建按钮数组
		createButtons: function(dialogBox, btnArr) {	
			var self = this,
				btnArr = btnArr,
				opts = self.opts,
				dialogBox = dialogBox,
				btnArrLen = btnArr.length,
				dialogBtnsBox = self.dialogBtnsBox,
				width = null,
				height = null,
				backgroundColor = "",
				fontSize = null,
				borderRadius = null,
				color = "",
				callback = null,
				eventType = self.eventType;

			dialogBtnsBox.className = "dialog-btns-box";
			if(btnArrLen === 1) {
				self._addClass(dialogBtnsBox, "dialog-btns-box-1");
			}
			else if(btnArrLen >= 3) {
				btnArr = btnArr.slice(0, 3);
				btnArrLen = btnArr.length;
				self._addClass(dialogBtnsBox, "dialog-btns-box-3");
			}
			for(var i = 0; i < btnArrLen; i++) {
				color = (typeof btnArr[i].color === "string") ? btnArr[i].color : "";
				callback = (typeof btnArr[i].callback === "function") ? btnArr[i].callback : null;
				backgroundColor = (typeof btnArr[i].backgroundColor === "string") ? btnArr[i].backgroundColor : "";
				width = (typeof btnArr[i].width === "number" && btnArr[i].width >= 0) ? parseInt(btnArr[i].width) : null;
				height = (typeof btnArr[i].height === "number" && btnArr[i].height >= 0) ? parseInt(btnArr[i].height) : null;
				fontSize = (typeof btnArr[i].fontSize === "number" && btnArr[i].fontSize >= 0) ? parseInt(btnArr[i].fontSize) : null;
				borderRadius = (typeof btnArr[i].borderRadius === "number" && btnArr[i].borderRadius >= 0) ? parseInt(btnArr[i].borderRadius) : null

				var dialogBtn = document.createElement("span");
				dialogBtn.className = "dialog-btn" + (i + 1);
				dialogBtn.innerHTML = btnArr[i].text;
				dialogBtnsBox.appendChild(dialogBtn);
				if(width !== null) {
					self._css(dialogBtn, "width", width + "px");
				}
				if(height !== null) {
					self._css(dialogBtn, {
						height: height + "px",
						lineHeight: height + "px"
					});
				}
				if(fontSize !== null) {
					self._css(dialogBtn, "fontSize", fontSize + "px");
				}
				if(borderRadius !== null) {
					self._css(dialogBtn, "borderRadius", borderRadius + "px");
				}
				if(backgroundColor.trim() !== "") {
					self._css(dialogBtn, "backgroundColor", backgroundColor);
				}
				if(color.trim() !== "") {
					self._css(dialogBtn, "color", color);
				}
				if(typeof callback === "function") {
					self._on(dialogBtn, eventType, callback);	
				}
			}
			dialogBox.appendChild(dialogBtnsBox);
		},
		// 返回适合当前浏览器版本的css属性，否则返回false
		_prefix: function(prop) {
			var style = document.createElement('dummy').style,  
		        prefixes = ["webkit", "moz", "o", "ms"],
		        prefixeProp = "",
		        prop = prop;

		    if(style[prop] !== undefined) {
		    	return prop;
		    }
		    else {
	    		prop = prop.charAt(0).toUpperCase() + prop.substr(1);
		    	for(var i in prefixes) {
		    		prefixeProp = prefixes[i].toLowerCase() + prop;
		    		if(style[prefixeProp] !== undefined) {
		    			return prefixeProp;
		    		}
		    	}
		    	return false;		    	
		    }
		},
		// 设置css样式
		_css: function(ele, name, value) {
			var self = this,
				prefixKey = "";
			if(name !== null && typeof name === "object") {
				for(var key in name) {
					prefixKey = self._prefix(key);
					ele.style[key] = name[key];
				}
			}
			else if(value !== undefined) {
				prefixKey = self._prefix(name);
				ele.style[name] = value;
			}	
		},
		// 添加class
		_addClass: function(ele, className) {
			var className = typeof className === "string" ? className : "";
			if(className === "") {
				return;
			}
			else {
				className = className.split(" ");
				for(var i in className) {
					ele.className += " " + className[i];
				}
			}
		},
		// 自定义扩展参数
		_extend: function(defaults, opts) {
			var target = defaults || {}, 
				opts = opts || {},
				clone, 
				src, 
				copy, 
				deep;

			if(typeof target !== "object" && typeof target !== "function") {
				target = {};
			}
			if(opts !== null) {
				for(var item in opts) {
					src = target[item];
					copy = opts[item];
					if(target === copy) {
						continue;
					}
					deep = (copy && typeof copy === "object") ? false : true;
					if(deep && copy && typeof copy === "object") {
						if(copy instanceof Array) {
							clone = (src && src instanceof Array) ? src : [];
						}
						else {
							clone = (src && src instanceof Object) ? src : {};
						}
						target[item] = _extend(clone, copy);
					}
					else if(copy !== undefined) {
						target[item] = copy;
					}
				}	
			}
			return target;
		},
		// 为元素绑定事件
		_on: function(ele, eventType, callback) {	
			if(callback && typeof callback === "function") {
				if(document.addEventListener) {
					ele.addEventListener(eventType, callback, false);
				}
				else if(document.attachEvent) {
					ele.attachEvent("on" + eventType, callback);
				}
				else {
					ele["on" + eventType] = callback;
				}
			}
		},
		// 判断平台
		judgePlatform: function() {
			var userAgent = (navigator.userAgent).toLowerCase(),
		    	agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"],
		    	platform = "";
		    for (var i = 0; i < agents.length; i++) {
		        if (userAgent.indexOf(agents[i]) > 0) {
		            platform = "mobile";
		            break;
		        }
		        else {
		        	platform = "pc";
		        }
		    }
		    return platform;
		}
	};
	window["Dialog"] = Dialog;
})(document.body);