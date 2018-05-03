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
    console.log('>>>> opts', opts);
    this.defaults = defaults;
  }
  confirm() {

  }
  message() {

  }
  alert() {

  }
  close() {

  }
  render() {

  }
}

if(typeof window !== 'undefined') {
  window['Dialog'] = Dialog;
}
export default Dialog;