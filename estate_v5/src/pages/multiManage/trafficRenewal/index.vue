<template>
  <div class="sim-check">
    <div class="check-top-box">
      <Select v-model="selectCard" class="w100" :placeholder="$t('pleaseSelectCardVendor')" clearable>
        <Option v-for="(item, index) in cardList" :value="item.value" :key="index">{{ item.label }}</Option>
      </Select>
      <Select v-model="selectCardStatus" class="w100" :placeholder="$t('pleaseSelectCardState')" clearable>
        <Option v-for="(item, index) in cardStatusList" :value="item.value" :key="index">{{ item.label }}</Option>
      </Select>

      <Select v-model="selectTimeDay" class="w120" :placeholder="$t('pleaseSelectEffectiveDays')" clearable>
        <Option v-for="(item, index) in selectTimeList" :value="item.value" :key="index">{{ item.label }}</Option>
      </Select>
      <Select v-model="selectmeetRemind" class="w150" :placeholder="$t('plsCardRemind')" clearable>
        <Option v-for="(item, index) in meetRemindList" :value="item.value" :key="index">{{ item.label }}</Option>
      </Select>
      <Input class="w100" v-model="mac" :placeholder="$t('enterDeviceNo')" />
      <Input class="w100" v-model="simId" :placeholder="`${$t('simId')}/ICCID`"></Input>
      <Button type="primary" @click="queryList">{{ $t('query') }}</Button>
      <Button type="default" @click="resetForm" class="mrl-20">{{ $t('reset') }}</Button>
    </div>
    <div class="content-box">
      <div class="disfy">
        <h4 class="flex-1">{{ $t('simList') }}</h4>
        <div>
          <Button type="primary" @click="openAutomaticTip">{{ $t('autoRemind') }}</Button>
        </div>

        <Dropdown trigger="click" @on-click="outPutList">
          <div class="export">
            <Icon custom="icon-v5 icon-v5-daochu2" size="20" style="margin-left: 10px" />
          </div>
          <DropdownMenu slot="list">
            <DropdownItem name="current">{{ $t('exportCurrent') }}</DropdownItem>
            <DropdownItem name="exportAll">{{ $t('exportAll2') }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Table :columns="columnsList" :data="simDataList" class="content-table">
        <template slot-scope="{ row }" slot="status">
          <span v-if="row.cardStatus === 1" class="arrearage">{{ row.cardStatusDesc }}</span>
          <span v-if="row.cardStatus === 2" class="online">{{ row.cardStatusDesc }}</span>
          <span v-if="row.cardStatus === 3" class="cancels">{{ row.cardStatusDesc }}</span>
          <span v-if="row.cardStatus === 4" class="offline">{{ row.cardStatusDesc }}</span>
          <span v-if="row.cardStatus === 0" class="no-register">{{ row.cardStatusDesc }}</span>
          <!-- <span  >{{row.cardStatusDes}}</span> -->
        </template>
        <template slot-scope="{ row }" slot="volumePackage">
          <span v-if="row.cardStatus === 0">{{ '--' }}</span>
          <span v-else>{{ row.volumePackage }}</span>
        </template>
        <template slot-scope="{ row }" slot="cardShop">
          <span v-if="row.cardStatus === 0">{{ '--' }}</span>
          <span v-else>{{ row.supplierName }}</span>
        </template>
        <template slot-scope="{ row }" slot="operateShop">
          <span v-if="row.cardStatus === 0">{{ '--' }}</span>
          <span v-else>{{ row.carrierName }}</span>
        </template>
        <template slot-scope="{ row }" slot="packageExpireTime">
          <span v-if="row.cardStatus === 0">{{ '--' }}</span>
          <span v-else>{{ row.expireTime }}</span>
        </template>
        <template slot-scope="{ row }" slot="packageRemainExpireDay">
          <span v-if="row.cardStatus === 0">{{ '--' }}</span>
          <span v-else>{{ $t('numberOfDays', { number: row.remainExpireDay }) }}</span>
        </template>
        <template slot-scope="{ row }" slot="remainVolume">
          <span v-if="row.cardStatus === 0">{{ '--' }}</span>
          <span v-else>{{ row.remainVolume }}</span>
        </template>
      </Table>
      <Page @on-change="handlePage" @on-page-size-change="changesize" show-elevator show-total :current.sync="currentPage" :page-size="pageSize" :total="total"></Page>
    </div>
    <Modal :title="$t('autoRemind')" width="600" v-model="automaticTipFlag" id="modal-boxess" @on-ok="saveAutomTooltip">
      <div class="modal-boxs">
        <Icon type="md-text" />
        <span>{{ $t('remindTips') }}</span>
      </div>
      <div class="modal-content">
        <i18n path="remindCondition" tag="div" class="daynumber">
          <Checkbox slot="checkbox" v-model="dayRemind"></Checkbox>
          <InputNumber slot="input" style="width: 100px;margin-right: 10px;" v-model="dayValue" :max="99" :min="1"></InputNumber>
        </i18n>
        <i18n path="trafficRemindCondition" tag="div" class="daynumber">
          <Checkbox slot="checkbox" v-model="volumeRemind"></Checkbox>
          <InputNumber slot="input" style="width: 100px;margin-right: 10px;" v-model="volume" :max="99" :min="1"></InputNumber>
        </i18n>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { simPageList, automaticRemindConfigure, findAutomaticRemindConfigure } from '@/api/public'
  import InputNumbers from './input-Number.vue'
  export default {
    name: 'multiManage-trafficRenewal',
    components: { InputNumbers },
    data() {
      return {
        volume: 1,
        dayValue: 1,
        dayRemind: false,
        volumeRemind: false,
        currentPage: 1,
        pageSize: 20,
        total: 0,
        borderColor: true,
        // dayValue: 60,
        mbNumber: 60,
        automaticTipFlag: false,
        simId: '',
        mac: null,
        selectCard: '',
        selectmeetRemind: '',
        meetRemindList: [
          { label: this.$t('satisfy'), value: 1 },
          { label: this.$t('notSatisfy'), value: 2 },
          { label: this.$t('whole'), value: 0 },
        ],
        cardList: [
          { label: 'simboss', value: 1 },
          { label: '智联万物', value: 2 },
          { label: '连昇', value: 3 },
          { label: this.$t('whole'), value: 0 },
        ],
        selectCardStatus: '',
        cardStatusList: [
          { label: this.$t('arrears'), value: 4 },
          { label: this.$t('normal'), value: 2 },
          { label: this.$t('expired'), value: 3 },
          { label: this.$t('offline'), value: 1 },
          { label: this.$t('unregistered'), value: 0 },
          { label: this.$t('whole'), value: -1 },
        ],
        selectTimeDay: '',
        selectTimeList: [
          { value: 1, label: this.$t('withinOneMonth') },
          { value: 2, label: this.$t('withinThreeMonth') },
          { value: 3, label: this.$t('withinHalfYear') },
          { value: 4, label: this.$t('withinOneYear') },
          { value: 5, label: this.$t('whole') },
        ],
        columnsList: [
          { title: this.$t('index'), type: 'index', width: 70 },
          {
            title: this.$t('simId'),
            key: 'imsi',
            width: 170,
          },
          {
            title: 'ICCID',
            key: 'iccid',
            width: 200,
          },
          {
            title: this.$t('cardState'),
            slot: 'status',
            width: 90,
          },
          {
            title: this.$t('dataPlan'),
            slot: 'volumePackage',
          },
          {
            title: this.$t('cardSell'),
            slot: 'cardShop',
          },
          {
            title: this.$t('operators'),
            slot: 'operateShop',
            width: 80,
          },
          {
            title: this.$t('trafficCardExpirationTime'),
            slot: 'packageExpireTime',
            width: 180,
          },
          {
            title: this.$t('effectiveDaysRemaining'),
            slot: 'packageRemainExpireDay',
          },
          {
            title: this.$t('trafficUsage'),
            slot: 'remainVolume',
          },
          {
            title: this.$t('deviceAliases'),
            key: 'boxName',
            width: 150,
          },
          {
            title: this.$t('equipmentNo'),
            key: 'mac',
            width: 150,
          },
        ],
        simDataList: [],
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        let params = {
          queryMode: 1,
          projectCode: this.$store.state.projectCode,
          supplierId: this.selectCard ? this.selectCard : -2,
          cardStatus: this.selectCardStatus || this.selectCardStatus === 0 ? this.selectCardStatus : -1,
          expireRemainDay: this.selectTimeDay ? this.selectTimeDay : 0,
          simKey: this.simId ? this.simId : undefined,
          mac: this.mac,
          meetRemind: this.selectmeetRemind ? this.selectmeetRemind : 0,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        }
        simPageList(params).then(res => {
          if (res.success) {
            this.simDataList = (Array.isArray(res.datas) && res.datas.length && res.datas) || []
            this.total = res.total
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getDayFlow() {
        findAutomaticRemindConfigure({ projectCode: this.$store.state.projectCode }).then(res => {
          if (res.success) {
            if (Object.keys(res.data).length > 0) {
              this.dayValue = res.data.lack.day
              this.volume = res.data.lack.volume
              if (res.data.control !== undefined) {
                this.dayRemind = res.data.control.dayRemind
                this.volumeRemind = res.data.control.volumeRemind
              }
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      saveAutomTooltip() {
        let params = {
          projectCode: this.$store.state.projectCode,
          day: this.dayValue,
          volume: this.volume,
          dayRemind: this.dayRemind,
          volumeRemind: this.volumeRemind,
        }
        automaticRemindConfigure(params).then(res => {
          if (res.success) {
            this.automaticTipFlag = false
            this.$Message.success({
              content: res.message,
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      outPutList(val) {
        // const downLoadUrl = url => {
        //     const elink = document.createElement('a')
        //     elink.href = url
        //     document.body.appendChild(elink)
        //     elink.click()
        //     document.body.removeChild(elink)
        // }

        this.$func.windowCountDown(
          // this.$func.windowCountDown '/sim/export.as?queryMode=' + 1 + '&projectCode=' + this.$store.state.projectCode + '&supplierId=' + (this.selectCard ? this.selectCard : -2) + '&cardStatus=' + ((this.selectCardStatus || this.selectCardStatus === 0) ? this.selectCardStatus : -1) + '&expireRemainDay=' + (this.selectTimeDay ? this.selectTimeDay : 0) + '&imsi=' + (this.simId ? this.simId : '') + '&pageNo=' + this.currentPage + '&pageSize=' + this.pageSize
          `/sim/export.as?queryMode=${1}&projectCode=${this.$store.state.projectCode}&supplierId=${this.selectCard ? this.selectCard : -2}&cardStatus=${this.selectCardStatus || this.selectCardStatus === 0 ? this.selectCardStatus : -1}&expireRemainDay=${
            this.selectTimeDay ? this.selectTimeDay : 0
          }&imsi=${this.simId ? this.simId : ''}&mac=${this.mac || ''}&pageNo=${this.currentPage}&pageSize=${this.pageSize}&isExportAll=${val !== 'current'}`
        )
      },
      queryList() {
        this.currentPage = 1
        this.pageSize = 20
        this.init()
      },
      changesize(e) {
        this.pageSize = e
        this.init()
      },
      handlePage(e) {
        this.currentPage = e
        this.init()
      },
      getValue(val) {
        if (val < 7) {
          this.borderColor = false
        } else {
          this.borderColor = true
        }
      },
      resetForm() {
        this.selectCard = ''
        this.selectCardStatus = ''
        this.selectmeetRemind = ''
        this.selectTimeDay = ''
        this.simId = undefined
        this.mac = null
        this.init()
      },
      openAutomaticTip() {
        this.automaticTipFlag = true
        this.getDayFlow()
      },
    },
  }
</script>

<style lang="less">
  .sim-check {
    .check-top-box {
      display: flex;
      padding: 10px;
      margin-top: 10px;
      background-color: #1a202e;
      .w100 {
        width: 150px;
        margin-right: 10px;
      }
      .w120 {
        width: 180px;
        margin-right: 10px;
      }
      .w150 {
        width: 200px;
        margin-right: 10px;
      }
      .mrl-20 {
        margin-left: 10px;
      }
    }
    .offline {
      padding: 2px 6px;
      color: #e03c3a;
      background: rgba(224, 60, 58, 0.2);
      border-radius: 4px;
    }
    .online {
      padding: 2px 6px;
      color: #21f27f;
      background: rgba(33, 242, 127, 0.2);
      border-radius: 4px;
    }
    .cancels {
      padding: 2px 6px;
      color: #999999;
      background: rgba(153, 153, 153, 0.2);
      border-radius: 4px;
    }
    .arrearage {
      padding: 2px 6px;
      color: #999999;
      background: rgba(153, 153, 153, 0.2);
      border-radius: 4px;
    }
    .no-register {
      padding: 2px 6px;
      color: #666666;
      background: rgba(102, 102, 102, 0.2);
      border-radius: 4px;
    }
    .content-box {
      padding: 20px;
      margin-top: 10px;
      background-color: #1a202e;
      .disfy {
        display: flex;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        align-items: center;
      }
      .content-table {
        margin-top: 20px;
      }
      .flex-1 {
        flex: 1;
      }
      .export {
        background: rgba(0, 126, 255, 0.1);
        border: 1px solid #007eff;
        border-radius: 5px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        .ivu-icon {
          color: #007eff;
          margin: 0 !important;
        }
      }
    }
  }
  #modal-boxess {
    .modal-boxs {
      background-color: rgba(153, 153, 153, 0.05);
      padding: 8px 10px;
      border: 1px solid #888b92;
      color: #999999;
    }
    .daynumber {
      color: #989897;
      margin-top: 20px;
    }
    .borders {
      border: 1px solid red;
    }

    .pd {
      padding: 10px;
    }
    .pds {
      padding: 10px 0 10px 10px;
    }
    .tools {
      font-size: 12px;
      color: #999999;
    }
    .mt {
      margin-top: 10px;
      display: flex;
    }
    .ml {
      margin: 0 5px;
    }
  }
</style>
