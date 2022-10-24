const webpack = require('webpack');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'introJs': ['intro.js']
      })
    ]
  },
  pwa: {
    name: 'AssignHub',
    themeColor: '#5E76BC',
    msTileColor: '#5E76BC',
    appleMobileWebAppCache: 'yes',
    manifestOptions: {
      background_color: '#5E76BC',
    },
    iconPaths: {
      faviconSVG: null,
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: null,
      msTileImage: 'img/icons/msapplication-icon-144x144.png',
    },
  },
}