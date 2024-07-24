const axios = require('axios')
const { API_TOKEN, BASE_URL, PROJECT, COMPONENT, LANGUAGES } = require('./constants')

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Token ${API_TOKEN}`,
  },
})

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

const googleTranslate = async (text, from = 'zh-CN', to = 'en') => {
  const url = 'https://translate.googleapis.com/translate_a/single'
  const params = {
    client: 'gtx',
    dt: 't',
    dj: 1,
    ie: 'UTF-8',
    sl: from,
    tl: to,
    q: text,
  }
  const qs = new URLSearchParams(params).toString()

  const res = await axios.get(`${url}?${qs}`)

  return res.data.sentences.map(item => item.trans).join('')
}

const getUntranslatedLanguageUnits = async language => {
  const res = await api.get(`/translations/${PROJECT}/${COMPONENT}/${language}/units/?page_size=10000&q=state:empty`)
  return res.data.results
}

const translateUnit = async (language, unit) => {
  const sourceStr = unit.source[0]
  const targetStr = await googleTranslate(sourceStr, 'zh-CN', language)

  await api.patch(`/units/${unit.id}/`, {
    state: 20,
    target: [targetStr],
  })
}

const main = async () => {
  for (const language of LANGUAGES) {
    const units = await getUntranslatedLanguageUnits(language)
    for (const unit of units) {
      await translateUnit(language, unit)
      await sleep(1000 * (Math.random() / 2 + 0.5))
    }
  }
}

try {
  main()
  console.log('translate completed 🎉🎉🎉')
} catch (e) {
  console.log(e)
}
