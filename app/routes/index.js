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
    
    List
				.find({}, function (err, result) {
				if (err) { throw err; }
				
				var tempArray = result[0].stockList;
				var length = tempArray.length;

				for(var x=0;x<length;x++){
					tempArray[x] = 'NASDAQ:'+tempArray[x];
				}
				googleFinance.historical({
					symbols: tempArray
					}, function (err, news) {
					if (err){throw err;}
					var j = news;
					
					var totalSeries = [];
        if(j==null){
            client.emit('update', null);
        }
        else{
            
        var newArray;
        var colors = ['red','green','blue','orange','purple'];
        var colorCount = 0;

        for(var propName in j) {
            newArray = [];
        if(j.hasOwnProperty(propName)) {
            var propValue = j[propName];

        propValue.forEach(function(item) {
            var val = [(new Date(item.date)).getTime(),item.open];
			newArray.push(val);
        });
        
        newArray = newArray.sort(function(a, b) {
        return a[0] - b[0]; });
        var newSeries = {
		        name: propName,
		        data: newArray,
		        color: colors[colorCount]
		        };
		 colorCount++;
		 totalSeries.push(newSeries);

        // do something with each element here
         }
        }
        
        client.emit('update', totalSeries);
                
            }
				});
					
				
			});
			
/*	client.on('update', function(){
		List
				.find({}, function (err, result) {
				if (err) { throw err; }

				console.log("retrieved data: "+result[0].stockList);
				console.log(result[0].stockList);
				
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
					io.sockets.emit('update', sentArray);
					});
					
				
			});
	}); */
    
    
    
    
	client.on('delete', function(data){
		console.log("deleted "+data);
		
		var regex = /[A-Z]{2,5}$/;
			var entry = data.match(regex);
			console.log("Post request");
			console.log("REGEX: "+entry);
				
				List
					.update({}, {$pull: {'stockList': String(entry)}}, function(err, results2){
						if(err){throw err;}
					console.log(results2);
					
				List
				.find({}, function (err, result) {
				if (err) { throw err; }

				console.log("retrieved data: "+result[0].stockList);
				console.log(result[0].stockList);
				
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
					var j = news;
					
					var totalSeries = [];
        if(j==null){
            io.sockets.emit('update', null);
        }
        else{
            
        var newArray;
        var colors = ['red','green','blue','orange','purple'];
        var colorCount = 0;

        for(var propName in j) {
            newArray = [];
        if(j.hasOwnProperty(propName)) {
            var propValue = j[propName];

        propValue.forEach(function(item) {
            var val = [(new Date(item.date)).getTime(),item.open];
			newArray.push(val);
        });
        
        newArray = newArray.sort(function(a, b) {
        return a[0] - b[0]; });
        var newSeries = {
		        name: propName,
		        data: newArray,
		        color: colors[colorCount]
		        };
		 colorCount++;
		 totalSeries.push(newSeries);

        // do something with each element here
         }
        }
        
        io.sockets.emit('update', totalSeries);
                
            }
				});
					
				
			});
			});
		
		
	});
	
	client.on('add', function(data){
		console.log("added "+data);
		
		List
			.find({}, function (err, result) {
				if (err) { throw err; }

				console.log("retrieved data: "+result[0].stockList);
				
				if(!result[0].stockList.includes(data)){
					List
					.findOneAndUpdate({}, {$push: {"stockList": data}}, function(err, results2){
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
					var j = news;
					
					var totalSeries = [];
        if(j==null){
            io.sockets.emit('update', null);
        }
        else{
            
        var newArray;
        var colors = ['red','green','blue','orange','purple'];
        var colorCount = 0;

        for(var propName in j) {
            newArray = [];
        if(j.hasOwnProperty(propName)) {
            var propValue = j[propName];

        propValue.forEach(function(item) {
            var val = [(new Date(item.date)).getTime(),item.open];
			newArray.push(val);
        });
        
        newArray = newArray.sort(function(a, b) {
        return a[0] - b[0]; });
        var newSeries = {
		        name: propName,
		        data: newArray,
		        color: colors[colorCount]
		        };
		 colorCount++;
		 totalSeries.push(newSeries);

        // do something with each element here
         }
        }
        
        io.sockets.emit('update', totalSeries);
                
            }
				});
							});
						
					});
					
				}
					
			
			});
		
		
	});
	
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
