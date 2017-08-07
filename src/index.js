import "./sass/dialog.scss";
import Dialog from "./js/dialog.es6.js";
if(module.hot) {
	module.hot.accept();
}
new Dialog({
	imgSrc: "./static/images/right.png",
	btnArr: [
		{	
			text: "取消",
			callback: function() {
				// console.log(1);
				alert(1);
			}
		},
		{
			text: "确定",
			callback: function() {
				// console.log(2);
				alert(2);
			}
		},
		{
			text: "提交",
			callback: function() {
				// console.log(3);
				alert(3);
			}
		}
	]
});