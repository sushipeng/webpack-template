/*
 webpack-dev-server 自带 express
*/

let express = require('express');
let app = express();
let webpack = require('webpack');
let middle = require('webpack-dev-middleware');
let config = require('./environments/webpack.config.js');
let compiler = webpack(config);

app.use(middle(compiler));

app.get('/api/user', (req,res) => {
	res.json({name:'html css js'});
})

app.listen('4240');