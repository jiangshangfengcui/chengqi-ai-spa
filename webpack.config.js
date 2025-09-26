const merge = require('webpack-merge')
const argv = require('yargs-parser')(process.argv.slice(2)) // 解析命令行参数
const { resolve } = require('path')
const _mode = argv.mode || 'development'
const _mergeConfig = require(`./config/webpack.${_mode}.js`)
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const WebpackBar = require('webpackbar');
const { ThemedProgressPlugin } = require('themed-progress-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const _modeflag = _mode === 'production' ? true : false

const webpackConfig = {
  // Your webpack configuration options go here
  entry: {
    main: resolve('src/index.tsx'),
  },
  module: {
    rules: [
      {
        //编译第一步
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
        },
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        //从右到左执行
        use: [
          MiniCssExtractPlugin.loader, // 提取css成单独文件
          // 'style-loader', // 生成style标签
          {
            loader: 'css-loader', // 1. 解析@import 2. 解析url()
            options: {
              importLoaders: 1, // 0 => css-loader; 1 => postcss-loader; 2 => sass-loader
              // publicPath: '../', // 提取css文件中图片的路径问题
            },
          },
          {
            loader: resolve(__dirname, 'loaders/transform-to-matrix-loader.js'),
            options: {
              // 可选的配置项
              precision: 6, // 小数精度
              addComments: true, // 是否添加原始值注释
            },
          },
          'postcss-loader', // 自动添加浏览器前缀
        ],
        //使用js方式插入
        // use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // },
  resolve: {
    alias: {
      '@': resolve('src/'),
      '@components': resolve('src/components'),
      '@hooks': resolve('src/hooks'),
      '@pages': resolve('src/pages'),
      '@layouts': resolve('src/layouts'),
      '@routes': resolve('src/routes'),
      '@assets': resolve('src/assets'),
      '@states': resolve('src/states'),
      '@service': resolve('src/service'),
      '@utils': resolve('src/utils'),
      '@lib': resolve('src/lib'),
      '@constants': resolve('src/constants'),
      '@connections': resolve('src/connections'),
      '@abis': resolve('src/abis'),
      '@types': resolve('src/types'),
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.css'],
    fallback: {
      // stream: require.resolve('stream-browserify'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      chunkFilename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
      ignoreOrder: false,
    }),
    new ThemedProgressPlugin(),
  ],
}
module.exports = merge.default(webpackConfig, _mergeConfig)
