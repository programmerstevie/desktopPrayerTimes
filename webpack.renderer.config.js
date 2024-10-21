const rules = require('./webpack.rules');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

rules.push({
  test: /\.css$/,
  use: [
    {
      loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
    },
    {
      loader: 'css-loader'
    },
    {
      loader: 'postcss-loader'
    }
  ],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};