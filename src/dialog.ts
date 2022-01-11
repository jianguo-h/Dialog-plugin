import { IMessageOptions, IModalOptions, ModalType, IVnode } from './types';
import {
  createTextNode,
  createEmptyNode,
  setNodeCenter,
  platform,
  isPc,
} from './helpers/utils';

class Dialog {
  // 当前显示的已挂载的元素节点
  dialogEl: HTMLElement | null = null;
  // 所有已经挂载的元素
  mountedEls: HTMLElement[] = [];
  // 定时器
  timer: NodeJS.Timeout | null = null;

  constructor() {
    if (!(this instanceof Dialog)) {
      return new Dialog();
    }
  }

  // 提示
  message(opts: IMessageOptions = {}) {
    const {
      duration = 3000,
      content,
      iconType,
      callback,
    }: IMessageOptions = opts;

    if (this.timer) {
      this.close();
    }

    const vnode: IVnode = {
      tag: 'div',
      props: {
        className: 'dialog-' + platform + '-message gradientShow',
      },
      children: [
        {
          tag: 'div',
          props: { className: 'dialog-content' },
          children: [
            iconType
              ? {
                  tag: 'span',
                  props: { className: 'icon-' + iconType },
                  children: null,
                }
              : null,
            {
              tag: 'p',
              props: { className: 'dialog-message' },
              children: content,
            },
          ],
        },
      ],
    };

    const el = this.createRealElement(vnode);
    this.dialogEl = el;
    this.mounted(el);
    this.mountedEls.push(el);

    setNodeCenter(el);

    this.timer = setTimeout(() => {
      if (!callback) {
        this.close();
      } else {
        callback();
      }
    }, duration);
  }

  // 确认模态框
  confirm(opts: IModalOptions) {
    this.modal(opts);
  }

  // 信息框
  alert(opts: IModalOptions) {
    this.modal(opts, 'alert');
  }

  // 模态框
  modal(opts: IModalOptions = {}, modalType: ModalType = 'confirm') {
    const {
      confirmText = '确定',
      cancelText = '取消',
      onConfirm,
      onCancel,
      title,
      content,
      maskClose = true,
      showIconClose = true,
    } = opts;

    const isConfirm: boolean = modalType === 'confirm';

    const vnode: IVnode = {
      tag: 'div',
      props: {
        className: 'dialog-' + platform + '-' + modalType,
      },
      children: [
        {
          tag: 'div',
          props: {
            className: 'dialog-mask',
            on: {
              click: () => {
                if (maskClose) {
                  this.close();
                }
              },
            },
          },
          children: null,
        },
        {
          tag: 'div',
          props: { className: 'dialog-box gradientShow' },
          children: [
            isPc
              ? {
                  tag: 'div',
                  props: { className: 'dialog-header' },
                  children: [
                    {
                      tag: 'p',
                      props: { className: 'dialog-title' },
                      children: title,
                    },
                    showIconClose
                      ? {
                          tag: 'span',
                          props: {
                            className: 'dialog-header-close',
                            on: {
                              click: () => {
                                this.close();
                              },
                            },
                          },
                          children: null,
                        }
                      : null,
                  ],
                }
              : null,
            {
              tag: 'div',
              props: { className: 'dialog-content' },
              children: [
                {
                  tag: 'p',
                  props: { className: 'dialog-message' },
                  children: content,
                },
              ],
            },
            {
              tag: 'div',
              props: { className: 'dialog-footer' },
              children: [
                isConfirm
                  ? {
                      tag: 'span',
                      props: {
                        className: 'dialog-cancel-btn',
                        on: {
                          click: () => {
                            if (onCancel) {
                              onCancel();
                            } else {
                              this.close();
                            }
                          },
                        },
                      },
                      children: cancelText,
                    }
                  : null,
                {
                  tag: 'span',
                  props: {
                    className: 'dialog-confirm-btn',
                    on: {
                      click: () => {
                        if (onConfirm) {
                          onConfirm();
                        } else {
                          this.close();
                        }
                      },
                    },
                  },
                  children: confirmText,
                },
              ],
            },
          ],
        },
      ],
    };

    const el = this.createRealElement(vnode);
    this.mounted(el);
    this.mountedEls.push(el);
    this.dialogEl = el;
  }

  // 关闭
  close() {
    let len: number = this.mountedEls.length - 1;
    if (this.dialogEl && this.dialogEl.parentNode) {
      this.dialogEl.parentNode.removeChild(this.dialogEl);
      this.mountedEls.splice(len, 1);
      len = this.mountedEls.length - 1;
      this.dialogEl = this.mountedEls[len];
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  // 生成真实dom
  createRealElement(vnode: IVnode) {
    const { tag, props, children } = vnode;
    const el = createEmptyNode(tag, props);

    let childNode;
    if (Array.isArray(children)) {
      for (const child of children) {
        if (child) {
          if (typeof child === 'string' || typeof child === 'number') {
            childNode = createTextNode(child);
          } else {
            childNode = this.createRealElement(child);
          }
          el.appendChild(childNode);
        }
      }
    } else if (typeof children === 'string' || typeof children === 'number') {
      childNode = createTextNode(children);
      el.appendChild(childNode);
    }

    return el;
  }

  // 将真实dom挂载到body上
  mounted(el: HTMLElement) {
    document.body.appendChild(el);
  }
}

export default Dialog;
