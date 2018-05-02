/* <div class="dialog-mask">
  <div class="dialog-box dialog-box-pc gradientShow">
    <img src="./static/images/right.png" class="dialog-img">
    <p class="dialog-content">在这里填写您的信息</p>
    <div class="dialog-btns-box">
      <span class="dialog-btn1">取消</span>
      <span class="dialog-btn2">确定</span>
    </div>
  </div>
</div> */
import './dialog.scss';
class Dialog {
  constructor(opts) {
    console.log('>>>> opts', opts);
  }
}

if(typeof window !== 'undefined') {
  window['Dialog'] = Dialog;
}
export default Dialog;