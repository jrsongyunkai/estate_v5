<template>
  <div class="visualScreen" v-resize="getMainTitleStyle">
    <div style="display: flex; justify-content: space-between" class="header tc">
      <div class="df left-content">
        <PickProject :defaultCheckedKeys="checkedKeys" @pickProject="pickProject" @clickSingle="clickSingle" :className="'VisualTooltipStyle'"></PickProject>
        <div class="layout_header_time_art ml-10">{{ leftTime }}</div>
        <img v-if="!!weatherImg" :src="weatherImg" alt="" class="weather-Img" />
        <div style="white-space: nowrap">{{ weatherTip }}</div>
      </div>
      <div class="center-title">
        <i class="layout_header_font_art" v-if="individual.mainPageLogo">
          <img :src="individual.mainPageLogo.imageUrl" v-if="individual.mainPageLogo.imageUrl" :style="`height:${individual.mainPageLogo.height || '64px'};width:${individual.mainPageLogo.width || '220px'};margin-right:5px`" alt="" />
          <span class="gradient-text" :style="mainTitleStyle">{{ individual.mainPageTitle.text }}</span>
        </i>
      </div>
      <div class="right-content" style="display: flex; justify-content: space-between">
        <div style="padding: 15px 0; margin-right: 10px">
          <el-dropdown trigger="click" @command="handleSelect">
            <Input prefix="ios-search" autocomplete="off" type="text" name="search" v-model="message" class="search-Input" :placeholder="$t('selectProject')" />
            <el-dropdown-menu slot="dropdown" class="dropMenu">
              <el-dropdown-item :title="item.projectName" v-for="(item, index) in matchedOptions" :key="index" :command="item">
                {{ item.projectName }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="right-content-ul" style="display: flex">
          <div style="min-width: 25px" class="mar-l5">
            <img :src="soundUrl" alt="" @click="switchSound" class="pointer" />
          </div>
          <div style="min-width: 25px">
            <i-header-notice v-if="showNotice" />
          </div>
          <div>
            <i-header-fullscreen v-if="isDesktop && showFullscreen" />
          </div>
          <div>
            <i-header-i18n />
          </div>
          <div style="min-width: 125px; max-width: 220px">
            <i-header-user @feedback="feedback" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import iHeaderI18n from '../visualScreen/headerNav/header-i18n/index.vue'
  import store from '../../store/index'
  import iHeaderNotice from '../visualScreen/headerNav/header-notice/index.vue'
  import iHeaderUser from '../visualScreen/headerNav/header-user/index.vue'
  import { mapState } from 'vuex'
  import { selectProjectTree, getCityWeather } from '@/api/visualScreen/index'
  import iHeaderFullscreen from '../visualScreen/headerNav/header-fullscreen/index.vue'
  import PickProject from '@/globalComponents/PickProject.vue'
  import { projectIndexDB } from '@/plugins/indexDB/index'
  import { weatherConfig } from './visualScreenFunc'
  import { get } from 'lodash'
  import dayjs from 'dayjs'
  export default {
    components: { iHeaderNotice, iHeaderUser, iHeaderI18n, iHeaderFullscreen, PickProject },
    data() {
      return {
        soundUrl: require('../../assets/images/icon_nav_visSound.png'),
        leftTime: '',
        interval: null,
        message: '',
        checkedProjectStr: [],
        lastIp: '',
        individual: this.$store.state.individual,
        selectedOptions: [],
        weatherType: '',
        provinceId: '',
        cityId: '',
        countyId: '',
        groupModels: [],
        model: 0,
        localOptions: [],
        treeData: [],
        checkedKeys: [],
        weatherImg: null,
        weatherTip: null,
        mainTitleStyle: {},
      }
    },
    computed: {
      ...mapState('admin/layout', ['showNotice', 'showSearch', 'showBreadcrumb', 'isDesktop', 'showFullscreen']),
      matchedOptions() {
        return this.message !== '' ? this.checkedProjectStr.filter(item => item.projectName.indexOf(this.message) > -1) : this.checkedProjectStr
      },
    },
    mounted() {
      this.init()
      this.leftTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.leftTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
      this.getWeatherType()
      this.getWeather()
      this.soundUrl = !this.$store.state.muted ? require('../../assets/images/icon_nav_visSound.png') : require('../../assets/images/icon_nav_visCancelSound.png')
    },
    methods: {
      // 处理大屏标题样式配置逻辑
      getMainTitleStyle() {
        const min = 12
        const max = 50
        let loginWidth = this.individual.mainPageLogo.imageUrl ? (this.individual.mainPageLogo.width === '' ? 225 : parseFloat(this.individual.mainPageLogo.width || 0) + 5) : 0
        const fontSize = (window.innerWidth * 0.26 - loginWidth) / this.individual.mainPageTitle.text.length
        this.mainTitleStyle = {
          fontSize: `${Math.min(Math.max(fontSize, min), max)}px`,
        }
        if (this.$store.state.extend === 'special') {
          this.mainTitleStyle = {
            fontSize: this.individual.mainPageTitle.size || `${Math.min(Math.max(fontSize, min), max)}px`,
            '-webkit-text-fill-color': this.individual.mainPageTitle.color || 'transparent',
            color: this.individual.mainPageTitle.color,
          }
        }
      },
      getWeatherType() {
        const currentHour = new Date().getHours()
        if (currentHour >= 6 && currentHour < 18) {
          this.weatherType = 'day'
        } else {
          this.weatherType = 'night'
        }
      },
      async getWeather() {
        const res = await getCityWeather()
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        const text = get(res, 'data.now.text', '')
        const filterText = text && weatherConfig.filter(v => v.key === text)
        this.weatherTip = filterText[0] ? filterText[0].text : ''
        if (filterText.length === 2) {
          const newFilter = filterText.find(v => v.type === this.weatherType)
          this.weatherImg = newFilter && newFilter.imgUrl
          return
        }
        this.weatherImg = (text && filterText[0].imgUrl) || ''
      },
      feedback(val) {
        this.$emit('feedbackV', val)
      },
      async init() {
        this.checkedProjectStr = JSON.parse(await projectIndexDB.getItem('checkedProjectStr'))
        this.individual = this.$store.state.individual
        let viewProjects = JSON.parse(await projectIndexDB.getItem('view-project-code-list'))
        if (viewProjects && viewProjects.length > 0) {
          this.checkedKeys = viewProjects
        } else {
          this.checkedKeys = this.checkedProjectStr.map(it => it.projectCode)
        }
      },
      returnModel(value) {
        window.sessionStorage.setItem('view-project-source-type', value)
      },
      switchSound() {
        store.commit('muted', !this.$store.state.muted)
        this.soundUrl = !this.$store.state.muted ? require('../../assets/images/icon_nav_visSound.png') : require('../../assets/images/icon_nav_visCancelSound.png')
      },
      handleSelect(item) {
        this.$func.switchToProject(item, '/console/project')
      },
      pickProject(selectProjectTreeData, cb) {
        this.checkedKeys = selectProjectTreeData.filter(it => it.projectCode).map(it => it.projectCode)
        cb()
      },
      clickSingle(codes, cb) {
        let projectCodeList = [...codes]
        let projectList = this.checkedProjectStr.filter(it => codes.includes(it.projectCode))
        store.commit('allProjects', { data: projectList })
        selectProjectTree({ projectCodeList }).then(res => {
          if (res.success) {
            cb()
            this.checkedKeys = [...codes]
          }
        })
      },
    },
    watch: {
      checkedKeys: {
        handler(value) {
          const projectList = this.checkedProjectStr.filter(it => value.includes(it.projectCode))
          store.commit('allProjects', { data: projectList })
          selectProjectTree({ projectCodeList: value }).then(res => {
            if (res.success) {
              projectIndexDB.setItem('view-project-code-list', JSON.stringify(value))
            }
          })
        },
        deep: true,
        immediate: true,
      },
      leftTime: {
        handler(newValue) {
          if (newValue.includes('06:00')) {
            this.weatherType = 'day'
            this.getWeather()
          } else if (newValue.includes('18:00')) {
            this.weatherType = 'night'
            this.getWeather()
          }
        },
      },
    },
    beforeDestroy() {
      clearInterval(this.interval)
    },
  }
</script>

<style lang="less" scoped>
  .dropMenu {
    max-height: 300px;
    overflow-y: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .weather-Img {
    width: 35px;
    height: 35px;
    margin-left: 10px;
  }
  .mar-l5 {
    margin-right: 5px;
    padding-top: 18px;
  }
  .el-dropdown-menu {
    background-color: #071223 !important;
    border: none;
    color: #fff;
    width: 200px;
    position: absolute;
    top: 48px !important;
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background: #2c2c2e;
  }
  .el-dropdown-menu__item {
    color: #fff;
  }
  .search-Input {
    /deep/ input {
      background-color: transparent !important;
    }
  }
  .gradient-text {
    font-size: 26px;
    font-weight: 300;
    font-family: pangmenzhengdao;
    white-space: nowrap;
    letter-spacing: 4px;
    background: linear-gradient(180deg, #ffffff 0%, #1a93ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }
  .v-head {
    display: flex;
  }
  .v-flex-head1 {
    flex: 1;
  }
  .df {
    display: flex;
    align-items: center;
  }
  .middle {
    display: flex;
    justify-content: center;
    font-size: 26px;
    font-weight: 700;
    color: white;
  }
  .layout_header_font_art {
    display: flex;
    align-items: center;
    /deep/.ivu-icon {
      font-size: 70px;
    }
  }
  /deep/.ivu-input {
    border-radius: 15px;
    border: 1px solid rgba(208, 241, 247, 0.2);
    &::placeholder {
      color: #fff;
    }
  }
  /deep/.ivu-icon {
    color: #fff;
  }
  .uers {
    display: flex;
    align-items: center;
  }
  /deep/.ivu-dropdown-rel {
    width: 100%;
  }
  .i-layout-header-trigger:hover {
    background: none;
  }
  .i-layout-header-trigger {
    display: flex;
    align-items: center;
  }
  .prject {
    ul {
      list-style: none;
      height: 280px;
      width: 252px;
      overflow-y: scroll;
      position: relative;
      border-radius: 10px;
      padding-left: 20px;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .ivu-dropdown-item {
        height: 34px;
        line-height: 34px;
        padding: 0;
      }
    }
  }

  .header {
    background: url('../../assets/images/head.png');
    width: 100%;
    background-size: 100% 100%;
    height: 100px;
    display: flex;
    align-items: center;
    position: relative;
    .left-content {
      padding-left: 60px;
    }
    .right-content {
      .right-content-ul {
        padding-right: 55px;
      }
    }
    .center-title {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .icon-v5 {
      font-size: 20px;
    }
    .layout_header_img {
      width: 100%;
      height: 68px;
    }
    .layout_header_time_art {
      img {
        width: 12px;
      }
      font-weight: 400;
      color: white;
    }
    .select-mode {
      width: 100px;
      /deep/.ivu-select-visible .ivu-select-selection {
        box-shadow: none;
      }
      /deep/.ivu-select-selection {
        border: none;
        background: none;
        box-shadow: none;
      }
    }
  }
  /deep/.casecader {
    text-align: left;
    input {
      background-color: transparent;
      border-color: transparent;
    }
    .ivu-input:focus {
      box-shadow: 0 0 0 0;
    }
    .ivu-icon-ios-arrow-down:before {
      content: '';
    }
  }
  .input {
    position: relative;
    width: 100%;
    background: rgba(208, 241, 247, 0.2);
    opacity: 0.5;
    input {
      background: none;
      border: none;
      position: absolute;
    }
  }
  .menu {
    width: 200px;
    height: 250px;
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .Menulist {
    margin: 0;
    line-height: normal;
    padding: 10px 20px 10px 20px;
    clear: both;
    color: #fff;
    font-size: 14px !important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background 0.2s ease-in-out;
    &:hover {
      background: #2c2c2e;
    }
  }
  @media only screen and (min-width: 1024px) {
    .layout_header_time_art {
      font-size: 16px;
    }
    .layout_header_font_art {
      font-size: 18px;
    }
  }
  @media only screen and (min-width: 1366px) {
    .layout_header_time_art {
      font-size: 18px;
    }
    .layout_header_font_art {
      font-size: 20px;
    }
  }
  @media only screen and (min-width: 1920px) {
    .layout_header_time_art {
      font-size: 20px;
    }
    .layout_header_font_art {
      font-size: 24px;
    }
    .header {
      .left-content {
        padding-left: 80px;
      }
      .right-content {
        .right-content-ul {
          padding-right: 70px;
        }
      }
    }
  }
  @media only screen and (max-width: 1700px) {
    .visualScreen {
      .header {
        .left-content {
          transform: scale(0.9);
          transform-origin: left center;
        }
        .right-content {
          transform: scale(0.9);
          transform-origin: right center;
        }
      }
    }
  }
  @media only screen and (max-width: 1550px) {
    .visualScreen {
      .header {
        .left-content {
          transform: scale(0.8);
          transform-origin: left center;
        }
        .right-content {
          transform: scale(0.8);
          transform-origin: right center;
        }
      }
    }
  }
</style>
