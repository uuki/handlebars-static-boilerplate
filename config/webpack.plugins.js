const webpack = require('webpack');
const cssnano = require('cssnano');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const beautify = require('js-beautify').html;

const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const LicenseInfoWebpackPlugin = require('license-info-webpack-plugin').default;

const { makeDataReplacements, registerHandlersHelpers } = require('./webpack.helpers.js');
const config = require('./site.config');

// Hot module replacement
const hmr = new webpack.HotModuleReplacementPlugin();

// Optimize CSS assets
const optimizeCss = new OptimizeCssAssetsPlugin({
  assetNameRegExp: /\.css$/g,
  cssProcessor: cssnano,
  cssProcessorPluginOptions: {
    preset: [
      'default',
      {
        discardComments: {
          removeAll: true,
        },
      },
    ],
  },
  canPrint: true,
});

// Generate robots.txt
const robots = new RobotstxtPlugin({
  sitemap: `${config.site_url}/sitemap.xml`,
  host: config.site_url,
});

// Clean webpack
const clean = new CleanWebpackPlugin();

// Stylelint
const stylelint = new StyleLintPlugin();

// Extract CSS
const cssExtract = new MiniCssExtractPlugin({
  filename: config.env === 'production' ? '[name].[contenthash].css' : '[name].css',
  chunkFilename: '[id].css',
  fallback: 'style-loader',
  use: [
    {
      loader: 'css-loader',
      options: { minimize: (config.env === 'production') }
    }
  ],
});

// HTML generation
const paths = [];
const generateHTMLPlugins = () => glob.sync('./src/views/layouts/*.hbs').map((dir) => {
  const filename = path.basename(dir)
  const dirname = dir.replace('./src', path.join(config.root, config.paths.src))

  if (filename !== '404.hbs') {
    paths.push(filename.replace('.hbs', '.html'));
  }

  return new HtmlWebpackPlugin({
    filename: path.join(config.root, '.generated', filename),
    template: dirname,
    inject: false,
  });
});

// Handlebars
const handlebarsPlugin = new HandlebarsPlugin({
  htmlWebpackPlugin: {
    enabled: true,
    prefix: 'html',
  },
  entry: `${config.root}/${config.paths.src}/views/pages/**/*.hbs`,
  output: (name, dir) => {
    const outputPath = path.dirname(dir).replace(`${config.root}/${config.paths.src}/views/pages`, '')
    return path.join(config.root, config.paths.dist, outputPath, `${name}.html`);
  },
  data: path.join(config.root, config.paths.src, 'data', '*.json'),
  partials: [
    path.join(config.root, '.generated', '*.hbs'),
    path.join(config.root, config.paths.src, 'views', 'partials', '*.hbs'),
  ],
  onBeforeSetup: (Handlebars) => {
    return registerHandlersHelpers(Handlebars);
  },
  // onBeforeAddPartials: (Handlebars, partialsMap) => {},
  // onBeforeCompile: (Handlebars, templateContent) => {},
  onBeforeRender: (Handlebars, data) => {
    return makeDataReplacements(data);
  },
  onBeforeSave: (Handlebars, resultHtml, filename) => {
    if (config.env !== 'production') {
      return resultHtml
    }
    return beautify(resultHtml, {
      end_with_newline: true,
      max_preserve_newlines: 0,
      indent_size: 2,
      indent_with_tabs: false,
      indent_inner_html: false,
      preserve_newlines: true,
      wrap_line_length: 80,
      unformatted: ['p', 'i', 'b', 'span', 'a']
    })
  },
  // onDone: (Handlebars, filename) => {},
});

// Sitemap
const sitemap = new SitemapPlugin(config.site_url, paths, {
  priority: 1.0,
  lastmodrealtime: true,
});

// Favicons
const favicons = new WebappWebpackPlugin({
  logo: config.favicon,
  prefix: 'images/favicons/',
  favicons: {
    appName: config.site_name,
    appDescription: config.site_description,
    developerName: null,
    developerURL: null,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: false,
      windows: false,
      yandex: false,
    },
  },
});

// Webpack bar
const webpackBar = new WebpackBar({
  color: '#ff6469',
});

// Google analytics
const CODE = `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create','{{ID}}','auto');ga('send','pageview');</script>`;

class GoogleAnalyticsPlugin {
  constructor({ id }) {
    this.id = id;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('GoogleAnalyticsPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'GoogleAnalyticsPlugin',
        (data, cb) => {
          data.html = data.html.replace('</head>', `${CODE.replace('{{ID}}', this.id) }</head>`);
          cb(null, data);
        },
      );
    });
  }
}

const google = new GoogleAnalyticsPlugin({
  id: config.googleAnalyticsUA,
});

const license = new LicenseInfoWebpackPlugin({
  glob: '{LICENSE,license,License}*',
});

module.exports = [
  clean,
  stylelint,
  cssExtract,
  ...generateHTMLPlugins(),
  handlebarsPlugin,
  fs.existsSync(config.favicon) && favicons,
  config.env === 'production' && optimizeCss,
  config.env === 'production' && robots,
  config.env === 'production' && sitemap,
  config.googleAnalyticsUA && google,
  webpackBar,
  config.env === 'development' && hmr,
  config.env === 'production' && license,
].filter(Boolean);
