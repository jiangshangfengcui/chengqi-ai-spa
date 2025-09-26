const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve, join } = require('path')
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const port = 3000

module.exports = {
  devServer: {
    // 但页面的spa应用，任意路由都映射到index.html
    historyApiFallback: true,
    static: {
      directory: join(__dirname, '../dist'),
    },
    hot: true,
    port,
  },
  output: {
    publicPath: '/',
    // 如果是通过loader编译的文件，放到scripts目录下
    filename: 'scripts/[name].bundle.js',
    // 如果是通过asset module处理的文件，放到images目录下 图片不需要loader
    assetModuleFilename: 'images/[name].[ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Chengqi AI SPA',
      template: resolve(__dirname, '../src/index-dev.html'),
      filename: 'index.html',
      favicon: resolve(__dirname, '../public/favicon.ico'),
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   minifyCSS: true,
      //   minifyJS: true,
      // },
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here http://localhost:${port}`],
        notes: ['💊 构建信息请及时关注窗口右上角'],
      },
      // new WebpackBuildNotifierPlugin({
      //   title: '💿 Solv Dvelopment Notification',
      //   logo,
      //   suppressSuccess: true,
      // }),
      onErrors: function (severity, errors) {
        if (severity !== 'error') {
          return
        }
        const error = errors[0]
        console.log(error)
        notifier.notify({
          title: '👒 Webpack Build Error',
          message: severity + ': ' + error.name,
          subtitle: error.file || '',
          icon: join(__dirname, 'icon.png'),
        })
      },
      clearConsole: true,
    }),
    // new BundleAnalyzerPlugin(),
  ],
}
