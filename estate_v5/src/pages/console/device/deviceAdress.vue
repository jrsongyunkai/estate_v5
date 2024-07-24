<template>
  <div>
    <Form ref="formDynamic" :model="formDynamic" :rules="ruleValidate">
      <Row>
        <FormItem :label="$t('deviceAddress') + ':'" :label-width="90">
          <Input style="width: 120px" v-model="provinceValue" :placeholder="$t('province')"></Input>
        </FormItem>
        <FormItem :label-width="10">
          <Input style="width: 120px" v-model="cityValue" :placeholder="$t('city')"></Input>
        </FormItem>
        <FormItem :label-width="10">
          <Input style="width: 120px" v-model="areaValue" :placeholder="$t('region')"></Input>
        </FormItem>
        <FormItem :label-width="10">
          <Input style="width: 200px" maxlength="40" v-model="streetValue" :placeholder="$t('street')"></Input>
        </FormItem>
      </Row>
      <Row>
        <FormItem :label="$store.state.switchData.prjLocation.positionLabelA + ':'" prop="buildValue" :label-width="90">
          <!-- $t('control.building')  -->
          <Input style="width: 200px" maxlength="40" v-model="formDynamic.buildValue" v-if="!tHistory"></Input>
          <Dropdown @on-click="handleSelectBuild" trigger="click" v-if="tHistory">
            <Input style="width: 200px" maxlength="40" v-model="formDynamic.buildValue"></Input>
            <DropdownMenu slot="list" style="width: 200px">
              <DropdownItem v-for="(item, index) in matchedOptionsBuild" :key="index" :name="item.floorName" :title="item.floorName">
                {{ item.floorName }}
                <Icon custom="icon-v5 icon-v5-shanchu2" @click.stop="handledropdel(item)"></Icon>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
        <Select v-model="formDynamic.buildSort" style="width: 120px" class="ml-10">
          <Option v-for="item in sortData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Row>
      <Row>
        <FormItem :label="$store.state.switchData.prjLocation.positionLabelB + ':'" prop="unitValue" :label-width="90">
          <!-- $t('control.unit') -->
          <Input style="width: 200px" maxlength="40" v-model="formDynamic.unitValue" v-if="!tHistory"></Input>
          <Dropdown @on-click="handleSelectUnit" trigger="click" v-if="tHistory">
            <Input style="width: 200px" maxlength="40" v-model="formDynamic.unitValue"></Input>
            <DropdownMenu slot="list" style="width: 200px">
              <DropdownItem v-for="(item, index) in matchedOptionsUnit" :key="index" :name="item.floorName" :title="item.floorName">
                {{ item.floorName }}
                <Icon custom="icon-v5 icon-v5-shanchu2" @click.stop="handledropdel(item)"></Icon>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
        <Select v-model="formDynamic.unitSort" style="width: 120px" class="ml-10">
          <Option v-for="item in sortData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Row>
      <Row>
        <FormItem :label="$store.state.switchData.prjLocation.positionLabelC + ':'" prop="roomValue" :label-width="$store.state.locale !== 'zh-CN' ? 120 : 90">
          <!--  $t('control.room') -->
          <Input style="width: 200px" v-model="formDynamic.roomValue" v-if="!tHistory"></Input>
          <Dropdown @on-click="handleSelectRoom" trigger="click" v-if="tHistory">
            <Input style="width: 200px" maxlength="40" v-model="formDynamic.roomValue"></Input>
            <DropdownMenu slot="list" style="width: 200px">
              <DropdownItem v-for="(item, index) in matchedOptionsRoom" :key="index" :name="item.floorName" :title="item.floorName">
                {{ item.floorName }}
                <Icon custom="icon-v5 icon-v5-shanchu2" @click.stop="handledropdel(item)"></Icon>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormItem>
        <Select v-model="formDynamic.roomSort" style="width: 120px" class="ml-10">
          <Option v-for="item in sortData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Row>
      <Row></Row>
      <Row>
        <FormItem :label="$t('latLng') + ':'" :label-width="90">
          <Input style="width: 200px" v-model="longitudeValue" :placeholder="$t('enterLongitude')"></Input>
        </FormItem>
        <FormItem :label-width="10">
          <Input style="width: 200px" v-model="latitudeValue" :placeholder="$t('pleaseEnterLatitude')"></Input>
        </FormItem>
        <template v-if="isSupport">
          <Button type="primary" ghost class="mrl-10" @click="syncLngLatFromDevice" :loading="syncLoading">{{ $t('readFromDevice') }}</Button>
          <Button type="primary" ghost custom-icon="icon-v5 icon-v5-refresh" class="mrl-10" @click="getLngLat"></Button>
        </template>
      </Row>
    </Form>
    <Row style="margin-top: 20px">
      <div class="map">
        <Row class="search">
          <Input style="width: 200px" v-model="checkMapValue" :placeholder="$t('pleaseEnter')"></Input>
          <Button ghost type="primary" @click="getcheckMapValue">{{ $t('query') }}</Button>
        </Row>
        <div id="containers"></div>
      </div>
    </Row>
    <Row type="flex" justify="end" style="margin-top: 30px">
      <Col>
        <Button type="primary" @click="saveDeviceAdrress">{{ $t('save') }}</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { macAlias, queryPrjFloor, delPrjFloor } from '@/api/public'
  import { MapManager, GOOGLE_MAP_CONFIG, useMapTypeConfig } from '@/untils/mapManager'
  import { refreshLongitudeLatitude, longitudeAndLatitude } from '@api/multiManage/latlongTimer'
  import { checkEnableLongAndLatitude } from '../../../api/console/device'
  import { sleep, clampLng, clampLat } from '@utils/common'
  import { geocodingAnalysis } from '@/api/common/index'

  export default {
    props: {
      propmapValue: { type: Object, default: () => {} },
    },
    //   this.deviceAdress = res.data.provinceName + res.data.cityName + res.data.countyName + res.data.street + res.data.build + res.data.unit + res.data.room
    computed: {
      matchedOptionsBuild() {
        if (this.formDynamic.buildValue !== '') {
          return this.matchedOptionsBuildData.filter(item => item.floorName.indexOf(this.formDynamic.buildValue) > -1)
        } else {
          return this.matchedOptionsBuildData
        }
      },
      matchedOptionsUnit() {
        if (this.formDynamic.buildValue !== '') {
          return this.matchedOptionsUnitData.filter(item => item.floorName.indexOf(this.formDynamic.unitValue) > -1)
        } else {
          return this.matchedOptionsUnitData
        }
      },
      matchedOptionsRoom() {
        if (this.formDynamic.roomValue !== '') {
          return this.matchedOptionsRoomData.filter(item => item.floorName.indexOf(this.formDynamic.roomValue) > -1)
        } else {
          return this.matchedOptionsRoomData
        }
      },
    },
    data() {
      return {
        isSupport: false,
        matchedOptionsBuildData: [],
        matchedOptionsUnitData: [],
        matchedOptionsRoomData: [],
        formDynamic: {
          buildValue: this.propmapValue.build ? this.propmapValue.build : '',
          unitValue: this.propmapValue.unit ? this.propmapValue.unit : '',
          roomValue: this.propmapValue.room ? this.propmapValue.room : '',
          buildSort: this.propmapValue.buildSno ? this.propmapValue.buildSno : '',
          unitSort: this.propmapValue.unitSno ? this.propmapValue.unitSno : '',
          roomSort: this.propmapValue.roomSno ? this.propmapValue.roomSno : '',
        },
        ruleValidate: {
          buildValue: [{ required: true, message: this.$t('buildingNot'), trigger: 'blur' }],
          unitValue: [{ required: true, message: this.$t('unitNot'), trigger: 'blur' }],
          roomValue: [{ required: true, message: this.$t('roomNot'), trigger: 'blur' }],
        },
        tHistory: this.propmapValue.tHistory ? this.propmapValue.tHistory : false,
        provinceValue: this.propmapValue.provinceName ? this.propmapValue.provinceName : '',
        areaValue: this.propmapValue.countyName ? this.propmapValue.countyName : '',
        streetValue: this.propmapValue.street ? this.propmapValue.street : '',
        longitudeValue: this.propmapValue.longitude ? this.propmapValue.longitude : '',
        latitudeValue: this.propmapValue.latitude ? this.propmapValue.latitude : '',
        checkMapValue: '',
        cityValue: this.propmapValue.cityName ? this.propmapValue.cityName : '',
        adress: '',
        sortData: [],
        syncLoading: false,
        mapType: '',
      }
    },
    mounted() {
      this.initMap()
      this.querySort()
      this.handlequeryPrjFloorbuild('1')
      this.handlequeryPrjFloorunit('2')
      this.handlequeryPrjFloorroom('3')
      this.checkDeviceIsSupport()
    },
    beforeDestroy() {
      this.map && this.map.destroy && this.map.destroy()
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
      async initMap() {
        await this.loadMapLib()
        const lng = clampLng(this.propmapValue.longitude)
        const lat = clampLat(this.propmapValue.latitude)
        if (this.mapType === 'googleMap') {
          const { Map } = await this.namespace.importLibrary('maps')
          this.map = new Map(document.getElementById('containers'), { ...GOOGLE_MAP_CONFIG, center: { lat, lng } })
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
      async geocodingAnalysis(lng, lat) {
        const res = await geocodingAnalysis({ location: `${lat},${lng}` })
        if (res.success) {
          let addComp = { ...res.data.addressComponent, pointName: res.data.pois.length && res.data.pois[0].name }
          this.getLocaltion(addComp)
        } else {
          this.$Message.error(res.message)
        }
      },
      async getLngLat() {
        const { success, message, data } = await refreshLongitudeLatitude({ mac: this.propmapValue.mac })
        if (!success) {
          return this.$Message.error(message)
        }
        this.setMarker(data.longitude, data.latitude)
        this.map.panTo(new this.namespace.Point(data.longitude, data.latitude))
      },
      async syncLngLatFromDevice() {
        this.syncLoading = true
        try {
          const { success, message } = await longitudeAndLatitude({ mac: this.propmapValue.mac })
          if (!success) {
            this.$Message.error(message)
          } else {
            this.$Message.success(message)
            await sleep(3000)
            await this.getLngLat()
          }
        } finally {
          this.syncLoading = false
        }
      },
      async checkDeviceIsSupport() {
        const param = { macs: this.propmapValue.mac }
        const res = await checkEnableLongAndLatitude(param)
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.isSupport = res.data[`${this.propmapValue.mac}`]
      },
      handleSelectBuild(val) {
        this.formDynamic.buildValue = val
      },
      handleSelectUnit(val) {
        this.formDynamic.unitValue = val
      },
      handleSelectRoom(val) {
        this.formDynamic.roomValue = val
      },
      async handledropdel(item) {
        let params = { projectCode: this.$store.state.projectCode, floorType: item.floorType, floorName: item.floorName }
        const res = await delPrjFloor(params)
        if (res.success) {
          this.handlequeryPrjFloorbuild(item.floorType)
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlequeryPrjFloorbuild(type) {
        let params = { projectCode: this.$store.state.projectCode, floorType: type }
        const res = await queryPrjFloor(params)
        this.matchedOptionsBuildData = res.datas.map(val => ({ floorName: val.floorName, floorType: val.floorType, id: val.id, projectCode: val.projectCode }))
      },
      async handlequeryPrjFloorunit(type) {
        let params = { projectCode: this.$store.state.projectCode, floorType: type }
        const res = await queryPrjFloor(params)
        this.matchedOptionsUnitData = res.datas.map(val => ({ floorName: val.floorName, floorType: val.floorType, id: val.id, projectCode: val.projectCode }))
      },
      async handlequeryPrjFloorroom(type) {
        let params = { projectCode: this.$store.state.projectCode, floorType: type }
        const res = await queryPrjFloor(params)
        this.matchedOptionsRoomData = res.datas.map(val => ({ floorName: val.floorName, floorType: val.floorType, id: val.id, projectCode: val.projectCode }))
      },
      querySort() {
        const sortIndex = new Array(99).fill(undefined).map(idx => idx)
        let sortFunction = ''
        sortIndex.map((val, index) => {
          sortFunction = `${index}`
          this.sortData.push({ value: sortFunction, label: sortFunction })
        })
      },
      async saveDeviceAdrress() {
        if (!this.formDynamic.buildValue || !this.formDynamic.unitValue || !this.formDynamic.roomValue) return this.$Message.error({ content: this.$t('plsEuiUniRoom') })
        let params = {
          mac: this.propmapValue.mac,
          longitude: this.longitudeValue ? this.longitudeValue : '',
          latitude: this.latitudeValue ? this.latitudeValue : '',
          provinceName: this.provinceValue ? this.provinceValue : '',
          cityName: this.cityValue ? this.cityValue : '',
          countyName: this.areaValue ? this.areaValue : '',
          street: this.streetValue ? this.streetValue : '',
          build: this.formDynamic.buildValue,
          unit: this.formDynamic.unitValue,
          room: this.formDynamic.roomValue,
          buildSno: this.formDynamic.buildSort,
          unitSno: this.formDynamic.unitSort,
          roomSno: this.formDynamic.roomSort,
        }
        let local = { buildValue: this.formDynamic.buildValue, unitValue: this.formDynamic.unitValue, roomValue: this.formDynamic.roomValue }
        this.$emit('updateLocation', local)
        const res = await macAlias(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('modifySuccess') })
          this.$emit('closeFlag', false)
          this.$emit('getAdress', params)
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
      getLocaltion(val) {
        if (!val) {
          this.$Message.error(this.$t('againgetLocation'))
        } else {
          this.provinceValue = val.province
          this.cityValue = val.city
          this.areaValue = val.district || val.town
          this.streetValue = val.pointName || val.street
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .mrl-10 {
    margin-left: 10px;
  }
  .ivu-select-dropdown {
    left: 0px !important;
  }
  .ivu-icon {
    font-size: 12px;
  }
  .ivu-dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  /deep/.ivu-select-dropdown {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .map {
    height: 400px;
    width: 100%;
    position: relative;
    .search {
      position: absolute;
      right: 20px;
      top: 0px;
      z-index: 99;
      margin-top: 10px;
      Button {
        margin-left: 10px;
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
