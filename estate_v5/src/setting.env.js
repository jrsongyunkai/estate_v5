/**
 * iView Admin Pro 开发配置
 * */

// module.exports = Setting;
const env = process.env.NODE_ENV
const cur = process.env.VUE_APP_CURRENTMODE
const urls = ['https://v5cdn1.snd02.com/', 'https://v5cdn2.snd02.com/', 'https://v5cdn3.snd02.com/']
const grayscaleUrl = ['https://v5cdn1-pre.snd02.com/', 'https://v5cdn2-pre.snd02.com/', 'https://v5cdn3-pre.snd02.com/']
let grayUrls = grayscaleUrl[Math.floor(Math.random() * grayscaleUrl.length)]
let _url = urls[Math.floor(Math.random() * urls.length)]
const Setting = {
  // 是否使用 Mock 的数据，默认 开发环境为 true，生产环境为 false
  isMock: false,
  // 部署应用包时的基本 URL
  publicPath: env === 'development' || cur === 'test' || cur === 'dev' || cur === 'local' ? '/' : cur === 'pre' ? grayUrls : _url,
  // 生产环境构建文件的目录名
  outputDir: cur === 'local' ? 'estate_v5' : 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 开发环境每次保存时 lint 代码，会将 lint 错误输出为编译警告
  // true || false || error
  lintOnSave: env !== 'prod',
  // iView Loader 的选项
  // 详见 https://www.iviewui.com/docs/guide/iview-loader
  iviewLoaderOptions: {
    prefix: false,
  },
}
module.exports = Setting
