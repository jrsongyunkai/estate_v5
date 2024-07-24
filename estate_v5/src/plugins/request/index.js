// import store from '@/store';
import axios from 'axios'
import util from '@/libs/util'
import Setting from '@/setting'
import qs from 'qs'
import { Modal, Message, Notice } from 'view-design'
import { clearCache } from '@/untils/cache'
import { throttle } from 'lodash'
// 创建一个错误
function errorCreate(msg) {
  const err = new Error(msg)
  errorLog(err)
  throw err
}
const specialCode = ['1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008', '1009', '1010']
// 记录和显示错误
function errorLog(err) {
  // 添加到日志
  // store.dispatch('admin/log/push', {
  //     message: '数据请求异常',
  //     type: 'error',
  //     meta: {
  //         error: err
  //     }
  // });
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.error('>>>>>> Error >>>>>>')
  }
  // 显示提示，可配置使用 iView 的 $Message 还是 $Notice 组件来显示
  if (Setting.errorModalType === 'Message') {
    Message.error({
      content: window.$t('dataStatus'),
      duration: Setting.modalDuration,
    })
  } else if (Setting.errorModalType === 'Notice') {
    Notice.error({
      title: window.$t('tip'),
      desc: err.message,
      duration: Setting.modalDuration,
    })
  }
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: Setting.apiBaseURL,
  timeout: 15000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    const token = sessionStorage.getItem('token')
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = token
    return config
  },
  error => {
    // 发送失败
    Promise.reject(error)
  }
)

const showMsg = throttle(msg => Message.error({ content: msg }), 3000)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 这个状态码是和后端约定的
    const { code, message } = dataAxios
    // 有 code 代表这是一个后端接口 可以进行进一步的判断
    if (code === undefined || code === '0' || code === '1') {
      return dataAxios
    } else if (code === '-1') {
      Modal.confirm({
        content: window.$t('loginStatusTimeout'),
        onOk: () => {
          clearCache()
          window.location.href = '/login'
        },
      })
    } else if (specialCode.includes(code)) {
      showMsg(message)
    } else {
      errorCreate(`${window.$t('unkownError')}(code:${code})`)
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = window.$t('requestError')
          break
        case 401:
          error.message = window.$t('unauthorizedPleaseLogIn')
          break
        case 403:
          error.message = window.$t('accessDenied')
          break
        case 404:
          error.message = `${window.$t('requestAddressError')}: ${error.response.config.url}`
          break
        case 408:
          error.message = window.$t('requestTimeout')
          break
        case 500:
          error.message = window.$t('internalServerError')
          break
        case 501:
          error.message = window.$t('serviceNotImplemented')
          break
        case 502:
          error.message = window.$t('badGateway')
          break
        case 503:
          error.message = window.$t('serviceUnavailable')
          break
        case 504:
          error.message = window.$t('gatewayTimeout ')
          break
        case 505:
          error.message = window.$t('HTTPVersionNotSupported')
          break
        default:
          break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)

const GET = (url, params) => {
  return service({
    url,
    method: 'get',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    params,
  })
}

const POST = (url, params, headers) => {
  return service({
    url: `${url}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
      ...headers,
    },
    data: headers ? params : qs.stringify(params),
  })
}

const POSTS = (url, params) => {
  return service({
    url: `${url}?v=` + new Date().getTime(),
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    data: params,
  })
}
const JPOST = (url, params) => {
  return service({
    url: `${url}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    data: params,
  })
}

export const FETCH = (url, params) => {
  return axios.get(`${url}`, { params: params }).then(res => res)
}

// 导出表格文档流
const DOWNLOADFILE = (url, params) => {
  return service({
    url: `${url}`,
    method: 'post',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: 60000, // 请求超时时间
    responseType: 'blob',
    data: params,
  })
}

// 上传视频延长超时时间
const POSTVIDEO = (url, params, headers) => {
  return service({
    url: `${url}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
      ...headers,
    },
    timeout: 60000,
    data: headers ? params : qs.stringify(params),
  })
}

export default {
  GET,
  POST,
  JPOST,
  POSTS,
  FETCH,
  DOWNLOADFILE,
  POSTVIDEO,
}
