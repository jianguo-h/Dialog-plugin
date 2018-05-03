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
// Dialog 默认参数
const defaults = {
  message: '',            // 提示的内容, default: ""
  mask: true,             // 是否需要遮罩层, default: true
  maskClose: true,        // 点击遮罩层是否关闭(maskShow为true时方有效), default: true
  confirmText: '确定',    // 确定按钮的文字, default: '确定'
  cancelText: '取消'      // 取消按钮的文字, default: '取消'
}
class Dialog {
  constructor(opts) {
    // console.log('>>>> opts', opts);
    this.defaults = defaults;
  }
  confirm() {

  }
  message() {
    const vnode = {
      tag: 'div',
      props: {
        className: 'dialog-wrap'
      },
      // children: null
      children: [
        { tag: 'div', props: { className: 'dialog-mask' }, children: null },
        { tag: 'div', props: { className: 'dialog-box gradientShow' },
          children: [
            { tag: 'div', props: { className: 'dialog-content' },
              children: [
                { tag: 'span', props: { className: 'icon-success' }, children: null },
                { tag: 'p', props: { className: 'dialog-message' }, children: '在这里填写您的信息' }
              ]
            }
          ]
        }
      ]
    };
    this.render(vnode);
  }
  alert() {

  }
  close() {

  }
  render(vnode) {
    if(type(vnode) !== 'object') {
      console.error('vnode is not an object', vnode);
      return;
    }
    let node;
    const { tag, props, children } = vnode;
    const childrenType = type(children);
    const nodeType = judgeNodeType(vnode);
    // debugger;
    console.log('>>>>> nodeType', nodeType);
    if(nodeType === TEXT_NODE) {
      node = createTextNode(children);
    }
    else if(nodeType === EMPTY_NODE) {
      node = createEmptyNode(tag, props);
    }
    else {
      // debugger;
      node = createEmptyNode(tag);
      let childNode;
      if(childrenType === 'array') {
        for(const child of children) {
          childNode = this.render(child);
          node.appendChild(childNode)
        }
      }
      else if(childrenType === 'string' || childrenType === 'number') {
        childNode = createTextNode(children);
        node.appendChild(childNode);
      }
    }

    console.log('>>>>> node', node);
    return node;
  }
  mounted() {
    document.body.appendChild();
  }
}

if(typeof window !== 'undefined') {
  window['Dialog'] = Dialog;
}
export default Dialog;