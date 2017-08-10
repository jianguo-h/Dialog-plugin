const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const copyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackBaseConfig = require("./webpack.base.config");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const webpackProdConfig = webpackMerge(webpackBaseConfig, {
	devtool: false,
	output: {
		publicPath: "./"
	},
	module: {
		rules: [
			{
				test: /\.(sass|scss)$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						"css-loader",
						"postcss-loader",
						"sass-loader"
					]
				})
			}
		]
	},
	plugins: [
		// 提取css
		new ExtractTextPlugin({
			filename: "css/dialog.min.css"
		}),
		// 移动html文件
		new HtmlWebpackPlugin({
			template: "./index.html",
			filename: "index.html",
			inject: true
		}),
		// 压缩混淆js
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			except: ['$super', '$', 'exports', 'require'],
			sourceMap: true
		}),
		// 压缩css
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require("cssnano"),
			cssProcessorOptions: { 
				discardComments: {
					removeAll: true 
				} 
			},
			canPrint: true
		}),
		// 拷贝静态文件
		new copyWebpackPlugin([{
			from: path.resolve(__dirname, "../static"),
			to: path.resolve(__dirname, "../dist/static"),
			ignore: ['.*']
		}])
	]
});

module.exports = webpackProdConfig;