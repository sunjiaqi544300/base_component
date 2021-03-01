
module.exports = {
 // outputDir: "dist",
  //baseUrl: "/pc/dist",
  lintOnSave: false,
  productionSourceMap: false,
  baseUrl: process.env.VUE_APP_URL,
  devServer: {
    port: 8000,
    disableHostCheck: true,
    // https: false,
    // proxy: null, // 设置代理
  },

  configureWebpack: (config)=>{
    if(process.env.NODE_ENV === 'production'){
      if (process.env.NODE_ENV === 'production') {
        /*config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
        config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs =     ['console.log']*/
      }
    }

    // js output config
    config.output.filename = '[name].[2020092915].js'
    config.output.chunkFilename = '[name].[2020092915].js'
  },


}
