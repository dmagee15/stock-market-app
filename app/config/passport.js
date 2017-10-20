'use strict';

var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findOne({'id':id}, function (err, user) {
			done(err, user);
		});
	});
	

/*	passport.use(new GooglePlusStrategy({
		clientID: configAuth.googleAuth.clientID,
		clientSecret: configAuth.googleAuth.clientSecret,
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'google.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.google.id = profile.id;
					newUser.google.username = profile.username;
					newUser.google.displayName = profile.displayName;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));*/
	
	passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: "https://stock-market-app-dmagee15.c9users.io/oauth2callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({ 'id': profile.id }, function (err, user) {
				if (err) {
					return cb(err);
				}

				if (user) {
					return cb(null, user);
				} else {
					var newUser = new User();
					newUser.id = profile.id;
					newUser.username = profile.username;
					newUser.displayName = profile.displayName;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return cb(null, newUser);
					});
				}
			});
  }
));
	
};
