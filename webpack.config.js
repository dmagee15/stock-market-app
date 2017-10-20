var webpack = require('webpack');
var path = require('path');

var DEV = path.resolve(__dirname, "dev");
var OUTPUT = path.resolve(__dirname, "output");

var config = {
  entry: ['whatwg-fetch',DEV + "/index.jsx"],
  output: {
      path: OUTPUT,
      filename: "myCode.js"
  },
  module: {
      loaders: [{
          include: DEV,
          test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }]
  }
};
module.exports = config;