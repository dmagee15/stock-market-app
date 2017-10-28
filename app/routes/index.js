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
	
	app.route('/retrievedata/')
		.get(function (req, res){
			
			List
			.find({}, function (err, result) {
				if (err) { throw err; }

				console.log("retrieved data: "+result[0].stockList);
				console.log(result[0].stockList);
				
				if(result[0].stockList.length==0){
					console.log("UNDEFINED");
					var firstList = new List({
		    				'stockList': []
							});
							firstList.save();
							res.send(null);
				}
				else{
					
				
				var tempArray = result[0].stockList;
				console.log(typeof tempArray);
				var length = tempArray.length;
				console.log(length);
				
				for(var x=0;x<length;x++){
					tempArray[x] = 'NASDAQ:'+tempArray[x];
				}
				googleFinance.historical({
					symbols: tempArray
					}, function (err, news) {
					if (err){throw err;}
					var sentArray = news;
					res.send(sentArray);
					});
					
				}	
			});
			
		});
		
	app.route('/retrievedata/:id')
		.get(function (req, res){
			
			
			List
			.find({}, function (err, result) {
				if (err) { throw err; }

				console.log("retrieved data: "+result[0].stockList);
				
				if(!result[0].stockList.includes(req.params.id)){
					List
					.findOneAndUpdate({}, {$push: {"stockList": req.params.id}}, function(err, results2){
						if(err){throw err;}
						
						List.find({}, function(err, results3){
							if(err)throw err;
							
							var tempArray = results3[0].stockList;
							console.log(typeof tempArray);
							var length = tempArray.length;
							console.log(length);
				
							for(var x=0;x<length;x++){
								tempArray[x] = 'NASDAQ:'+tempArray[x];
							}
							googleFinance.historical({
							symbols: tempArray
							}, function (err, news) {
							if (err){throw err;}
							var sentArray = news;
							res.send(sentArray);
							});
							});
						
					});
					
				}
					
			
			/*List
			.find({}, function (err, result) {
				if (err) { throw err; }

				console.log(result[0]);
				List
					.findOneAndUpdate({}, {$push: {"stockList": req.params.id}}, function(err, results2){
						if(err){throw err;}
						if(results2==null){
							console.log("THIS IS NULL");
							var firstList = new List({
		    				'stockList': [req.params.id]
							});
							firstList.save();
							List.find({}, function(err, results3){
								if(err)throw err;
								console.log(results3);
							});
							googleFinance.historical({
					symbol: 'NASDAQ:'+req.params.id
					}, function (err, news) {
					if (err){throw err;}
					var sentArray = news;
					sentArray[sentArray.length] = req.params.id;
					res.send(sentArray);
					});
						}
						else{
							List.find({}, function(err, results3){
								if(err)throw err;
								console.log(results3);
							});
							
							
							googleFinance.historical({
					symbol: 'NASDAQ:'+req.params.id
					}, function (err, news) {
					if (err){throw err;}
					var sentArray = news;
					sentArray[sentArray.length] = req.params.id;
					res.send(sentArray);
					});
						}
						
					});
			});*/
			});
		});
		
	app.route('/deletedata')
		.post(function (req,res){
			var regex = /[A-Z]{2,5}$/;
			var entry = req.body.data.match(regex);
			console.log("Post request");
			console.log("REGEX: "+entry);
				
				List
					.update({}, {$pull: {'stockList': String(entry)}}, function(err, results2){
						if(err){throw err;}
					console.log(results2);
					
					List.find({}, function(err, results3){
							if(err)throw err;
							
							console.log("Final delete results: "+results3[0].stockList);
							});
					
					
					});
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
