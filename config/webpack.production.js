const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { join, resolve } = require('path') // __dirname 当前文件所在目录 config
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  output: {
    path: join(__dirname, '../dist'),
    publicPath: './',
    filename: 'scripts/[name].[contenthash:5].bundule.js',
    assetModuleFilename: 'images/[name].[contenthash:5].[ext]',
  },
  //打包限制
  performance: {
    maxAssetSize: 250000, // 最大资源大小250KB
    maxEntrypointSize: 250000, // 最大入口文件大小250KB
    hints: 'warning', // 超过限制时，给出警告
  },
  optimization: {
    minimize: true,
    // css + js 多线程压缩 加快编译速度
    // 电脑本身就比较慢 反而更慢
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true, // 开启多线程
      }),
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  //用公司现有的组件库 公司自建CDN 上线CI机器压缩
  //优化项目的构建速度 一半在服务器上 一半在本地开发模式上
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Chengqi AI SPA',
      template: resolve(__dirname, '../src/index-prod.html'),
      filename: 'index.html',
      favicon: resolve(__dirname, '../public/favicon.ico'),
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   minifyCSS: true,
      //   minifyJS: true,
      // },
    }),
  ],
}

/* 

hash 整个项目公用一个hash

chunkhash 每个入口文件一个hash，会计算依赖关系，一个变了，引用它的也会变

contenthash 每个文件一个hash，文件内容变了，hash也会变 

*/
