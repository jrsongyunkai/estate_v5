<template>
  <div>
    <div id="container2" :style="`height:${height ? height : '415px'}`"></div>
  </div>
</template>
<script>
  import { MapManager, GOOGLE_MAP_CONFIG } from '@/untils/mapManager'
  import { loadBoxMap } from '@/api/public'
  import { MarkerClusterer } from '@googlemaps/markerclusterer'
  import { clampLng, clampLat } from '@utils/common'
  const macNoUrl = require('../../../assets/images/macNo.png')
  const elecUrl = require('../../../assets/images/电表map.png')
  const waterPressureUrl = require('../../../assets/images/水压表map.png')
  const thUrl = require('../../../assets/images/温湿度map.png')
  const waterUrl = require('../../../assets/images/水表map.png')
  const iconImgMap = {
    1: macNoUrl,
    2: elecUrl,
    3: elecUrl,
    4: waterPressureUrl,
    5: waterPressureUrl,
    6: elecUrl,
    7: waterPressureUrl,
    8: macNoUrl,
    10: waterPressureUrl,
    11: thUrl,
    12: elecUrl,
    13: waterPressureUrl,
    14: thUrl,
    15: waterUrl,
    16: waterUrl,
    18: waterPressureUrl,
  }
  export default {
    name: 'projectmap2',
    props: {
      height: { type: String, default: '' },
    },
    data() {
      return {
        map: '',
        deviceList: [],
        mapType: '',
        useMapTypeConfig: { BAIDU_OFFLINE: 'offlineMap', BAIDU: 'onlineMap', GOOGLE: 'googleMap' },
      }
    },
    methods: {
      async initMap() {
        const useMap = sessionStorage.getItem('useMap')
        this.mapType = this.useMapTypeConfig[useMap] || 'onlineMap'
        const ak = this.mapType === 'googleMap' ? this.$store.state.googleKey : this.$store.state.baiduKey
        await MapManager.loadMap(this.mapType, ak)
        const namespace = MapManager.getNamespace(this.mapType)
        this.namespace = namespace.core
      },
      async loadProjects() {
        const res = await loadBoxMap({ projectCode: this.$store.state.projectCode, lastId: 0, pageSize: 100000 })
        if (res.success) {
          this.deviceList = res.data
        } else {
          this.$Message.error(res.message)
        }
        this.handelMapLoad()
      },
      async handelMapLoad() {
        await this.initMap()
        const { prjLocation } = this.$store.state.switchData
        const latitude = clampLat(prjLocation.latitude)
        const longitude = clampLng(prjLocation.longitude)
        if (this.mapType === 'offlineMap') {
          this.map = new this.namespace.Map('container2', { maxZoom: this.$store.state.personalBaiduOfflineMapLevel || 10 })
          this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
          this.map.centerAndZoom(new this.namespace.Point(longitude, latitude), 8)
          // 初始化地图,设置中心点坐标和地图级别
          this.map.setViewport(this.deviceList.map(item => new this.namespace.Point(item.longitude, item.latitude)))
          const markers = this.deviceList.map(item => {
            const point = new this.namespace.Point(item.longitude, item.latitude)
            return new this.namespace.Marker(point)
          })
          // eslint-disable-next-line no-new
          new window.BMapLib.MarkerClusterer(this.map, { markers: markers })
        } else if (this.mapType === 'onlineMap') {
          this.map = new this.namespace.Map('container2')
          this.map.centerAndZoom(new this.namespace.Point(longitude, latitude), 8)
          if (this.$store.state.baiduStyleId) this.map.setMapStyleV2({ styleId: this.$store.state.baiduStyleId })
          this.map.setViewport(this.deviceList.map(item => new this.namespace.Point(item.longitude, item.latitude)))
          const markerList = this.deviceList.filter(item => iconImgMap[`${item.equipmentType}`])
          const markers = markerList.map(item => {
            let point = new this.namespace.Point(item.longitude, item.latitude)
            // 创建标注
            let icon = new this.namespace.Icon(iconImgMap[`${item.equipmentType}`], new this.namespace.Size(50, 50), { anchor: new this.namespace.Size(16, 32) })
            let marker = new this.namespace.Marker(point, { icon })
            marker.addEventListener('click', function (e) {
              const doms = document.getElementsByClassName('BMap_Marker')
              if (doms) {
                const domsArr = Array.from(doms)
                const index = domsArr.indexOf(e.currentTarget.Ec)
                if (index !== -1) {
                  domsArr.forEach((v, i) => {
                    v.style.zIndex = index === i ? 12 : 10
                  })
                }
              }
            })
            let labelOpts = { position: point, offset: new this.namespace.Size(42, 12) }
            let label = new this.namespace.Label(`${item.boxName}[${item.mac}]`, labelOpts)
            label.setStyle({ border: 'none', color: '#fff', fontSize: '12px', fontFamily: '微软雅黑', height: '22px', lineHeight: '22px' })
            marker.setLabel(label)
            return marker
          })
          const myStyles = [{ url: require('../../../assets/images/jhed.png'), size: new this.namespace.Size(50, 50), opt_anchor: [16, 0], textColor: '#fff', textSize: 12 }]
          // eslint-disable-next-line no-new
          new window.BMapLib.MarkerClusterer(this.map, { markers: markers, styles: myStyles })
          this.map.getContainer().style.backgroundColor = 'transparent'
          this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
          this.map.setDisplayOptions && this.map.setDisplayOptions({ indoor: false })
        } else if (this.mapType === 'googleMap') {
          const { Map } = await this.namespace.importLibrary('maps')
          const { AdvancedMarkerElement } = await this.namespace.importLibrary('marker')
          this.map = new Map(document.getElementById('container2'), { ...GOOGLE_MAP_CONFIG, zoom: 16, minZoom: 3, center: { lat: latitude, lng: longitude } })
          const markerList = this.deviceList.filter(item => iconImgMap[`${item.equipmentType}`])
          const markers = markerList.map(item => {
            const deviceTag = document.createElement('div')
            deviceTag.className = 'device-tag'
            deviceTag.innerHTML = `<span><img src="${iconImgMap[item.equipmentType]}"><span class="mac-name">${item.boxName}[${item.mac}]</span></span>`
            const marker = new AdvancedMarkerElement({ position: { lat: item.latitude, lng: item.longitude }, map: this.map, title: `${item.boxName}[${item.mac}]`, content: deviceTag })
            return marker
          })
          // eslint-disable-next-line no-unused-vars
          const markerCluster = new MarkerClusterer({ map: this.map, markers })
          const bounds = new this.namespace.LatLngBounds()
          markerList.forEach(item => bounds.extend({ lat: item.latitude, lng: item.longitude }))
          this.map.fitBounds(bounds)
        }
      },
    },
    mounted() {
      this.loadProjects()
    },
    beforeDestroy() {
      this.map = null
    },
  }
</script>
<style lang="less" scoped>
  #container2 {
    overflow: hidden;
    width: 100%;
    height: 415px;
    margin: 0;
    font-family: '微软雅黑';
    /deep/ .project-infoWindow {
      text-align: center;
      color: #fff;
      display: inline-block;
      width: 100%;
      animation: 5s wordsLoop linear infinite normal;
    }
    @keyframes wordsLoop {
      0% {
        transform: translateX(10px);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  }
  /deep/.BMap_bubble_content {
    width: 100% !important;
    text-align: center !important;
  }
  /deep/.BMap_bubble_pop {
    overflow: hidden;
  }
  /deep/.BMap_Marker {
    label {
      background-color: transparent !important;
      background: linear-gradient(to right, #176f50, rgba(16, 27, 50, 0.7));
    }
  }
</style>

<style lang="less">
  .device-tag {
    position: relative;
    display: flex;
    align-items: center;
    img {
      position: absolute;
      left: 50%;
      top: 100%;
      transform: translate(-50%, 0);
      width: 50px;
      height: 50px;
    }
    .mac-name {
      position: absolute;
      line-height: 20px;
      top: 14px;
      left: 15px;
      font-size: 12px;
      padding: 0px 10px;
      background: linear-gradient(to right, #176f50, rgba(16, 27, 50, 0.7));
      white-space: nowrap;
    }
  }
</style>
