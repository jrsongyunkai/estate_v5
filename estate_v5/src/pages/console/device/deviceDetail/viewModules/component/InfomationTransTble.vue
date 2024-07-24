<template>
  <div class="device-info-tran">
    <div class="item-info">
      <div class="inform-heads">
        <div class="left ds-flx">
          <div class="mart"></div>
          <div class="title thead-title">{{ $t('buildingFireProtectionFacilitySystemStatus') }}</div>
        </div>
        <div class="right">
          <Button type="primary" ghost @click.stop="resfreshData('5')">{{ $t('refresh') }}</Button>
        </div>
      </div>
      <div>
        <div class="dis-fl">
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('systemAddress') }}：</div>
              <div style="flex: 1">{{ systemAddr || '' }}</div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('systemTypeShow') }}：</div>
              <div style="flex: 1">{{ systemTypeShow || '' }}</div>
            </div>
          </div>
          <div style="flex: 4">
            <div style="display: flex">
              <div class="right-gray">{{ $t('updateTime') }}：</div>
              <div style="flex: 1">{{ updateTime || '' }}</div>
            </div>
          </div>
        </div>
        <div class="dis-fl">
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('fireAlarmStatus') }}：</div>
              <div style="flex: 1">
                <span class="alarm-red" v-if="fireStatus === 1">{{ $t('alarm') }}</span>
                <span class="x-success" v-if="fireStatus === 0">{{ $t('normal') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('fireProtectionHostStatus') }}：</div>
              <div style="flex: 1">
                <span class="b-blueing" v-if="systemStatus === 1">{{ $t('normalMonitoring') }}</span>
                <span class="b-warning" v-if="systemStatus === 0">{{ $t('testStatus') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('faultStatus') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="errorStatus === 1">{{ $t('fault') }}</span>
                <span class="x-success" v-if="errorStatus === 0">{{ $t('normal') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('maskingStatus') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="shieldStatus === 1">{{ $t('masking') }}</span>
                <span class="x-success" v-if="shieldStatus === 0">{{ $t('noMasking') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('regulatoryStatus') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="supervisionStatus === 1">{{ $t('regulatory') }}</span>
                <span class="x-success" v-if="supervisionStatus === 0">{{ $t('noRegulatory') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('startStopStatus') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="onOffStatus === 0">{{ $t('stop') }}</span>
                <span class="x-success" v-if="onOffStatus === 1">{{ $t('startUp') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="dis-fl">
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('feedbackStatus') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="feedbackStatus === 1">{{ $t('feedback') }}</span>
                <span class="x-success" v-if="feedbackStatus === 0">{{ $t('noFeedback') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('delayState') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="delayStatus === 1">{{ $t('delay') }}</span>
                <span class="x-success" v-if="delayStatus === 0">{{ $t('noDelay') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('mainPowerState') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="mainPowerStatus === 1">{{ $t('fault') }}</span>
                <span class="x-success" v-if="mainPowerStatus === 0">{{ $t('normal') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('backupState') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="followPowerStatus === 1">{{ $t('fault') }}</span>
                <span class="x-success" v-if="followPowerStatus === 0">{{ $t('normal') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('busStatus') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="mainAddrStatus === 1">{{ $t('fault') }}</span>
                <span class="x-success" v-if="mainAddrStatus === 0">{{ $t('normal') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('actionStatus') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="operateStatus === 1">{{ $t('manual') }}</span>
                <span class="x-success" v-if="operateStatus === 0">{{ $t('automatic') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="dis-fl">
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('configurationChangeStatus') }}：</div>
              <div style="flex: 1">
                <span class="b-warning" v-if="settingChange === 1">{{ $t('configChange') }}</span>
                <span class="x-success" v-if="settingChange === 0">{{ $t('configNoChange') }}</span>
              </div>
            </div>
          </div>
          <div style="flex: 5">
            <div style="display: flex">
              <div class="right-gray">{{ $t('resetStatus') }}：</div>
              <div>
                <span class="b-warning" v-if="(resetStatus && resetStatus !== 1) || resetStatus === 0">{{ $t('reset1') }}</span>
                <span class="x-success" v-if="resetStatus === 1">{{ $t('normal') }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="dis-fl">
          <div style="flex: 1">
            <div style="display: flex">
              <div class="right-texts">{{ $t('version') }}：</div>
              <div style="flex: 1">
                {{ version || '' }}
              </div>
            </div>
          </div>
          <div style="flex: 5">
            <!-- <div style="display:flex">
            <div class="right-gray">装置说明：</div>
            <div style="flex:1">
              {{setting||''}}
            </div>
          </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="item-info">
      <div class="inform-heads">
        <div class="left ds-flx">
          <div class="mart"></div>
          <div class="title thead-title">{{ $t('statusBuildingFireProtectionEquipmentComponents') }}</div>
        </div>
        <div class="right">
          <Button type="primary" ghost @click.stop="resfreshData('6')">{{ $t('refresh') }}</Button>
        </div>
      </div>
      <div>
        <Table :data="infomList" :columns="infomcolumns">
          <template slot-scope="{ row }" slot="partAdress">{{ row.componentAddr }}</template>
          <template slot-scope="{ row }" slot="partType">{{ row.componentTypeShow }}</template>
          <template slot-scope="{ row }" slot="proInfo">{{ row.setting }}</template>
          <template slot-scope="{ row }" slot="proStaus">
            {{ row.componentStatus === 0 ? $t('testStatus') : row.componentStatus === 1 ? $t('normalStatus') : '' }}
          </template>
          <template slot-scope="{ row }" slot="fireAlarm">{{ row.fireStatus === 1 ? $t('alarm') : $t('normal') }}</template>
          <template slot-scope="{ row }" slot="faultStatus">{{ row.errorStatus === 1 ? $t('fault') : row.errorStatus === 0 ? $t('normal') : '' }}</template>
          <template slot-scope="{ row }" slot="shieldStatus">
            {{ row.shieldStatus === 1 ? $t('alMasking') : row.shieldStatus === 0 ? $t('noMasking1') : '' }}
          </template>
          <template slot-scope="{ row }" slot="checkStatus">
            {{ row.supervisionStatus === 1 ? $t('regulatory') : row.supervisionStatus === 0 ? $t('noRegulatory') : '' }}
          </template>
          <template slot-scope="{ row }" slot="offStatus">{{ row.onOffStatus === 1 ? $t('startUp') : row.onOffStatus === 0 ? $t('stop') : '' }}</template>
          <template slot-scope="{ row }" slot="backStatus">
            {{ row.feedbackStatus === 1 ? $t('feedback') : row.feedbackStatus === 0 ? $t('noFeedback') : '' }}
          </template>
          <template slot-scope="{ row }" slot="delayStatus">{{ row.delayStatus === 1 ? $t('haveDelay') : row.delayStatus === 0 ? $t('noDelay') : '' }}</template>
          <template slot-scope="{ row }" slot="elecStatus">{{ row.powerStatus === 1 ? $t('fault') : row.powerStatus === 0 ? $t('normal') : '' }}</template>
          <template slot-scope="{ row }" slot="refreshtime">{{ row.updateTime }}</template>
        </Table>
      </div>
    </div>
    <div class="item-info">
      <div class="inform-heads">
        <div class="left ds-flx">
          <div class="mart"></div>
          <div class="title thead-title">{{ $t('simulatedValuesOfBuildingFireProtectionCquipmentComponents') }}</div>
        </div>
        <div class="right">
          <Button type="primary" ghost @click.stop="resfreshData('7')">{{ $t('refresh') }}</Button>
        </div>
      </div>
      <div>
        <Table :data="infomMoniList" :columns="infomMonicolumns">
          <template slot-scope="{ row }" slot="partsAdress">{{ row.componentAddr }}</template>
          <template slot-scope="{ row }" slot="partsType">{{ row.componentTypeShow }}</template>
          <template slot-scope="{ row }" slot="modalValue">{{ row.value }}</template>
          <template slot-scope="{ row }" slot="refreshtimes">{{ row.updateTime }}</template>
        </Table>
      </div>
    </div>
    <div class="item-info">
      <div class="inform-heads">
        <div class="left ds-flx">
          <div class="mart"></div>
          <div class="title thead-title">{{ $t('firmwareOperationHistory') }}</div>
        </div>
        <div class="right">
          <span style="color: #999999">{{ $t('latestUpdateTime') }}：</span>
          <span>{{ (infomOperationList && infomOperationList[0] && infomOperationList[0].latestUpdateTimeShow) || '-' }}</span>
          <Button type="primary" ghost class="ml-10" @click.stop="openRefreshHistory">{{ $t('updateRecords') }}</Button>
          <Button type="primary" ghost class="ml-10" @click.stop="queryAllList('openHistory')">{{ $t('viewAll') }}</Button>
        </div>
      </div>
      <div>
        <Table :data="infomOperationList" :columns="infomOperationcolumns">
          <template slot-scope="{ row }" slot="opreTime">{{ row.operateTimeShow }}</template>
          <template slot-scope="{ row }" slot="opreObj">{{ row.operateObj }}</template>
          <template slot-scope="{ row }" slot="opreDetails">{{ row.detailShow }}</template>
          <template slot-scope="{ row }" slot="opreNum">{{ row.operateUserNo }}</template>
        </Table>
      </div>
    </div>
    <div class="item-info">
      <div class="inform-heads">
        <div class="left ds-flx">
          <div class="mart"></div>
          <div class="title thead-title">{{ $t('platformOperationRecords') }}</div>
        </div>
        <div class="right">
          <Button type="primary" ghost class="ml-10" @click.stop="queryAllList('viewAll')">{{ $t('viewAll') }}</Button>
        </div>
      </div>
      <div>
        <Table :data="operationHistoryList" :columns="operationHistorycolumns">
          <template slot-scope="{ row }" slot="historyFrom">
            {{ JSON.parse(row.operateParams).source === 0 ? $t('manual') : JSON.parse(row.operateParams).source === 1 ? $t('linkage') : '' }}
          </template>
          <template slot-scope="{ row }" slot="operationPerson">{{ row.staffName }}</template>
          <template slot-scope="{ row }" slot="operationTime">{{ row.operateTime }}</template>
          <template slot-scope="{ row }" slot="actionType">{{ row.others.actionType_desc || '' }}</template>
          <template slot-scope="{ row }" slot="results">
            {{ row.status && (row.status.status || row.status.status === 0) ? (row.status.status === 0 ? $t('answered') : row.status.status === 1 ? $t('onDutyInspection') : row.status.status === 2 ? $t('noResponseAfterTimeout') : row.status.status === 3 ? $t('noJobCheckSetup') : '') : '' }}
          </template>
        </Table>
      </div>
    </div>
    <Modal :title="$t('updateRecords')" v-model="historyModal">
      <div style="margin: 15px 0">
        {{ $t('startingTime') }} ：
        <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="$t('pleaseSelectDateTime')" style="width: 200px" v-model="beginTime"></DatePicker>
      </div>
      <div>
        {{ $t('readsNumber') }}：
        <InputNumber :max="100" :min="1" v-model="count" style="width: 200px"></InputNumber>
      </div>
      <div slot="footer">
        <Button type="primary" @click="refreshHistory">{{ $t('confirm') }}</Button>
        <Button @click="historyModal = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import store from '@/store'
  import { queryutInfo, pageInnerLog, refreshRealTime, refreshLog } from '@/api/public'
  import { queryOperateLog } from '@/api/index'
  import dayjs from 'dayjs'
  export default {
    props: {
      mac: {
        type: String,
        default: '',
      },
      transmissionDevice: {
        type: Object,
        default: () => {},
      },
    },

    data() {
      return {
        beginTime: '',
        historyModal: false,
        count: 10,
        systemAddr: '',
        updateTime: '',
        systemTypeShow: '',
        fireStatus: '',
        systemStatus: '',
        errorStatus: '',
        shieldStatus: '',
        supervisionStatus: '',
        onOffStatus: '',
        feedbackStatus: '',
        delayStatus: '',
        mainPowerStatus: '',
        followPowerStatus: '',
        mainAddrStatus: '',
        operateStatus: '',
        settingChange: '',
        resetStatus: '',
        setting: '',
        version: '',
        operationHistoryList: [],
        operationHistorycolumns: [
          {
            title: this.$t('source'),
            slot: 'historyFrom',
          },
          {
            title: this.$t('Operator'),
            slot: 'operationPerson',
          },
          {
            title: this.$t('operationTime'),
            slot: 'operationTime',
          },
          {
            title: this.$t('actionType'),
            slot: 'actionType',
          },
          {
            title: this.$t('result'),
            slot: 'results',
          },
        ],
        infomOperationList: [],
        infomOperationcolumns: [
          {
            title: this.$t('operationTime'),
            slot: 'opreTime',
          },
          {
            title: this.$t('opreObj'),
            slot: 'opreObj',
          },
          {
            title: this.$t('opreDetails'),
            slot: 'opreDetails',
          },
          {
            title: this.$t('operatorID'),
            slot: 'opreNum',
          },
        ],
        infomMoniList: [],
        infomMonicolumns: [
          { title: this.$t('componentAddress'), slot: 'partsAdress' },
          { title: this.$t('componentType'), slot: 'partsType' },
          {
            title: this.$t('analogValue'),
            slot: 'modalValue',
          },
          { title: this.$t('updateTime'), slot: 'refreshtimes' },
        ],
        infomList: [],
        infomcolumns: [
          { title: this.$t('componentAddress'), slot: 'partAdress' },
          { title: this.$t('componentType'), slot: 'partType' },
          { title: this.$t('componentConfigurationDescription'), slot: 'proInfo' },
          { title: this.$t('componentStatus'), slot: 'proStaus' },
          { title: this.$t('fireAlarmStatus'), slot: 'fireAlarm' },
          { title: this.$t('faultStatus'), slot: 'faultStatus' },
          { title: this.$t('maskingStatus'), slot: 'shieldStatus' },
          { title: this.$t('regulatoryStatus'), slot: 'checkStatus' },
          { title: this.$t('startStopStatus'), slot: 'offStatus' },
          { title: this.$t('feedbackStatus'), slot: 'backStatus' },
          { title: this.$t('delayState'), slot: 'delayStatus' },
          { title: this.$t('powerStatus'), slot: 'elecStatus' },
          { title: this.$t('updateTime'), slot: 'refreshtime' },
        ],
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init(val) {
        this.getQueryInfo()
        this.getPageInnerLog()
        this.getQueryOperateLog()
      },
      getQueryInfo() {
        if (this.transmissionDevice.utComponentStatusList) {
          this.infomList = this.transmissionDevice.utComponentStatusList
        }
        if (this.transmissionDevice.utComponentAnalogList) {
          this.infomMoniList = this.transmissionDevice.utComponentAnalogList
        }
        if (this.transmissionDevice && this.transmissionDevice.utSystemStatusList) {
          const { systemAddr, systemTypeShow, updateTime, fireStatus, systemStatus, errorStatus, shieldStatus, supervisionStatus, onOffStatus, feedbackStatus, delayStatus, mainPowerStatus, followPowerStatus, mainAddrStatus, operateStatus, settingChange, resetStatus, version, setting } =
            this.transmissionDevice.utSystemStatusList[0]
          this.systemAddr = systemAddr
          this.systemTypeShow = systemTypeShow
          this.updateTime = updateTime
          this.fireStatus = fireStatus
          this.systemStatus = systemStatus
          this.errorStatus = errorStatus
          this.shieldStatus = shieldStatus
          this.supervisionStatus = supervisionStatus
          this.onOffStatus = onOffStatus
          this.feedbackStatus = feedbackStatus
          this.delayStatus = delayStatus
          this.mainPowerStatus = mainPowerStatus
          this.followPowerStatus = followPowerStatus
          this.mainAddrStatus = mainAddrStatus
          this.operateStatus = operateStatus
          this.settingChange = settingChange
          this.resetStatus = resetStatus
          this.version = version
          this.setting = setting
          return
        }
        queryutInfo({ mac: this.mac }).then(res => {
          if (res.success) {
            if (res.data.utSystemStatusList) {
              this.systemAddr = res.data.utSystemStatusList[0].systemAddr
              this.systemTypeShow = res.data.utSystemStatusList[0].systemTypeShow
              this.updateTime = res.data.utSystemStatusList[0].updateTime
              this.fireStatus = res.data.utSystemStatusList[0].fireStatus
              this.systemStatus = res.data.utSystemStatusList[0].systemStatus
              this.errorStatus = res.data.utSystemStatusList[0].errorStatus
              this.shieldStatus = res.data.utSystemStatusList[0].shieldStatus
              this.supervisionStatus = res.data.utSystemStatusList[0].supervisionStatus
              this.onOffStatus = res.data.utSystemStatusList[0].onOffStatus
              this.feedbackStatus = res.data.utSystemStatusList[0].feedbackStatus
              this.delayStatus = res.data.utSystemStatusList[0].delayStatus
              this.mainPowerStatus = res.data.utSystemStatusList[0].mainPowerStatus
              this.followPowerStatus = res.data.utSystemStatusList[0].followPowerStatus
              this.mainAddrStatus = res.data.utSystemStatusList[0].mainAddrStatus
              this.operateStatus = res.data.utSystemStatusList[0].operateStatus
              this.settingChange = res.data.utSystemStatusList[0].settingChange
              this.resetStatus = res.data.utSystemStatusList[0].resetStatus
              this.version = res.data.utSystemStatusList[0].version
              this.setting = res.data.utSystemStatusList[0].setting
            }
            if (res.data.utComponentStatusList) {
              this.infomList = res.data.utComponentStatusList
            }
            if (res.data.utComponentAnalogList) {
              this.infomMoniList = res.data.utComponentAnalogList
            }
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      getPageInnerLog() {
        let parmas = {
          mac: this.mac,
          pageNo: 1,
          pageSize: 10,
        }
        pageInnerLog(parmas).then(res => {
          if (res.success) {
            this.infomOperationList = res.datas
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getQueryOperateLog() {
        let param = {
          pageNo: 1,
          pageSize: 10,
          order: 'desc',
          startTime: this.$Date().add(-30, 'day').format('YYYY-MM-DD'),
          endTime: this.$Date().format('YYYY-MM-DD'),
          mac: this.mac,
          includeOperateParams: 'yes',
          staffId: '',
          category: '6',
        }
        queryOperateLog(param).then(res => {
          if (res.success) {
            this.operationHistoryList = res.datas && res.datas.map(v => ({ ...v, status: JSON.parse(v.operateParams) || '' }))
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      resfreshData(val) {
        refreshRealTime({ type: val, mac: this.mac }).then(res => {
          if (res.success) {
            this.init('reshesh')
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      openRefreshHistory() {
        this.historyModal = true
      },
      refreshHistory() {
        refreshLog({ mac: this.mac, beginTime: dayjs(this.beginTime).unix(), count: this.count }).then(res => {
          if (res.success) {
            let parmas = {
              mac: this.mac,
              pageNo: 1,
              pageSize: 10,
            }
            pageInnerLog(parmas).then(res => {
              if (res.success) {
                this.infomOperationList = res.datas
                this.historyModal = false
                this.$Message.success({
                  content: this.$t('updateRecordSuccessful'),
                })
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      queryAllList(val) {
        store.commit('detailsFlagMore', false)
        let path = val === 'viewAll' ? '/Logs' : '/HistoryList'
        this.$router.push({
          path,
          query: {
            mac: this.mac,
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .device-info-tran {
    .item-info {
      background: #1a202e;
      margin-bottom: 10px;
      padding: 0px 15px;
      padding-bottom: 10px;
      .inform-heads {
        display: flex;
        height: 50px;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #5e626c;
        .ds-flx {
          display: flex;
          align-items: center;
        }
        .mart {
          margin: 5px 0px;
          margin-right: 10px;
          width: 2px;
          height: 14px;
          background: #0372e5;
        }
      }
    }
    .dis-fl {
      display: flex;
      margin: 20px 0;
    }
    .right-texts {
      flex: 1;
      color: #999999;
      text-align: right;
    }
    .right-gray {
      color: #999999;
      margin-left: 42px;
    }
  }
</style>
