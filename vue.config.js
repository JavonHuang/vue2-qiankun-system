const path = require('path')
const { name } = require('./package')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const port = 7101 // dev port
module.exports = {
  outputDir: 'dist',
  assetsDir: 'static',
  publicPath: './',
  filenameHashing: true,
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    // 跨域
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/ueditor': {
        target: 'http://192.168.1.9:7101/',
        changeOrigin: true
      }
    }
  },
  // 自定义webpack配置
  configureWebpack: {
    devtool: "cheap-module-source-map", 
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    output: {
      // 把子应用打包成 umd 库格式(必须)
      library: `${name}`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`
    }
  }
}
