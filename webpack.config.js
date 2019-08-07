const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve('./src/components/index.jsx'),
    injectable: path.resolve('./src/devtools/injectable.js'),
    contentScript: path.resolve('./src/devtools/contentScript.js'),
  },
  output: {
    path: path.resolve('./build/'),
    filename: '[name].js',
    publicPath: '.',
  },
  module: {
    rules: [
      {
        test: /\.jsx/,
        include: path.resolve('./src/components/'),
        loader: 'babel-loader',
      },
      {
        test: /\.s?css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader?importLoaders=1',
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          { loader: 'sass-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('postcss-cssnext')],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      { from: './src/devtools/manifest.json', to: './', flatten: true },
      { from: './src/devtools/devtools.html', to: './', flatten: true },
      { from: './src/devtools/index.html', to: './', flatten: true },
      { from: './src/devtools/devtools.js', to: './', flatten: true },
      { from: './src/devtools/backgroundScript.js', to: './', flatten: true },
    ]),
  ],
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.jsx', '.scss', '.css'],
  },
  optimization: {
    minimize: false,
  },
};
