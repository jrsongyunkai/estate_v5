// 导入 iView 语言包
import zhCNiView from 'view-design/dist/locale/zh-CN'
import enUSiView from 'view-design/dist/locale/en-US'
import ruRUiView from 'view-design/dist/locale/ru-RU'
import frFRiView from 'view-design/dist/locale/fr-FR'
import esESiView from 'view-design/dist/locale/es-ES'
import jaJPiView from 'view-design/dist/locale/ja-JP'
import koKRiView from 'view-design/dist/locale/ko-KR'
import arSAiView from 'view-design/dist/locale/ar-SA'

// 导入 ele 语言包
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from 'element-ui/lib/locale/lang/en'
import ruLocale from 'element-ui/lib/locale/lang/ru-RU'
import frLocale from 'element-ui/lib/locale/lang/fr'
import esLocale from 'element-ui/lib/locale/lang/es'
import jaLocale from 'element-ui/lib/locale/lang/ja'
import koLocale from 'element-ui/lib/locale/lang/ko'
import arLocale from 'element-ui/lib/locale/lang/ar'

// 导入自有语言包
const zhCN = require('./locale/zh-CN.json')
const enUS = require('./locale/en-US.json')
const ruRU = require('./locale/ru-RU.json')
const frFR = require('./locale/fr-FR.json')
const esES = require('./locale/es-ES.json')
const jaJP = require('./locale/ja-JP.json')
const koKR = require('./locale/ko-KR.json')
const arSA = require('./locale/ar-SA.json')

// 合并语言包
export default {
  'zh-CN': Object.assign({}, zhCN, zhCNiView, zhLocale, { locale: 'zh-CN', language: '中文' }),
  'en-US': Object.assign({}, enUS, enUSiView, enLocale, { locale: 'en-US', language: 'English' }),
  'ru-RU': Object.assign({}, ruRU, ruRUiView, ruLocale, { locale: 'ru-RU', language: 'русский' }),
  'fr-FR': Object.assign({}, frFR, frFRiView, frLocale, { locale: 'fr-FR', language: 'Français' }),
  'es-ES': Object.assign({}, esES, esESiView, esLocale, { locale: 'es-ES', language: 'Español' }),
  'ja-JP': Object.assign({}, jaJP, jaJPiView, jaLocale, { locale: 'ja-JP', language: '日本語' }),
  'ko-KR': Object.assign({}, koKR, koKRiView, koLocale, { locale: 'ko-KR', language: '한국어' }),
  'ar-SA': Object.assign({}, arSA, arSAiView, arLocale, { locale: 'ar-SA', language: 'العربية' }),
}
