const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./site.config');

// Define common loader constants
const sourceMap = config.env !== 'production';

// HTML loaders
const html = {
  test: /\.(html)$/,
  use: [
    {
      loader: 'html-loader',
      options: {
        interpolate: true,
      },
    },
  ],
};

// Javascript loaders
const js = {
  test: /\.js(x)?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
    },
    'eslint-loader',
  ],
};

// Style loaders
const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap,
    importLoaders: 1,
  },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: (loader) => [
      require('postcss-import')({ root: loader.resourcePath }),
      require('postcss-normalize')(),
      require('autoprefixer')({ grid: true }),
      ...(config.env === 'production' ? [require('@fullhuman/postcss-purgecss')({
        content: [`./${config.paths.src}/views/**/*.hbs`],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      })] : []),
    ],
    sourceMap,
  },
};

const sassPre = {
  test: /\.s[c|a]ss$/,
  enforce: 'pre',
  loader: 'import-glob-loader',
};

const sass = {
  test: /\.s[c|a]ss$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: (config.env === 'production'),
      },
    },
    cssLoader,
    postcssLoader,
    {
      loader: 'sass-loader',
      options: {
        sourceMap,
      },
    },
  ],
};

// Image loaders
const imageLoader = {
  loader: 'image-webpack-loader',
  options: {
    bypassOnDebug: true,
    gifsicle: {
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    pngquant: {
      quality: '65-90',
      speed: 4,
    },
    mozjpeg: {
      progressive: true,
    },
  },
};

const images = {
  test: /\.(gif|png|jpe?g|svg)$/i,
  exclude: /fonts/,
  use: [
    'file-loader?name=images/[name].[hash].[ext]',
    config.env === 'production' ? imageLoader : null,
  ].filter(Boolean),
};

// Font loaders
const fonts = {
  test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
  exclude: /images/,
  use: [
    {
      loader: 'file-loader',
      query: {
        name: '[name].[hash].[ext]',
        outputPath: 'fonts/',
      },
    },
  ],
};

// Video loaders
const videos = {
  test: /\.(mp4|webm)$/,
  use: [
    {
      loader: 'file-loader',
      query: {
        name: '[name].[hash].[ext]',
        outputPath: 'images/',
      },
    },
  ],
};

module.exports = [
  html,
  js,
  sassPre,
  sass,
  images,
  fonts,
  videos,
];
