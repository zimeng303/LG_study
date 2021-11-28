/**
 * Override convention configuration
 * https://cli.vuejs.org/config/
 */

/** @type {import('@vue/cli-service').ProjectOptions} */
const config = {
  publicPath: '', // for relative path
  assetsDir: 'assets',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  css: {
    sourceMap: process.env.NODE_ENV !== 'production'
  },

}

module.exports = config
