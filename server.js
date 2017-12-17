'use strict';


var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var bodyparser = require('body-parser');
var path = require('path');
var yahooFinance = require('yahoo-finance');

var app = express();
require('dotenv').load();
var http = require('http').createServer(app);

var port = process.env.PORT || 8080;
http.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

var io = require('socket.io')(http);


mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
app.use(bodyparser.urlencoded({'extended': true}));
app.use(bodyparser.json())

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/dev', express.static(process.cwd() + '/dev'));
app.use('/output', express.static(process.cwd() + '/output'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


routes(app, yahooFinance, io);
