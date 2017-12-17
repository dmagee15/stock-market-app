'use strict';

var path = process.cwd();
var List = require('../models/list.js');

module.exports = function (app, yahooFinance, io) {
	
	io.on('connection', function(client){
    console.log("IO CLIENT CONNECTED");
    List
				.find({}, function (err, result) {
				if (err) { throw err; }
				if(result[0]==undefined){
					var newList = new List();
					newList.stockList = [];
					newList.save();
					client.emit('update', null);
				}
				else{
				var tempArray = result[0].stockList;
				if(tempArray.length==0){
					client.emit('update', null);
				}
				else{
				yahooFinance.historical({
					symbols: tempArray,
					from: '2012-01-01',
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

         }
        }
        
        client.emit('update', totalSeries);
                
            }
				});
				}
				}
			});
    
	client.on('delete', function(data){


				List
					.update({}, {$pull: {'stockList': data}}, function(err, results2){
						if(err){throw err;}

				List
				.find({}, function (err, result) {
				if (err) { throw err; }

				if(result[0].stockList.length==0){
					client.emit('update', null);
				}
				else{
				var tempArray = result[0].stockList;
				
				yahooFinance.historical({
					symbols: tempArray,
					from: '2012-01-01',
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

         }
        }
        
        io.sockets.emit('update', totalSeries);
                
            }
				});
				}	
				
			});
			});
		
		
	});
	
	client.on('add', function(data){

        List
			.find({}, function (err, result) {
				if (err) { throw err; }

				if(!result[0].stockList.includes(data) && result[0].stockList.length<5){
					
					var tempArray = result[0].stockList;
					tempArray.push(data.toUpperCase());
					yahooFinance.historical({
					symbols: tempArray,
					from: '2012-01-01',
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

         }
        }
        var k = totalSeries.filter(removeEmpty);
					if(totalSeries.length==k.length){
						List
						.findOneAndUpdate({}, {$push: {"stockList": data.toUpperCase()}}, function(err, results2){
						if(err){throw err;}
						});
                		io.sockets.emit('update', totalSeries);
					}
					else{
						io.sockets.emit('update', k);
					}

            }
				});
						
					
					
				}
				else{
					var tempArray = result[0].stockList;
					yahooFinance.historical({
					symbols: tempArray,
					from: '2012-01-01',
					}, function (err, news) {
					if (err){throw err;}
					var j = news;
					var totalSeries = [];
        if(j==null){
            io.sockets.emit('update', null);
        }
        else{
            
        var newArray;
        var colors = ['red','green','blue','orange','purple','yellow','black'];
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

         }
        }
        io.sockets.emit('update', totalSeries);

            }
				});
				}	
			
			});
		
		
		
	});
	function removeEmpty(series){
		return series.data.length>0;
	}
	client.on('disconnect', function(){});
	});
	
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/dev/index.html');
		});


};
