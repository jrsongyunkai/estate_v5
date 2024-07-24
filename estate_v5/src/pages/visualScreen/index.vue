<template>
  <div id="visualScreen" style="min-width: 1024px; min-height: 1200px">
    <div class="mask mask-left"></div>
    <div class="mask mask-right"></div>
    <div class="layout_content_middle tc">
      <mNav :loadingStatus="loadingStatus" v-once :curProOrMacPoint="curProOrMacPoint" />
    </div>
    <hNav class="layout_header tc" v-once @feedbackV="feedbackV" />
    <div class="layout_content_left">
      <lNav :loadingStatus="loadingStatus" :key="loadKey" />
    </div>
    <div class="layout_content_right">
      <rNav :loadingStatus="loadingStatus" :key="loadKey" />
    </div>
    <div class="layout_content_bottom">
      <bNav :key="loadKey" />
    </div>
    <!-- 大屏告警弹窗 -->
    <Modal width="785px;" id="alarmSocket2" @on-cancel="handleAlarmClose" @on-visible-change="onAlarmModalVisibleChange" v-model="dialogAlarmVisible" class="d-alm-wrap global-alarm-modal" ref="alarmSocket">
      <div slot="header">&nbsp;</div>
      <div class="d-alm-content d-alm-content-show">
        <div class="d-alm-content" v-for="(item, index) in localData.filter(item => item.remindType !== 2)" :key="index">
          <div style="padding: 8px 3px; border-bottom: 1px solid #444549; margin-top: -5px">
            <div class="c-warning" style="margin-bottom: 5px">{{ item.name }}</div>
            <div style="padding-bottom: 5px">
              <span class="c-warning" v-if="item.conlictConfigName === undefined">
                {{ (item.build ? item.build + ',' + item.unit + ',' + item.room : $t('unknownLocation')) + ('(' + item.mac + ')') + item.node }}
                {{ item.typeNo === 2023 ? $t('methaneAlarmTip', { rate: item.valueDescribe.value }) : '' }}
                {{ item.valueDescribe.from === 'timeThreshold' ? item.valueDescribe.thresholdName : '' }}
                <template v-if="item.valueDescribe.threshold !== undefined">
                  {{ item.valueDescribe && item.valueDescribe.value ? '(' + (item.valueDescribe.isAlarmOrWarn ? $t('alarmValue') : $t('warningValue')) + '/' + $t('currentThreshold') + ':' + item.valueDescribe.value + '/' + item.valueDescribe.threshold + ')' : '' }}
                </template>
                <template v-else>
                  {{ item.valueDescribe && item.valueDescribe.value ? '(' + (item.valueDescribe.isAlarmOrWarn ? $t('alarmValue') : $t('warningValue')) + ':' + item.valueDescribe.value + ')' : '' }}
                </template>
                {{ item.valueDescribe.deviceType ? item.valueDescribe.deviceType + ' ' + item.valueDescribe.alarmType : '' }}
              </span>
              <span class="c-warning" v-else>
                {{ $t('thresholdValueTip', { ...item }) }}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between" v-if="item.conlictConfigName === undefined">
              <div>{{ '[' + item.datetime + ']' }}</div>
              <div>
                <div>
                  {{ item.status ? $t('happen') : $t('rescission') }}
                  <span class="c-danger jump pointer" @click="handleRoute(item.typeNo, item.classify, item)">
                    <span :title="item.info + (item.lastTypeNumber === 1015 ? '(' + item.valueDescribe.cAlmCtn + ')' : '')">
                      {{
                        (item.info + (item.lastTypeNumber === 1015 ? '(' + item.valueDescribe.cAlmCtn + ')' : '')).length > 20
                          ? (item.info + (item.lastTypeNumber === 1015 ? '(' + item.valueDescribe.cAlmCtn + ')' : '')).substr(0, 18) + '...'
                          : item.info + (item.lastTypeNumber === 1015 ? '(' + item.valueDescribe.cAlmCtn + ')' : '')
                      }}
                    </span>
                  </span>
                  <span class="contacts">
                    {{ '(' + '\xa0\xa0' + $t('contacts') + ':' + '' }}
                    <i v-if="item.linkman">{{ item.linkman }}</i>
                    <i v-if="item.linkman_tel">{{ item.linkman_tel }}</i>
                    <i v-if="item.linkman2">{{ item.linkman2 }}</i>
                    <i v-if="item.linkman_tel2">{{ item.linkman_tel2 }}</i>
                    {{ $t('contactNumber') + ':' + item.linkmanTel }}
                    {{ ')' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="thre">
              <span>
                {{ '[' + item.datetime + ']' }}
              </span>
              <span>
                {{ $t('happen') }}
                <span class="text">{{ $t('thresholdConflict') }}</span>
              </span>
            </div>
            <div class="gray-wordss" v-if="[66, 62].includes(item.typeNo)">
              {{ textType }}
            </div>
          </div>
        </div>
      </div>
      <div :class="$store.state.locale !== 'zh-CN' ? 'alarmBtnE' : 'alarmBtn'" @click="handleAlarmClose" />
      <div slot="footer"></div>
    </Modal>
    <Modal :title="$t('versionUpdateInfo')" v-model="NotifyVisible" :close-on-click-modal="false" width="1000px" top="20vh">
      <div class="notifyV" style="height: 500px">
        <Timeline>
          <TimelineItem :timestamp="versionHistory.current.deploy_time" placement="top">
            <Card>
              <h4 style="margin-top: 0px">{{ versionHistory.current.version_no }}</h4>
              <p v-for="(item, index) in versionHistory.current.content" :key="index">{{ item }}</p>
            </Card>
          </TimelineItem>
          <TimelineItem v-for="(hislistItem, hislistIndex) in versionHistory.hislist" :key="hislistIndex" :timestamp="hislistItem.deploy_time" placement="top">
            <Card>
              <h4 style="margin-top: 0px">{{ hislistItem.version_no }}</h4>
              <p v-for="(Item, Index) in hislistItem.content" :key="Index">{{ Item }}</p>
            </Card>
          </TimelineItem>
        </Timeline>
      </div>
    </Modal>
    <Modal :title="$t('selectProject')" v-model="projectFlag" transfer :mask="false" footer-hide width="280" class-name="vertical-center-modals">
      <div class="scrollls" style="overflow-y: auto; height: 150px">
        <input class="header-search-song" v-model="message" type="text" :placeholder="$t('searchProject')" />
        <div class="pointer" v-for="(item, index) in matchedOptions" :key="index" :name="item.projectCode" @click="handleTopath(item)">{{ item.projectName }}</div>
      </div>
    </Modal>
    <Modal v-model="toolTipFlag" :mask="false" v-if="simValueList.length > 0" class-name="vertical-center-tooltip" width="400" @on-visible-change="onCloses">
      <div slot="header">{{ $t('flowCardRenewal') }}</div>
      <div class="scrollls" style="overflow-y: auto; height: 125px">
        <div v-for="(item, index) in simValueList" :key="index" style="margin-top: 8px">
          <div style="display: flex" @click="handleTopath(item)">
            <span style="display: inline-block; width: 12px; height: 6px; background-color: #007eff; color: #007eff; border-radius: 50%; margin: 5px 10px 5px 4px"></span>
            <div>
              <span class="pointer" style="color: #007eff">
                {{ $t('projectDeviceTip', { projectName: item.projectName, deviceName: item.remindData.boxName || '', mac: item.remindData.mac || '' }) }}
              </span>
              <span>{{ item.remindData.content }}</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div style="display: flex; justify-content: space-between">
          <div>
            <Button @click="confirm">{{ $t('neverRemindAgain') }}</Button>
            <Button class="export" @click="boxValue = true">{{ $t('thisMonthNotRemind') }}</Button>
          </div>
          <Button type="primary" @click="projectFlag = true">{{ $t('view') }}</Button>
        </div>
      </div>
    </Modal>
    <PwdWeakToolModal ref="pwdWeakRef"></PwdWeakToolModal>
  </div>
</template>

<script>
  import iFeedback from '../../components/feedback'
  import store from '@/store/index'
  import _headerNav from './_headerNav.vue'
  import _contentNav from './_contentNav.vue'
  import _rightNav from './_rightNav.vue'
  import _bottomNav from './_bottomNav.vue'
  import _middleNav from './_middleNav.vue'
  import _middleSecNav from './_middleSecNav.vue'
  import { versionHistory } from '../../../public/history/version-history'
  import pkg from '../../../package.json'
  import preventBack from 'vue-prevent-browser-back'
  import { switchHover, globalAlarmSound } from '@/api/visualScreen/index.js'
  import { pauseTip, triggerAction, neverRemind } from '@/api/public'
  import { sessionState } from '@/api/index'
  import { projectIndexDB } from '@/plugins/indexDB/index'
  import alarmTTSMixin from '@/mixins/alarmTTSMixin'
  import zoomTipsMixin from '@/mixins/zoomTipsMixin'
  import cameraAlarmMixin from '@/mixins/cameraAlarmMixin'
  import PwdWeakToolModal from '@/pages/visualScreen/component/PwdWeakToolModal.vue'
  import { mapState } from 'vuex'
  import { sleep } from '@utils/common'
  import dayjs from 'dayjs'

  export default {
    components: {
      iFeedback,
      hNav: _headerNav,
      lNav: _contentNav,
      rNav: _rightNav,
      bNav: _bottomNav,
      mNav: _middleNav,
      msNav: _middleSecNav,
      PwdWeakToolModal,
    },
    mixins: [preventBack, alarmTTSMixin, zoomTipsMixin, cameraAlarmMixin],
    data() {
      return {
        isHeadShow: false,
        curProOrMacPoint: '',
        textType: this.$t('malignantLoadTip'),
        ctxPaths: this.$func.ctxPaths(),
        feedbackStatus: false,
        toolTipFlag: false,
        simValueList: [],
        message: '',
        projectFlag: false,
        versionHistory: versionHistory,
        industryTypesData: [{ code: 'all', imgSrc: require('../../assets/images/btn.gif'), name: this.$t('whole') }],
        wsDataList: [],
        chargeMessage: false,
        dialogAlarmVisible: false,
        localDatas: [],
        localData: [],
        excId: [],
        audioFlag: false,
        AlarmSoundList: {},
        musicStr: '',
        NotifyVisible: false,
        devicePasswordValue: false,
        notifyValue: false,
        mapData: '',
        loadingStatus: {
          energyConsumptiontrendNum: false,
          energyConsumptiontrendData: false,
          workorderManagement: false,
          detailList: false,
          policeInformationRelease: false,
          warningTrend: false,
          equipmentClassification: false,
          processAlarmLoading: false,
        },
        count: 0,
        checkedProjectStr: [],
        boxValue: false,
        remindData: [],
        remindType: '',
        refreshData: null,
        theme: 'dark',
        versionList: [],
        active: 1,
        content: '',
        value: 0,
        time: '',
        title: '',
        problemRate: 0,
        versionStatus: this.$store.state.versionStatus,
        rateid: [],
        timer: null,
        runTenseMusic: 2,
        musicStrAudio: '',
        maps: '',
        loadKey: null,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.path === '/loading') {
          const currentDate = dayjs()
          const formatDate = currentDate.format('YYYY-MM-DD')
          const lastDate = window.localStorage.getItem('pwdTipDate') || ''
          if (lastDate) {
            const otherDate = dayjs(lastDate)
            const diffDays = currentDate.diff(otherDate, 'days')
            if (diffDays >= 7) {
              vm.openEditPwdModal()
              window.localStorage.setItem('pwdTipDate', formatDate)
            }
          } else {
            vm.openEditPwdModal()
            window.localStorage.setItem('pwdTipDate', formatDate)
          }
        }
      })
    },
    async created() {
      let _this = this
      window.openPrjAction = (name, code) => {
        let item = { value: name, projectCode: code }
        _this.handleSelect(item)
      }
      this.timer = window.setInterval(() => {
        setTimeout(this.handlesessionState(), 0)
      }, 30000)
    },
    mounted() {
      Array.from(document.getElementsByClassName('global-alarm-modal'))[0].style.display = 'block'
      this.getGlobalAlarmSound()
      this.init()
      this.localeFun()
      this.refreshData = setInterval(() => {
        this.remindData.map(val => {
          val.scond--
          if (val.scond < 0) {
            val.minuter--
            val.scond = 60
          }
          if (val.minuter < 0) {
            // 当倒计时小于0时清除定时器
            val.chargeMessage = false
            // window.clearInterval(this.refreshData); // 清除定时器
          }
        })
      }, 1000)
      this.$nextTick(() => {
        this.loadAllProject()
      })
    },
    destroyed() {
      clearInterval(this.refreshData) // 清除定时器
      clearInterval(this.timer)
      this.timer = null
    },
    activated() {
      if ('WebSocket' in window) {
        window.addEventListener('onmessageWS', this.getsocketData)
      }
    },
    deactivated() {
      window.removeEventListener('onmessageWS', this.getsocketData)
    },
    computed: {
      ...mapState('loginInfo', ['pwdWeak', 'pwdExpire']),
      matchedOptions() {
        if (this.message !== '') {
          return this.checkedProjectStr.filter(item => item.projectName.indexOf(this.message) > -1)
        } else {
          return this.checkedProjectStr
        }
      },
    },
    methods: {
      // 登录状态
      async openEditPwdModal() {
        if (this.pwdWeak || this.pwdExpire) {
          await sleep(3000)
          this.$refs.pwdWeakRef.showPwdToolModal()
        }
      },
      handlesessionState() {
        let params = {}
        sessionState(params).then(res => {})
      },
      handlefeedstatus(val) {
        this.feedbackStatus = val
      },
      handlefeedbackStatus(val) {
        this.feedbackStatus = val
      },
      feedbackV(val) {
        this.feedbackStatus = val
      },
      confirm() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('neverRemindAgainTip'),
          onOk: () => {
            this.handleNeverRemind()
            this.toolTipFlag = false
          },
          onCancel: () => {},
        })
      },
      handleNeverRemind() {
        let projcodes = []
        this.simValueList.map(val => {
          projcodes.push(val.projectCode)
        })
        let params = { projectCodes: `${projcodes}` }
        neverRemind(params).then(res => {
          if (res.success) {
            this.$Message.success({ content: this.$t('savedSuccessfully') })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleRoute(type, classify, item) {
        let params = {
          projectCode: item.code,
        }
        switchHover(params).then(res => {
          if (res.success) {
            store.commit('projectCode', item.code)
            store.commit('projectName', item.name)
            let path = ''
            if (type === 1) {
              path = '/safetyMonitor/shortCircuitWarn'
            } else if (type === 2) {
              path = '/safetyMonitor/leakageWarm'
            } else if (type === 3 || type === 4) {
              path = '/safetyMonitor/abnormalCurrent'
            } else if (type === 5 || type === 6) {
              path = '/safetyMonitor/abnormalVoltage'
            } else if (type === 7) {
              path = '/safetyMonitor/temperatureWarn'
            } else if (type === 11) {
              path = '/safetyMonitor/SparkWarn'
            } else if (type === 17) {
              path = '/safetyMonitor/phaseWarn'
            } else {
              path = '/safetyMonitor/allWarn'
            }
            this.$router.push({ path: `${path}` })
            store.commit('classify', classify)
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handlePauseTip(item, type) {
        let params = { projectCode: item.projcode, remindType: item.remindType, flag: type }
        pauseTip(params).then(res => {
          if (res.success) {
            item.chargeMessage = false
            this.$Message.success({ content: this.$t('savedSuccessfully') })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handlePriggerAction(item) {
        let params = { actionId: item.actionId }
        triggerAction(params).then(res => {
          if (res.success) {
            item.chargeMessage = false
            this.$Message.success({ content: this.$t('savedSuccessfully') })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      localeFun() {
        if (this.$store.state.locale !== 'zh-CN') {
          this.$refs.alarmSocket.$refs.content.setAttribute('class', 'ivu-modal-contentE')
        } else {
          this.$refs.alarmSocket.$refs.content.setAttribute('class', 'ivu-modal-content')
        }
      },
      disableBrowserBack() {
        history.pushState(null, null, document.URL)
      },
      async init() {
        this.checkedProjectStr = JSON.parse(await projectIndexDB.getItem('checkedProjectStr'))
        if ('WebSocket' in window) {
          window.addEventListener('onmessageWS', this.getsocketData, false)
        }
        if (this.$store.state.devHis === true) {
          this.$nextTick(() => {
            setTimeout(() => {
              if (this.$func.getDaysBetween(Date.parse(new Date(versionHistory.current.deploy_time)), new Date()) <= 7) {
                if (document.cookie.indexOf('notify') === -1) {
                  this.openNotifyInstance()
                } else {
                  if (!this.$func.getCookie(`notify-${pkg.version}`)) {
                    this.openNotifyInstance()
                  }
                }
              }
            }, 3000)
            setTimeout(() => {
              if (document.cookie.indexOf('devicePassword') === -1) {
                this.openDevicePasswordInstance()
              } else {
                if (!this.$func.getCookie(`devicePassword-${pkg.version}`)) {
                  this.openDevicePasswordInstance()
                }
              }
            }, 3100)
          })
          store.commit('devHis', false)
        }
      },
      getGlobalAlarmSound() {
        globalAlarmSound().then(res => {
          if (res.success) {
            this.AlarmSoundList = res.data
          } else if (res.code === '-1') {
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      openNotifyInstance() {
        let _that = this
        let newData = []
        const h = this.$createElement
        versionHistory.current.content.forEach(item => newData.push(h('p', null, item)))
        this.notifyInstance = this.$Notice.open({
          title: versionHistory.current.version_no,
          top: 5,
          duration: 20,
          dangerouslyUseHTMLString: true,
          onClose: function () {
            if (_that.notifyValue) {
              _that.$func.setCookie(`notify-${pkg.version}`, _that.notifyValue)
            }
          },
          render: h => {
            return h('div', [
              [
                h('div', { class: 'd-alm-content d-alm-content-show', style: 'color: #fff;' }, newData),
                h('div', { style: 'color: #fff;margin-top:10px;display:flex' }, [
                  [
                    h(
                      'div',
                      {
                        style: 'color: #fff;',
                        on: {
                          click: e => {
                            this.changeCheckbox(e)
                          },
                        },
                      },
                      [h('Checkbox'), h('span', { style: 'color: #fff;' }, this.$t('notRemindAgain'))]
                    ),
                  ],
                  h('button', { class: 'notifyMore', on: { click: this.clickBtn } }, this.$t('showMore')),
                ]),
              ],
            ])
          },
        })
      },
      openDevicePasswordInstance() {
        let _that = this
        let newData = []
        const H = this.$createElement
        if (this.$store.state.locale === 'zh-CN') {
          newData.push(H('div', { class: 'fs-20 tc' }, this.$t('initialPasswordTip')), H('div', { class: 'fs-12 tc', style: 'color: #007EFF;font-weight: 700;margin-top:10px;' }, this.$t('ownershipProject')))
        } else {
          newData.push(H('div', { class: 'fs-20 tl' }, this.$t('initialPasswordTip')), H('p', { class: ' tl', style: 'color: #007EFF;font-weight: 700;margin-top:10px;' }, this.$t('ownershipProject')))
        }

        this.DevicePasswordInstance = this.$Notice.open({
          title: this.$t('tip'),
          top: 5,
          duration: 20,
          dangerouslyUseHTMLString: true,
          onClose: function () {
            if (_that.devicePasswordValue) {
              _that.$func.setCookie(`devicePassword-${pkg.version}`, _that.devicePasswordValue)
            }
          },
          render: H => {
            return H(
              'div',
              {
                style: 'padding-top: 10px;color: #fff;',
              },
              [
                H('div', { class: 'd-alm-content', style: 'height: 70px;width: 280px;color: #fff;margin-bottom: 20px;' }, newData),
                H('div', { style: 'color: #fff;' }, [
                  H(
                    'div',
                    {
                      style: 'color: #fff;',
                      on: {
                        click: e => {
                          this.changeCheckbox1(e)
                        },
                      },
                    },
                    [H('Checkbox'), H('span', { style: 'color: #fff;' }, this.$t('notRemindAgain'))]
                  ),
                ]),
              ]
            )
          },
        })
      },
      clickBtn() {
        this.NotifyVisible = true
      },
      changeCheckbox(e) {
        this.notifyValue = e
      },
      changeCheckbox1(e) {
        this.devicePasswordValue = e
      },
      async loadAllProject() {
        let allProject = JSON.parse(await projectIndexDB.getItem('checkedProjectStr'))
        this.localDatas = allProject.map(item => ({ type: true, number: 0, numberWarn: 0, code: item.projectCode, name: item.projectName }))
      },
      handleSelect(item) {
        var path = '/console/project'
        store.commit('overviewMac', '')
        this.$func.switchToProject(item, path)
      },
      openPrjAction(value, projectCode) {
        let params = { value, projectCode }
        this.handleSelect(params)
      },
      handleAlarmClose() {
        this.localData = []
        this.dialogAlarmVisible = false
      },
      getsocketData(e) {
        this.wsData = JSON.parse(e && e.detail.data)
        if (!this.wsData.data) return false
        this.audioKey = ''
        this.audioFlag = false
        if (this.wsData.data.msgType === 5) {
          if (this.wsData.data.dataList[0] && this.wsData.data.dataList.length > 0) {
            if (this.wsData.data.dataList.filter(item => item.remindType === 2).length > 0) {
              let newArr = Array.isArray(this.wsData.data.dataList) && this.wsData.data.dataList.length && this.wsData.data.dataList.map(item => ({ ...item, projectName: '' }))
              let nameList = this.checkedProjectStr.map(item => ({ projectCode: item.projectCode, projectName: item.projectName }))
              nameList.forEach(item => {
                newArr.forEach(itm => {
                  if (item.projectCode === itm.projectCode) {
                    itm['projectName'] = item.projectName
                  }
                })
              })
              newArr.forEach(item => {
                this.simValueList.push(item)
              })
              if (Array.isArray(this.simValueList) && this.simValueList.length > 0) {
                this.showMessage()
              }
            }
          }
          this.wsData.data.dataList.map(item => {
            if (item.remindType === 3 || item.remindType === 4) {
              item.remindData.minuter = 9
              item.remindData.scond = 60
              item.remindData.chargeMessage = true
              item.remindData.projcode = item.projectCode
              item.remindData.remindType = item.remindType
              this.chargeMessage = true
              this.remindType = item.remindType
              this.remindData.push(item.remindData)
            }
          })
        } else {
          this.wsData.data.dataList.map(item => {
            this.localDatas.map(itm => {
              if (item.projectCode.indexOf(itm.code) > -1) {
                this.localData.push({ code: itm.code, name: itm.name, ...item })
                this.localData = this.localData.filter(item => item.remindType !== 2)
              }
            })
            this.socketStatsNumber(this.wsData)
          })
        }
      },
      showAlarmTip() {
        this.audioFlag = true
        this.dialogAlarmVisible = true
      },
      socketStatsNumber(wsData) {
        let Mpauto = wsData.data.dataList[0].lastTypeNumber + ''
        if (wsData.data.dataList[0].valueDescribe.isPlayAudio !== undefined) {
          this.runTenseMusic = wsData.data.dataList[0].valueDescribe.isPlayAudio
          if (this.AlarmSoundList[Mpauto] !== undefined && this.AlarmSoundList[Mpauto].length > 0) {
            this.musicStrAudio = this.AlarmSoundList[Mpauto][0].path
          } else {
            this.musicStrAudio = ''
          }
        } else {
          this.runTenseMusic = 2
          if (this.AlarmSoundList[Mpauto] !== undefined && this.AlarmSoundList[Mpauto].length > 0) {
            this.musicStr = this.AlarmSoundList[Mpauto][0].path
          } else {
            this.musicStr = ''
          }
        }
        this.$nextTick(() => {
          if (wsData.data.dataList.length > 0) {
            this.gainType = 2
            let curTxt = []
            let types = []
            if (wsData.data.dataList[0] && wsData.data.dataList.length > 0) {
              wsData.data.dataList.forEach((v, i) => {
                if (v.remindType === 2) {
                } else {
                  this.showAlarmTip()
                }
                this.excId.push(v.id)
                if (v.mac && v.projectCode === this.$store.state.projectCode) {
                  this.alarms.unshift(v)
                  curTxt.push(v)
                  this.audioKey = String(v.typeNo)
                }
              })
              if (curTxt.length > 0) {
                this.popTxt = curTxt.concat(this.popTxt)
                if (this.popTxt.length > 100) {
                  this.gainType = 1
                  this.excId = []
                  this.alarms.splice(100, this.alarms.length - 100)
                }
                if (this.popTxt.length > 0) {
                  this.alarms.forEach((item, index) => {
                    types.unshift(item.typeNo)
                  })

                  if (types.indexOf(1002) > -1 && types.indexOf(1005) > -1) {
                    this.offlineAttention = true
                    this.abnormalAttention = true
                  } else {
                    types.indexOf(1002) > -1 ? (this.offlineAttention = true) : (this.offlineAttention = false)
                    types.indexOf(1005) > -1 ? (this.abnormalAttention = true) : (this.abnormalAttention = false)
                  }
                }
              }
            }
          }
        })
      },
      handleTopath(item) {
        // this.$Notice.close('ontice')
        let path2 = 'multiManage-trafficRenewal'
        this.$func.switchToProject(item, path2, '2')
      },
      onCloses(val) {
        // this.simValueList = [{ projectName: '' }]
        if (!val) {
          if (this.boxValue) {
            this.$func.setCookie(`deviceSims`, `${Math.random() * 100}-song`)
            this.$func.setCookie(`deviceSimList`, `${Math.random() * 100}-song`)
          }
        }
      },
      showMessage() {
        if (document.cookie.indexOf('deviceSims') === -1) {
        } else {
          if (this.$func.getCookie(`deviceSims`)) {
            this.toolTipFlag = false
            return
          }
        }

        if (this.toolTipFlag) {
        } else {
          this.toolTipFlag = true
          this.boxValue = false
        }
      },
      async renderFunc(val) {
        if (!(Array.isArray(val) && val.length)) {
          return
        }
        if (document.cookie.indexOf('deviceSims') === -1) {
        } else {
          if (this.$func.getCookie(`deviceSims`)) {
            return
          }
        }
        this.count += 2
        let valArr = Array.isArray(val) && val.length && val.map(item => ({ ...item, projectName: '' }))
        let projectList = JSON.parse(await projectIndexDB.getItem('checkedProjectStr'))
        let newArr = valArr
        let nameList = projectList.map(item => ({
          projectCode: item.projectCode,
          projectName: item.projectName,
        }))
        nameList.forEach(item => {
          newArr.forEach(itm => {
            if (item.projectCode === itm.projectCode) {
              itm['projectName'] = item.projectName
            }
          })
        })
        const h = this.$createElement

        let newData = []
        newArr.forEach(item => {
          newData.push(
            h(
              'div',
              {
                style: 'display:flex',
                on: {
                  click: e => {
                    this.handleTopath(item)
                  },
                },
              },
              [
                h('div', { style: ' display: inline-block; width: 10px;  height: 6px;  background-color: #007EFF;  color: #007EFF; border-radius: 50%; margin:5px 10px 5px 5px ;' }, ' '),
                h('div', {}, [h('span', { style: 'color:#007EFF' }, this.$t('projectDeviceTip', { projectName: item.projectName, deviceName: item.remindData.boxName || '', mac: item.remindData.mac || '' })), h('span', { style: 'color:#999999' }, item.remindData.content)]),
              ]
            )
          )
        })
        // this.$Notice.close('notice')
        this.$Notice.open({
          title: this.$t('trafficRenewalRemind'),
          duration: 20,
          name: 'ontice',
          onClose: () => {
            this.count = 0
            if (this.boxValue) {
              this.count = 2
              this.$func.setCookie(`deviceSims`, `${Math.random() * 100}-song`)
            }
          },
          render: h => {
            return h('div', { style: 'z-index:9' }, [
              h('div', { class: 'pointer', on: { click: e => {} } }, newData),
              h('div', { style: 'color: #fff;margin-top:10px;display:flex' }, [
                [
                  h('div', { style: 'color: #fff;margin-top:10px' }, [
                    h(
                      'Checkbox',
                      {
                        on: {
                          'on-change': val => {
                            this.boxValue = val
                          },
                        },
                      },
                      this.$t('thisMonthNotRemind')
                    ),
                  ]),
                ],
                h(
                  'Button',
                  {
                    type: 'primary',
                    size: 'small',
                    style: 'margin-left:80px;font-size:12px;height:30px;',
                    on: {
                      click: e => {
                        this.projectFlag = true
                      },
                    },
                  },
                  this.$t('view')
                ),
              ]),
            ])
          },
        })
      },
    },
    watch: {
      '$store.state.allProjects': {
        handler(newVal, oldVal) {
          if (newVal.data.length) {
            this.loadKey = Math.random()
            this.loadAllProject()
          }
        },
        deep: true,
      },
    },
    beforeDestroy() {
      window.removeEventListener('onmessageWS', this.getsocketData)
    },
  }
</script>

<style lang="less" scoped>
  #visualScreen {
    width: 100%;
    height: 100%;
    background: url('../../assets/images/chinaBG.png') center/cover no-repeat;
    position: relative;
    overflow: hidden;
    .mask {
      height: 100%;
      position: absolute;
      top: 0;
      z-index: 1;
      &.mask-left {
        left: 0;
        background: linear-gradient(90deg, rgba(12, 16, 28, 1) 0, rgba(12, 16, 28, 1) 40%, rgba(12, 16, 28, 0));
      }
      &.mask-right {
        right: 0;
        background: linear-gradient(-90deg, rgba(12, 16, 28, 1) 0, rgba(12, 16, 28, 1) 40%, rgba(12, 16, 28, 0));
      }
    }
    .echarts_map {
      top: -33vh;
      z-index: 1;
    }
    .thre {
      display: flex;
      justify-content: space-between;
      .text {
        color: #8f3030;
      }
    }

    .layout_header {
      position: absolute;
      top: -15px;
      background-color: transparent;
      z-index: 10;
      width: 100%;
    }
    .layout_content_left {
      position: absolute;
      box-sizing: border-box;
      top: 60px;
      padding-left: 20px;
      padding-top: 25px;
      padding-bottom: 12px;
      background-color: transparent;
      height: 100%;
      z-index: 10;
    }
    .layout_content_middle {
      position: absolute;
      box-sizing: border-box;
      top: 60px;
      left: 24%;
      padding: 25px 20px 20px 20px;
      background-color: transparent;
      width: 52%;
      height: 70%;
      z-index: 7;
      display: flex;
      justify-content: center;
    }
    .layout_content_middleSec {
      position: absolute;
      box-sizing: border-box;
      background-color: transparent;
      width: 100%;
      height: 10%;
      z-index: 9;
      display: flex;
      align-items: center;
    }
    .layout_content_right {
      position: absolute;
      box-sizing: border-box;
      right: 0;
      top: 60px;
      padding-right: 20px;
      padding-top: 25px;
      padding-bottom: 12px;
      background-color: transparent;
      height: 100%;
      z-index: 7;
    }
    .layout_content_bottom {
      position: absolute;
      box-sizing: border-box;
      left: 24%;
      bottom: 0;
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 20px;
      background-color: transparent;
      width: 52%;
      height: 25%;
      z-index: 10;
    }
    .vertical-center-modal {
      display: flex;
      align-items: center;
      justify-content: center;
      #contain {
        width: 100%;
        height: 415px;
        margin: 0;
        font-family: '微软雅黑';
      }
    }
    /deep/.project-infoWindow {
      &::after {
        content: '';
        width: 0;
        height: 0;
        border-top: 8px solid rgba(96, 100, 112, 0.9);
        border-bottom: 0;
        border-right: 8px solid rgba(96, 100, 112, 0);
        border-left: 8px solid rgba(96, 100, 112, 0);
        position: absolute;
        bottom: -23px;
        left: 41%;
        transform: translateX(-41%);
        -ms-transform: translateX(-41%);
      }
      h3 {
        text-align: center;
        color: #fff;
        font-size: 14px;
        //   white-space: nowrap;
        //   overflow: hidden;
        //   text-overflow: ellipsis;
      }
      .goWarn {
        display: block;
        width: 100%;
        height: 24px;
        text-align: center;
        line-height: 24px;
        border-radius: 3px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        background-color: #6193f2;
        text-decoration: none;
      }
    }
  }

  @media only screen and (max-width: 1024px) {
    .mask,
    .layout_content_left,
    .layout_content_right {
      width: 24%;
    }
  }
  @media only screen and (min-width: 1024px) {
    .mask,
    .layout_content_left,
    .layout_content_right {
      width: 24%;
    }
    .layout_content_middleSec {
      top: 55%;
    }
  }
  @media only screen and (min-width: 1366px) {
    .mask,
    .layout_content_left,
    .layout_content_right {
      width: 24%;
    }
    .layout_content_middleSec {
      top: 60%;
    }
  }
  @media only screen and (min-width: 1920px) {
    .mask,
    .layout_content_left,
    .layout_content_right {
      width: 24%;
    }
    .layout_content_middleSec {
      top: 62%;
    }
  }
  /deep/.vertical-center-modals {
    display: flex !important;
    align-items: center;
    justify-content: right;
    z-index: 1199 !important;
    .ivu-modal-header {
      background-color: #0f2854;
    }
    .ivu-modal-body {
      background-color: #091429;
    }
    .ivu-modal {
      margin: 0;
      top: 300px;
      left: 400 !important;
      height: 258px !important;
    }
  }
  .scrollls {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  /deep/.vertical-center-tooltip {
    display: flex !important;
    align-items: center;
    justify-content: right;
    z-index: 1100 !important;
    .ivu-modal {
      margin: 0;
      top: 260px;
      left: 400 !important;
      height: 258px !important;
    }
  }
  .chargeMessage {
    /deep/.ivu-modal-mask {
      background-color: transparent;
    }
    /deep/.ivu-modal-content {
      box-shadow: 0px 0px 0px 0px #181e2e, 0px 0px 0px 0px;
    }
  }
</style>
