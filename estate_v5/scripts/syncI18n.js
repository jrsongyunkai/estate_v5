const fs = require('fs')
const path = require('path')
const axios = require('axios')
const yauzl = require('yauzl')
const { API_TOKEN, BASE_URL, PROJECT, COMPONENT } = require('./constants')

const FILE_NAME_MAP = {
  ar: 'ar-SA',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  ja: 'ja-JP',
  ko: 'ko-KR',
  ru: 'ru-RU',
  zh_Hans: 'zh-CN',
}

function promisify(api) {
  return function (...args) {
    return new Promise(function (resolve, reject) {
      api(...args, function (err, response) {
        if (err) return reject(err)
        resolve(response)
      })
    })
  }
}

const yauzlFromBuffer = promisify(yauzl.fromBuffer)

const downloadZip = async () => {
  const res = await axios.get(`${BASE_URL}/components/${PROJECT}/${COMPONENT}/file/`, {
    responseType: 'arraybuffer',
    headers: {
      Authorization: `Token ${API_TOKEN}`,
    },
  })
  return res.data
}

const main = async () => {
  const zipFileArrayBuffer = await downloadZip()
  const zipFile = await yauzlFromBuffer(Buffer.from(zipFileArrayBuffer))
  const dirPath = path.resolve(__dirname, '../src/i18n/locale/')
  zipFile.on('entry', entry => {
    const baseName = path.basename(entry.fileName, '.json')
    const fileName = FILE_NAME_MAP[baseName]
    const filePath = path.resolve(dirPath, `${fileName}.json`)
    zipFile.openReadStream(entry, function (err, readStream) {
      if (err) throw err
      const writeStream = fs.createWriteStream(filePath)
      readStream.pipe(writeStream)
    })
  })
}

main()
