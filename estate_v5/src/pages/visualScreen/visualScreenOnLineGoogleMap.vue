<template>
  <div class="map-content-body">
    <div class="google-map" id="GoogleMap"></div>
    <div v-show="loading" class="loading-div">
      <Progress class="loading-Progress" :stroke-width="10" status="active" :percent="loadingPercent" hide-info />
    </div>
  </div>
</template>
<script>
  import { MapManager, GOOGLE_MAP_CONFIG } from '@/untils/mapManager'
  import { MarkerClusterer } from '@googlemaps/markerclusterer'
  export default {
    name: 'GoogleMap',
    props: {
      markerList: { type: Array, default: () => [] },
      mapStyleType: { type: String, default: '' },
    },
    data() {
      return {
        loading: true,
        loadingPercent: 0,
        zoom: 10,
        map: null,
        mapInitFlag: false,
        namespace: null,
        mapType: 'googleMap',
      }
    },
    methods: {
      async initMap() {
        let processTimer = setInterval(() => {
          if (this.loadingPercent > 94) return
          this.loadingPercent += 5
        }, 8)
        await MapManager.loadMap(this.mapType, this.$store.state.googleKey)
        const namespace = MapManager.getNamespace(this.mapType)
        this.namespace = namespace.core
        const { Map } = await this.namespace.importLibrary('maps')
        this.map = new Map(document.getElementById('GoogleMap'), { ...GOOGLE_MAP_CONFIG, backgroundColor: '#080b17', zoom: 10, mapTypeControl: false, fullscreenControl: false })
        this.map.addListener('tilesloaded', () => {
          if (!this.mapInitFlag) {
            this.mapInitFlag = true
            clearInterval(processTimer)
            processTimer = null
            this.loading = false
            this.addClusterLayer()
          }
        })
      },
      calcBounds() {
        const bounds = new this.namespace.LatLngBounds()
        this.markerList.forEach(item => bounds.extend(item.position))
        return bounds
      },
      getMarkerInfo(obj) {
        const infoWindow = new this.namespace.InfoWindow({ content: obj.properties.content, ariaLabel: window.$t('projectInfo') })
        const { scaledSize } = obj.properties
        const marker = new this.namespace.Marker({
          position: obj.position,
          map: this.map,
          icon: { url: obj.properties.icon, scaledSize: new this.namespace.Size(scaledSize.width, scaledSize.height) },
          title: window.$t('projectInfo'),
        })
        marker.addListener('click', () => {
          infoWindow.open({ anchor: marker, map: this.map })
        })
        return marker
      },
      addClusterLayer() {
        const markers = this.markerList.map(item => this.getMarkerInfo(item))
        // eslint-disable-next-line no-unused-vars
        const markerCluster = new MarkerClusterer({ map: this.map, markers })
        const bounds = this.calcBounds()
        this.map.fitBounds(bounds)
      },
    },
    watch: {
      mapStyleType: {
        handler(newValue) {
          if (newValue === '2d') {
            this.map && this.map.setTilt(0)
            this.map && this.map.setMapTypeId('roadmap')
          } else if (newValue === '3d') {
            this.map && this.map.setTilt(67.5)
            this.map && this.map.setMapTypeId('roadmap')
          } else {
            this.map && this.map.setMapTypeId(newValue)
          }
        },
        deep: true,
      },
      markerList: {
        handler() {
          if (this.map) {
            this.addClusterLayer()
          }
        },
        deep: true,
        immediate: true,
      },
    },
    beforeDestroy() {
      this.map = null
    },
    mounted() {
      this.initMap()
    },
  }
</script>
<style lang="less" scoped>
  .map-content-body {
    width: 100%;
    height: 100%;
    position: relative;
    .google-map {
      width: 100%;
      height: 100%;
      background-image: none !important;
      /deep/.gm-style .gm-style-iw-c {
        background-color: transparent !important;
        border: 1px solid transparent !important;
        background: none !important;
        padding: 0px;
        max-width: unset !important;
        max-height: unset !important;
        box-shadow: none !important;
        margin-top: 10px !important;
        .gm-style-iw-chr {
          position: absolute;
          right: 8px;
          top: 8px;
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
      /deep/.gm-style .gm-style-iw-tc {
        display: none !important;
      }
      /deep/ .poi-info-window div {
        display: none !important;
      }
      /deep/ a[rel='noopener'] {
        display: none !important;
      }
      /deep/.gm-style-iw-d {
        overflow: hidden !important;
        max-height: unset !important;
      }
      /deep/.pro-title {
        text-align: center;
      }
      /deep/ .project-Height {
        padding-top: 30px;
        padding-bottom: 30px;
        padding-right: 30px;
        min-width: 300px;
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
        text-align: left;
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
  }
</style>
<style>
  .gmnoprint,
  .gm-style-cc {
    display: none !important;
  }
</style>
