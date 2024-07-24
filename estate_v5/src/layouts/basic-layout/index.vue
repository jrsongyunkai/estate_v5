<template>
  <div>
    <Layout class="i-layout">
      <Sider v-if="!isMobile && !hideSider" class="i-layout-sider" :class="siderClasses" :width="menuSideWidth">
        <i-menu-side :hide-logo="isHeaderStick && headerFix && showHeader" />
      </Sider>
      <Layout class="i-layout-inside" :class="insideClasses">
        <transition name="fade-quick">
          <Header class="i-layout-header" :class="headerClasses" :style="headerStyle" v-show="showHeader" v-resize="handleHeaderWidthChange">
            <i-header-logo v-if="isMobile && showMobileLogo" />
            <i-header-logo v-if="!isMobile && isHeaderStick && headerFix" />
            <!-- 伸展侧边栏按钮 -->
            <i-header-collapse v-if="(isMobile || showSiderCollapse) && !hideSider" @on-toggle-drawer="handleToggleDrawer" />
            <!-- <i-header-reload  @on-reload="handleReload" /> -->
            <i-menu-head v-if="headerMenu && !isMobile" ref="menuHead" />
            <!-- 顶部面包屑 -->
            <!-- <i-header-breadcrumb v-if="showBreadcrumb && !headerMenu && !isMobile" ref="breadcrumb" /> -->
            <template>
              <span v-if="$store.state.prjTitle !== ''" style="font-size: 20px">{{ $store.state.prjTitle }}</span>
              <span v-if="$store.state.prjTitle === ''" style="font-size: 20px">{{ $store.state.prjName }}</span>
            </template>
            <i-header-search v-if="showSearch && !headerMenu && !isMobile && !showBreadcrumb" @on-reload="handleReload" />

            <div class="i-layout-header-right" style="display: flex">
              <i-header-search v-if="(showSearch && isMobile) || (showSearch && (headerMenu || showBreadcrumb))" @on-reload="handleReload" />

              <div class="set">
                <i-link to="/setting/projectInfo">
                  <span class="i-layout-header-trigger i-layout-header-trigger-min"><Icon custom="icon-v5 icon-v5-shezhi1" /></span>
                </i-link>
              </div>
              <!-- <i-menu-head v-if="headerMenu && isMobile" /> -->

              <div class="set">
                <i-header-fullscreen v-if="isDesktop && showFullscreen" />
              </div>
              <div class="set">
                <i-header-notice v-if="showNotice" />
              </div>
              <div class="set">
                <i @click="switchSound" class="icon-v5 layout_header_icon i-layout-header-trigger i-layout-header-trigger-min" :class="!$store.state.muted ? 'icon-v5-shengyin-da_volume-notice' : 'icon-v5-jingyin_volume-mute'"></i>
              </div>
              <i-header-user @feedback="feedback" />
              <i-header-i18n />
              <!-- <div class="set">
                <i-header-i18n v-if="showI18n" />
            </div> -->
              <!-- <i-header-setting v-if="enableSetting && !isMobile" /> -->
            </div>
          </Header>
        </transition>
        <Content class="i-layout-content" :class="contentClasses">
          <transition name="fade-quick">
            <i-tabs v-if="tabs" v-show="showHeader" @on-reload="handleReload" />
          </transition>
          <div class="i-layout-content-main">
            <keep-alive :include="keepAlive" :max="20">
              <router-view v-if="loadRouter" />
            </keep-alive>
          </div>
          <div v-for="(item, index) in remindData" :key="item.actionId" class="remindModal">
            <Modal v-model="item.chargeMessage" :title="item.text" :draggable="true" class="chargeMessage" @on-visible-change="visibleChange(index, $event)" :mask="false">
              <div style="margin-top: 15px">
                <span v-if="[3, 4, 6].includes(item.remindType)">{{ item.info || '' }}</span>
                <span v-if="item.actionId">
                  ， {{ item.countdownMin }}:{{ item.countdownSec }}
                  <span>{{ $t('after') }}{{ $t('willBeAutoExe') }}{{ item.actionType === 1 ? $t('opening') : $t('closing') }}，{{ $t('doThisRightNow') }}</span>
                </span>
              </div>
              <div slot="footer">
                <Button style="border-color: #bfc0c3" @click="handlePauseTip(item, 2, index)">{{ $t('curMonthDontTip') }}</Button>
                <Button style="border-color: #bfc0c3" @click="handlePauseTip(item, 1, index)">{{ $t('todayDontTip') }}</Button>
                <Button type="primary" @click="closeMessageModel(item, index)" v-if="!item.actionId">{{ $t('confirm') }}</Button>
                <Button type="primary" @click="handlePriggerAction(item, index)" v-if="item.actionId">{{ $t('exeRightNow') }}</Button>
              </div>
            </Modal>
          </div>
        </Content>
        <FeedbackButton class="feedbackIcon" @click="handlefeedback">
          <img src="../../assets/images/feedbackIcon.png" alt="" />
        </FeedbackButton>
      </Layout>
      <div v-if="isMobile && !hideSider">
        <Drawer v-model="showDrawer" placement="left" :closable="false" :class-name="drawerClasses">
          <i-menu-side />
        </Drawer>
      </div>
    </Layout>
    <!-- 弹窗告警 -->
    <Modal width="785px;" id="alarmSocket2" @on-cancel="handleAlarms" @on-visible-change="onAlarmModalVisibleChange" v-model="alarmFlag" class="d-alm-wrap global-alarm-modal" ref="alarmSocket">
      <span slot="header">&nbsp;</span>
      <div class="d-alm-content d-alm-content-show">
        <div v-for="(item, index) in alarms.filter(item => item.remindType !== 2)" :key="index" :class="item.valueDescribe.his ? 'd-alm-content hisImage border-his' : 'd-alm-content  border-his'">
          <div style="display: flex">
            <img v-if="item.valueDescribe.type === 'eleCart'" src="../../assets/images/alarmIcon.png" alt="" class="img-box" />
            <img v-else src="../../assets/images/alarmTip.png" alt="" class="img-box" />
            <div class="mesBox">
              <div class="pd-botom">
                <span :class="item.valueDescribe.his ? 'gray-wordss' : 'c-warning'" v-if="item.conlictConfigName === undefined">
                  {{ (item.build ? item.build + ',' + item.unit + ',' + item.room : $t('unknownLocation')) + ('(' + item.mac + ')') + item.node }}{{ item.typeNo === 2023 ? `${($t('methaneAlarmTip'), { rate: item.valueDescribe.value })}` : '' }}
                  {{ item.lastTypeNumber === 1021 ? `${$t('thresholdAlarmValue')}：${item.valueDescribe.threshold + '/' + item.valueDescribe.triggerValue}` : '' }}
                  {{ (item.valueDescribe.utSystemType ? item.valueDescribe.utSystemType + '(' + item.valueDescribe.utSystemAddr + ')' : '') + (item.valueDescribe.utComponentType ? '/' + item.valueDescribe.utComponentType + '(' + item.valueDescribe.utComponentAddr + ')' : '') }}
                  {{ item.valueDescribe.from === 'timeThreshold' ? item.valueDescribe.thresholdName : '' }}
                  {{ item.valueDescribe.from === 'slaveDevice' ? item.valueDescribe.slaveDeviceTypeDesc + '(' + item.valueDescribe.value + ')' : '' }}{{ item.valueDescribe.from === 'loop' ? item.valueDescribe.loopName : '' }}
                  <template v-if="item.typeNo !== 2023">
                    <template v-if="item.valueDescribe.threshold !== undefined">
                      {{ item.valueDescribe.day ? $t('of') + item.valueDescribe.day + ([1024, 1025].includes(item.typeNo) ? $t('electricCharge') : [1022, 1023].includes(item.typeNo) ? $t('electricQuantity') : [2059, 2060, 2061, 2062].includes(item.typeNo) ? $t('carbonEmissions') : '') : '' }}
                      {{
                        item.valueDescribe && item.valueDescribe.value
                          ? '(' + (item.valueDescribe.isAlarmOrWarn ? $t('alarmValue') : $t('warningValue')) + '/' + $t('thresNow') + item.valueDescribe.value + (item.valueDescribe.unit || '') + '/' + item.valueDescribe.threshold + (item.valueDescribe.unit || '') + ')'
                          : ''
                      }}
                    </template>
                    <template v-else>
                      {{ item.valueDescribe && item.valueDescribe.value ? '(' + (item.valueDescribe.isAlarmOrWarn ? $t('alarmValue') : $t('warningValue')) + ':' + item.valueDescribe.value + ')' : '' }}
                    </template>
                  </template>
                  <template v-else>
                    {{ item.valueDescribe && item.valueDescribe.value ? '(' + (item.valueDescribe.isAlarmOrWarn ? $t('alarmValue') : $t('warningValue')) + '/' + item.valueDescribe.value + ')' : '' }}
                  </template>
                  {{ item.valueDescribe.deviceType ? item.valueDescribe.deviceType + ' ' + item.valueDescribe.alarmType : '' }}
                </span>
                <span class="c-warning" v-else>
                  {{ item.conlictConfigName + '(' + $t('unassignedConfigurationNumber') + ':' + item.projectConfigId + ')' }} {{ $t('and') }} {{ item.configName + '(' + $t('unassignedConfigurationNumber') + ':' + item.conlictProjectConfigId + ')' }} {{ item.macName + '(' + item.mac + ')' }}
                  {{ item.addrName }} {{ item.thresholdTypeName }}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between" v-if="item.conlictConfigName === undefined">
                <div>{{ '[' + item.datetime + ']' }}</div>
                <div>
                  <span :class="!item.status ? 'green-text-cleanup' : ''">{{ item.status ? $t('happen') : $t('rescission') }}</span>
                  <span :class="item.valueDescribe.his ? 'gray-wordss ' : 'c-danger '" class="jump pointer" @click="handleRoute(item.typeNo, item.classify)">
                    <span :title="getAlarmDetail(item)">
                      {{ getAlarmEllipsis(item) }}
                    </span>
                  </span>
                  <span v-if="item.lastTypeNumber === 1021">{{ item.valueDescribe.triggerType === 1 ? `(${$t('singlePointMode')})` : item.valueDescribe.triggerType === 2 ? `(${$t('smoothMode')})` : '' }}</span>
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
              <div v-else class="thre">
                <span>
                  {{ '[' + item.datetime + ']' }}
                </span>
                <span>
                  {{ $t('happen') }}
                  <span class="text">{{ $t('thresholdConflict') }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="gray-wordss" v-if="[66, 62].includes(item.typeNo)">
            {{ textType }}
          </div>
        </div>
      </div>
      <div :class="$store.state.locale !== 'zh-CN' ? 'alarmBtnE' : 'alarmBtn'" @click="handleAlarms" />
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="simNoticeFlag" :mask="false" :title="$t('trafficRenewalRemind')" class-name="vertical-center-Notice" width="400">
      <div class="scrfor" style="overflow-y: auto; height: 145px">
        <div v-for="(item, index) in simListNotice" :key="index" style="margin-top: 8px">
          <div style="display: flex" @click="handleTopath(item)">
            <span style="display: inline-block; width: 12px; height: 6px; background-color: #007eff; color: #007eff; border-radius: 50%; margin: 5px 10px 5px 4px"></span>
            <div>
              <span class="pointer" style="color: #007eff">{{ item.projectName + `${$t('of')}"` + (item.remindData.boxName ? item.remindData.boxName : '') + '(' + (item.remindData.mac ? item.remindData.mac : '') + ')"' }}</span>
              <span>{{ item.remindData.content }}</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div style="display: flex">
          <Button style="border: 1px solid #919192; color: #999999" type="default" @click="foreverTip">{{ $t('neverRemindAgain') }}</Button>
          <Button style="margin-left: 10px" type="primary" @click="onCloseFlag(true)">{{ $t('thisMonthNotRemind') }}</Button>
          <!-- <Checkbox v-model="checkValue">{{$t('placeholder.monthcantRemind')}} </Checkbox> -->
        </div>
      </div>
    </Modal>
    <Modal v-model="feedbackStatus" :title="$t('needFeedback')" width="1200" class="feedback">
      <iFeedback @feedbackchilren="handlefeedbackStatus" @feedstatus="handlefeedstatus" />
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="questionnaireStatus" class="questionnaire" :title="$t('questionnaireSurvey')" width="1200">
      <iQuestionnaire :effectiveData="effectiveData" @status="status" />
      <div slot="footer"></div>
    </Modal>
    <!-- 用电看护报警弹窗 -->
    <div v-for="(item, index) in kpModalList" :key="index">
      <Modal :title="$t('electricityMonitoringAlarm')" v-model="item.loveViewAlarm" id="chargeNurseModal" class="showBoxs" width="800" :mask="false" :mask-closable="false" @on-visible-change="getModalVisible($event, item, index)">
        <div style="margin: 20px">
          <span>{{ item.kpName + '(' + item.kpTel + ')' }}</span>
          <span>{{ $t('responsibleUsers') }}</span>
          <span>{{ item.personName + '(' + item.personTel + ')' }}</span>
          <span>{{ $t('stay') }}</span>
          <span style="color: red">{{ item.datetime }}{{ $t('timeSpan') }}</span>
          <span>{{ $t('happen') }}</span>
          <span style="color: red">{{ item.info }}</span>
        </div>
        <div style="margin: 20px">
          <h3 style="margin: 10px 0">{{ $t('alarmDetails1') }}</h3>
          <div style="display: flex">
            <div style="display: flex; margin: 10px 0; flex: 1">
              <div style="flex: 1; text-align: right; margin-right: 5px; color: #999999">{{ $t('device') }}:</div>
              <div style="flex: 3">{{ item.macName + '(' + item.mac + ')' }}</div>
            </div>
            <div style="display: flex; margin: 10px 0; flex: 1">
              <div style="flex: 1; text-align: right; margin-right: 5px; color: #999999">{{ $t('line') }}:</div>
              <div style="flex: 3">
                {{ item.node }}
                <span v-if="item.addr">{{ '(' + item.mac + item.addr + ')' }}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; margin-top: 10px">
            <div style="display: flex; margin: 10px 0; flex: 1">
              <div style="flex: 1; text-align: right; margin-right: 5px; color: #999999">{{ $t('addr') }}:</div>
              <div style="flex: 3">{{ item.address }}</div>
            </div>
            <div style="display: flex; margin: 10px 0; flex: 1">
              <div style="flex: 1; text-align: right; margin-right: 5px; color: #999999"></div>
              <div></div>
            </div>
          </div>
          <div style="display: flex">
            <div style="display: flex; margin: 10px 0; flex: 1">
              <div style="flex: 1; padding-top: 15px; text-align: right; margin-right: 5px; color: #999999">{{ $t('guanAiCode') }}:</div>
              <div style="flex: 3">
                <i v-if="!item.level" class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #999999"></i>
                <i v-if="item.level === '1'" class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #0dd667"></i>
                <i v-if="item.level === '2'" class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #e0e71c"></i>
                <i v-if="item.level === '3'" class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #1470ff"></i>
                <i v-if="item.level === '4'" class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #ea903a"></i>
                <i v-if="item.level === '5'" class="icon-v5 icon-v5-bhjqr8b" style="font-size: 36px; color: #e03c3a"></i>
              </div>
            </div>
            <div style="padding-top: 15px; display: flex; margin: 10px 0; flex: 1">
              <div style="flex: 1; text-align: right; margin-right: 5px; color: #999999">{{ $t('correctionParameters') }}:</div>
              <div style="flex: 3">{{ item.adjVal }}</div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <div style="display: flex; justify-content: space-between">
            <div style="margin: 10px">{{ $t('alarmIsReal') }}</div>
            <div style="margin-top: 40px">
              <Button type="primary" style="margin-right: 10px" @click="closekpModal(item, index)">{{ $t('yes') }}</Button>
              <Button type="default" @click="changAdjValue(item, index)">{{ $t('no') }}</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
    <Modal title="" class-name="writePwsSeconedCheckVue" v-model="writePwsSeconedCheckVue" :closable="false" width="400">
      <span v-if="origreportPower.remindData">
        {{
          `${origreportPower.remindData.boxName}（${origreportPower.remindData.mac}）${$t('of')}${origreportPower.remindData.title}（${origreportPower.remindData.addr}）${$t('indexReplaceValueTip1')}${origreportPower.remindData.origPower || '-'}kW·h，${$t('indexReplaceValueTip2')}${
            origreportPower.remindData.reportPower
          }kW·h，${$t('indexReplaceValueTip3')}。`
        }}
      </span>
      <div slot="footer">
        <Button class="b-blue" @click="handleorigreportPowerSave">{{ $t('rewrite') }}</Button>
        <Button class="b-blue" @click="writePwsSeconedCheckVue = false">{{ $t('replaceOriginalValue') }}</Button>
      </div>
    </Modal>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import iQuestionnaire from '../../components/questionnaire'
  import iFeedback from '../../components/feedback'
  import iMenuHead from './menu-head'
  import iMenuSide from './menu-side'
  import iHeaderLogo from './header-logo'
  import iHeaderCollapse from './header-collapse'
  import iHeaderReload from './header-reload'
  import iHeaderBreadcrumb from './header-breadcrumb'
  import iHeaderSearch from './header-search'
  import iHeaderFullscreen from './header-fullscreen'
  import iHeaderNotice from './header-notice'
  import iHeaderUser from './header-user'
  import iHeaderI18n from './header-i18n'
  import iHeaderSetting from './header-setting'
  import iTabs from './tabs'
  import iCopyright from '@/components/copyright'
  import { pauseTip, triggerAction, neverRemind, effectiveCheck, effectiveGet, modifyAdj, checkSecondPwd, setPower } from '@/api/public'
  import store from '../../store/index'
  import { mapState, mapGetters, mapMutations } from 'vuex'
  import Setting from '@/setting'
  import { lastAlarm4tip } from '@/api/index'
  import { globalAlarmSound } from '@/api/visualScreen/index.js'
  import { requestAnimation } from '@/libs/util'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import PwsSeconedCheckVue from '../../pages/Common/PwsSeconedCheck.vue'
  import FeedbackButton from './FeedbackButton.vue'
  import { projectIndexDB } from '@/plugins/indexDB/index'
  import alarmTTSMixin from '@/mixins/alarmTTSMixin'
  import zoomTipsMixin from '@/mixins/zoomTipsMixin'
  import cameraAlarmMixin from '@/mixins/cameraAlarmMixin'

  export default {
    name: 'BasicLayout',
    components: {
      PwsSeconedCheckVue,
      iMenuHead,
      iMenuSide,
      iCopyright,
      iHeaderLogo,
      iHeaderCollapse,
      iHeaderReload,
      iHeaderBreadcrumb,
      iHeaderSearch,
      iHeaderUser,
      iHeaderI18n,
      iHeaderFullscreen,
      iHeaderSetting,
      iHeaderNotice,
      iTabs,
      iFeedback,
      iQuestionnaire,
      FeedbackButton,
    },
    mixins: [alarmTTSMixin, zoomTipsMixin, cameraAlarmMixin],
    data() {
      return {
        textType: this.$t('malignantLoadTip'),
        newPwdsSeconed: '',
        openSeconedPwd: false,
        writePwsSeconedCheckVue: false,
        ctxPaths: this.$func.ctxPaths(),
        kpModalList: [],
        questionnaireStatus: false,
        questionnaireNum: '',
        simListNotice: [],
        checkValue: false,
        simNoticeFlag: false,
        showDrawer: false,
        ticking: false,
        headerVisible: true,
        oldScrollTop: 0,
        isDelayHideSider: false, // hack，当从隐藏侧边栏的 header 切换到正常 header 时，防止 Logo 抖动
        loadRouter: true,
        gainType: 1,
        excId: [],
        popText: [],
        alarms: [],
        alarmFlag: false,
        audioFlag: false,
        offlineAttention: false,
        abnormalAttention: false,
        AlarmSoundList: [],
        musicStr: '',
        musicStrAudio: '',
        remindData: [],
        remindType: '',
        refreshData: null,
        checkedProjectStr: [],
        count: 0,
        disCount: 0,
        feedbackStatus: false,
        effectiveData: [],
        effectiveObj: [],
        runTenseMusic: 2,
        origreportPower: {},
        writeBackValue: 0,
      }
    },
    computed: {
      ...mapState('admin/layout', [
        'siderTheme',
        'headerTheme',
        'headerStick',
        'tabs',
        'tabsFix',
        'siderFix',
        'headerFix',
        'headerHide',
        'headerMenu',
        'isMobile',
        'isTablet',
        'isDesktop',
        'menuCollapse',
        'showMobileLogo',
        'showSearch',
        'showNotice',
        'showFullscreen',
        'showSiderCollapse',
        'showBreadcrumb',
        'showLog',
        'showI18n',
        'showReload',
        'enableSetting',
      ]),
      ...mapState('admin/page', ['keepAlive']),
      ...mapGetters('admin/menu', ['hideSider']),
      // 如果开启 headerMenu，且当前 header 的 hideSider 为 true，则将顶部按 headerStick 处理
      // 这时，即使没有开启 headerStick，仍然按开启处理
      isHeaderStick() {
        let state = this.headerStick
        if (this.hideSider) state = true
        return state
      },
      showHeader() {
        let visible = true
        if (this.headerFix && this.headerHide && !this.headerVisible) {
          visible = false
        }
        return visible
      },
      headerClasses() {
        return [
          `i-layout-header-color-${this.headerTheme}`,
          {
            'i-layout-header-fix': this.headerFix,
            'i-layout-header-fix-collapse': this.headerFix && this.menuCollapse,
            'i-layout-header-mobile': this.isMobile,
            'i-layout-header-stick': this.isHeaderStick && !this.isMobile,
            'i-layout-header-with-menu': this.headerMenu,
            'i-layout-header-with-hide-sider': this.hideSider || this.isDelayHideSider,
          },
        ]
      },
      headerStyle() {
        const menuWidth = this.isHeaderStick ? 0 : this.menuCollapse ? 80 : Setting.menuSideWidth
        return this.isMobile || !this.headerFix
          ? {}
          : {
              width: `calc(100% - ${menuWidth}px)`,
            }
      },
      siderClasses() {
        return {
          'i-layout-sider-fix': this.siderFix,
          'i-layout-sider-dark': this.siderTheme === 'dark',
        }
      },
      contentClasses() {
        return {
          'i-layout-content-fix-with-header': this.headerFix,
          'i-layout-content-with-tabs': this.tabs,
          'i-layout-content-with-tabs-fix': this.tabs && this.tabsFix,
        }
      },
      insideClasses() {
        return {
          'i-layout-inside-fix-with-sider': this.siderFix,
          'i-layout-inside-fix-with-sider-collapse': this.siderFix && this.menuCollapse,
          'i-layout-inside-with-hide-sider': this.hideSider,
          'i-layout-inside-mobile': this.isMobile,
        }
      },
      drawerClasses() {
        let className = 'i-layout-drawer'
        if (this.siderTheme === 'dark') className += ' i-layout-drawer-dark'
        return className
      },
      menuSideWidth() {
        return this.menuCollapse ? 80 : Setting.menuSideWidth
      },
    },
    watch: {
      hideSider() {
        this.isDelayHideSider = true
        setTimeout(() => {
          this.isDelayHideSider = false
        }, 0)
      },
      $route(to, from) {
        document.querySelector('.i-layout-content-with-tabs-fix .i-layout-content-main').style.margin = '12px'
        document.querySelector('.i-layout-content-with-tabs-fix .i-layout-content-main').style.marginTop = '70px'
        if (to.name === from.name) {
          // 相同路由，不同参数，跳转时，重载页面
          if (Setting.sameRouteForceUpdate) {
            this.handleReload()
          }
        }
        if ('WebSocket' in window) {
          if (to.path === '/console/project') {
            window.removeEventListener('onmessageWS', this.getsocketData)
            window.addEventListener('onmessageWS', this.getsocketData)
          }
          if (to.path === '/visualScreen') {
            window.removeEventListener('onmessageWS', this.getsocketData)
          }
        } else {
          this.setTimer(this.getLastAlarms)
        }
      },
      immediate: true,
    },
    methods: {
      async handlesetPower() {
        let params = {
          mac: this.origreportPower.remindData.mac,
          nodes: this.origreportPower.remindData.addr,
          power: (this.origreportPower.remindData.reportPower * 1000).toFixed(0),
        }
        const res = await setPower(params)
        if (res.success) {
          this.writePwsSeconedCheckVue = false
          this.openSeconedPwd = false
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getAlarmDetail(item) {
        return item.info + (item.typeNo === 1005 ? `,${this.$t('pleaseConfirm')}!` : '') + (item.lastTypeNumber === 1015 ? '(' + item.valueDescribe.cAlmCtn + ')' : '')
      },
      getAlarmEllipsis(item) {
        let newStr = this.getAlarmDetail(item)
        return newStr.length > 20 ? newStr.substr(0, 18) + '...' : newStr
      },
      checkSecondePwds() {
        if (this.newPwdsSeconed.length < 6) {
          this.newPwdsSeconed = ''
          return this.$Message.error({ content: this.$t('pleaseEnterComplateSubPassword') })
        }
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          checkSecondPwd({ secondPwd: encry.encrypt(this.newPwdsSeconed), encB64: true }).then(res => {
            if (res.success) {
              if (res.code === '0') {
                this.openSeconedPwd = false
                this.handlesetPower()
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        })
      },
      closePwdModal() {
        this.openSeconedPwd = false
      },
      closeMessageModel(item, index) {
        item.chargeMessage = false
      },
      getnewPwdsVal(val) {
        this.newPwdsSeconed = val
      },
      handleorigreportPowerSave() {
        if (this.$store.state.setSecondPwds) {
          this.openSeconedPwd = this.$store.state.setSecondPwds
        } else {
          this.handlesetPower()
        }
      },
      getModalVisible(val, item, index) {
        if (!val) {
          item.loveViewAlarm = false
          this.kpModalList.splice(index, 1)
        }
      },
      closekpModal(item, index) {
        item.loveViewAlarm = false
        this.kpModalList.splice(index, 1)
      },
      visibleChange(index, e) {
        if (!e) this.remindData.splice(index, 1)
      },
      async changAdjValue(item, index) {
        item.loveViewAlarm = false
        this.kpModalList.splice(index, 1)
        let parms = { mac: item.mac, addr: item.addr, time: item.timeAt, adj: item.adjVal }
        const res = await modifyAdj(parms)
        if (res.success) {
          this.$Message.success({ content: this.$t('correctedInProgress') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      status(val) {
        this.questionnaireStatus = val
      },
      async handleEffectiveCheck() {
        const res = await effectiveCheck({})
        if (res.data.length > 0) {
          this.questionnaireStatus = true
          this.handleEffectiveGet(res.data[res.data.length - 1])
        }
      },
      async handleEffectiveGet(id) {
        this.effectiveObj = []
        let params = { id: id }
        const res = await effectiveGet(params)
        res.data.questionList.forEach(val => {
          if (val.answerItems === undefined) {
            val.answerItems = []
          }
          if (val.answerType === 1 || val.answerType === 2) {
            val.content = ''
          } else {
            val.content = []
          }
          if (val.imageUrls !== '') {
            val.imageUrls = 'https://v5.sndtest.com' + val.imageUrls
          }
          if (val.videoUrls !== '') {
            val.videoUrls = 'https://v5.sndtest.com' + val.videoUrls
          }
        })
        this.effectiveData = res.data
        this.effectiveData.questionnaireId = id
      },
      handlefeedstatus(val) {
        this.feedbackStatus = val
      },
      handlefeedbackStatus(val) {
        this.feedbackStatus = val
      },
      feedback(val) {
        this.feedbackStatus = val
      },
      handlefeedback() {
        this.feedbackStatus = true
      },
      onCloseFlag(val) {
        this.checkValue = true
        if (val) {
          this.$func.setCookie(`deviceSimList`, `${Math.random() * 100}-song`)
          this.$func.setCookie(`deviceSims`, `${Math.random() * 100}-song`)
          this.simNoticeFlag = false
        }
      },
      foreverTip() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('foreverTooltip'),
          onOk: async () => {
            let parmars = { projectCodes: this.$store.state.projectCode }
            const res = await neverRemind(parmars)
            if (res.success) {
              this.$Message.success({ content: this.$t('savedSuccessfully') })
              this.simNoticeFlag = false
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      handleTopath(item) {
        let path2 = 'multiManage-trafficRenewal'
        this.$func.switchToProject(item, path2, '2')
      },
      async handlePauseTip(item, type, index) {
        let params = { projectCode: item.projcode, remindType: item.remindType, flag: type }
        const res = await pauseTip(params)
        if (res.success) {
          item.chargeMessage = false
          this.$Message.success({ content: this.$t('submitCommand') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlePriggerAction(item, index) {
        let params = { actionId: item.actionId }
        const res = await triggerAction(params)
        if (res.success) {
          item.chargeMessage = false
          this.$Message.success({ content: this.$t('submitCommand') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      localeFun() {
        if (this.$store.state.locale !== 'zh-CN') {
          this.$refs.alarmSocket.$refs.content.setAttribute('class', 'ivu-modal-contentE')
        } else {
          this.$refs.alarmSocket.$refs.content.setAttribute('class', 'ivu-modal-content')
        }
      },
      switchSound() {
        store.commit('muted', !this.$store.state.muted)
      },
      init() {
        if ('WebSocket' in window) {
          window.addEventListener('onmessageWS', this.getsocketData, false)
        }
      },
      async getGlobalAlarmSound() {
        const res = await globalAlarmSound()
        if (res.success) {
          this.AlarmSoundList = res.data
        } else {
          this.$Message.error(res.message)
        }
      },
      ...mapMutations('admin/layout', ['updateMenuCollapse']),
      ...mapMutations('admin/page', ['keepAlivePush', 'keepAliveRemove']),
      handleToggleDrawer(state) {
        if (typeof state === 'boolean') {
          this.showDrawer = state
        } else {
          this.showDrawer = !this.showDrawer
        }
      },
      handleScroll() {
        if (!this.headerHide) return
        const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
        if (!this.ticking) {
          this.ticking = true
          requestAnimation(() => {
            if (this.oldScrollTop > scrollTop) {
              this.headerVisible = true
            } else if (scrollTop > 300 && this.headerVisible) {
              this.headerVisible = false
            } else if (scrollTop < 300 && !this.headerVisible) {
              this.headerVisible = true
            }
            this.oldScrollTop = scrollTop
            this.ticking = false
          })
        }
      },
      handleHeaderWidthChange() {
        const $breadcrumb = this.$refs.breadcrumb
        if ($breadcrumb) {
          $breadcrumb.handleGetWidth()
          $breadcrumb.handleCheckWidth()
        }
        const $menuHead = this.$refs.menuHead
        if ($menuHead) {
          // todo $menuHead.handleGetMenuHeight();
        }
      },
      handleReload() {
        // 针对缓存的页面也生效
        const isCurrentPageCache = this.keepAlive.indexOf(this.$route.name) > -1
        const pageName = this.$route.name
        if (isCurrentPageCache) {
          this.keepAliveRemove(pageName)
        }
        this.loadRouter = false
        this.$nextTick(() => {
          this.loadRouter = true
          if (isCurrentPageCache) {
            this.keepAlivePush(pageName)
          }
        })
      },
      handleAlarms() {
        this.gainType = 1
        this.excId = []
        this.popText = []
        this.alarms = []
        this.alarmFlag = false
        this.audioFlag = false
        this.$Modal.remove()
      },
      getsocketData(e) {
        this.wsData = JSON.parse(e && e.detail.data)
        if (!this.wsData.data) return false
        this.audioKey = ''
        this.audioFlag = false
        this.$nextTick(() => {
          if (this.wsData.data.msgType === 5) {
            this.wsData.data.dataList.map(item => {
              if (item.remindType === 2) {
                this.count = 1
              }
              if ([3, 4, 6].includes(item.remindType)) {
                item.remindData.chargeMessage = true
                item.remindData.projcode = item.projectCode
                item.remindData.remindType = item.remindType
                const { alarmClassify } = item.remindData
                if (item.remindType === 3) {
                  item.remindData.text = alarmClassify === -100 ? this.$t('batteryAlarmPrompt') : alarmClassify === -200 ? this.$t('electricityWarningPrompt') : ''
                } else if (item.remindType === 4) {
                  item.remindData.text = alarmClassify === -100 ? this.$t('electricityAlarmPrompt') : alarmClassify === -200 ? this.$t('electricityFeeWarningPrompt') : ''
                } else if (item.remindType === 6) {
                  item.remindData.text = alarmClassify === -100 ? this.$t('carbonEmissionAlarmPrompt') : alarmClassify === -200 ? this.$t('carbonEmissionWarningPrompt') : ''
                }
                this.remindType = item.remindType
                if (this.remindData.length >= 50) {
                  this.remindData.shift()
                }
                if (!this.remindData.find(it => it.actionId === item.remindData.actionId)) {
                  this.remindData.push(item.remindData)
                }
              }
              if (item.remindType === 5) {
                this.origreportPower = item
              }
            })
            if (this.count === 1) {
              let newArr = Array.isArray(this.wsData.data.dataList) && this.wsData.data.dataList.length && this.wsData.data.dataList.map(itx => ({ ...itx, projectName: '' }))
              let nameList = this.checkedProjectStr.map(itd => ({ projectCode: itd.projectCode, projectName: itd.projectName }))
              nameList.forEach(items => {
                newArr.forEach(itm => {
                  if (items.projectCode === itm.projectCode) {
                    itm['projectName'] = items.projectName
                  }
                })
              })
              newArr.forEach(its => {
                if (its.projectCode === this.$store.state.projectCode) {
                  this.simListNotice.push(its)
                }
              })
              this.simNoticeFlag = false
              if (!this.simNoticeFlag && this.simListNotice.length > 0 && !this.$func.getCookie(`deviceSimList`)) {
                if (this.simNoticeFlag) {
                } else {
                  this.disCount++
                  if (this.disCount % 2 === 0) {
                    this.disCount = 1
                  } else {
                    this.simNoticeFlag = true
                    this.disCount = 0
                  }
                }
              }
              this.count = 0
            }
            if (this.wsData.data.dataList[0].remindType === 5) {
              this.writePwsSeconedCheckVue = true
            }
          } else {
            this.socketStatsNumber(this.wsData)
          }
        })
      },
      handleRoute(type, classify) {
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
        this.alarmFlag = false
        this.audioFlag = false
      },
      showAlarmTip() {
        this.audioFlag = true
      },
      socketStatsNumber(wsData) {
        this.audioFlag = true

        this.$nextTick(() => {
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
          if (wsData.data.dataList.length > 0) {
            this.gainType = 2
            let curTxt = []
            let types = []
            if (wsData.data.dataList[0] && wsData.data.dataList.length > 0) {
              this.alarmFlag = true
              if (this.alarmFlag) {
                wsData.data.dataList.forEach((v, i) => {
                  this.excId.push(v.id)
                  this.alarms.unshift(v)
                  curTxt.push(v)
                  if (v.typeNo !== undefined) {
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
                    this.showAlarmTip()
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
              } else {
                this.alarmFlag = false
              }
            }
            if (wsData.data.dataList[0].typeNo === 1020) {
              wsData.data.dataList.forEach((v, i) => {
                this.kpModalList.push({ ...v, loveViewAlarm: true })
              })
            }
          }
        })
      },
      getLastAlarms() {
        let that = this
        if (this.$store.state.projectCode) {
          lastAlarm4tip({
            projectCode: this.$store.state.projectCode,
            gainType: this.gainType,
            excId: this.excId.join(','),
          })
            .then(res => {
              if (res.success) {
                this.gainType = 2
                let curTxt = []
                let types = []
                if (res.data && res.data.length > 0) {
                  res.data.forEach((v, i) => {
                    that.excId.push(v.id)
                    if (v.mac) {
                      that.alarms.unshift(v)
                      curTxt.push(v)
                      this.audioKey = String(v.typeNo)
                    }
                  })
                  if (curTxt.length > 0) {
                    that.popTxt = curTxt.concat(that.popTxt)
                    if (that.popTxt.length > 100) {
                      that.gainType = 1
                      that.excId = []
                      that.alarms.splice(100, that.alarms.length - 100)
                    }
                    if (that.popTxt.length > 0) {
                      that.showAlarmTip()
                      that.alarms.forEach((item, index) => {
                        types.unshift(item.typeNo)
                      })
                      if (types.indexOf(1002) > -1 && types.indexOf(1005) > -1) {
                        that.offlineAttention = true
                        that.abnormalAttention = true
                      } else {
                        types.indexOf(1002) > -1 ? (that.offlineAttention = true) : (that.offlineAttention = false)
                        types.indexOf(1005) > -1 ? (that.abnormalAttention = true) : (that.abnormalAttention = false)
                      }
                    }
                  }
                }
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({
                  content: this.$t('unknown'),
                })
              }
            })
        }
      },
    },
    mounted() {
      this.handleEffectiveCheck()
      Array.from(document.getElementsByClassName('global-alarm-modal'))[0].style.display = 'block'
      this.getGlobalAlarmSound()
      this.init()
      document.addEventListener('scroll', this.handleScroll, { passive: true })
      this.localeFun()
    },
    beforeDestroy() {
      document.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('onmessageWS', this.getsocketData)
    },

    async created() {
      this.checkedProjectStr = JSON.parse(await projectIndexDB.getItem('checkedProjectStr'))
      if (this.isTablet && this.showSiderCollapse) this.updateMenuCollapse(true)
    },
  }
</script>
<style lang="less">
  .img-box {
    width: 60px;
    height: 60px;
  }
  .pd-botom {
    padding-bottom: 10px;
  }
  .hisImage {
    background: url('../../assets/images/buchuan.png') right top no-repeat rgba(255, 255, 255, 0.1);
  }
  .gray-wordss {
    color: #999999;
  }
  .border-his {
    border-bottom: 1px solid #444549;
  }
  .green-text-cleanup {
    color: #21f27f;
  }
  .feedbackIcon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
    z-index: 999;
    img {
      user-select: none;
      pointer-events: none;
    }
  }
  .showBox {
    .deatil-flex {
      display: flex;
      margin: 10px 0;
    }
    .flex-ceters {
      flex: 1;
      text-align: right;
      margin-right: 5px;
    }
    .grays-color {
      color: #999999;
    }
    .flex-1 {
      flex: 1;
    }
  }

  .questionnaire {
    .ivu-modal-body {
      max-height: 1000px;
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .ivu-modal-footer {
      padding: 0;
    }
  }
  .thre {
    display: flex;
    justify-content: space-between;
    .text {
      color: #8f3030;
    }
  }
  .set {
    width: 30px;
    text-align: center;
  }
  .mesBox {
    flex: 1;
    padding: 8px 3px;
    // border-bottom: 1px solid #444549;
    margin-top: -5px;
  }
  .scrfor::-webkit-scrollbar {
    display: none;
  }
  .vertical-center-Notice {
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
</style>
