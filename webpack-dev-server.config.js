var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');

module.exports = {
    entry: [
      'webpack/hot/dev-server',
      'webpack/hot/only-dev-server',
      path.join(__dirname, '/src/js/todo.reflux.component.js')
    ],
    resolve:{
        extensions:['','.js','.jsx']
    },
    devServer:{
      contentBase: 'src/www',  //Relative directory for base of server
      devtool: 'eval',
      hot: true,        //Live-reload
      inline: true,
      port: 3000        //Port Number
    },    
    devtool: 'eval',
    output: {
        path: buildPath,
        filename: "todo.reflux.component.js"
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new TransferWebpackPlugin([
        {from: 'www'}
      ], path.resolve(__dirname, "src"))
    ],
    module: {    
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react'], //react-hot is like browser sync and babel loads jsx and es6-7
          exclude: [nodeModulesPath]
        },        
        { test: /\.css$/, loader: "style!css" },
        { test: /\.less/,loader: 'style-loader!css-loader!less-loader'}
      ]
    }
};
/*
var path = require("path");
var webpack=require("webpack");
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'build');

//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    path.join(__dirname, '/src/js/todo.reflux.component')
  ],
  output: {
    path: buildPath,  //打包输出的路径
    filename: 'todo.reflux.component.js',            //打包后的名字      
  },
  devServer:{
    contentBase: 'src/www',  //Relative directory for base of server
    devtool: 'eval',
    hot: true,        //Live-reload
    inline: true,
    port: 3000        //Port Number
  },
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.jsx?$/, 
        loaders: ['react-hot','babel?presets[]=react,presets[]=es2015,presents[]=stage-0'],
        //include: [path.resolve(__dirname, "src/js")],
        exclude: [nodeModulesPath],
      },
      {test: /\.css$/, loader: "style!css"},
      {test: /\.(jpg|png)$/, loader: "url?limit=8192"},
      {test: /\.scss$/, loader: "style!css!sass"}
    ]
  },
  resolve: {
    // 现在可以写 require('file') 代替 require('file.coffee')
    extensions: ['', '.js', '.json'] 
  },
  plugins: [    //Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Moves files
    new TransferWebpackPlugin([
      {from: 'www'}
    ], path.resolve(__dirname, "src"))
  ]
};
*/