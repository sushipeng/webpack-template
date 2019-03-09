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


