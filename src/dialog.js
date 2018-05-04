/*
<div class="dialog-wrap">
  <div class="dialog-mask"></div>
  <div class="dialog-box dialog-box-pc gradientShow">
    <div class="dialog-header"></div>
    <div class="dialog-content">
      <img src="./static/images/right.png" class="dialog-img">
      <p class="dialog-message">在这里填写您的信息</p>
    </div>
    <div class="dialog-footer">
      <span class="dialog-cancel-btn">取消</span>
      <span class="dialog-confirm-btn">确定</span>
    </div>
  </div>
</div>
*/
import {
  type, TEXT_NODE, EMPTY_NODE, ELEMENT_NODE,
  judgeNodeType, createTextNode, createEmptyNode
} from './utils';
import './dialog.scss';

class Dialog {
  constructor(opts) {
    this.defaults = {
      duration: 3000,         // 显示的时间, default: 3000
      mask: true,             // 是否需要遮罩层, default: true
      maskClose: true         // 点击遮罩层是否关闭(maskShow为true时方有效), default: true
    };
    this.opts = {
      ...this.defaults,
      ...opts
    }
    this.el = null;
  }
  confirm() {

  }
  // 提示
  message(opts) {
    const params = {
      duration: 3000,                      // 显示的时间, default: 3000
      content: '这里放提示的内容',          // 提示的内容, default: ''
      type: null,                          // 类型, 'success', 'warning' or 'error', default: null
      callback: null,                      // duration后后执行的回调, 默认执行关闭, 若配置了callback需手动关闭
      ...opts
    }
    let { duration, content, callback, type: iconType } = params;
    duration = (type(duration) === 'number' && !Number.isNaN(duration) && duration > 0) ? duration : 3000;
    content = type(content) === 'string' ? content : '这里放提示的内容';
    iconType = ['success', 'warning', 'error'].includes(iconType) ? iconType : null;
    callback = type(callback) === 'function' ? callback : null;

    const vnode = {
      tag: 'div',
      props: {
        className: 'dialog-wrap'
      },
      children: [
        { tag: 'div', props: { className: 'dialog-box gradientShow' },
          children: [
            { tag: 'div', props: { className: 'dialog-content' },
              children: [
                iconType ? { tag: 'span', props: { className: 'icon-' + iconType }, children: null } : null,
                { tag: 'p', props: { className: 'dialog-message' }, children: content }
              ]
            }
          ]
        }
      ]
    };
    const el = this.createElement(vnode);
    this.mounted(el);
    setTimeout(() => {
      if(!callback) {
        this.close();
      }
      else {
        callback();
      }
    }, duration);
  }
  alert() {

  }
  // 关闭
  close() {
    const dialogEl = document.querySelector('.dialog-wrap');
    if(dialogEl) {
      dialogEl.parentNode.removeChild(dialogEl);
    }
  }
  // 生成真实dom
  createElement(vnode) {
    if(type(vnode) !== 'object') {
      console.error('vnode is not an object', vnode);
      return;
    }

    let el;
    const { tag, props, children } = vnode;
    const childrenType = type(children);
    const nodeType = judgeNodeType(vnode);
    if(nodeType === TEXT_NODE) {
      el = createTextNode(children);
    }
    else if(nodeType === EMPTY_NODE) {
      el = createEmptyNode(tag, props);
    }
    else {
      el = createEmptyNode(tag, props);
      let childNode;
      if(childrenType === 'array') {
        for(const child of children) {
          if(child) {
            childNode = this.createElement(child);
            el.appendChild(childNode)
          }
        }
      }
      else if(childrenType === 'string' || childrenType === 'number') {
        childNode = createTextNode(children);
        el.appendChild(childNode);
      }
    }

    return el;
  }
  // 将真实dom挂载到body上
  mounted(el) {
    document.body.appendChild(el);
  }
}

if(typeof window !== 'undefined') {
  window['Dialog'] = Dialog;
}
export default Dialog;