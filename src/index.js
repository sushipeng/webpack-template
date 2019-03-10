require('./styles/demo.css');
require('./styles/demo.less');
require('./styles/demo.scss');
require('./styles/demo.styl');

// expose-loader 暴露全局
// import $ from 'expose-loader?$!jquery';
// import $ from 'jquery';
// console.log($)
// console.log(window.$)

let fn = () => {
	let a = 96;
	console.log(a);
}

/*fn();
function log(targer) {
	console.log(targer)
}
@log
class A {
  constructor() {
  	console.log(9999)
  }
}*/

  
import logo from  './images/1.jpg'; // 引入图片，返回一个新的图片地址
let image =  new Image();
image.width = '150';
image.height = '150';
image.src = logo;
document.body.appendChild(image);


// ==================
// webpack
let xhr = new XMLHttpRequest();
// xhr.open('GET', 'http://localhost:4240/api/user',true); // 写死会跨域
xhr.open('GET', '/api/user',true); 
xhr.onload = function() {
	console.log(xhr.response);
}
// xhr.send();

// import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrapcss';

// console.log(DEV)

import moment from 'moment';
import 'moment/locale/zh-cn'; //手动引入需要的语言
// 设置语言
moment.locale('zh-cn');
let r = moment().endOf('day').fromNow();
// console.log(r)


import React from 'react';
import {render} from 'react-dom';

// render(<h1>jsx</h1>,window.root);



// scope hosting 作用域提升
// webpack中自动省略一些可以简化的代码
// 生产环境下有效
let a=1;
let b=2;
let c=3;
let d=a+b+c;
// console.log(d)