import {
  createTextNode,
  createEmptyNode,
  setNodeCenter,
  platform,
  isPc,
  IVnode,
} from './utils';
import { IMessageOptions, IModalOptions, ModalType } from '../../types';
import '../less/dialog.less';

class Dialog {
  // 当前显示的已挂载的元素节点
  private dialogEl: HTMLElement | null = null;
  // 所有已经挂载的元素
  private mountedEls: HTMLElement[] = [];
  // 定时器
  private timer: number | null = null;

  constructor() {
    if (!(this instanceof Dialog)) {
      return new Dialog();
    }
  }

  // 提示
  public message(opts: IMessageOptions = {}): void {
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

    this.timer = window.setTimeout(() => {
      if (!callback) {
        this.close();
      } else {
        callback();
      }
    }, duration);
  }

  // 确认模态框
  public confirm(opts: IModalOptions): void {
    this.modal(opts);
  }

  // 信息框
  public alert(opts: IModalOptions): void {
    this.modal(opts, 'alert');
  }

  // 模态框
  private modal(
    opts: IModalOptions = {},
    modalType: ModalType = 'confirm'
  ): void {
    const {
      confirmText = '确定',
      cancelText = '取消',
      onConfirm,
      onCancel,
      title,
      content,
      maskClose = true,
      showIconClose = true,
    }: IModalOptions = opts;

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
  private close(): void {
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
  private createRealElement(vnode: IVnode): HTMLElement {
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
  private mounted(el: HTMLElement): void {
    document.body.appendChild(el);
  }
}

declare global {
  interface Window {
    Dialog: typeof Dialog;
  }
}

if (typeof window !== 'undefined') {
  window['Dialog'] = Dialog;
}

export default Dialog;
