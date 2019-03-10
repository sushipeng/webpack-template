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
 webpack-dev-server 自带 express
 跨域问题，先请求webpack-dev-server 再转发3000端口
 在devServer配置

*/
/*
	全局loader 内联loader 普通loader 后置loader (postloaer)

	1.expose-loader 暴露到window
	2.providePlugin 给每个模块提供一个$
	3.引入不打包
*/

/*

yarn add webpack-dev-middleware -D
webpack提供的中间件，可以在服务端启动webpack


 yarn add webpack-merge -D
*/

// webpack自带的优化
// import 在生产环境下，会自动去除多余没有的代码
// tree-shaking 把没用到的代码，自动删除掉
// es6模块会把结果放到default上

// happypack模块，可以实现多线程来打包
let Happypack = require('happypack');

 
// yarn add postcss-loader autoprefixer -D  给样式添加前缀

let HtmlWebpackPlugin = require('html-webpack-plugin');

//  yarn add uglifyjs-webpack-plugin -D
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// yarn add mini-css-extract-plugin -D 抽离css,用link标签引入
let MiniCssExtractPlugin = require('mini-css-extract-plugin');

//  yarn add optimize-css-assets-webpack-plugin -D  压缩css
let OptimizeCss = require('optimize-css-assets-webpack-plugin');

/*
	clean-webpack-plugin 清除dist文件 默认情况下，此插件将删除webpack output.path目录中的所有文件
	copy-webpack-plugin  把一些说明文档也打包到dist目录下
	bannerPlugin 内置的  添加版权信息 插入到js、css头部，要先 require('webpack')
*/
let CleanWebpackPlugin = require('clean-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

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
	    ],
	    // 多个入口文件，抽离公共代码块
	    // 以前 commonChunkPlugins
	    splitChunks: {
	    	cacheGroups: {
	    		// 抽离自己的文件
	    		common: {
	    			chunks: 'initial',
	    			minSize:0, //文件大小
	    			minChunks:2 // 引用1次以上
	    		},
	    		// 第三方公共代码抽离
	    		vender: {
	    			priority:1, //权重
	    			test: /node_modules/, // 把你抽离出来
	    			chunks: 'initial',
	    			minSize:0, //文件大小
	    			minChunks:2 // 引用1次以上
	    		}
	    	}
	    }
  	},
	devServer: { // 开发服务器配置
		host:'localhost',    //服务器的ip地址
        port:3000,    //端口
        open:true,    //自动打开页面
		progress:true,
		contentBase:'./dist',
		proxy: {
			// 解决跨域第一种方法：代理
			// '/api': 'http://localhost:4240' //配置一个代理，接口为api开头的，转发个4200端口
			/*
			'/api': {
				target:'http://localhost:4240',
				pathRewrite: {'/api':''} // 重写方法把/api去掉
			}
			*/
			// 解决跨域第二种方法：mock， 不需要服务端
			/*before(app) { 
				app.get('/api/user', (req,res) => {
					res.json({name:'html css js'});
				})
			}*/
			// 解决跨域第三种方法：有服务端，不想用代理的数据，能不能在服务端中启动webpack，端口用服务端端口
		}
	},
	mode: 'development', // 模式 默认两种 production(默认) development none(禁用任何默认行为)
	devtool: 'source-map', // 增加映射文件，调试代码, source-map源码映射，单独生成sourceMap文件，报错时输出列和行
	// devtool: 'eval-source-map', // 不会产生独立的文件，但是可显示列和行
	// devtool: 'cheap-module-source-map', // 不会产生列,但是个独立的文件,产生后可以保留起来
	// devtool: 'cheap-module-eval-source-map', // 不会生成文件，集成在打包后的文件中，也不会产生列
	entry: './src/index.js', // 默认找./src/index.js作为默认入口
	/*entry: { // 多入口
		home: './src/home.js',
		other: './src/other.js'
	},
	output: { // 多出口
		filename: [name].[hash:8].js, // nema代表 home、other
		path:path.resolve(__dirname, '../dist'), 
	},*/
	watch:false, // 监听文件变化，自动编译
	watchOptions: { //监控的选项
		poll: 1000, // 每秒访问1000次
		aggregateTimeout:500, // 防抖,500毫秒内打包一次
		ignored: /node_modules/ // 不需要监控
	},
	resolve: { // 解析 第三方包 common
		modules: [path.resolve('node_modules')],
		extensions:['.js','.ts','.css','.json'], // import进来文件不写后缀时，查找的顺序
		// mainFields:['style','main'] // 先到node_modules里对应模块下的package.json中查找，先找style字段，找不到，再去main查找
		// mainFields:[] // 入口文件的名字 默认index.js
		alias: { // 别名
			'bootstrapcss':'bootstrap/dist/css/bootstrap.css'
		}
	},
	output: {
		filename: 'bundle.[hash:8].js', // 默认打包文件main.js 文件名添加哈希值,限制为8位，每次打包生成不同文件，解决缓存
		path:path.resolve(__dirname, '../dist'),//默认出口文件夹dist, path.resolve('dist') 打包文件的路径，必须是个绝对路径
		// publicPath: 'http://www.baidu.cn/' // 打包后自动给资源文件添加服务器地址
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
		/*
		new HtmlWebpackPlugin({
			template: './src/index.html', 
			filename: 'home.html', 
			chunks: ['home']
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html', 
			filename: 'other.html', 
			chunks: ['home','other']
		}),
		*/

		new MiniCssExtractPlugin({
			filename: 'styles/main.css' // 抽离生成的css名称
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
        }),
        new CleanWebpackPlugin({}), // ['../dist', '../build'] 多个
        new CopyWebpackPlugin([
        		{from: './docs', to: './'}
        	]),
        new webpack.BannerPlugin('author: shipeng'),
        new webpack.DefinePlugin({ //定义一个宏变量，判断开发环境和生成环境
        	DEV: JSON.stringify('dev'), // production
        	name: "'haha'",
        	FLAG: 'true'
        }),
        // 忽略某些内容
        new webpack.IgnorePlugin(/\.\/locale/,/moment/),
        new Happypack({
        	id: 'js',
        	use: [{
				loader: 'babel-loader',
				options: { // 用babel-loader 将es6 -> es5 
					presets: [
						'@babel/preset-env', // 转换所以es6语法
						'@babel/preset-react'
					],
					plugins: [
					    ['@babel/plugin-proposal-decorators', {'legacy': true}],
						['@babel/plugin-proposal-class-properties', {'loose':true}]
					]
				}
			}]
        }),
        /*new Happypack({
        	id: 'css',
        	use: [{
				loader: ['style-loader','css-loader']
			}]
        })*/
	],
	// externals: {
	// 	jquery: '$'
	// }
	module: { // 模块
		noParse: /jquery/, // import jquery 引入jq的不解析
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
				],
				// use: 'happypack/loader?id=css'
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
				exclude: /node_modules/,
				include:path.resolve('src'),
				/*use: {
					loader: 'babel-loader',
					options: { // 用babel-loader 将es6 -> es5 
						presets: [
							'@babel/preset-env', // 转换所以es6语法
							'@babel/preset-react'
						],
						plugins: [
						    ['@babel/plugin-proposal-decorators', {'legacy': true}],
							['@babel/plugin-proposal-class-properties', {'loose':true}]
						]
					}
				},*/
				use: 'happypack/loader?id=js'
			},
			{
				// expose-loader 暴露全局window
				test: require.resolve('jquery'),
				use: 'expose-loader?$'
			},
			{
				/* 
				    yarn add  file-loader -D 处理js添加的图片
				    yarn add html-withimg-loader -D 处理img标签的图片
				    yarn add url-loader -D 可以生成base64，也可以处理js添加的图片

					webpack打包图片
					1.js中创建的图片来引入
					2.css的background('url') ，css-loader已经处理了
					3.img标签
					file-loader 默认在内部生成一张图片，到dist目录下
					把生成的图片名字返回
				*/
				test: /\.(png|jpg|gif)$/,
				// use: 'file-loader'
				use: {
					loader: 'url-loader',
					options: {
						// limit:1, // 1k 全部真实图片
						limit: 200*1024, // 图片小于200k用base64引入，否则用file-loader生成真实图片
						outputPath: 'images/',  // 图片生成到该目录下
						// publicPath: 'http:www.baidu.cn/' // 只想给图片添加服务器地址
					}
				}
			},
			{
				test: /\.html$/,
				use: 'html-withimg-loader'
			}
		]

	}
}
