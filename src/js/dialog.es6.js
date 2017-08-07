String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
export default class Dialog {
	constructor(opts) {
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
		this.opts = this.extend(this.defaults, opts);
		this.init();
	}
	// 渲染dom
	init() {	
		this.dialogMask = this.createDom("div");
		this.dialogBox = this.createDom("div");
		this.dialogContent = this.createDom("p");
		this.dialogImg = this.createDom("img");
		this.dialogBtnsBox = this.createDom("div");
		this.dialogMask.className = "dialog-mask";
		this.dialogBox.className = "dialog-box";
		this.eventType = (this.judgePlatform() === "pc") ? "click" : "touchstart";
		this.isSupportFlex = this.prefix("flex") || this.prefix("box") || this.prefix("flexbox");
		this.ua = navigator.userAgent.toLowerCase();

		if(window.ActiveXObject) {
			this.ieVersion = parseInt(this.ua.match(/msie ([\d.]+)/)[1]);
		}
		if(this.ieVersion < 9) {
			this.opts.maskShow = false;
			alert("您的浏览器版本过低，建议您下载并使用最新的chrome浏览器！");
		}

		const platform = this.judgePlatform();
		const { opts, dialogBox, dialogImg, dialogMask, dialogContent } = this;
		let imgSrc = (typeof opts.imgSrc === "string") ? opts.imgSrc : "";
		let btnArr = (typeof opts.btnArr === "object") ? opts.btnArr : null;
		let message = (typeof opts.message === "string") ? opts.message : "";

		if(imgSrc.trim() !== "") {
			dialogImg.src = imgSrc;
			dialogImg.className = "dialog-img";
			dialogBox.appendChild(dialogImg);
		}
		if(message.trim() !== "") {
			dialogContent.innerHTML = message;
			dialogContent.className = "dialog-content";
			dialogBox.appendChild(dialogContent);
			this.setDialogContent(dialogContent);
		}
		if(btnArr !== null && btnArr.length >= 1) {
			this.createButtons(dialogBox, btnArr);
		}
		if(platform === "pc") {
			this.dealClass(dialogBox, "dialog-box-pc", "addClass");
		}	
		this.setAttribute();
	}
	// 设置属性
	setAttribute() {	
		const { opts, dialogBox, eventType, dialogMask } = this;
		let opacity = (typeof opts.opacity === "number") ? opts.opacity : null;
		let trigger = (typeof opts.trigger === "boolean") ? opts.trigger : true;
		let maskShow = (typeof opts.maskShow === "boolean") ? opts.maskShow : true;
		let delay = (typeof opts.delay === "number" && opts.delay >= 0) ? opts.delay : null;
		let backgroundColor = (typeof opts.backgroundColor === "string") ? opts.backgroundColor : "";
		let width = (typeof opts.width === "number" && opts.width >= 0) ? parseInt(opts.width) : null;
		let height = (typeof opts.height === "number" && opts.height >= 0) ? parseInt(opts.height) : null;
		let borderRadius = (typeof opts.borderRadius === "number" && opts.borderRadius >= 0) ? parseInt(opts.borderRadius) : null;

		this.on(dialogBox, eventType, evt => {
			evt = evt || window.event;
			if(evt.stopPropagation) {
				evt.stopPropagation();
				evt.preventDefault();
			}
			else {		
				evt.cancelBubble = true;
				evt.returnValue = false;
			}
		});
		if(width !== null) {
			this.css(dialogBox, "width", `${width}px`);
		}
		if(height !== null) {
			this.css(dialogBox, "height", `${height}px`);
		}
		if(borderRadius !== null) {
			this.css(dialogBox, "borderRadius", `${borderRadius}px`);
		}	
		if(backgroundColor.trim() !== "") {
			this.css(dialogBox, "backgroundColor", backgroundColor);
		}
		if(opacity && opacity >= 0 && opacity <= 1) {
			this.css(dialogMask, "backgroundColor", `rgba(0, 0, 0, ${opacity})`);
		}	
		if(delay !== null) {
			setTimeout(() => {
				this.close();
			}, delay);
		}
		if(trigger) {
			this.on(dialogMask, eventType, () => {
				this.close();
			});
		}
		if(maskShow) {
			dialogMask.appendChild(dialogBox);
			document.body.appendChild(dialogMask);
		}
		else {
			this.dealClass(dialogBox, "dialog-box-no-mask dialog-box-no-flex", "addClass");
			document.body.appendChild(dialogBox);
		}
		this.setDialogBoxCenter();
	}
	// 设置DialogBox居中
	setDialogBoxCenter() {
		const { ieVersion, dialogBox, dialogImg, dialogMask } = this;
		let maskShow = (typeof this.opts.maskShow === "boolean") ? this.opts.maskShow : true;

		if(maskShow && !this.isSupportFlex) {
			this.dealClass(dialogMask, "dialog-mask-no-flex", "addClass");		
		}
		else if(maskShow && this.isSupportFlex) {
			return;
		}
		let setCenter = () => {
			const dialogBoxWidth = dialogBox.offsetWidth;
			const dialogBoxHeight = dialogBox.offsetHeight;
			const marginTop = -(dialogBoxHeight / 2) + "px";
			const marginLeft = -(dialogBoxWidth / 2) + "px";

			this.css(dialogBox, { 
				marginLeft, 
				marginTop 
			});
		}
		if(dialogImg) {	
			dialogImg.onload = setCenter;
			if(ieVersion && ieVersion <= 8) {
				dialogImg.src = this.opts.imgSrc;
			}
		}
		else {
			setCenter();
		}
	}
	// 设置dialog字体
	setDialogContent(dialogContent) {
		let color = (typeof this.opts.color === "string") ? this.opts.color : "#fff";
		let textAlign = (typeof this.opts.textAlign === "string") ? this.opts.textAlign : "center";
		let fontSize = (typeof this.opts.fontSize === "number" && this.opts.fontSize >= 0) ? parseInt(this.opts.fontSize) : null;

		if(color.trim() !== "#fff") {
			this.css(dialogContent, "color", color);
		}
		if(fontSize !== null) {
			this.css(dialogContent, "fontSize", fontSize + "px");
		}
		if(textAlign.trim() !== "center") {
			this.css(dialogContent, "textAlign", textAlign);
		}
	}
	//创建dom的方法
	createDom(tag) {	
		return document.createElement(tag);
	}
	// 关闭
	close() {	 
		this.dialogMask.parentNode.removeChild(this.dialogMask);
	}
	// 创建按钮数组
	createButtons(dialogBox, btnArr) {	
		const { opts, eventType, dialogBtnsBox } = this;
		let btnArrLen = btnArr.length;
		let width = null;
		let height = null;
		let backgroundColor = "";
		let fontSize = null;
		let borderRadius = null;
		let color = "";
		let callback = null;

		dialogBtnsBox.className = "dialog-btns-box";
		if(btnArrLen === 1) {
			this.dealClass(dialogBtnsBox, "dialog-btns-box-1", "addClass");
		}
		else if(btnArrLen >= 3) {
			btnArr = btnArr.slice(0, 3);
			btnArrLen = btnArr.length;
			this.dealClass(dialogBtnsBox, "dialog-btns-box-3", "addClass");
		}
		for(let i = 0; i < btnArrLen; i++) {
			color = (typeof btnArr[i].color === "string") ? btnArr[i].color : "";
			callback = (typeof btnArr[i].callback === "function") ? btnArr[i].callback : null;
			backgroundColor = (typeof btnArr[i].backgroundColor === "string") ? btnArr[i].backgroundColor : "";
			width = (typeof btnArr[i].width === "number" && btnArr[i].width >= 0) ? parseInt(btnArr[i].width) : null;
			height = (typeof btnArr[i].height === "number" && btnArr[i].height >= 0) ? parseInt(btnArr[i].height) : null;
			fontSize = (typeof btnArr[i].fontSize === "number" && btnArr[i].fontSize >= 0) ? parseInt(btnArr[i].fontSize) : null;
			borderRadius = (typeof btnArr[i].borderRadius === "number" && btnArr[i].borderRadius >= 0) ? parseInt(btnArr[i].borderRadius) : null

			let dialogBtn = document.createElement("span");
			dialogBtn.className = `dialog-btn${i + 1}`;
			dialogBtn.innerHTML = btnArr[i].text;
			dialogBtnsBox.appendChild(dialogBtn);
			if(width !== null) {
				this.css(dialogBtn, "width", `${width}px`);
			}
			if(height !== null) {
				this.css(dialogBtn, {
					height: `${height}px`,
					lineHeight: `${height}px`
				});
			}
			if(fontSize !== null) {
				this.css(dialogBtn, "fontSize", `${fontSize}px`);
			}
			if(borderRadius !== null) {
				this.css(dialogBtn, "borderRadius", `${borderRadius}px`);
			}
			if(backgroundColor.trim() !== "") {
				this.css(dialogBtn, "backgroundColor", backgroundColor);
			}
			if(color.trim() !== "") {
				this.css(dialogBtn, "color", color);
			}
			this.on(dialogBtn, eventType, () => {
				this.close();
				if(typeof callback === "function") {
					callback();
				}
			});	
		}
		dialogBox.appendChild(dialogBtnsBox);
	}
	// 返回适合当前浏览器版本的css属性，否则返回false
	prefix(prop) {
		const style = this.createDom("dummy").style;
	    const prefixes = ["webkit", "moz", "o", "ms"];
	    let prefixeProp = "";

	    if(style[prop] !== undefined) return prop;
	    
		prop = prop.charAt(0).toUpperCase() + prop.substr(1);
		for(let prefix of prefixes) {
			prefixeProp = prefix + prop;
			if(style[prefixeProp] !== undefined) {
    			return prefixeProp;
    		}
		}
		return false;		    	
	}
	// 设置css样式
	css(...args) {
		const [ele, styles, styleValue] = args;
		let stylePrefixProp = "";
		
		if(!ele) {
			throw new Error("dom not found!");
		}
		// 处理类似(ele, {position: "absolue", width: "100px"})的情况
		if(styles && typeof styles === "object") {
			for(let styleProp in styles) {
				stylePrefixProp = this.prefix(styleProp);
				ele.style[stylePrefixProp] = styles[styleProp];
			}
		}
		// 处理类似(ele, "position", "absolue")的情况
		else if(styles && styleValue && typeof styles === "string") {
			stylePrefixProp = this.prefix(styles);
			ele.style[stylePrefixProp] = styleValue;
		}
		return this;
	}
	// 根据type处理节点的class
	dealClass(ele, classStrs, type) {
		classStrs = (typeof classStrs === "string") ? classStrs : "";
		if(classStrs === "") return;

		let eleClass = ele.className;
		const classList = classStrs.split(" ");
		for(let className of classList) {
			if(type === "addClass") {
				if(!eleClass.includes(className)) {
					eleClass += " " + className;
				}
			}
			else {
				if(eleClass.includes(className)) {
					let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
					eleClass = eleClass.replace(reg, "");
				}
			}
		}
		ele.className = eleClass;
		return this;
	}
	// 自定义扩展参数
	extend(defaults, opts) {
		opts = opts || {};
		let target = defaults || {}; 
		let clone; 
		let src; 
		let copy; 
		let deep;

		if(typeof target !== "object" && typeof target !== "function") {
			target = {};
		}
		if(opts !== null) {
			for(let item in opts) {
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
					target[item] = this.extend(clone, copy);
				}
				else if(copy !== undefined) {
					target[item] = copy;
				}
			}	
		}
		return target;
	}
	// 为元素绑定事件
	on(ele, eventType, callback) {   
		const eventList = eventType.split(" ");

		if(typeof callback === "function") {
			for(let event of eventList) {
				if(document.addEventListener) {
					ele.addEventListener(event, callback);
				}
				else {
					ele.attachEvent(`on${event}`, callback);
				}
			}
		}
		return this;
	}
	// 判断平台
	judgePlatform() {
		const userAgent = navigator.userAgent.toLowerCase();
	   	const agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"];
	    for(let agent of agents) {
	    	if(userAgent.includes(agent)) {
	    		return "mobile";
	    	}
	    }
	    return "pc";
	}
};