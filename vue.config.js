module.exports = {
  lintOnSave:false,
  devServer: {
    host: 'localhost',
    port: '8080',
    https:false,
    hotOnly:false,
    proxy: {
      "server": {
        target: 'http://api.myxy99.cn/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/server': ''
        }
      }
    }
  }
}