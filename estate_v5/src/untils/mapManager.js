import { loadScript } from './common'
import { Loader } from '@googlemaps/js-api-loader'
import { googleLangMap } from './configuration'
import store from '@/store'

/**
 * 离线地图瓦片资源有限，限制最大缩放级别，超过了会缺少瓦片图片
 */
export const OFFLINE_MAP_MAX_ZOOM = 10

export const useMapTypeConfig = { BAIDU_OFFLINE: 'offlineMap', BAIDU: 'onlineMapGL', GOOGLE: 'googleMap' }

/**
 * 谷歌地图样式以及初始化配置
 */
export const GOOGLE_MAP_CONFIG = {
  mapId: '9472f1820066bc70',
  center: { lat: 22.548362, lng: 114.066144 },
  gestureHandling: 'greedy',
  zoomControl: true,
  fullscreenControl: false,
  zoom: 16,
  backgroundColor: '#1a202e',
  controlSize: 24,
}

/**
 * 暂时不考虑加载失败的情况
 */
export class MapManager {
  static status = {
    offlineMap: 'unloaded',
    onlineMap: 'unloaded',
    onlineMapGL: 'unloaded',
    googleMap: 'unloaded',
  }
  static loaders = {
    offlineMap(type) {
      return new Promise(resolve => {
        MapManager.setStatus(type, 'loading')
        window.mapLoadFinsh = () => {
          MapManager.setStatus(type, 'loaded')
          resolve()
        }
        loadScript('/baiduMap/baidumap_offline_v2_load.js')
      })
    },
    async onlineMap(type, ak) {
      MapManager.setStatus(type, 'loading')
      await new Promise(resolve => {
        window.onlineMapLoaded = resolve
        loadScript('//api.map.baidu.com/api?v=3.0&ak=' + ak + '&callback=onlineMapLoaded')
      })
      // await Promise.all([loadScript('https://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer.js'), loadScript('https://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay.js')])
      await Promise.all([require('./markerClusterer.js'), loadScript('https://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay.js')])
      MapManager.setStatus(type, 'loaded')
    },
    onlineMapGL(type, ak) {
      return new Promise(resolve => {
        MapManager.setStatus(type, 'loading')
        window.onlineMapGLLoaded = () => {
          MapManager.setStatus(type, 'loaded')
          resolve()
        }
        loadScript('//api.map.baidu.com/api?v=3.0&&type=webgl&ak=' + ak + '&callback=onlineMapGLLoaded')
      })
    },
    async googleMap(type, ak) {
      const loader = new Loader({ apiKey: ak, version: 'weekly', language: googleLangMap[store.state.locale] || 'zh-CN' })
      return new Promise(resolve => {
        if (window.google) {
          MapManager.setStatus(type, 'loaded')
          return resolve()
        }
        MapManager.setStatus(type, 'loading')
        loader.load().then(() => {
          MapManager.setStatus(type, 'loaded')
          resolve()
        })
      })
    },
  }
  /**
   *
   * @param {('offlineMap' | 'onlineMap' | 'onlineMapGL'| 'googleMap')} type
   * @param {string} ak
   */
  static async loadMap(type, ak) {
    const status = MapManager.getStatus(type)
    if (status === 'loaded') {
      return
    }
    if (status === 'loading') {
      return MapManager.pollStatus(type)
    }
    const loader = MapManager.loaders[type]
    if (!loader) {
      return Promise.reject(new Error('unknown loader'))
    }
    await MapManager.loaders[type](type, ak)
    return MapManager.getNamespace(type)
  }
  static getNamespace(type) {
    switch (type) {
      case 'offlineMap':
        return {
          core: window.BMap,
          lib: window.BMapLib,
        }
      case 'onlineMap':
        return {
          core: window.BMap,
          lib: window.BMapLib,
        }
      case 'onlineMapGL':
        return {
          core: window.BMapGL,
          lib: null,
        }
      case 'googleMap':
        return {
          core: window.google.maps,
          lib: null,
        }
      default:
        return new Error('unknown namespace')
    }
  }
  static getStatus(type) {
    return MapManager.status[type]
  }
  static setStatus(type, status) {
    MapManager.status[type] = status
  }
  static pollStatus(type, interval = 300, timeout = 60e3) {
    return new Promise(resolve => {
      const start = Date.now()
      const timer = setInterval(() => {
        const now = Date.now()
        if (now - start > timeout) {
          clearInterval(timer)
        }
        if (MapManager.getStatus(type) === 'loaded') {
          clearInterval(timer)
          resolve()
        }
      }, interval)
    })
  }
}
