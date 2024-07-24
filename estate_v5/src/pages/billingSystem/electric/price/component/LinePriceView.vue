<template>
  <div>
    <Tabs value="current" name="subchild" @on-click="handleTabstype">
      <TabPane :label="$t('currentElectricityPrice')" name="current" tab="subchild">
        <Button @click="handleAddFormItem" class="addMacprice" v-if="!unitPriceStatus">{{ $t('addLineElectricityPrice') }}</Button>
        <div v-for="(item, indexs) in addrFormItem" :key="indexs" class="addrFormItemContent">
          <div class="header" style="justify-content: space-between">
            <div class="left-box">
              <span class="label-span">{{ $t('line') }}:</span>
              <div class="left-value">
                <PickLinesModules :disabled="unitPriceStatus" @openPickLinesModal="openPickLinesModal(item)" v-model="item.addrList" />
              </div>
            </div>
            <div v-if="!unitPriceStatus">
              <Button class="b-dger" @click="hanldeDelete('addrFormItem', indexs, item)">{{ $t('delete') }}</Button>
              <Button @click="handleAddconfiguration(item)" class="ml-10 b-blue"><Icon type="md-copy" /></Button>
            </div>
          </div>
          <TablePriceList v-model="item.priceList" :disabled="unitPriceStatus" @refreshData="handlegetTargetAndPriceChn" />
        </div>
      </TabPane>
      <TabPane :label="$t('electricityPriceToBeActivated')" name="activated" tab="subchild">
        <div class="header" style="justify-content: space-between">
          <div>
            <span>{{ $t('enablingTime') }}:</span>
            <span v-if="unitPriceStatus">{{ validStartTime }}</span>
            <DatePicker v-else :options="optionsTimer" v-model="validStartTime" format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('pleaseSelect')" style="width: 200px" :transfer="true" @on-change="handleactivationTime"></DatePicker>
          </div>
        </div>
        <Button @click="handleAddFormItem" class="addMacprice" v-if="!unitPriceStatus">{{ $t('addLineElectricityPrice') }}</Button>
        <div v-for="(item, indexs) in tobeUseraddrFormItem" :key="indexs" class="addrFormItemContent">
          <div class="header" style="justify-content: space-between">
            <div class="left-box">
              <span class="label-span">{{ $t('line') }}:</span>
              <div class="left-value">
                <PickLinesModules :disabled="unitPriceStatus" @openPickLinesModal="openPickLinesModal(item)" v-model="item.addrList" />
              </div>
            </div>
            <div v-if="!unitPriceStatus">
              <Button class="b-dger" @click="hanldeDelete('tobeUseraddrFormItem', indexs, item)">{{ $t('delete') }}</Button>
              <Button @click="handleAddconfiguration(item)" class="ml-10 b-blue"><Icon type="md-copy" /></Button>
            </div>
          </div>
          <TablePriceList v-model="item.priceList" :disabled="unitPriceStatus" @refreshData="handlegetTargetAndPriceChn" />
        </div>
      </TabPane>
    </Tabs>
    <DevicePickerModal
      :title="$t('configurationObject')"
      :maxSelectNum="maxSelectNum"
      :level="2"
      v-model="showPickLineModal"
      @on-ok="onModifyParentConfirm"
      :conditions="{ lineType: 'EXCEPT_IO' }"
      @on-cancel="showPickLineModal = false"
      :disabledIds="disabledIdListFilter"
      :initialSelectedIds="initialSelectedIds" />
  </div>
</template>

<script>
  import PickLinesModules from './PickLinesModules.vue'
  import TablePriceList from './TablePriceList.vue'
  import UseCommonMixin from './UseCommonMixin'
  import { getTargetAndPriceChn, getMacChnList4Select } from '@/api/public'
  import { cloneDeep } from 'lodash'
  export default {
    mixins: [UseCommonMixin],
    components: { PickLinesModules, TablePriceList },
    data() {
      return {
        showPickLineModal: false,
        disabledIds: [],
        initialSelectedIds: [],
        addrFormItem: [],
        tobeUseraddrFormItem: [],
        tabsType: 'current',
        queryBoxAddr: [],
        disabledIdListFilter: [],
        maxSelectNum: 1000,
      }
    },
    methods: {
      handleAddFormItem() {
        if (this.isCurrUse) {
          let length = this.addrFormItem.length
          this.addrFormItem.unshift({
            id: '',
            deleteTarget: false,
            addrList: [],
            index: length,
            priceList: [{ id: '', disabled1: false, disabled2: true, pwrLevelFrom: '0', pwrLevelTo: '+∞', topPeakPrice: '', peakPrice: '', flatPrice: '', valleyPrice: '', configPowerCycle: this.$store.state.configPowerCycle }],
          })
        } else {
          let length = this.tobeUseraddrFormItem.length
          this.tobeUseraddrFormItem.unshift({
            id: '',
            deleteTarget: false,
            addrList: [],
            index: length,
            priceList: [{ id: '', disabled1: false, disabled2: true, pwrLevelFrom: '0', pwrLevelTo: '+∞', topPeakPrice: '', peakPrice: '', flatPrice: '', valleyPrice: '', configPowerCycle: this.$store.state.configPowerCycle }],
          })
        }
      },
      async handlegetTargetAndPriceChn() {
        const params = { projectCode: this.$store.state.projectCode, isCurrUse: this.isCurrUse, priceType: '1' }
        const res = await getTargetAndPriceChn(params)
        this.addrFormItem = []
        this.tobeUseraddrFormItem = []
        this.validStartTime = ''
        if (res.success) {
          this.validStartTime = res.data[0] && res.data[0].validStartTime ? res.data[0].validStartTime : ''
          if (this.isCurrUse) {
            this.addrFormItem = res.data.map((val, index) => {
              let priceList = val.priceList.map(item => ({
                ...item,
                pwrLevelTo: item.pwrLevelTo === 2147483647 ? '+∞' : item.pwrLevelTo,
                configPowerCycle: this.$store.state.configPowerCycle,
                disabled1: false,
                disabled2: item.pwrLevelTo === 2147483647,
              }))
              let addrList =
                val.targetInfoVoList &&
                val.targetInfoVoList.map(it => ({
                  id: `${it.resId}-${it.addr}`,
                  resId: it.resId,
                  addr: it.addr,
                  addrName: it.addrName,
                  macName: it.boxName,
                }))
              return { id: '', deleteTarget: true, targetInfoVoList: val.targetInfoVoList, index: index, addrList, priceList }
            })
          } else {
            this.tobeUseraddrFormItem = res.data.map((val, index) => {
              let priceList = val.priceList.map(item => ({
                ...item,
                pwrLevelTo: item.pwrLevelTo === 2147483647 ? '+∞' : item.pwrLevelTo,
                configPowerCycle: this.$store.state.configPowerCycle,
                disabled1: false,
                disabled2: item.pwrLevelTo === 2147483647,
              }))
              let addrList =
                val.targetInfoVoList &&
                val.targetInfoVoList.map(it => ({
                  id: `${it.resId}-${it.addr}`,
                  resId: it.resId,
                  addr: it.addr,
                  addrName: it.addrName,
                  macName: it.boxName,
                }))
              return { id: '', targetInfoVoList: val.targetInfoVoList, deleteTarget: true, addrList, priceList }
            })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleTabstype(val) {
        this.tabsType = val
        this.$nextTick(() => {
          this.handlegetTargetAndPriceChn()
        })
      },
      openPickLinesModal(item) {
        this.initialSelectedIds = item.addrList.map(it => it.id)
        this.disabledIdListFilter = this.disabledIdList.filter(it => !this.initialSelectedIds.includes(it))
        this.$nextTick(() => {
          this.EditAddrFormItem = item
          this.showPickLineModal = true
        })
      },
      onModifyParentConfirm(e) {
        if (e.length > this.maxSelectNum) return this.$Message.error(this.$t('selectedObjectMaxLengthTip', { num: this.maxSelectNum }))
        let addrList = cloneDeep(this.EditAddrFormItem.addrList)
        this.EditAddrFormItem.addrList = e.map(it => {
          let obj = { id: it.id }
          if (!it.data) {
            let info = addrList.find(item => item.id === it.id)
            obj = { ...info }
          } else {
            obj = { ...obj, resId: it.data && it.data.resId, addr: it.data && it.data.addr, addrName: it.data && it.data.title, macName: it.data && it.data.parent.name }
          }
          return obj
        })
        this.showPickLineModal = false
      },
      hanldeDelete(type, index, row) {
        if (row.deleteTarget) {
          this.hanldeleteTarget(row, 'line', this.handlegetTargetAndPriceChn)
        } else {
          this[type].splice(index, 1)
        }
      },
      handleAddconfiguration(item) {
        if (this.isCurrUse) {
          const length = this.addrFormItem.length + 1
          this.addrFormItem.push({
            index: length,
            addrList: cloneDeep(item.addrList),
            priceList: item.priceList.map(val => ({
              disabled1: val.disabled1,
              disabled2: val.disabled2,
              pwrLevelFrom: val.pwrLevelFrom,
              pwrLevelTo: val.pwrLevelTo,
              topPeakPrice: val.topPeakPrice,
              peakPrice: val.peakPrice,
              flatPrice: val.flatPrice,
              valleyPrice: val.valleyPrice,
              del: val.del,
              id: '',
              configPowerCycle: this.$store.state.configPowerCycle,
            })),
          })
        } else {
          let length = this.tobeUseraddrFormItem.length + 1
          this.tobeUseraddrFormItem.push({
            index: length,
            addrList: cloneDeep(item.addrList),
            priceList: item.priceList.map(val => ({
              disabled1: val.disabled1,
              disabled2: val.disabled2,
              pwrLevelFrom: val.pwrLevelFrom,
              pwrLevelTo: val.pwrLevelTo,
              topPeakPrice: val.topPeakPrice,
              peakPrice: val.peakPrice,
              flatPrice: val.flatPrice,
              valleyPrice: val.valleyPrice,
              del: val.del,
              id: '',
              configPowerCycle: this.$store.state.configPowerCycle,
            })),
          })
        }
      },
      async handlePageQueryAddr() {
        let params = { projectCode: this.$store.state.projectCode, pageSize: '1000', pageNo: '1', onlineStatus: '', mac: '', equipmentTypes: '1,2,19', location: '', nodeIds: '' }
        const res = await getMacChnList4Select(params)
        this.disabledIds = []
        res.data.forEach(val => {
          if (val.addrs.length !== 0) {
            val.addrs.forEach(addVal => {
              if (!addVal.canSelect) {
                this.disabledIds.push(`${addVal.resId}-${addVal.addr}`)
              }
            })
          }
        })
      },
      // 校验线路只能出现一次
      checkAddrOnlyOne() {
        let list = []
        this.formItemDatas.forEach(it => {
          list = list.concat(it.addrList.map(v => `${v.resId}-${v.addr}`))
        })
        return this.findMostFrequentCount(list)
      },
      async saveData(cb) {
        if (this.formItemDatas.length === 0) return this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip1') })
        cb && cb()
        if (!this.returnTimeValidity()) return
        if (!this.formItemDatas.every(it => it.addrList.length > 0)) return this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip5') })
        if (this.checkAddrOnlyOne() > 1) return this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip3') })
        if (!this.formItemDatas.every(it => it.priceList.length > 0)) return this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip6') })
        this.postIndex = 0
        for (let index = 0; index < this.formItemDatas.length; index++) {
          let { addrList, priceList } = this.formItemDatas[index]
          let params = {
            projectCode: this.$store.state.projectCode,
            isCurrUse: this.isCurrUse,
            priceType: '1',
            targetInfoStr: JSON.stringify(addrList.map(it => ({ resId: it.resId, addr: it.addr }))),
            priceListStr: JSON.stringify(
              priceList.map(val => {
                let obj = {
                  pwrLevelFrom: `${val.pwrLevelFrom}`,
                  pwrLevelTo: val.pwrLevelTo === '+∞' ? '2147483647' : val.pwrLevelTo,
                  peakPrice: val.peakPrice || '',
                  flatPrice: val.flatPrice || '',
                  valleyPrice: val.valleyPrice || '',
                  topPeakPrice: val.topPeakPrice || '',
                }
                const hasPointed = this.$store.state.configPowerCycle.topTimeValue.length > 0
                const hasPeak = this.$store.state.configPowerCycle.timeValue.length > 0
                const hasFlat = this.$store.state.configPowerCycle.centerTimeValue.length > 0
                const hasValley = this.$store.state.configPowerCycle.bottomTimeValue.length > 0
                if (!hasPointed) delete obj.topPeakPrice
                if (!hasPeak) delete obj.peakPrice
                if (!hasFlat) delete obj.flatPrice
                if (!hasValley) delete obj.valleyPrice
                return obj
              })
            ),
          }
          if (!this.isCurrUse) params.validStartTime = this.newDate(this.validStartTime)
          await this.batchConfigTargetAndPrice(params)
          if (this.postIndex >= this.formItemDatas.length) {
            this.$emit('saveState', true)
          }
        }
      },
    },
    created() {
      this.handlePageQueryAddr()
    },
    mounted() {
      this.handlegetTargetAndPriceChn()
    },
    computed: {
      formItemDatas() {
        if (this.tabsType === 'current') return this.addrFormItem
        return this.tobeUseraddrFormItem
      },
      disabledIdList() {
        let list = this.disabledIds
        if (this.tabsType === 'current') {
          this.addrFormItem.forEach(it => {
            list = list.concat(it.addrList.map(v => `${v.resId}-${v.addr}`))
          })
        } else {
          this.tobeUseraddrFormItem.forEach(it => {
            list = list.concat(it.addrList.map(v => `${v.resId}-${v.addr}`))
          })
        }
        return [...new Set(list)]
      },
    },
  }
</script>
