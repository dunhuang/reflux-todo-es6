var path = require("path");
var webpack=require("webpack");

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
  entry: {
    "todo.reflux.component":"./src/js/todo.reflux.component"
  },
  output: {
    path: path.join(__dirname, './build'),  //打包输出的路径
    filename: '[name].js',            //打包后的名字
    publicPath: "/build/"       
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/, 
        loader: "babel-loader", //'babel?presets[]=react,presets[]=es2015'
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015','stage-0']
        }
      },
      {test: /\.css$/, loader: "style!css"},
      {test: /\.(jpg|png)$/, loader: "url?limit=8192"},
      {test: /\.scss$/, loader: "style!css!sass"}
    ]
  },
  externals: {
      //don't bundle the 'react' npm package with our bundle.js
      //but get it from a global 'React' variable
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react/addons':'React',
      'reflux': 'Reflux'
  },
  resolve: {
    // 现在可以写 require('file') 代替 require('file.coffee')
    extensions: ['', '.js', '.json', '.coffee'] 
  },
  plugins: [commonsPlugin]
};