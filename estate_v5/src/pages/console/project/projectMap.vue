<template>
  <div id="container-project"></div>
</template>
<script>
  import { MapManager, GOOGLE_MAP_CONFIG, useMapTypeConfig } from '@/untils/mapManager'
  import { clampLng, clampLat } from '@utils/common'
  export default {
    data() {
      return {
        map: '',
        mapType: '',
      }
    },
    methods: {
      async initMap() {
        const useMap = sessionStorage.getItem('useMap')
        this.mapType = useMapTypeConfig[useMap] || 'onlineMapGL'
        const ak = this.mapType === 'googleMap' ? this.$store.state.googleKey : this.$store.state.baiduKey
        await MapManager.loadMap(this.mapType, ak)
        const namespace = MapManager.getNamespace(this.mapType)
        this.namespace = namespace.core
      },
      baiduMapHandleMarker() {
        const { prjLocation, prjName } = this.$store.state.switchData
        const latitude = clampLat(prjLocation.latitude)
        const longitude = clampLng(prjLocation.longitude)
        const point = new this.namespace.Point(longitude, latitude)
        const icon = new this.namespace.Icon(require('../../../assets/images/map2.png'), new this.namespace.Size(30, 50))
        const marker = new this.namespace.Marker(point, { icon: icon })
        this.map.centerAndZoom(point, 10)
        this.map.addOverlay(marker) // 将标注添加到地图中
        marker.addEventListener('click', e => {
          let { lng, lat } = e.target.getPosition()
          const point = new this.namespace.Point(lng, lat)
          const content = '<div class="project-infoWindow">' + prjName + '</div>'
          let infoWindow = new this.namespace.InfoWindow(content, { height: 80, title: '' })
          this.map.openInfoWindow(infoWindow, point)
        })
        // 创建文本标注
        this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      },
      async handelMapInit() {
        await this.initMap()
        if (this.mapType === 'googleMap') {
          const { prjLocation, prjName } = this.$store.state.switchData
          const lat = clampLat(prjLocation.latitude)
          const lng = clampLng(prjLocation.longitude)
          const { Map } = await this.namespace.importLibrary('maps')
          const { AdvancedMarkerElement } = await this.namespace.importLibrary('marker')
          this.map = new Map(document.getElementById('container-project'), { ...GOOGLE_MAP_CONFIG, zoom: 5, minZoom: 3, center: { lat, lng } })
          this.map.addListener('tilesloaded', () => {
            const beachFlagImg = document.createElement('img')
            beachFlagImg.src = require('../../../assets/images/map2.png')
            // eslint-disable-next-line no-unused-vars
            const marker = new AdvancedMarkerElement({ position: { lat, lng }, map: this.map, title: prjName, content: beachFlagImg })
            const infoWindow = new this.namespace.InfoWindow({ content: `<div class="prj-name">${prjName}</div>`, ariaLabel: prjName })
            marker.addListener('click', () => {
              infoWindow.open({ anchor: marker, map: this.map })
            })
          })
        } else {
          this.map = new this.namespace.Map('container-project') // 创建Map实例
          if (this.mapType === 'onlineMapGL') {
            if (this.$store.state.baiduStyleId) this.map.setMapStyleV2({ styleId: this.$store.state.baiduStyleId })
          } else {
            this.map.setMaxZoom(this.$store.state.personalBaiduOfflineMapLevel || 10)
          }
          this.baiduMapHandleMarker()
          this.map.getContainer().style.backgroundColor = 'transparent'
          this.map.setDisplayOptions && this.map.setDisplayOptions({ indoor: false })
        }
      },
    },
    mounted() {
      this.handelMapInit()
    },
    beforeDestroy() {
      this.map && this.map.destroy()
      this.map = null
      this.mapType = ''
    },
  }
</script>
<style lang="less" scoped>
  #container-project {
    overflow: hidden;
    width: 100%;
    height: 415px;
    margin: 0;
    font-family: '微软雅黑';
    /deep/ .BMap_bubble_pop {
      border: 1px solid transparent !important;
      background: url('../../../assets/images/maptk.png') no-repeat !important;
      background-color: transparent !important;
      background-size: 100% 100% !important;
      .project-infoWindow {
        color: #fff !important;
      }
      img {
        width: 0 !important;
      }
    }
    /deep/.gm-style .gm-style-iw-c {
      background-color: transparent !important;
      border: 1px solid transparent !important;
      padding: 0px;
      max-width: unset !important;
      max-height: unset !important;
      box-shadow: none !important;
      margin-top: 10px !important;
      margin-left: 16px !important;
      background: url('../../../assets/images/maptk.png') no-repeat !important;
      background-size: 100% 100% !important;
      .gm-style-iw-chr {
        position: absolute;
        right: 10px;
        .gm-ui-hover-effect {
          width: 30px !important;
          height: 30px !important;
          > span {
            width: 18px !important;
            height: 18px !important;
            margin: 6px !important;
            background-color: #999 !important;
          }
        }
      }
    }
    /deep/ .poi-info-window div {
      display: none !important;
    }
    /deep/.gm-style-iw-d {
      overflow: hidden !important;
      max-height: unset !important;
    }
    /deep/ a[rel='noopener'] {
      display: none !important;
    }
    /deep/.gm-style .gm-style-iw-tc {
      display: none;
    }
    /deep/.prj-name {
      padding: 30px;
    }
    /deep/.BMap_pop {
      border: 1px solid transparent !important;
      background: url('../../../assets/images/maptk.png') no-repeat !important;
      background-color: transparent !important;
      background-size: 100% 100% !important;
      width: 286px !important;
      height: 100px !important;
      left: 608px !important;
      div {
        background-color: transparent !important;
        border: transparent !important;
        img {
          display: none;
        }
        div {
          background: transparent !important;
          border-top: transparent !important;
          border-left: transparent !important;
          border-right: transparent !important;
          border-bottom: transparent !important;
        }
      }
    }
    /deep/ .project-infoWindow {
      text-align: center;
      color: #fff;
      display: inline-block;
      animation: 5s wordsLoop linear infinite normal;
    }
    /deep/ .project-infoWindow2 {
      text-align: center;
      color: #000;
      display: inline-block;
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
</style>
