<template>
  <div>
    <div class="bgColor">
      <h3 class="mar-t15">{{ $t('projectContact') }}</h3>
      <div v-for="(item, index) in contactList" :key="index">
        <div>{{ $t('contacts') }}{{ index + 1 }}：</div>
        <div class="dis-input">
          <Input v-model="item.name" :placeholder="$t('pleaseInputName')" class="w100"></Input>
          <Input v-model="item.telephone" :placeholder="$t('pleaseEnterConcat')" class="w200"></Input>
        </div>
      </div>
      <div>
        <Button type="primary" @click="saveNameAndTelephone">{{ $t('save') }}</Button>
      </div>
    </div>
    <div class="systemBody" style="height: 800px">
      <h3>{{ $t('projectAddr') }}</h3>
      <div style="margin-top: 20px">{{ $t('projectAddr') }}</div>
      <Row style="margin-top: 10px" :gutter="16">
        <Col>
          <Row>
            <Col :span="3">{{ $t('province') }} :</Col>
            <Col :span="20"><Input size="small" v-model="provinceValue"></Input></Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col :span="3">{{ $t('city') }} :</Col>
            <Col :span="20"><Input size="small" v-model="cityValue"></Input></Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col :span="3">{{ $t('region') }} :</Col>
            <Col :span="20">
              <Input size="small" v-model="areaValue"></Input>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col :span="7">{{ $t('addrDetail') }} :</Col>
            <Col :span="17"><Input size="small" v-model="streetValue"></Input></Col>
          </Row>
        </Col>
      </Row>
      <div style="margin-top: 20px">{{ $t('latLng') }}</div>
      <Row style="margin-top: 10px" :gutter="16">
        <Col>
          <Row>
            <Col :span="5">{{ $t('longitude') }} :</Col>
            <Col :span="18"><Input size="small" v-model="longitudeValue"></Input></Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col :span="5">{{ $t('latitude') }} :</Col>
            <Col :span="18">
              <Input size="small" v-model="latitudeValue"></Input>
            </Col>
          </Row>
        </Col>
      </Row>
      <div style="margin-top: 20px">{{ $t('mapQuery') }}</div>
      <Row style="margin-top: 10px" :gutter="16">
        <Col :span="10"><Input size="small" v-model="checkMapValue" :placeholder="$t('pleaseEnter')" id="suggestId"></Input></Col>
        <div id="searchResultPanel" style="border: 1px solid #c0c0c0; width: 150px; height: auto; display: none"></div>
        <Col :span="4">
          <Button style="background: rgba(0, 126, 255, 0.1)" ghost size="small" type="primary" @click="getcheckMapValue">{{ $t('query') }}</Button>
        </Col>
      </Row>
      <Row style="margin-top: 20px">
        <div style="height: 400px; width: 100%">
          <div id="containers"></div>
        </div>
      </Row>
      <Row style="margin-top: 30px">
        <Button type="primary" @click="saveProjectAdress(1)">{{ $t('save') }}</Button>
      </Row>
    </div>
    <div style="margin-top: 10px; background: #1a202e; padding: 20px">
      <h3>{{ $t('deviceLocationHierarchyCustomization') }}</h3>
      <Row style="margin-top: 20px">
        <Col :span="6" style="color: #999999">{{ $t('systemLevelName') }}</Col>
        <Col style="color: #999999; margin-left: 25px">{{ $t('customHierarchyName') }}</Col>
      </Row>
      <div style="margin-top: 10px; display: flex">
        <div style="color: #999999"><Input v-model="$store.state.switchData.prjLocation.positionLabelA" readonly style="width: 250px" /></div>
        <i class="icon-v5 icon-v5--op-jiantouzuo" style="font-size: 24px; color: #0da8ed; margin: 0 10px"></i>
        <div style="color: #999999">
          <Input v-model="positionA" :placeholder="$t('pleaseEnter')" :class="redStyleA ? 'redStyleAss' : ''" @on-blur="getPositionValue(positionA, 1)" maxlength="10" style="width: 250px" />
          <span v-if="redStyleA" style="font-size: 12px; color: red">{{ $t('levelCannotBeEmpty') }}</span>
        </div>
      </div>
      <div style="margin-top: 10px; display: flex">
        <div style="color: #999999"><Input v-model="$store.state.switchData.prjLocation.positionLabelB" readonly style="width: 250px" /></div>
        <i class="icon-v5 icon-v5--op-jiantouzuo" style="font-size: 24px; color: #0da8ed; margin: 0 10px"></i>
        <div style="color: #999999"><Input v-model="positionB" :placeholder="$t('pleaseEnter')" :class="redStyleB ? 'redStyleAss' : ''" maxlength="10" @on-blur="getPositionValue(positionB, 2)" style="width: 250px" /></div>
      </div>
      <div style="margin-top: 10px; display: flex">
        <div style="color: #999999"><Input v-model="$store.state.switchData.prjLocation.positionLabelC" readonly style="width: 250px" /></div>
        <i class="icon-v5 icon-v5--op-jiantouzuo" style="font-size: 24px; color: #0da8ed; margin: 0 10px"></i>
        <div style="color: #999999"><Input v-model="positionC" :placeholder="$t('pleaseEnter')" :class="redStyleC ? 'redStyleAss' : ''" @on-blur="getPositionValue(positionC, 3)" maxlength="10" style="width: 250px" /></div>
      </div>
      <Button type="primary" @click="saveProjectAdress(2)" style="margin-top: 5px">{{ $t('save') }}</Button>
    </div>
  </div>
</template>
<script>
  import { switchHover, updateProjectInfo } from '@/api/public'
  import { geocodingAnalysis } from '@/api/common/index'
  import { MapManager, GOOGLE_MAP_CONFIG, useMapTypeConfig } from '@utils/mapManager'
  import { clampLng, clampLat } from '@utils/common'
  import store from '@/store/index'
  export default {
    data() {
      return {
        contactList: [
          { name: '', telephone: '' },
          { name: '', telephone: '' },
          { name: '', telephone: '' },
        ],
        redStyleA: false,
        redStyleB: false,
        redStyleC: false,
        positionA: '',
        positionB: '',
        positionC: '',
        value: '',
        provinceValue: '',
        areaValue: '',
        streetValue: '',
        longitudeValue: '',
        latitudeValue: '',
        checkMapValue: '',
        cityValue: '',
        adress: '',
        prjId: '',
        updateType: 1,
        mapType: '',
        map: null,
      }
    },
    async mounted() {
      await this.getProjectAdress()
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
        const lng = clampLng(this.longitudeValue)
        const lat = clampLat(this.latitudeValue)
        if (this.mapType === 'googleMap') {
          const { Map } = await this.namespace.importLibrary('maps')
          this.map = new Map(document.getElementById('containers'), { ...GOOGLE_MAP_CONFIG, zoom: 16, center: { lat, lng } })
          this.setGoogleMarker({ lat, lng })
          this.map.addListener('click', e => {
            this.setGoogleMarker(e.latLng)
            this.setGoogleLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })
          })
        } else {
          this.map = new this.namespace.Map('containers')
          if (this.mapType === 'onlineMapGL' && this.$store.state.baiduStyleId) {
            this.map.setMapStyleV2({ styleId: this.$store.state.baiduStyleId })
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
        this.longitudeValue = position.lng
        this.latitudeValue = position.lat
        const location = new this.namespace.LatLng(position.lat, position.lng)
        const geocoder = new this.namespace.Geocoder()
        const response = await geocoder.geocode({ location })
        const address = response.results[0]
        if (address.address_components.length) {
          const county = address.address_components.find(({ types }) => types.includes('country'))
          const province = address.address_components.find(({ types }) => types.includes('administrative_area_level_1'))
          const city = address.address_components.find(({ types }) => types.includes('locality') || types.includes('administrative_area_level_2'))
          const areaValue = address.address_components.find(({ types }) => types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('administrative_area_level_3'))
          this.provinceValue = (province && province.long_name) || ''
          this.cityValue = (city && city.long_name) || this.provinceValue || ''
          this.areaValue = (areaValue && areaValue.long_name) || ''
          const replaceStr = `${(county && county.long_name) || ''}${(province && province.long_name) || ''}${(city && city.long_name) || ''}${this.areaValue || ''}`
          this.streetValue = address.formatted_address.replace(replaceStr, '')
        }
      },
      async geocodingAnalysis(lng, lat) {
        const res = await geocodingAnalysis({ location: `${lat},${lng}` })
        if (res.success) {
          let addComp = { ...res.data.addressComponent, pointName: res.data.pois.length && res.data.pois[0].name }
          this.setLocaltionValue(addComp)
        } else {
          this.$Message.error(res.message)
        }
      },
      setMarker(lng, lat) {
        if (!this.map) return
        this.longitudeValue = lng
        this.latitudeValue = lat
        this.map.clearOverlays()
        const point = new this.namespace.Point(lng, lat)
        const marker = new this.namespace.Marker(point)
        this.map.addOverlay(marker)
        return marker
      },
      setLocaltionValue(val) {
        if (!val) {
          this.$Message.error(this.$t('pleaseClickMapAgainGetLocation'))
        } else {
          this.provinceValue = val.province
          this.cityValue = val.city
          this.areaValue = val.district || val.town
          this.streetValue = val.pointName || val.street
        }
      },
      async saveProjectAdress(val) {
        if (this.longitudeValue === '' || this.latitudeValue === '') return this.$Message.error({ content: this.$t('longitudeAndLatitudeCannotBeEmpty') })
        if (val === 2 && (!this.positionA || !this.positionB || !this.positionC)) return this.$Message.error({ content: this.$t('theHierarchyCannotBeSetToEmpty') })
        let params = {
          updateType: val,
          prjId: this.prjId,
          longitude: this.longitudeValue,
          latitude: this.latitudeValue,
          provinceName: this.provinceValue,
          cityName: this.cityValue,
          countyName: this.areaValue,
          street: this.streetValue,
          positionLabelA: val === 1 ? '' : this.positionA,
          positionLabelB: val === 1 ? '' : this.positionB,
          positionLabelC: val === 1 ? '' : this.positionC,
        }
        const res = await updateProjectInfo(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('modifySuccess') })
          this.getProjectAdress()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getcheckMapValue() {
        if (this.checkMapValue) {
          if (this.mapType === 'googleMap') {
            const geocoder = new this.namespace.Geocoder()
            geocoder.geocode({ address: this.checkMapValue }, (results, status) => {
              if (status === 'OK') {
                const { geometry } = results[0]
                this.map.setCenter(geometry.location)
                this.setGoogleMarker(geometry.location)
              } else {
                this.$Message.error({ content: this.$t('positionNoresult') })
              }
            })
          } else {
            const myGeo = new this.namespace.Geocoder()
            myGeo.getPoint(
              this.checkMapValue,
              point => {
                if (point) {
                  this.map.centerAndZoom(point, 16)
                  this.setMarker(point.lng, point.lat)
                  this.geocodingAnalysis(point.lng, point.lat)
                } else {
                  this.$Message.error({ content: this.$t('positionNoresult') })
                }
              },
              this.checkMapValue
            )
          }
        } else {
          this.$Message.error({ content: this.$t('plsEnPostionSearh') })
        }
      },
      async getProjectAdress() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await switchHover(params)
        if (res.success) {
          this.provinceValue = res.data.prjLocation.provinceName
          this.cityValue = res.data.prjLocation.cityName
          this.areaValue = res.data.prjLocation.countyName
          this.streetValue = res.data.prjLocation.street
          this.longitudeValue = res.data.prjLocation.longitude
          this.latitudeValue = res.data.prjLocation.latitude
          this.checkMapValue = res.data.prjLocation.address
          this.prjId = res.data.prjId
          this.contactList = [
            { name: res.data.linkMan, telephone: res.data.linkTel },
            { name: res.data.linkMan2, telephone: res.data.linkTel2 },
            { name: res.data.linkMan3, telephone: res.data.linkTel3 },
          ]
          store.commit('switchData', res.data)
        } else {
          this.$Message.error(res.message)
        }
      },
      async saveNameAndTelephone() {
        let params = {
          updateType: 0,
          prjId: this.prjId,
          prjManager: this.contactList[0].name,
          prjTel: this.contactList[0].telephone,
          linkMan2: this.contactList[1].name,
          linkTel2: this.contactList[1].telephone,
          linkMan3: this.contactList[2].name,
          linkTel3: this.contactList[2].telephone,
        }
        const res = await updateProjectInfo(params)
        if (res.success) {
          this.$Message.success(this.$t('savedSuccessfully'))
        } else {
          this.$Message.error(res.message)
        }
      },
      getPositionValue(val, type) {
        if (!val) {
          if (type === 1) {
            this.redStyleA = true
          }
          if (type === 2) {
            this.redStyleB = true
          }
          if (type === 3) {
            this.redStyleC = true
          }
        } else {
          if (type === 1) {
            this.redStyleA = false
          }
          if (type === 2) {
            this.redStyleB = false
          }
          if (type === 3) {
            this.redStyleC = false
          }
        }
      },
    },
    beforeDestroy() {
      this.map && this.map.destroy && this.map.destroy()
      this.map = null
    },
  }
</script>

<style lang="less" scoped>
  .redStyleAss {
    border: 1px solid red;
    border-radius: 5px;
  }
  .mar-t15 {
    margin-bottom: 15px;
  }
  .dis-input {
    display: flex;
    margin: 10px 0;
  }
  .w100 {
    width: 150px;
  }
  .w200 {
    width: 200px;
    margin-left: 15px;
  }
  .bgColor {
    background: #1a202e;
    margin-bottom: 10px;
    padding: 15px;
  }
  #containers {
    overflow: hidden;
    width: 100%;
    height: 415px;
    margin: 0;
    font-family: '微软雅黑';
    .project-infoWindow {
      h3 {
        text-align: center;
        color: #fff;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .box {
    color: #a35fb3;
    font-size: 20px;
    line-height: 50px;
    .txt {
      display: inline-block;
      width: 100%;
      animation: 5s wordsLoop linear infinite normal;
    }
  }
  @keyframes wordsLoop {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(-100%);
    }
  }
</style>
