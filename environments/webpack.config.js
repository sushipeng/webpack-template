/*
 运行npx webpack，node8.2后提供npx命令，运行./node_modules/.bin/webpack的webpack 二进制文件
 webpack4.0后为零配置，默认入口文件./src/index.js，默认出口文件./dist/main.js,所以webpack.config.js不是必须的
 没有webpack.config.js配置文件时，直接运行npx webpack，会有警告WARNING in configuration......
 解决： 
 1. npx webpack --mode="development" 
 2. webpack --mode="development"(要全局安装webpack)
 3. 配置文件指定 mode: 'development'
 4. package.json里scripts添加 "build": "npx webpack --mode production" 
   或 "build": "webpack --mode production"(要全局安装webpack)

package.json里
build": "webpack --config=webpack.config.js" // 指定配置文件为webpack.config.js  npx可以不写
build:dev": "webpack --config=webpack.dev.js" // 指定配置文件为webpack.dev.js 

如果在cli传参要加上 --
package.json里 build": "webpack"
运行 npm run build -- --config=webpack.config.js

*/

/*
	全局loader 内联loader 普通loader 后置loader (postloaer)

	1.expose-loader 暴露到window
	2.providePlugin 给每个模块提供一个$
	3.引入不打包

*/

// yarn add postcss-loader autoprefixer -D  给样式添加前缀

let HtmlWebpackPlugin = require('html-webpack-plugin');

//  yarn add uglifyjs-webpack-plugin -D
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// yarn add mini-css-extract-plugin -D 抽离css,用link标签引入
let MiniCssExtractPlugin = require('mini-css-extract-plugin');

//  yarn add optimize-css-assets-webpack-plugin -D  压缩css
let OptimizeCss = require('optimize-css-assets-webpack-plugin');

let webpack = require('webpack');

let path = require('path');

module.exports = {
	 optimization: { // 优化项,只在生成环境下有效
	 	// minimize: true,
	    minimizer: [ // 压缩js
	      new UglifyJsPlugin({
	        cache: true,
	        parallel: true,
	        sourceMap: true, // set to true if you want JS source maps
	        exclude: /\/excludes/,
	      }),
	      new OptimizeCss({}) // 压缩css
	    ]
  	},
	devServer: { // 开发服务器配置
		host:'localhost',    //服务器的ip地址
        port:3000,    //端口
        open:true,    //自动打开页面
		progress:true,
		contentBase:'./dist'
	},
	mode: 'development', // 模式 默认两种 production(默认) development none(禁用任何默认行为)
	entry: './src/index.js', // 默认找./src/index.js作为默认入口
	output: {
		filename: 'bundle.[hash:8].js', // 默认打包文件main.js 文件名添加哈希值,限制为8位，每次打包生成不同文件，解决缓存
		path:path.resolve(__dirname, '../dist'),//默认出口文件夹dist, path.resolve('dist') 打包文件的路径，必须是个绝对路径
	},
	plugins: [ // 数组，配置所有webpack插件
		new HtmlWebpackPlugin({
			template: './src/index.html', // 模板
			filename: 'index.html', // 打包后文件名
			minify: {
				removeAttributeQuotes:true, // 删除双引号
				collapseWhitespace:true, //压缩成一行
			},
			hash: true // js添加哈希戳
		}),
		new MiniCssExtractPlugin({
			filename: 'main.css' // 抽离生成的css名称
		}),
		// 配置开发环境下压缩css
		new OptimizeCss({
			// assetNameRegExp: /\.style\.css$/g,
            cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
            cssProcessorOptions: { 
            	discardComments: { removeAll: true } 
            },
            canPrint: true //是否将插件信息打印到控制台
        }),
        new webpack.ProvidePlugin({ // 提供插件，在每个模块中注入$, 不需要import $ from 'jquery'
        	$:'jquery'
        })
	],
	// externals: {
	// 	jquery: '$'
	// }
	module: { // 模块
		rules: [ //规则
		    // loader 特点：希望单一
		    // loader顺序：默认从右到左执行
			{
				// css-loader 解析@import语法
				// style-loader 把css插入到head标签中
				test: /\.css$/,
				// use: 'css-loader', // 一个loader
				// use: ['style-loader','css-loader'] // 多个loader

				use: [
				  /*{
				    loader: 'style-loader', // 可以传参数
				    options:{
				    	insertAt:'top' // 默认插入到head底部
				    }
				  },*/
				  MiniCssExtractPlugin.loader,
				  'css-loader',// 解析路径
				  'postcss-loader'
				]
			},
			{
				//  yarn add less less-loader -D
				test: /\.less$/,
				use: [
					/*{
						loader: 'style-loader',
				        options:{
				    	  insertAt:'top' 
					    }
					},*/
					 MiniCssExtractPlugin.loader,
					'css-loader',
				    'postcss-loader',
					'less-loader' // less->css
				]
			},
			{
				//  yarn add node-sass sass-loader -D
				test: /\.scss$/,
				use: [
					{
						loader: 'style-loader',
				        options:{
				    	  insertAt:'top' 
					    }
					 },
					'css-loader',
				    'postcss-loader',
					'sass-loader' // scss->css
				]
			},
			{
				//  yarn add stylus stylus-loader -D
				test: /\.styl$/,
				use: [
					{
						loader: 'style-loader',
				        options:{
				    		insertAt:'top'
				    	}
					},
					'css-loader',
				    'postcss-loader',
					'stylus-loader' // stylus->css
				]
			},
			{
				//  yarn add babel-loader @babel/core @babel/preset-env -D
				//  yarn add @babel/plugin-proposal-class-properties -D
				// yarn add @babel/plugin-proposal-decorators -D
				test: '/\.js$/',
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: { // 用babel-loader 将es6 -> es5 
						presets: [
							' @babel/preset-env' // 转换所以es6语法
						],
						plugins: [
						    ['@babel/plugin-proposal-decorators', {'legacy': true}],
							['@babel/plugin-proposal-class-properties', {'loose':true}]
						]
					}
				}
			},
			{
				// expose-loader 暴露全局window
				test: require.resolve('jquery'),
				use: 'expose-loader?$'
			}
		]

	}
}