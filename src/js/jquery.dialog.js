// 基于jQuery || Zepto的对话框插件 Dialog
;(function($) {
	"use strict";
	$.extend({
		dialog: function(opts) {
			new Dialog(opts);
		}
	});
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
		this.opts = $.extend({}, this.defaults, opts);	
		// 初始化
		this.init();   
	};
	Dialog.prototype = {
		// 渲染dom
		init: function() {	
			this.body = $("body");
			this.dialogMask = $("<div class = 'dialog-mask'>");
			this.dialogBox = $("<div class = 'dialog-box'>");
			this.dialogContent = $("<p class = 'dialog-content'>");
			this.dialogImg = $("<img class = 'dialog-img'>");
			this.dialogBtnsBox = $("<div class = 'dialog-btns-box'>");
			this.isSupportFlex = this._isSupport("flex") || this._isSupport("box") || this._isSupport("flexbox");
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
				platform = self.judgePlatform(),
				dialogContent = this.dialogContent,
				imgSrc = (typeof opts.imgSrc === "string") ? opts.imgSrc : "",
				btnArr = (typeof opts.btnArr === "object") ? opts.btnArr : null,
				message = (typeof opts.message === "string") ? opts.message : "";	
	
			if(imgSrc.trim() !== "") {
				dialogImg.src = imgSrc;
				dialogBox.append(dialogImg);
			}
			if(message.trim() !== "") {
				dialogBox.append(dialogContent.html(message));
				self.setDialogContent(dialogContent);
			}
			if(btnArr !== null && btnArr.length >= 1) {
				self.createButtons(dialogBox, btnArr);
			}
			if(platform === "pc") {
				dialogBox.addClass("dialog-box-pc");
			}	
			self.setAttribute();
		},	
		// 设置属性
		setAttribute: function() {	
			var self = this,
				opts = self.opts,
				body = self.body,
				dialogBox = self.dialogBox,
				dialogMask = self.dialogMask,
				opacity = (typeof opts.opacity === "number") ? opts.opacity : null,
				trigger = (typeof opts.trigger === "boolean") ? opts.trigger : true,
				maskShow = (typeof opts.maskShow === "boolean") ? opts.maskShow : true,
				delay = (typeof opts.delay === "number" && opts.delay >= 0) ? opts.delay : null,
				backgroundColor = (typeof opts.backgroundColor === "string") ? opts.backgroundColor : "",
				width = (typeof opts.width === "number" && opts.width >= 0) ? parseInt(opts.width) : null,
				height = (typeof opts.height === "number" && opts.height >= 0) ? parseInt(opts.height) : null,
				borderRadius = (typeof opts.borderRadius === "number" && opts.borderRadius >= 0) ? parseInt(opts.borderRadius) : null;

			dialogBox.on("click", function(e) {
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
				dialogBox.css("width", width + "px");
			}
			if(height !== null) {
				dialogBox.css("height", height + "px");
			}
			if(borderRadius !== null) {
				dialogBox.css("borderRadius", borderRadius + "px");
			}	
			if(backgroundColor.trim() !== "") {
				dialogBox.css("backgroundColor", backgroundColor);
			}
			if(opacity && opacity >= 0 && opacity <= 1) {
				dialogMask.css("backgroundColor", "rgba(0, 0, 0, "+ opacity +")");
			}	
			if(delay !== null) {
				setTimeout(function() {
					self._close();
				}, delay);
			}
			if(trigger) {
				dialogMask.on("click", function() {
					self._close();
				});
			}
			if(maskShow) {
				body.append(dialogMask.append(dialogBox));
			}
			else {
				body.append(dialogBox.addClass("dialog-box-no-mask dialog-box-no-flex"));
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
				dialogMask.addClass("dialog-mask-no-flex");		
			}
			else if(maskShow && self.isSupportFlex) {
				return;
			}
			var setCenter = function() {
				var dialogBoxWidth = dialogBox.outerWidth(),
					dialogBoxHeight = dialogBox.outerHeight(),
					marginTop = -(dialogBoxHeight / 2) + "px",
					marginLeft = -(dialogBoxWidth / 2) + "px";
				dialogBox.css({
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
				dialogContent.css("color", color);
			}
			if(fontSize !== null) {
				dialogContent.css("fontSize", fontSize + "px");
			}
			if(textAlign.trim() !== "center") {
				dialogContent.css("textAlign", textAlign);
			}
		},
		// 关闭
		_close: function() {	 
			this.dialogMask.remove();
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
				callback = null;

			if(btnArrLen === 1) {
				dialogBtnsBox.addClass("dialog-btns-box-1");
			}
			else if(btnArrLen >= 3) {
				btnArr = btnArr.slice(0, 3);
				btnArrLen = btnArr.length;
				dialogBtnsBox.addClass("dialog-btns-box-3");
			}
			$.each(btnArr, function(index, value) {
				color = (typeof value.color === "string") ? value.color : "";
				callback = (typeof value.callback === "function") ? value.callback : null;
				backgroundColor = (typeof value.backgroundColor === "string") ? value.backgroundColor : "";
				width = (typeof value.width === "number" && value.width >= 0) ? parseInt(value.width) : null;
				height = (typeof value.height === "number" && value.height >= 0) ? parseInt(value.height) : null;
				fontSize = (typeof value.fontSize === "number" && value.fontSize >= 0) ? parseInt(value.fontSize) : null;
				borderRadius = (typeof value.borderRadius === "number" && value.borderRadius >= 0) ? parseInt(value.borderRadius) : null

				var dialogBtn = $("<span class = 'dialog-btn" + (index + 1) + "'>"+ value.text +"</span>");
				dialogBtnsBox.append(dialogBtn);
				if(width !== null) {
					dialogBtn.css("width", width + "px");
				}
				if(height !== null) {
					dialogBtn.css({
						height: height + "px",
						lineHeight: height + "px"
					});
				}
				if(fontSize !== null) {
					dialogBtn.css("fontSize", fontSize + "px");
				}
				if(borderRadius !== null) {
					dialogBtn.css("borderRadius", borderRadius + "px");
				}
				if(backgroundColor.trim() !== "") {
					dialogBtn.css("backgroundColor", backgroundColor);
				}
				if(color.trim() !== "") {
					dialogBtn.css("color", color);
				}
				if(typeof callback === "function") {
					dialogBtn.on("click", callback);	
				}
			});
			dialogBox.append(dialogBtnsBox);
		},
		// 返回适合当前浏览器版本的css属性，否则返回false
		_isSupport: function(prop) {
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
})(jQuery || Zepto);