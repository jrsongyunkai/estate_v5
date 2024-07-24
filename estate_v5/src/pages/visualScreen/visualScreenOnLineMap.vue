<template>
  <div class="map-Div">
    <div id="container-online"></div>
    <div v-show="loading" class="loading-div">
      <Progress class="loading-Progress" :stroke-width="10" status="active" :percent="loadingPercent" hide-info />
    </div>
  </div>
</template>
<script>
  import { MapManager } from '@/untils/mapManager'
  import * as mapvgl from 'mapvgl'
  import { getProjectListContent } from './visualScreenFunc'
  export default {
    props: {
      markerList: {
        type: Array,
        default: () => [],
      },
      mapType: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        map: null,
        allMarker: [],
        view: null,
        infoWindow: null,
        clusterLayer: null,
        mapInitFlag: false,
        loading: true,
        loadingPercent: 0,
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.destory()
    },
    watch: {
      mapType: {
        handler(newValue) {
          if (this.map) {
            this.getDisable3D()
            this.setMapType(newValue)
          }
        },
        deep: true,
      },
      markerList: {
        handler(newValue) {
          if (this.map) {
            this.addClusterLayer()
            if (newValue.length) {
              this.getInitViewPort()
            }
          }
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      async init() {
        await this.initMap()
        this.setMapType(this.mapType)
        // 弹窗实例
        this.creatInfoWindow()
        // 图层管理实例
        this.createView()
        this.createClusterLayer()
        // 添加标点
        this.addClusterLayer()
        this.addDisabled3D()
        if (this.markerList.length) {
          this.getInitViewPort()
        }
      },
      async initMap() {
        // this.loading = true
        let processTimer = setInterval(() => {
          if (this.loadingPercent > 94) return
          this.loadingPercent += 5
        }, 8)
        await MapManager.loadMap('onlineMapGL', this.$store.state.baiduKey)
        const namespace = MapManager.getNamespace('onlineMapGL')
        this.namespace = namespace.core
        this.map = new this.namespace.Map('container-online')
        if (this.$store.state.baiduStyleId) this.map.setMapStyleV2({ styleId: this.$store.state.baiduStyleId })
        this.map.addEventListener('tilesloaded', () => {
          // 这里边写加载完成之后的执行操作
          if (!this.mapInitFlag) {
            this.mapInitFlag = true
            clearInterval(processTimer)
            processTimer = null
            this.loading = false
          }
          this.getDisable3D()
        })
        this.map.centerAndZoom(new this.namespace.Point(113.386762, 23.132214), 8)
        this.map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        this.map.setDisplayOptions && this.map.setDisplayOptions({ indoor: false })
      },
      destory() {
        this.view && this.view.destroy()
        this.map && this.map.destroy()
      },
      getInitViewPort() {
        if (this.markerList.length) {
          const viewPort = this.map.getViewport(
            this.markerList.map(item => new this.namespace.Point(...item.geometry.coordinates)),
            { margins: [0, 80, 80, 0] }
          )
          if (viewPort.zoom >= 17) {
            viewPort.zoom = 17
          }
          this.map.setViewport(viewPort)
        }
      },
      setMapType(type) {
        if (!this.map) return
        // const { lng, lat } = this.map.getCenter()
        const typeConfig = {
          '2d': {
            bmapType: window.BMAP_NORMAL_MAP,
            center: [113.386762, 23.132214],
            zoomLevel: 8,
            heading: 0,
            tilt: 0,
          },
          '3d': {
            bmapType: window.BMAP_NORMAL_MAP,
            center: [113.386762, 23.132214],
            zoomLevel: 8,
            heading: 75,
            tilt: 75,
          },
          satellite: {
            bmapType: window.BMAP_SATELLITE_MAP,
            center: [113.386762, 23.132214],
            zoomLevel: 8,
            heading: 0,
            tilt: 0,
          },
        }
        const { bmapType, heading, tilt } = typeConfig[type]
        this.map.setMapType(bmapType)
        this.setHeadingTilt(heading, tilt)
      },
      addDisabled3D() {
        this.map.addEventListener('zoomend', this.getDisable3D)
      },
      getDisable3D() {
        let count = 0
        const newZoom = this.map.getZoom()
        if (this.mapType !== '3d') {
          if (newZoom < 7) {
            this.$emit('disabled3D', true)
          } else {
            this.$emit('disabled3D', false)
          }
        } else {
          if (newZoom > 7) {
            if (count === 0) {
              this.setHeadingTilt(75, 75)
              count++
            }
          }
          if (newZoom < 7) {
            count = 0
          }
        }
      },
      setHeadingTilt(heading, tilt) {
        this.map.setHeading(heading) // 设置地图旋转角度
        this.map.setTilt(tilt) // 设置地图的倾斜角度
      },
      creatInfoWindow() {
        this.infoWindow = new this.namespace.InfoWindow('')
      },
      createView() {
        // 2. 创建MapVGL图层管理器
        this.view = new mapvgl.View({
          map: this.map,
        })
      },
      createClusterLayer() {
        this.clusterLayer = new mapvgl.ClusterLayer({
          minSize: 25,
          maxSize: 40,
          clusterRadius: 200,
          showText: true,
          maxZoom: 40,
          minZoom: 2,
          gradient: {
            0.0: 'rgb(30 144 255)',
            0.1: 'rgb(30 144 255)',
            0.5: 'rgb(30 144 255)',
            1.0: 'rgb(30 144 255)',
          },
          textOptions: {
            fontSize: 12,
            color: 'white',
            format: function (count) {
              return count
            },
          },
          iconOptions: { width: '', height: '', opacity: 1 },
          enablePicked: true,
          onClick: e => {
            if (!e.dataItem) return
            if (!e.dataItem.children || !e.dataItem.children.length) {
              // 可通过dataItem下面的children属性拿到被聚合的所有点
              this.openWindowInfo(e.dataItem)
              return
            }
            const newZoom = this.map.getZoom()
            if (newZoom >= this.map.getMaxZoom()) {
              this.openProjectWindowInfo(e.dataItem)
              return
            }
            this.map.setViewport(
              e.dataItem.children.map(item => new this.namespace.Point(...item.geometry.coordinates)),
              { margins: [0, 80, 80, 0] }
            )
          },
        })
        this.view.addLayer(this.clusterLayer)
      },
      openProjectWindowInfo(data) {
        const { geometry, children } = data
        let point = new this.namespace.Point(geometry.coordinates[0], geometry.coordinates[1])
        const content = getProjectListContent(children)
        this.infoWindow.setContent(content)
        this.infoWindow.setWidth(480)
        this.infoWindow.setHeight(260)
        this.$nextTick(() => {
          this.map.openInfoWindow(this.infoWindow, point)
          let buttonList = document.querySelectorAll('.project-Button-baidu-info')
          buttonList.forEach((item, index) => {
            item.addEventListener('click', function (e) {
              item.classList.add('active-Button')
              const filterButton = Array.from(buttonList).filter(itm => item.classList !== itm.classList)
              filterButton.forEach(itm => itm.classList.remove('active-Button'))
              let rightContent = Array.from(document.getElementsByClassName('default-div'))
              rightContent.forEach((element, idx) => {
                if (idx === index) {
                  element.classList.add('active')
                } else {
                  element.classList.remove('active')
                }
              })
            })
          })
          this.registerCloseWindowInfo()
        })
      },
      registerCloseWindowInfo() {
        let closeInfo = document.getElementsByClassName('closeWindowInfo')
        Array.from(closeInfo).forEach(item => {
          item.addEventListener('click', () => {
            this.map.closeInfoWindow()
          })
        })
      },
      openWindowInfo(data) {
        const { geometry, properties } = data
        const height = properties.info.isProject ? 250 : 240
        let point = new this.namespace.Point(geometry.coordinates[0], geometry.coordinates[1])
        this.infoWindow.setContent(properties.content)
        this.infoWindow.setWidth(350)
        this.infoWindow.setHeight(height)
        this.$nextTick(() => {
          this.map.openInfoWindow(this.infoWindow, point)
          this.registerCloseWindowInfo()
        })
      },
      addClusterLayer() {
        if (!this.map) return
        // 5. 关联图层与数据，享受震撼的可视化效果
        this.clusterLayer && this.clusterLayer.setData(this.markerList)
      },
    },
  }
</script>
<style lang="less" scoped>
  .map-Div {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .loading-div {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #080b17 !important;
    z-index: 19;
    display: flex;
    justify-content: center;
    align-items: center;
    .loading-Progress {
      width: 25%;
      /deep/.ivu-progress-inner,
      /deep/ .ivu-progress-success-bg,
      /deep/ .ivu-progress-bg {
        border-radius: 10px;
      }
    }
  }
  #container-online {
    width: 100%;
    height: 100%;
    background-image: none !important;
    /deep/ .BMap_bubble_pop {
      border: 1px solid transparent !important;
      background: none; // url('.././../assets/images/proModalBgc.png');;
      background-color: transparent !important;
      background-size: 100% 100%;
      overflow: hidden;
      position: relative;
    }
    /deep/ .anchorBL {
      display: none;
    }
    /deep/.pro-title {
      text-align: center;
    }
    /deep/ .project-Height {
      height: 98%;
      padding-top: 30px;
    }
    /deep/ .BMap_bubble_buttons {
      display: none;
    }
    /deep/.closeWindowInfo {
      color: #999;
      font-size: 25px;
      position: absolute;
      top: 15px;
      right: 16px;
      z-index: 3;
    }
    /deep/ .alarm-bgc {
      background: url('.././../assets/images/alarm-bgc-red.png');
      background-size: 100% 100%;
    }
    /deep/ .warn-bgc {
      background: url('.././../assets/images/warn-bgc-yellow.png');
      background-size: 100% 100%;
    }
    /deep/ .normal-bgc {
      background: url('.././../assets/images/proModalBgc.png');
      background-size: 100% 100%;
    }
    /deep/ .normal-titleColor {
      color: #00ffea;
    }
    /deep/ .warn-titleColor {
      color: #ffd300;
    }
    /deep/ .alarm-titleColor {
      color: #ff0092;
    }
    /deep/ .normal-button {
      background: linear-gradient(180deg, rgba(0, 255, 234, 0) 0%, rgba(0, 255, 234, 0.2) 100%);
      border: 1px solid #00ffea;
      color: #00ffea;
    }
    /deep/ .warn-button {
      background: linear-gradient(180deg, rgba(255, 211, 0, 0) 0%, rgba(255, 211, 0, 0.2) 100%);
      border: 1px solid #ffd300;
      color: #ffd300;
    }
    /deep/ .alarm-button {
      background: linear-gradient(180deg, rgba(255, 0, 146, 0) 0%, rgba(255, 0, 146, 0.2) 100%);
      border-radius: 4px;
      border: 1px solid #ff0092;
      color: #ff0092;
    }
    /deep/ .mart-10 {
      margin-top: 7px;
      margin-left: 30px;
    }
    /deep/.checkDetails-button {
      text-align: center;
      width: auto;
      padding-left: 10px;
      padding-right: 10px;
      height: 28px;
      border-radius: 4px;
      margin: 0 auto;
      display: block;
    }
    /deep/ .info-text-content {
      color: #999;
    }
    /deep/ .online-device-bgc {
      background: url('.././../assets/images/proModalBgc.png');
      background-size: 100% 100%;
    }
    /deep/ .proList-bgc {
      background: url('.././../assets/images/projectListBgc.png');
      background-size: 100% 100%;
      height: 95% !important;
    }
    /deep/ .offline-device-bgc {
      background: url('.././../assets/images/proModalBgc.png');
      background-size: 100% 100%;
    }
    /deep/ .alarm-device-bgc {
      background: url('.././../assets/images/proModalBgc.png');
      background-size: 100% 100%;
    }
    /deep/ .warn-device-bgc {
      background: url('.././../assets/images/proModalBgc.png');
      background-size: 100% 100%;
    }
    /deep/ .online-device-titleColor {
      color: #00ffea;
    }
    /deep/ .offline-device-titleColor {
      color: #8399ab;
    }
    /deep/ .alarm-device-titleColor {
      color: #ff0092;
    }
    /deep/ .warn-device-titleColor {
      color: #ffd300;
    }
    /deep/ .online-button {
      background: linear-gradient(180deg, rgba(0, 255, 234, 0) 0%, rgba(0, 255, 234, 0.2) 100%);
      border: 1px solid #00ffea;
      color: #00ffea;
    }
    /deep/ .device-Height {
      height: 220px;
    }
    /deep/ .offline-button {
      background: linear-gradient(180deg, rgba(131, 153, 171, 0) 0%, rgba(131, 153, 171, 0.2) 100%);
      color: #8399ab;
      border: 1px solid #8399ab;
    }
    /deep/ .default-div {
      display: none;
      z-index: 1;
    }
    /deep/ .default-div.active {
      display: block;
      z-index: 2;
    }
    /deep/ .project-Button-baidu-info {
      background: #06101b;
      border: 1px solid #194447;
      color: #037c79;
      z-index: 1;
    }
    /deep/ .pd-Button {
      border-radius: 3px;
      margin-top: 10px;
      padding: 2px 5px;
      width: 100%;
    }
    /deep/ .project-Button-baidu-info.active-Button {
      background: #194447;
      border: 1px solid #2d7973;
      color: #01f2df;
      z-index: 2;
    }
    /deep/ .pd-rightContent {
      padding: 0 10px 0 10px;
      margin: 25px 10px 20px 0;
      border-left: 1px solid #31343d;
    }
    /deep/ .margin-top-10 {
      margin-top: 10px;
    }
  }
</style>
