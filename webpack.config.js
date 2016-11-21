var path = require('path');
var webpack = require('webpack');

require('es6-promise').polyfill();

module.exports = {
    entry: {
        'treeflow': './src/treeflow.vue'
    },
    output: {
        path: './dist',
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        sourceMapFilename: '[file].map'
    },
    module: {
        loaders: [
          {
            test: /\.vue$/,
            loader: 'vue'
          },
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules|bower_components/,
            query: {
              presets: ['es2015']
            }
          },
          {
            test: /\.json$/,
            loader: 'json'
          },
          {
            test: /\.html$/,
            loader: 'vue-html'
          },
          {
            test: /\.(png|jpg|gif|svg|ico)$/,
            loader: 'url',
            query: {
              limit: 10000,
              name: '[name].[ext]?[hash]'
            }
          },
          {
            test: /\.css$/,
            loader: 'style!css'
          },
          {
            test: /\.less$/,
            loader: 'style!css!less'
          }
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    devtool: '#eval-source-map',
    resolve: {
        root: [
          path.resolve('./bower_components'),
          path.resolve('./node_modules'),
          path.resolve('./')
        ]
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    plugins: [
        /* this has a bug when main field is a array.
        new webpack.ResolverPlugin(
          new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main']),
          ['normal', 'loader']
        ),
        */
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ])
}
