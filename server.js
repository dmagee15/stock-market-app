'use strict';


var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyparser = require('body-parser');
var googleFinance = require('google-finance');
var path = require('path');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

/*const React = require('react');
const ReactDOM = require('react-dom');

const ReactHighcharts = require('react-highcharts'); // Expects that Highcharts was loaded in the code.

const config = {
  chart: {
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
};

ReactDOM.render(<ReactHighcharts config = {config}></ReactHighcharts>, document.body);
*/
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
app.use(bodyparser.urlencoded({'extended': false}));

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/dev', express.static(process.cwd() + '/dev'));
app.use('/output', express.static(process.cwd() + '/output'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


routes(app, passport, googleFinance);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
