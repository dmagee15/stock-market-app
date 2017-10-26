'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var List = require('../models/list.js');

module.exports = function (app, passport, googleFinance, io) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
	
	io.on('connection', function(client){
    console.log("IO CLIENT CONNECTED");
	client.on('event', function(data){});
	client.on('disconnect', function(){});
	});
	
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/dev/index.html');
		});
		
	app.route('/retrievedata/:id')
		.get(function (req, res){
			
			List
			.find({}, function (err, result) {
				if (err) { throw err; }

				console.log(result);
//				List
//					.findOneAndUpdate({}, {$push: {"stockList": req.params.id}}, function(err, results2){
//						if(err){throw err;}
//
//					});
			});
			
			googleFinance.historical({
				symbol: 'NASDAQ:'+req.params.id
				}, function (err, news) {
					if (err){throw err;}
					var sentArray = news;
					sentArray[sentArray.length] = req.params.id;
					res.send(sentArray);
			});
			
		});
		
	app.route('/deletedata')
		.post(function (req,res){
			console.log("Post request");
			console.log(req.body.data);
			res.end();
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/google')
		.get(passport.authenticate('google', { scope: ['profile'] }));

	app.route('/oauth2callback')
		.get(passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
