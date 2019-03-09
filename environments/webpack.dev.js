/*
 运行npx webpack，node8.2后提供npx命令，运行./node_modules/.bin/webpack的webpack 二进制文件
 webpack4.0后为零配置，默认入口文件./src/index.js，默认出口文件./dist/main.js,所以webpack.config.js不是必须的
 没有webpack.config.js配置文件时，直接运行npx webpack，会有警告WARNING in configuration......
 解决： 
 1. npx webpack --mode="development" 
 2. webpack --mode="development"(要全局安装webpack)
 3. 配置文件指定 mode: 'development'
 4. package.json里scripts添加 "build": "npx webpack --mode production" 或 "build": "webpack --mode production"(要全局安装webpack)

package.json里
build": "webpack --config=webpack.config.js" // 指定配置文件为webpack.config.js 
build:dev": "webpack --config=webpack.dev.js" // 指定配置文件为webpack.dev.js 
*/


let path = require('path');

module.exports = {
	mode: 'development', // 模式 默认两种 production(默认) development none(禁用任何默认行为)
	entry: './src/index.js', // 默认找./src/index.js作为默认入口
	output: {
		filename: 'bundle.js', // 默认打包文件main.js
		path:path.resolve(__dirname, '../dist'),//默认出口文件夹dist, path.resolve('dist') 打包文件的路径，必须是个绝对路径
	}
}