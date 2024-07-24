<template>
  <div class="content_middle tc">
    <div class="map-box-content">
      <visualScreenOnLineMapVue v-if="isShowMap === 'online'" :markerList="projectsOption" :mapType="currentMapType" ref="mapOnlineRef" @disabled3D="disable3D"></visualScreenOnLineMapVue>
      <visualScreenOffLineMapVue v-else-if="isShowMap === 'offline'" :markerList="projectsOption"></visualScreenOffLineMapVue>
      <visualScreenOnLineGoogleMap v-else-if="isShowMap === 'google'" :markerList="projectsOption" :mapStyleType="currentMapType"></visualScreenOnLineGoogleMap>
    </div>
    <!-- 设备分合闸类型 -->
    <!-- <div class="left-close-open" v-if="isShowMap !== 'offline'">
      <div class="left-btn pointer" v-for="(item, index) in imgList" :key="index">
        <img :src="isCloseActive === item.active ? item.selectUrl : item.url" alt="" class="active-img" @click="getCloseOpen(item)" />
      </div>
    </div> -->
    <div class="init-Map-zoom" v-if="isShowMap !== 'google'">
      <img src="../../assets/images/initMapZoom.png" alt="" class="map-icon-init pointer" @click="initMapZoom" />
    </div>
    <div class="right-mapType" v-if="isShowMap !== 'offline'">
      <div class="right-btnType pointer" v-for="(item, index) in typeBtnList" :key="index">
        <img :src="currentMapType === item.type ? item.selectUrl : item.url" alt="" class="active-Type-img" :class="item.disabled ? 'disable-Style' : ''" @click="setMapType(item)" />
      </div>
    </div>
    <div class="industryType-bottom pointer">
      <msNav :industryTypesData="industryTypesData" @changeProjectShow="changeProjectShow" :loadingStatus="loadingStatus" :key="loadKey"></msNav>
    </div>
  </div>
</template>

<script>
  import { loadMetaData } from '@/api/visualScreen/index'
  import _middleSecNav from './_middleSecNav.vue'
  import visualScreenOnLineMapVue from './visualScreenOnLineMap.vue'
  import visualScreenOffLineMapVue from './visualScreenOff_LineMap.vue'
  import visualScreenOnLineGoogleMap from './visualScreenOnLineGoogleMap.vue'
  import { factoryData, factoryGoogleData } from './visualScreenFunc'
  import { clampLng, clampLat } from '@utils/common'
  import { getProject } from '@/api/account'
  // import { projectIndexDB } from '@/plugins/indexDB/index'
  // import store from '@/store/index'
  export default {
    props: {
      loadingStatus: {
        type: Object,
      },
      curProOrMacPoint: {
        type: String,
        default: '',
      },
    },
    components: {
      msNav: _middleSecNav,
      visualScreenOnLineMapVue,
      visualScreenOffLineMapVue,
      visualScreenOnLineGoogleMap,
    },
    data() {
      return {
        parentProjectList: [],
        selectDeviceType: [],
        currentMapType: '2d',
        typeBtnList: [
          {
            url: require('../../assets/images/2dType@2x(1).png'),
            selectUrl: require('../../assets/images/2d-selectType@2x.png'),
            type: '2d',
            disabled: false,
          },
          {
            url: require('../../assets/images/3dType@2x.png'),
            selectUrl: require('../../assets/images/3d-selectType@2x.png'),
            type: '3d',
            disabled: false,
          },
          {
            url: require('../../assets/images/satelite@2x.png'),
            selectUrl: require('../../assets/images/satelite-Select@2x.png'),
            type: 'satellite',
            disabled: false,
          },
        ],
        isCloseActive: '',
        imgList: [
          {
            url: require('../../assets/images/close@2x.png'),
            selectUrl: require('../../assets/images/closeSelect@2x.png'),
            active: 'close',
          },
          {
            url: require('../../assets/images/open@2x.png'),
            selectUrl: require('../../assets/images/open-select@2x.png'),
            active: 'open',
          },
        ],
        closeUrl: require('../../assets/images/close@2x.png'),
        openUrl: require('../../assets/images/open@2x.png'),
        industryTypesData: [],
        isShowMap: null,
        loadKey: null,
        projectsOption: [],
        allProjectList: [],
        selectProjects: [],
      }
    },
    created() {
      this.handleProject()
      this.getMap()
    },
    mounted() {
      this.initIndustyType()
    },
    methods: {
      disable3D(val) {
        this.typeBtnList[1].disabled = val
      },
      initMapZoom() {
        if (this.currentMapType === '3d' && this.$refs.mapOnlineRef.map.getZoom() > 7) {
          this.currentMapType = '2d'
          this.$refs.mapOnlineRef.init()
          return
        }
        this.$refs.mapOnlineRef.getInitViewPort()
      },
      setMapType(item) {
        if (item.type === this.currentMapType || item.disabled) return
        this.currentMapType = item.type
      },
      async handleProject() {
        let params = { projectName: '', provinceId: '', cityId: '', countyId: '', statsAlarm: '2' }
        let r = await getProject(params)
        this.parentProjectList = r.data
        this.isHeadShow = true
      },
      getMap() {
        this.isShowMap = sessionStorage.getItem('useMap') === 'BAIDU_OFFLINE' ? 'offline' : sessionStorage.getItem('useMap') === 'GOOGLE' ? 'google' : 'online'
      },
      initIndustyType() {
        this.industryTypesData = []
        loadMetaData().then(res => {
          if (res.data.industryTypes.length > 0) {
            this.industryTypesData = [{ code: 'all', imgSrc: require('../../assets/images/btn.gif'), name: this.$t('whole') }, ...res.data.industryTypes.map(item => ({ code: item.code, imgSrc: require('../../assets/images/code-single.png'), name: item.name }))]
          }
        })
      },
      getSelectProject() {
        this.selectProjects = this.$store.state.allProjects.data
        if (!this.selectProjects.length) {
          this.selectProjects = this.parentProjectList
        }
      },
      getAllProject() {
        this.getSelectProject()
        if (this.isShowMap === 'online') {
          this.projectsOption = this.handleProjectData(this.selectProjects)
        } else if (this.isShowMap === 'offline') {
          this.projectsOption = this.selectProjects.map(v => ({
            ...v,
            isProject: true,
            projectStatus: this.checkProjectStatus(v),
            degree: [clampLng(v.longitude), clampLat(v.latitude)],
            noProcessAlarm: v.totalAlarmNoProcessThisMonth,
          }))
        } else if (this.isShowMap === 'google') {
          this.projectsOption = this.handleProjectGoogleData(this.selectProjects)
        }
      },
      checkProjectStatus(data) {
        if (data.totalAlarmNoProcessToday > 0) {
          return 'alarm'
        } else if (data.totalWarnToday > 0) {
          return 'warn'
        } else {
          return 'normal'
        }
      },
      handleProjectData(arr = []) {
        if (!arr.length) return
        // const statusList = ['normal', 'alarm', 'warn'] 后面所需状态字段,目前都是项目都是正常状态
        const newArr =
          arr
            .map(v => ({
              ...v,
              isProject: true,
              projectStatus: this.checkProjectStatus(v),
              degree: [clampLng(v.longitude), clampLat(v.latitude)],
              noProcessAlarm: v.number,
            }))
            .map(item => {
              return {
                geometry: {
                  type: 'Point',
                  coordinates: [clampLng(item.longitude), clampLat(item.latitude)],
                },
                properties: factoryData(item),
              }
            }) || []
        return newArr
      },
      handleProjectGoogleData(arr = []) {
        if (!arr.length) return
        const newArr =
          arr
            .map(v => ({ ...v, isProject: true, projectStatus: this.checkProjectStatus(v), degree: [clampLng(v.longitude), clampLat(v.latitude)], noProcessAlarm: v.number }))
            .map(item => {
              return {
                position: { lat: clampLat(item.latitude), lng: clampLng(item.longitude) },
                properties: factoryGoogleData(item),
              }
            }) || []
        return newArr
      },
      changeProjectShow(val) {
        this.getSelectProject()
        if (val === 'all') {
          this.projectsOption = this.isShowMap === 'google' ? this.handleProjectGoogleData(this.selectProjects) : this.handleProjectData(this.selectProjects)
          return
        }
        const filterList = this.selectProjects.filter(v => v.industryCode === val)
        this.projectsOption = this.isShowMap === 'google' ? this.handleProjectGoogleData(filterList) : this.handleProjectData(filterList)
      },
    },
    watch: {
      '$store.state.allProjects': {
        handler(newVal, oldVal) {
          if (newVal.data.length) {
            this.getAllProject()
            this.loadKey = Math.random()
          }
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .disable-Style {
    filter: grayscale(1);
    cursor: not-allowed;
  }
  .init-Map-zoom {
    position: absolute;
    right: 40px;
    top: 40px;
    z-index: 20;
    .map-icon-init {
      width: 58px;
      height: 58px;
    }
  }
  .right-mapType {
    position: absolute;
    right: 40px;
    bottom: 120px;
    z-index: 20;
    .right-btnType {
      width: 60px;
      height: 60px;
      .active-Type-img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .left-close-open {
    position: absolute;
    bottom: 100px;
    left: 40px;
    z-index: 20;
  }
  .left-btn {
    width: 40px;
    height: 40px;
    margin-top: 15px;
    .active-img {
      width: 100%;
      height: 100%;
    }
  }
  #contain {
    width: 100%;
    height: 100%;
    // border: none;
    // overflow: hidden;
  }
  .content_middle {
    width: 100%;
    height: 100%;
    box-shadow: inset 0px 0px 16px 0px #1c5894;
    overflow: hidden;
  }
  .map-box-content {
    width: 100%;
    height: 100%;
    // border: 4px solid #1c58945b;
    box-shadow: inset 0px 0px 4px 0px #1c5894;
    padding: 4px;
  }
  .industryType-bottom {
    position: absolute;
    bottom: 30px;
    right: 0;
    left: 0;
    padding: 0 20px;
    z-index: 20;
  }
</style>
