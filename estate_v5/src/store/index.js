import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import admin from './modules/admin'
import pageAuth from './modules/pageAuth'
import linkage from './modules/linkage'
import diagram from './modules/diagram'
import device from './modules/device'
import alarmSound from './modules/alarmSound'
import OverFlowTips from './modules/OverFlowTips'
import loginInfo from './modules/loginInfo'
import { omit } from 'lodash'

Vue.use(Vuex)

const state = {
  linkageMode: '',
  staffName: '',
  firstActivationStatus: false,
  packetList: [],
  configPriceStatus: false,
  billCycle: '',
  charginTimer: [],
  charginMacList: [],
  billingTarget: null,
  mobile: '',
  priceTimeValue: {},
  configPowerCycle: {},
  parameterMac: '',
  simObj: {},
  firstAddr: '',
  lacation: '',
  extend: '',
  BindStatus: '',
  showAir: '',
  airAddr: '',
  airMac: '',
  airmode: 1,
  localeSwitch: false,
  baiduKey: '',
  baiduStyleId: '',
  personalBaiduOfflineMapLevel: 10,
  googleKey: '',
  provinceId: '',
  cityId: '',
  countyId: '',
  equipmentFlag: '',
  detailsFlag: '',
  detailsFlagMore: '',
  equipmentParam: {},
  locale: 'zh-CN',
  mondaySelect: '',
  maintenanceObj: [],
  classify: '',
  alarmId: '',
  mac: '',
  equipmentType: '',
  overview: { equipmentType: 1, mac: '' },
  versionStatus: false,
  versionNum: '',
  prjName: '',
  prjTitle: '',
  localdeplyoy: '',
  nodeId: '',
  threShow: '',
  threShowKeepAlin: false,
  nodeNo: '',
  projects: '',
  screenBarHeight: null,
  smokeAlarmObj: '',
  flammableGasObj: '',
  smokeObj: '',
  pressureObj: '',
  levelObj: '',
  alarmForConfig: '',
  alarmlistsCustom: '',
  modulus: null,
  exponent: null,
  individual: '',
  historyDate: '',
  detailsAddr: '',
  switchType: '',
  lineType: '',
  dateFlag: false,
  aliasName: '',
  customAlarm: '',
  classifyLabel: '',
  realName: null,
  isOpenPrjGrpHourPowerStat: false, // 是否开启项目、分组小时电量统计
  totalStatus: false,
  sortBUR: {},
  adressLight: '',
  projectCode: '',
  distribution: { projectCode: '', dateType: '', date: '' },
  switchData: null,
  devHis: null,
  distributionDateType: '',
  innerMessage: false,
  fullName: '',
  stralsundObj: [],
  systemFlag: 'home',
  loadMeta: 'all',
  password: '',
  heightOne: '',
  heightTwo: '',
  heightThird: '',
  heighttimg: '',
  mapHeight: '',
  overTowHeight: '',
  consumHeight: '',
  manageTowHeight: '',
  innerComponentHeight: '',
  powerTableHeight: '',
  channelsTableHeight: '',
  BuiltInTimingHeight: '',
  batchHeight: '',
  ruleId: '',
  projectName: '',
  allProjects: {},
  alarmRouter: '',
  deviceListRouter: '',
  totalAlarm: '',
  totalMac: '',
  totalOnline: '',
  statisticsFlag: false,
  setSecondPwds: false,
  allTotalAlarm: '',
  totalProject: '',
  totalWarn: '',
  totalAddr: '',
  location: {},
  overviewMac: '',
  quantityPage: [],
  quantityPageSize: 20,
  showMenus: '',
  muted: false,
  closeTable: true, // 是否组件缓存keepalive
  AddEditData: [
    {
      title: window.$t('projectHomepage'),
      checked: true,
      children: [
        { title: window.$t('deviceOverview'), checked: true, value: '/console/device', icon: 'icon-v5-shebeigaikuang1', nodeKey: 1, findIndexs: [0, 0] },
        { title: window.$t('topology'), value: '/console/topology', checked: true, icon: 'icon-v5-tuoputu1', nodeKey: 2, findIndexs: [0, 1] },
      ],
      nodeKey: 0,
    },
    {
      title: window.$t('safetyMonitor'),
      checked: false,
      children: [
        { title: window.$t('monitoringReport'), checked: false, value: '/safetyMonitor/monitoringReport', icon: 'icon-v5-menu_lrtx', nodeKey: 34, indeterminate: false },
        { title: window.$t('allAlarm'), checked: false, value: '/safetyMonitor/allWarn', icon: 'icon-v5-quanbubaojing1', nodeKey: 4, indeterminate: false, findIndexs: [1, 0] },
        { title: window.$t('leakage'), checked: false, value: '/safetyMonitor/leakage', icon: 'icon-v5-loudianliu1', nodeKey: 5, indeterminate: false },
        { title: window.$t('temperature'), checked: false, value: '/safetyMonitor/temperature', icon: 'icon-v5-wendu2', nodeKey: 6, indeterminate: false },
        { title: window.$t('leakageAlarm'), checked: false, value: '/safetyMonitor/leakageWarm', icon: 'icon-v5-loudianbaojing1', nodeKey: 7, indeterminate: false },
        { title: window.$t('temperatureAlarm'), checked: false, value: '/safetyMonitor/temperatureWarn', icon: 'icon-v5-wendubaojing1', nodeKey: 8, indeterminate: false },
        { title: window.$t('electricityTheftAlarm'), checked: false, value: '/safetyMonitor/stealingElectricity', icon: 'icon-v5-qiedian', nodeKey: 35, indeterminate: false },
        { title: window.$t('leakageSelfCheck'), checked: false, value: '/safetyMonitor/leakageSelfChecking', icon: 'icon-v5-loubaozijian1', nodeKey: 9, indeterminate: false },
        { title: window.$t('shortCircuitAlarm'), checked: false, value: '/safetyMonitor/shortCircuitWarn', icon: 'icon-v5-duanlubaojing1', nodeKey: 10, indeterminate: false },
        { title: window.$t('overUnderVoltage'), checked: false, value: '/safetyMonitor/abnormalVoltage', icon: 'icon-v5-guoqianya1', nodeKey: 11, indeterminate: false },
        { title: window.$t('overCurrentOverload'), checked: false, value: '/safetyMonitor/abnormalCurrent', icon: 'icon-v5-guoliuguozai1', nodeKey: 12, indeterminate: false },
        { title: window.$t('arcAlarm'), checked: false, value: '/safetyMonitor/SparkWarn', icon: 'icon-v5-dianhubaojing1', nodeKey: 13, indeterminate: false },
        { title: window.$t('threePhaseAlarm'), checked: false, value: '/safetyMonitor/phaseWarn', icon: 'icon-v5-sanxiangbaojing1', nodeKey: 14, indeterminate: false },
        { title: window.$t('abnormalState'), checked: false, value: '/safetyMonitor/abnormalState', icon: 'icon-v5-yichangzhuangtai1', nodeKey: 15, indeterminate: false },
        { title: window.$t('ocWarn'), checked: false, value: '/safetyMonitor/ocWarn', icon: 'icon-v5-fenhezhajingshi1', nodeKey: 16, indeterminate: false },
      ],
      nodeKey: 3,
      selected: true,
      expand: false,
      indeterminate: false,
    },
    {
      title: window.$t('energyMonitor'),
      checked: true,
      children: [
        { checked: true, title: window.$t('electricQuantity'), value: '/energyMonitor/power', icon: 'icon-v5-dianliang1', nodeKey: 18, indeterminate: false, findIndexs: [2, 0] },
        { checked: true, title: window.$t('load'), value: '/energyMonitor/load', icon: 'icon-v5-fuzai1', nodeKey: 19, indeterminate: false, findIndexs: [2, 1] },
      ],
      nodeKey: 17,
      expand: true,
      indeterminate: false,
    },
    {
      title: window.$t('multiManage'),
      checked: false,
      children: [
        { title: window.$t('sceneControl'), checked: true, value: '/multiManage/sceneControl', icon: 'icon-v5-changjingkongzhi', nodeKey: 21, findIndexs: [3, 0] },
        { title: window.$t('builtInTimerConfig'), checked: false, value: '/multiManage/builtInTimer', icon: 'icon-v5-jingweidingshi1', nodeKey: 22 },
        { title: window.$t('lnglatTimerConfig'), checked: false, value: '/multiManage/latlongTimer', icon: 'icon-v5-jingweidingshi1', nodeKey: 23 },
        { title: window.$t('batchConfig'), checked: false, value: '/multiManage/batchConfig', icon: 'icon-v5-piliangpeizhi1', nodeKey: 24 },
        { title: window.$t('contrlTaskList'), checked: false, value: '/multiManage/contrlTasks', icon: 'icon-v5-kongzhirenwuqingdan1', nodeKey: 25 },
        { title: window.$t('groupManage'), checked: false, value: '/multiManage/groupConfig', icon: 'icon-v5-fenzuguanli1', nodeKey: 26 },
        { title: window.$t('deviceListControl'), checked: false, value: '/multiManage/deviceListControl', icon: 'icon-v5-shebeiliebiaoyukongzhi1', nodeKey: 27 },
        { title: window.$t('abnormalStateConfig'), checked: false, value: '/multiManage/abnormalStateConfig', icon: 'icon-v5-yichangzhuangtaijiancepeizhi1', nodeKey: 28 },
        { title: window.$t('linkageConfig'), checked: false, value: '/multiManage/linkageScene', icon: 'icon-v5-liandongpeizhi1', nodeKey: 29 },
        { title: window.$t('workOrderManagement'), checked: false, value: '/multiManage/workOrder', icon: 'icon-v5-gongdanguanli1', nodeKey: 30 },
        { title: window.$t('neverRemindAgainTip'), checked: false, value: '/multiManage/trafficRenewal', icon: 'icon-v5-ziyuanguanli-simkaguanli', nodeKey: 32 },
        { title: window.$t('monitoringReport'), checked: false, value: '/multiManage/nuresList', icon: 'icon-v5-ziyuanguanli-simkaguanli', nodeKey: 33 },
        { title: window.$t('statisticalReport'), checked: true, value: '/multiManage/report', icon: 'icon-v5-tongji1', nodeKey: 31, indeterminate: false, findIndexs: [3, 10] },
      ],
      nodeKey: 20,
      indeterminate: true,
      expand: true,
    },
  ],
  dataArr: [
    { title: window.$t('deviceOverview'), checked: true, value: '/console/device', icon: 'icon-v5-shebeigaikuang1', nodeKey: 1, findIndexs: [0, 0], indeterminate: false },
    { title: window.$t('topology'), value: '/console/topology', checked: true, icon: 'icon-v5-tuoputu1', nodeKey: 2, findIndexs: [0, 1], indeterminate: false },
    { checked: true, title: window.$t('electricQuantity'), value: '/energyMonitor/power', icon: 'icon-v5-dianliang1', nodeKey: 18, indeterminate: false, findIndexs: [2, 0] },
  ],
  allProjectsList: [],
  billingCycleName: null,
}
const blacklistPaths = ['admin.menu.sider']

export default new Vuex.Store({
  state,
  plugins: [
    createPersistedState({
      paths: [...Object.keys(state), 'admin', 'pageAuth', 'linkage', 'diagram', 'OverFlowTips', 'loginInfo'],
      storage: {
        setItem(k, v) {
          if (k === '@@') {
            return localStorage.setItem(k, v)
          }
          let data = JSON.parse(v)
          data = omit(data, blacklistPaths)
          localStorage.setItem(k, JSON.stringify(data))
        },
        getItem(k) {
          return localStorage.getItem(k)
        },
        removeItem(k) {
          return localStorage.removeItem(k)
        },
      },
    }),
  ],
  modules: {
    admin,
    pageAuth,
    linkage,
    diagram,
    device,
    alarmSound, // 不用持久化处理
    OverFlowTips,
    loginInfo,
  },
  mutations: {
    billCycle: (state, v) => {
      state.billCycle = v
    },
    charginTimer: (state, v) => {
      state.charginTimer = v
    },
    charginMacList: (state, v) => {
      state.charginMacList = v
    },
    billingTarget: (state, v) => {
      state.billingTarget = v
    },
    billingCycleName: (state, v) => {
      state.billingCycleName = v
    },
    mobile: (state, v) => {
      state.mobile = v
    },
    priceTimeValue: (state, v) => {
      state.priceTimeValue = v
    },
    staffName: (state, v) => {
      state.staffName = v
    },
    linkageMode: (state, v) => {
      state.linkageMode = v
    },
    firstActivationStatus: (state, v) => {
      state.firstActivationStatus = v
    },
    packetList: (state, v) => {
      state.packetList = v
    },
    configPriceStatus: (state, v) => {
      state.configPriceStatus = v
    },
    configPowerCycle: (state, v) => {
      state.configPowerCycle = v
    },
    parameterMac: (state, v) => {
      state.parameterMac = v
    },
    simObj: (state, v) => {
      state.simObj = v
    },
    firstAddr: (state, v) => {
      state.firstAddr = v
    },
    extend: (state, v) => {
      state.extend = v
    },
    lacation: (state, v) => {
      state.lacation = v
    },
    BindStatus: (state, v) => {
      state.BindStatus = v
    },
    showAir: (state, v) => {
      state.showAir = v
    },
    airAddr: (state, v) => {
      state.airAddr = v
    },
    airMac: (state, v) => {
      state.airMac = v
    },
    airmode: (state, v) => {
      state.airmode = v
    },
    baiduKey: (state, v) => {
      state.baiduKey = v
    },
    googleKey: (state, v) => {
      state.googleKey = v
    },
    localeSwitch: (state, v) => {
      state.localeSwitch = v
    },
    baiduStyleId: (state, v) => {
      state.baiduStyleId = v
    },
    personalBaiduOfflineMapLevel: (state, v) => {
      state.personalBaiduOfflineMapLevel = v
    },
    alarmRouter: (state, v) => {
      state.alarmRouter = v
    },
    deviceListRouter: (state, v) => {
      state.deviceListRouter = v
    },
    quantityPageSize: (state, v) => {
      state.quantityPageSize = v
    },
    quantityPage: (state, v) => {
      state.quantityPage = v
    },
    provinceId: (state, v) => {
      state.provinceId = v
    },
    cityId: (state, v) => {
      state.cityId = v
    },
    countyId: (state, v) => {
      state.countyId = v
    },
    localdeplyoy: (state, v) => {
      state.localdeplyoy = v
    },
    individual: (state, v) => {
      state.individual = v
    },
    modulus: (state, v) => {
      state.modulus = v
    },
    exponent: (state, v) => {
      state.exponent = v
    },
    projects: (state, v) => {
      state.projects = v
    },
    showMenus: (state, v) => {
      state.showMenus = v
    },
    levelObj: (state, v) => {
      state.levelObj = v
    },
    location: (state, v) => {
      state.location = v
    },
    switchData: (state, v) => {
      state.switchData = v
    },
    devHis: (state, v) => {
      state.devHis = v
    },
    totalProject: (state, v) => {
      state.totalProject = v
    },
    realName: (state, v) => {
      state.realName = v
    },
    isOpenPrjGrpHourPowerStat: (state, v) => {
      state.isOpenPrjGrpHourPowerStat = v
    },
    smokeAlarmObj: (state, v) => {
      state.smokeAlarmObj = v
    },
    screenBarHeight: (state, v) => {
      state.screenBarHeight = v
    },
    smokeObj: (state, v) => {
      state.smokeObj = v
    },
    prjName: (state, v) => {
      state.prjName = v
    },
    versionStatus: (state, v) => {
      state.versionStatus = v
    },
    versionNum: (state, v) => {
      state.versionNum = v
    },
    prjTitle: (state, v) => {
      state.prjTitle = v
    },
    nodeId: (state, v) => {
      state.nodeId = v
    },
    threShow: (state, v) => {
      state.threShow = v
    },
    threShowKeepAlin: (state, v) => {
      state.threShowKeepAlin = v
    },
    nodeNo: (state, v) => {
      state.nodeNo = v
    },
    flammableGasObj: (state, v) => {
      state.flammableGasObj = v
    },
    totalWarn: (state, v) => {
      state.totalWarn = v
    },
    pressureObj: (state, v) => {
      state.pressureObj = v
    },
    totalAddr: (state, v) => {
      state.totalAddr = v
    },
    totalOnlineAddr: (state, v) => {
      state.totalOnlineAddr = v
    },
    allTotalAlarm: (state, v) => {
      state.allTotalAlarm = v
    },
    setSecondPwds: (state, v) => {
      state.setSecondPwds = v
    },
    statisticsFlag: (state, v) => {
      state.statisticsFlag = v
    },
    closeTable: (state, v) => {
      state.closeTable = v
    },
    totalStatus: (state, v) => {
      state.totalStatus = v
    },
    alarmForConfig: (state, v) => {
      state.alarmForConfig = v
    },
    alarmlistsCustom: (state, v) => {
      state.alarmlistsCustom = v
    },
    password: (state, v) => {
      state.password = v
    },
    mondaySelect: (state, v) => {
      state.mondaySelect = v
    },
    equipmentFlag: (state, v) => {
      state.equipmentFlag = v
    },
    detailsFlagMore: (state, v) => {
      state.detailsFlagMore = v
    },
    detailsFlag: (state, v) => {
      state.detailsFlag = v
    },
    equipmentParam: (state, v) => {
      state.equipmentParam = v
    },
    locale: (state, v) => {
      state.locale = v
    },
    maintenanceObj: (state, v) => {
      state.maintenanceObj = v
    },
    classify: (state, v) => {
      state.classify = v
    },
    alarmId: (state, v) => {
      state.alarmId = v
    },
    allProjects: (state, v) => {
      state.allProjects = v
    },
    allProjectsList: (state, v) => {
      state.allProjectsList = v
    },
    mac: (state, v) => {
      state.mac = v
    },
    innerMessage: (state, v) => {
      state.innerMessage = v
    },
    equipmentType: (state, v) => {
      state.overview.equipmentType = v
    },
    overviewMac: (state, v) => {
      state.overview.mac = v
    },
    historyDate: (state, v) => {
      state.historyDate = v
    },
    detailsAddr: (state, v) => {
      state.detailsAddr = v
    },
    switchType: (state, v) => {
      state.switchType = v
    },
    lineType: (state, v) => {
      state.lineType = v
    },
    dateFlag: (state, v) => {
      state.dateFlag = v
    },
    aliasName: (state, v) => {
      state.aliasName = v
    },
    customAlarm: (state, v) => {
      state.customAlarm = v
    },
    classifyLabel: (state, v) => {
      state.classifyLabel = v
    },
    sortBUR: (state, v) => {
      state.sortBUR = v
    },
    adressLight: (state, v) => {
      state.adressLight = v
    },
    projectCode: (state, v) => {
      state.projectCode = v
    },
    projectName: (state, v) => {
      state.projectName = v
    },
    distributionProjectCode: (state, v) => {
      state.distribution.projectCode = v
    },
    fullName: (state, v) => {
      state.fullName = v
    },
    distributionDateType: (state, v) => {
      state.distribution.dateType = v
    },
    stralsundObj: (state, v) => {
      state.stralsundObj = v
    },
    systemFlag: (state, v) => {
      state.systemFlag = v
    },
    loadMeta: (state, v) => {
      state.loadMeta = v
    },
    mapHeight: (state, v) => {
      state.mapHeight = v
    },
    innerComponentHeight: (state, v) => {
      state.innerComponentHeight = v
    },
    ruleId: (state, v) => {
      state.ruleId = v
    },
    totalAlarm: (state, v) => {
      state.totalAlarm = v
    },
    totalMac: (state, v) => {
      state.totalMac = v
    },
    totalOnline: (state, v) => {
      state.totalOnline = v
    },
    muted: (state, v) => {
      state.muted = v
    },
    AddEditData: (state, v) => {
      state.AddEditData = v
    },
    dataArr: (state, v) => {
      state.dataArr = v
    },
    setHeight: (state, v) => {
      state.heightOne = (v - 309) / 3
      state.heightTwo = (v - 143) / 4
      state.heightThird = ((v - 309) / 3 - 28) / 2 + 'px'
      state.mapHeight = ((v - 309) / 3) * 2 - 78 + 'px'
      state.overTowHeight = (v - 143) * 0.4 + 'px'
      state.consumHeight = (v - 143) * 0.5 + 'px'
      state.manageTowHeight = (v - 143) * 0.35 + 'px'
      state.innerComponentHeight = (v - 293) / 3 + 'px'
      state.channelsTableHeight = v - 300 + 'px'
      state.BuiltInTimingHeight = v - 340 + 'px'
      state.batchHeight = v - 326 + 'px'
      state.heighttimg = ((v - 350) / 3 - 28) / 2 + 'px'
    },
  },
  actions: {
    reset({ commit }) {
      commit('alarmId', '')
      commit('allProjects', {})
      commit('allProjectsList', [])
      commit('totalStatus', false)
      commit('mac', '')
      commit('location', {})
      commit('historyDate', '')
      commit('detailsAddr', '')
      commit('switchType', '')
      commit('lineType', '')
      commit('provinceId', '')
      commit('cityId', '')
      commit('countyId', '')
      commit('dateFlag', false)
      commit('aliasName', '')
      commit('customAlarm', [])
      commit('classifyLabel', [])
      commit('projectCode', '')
      commit('fullName', '')
      commit('systemFlag', 'home')
      commit('loadMeta', 'all')
      commit('projectName', '')
      commit('ruleId', '')
      commit('innerMessage', false)
      commit('totalAlarm', '')
      commit('totalMac', '')
      commit('totalOnline', '')
      commit('statisticsFlag', false)
      commit('allTotalAlarm', '')
      commit('totalProject', '')
      commit('totalWarn', '')
      commit('totalAddr', '')
      commit('totalOnlineAddr', '')
    },
    resetMaintenanceObj({ commit }) {
      commit('maintenanceObj', [])
    },
    resetEquipmentType({ commit }) {
      commit('equipmentType', 1)
    },
    resetMac({ commit }) {
      commit('mac', '')
    },
    resetHistoryDate({ commit }) {
      commit('historyDate', '')
    },
  },
})
