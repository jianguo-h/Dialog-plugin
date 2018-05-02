import './dialog.scss';
/* String.prototype.trim = function () {
  return this.replace(/(^\s*)|(\s*$)/g, "");
} */
class Dialog {
  constructor(opts) {
    /* if(!(this instanceof Dialog)) {
      return this;
    } */
    this.defaults = {
      imgSrc: "",                           // 图片的路径(String), default: ""
      delay: null,                          // 多少秒后自动关闭(Number), default: null
      width: null,                          // 弹层的宽度(Number), default: null
      height: null,                         // 弹层的高度(Number), default: null
      color: "#fff",                        // 中间提示字体的颜色(String), default: #fff
      opacity: null,                        // 弹层遮罩层的透明度(Number), default: null
      trigger: true,                        // 点击遮罩层是否隐藏(Boolean), default: true
      fontSize: null,                       // 中间提示字体的大小(Number), default: null
      maskShow: true,                       // 是否显示遮罩层(Boolean), default: true
      borderRadius: null,                   // 弹层的圆角大小(Number), default: null
      textAlign: "center",                  // 中间提示字体的位置(String), default: center, 可选left, right
      backgroundColor: "",                  // 弹层的背景颜色(String), default: ""
      message: "在这里填写您的信息",         // 提示的内容, default: ""
      btnArr: [                             // 按钮数组, 默认为2个, 最多3个, 不需要时可设为null
        {
          color: "",                        // 按钮字体的颜色, default: ""
          text: "取消",                     // 按钮的内容, default: "取消"
          width: null,                      // 按钮的宽度, default: null
          height: null,                     // 按钮的高度, default: null
          callback: null,                   // 点击时的回调, default: null
          fontSize: null,                   // 按钮字体的大小, default: null
          borderRadius: null,               // 按钮的圆角大小, default: null
          backgroundColor: ""               // 按钮的背景颜色, default: null
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
    this.opts = this.extend(true, {}, this.defaults, opts);
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
    const { opts, dialogBox, dialogImg, dialogContent } = this;
    const imgSrc = (typeof opts.imgSrc === "string") ? opts.imgSrc : "";
    const btnArr = (typeof opts.btnArr === "object") ? opts.btnArr : null;
    const message = (typeof opts.message === "string") ? opts.message : "";

    if(imgSrc.trim() !== "") {
      dialogImg.src = imgSrc;
      dialogImg.className = "dialog-img";
      dialogBox.appendChild(dialogImg);
    }
    if(message.trim() !== "") {
      dialogContent.textContent = message;
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
    const opacity = (typeof opts.opacity === "number") ? opts.opacity : null;
    const trigger = (typeof opts.trigger === "boolean") ? opts.trigger : true;
    const maskShow = (typeof opts.maskShow === "boolean") ? opts.maskShow : true;
    const delay = (typeof opts.delay === "number" && opts.delay >= 0) ? opts.delay : null;
    const backgroundColor = (typeof opts.backgroundColor === "string") ? opts.backgroundColor : "";
    const width = (typeof opts.width === "number" && opts.width >= 0) ? parseInt(opts.width) : null;
    const height = (typeof opts.height === "number" && opts.height >= 0) ? parseInt(opts.height) : null;
    const borderRadius = (typeof opts.borderRadius === "number" && opts.borderRadius >= 0) ? parseInt(opts.borderRadius) : null;

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
    }).dealClass(dialogBox, "gradientShow", "addClass");
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
    const maskShow = (typeof this.opts.maskShow === "boolean") ? this.opts.maskShow : true;

    if(maskShow && !this.isSupportFlex) {
      this.dealClass(dialogMask, "dialog-mask-no-flex", "addClass");
    }
    else if(maskShow && this.isSupportFlex) {
      return;
    }
    const setCenter = () => {
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
    const color = (typeof this.opts.color === "string") ? this.opts.color : "#fff";
    const textAlign = (typeof this.opts.textAlign === "string") ? this.opts.textAlign : "center";
    const fontSize = (typeof this.opts.fontSize === "number" && this.opts.fontSize >= 0) ? parseInt(this.opts.fontSize) : null;

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
    const { opts, dialogMask, dialogBox } = this;
    const removeEle = opts.maskShow === true ? dialogMask : dialogBox;

    removeEle.parentNode.removeChild(removeEle);
  }
  // 创建按钮数组
  createButtons(dialogBox, btnArr) {
    const { eventType, dialogBtnsBox } = this;
    let btnArrLen = btnArr.length;

    dialogBtnsBox.className = "dialog-btns-box";
    if(btnArrLen === 1) {
      this.dealClass(dialogBtnsBox, "dialog-btns-box-1", "addClass");
    }
    else if(btnArrLen >= 3) {
      btnArr = btnArr.slice(0, 3);
      btnArrLen = btnArr.length;
      this.dealClass(dialogBtnsBox, "dialog-btns-box-3", "addClass");
    }
    for(const [index, btn] of btnArr.entries()) {
      const color = (typeof btn.color === "string") ? btn.color : "";
      const callback = (typeof btn.callback === "function") ? btn.callback : null;
      const backgroundColor = (typeof btn.backgroundColor === "string") ? btn.backgroundColor : "";
      const width = (typeof btn.width === "number" && btn.width >= 0) ? parseInt(btn.width) : null;
      const height = (typeof btn.height === "number" && btn.height >= 0) ? parseInt(btn.height) : null;
      const fontSize = (typeof btn.fontSize === "number" && btn.fontSize >= 0) ? parseInt(btn.fontSize) : null;
      const borderRadius = (typeof btn.borderRadius === "number" && btn.borderRadius >= 0) ? parseInt(btn.borderRadius) : null;
      const dialogBtn = document.createElement("span");

      dialogBtn.className = `dialog-btn${index + 1}`;
      dialogBtn.textContent = btn.text;
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
        if(typeof callback === "function") {
          callback();
        }
        this.close();
      });
    }
    dialogBox.appendChild(dialogBtnsBox);
  }
  // 为元素绑定事件
  on(ele, eventStrs, callback) {
    const eventList = eventStrs.split(" ");

    if(typeof callback === "function") {
      for(const event of eventList) {
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
  // 设置css样式
  css(...args) {
    const [ele, styles, styleValue] = args;
    let stylePrefixProp = "";

    if(!ele) {
      throw new Error("dom not found!");
    }
    // 处理类似(ele, {position: "absolue", width: "100px"})的情况
    if(styles && typeof styles === "object") {
      for(const styleProp in styles) {
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
    for(const className of classList) {
      if(type === "addClass") {
        if(!eleClass.includes(className)) {
          eleClass += " " + className;
        }
      }
      else {
        if(eleClass.includes(className)) {
          const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
          eleClass = eleClass.replace(reg, "");
        }
      }
    }
    ele.className = eleClass;
    return this;
  }
  // 自定义扩展参数
  extend(...args) {
    let options;
    let name;
    let src;
    let copy;
    let copyIsArray;
    let clone;
    let target = args[0] || {};
    let i = 1;
    const length = args.length;
    let deep = false;

    // 处理深度拷贝情况(第一个参数是boolean类型且为true)
    if(typeof target === "boolean") {
      deep = target;
      target = args[i] || {};
      // 跳过第一个参数(是否深度拷贝)和第二个参数(目标对象)
      i++;
    }
    // 如果目标不是对象或函数, 则初始化为空对象
    if(typeof target !== "object" && typeof target !== "function") {
      target = {};
    }
    // 如果只指定了一个参数, 则使用jQuery自身作为目标对象
    if(i === length) {
      target = this;
      i--;
    }

    for(; i < length; i++) {
      if((options = args[i]) !== null) {
        // Extend the base object
        for(name in options) {
          src = target[name];
          copy = options[name];
          if(target === copy) {
            continue;
          }
          // 如果对象中包含了数组或者其他对象, 则使用递归进行拷贝
          copyIsArray = Array.isArray(copy);
          if(deep && copy && (typeof copy === "object" || copyIsArray)) {
            // if(deep && copy && (typeof copy === "object" || (copyIsArray = Array.isArray(copy)))) {
            // 处理数组
            if(copyIsArray) {
              copyIsArray = false;
              // 如果目标对象不存在该数组, 则创建一个空数组
              clone = src && Array.isArray(src) ? src : [];
            }
            else {
              clone = src && typeof src === "object" ? src : {};
            }
            // 从不改变原始对象, 只做拷贝
            target[name] = this.extend(deep, clone, copy);
          }
          // 不拷贝undefined值
          else if(copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }
  // 返回适合当前浏览器版本的css属性，否则返回false
  prefix(prop) {
    const style = this.createDom("dummy").style;
    const prefixes = ["webkit", "moz", "o", "ms"];
    let prefixeProp = "";

    if(style[prop] !== undefined) return prop;

    prop = prop.charAt(0).toUpperCase() + prop.substr(1);
    for(const prefix of prefixes) {
      prefixeProp = prefix + prop;
      if(style[prefixeProp] !== undefined) {
        return prefixeProp;
      }
    }
    return false;
  }
  // 判断平台
  judgePlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    const agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"];
    for(const agent of agents) {
      if(userAgent.includes(agent)) {
        return "mobile";
      }
    }
    return "pc";
  }
};

if(typeof window !== 'undefined') {
  window['Dialog'] = Dialog;
}
export default Dialog;