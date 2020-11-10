const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('./site.config');

// Optimize JS
const uglify = new UglifyJsPlugin({
  test: /\.js$/,
  exclude: /node_modules/,
  sourceMap: false,
  uglifyOptions: {
    ie8: false,
    mangle: false,
    compress: {
      drop_console: true,
    },
    output: {
      beautify: false,
      comments: /^\**!|@preserve|@license|@cc_on/,
    }
  }
});

module.exports = {
  namedChunks: true,
  splitChunks: {
    automaticNameDelimiter: '-',
    cacheGroups: {
      vendors: false,
    },
  },
  // minimizer: [
  //   config.env === 'production' && uglify,
  // ].filter(Boolean)
}