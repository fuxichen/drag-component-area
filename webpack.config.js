var path = require('path');
const { DefinePlugin } = require('webpack');
const NODE_ENV = process.env.NODE_ENV;
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: NODE_ENV === 'development' ? './src/main.js' : './index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: NODE_ENV === 'development' ? '' : '/dist/',
    filename: 'drag-component.js',
    library: {
      name: 'drag-component',
      type: 'umd2',
    },
    umdNamedDefine: true,
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
        sideEffects: true
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
            sass: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax'],
          },
          // other vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "/public"),
    },
    historyApiFallback: true,
    compress: true,
    hot: true,
    client: {
      progress: true,
      webSocketURL: {
        hostname: '0.0.0.0',
      },
      overlay: {
        errors: true,
        warnings: true,
      },
    },
    host: 'local-ip',
    allowedHosts: 'all',
    open: {
      app: {
        name: 'chrome',
        arguments: ['--incognito'], // , '--new-window'
      },
    },
  },
  performance: {
    hints: false,
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
        template: "./public/index.html", // html模板文件
        filename: "index.html", // 打包后生成的html文件叫做index.html
        favicon: path.resolve(__dirname, "public/favicon.ico"),
        url: process.env.NODE_ENV !== 'production' ? "" : ".",
        title: "justest",
      }),
    new VueLoaderPlugin(),
    new DefinePlugin({
      BASE_URL: '"./"',
    }),
  ],
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          sourceMap: true,
          output: {
            comments: false, //去掉注释
          },
          compress: {
            drop_debugger: true,
            drop_console: true,
          },
        },
      }),
    ],
  },
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'source-map';
  let externals = module.exports.externals || {}
  externals.vue = {
    root: 'Vue',
    commonjs: 'vue',
    commonjs2: 'vue',
    amd: 'vue',
  }
  module.exports.externals = externals
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new BundleAnalyzerPlugin(),
  ]);
}
