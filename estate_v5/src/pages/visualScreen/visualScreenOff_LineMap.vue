<template>
  <div id="container-Offline"></div>
</template>

<script>
  import { MapManager } from '@/untils/mapManager'

  const statusConfig = {
    normal: `/static/img/deviceStatusVisualScreen/normal-Pro.png`,
    warn: `/static/img/deviceStatusVisualScreen/warn-Pro.png`,
    alarm: `/static/img/deviceStatusVisualScreen/alarm-Pro.png`,
  }
  export default {
    props: {
      markerList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        offlineMap: null,
        mapType: 'offlineMap',
      }
    },
    mounted() {
      this.initMap()
    },
    watch: {
      markerList: {
        handler() {
          if (this.offlineMap) {
            this.getInitViewPort()
            this.createMaker()
          }
        },
        deep: true,
      },
    },
    methods: {
      async initMap() {
        await MapManager.loadMap(this.mapType, this.$store.state.baiduKey)
        const namespace = MapManager.getNamespace(this.mapType)
        this.namespace = namespace.core
        this.offlineMap = new this.namespace.Map('container-Offline', { maxZoom: this.$store.state.personalBaiduOfflineMapLevel || 10 })
        const point = new this.namespace.Point('113.951623', '22.553956')
        this.offlineMap.centerAndZoom(point, 8)
        // 初始化地图,设置中心点坐标和地图级别
        this.offlineMap.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
        this.getInitViewPort()
        this.createMaker()
      },
      createMaker() {
        let opts = { height: 250, width: 280, title: '' }
        const allMarker = this.markerList.map((item, index) => {
          const isPro = item.isProject ? statusConfig[item.projectStatus] : require('../../assets/images/map2.png')
          var point = new this.namespace.Point(item.longitude, item.latitude)
          var icon = new this.namespace.Icon(isPro, new this.namespace.Size(60, 60))
          let marker = new this.namespace.Marker(point, { icon: icon })
          // 项目弹窗内容
          const proContenInfo = this.infoDetail(item)
          // 设备弹窗内容
          const deviceInfoContent = ''
          const content = item.isProject ? proContenInfo : deviceInfoContent
          let infoWindow = new this.namespace.InfoWindow(content, opts)
          marker.addEventListener('click', function (e) {
            this.openInfoWindow(infoWindow, point)
          })
          return marker
        })
        // eslint-disable-next-line no-new
        new window.BMapLib.MarkerClusterer(this.offlineMap, { markers: allMarker })
      },
      getInitViewPort() {
        if (this.markerList.length) {
          const viewPort = this.offlineMap.getViewport(
            this.markerList.map(item => new this.namespace.Point(item.longitude, item.latitude)),
            { margins: [0, 80, 80, 0] }
          )
          this.offlineMap.setViewport(viewPort)
        }
      },
      infoDetail(item) {
        return `<div></div><div class=" bgc-${item.projectStatus}"><div class="pro-title-${item.projectStatus}"> ${this.$t('projectInfo')}</div><div class="mart-10"> <span class="blueText-${item.projectStatus}">${this.$t('projectName')}：</span><span class="info-text-content"> 
        ${item.projectName}</span> </div><div class="mart-10"> <span class="blueText-${item.projectStatus}"> ${this.$t('totalDevice')}：</span><span class="info-text-content">${item.totalMac}</span> </div>
       <div class="mart-10"> <span class="blueText-${item.projectStatus}">${this.$t('electricityMonth')}：</span><span class="info-text-content">${item.curMonthPower}</span> </div>
      ${
        item.totalAlarmNoProcessToday === 0 || item.totalAlarmNoProcessToday
          ? '<div class="mart-10"> <span class="' + `blueText-${item.projectStatus}` + '">' + `${this.$t('notProcessed')}` + '：</span><span class="' + 'info-text-content' + '">' + item.totalAlarmNoProcessToday + '</span> </div>'
          : ''
      } 
      <div><span></span><span></span></div><div><span></span><span></span></div> <button class="checkDetails-button  button-${item.projectStatus}"><a href="javascript:;" class="blueText-${item.projectStatus}" onclick="openPrjAction('${item}','${item.projectCode}'
      )">${this.$t('viewDetails')}</a></button></div></div>`
      },
    },
    beforeDestroy() {
      this.offlineMap = null
    },
  }
</script>

<style lang="less" scoped>
  #container-Offline {
    width: 100%;
    height: 100%;
    /deep/ .BMap_pop div:nth-child(1) {
      background: transparent !important;
      border: none !important;
    }
    ::v-deep .BMap_pop div:nth-child(3) {
      background-color: rgba(0, 0, 0, 0);
      color: #73ffff;
    }
    ::v-deep .BMap_pop div:nth-child(8) {
      img {
        display: none;
      }
    }
    ::v-deep .BMap_top {
      background-color: rgba(0, 0, 0, 0);
      border: none;
    }
    ::v-deep .BMap_center {
      border: none;
      background: transparent;
    }
    ::v-deep .bgc-normal {
      height: 210px !important;
      padding-top: 20px;
      background-color: rgba(0, 0, 0, 0);
      border: none;
      background: url('../../assets/images/proModalBgc.png') center/cover no-repeat;
      background-size: 100% 100%;
    }
    ::v-deep .bgc-warn {
      height: 210px !important;
      padding-top: 20px;
      background-color: rgba(0, 0, 0, 0);
      border: none;
      background: url('../../assets/images/warn-bgc-yellow.png') center/cover no-repeat;
      background-size: 100% 100%;
    }
    ::v-deep .bgc-alarm {
      height: 210px !important;
      padding-top: 20px;
      background-color: rgba(0, 0, 0, 0);
      border: none;
      background: url('../../assets/images/alarm-bgc-red.png') center/cover no-repeat;
      background-size: 100% 100%;
    }
    ::v-deep .BMap_bubble_content {
      height: 500px;
      padding-top: 25px;
    }
    ::v-deep .BMap_bottom {
      background-color: rgba(0, 0, 0, 0);
      border: none;
    }
    /deep/ .pro-title-normal {
      color: #00ffea;
      text-align: center;
    }
    /deep/ .pro-title-warn {
      color: #ffd300;
      text-align: center;
    }
    /deep/ .pro-title-alarm {
      color: #ff0092;
      text-align: center;
    }
    /deep/ .mart-10 {
      padding-top: 10px;
      margin-left: 35px;
    }
    /deep/.checkDetails-button {
      margin-left: 100px;
      width: 88px;
      height: 28px;

      border-radius: 4px;
      border: 1px solid #00ffea;
    }
    /deep/ .button-normal {
      border: 1px solid #00ffea;
      background: linear-gradient(180deg, rgba(0, 255, 234, 0) 0%, rgba(0, 255, 234, 0.2) 100%);
    }
    /deep/ .button-warn {
      border: 1px solid #ffd300;
      background: linear-gradient(180deg, rgba(255, 211, 0, 0) 0%, rgba(255, 211, 0, 0.2) 100%);
    }
    /deep/ .button-alarm {
      border: 1px solid #ff0092;
      background: linear-gradient(180deg, rgba(255, 0, 146, 0) 0%, rgba(255, 0, 146, 0.2) 100%);
    }
    /deep/ .info-text-content {
      color: #999;
    }
    /deep/ .blueText-normal {
      color: #00ffea;
    }
    /deep/ .blueText-alarm {
      color: #ff0092;
    }
    /deep/ .blueText-warn {
      color: #ffd300;
    }
    /deep/ .margin-l-10 {
      margin-left: 40px;
    }
    /deep/ .pd-top {
      padding-top: 10px;
    }
  }
</style>
