import "./sass/dialog.scss";
import Dialog from "./js/dialog.js";

if(module.hot) {
	module.hot.accept();
}

document.querySelector("#test").addEventListener("click", () => {
	new Dialog({
		imgSrc: "./static/images/right.png",
		btnArr: [
			{	
				callback: function() {
					alert(">>> cancel");
				}
			},
			{
				callback: function() {
					alert(">>> confirm");
				}
			}
		]
	});
});