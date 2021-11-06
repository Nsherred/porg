const path = require('path')
const webpack = require('webpack')
const smp = new (require('speed-measure-webpack-plugin'))()
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')


module.exports = smp.wrap((env, argv) => {
  const isDevelop = argv.mode === 'development'
  const log = isDevelop
    ? require('single-line-log').stdout
    : () => {
    }

  return {
    cache: true,
    entry: {
      main: './src/index.tsx',
    },
    devServer: {
      contentBase: './dist',
    },
    devtool: isDevelop
      ? 'cheap-module-eval-source-map'
      : false /* 'source-map' */,
    module: {
      rules: [
        // see https://webpack.js.org/guides/typescript/
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true
            // use the following only when you need a really fast initial build
            // transpileOnly: true
          }
        },
        {
          test: /\.(jpg|jpeg|png|gif|webm|mp4)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/img/',
              publicPath: 'assets/img/'
            }
          }
        },
        {
          test: /\.(mp3|wav|wma|ogg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/audio/',
              publicPath: 'assets/audio/'
            }
          }
        },
        {
          test: /\.s[ac]ss$/,

          use: [

            // Creates `style` nodes from JS strings - although we're not using
            // that; see below. Storybook, however, uses it.
            // 'style-loader',

            // even though the documentation says to only use this
            MiniCssExtractPlugin.loader,

            // Translates CSS into CommonJS
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            // compile SASS to CSS
            // https://github.com/webpack-contrib/sass-loader
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }

          ]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'], // , '.scss', '.css', '.mp3'
      modules: ['node_modules'],
      symlinks: false
    },

    // turn off al optimizations in development mode
    optimization: isDevelop
      ? {
        namedModules: false,
        namedChunks: false,
        flagIncludedChunks: false,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false
      }
      : {},

    // https://webpack.js.org/guides/output-management/
    output: {
      pathinfo: true,
      filename: '[name]/index.[hash].js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [

      new webpack.ProgressPlugin({
        entries: true,
        modules: true,
        modulesCount: 100,
        profile: false,
        handler: (percentage, message, ...args) =>
          log(`${(percentage * 100).toFixed(1)}%`, message, ...args)
      }),
      new HtmlWebpackPlugin({
        title: 'LVMO MOST',
        template: 'public/index.html',
        favicon: 'public/favicon.ico',
        excludeChunks: ['web', 'link']
      }),
      new CopyPlugin({
        patterns: [
          {from: 'public/images', to: 'assets/img'},
          {from: 'public/manifest.json', to: 'manifest.json'}
        ]
      }),
      new CleanWebpackPlugin(),

      // filter out moment locales
      // see https://webpack.js.org/plugins/context-replacement-plugin/
      new webpack.ContextReplacementPlugin(/moment[/\\]locale/, /en\.js/),

      // https://github.com/webpack-contrib/mini-css-extract-plugin
      new MiniCssExtractPlugin({
        filename: '[name]/index.[hash].css',
        ignoreOrder: false
      }),

      // new ManifestPlugin(),

      new WorkboxPlugin.InjectManifest({
        swSrc: './src/service-worker.ts',
      })
    ],
    stats: {
      // suppress some of the noisy mini-css-extract output
      children: false
    },
    watchOptions: {
      ignored: ['**/*.js', 'node_modules']
    }
  }
})
