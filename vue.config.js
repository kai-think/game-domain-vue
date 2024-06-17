module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: "/",
  devServer: {
    open: true, // 启动服务后是否打开浏览器
    host: 'localhost',
    // host: "119.91.126.21",
    port: 8081, // 服务端口
    https: false,
    hotOnly: false,
    proxy: {
      '/demo': { //名字必须跟application context相同 否则404
        target: 'http://localhost:8080',
        // target: 'http://119.91.126.21:8080',
        changeOrigin: true, //  跨域
      }
    }, 
    // 设置代理
    before: app => {}
  },
}