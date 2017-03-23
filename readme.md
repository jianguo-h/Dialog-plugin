This is a dialog plug-in, the mobile terminal and the PC side are applicable, can be compatible to IE8
If your project is based on jQuery, you can use the jquery.banner.min.js
However, based on jqeury, then your jQuery version should be under 2.0
The following configuration parameters, according to the needs to configure
{
			imgSrc: "",
			delay: null,           				// number type, Mean how many seconds to disappear
			width: null,
			height: null,
			color: "#fff",         				// font color
			opacity: null,         				// mask opacity
			trigger: true,         				// click mask can disappear
			fontSize: null,        				// font size
			maskShow: true,        				// whether show mask
			borderRadius: null,					// number type
			textAlign: "center",				// font location
			backgroundColor: "",
			message: "在这里填写您的信息",
			btnArr: [
				{
					color: "",
					text: "取消",
					width: null,
					height: null,
					callback: null,
					fontSize: null,
					borderRadius: null,
					backgroundColor: ""
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
		}