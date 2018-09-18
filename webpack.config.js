var webpack = require('webpack');
var path = require('path');

var DEV = path.resolve(__dirname, "dev");
var OUTPUT = path.resolve(__dirname, "output");

var config = {
  entry: ['whatwg-fetch', DEV + "/index.jsx"],
  output: {
      path: OUTPUT,
      filename: "myCode.js"
  },
  module: {
      rules: [
    {
        include: DEV,
        test: /.jsx?$/,

        use: [{
          loader: 'babel-loader',

          options: {
            presets: ['es2015', 'react'],  
            plugins: ["transform-class-properties", "transform-object-rest-spread"]
          }
        }],

        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }]
  }
};
module.exports = config;