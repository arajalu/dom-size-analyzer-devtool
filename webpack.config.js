const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    path.resolve('./src/components/index.jsx')
  ],
  output: {
    path: path.resolve('./build/'),
    filename: 'app.js',
    publicPath: '.'
  },
  module: {
    rules: [
      {
        test: /\.jsx/,
        include: path.resolve('./src/components/'),
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader?importLoaders=1',
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          {loader: 'sass-loader'},
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('postcss-cssnext')
                ];
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      { from: './src/devtools/*', to: './' ,flatten:true},
    ]),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css']
  },
};
