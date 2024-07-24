import axios from 'axios'

const host = window.location.origin.includes('localhost') ? 'https://test-minio.snd00.com/dunwu-res' : window.location.origin
export const baseUrl = `${host}/web-nas/configuration/`
export const configTplUrl = `${host}/web-nas/configtpl/`

class HttpRequest {
  async get() {
    const res = await axios.get(`${baseUrl}data.json?v=${Date.now()}`)
    return res.data.list
  }
  async getSvg(url) {
    const res = await axios.get(url)
    return res.data
  }
  async getLoopData(url) {
    const res = await axios.get(url)
    return res.data.data
  }
  async getJsonData(url) {
    const res = await axios.get(url)
    return res.data
  }
  async getConfigTpl() {
    const res = await axios.get(`${configTplUrl}index.json?v=${Date.now()}`)
    return (
      (res.data &&
        res.data.map(it => ({
          name: it,
          url: `${configTplUrl}${it}.json`,
          imageUrl: `${configTplUrl}${it}.png`,
        }))) ||
      []
    )
  }
}

export const httpRequest = new HttpRequest()
