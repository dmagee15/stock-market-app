'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var List = new Schema({
		stockList: Array,
});

module.exports = mongoose.model('List', List);
