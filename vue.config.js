module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: config => {
    config.output
      .filename("js/[name].[contenthash:8].js")
      .chunkFilename("js/[name].[contenthash:8].js")
  }
}