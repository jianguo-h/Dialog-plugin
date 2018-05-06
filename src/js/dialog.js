import {
  type, TEXT_NODE, EMPTY_NODE,
  judgeNodeType, createTextNode, createEmptyNode,
  setNodeCenter, platform, isPc
} from './utils';
import '../less/dialog.less';

class Dialog {
  constructor() {
    if(!(this instanceof Dialog)) {
      return new Dialog();
    }
    this.dialogEl = null;              // 当前显示的已挂载的元素节点
    this.mountedEls = [];              // 所有已经挂载的元素
    this.timer = null;
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
    content = type(content) === 'string' && content.trim() !== '' ? content : '这里放提示的内容';
    iconType = ['success', 'warning', 'error'].includes(iconType) ? iconType : null;
    callback = type(callback) === 'function' ? callback : null;

    this.timer && this.close();       // 关闭上一个
    const vnode = {
      tag: 'div',
      props: {
        className: 'dialog-' + platform + '-message gradientShow'
      },
      children: [
        {
          tag: 'div', props: { className: 'dialog-content' },
          children: [
            iconType ? { tag: 'span', props: { className: 'icon-' + iconType }, children: null } : null,
            { tag: 'p', props: { className: 'dialog-message' }, children: content }
          ]
        }
      ]
    };
    const el = this.createElement(vnode);
    this.dialogEl = el;
    this.mounted(el);
    this.mountedEls.push(el);

    setNodeCenter(el);
    this.timer = setTimeout(() => {
      if(!callback) {
        this.close();
      }
      else {
        callback();
      }
    }, duration);
  }
  // 确认模态框
  confirm(opts) {
    this.modal(opts);
  }
  // 信息框
  alert(opts) {
    this.modal(opts, 'alert');
  }
  // 模态框
  modal(opts, modalType = 'confirm') {
    const isConfirm = modalType === 'confirm';
    const params = {
      maskClose: true,                      // 点击遮罩层是否关闭(maskShow为true时方有效), default: true
      content: '这里放提示的内容',          // 提示的内容, default: '这里放提示的内容'
      confirmText: '确定',                  // 确定按钮的文字, default: '确定'
      onConfirm: null,                      // 点击确定的回调, default: null, 配置了该参数需手动关闭
      ...(isPc ? {
        title: '这里是标题',                // 标题, default：'这里是标题'
        showIconClose: true                 // 是否显示右上角关闭按钮, default：true
      } : {}),
      ...(isConfirm ? {
        cancelText: '取消',                 // 取消按钮的文字, default: '取消'
        onCancel: null                      // 点击取消的回调, default: null, 配置了该参数需手动关闭
      } : {}),
      ...(type(opts) === 'object' ? opts : {})
    }
    let { confirmText, content, onConfirm, maskClose, cancelText, onCancel, title, showIconClose } = params;
    maskClose = type(maskClose) === 'boolean' ? maskClose : true;
    content = type(content) === 'string' ? content : '这里放提示的内容';
    confirmText = type(confirmText) === 'string' ? confirmText : '确定';
    onConfirm = type(onConfirm) === 'function' ? onConfirm : null;
    if(isPc) {
      title = type(title) === 'string' ? title : '这里是标题';
      showIconClose = type(showIconClose) === 'boolean' ? showIconClose : true;
    }
    if(isConfirm) {
      cancelText = type(cancelText) === 'string' ? cancelText : '取消';
      onCancel = type(onCancel) === 'function' ? onCancel : null;
    }

    const vnode = {
      tag: 'div',
      props: {
        className: 'dialog-' + platform + '-' + modalType
      },
      children: [
        {
          tag: 'div',
          props: {
            className: 'dialog-mask',
            on: {
              click: () => {
                if(maskClose) {
                  this.close();
                }
              }
            }
          },
          children: null
        },
        { tag: 'div', props: { className: 'dialog-box gradientShow' },
          children: [
            isPc ? {
              tag: 'div',
              props: { className: 'dialog-header' },
              children: [
                {
                  tag: 'p',
                  props: { className: 'dialog-title' },
                  children: title
                },
                showIconClose ? {
                  tag: 'span',
                  props: {
                    className: 'dialog-header-close',
                    on: {
                      click: () => {
                        this.close();
                      }
                    }
                  },
                  children: null
                } : null
              ]
            } : null,
            { tag: 'div', props: { className: 'dialog-content' },
              children: [
                { tag: 'p', props: { className: 'dialog-message' }, children: content }
              ]
            },
            { tag: 'div', props: { className: 'dialog-footer' },
              children: [
                isConfirm ? {
                  tag: 'span',
                  props: {
                    className: 'dialog-cancel-btn',
                    on: {
                      click: () => {
                        if(onCancel) {
                          onCancel();
                        }
                        else {
                          this.close();
                        }
                      }
                    }
                  },
                  children: cancelText
                } : null,
                {
                  tag: 'span',
                  props: {
                    className: 'dialog-confirm-btn',
                    on: {
                      click: () => {
                        if(onConfirm) {
                          onConfirm();
                        }
                        else {
                          this.close();
                        }
                      }
                    }
                  },
                  children: confirmText
                }
              ]
            }
          ]
        }
      ]
    };
    const el = this.createElement(vnode);
    this.mounted(el);
    this.mountedEls.push(el);
    this.dialogEl = el;
  }
  // 关闭
  close() {
    let len = this.mountedEls.length - 1;
    if(this.dialogEl) {
      this.dialogEl.parentNode.removeChild(this.dialogEl);
      this.mountedEls.splice(len, 1);
      len = this.mountedEls.length - 1;
      this.dialogEl = this.mountedEls[len];
    }
    if(this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
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