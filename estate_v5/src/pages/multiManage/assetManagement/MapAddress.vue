<template>
  <div>
    <div style="margin: 10px auto">
      <Input readonly v-model="addressValue" :placeholder="$t('clickMapGetAddress')"></Input>
    </div>
    <div style="margin-top: 20px; margin: 0 auto">
      <div id="containers" style="height: 400px; width: 100%"></div>
    </div>
  </div>
</template>

<script>
  import { MapManager, GOOGLE_MAP_CONFIG, useMapTypeConfig } from '@utils/mapManager'
  import { geocodingAnalysis } from '@/api/common/index'
  import { clampLng, clampLat } from '@utils/common'
  export default {
    data() {
      return {
        isOnline: null,
        map: null,
        namespace: null,
        addressValue: '',
        mapType: '',
      }
    },
    mounted() {
      this.initMap()
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
      async initMap() {
        await this.loadMapLib()
        const { prjLocation } = this.$store.state.switchData
        const lng = clampLng(prjLocation.longitude)
        const lat = clampLat(prjLocation.latitude)
        if (this.mapType === 'googleMap') {
          const { Map } = await this.namespace.importLibrary('maps')
          this.map = new Map(document.getElementById('containers'), { ...GOOGLE_MAP_CONFIG, zoom: 12, center: { lat, lng } })
          this.setGoogleMarker({ lat, lng })
          this.map.addListener('click', e => {
            this.setGoogleMarker(e.latLng)
            this.setGoogleLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })
          })
        } else {
          this.map = new this.namespace.Map('containers')
          if (this.mapType === 'onlineMapGL') {
            if (this.$store.state.baiduStyleId) this.map.setMapStyleV2({ styleId: this.$store.state.baiduStyleId })
          } else {
            this.map.setMaxZoom(this.$store.state.personalBaiduOfflineMapLevel || 10)
          }
          this.map.addEventListener('click', e => {
            const point = e.latlng || e.point
            this.setMarker(point.lng, point.lat)
            this.geocodingAnalysis(point.lng, point.lat)
          })
          const point = new this.namespace.Point(lng, lat)
          this.map.centerAndZoom(point, 8)
          this.setMarker(lng, lat)
          this.map.enableScrollWheelZoom(true)
          this.map.setDisplayOptions && this.map.setDisplayOptions({ indoor: false })
        }
      },
      async setGoogleMarker(position) {
        if (this.marker && this.marker.map) {
          this.marker.map = null
        }
        const { AdvancedMarkerElement } = await this.namespace.importLibrary('marker')
        this.marker = new AdvancedMarkerElement({ position, map: this.map, gmpDraggable: true, title: 'address-project' })
        this.marker.addListener('dragend', event => {
          const position = this.marker.position
          this.setGoogleLocation(position)
        })
      },
      async setGoogleLocation(position) {
        const location = new this.namespace.LatLng(position.lat, position.lng)
        const geocoder = new this.namespace.Geocoder()
        const response = await geocoder.geocode({ location })
        const address = response.results[0]
        this.addressValue = address.formatted_address
      },
      setMarker(lng, lat) {
        if (!this.map) return
        this.map.clearOverlays()
        const point = new this.namespace.Point(lng, lat)
        const marker = new this.namespace.Marker(point)
        this.map.addOverlay(marker)
        return marker
      },
      async geocodingAnalysis(lng, lat) {
        const res = await geocodingAnalysis({ location: `${lat},${lng}` })
        if (!res.success) this.$Message.error(res.message)
        const { province, city, district, town, street } = res.data.addressComponent
        this.addressValue = province + city + (district || town) + street
      },
    },
    beforeDestroy() {
      this.map && this.map.destroy && this.map.destroy()
    },
  }
</script>

<style></style>
