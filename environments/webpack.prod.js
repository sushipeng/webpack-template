let {smart} = require('webpack-merge');
let base = require('./webpack-base.js');

// "build": "webpack --config=environments/webpack.prod.js",
module.exports = smart(base, {
	mode: 'production',
})

