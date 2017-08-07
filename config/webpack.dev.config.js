const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackBaseConfig = require("./webpack.base.config");

const webpackDevConfig = webpackMerge(webpackBaseConfig, {
	devtool: "#cheap-module-eval-source-map",
	module: {
		rules: [
			{
				test: /\.(sass|scss)$/,
				use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: "./index.html",
			filename: "index.html",
			inject: true
		})
	]
});

module.exports = webpackDevConfig;