<template>
  <div id="container-map"></div>
</template>
<script>
  import { MapManager, GOOGLE_MAP_CONFIG, useMapTypeConfig } from '@utils/mapManager'
  import { clampLng, clampLat } from '@utils/common'
  export default {
    data() {
      return {
        map: null,
        mapType: '',
      }
    },
    methods: {
      async loadMapLib() {
        const useMap = sessionStorage.getItem('useMap')
        this.mapType = useMapTypeConfig[useMap] || 'onlineMapGL'
        const ak = this.mapType === 'googleMap' ? this.$store.state.googleKey : this.$store.state.baiduKey
        await MapManager.loadMap(this.mapType, ak)
        const namespace = MapManager.getNamespace(this.mapType)
        this.namespace = namespace.core
      },
      async setGoogleMarker(position) {
        if (this.marker && this.marker.map) {
          this.marker.map = null
        }
        const { AdvancedMarkerElement } = await this.namespace.importLibrary('marker')
        this.marker = new AdvancedMarkerElement({ position, map: this.map, gmpDraggable: true, title: 'address-project' })
        this.marker.addListener('dragend', event => {
          const position = this.marker.position
          this.$emit('getLongitudes', [position.lng, position.lat])
          this.setGoogleLocation(position)
        })
      },
      async setGoogleLocation(position) {
        const location = new this.namespace.LatLng(position.lat, position.lng)
        const geocoder = new this.namespace.Geocoder()
        const response = await geocoder.geocode({ location })
        const address = response.results[0]
        if (address.address_components.length) {
          const county = address.address_components.find(({ types }) => types.includes('country'))
          const province = address.address_components.find(({ types }) => types.includes('administrative_area_level_1'))
          const city = address.address_components.find(({ types }) => types.includes('locality') || types.includes('administrative_area_level_2'))
          const area = address.address_components.find(({ types }) => types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('administrative_area_level_3'))
          const provinceValue = (province && province.long_name) || ''
          const replaceStr = `${(county && county.long_name) || ''}${(province && province.long_name) || ''}${(city && city.long_name) || ''}${(area && area.long_name) || ''}`
          this.$emit('getLocaltion', {
            province: provinceValue,
            city: (city && city.long_name) || provinceValue || '',
            district: (area && area.long_name) || '',
            street: address.formatted_address.replace(replaceStr, ''),
            streetNumber: '',
          })
        }
      },
      async handelMapSwith() {
        await this.loadMapLib()
        const { prjLocation } = this.$store.state.switchData
        const lng = clampLng(prjLocation.longitude)
        const lat = clampLat(prjLocation.latitude)
        if (this.mapType === 'googleMap') {
          const { Map } = await this.namespace.importLibrary('maps')
          this.map = new Map(document.getElementById('container-map'), { ...GOOGLE_MAP_CONFIG, zoom: 12, center: { lat, lng } })
          this.setGoogleMarker({ lat, lng })
          this.map.addListener('click', e => {
            this.setGoogleMarker(e.latLng)
            this.$emit('getLongitudes', [e.latLng.lng(), e.latLng.lat()])
            this.setGoogleLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })
          })
        } else {
          this.map = new this.namespace.Map('container-map') // 创建Map实例
          if (this.mapType === 'onlineMapGL') {
            if (this.$store.state.baiduStyleId) this.map.setMapStyleV2({ styleId: this.$store.state.baiduStyleId })
          } else {
            this.map.setMaxZoom(this.$store.state.personalBaiduOfflineMapLevel || 10)
          }
          this.map.addEventListener('click', e => {
            const point = e.point || e.latlng
            this.$emit('getLongitudes', [point.lng, point.lat])
            var gc = new this.namespace.Geocoder()
            gc.getLocation(point, rs => {
              this.$emit('getLocaltion', rs.addressComponents)
            })
            this.map.clearOverlays()
            let newPoint = new this.namespace.Point(e.point.lng, e.point.lat)
            let newMarker = new this.namespace.Marker(newPoint)
            this.map.addOverlay(newMarker)
          })
          const point = new this.namespace.Point(lng, lat)
          this.map.centerAndZoom(point, 8)
          var marker = new this.namespace.Marker(point)
          this.map.addOverlay(marker)
          this.map.enableScrollWheelZoom(true)
          this.map.setDisplayOptions && this.map.setDisplayOptions({ indoor: false })
        }
      },
    },
    mounted() {
      this.handelMapSwith()
    },
    destroyed() {
      this.map && this.map.destroy && this.map.destroy()
      this.map = null
    },
  }
</script>
<style lang="less" scoped>
  #container-map {
    overflow: hidden;
    width: 100%;
    height: 415px;
  }
</style>
