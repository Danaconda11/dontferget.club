module.exports = {
  context: __dirname+'/public/js',
  entry: './index.jsx',
  output: {
    path: __dirname+'/public/js',
    filename: 'app.js',
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.css$/, loader: 'style-loader!css-loader'},
    ],
  },
}
