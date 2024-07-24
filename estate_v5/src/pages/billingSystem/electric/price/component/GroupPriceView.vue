<template>
  <div>
    <Tabs value="current" name="subchild" @on-click="handleTabstype">
      <TabPane :label="$t('currentElectricityPrice')" name="current" tab="subchild">
        <Button @click="handleAddFormItem" class="addMacprice" v-if="!unitPriceStatus">{{ $t('addGroupElectricityPrices') }}</Button>
        <div v-for="(item, indexs) in groupFormItem" :key="indexs" class="addrFormItemContent">
          <div class="header" style="justify-content: space-between">
            <div class="left-box">
              <span class="label-span">{{ $t('group') }}:</span>
              <div class="left-value">
                <PickGroupModules v-model="item.groupList" @openPickGroupModal="openPickGroupModal(item)" :disabled="unitPriceStatus" />
              </div>
            </div>
            <div v-if="!unitPriceStatus">
              <Button class="b-dger" @click="hanldeDelete('groupFormItem', indexs, item)">{{ $t('delete') }}</Button>
              <Button @click="handleAddconfiguration(item, indexs)" class="ml-10 b-blue"><Icon type="md-copy" /></Button>
            </div>
          </div>
          <TablePriceList v-model="item.priceList" :disabled="unitPriceStatus" @refreshData="handlegetTargetAndPriceGrp" />
        </div>
      </TabPane>
      <TabPane :label="$t('electricityPriceToBeActivated')" name="activated" tab="subchild">
        <div class="header" style="justify-content: space-between">
          <div>
            <span>{{ $t('enablingTime') }}：</span>
            <span v-if="unitPriceStatus">{{ validStartTime }}</span>
            <DatePicker v-else :options="optionsTimer" v-model="validStartTime" transfer type="date" :placeholder="$t('pleaseSelect')" style="width: 200px" @on-change="handleactivationTime"></DatePicker>
          </div>
        </div>
        <Button @click="handleAddFormItem" class="addMacprice" v-if="!unitPriceStatus">{{ $t('addGroupElectricityPrices') }}</Button>
        <div v-for="(item, indexs) in tobeUsergourpFormItem" :key="indexs" class="addrFormItemContent">
          <div class="header" style="justify-content: space-between">
            <div class="left-box">
              <span class="label-span">{{ $t('group') }}:</span>
              <div class="left-value">
                <PickGroupModules v-model="item.groupList" @openPickGroupModal="openPickGroupModal(item)" :disabled="unitPriceStatus" />
              </div>
            </div>
            <div v-if="!unitPriceStatus">
              <Button class="b-dger" @click="hanldeDelete('tobeUsergourpFormItem', indexs, item)">{{ $t('delete') }}</Button>
              <Button @click="handleAddconfiguration(item, indexs)" class="ml-10 b-blue"><Icon type="md-copy" /></Button>
            </div>
          </div>
          <TablePriceList v-model="item.priceList" :disabled="unitPriceStatus" @refreshData="handlegetTargetAndPriceGrp" />
        </div>
      </TabPane>
    </Tabs>
    <GroupPickModal v-model="showGroupPick" :maxSelectNum="maxSelectNum" @on-cancel="showGroupPick = false" :disabledIds="disabledIds" :initialSelectedIds="initialSelectedIds" @on-ok="selectGroupList" />
  </div>
</template>

<script>
  import UseCommonMixin from './UseCommonMixin'
  import PickGroupModules from './PickGroupModules.vue'
  import TablePriceList from './TablePriceList.vue'
  import { getTargetAndPriceGrp } from '@/api/public'
  import { cloneDeep } from 'lodash'
  export default {
    mixins: [UseCommonMixin],
    components: {
      PickGroupModules,
      TablePriceList,
    },
    data() {
      return {
        groupFormItem: [],
        tobeUsergourpFormItem: [],
        showGroupPick: false,
        initialSelectedIds: [],
        editItemIndex: null,
        disabledIds: [],
        maxSelectNum: 1000,
      }
    },
    methods: {
      openPickGroupModal(item) {
        this.initialSelectedIds = item.groupList.map(it => it.nodeId)
        this.disabledIds = this.disabledGroupIds.filter(it => !this.initialSelectedIds.includes(it))
        this.$nextTick(() => {
          this.editItem = item
          this.showGroupPick = true
        })
      },
      selectGroupList(e) {
        if (e.length > this.maxSelectNum) return this.$Message.error(this.$t('selectedObjectMaxLengthTip', { num: this.maxSelectNum }))
        let groupList = cloneDeep(this.editItem.groupList)
        this.editItem.groupList = e.map(it => {
          let obj = { nodeId: it.id }
          if (it.data) {
            obj = { ...obj, nodeName: it.data && it.data.name, groupTypeId: it.data && it.data.parent.id, typeName: it.data && it.data.parent.type }
          } else {
            let info = groupList.find(item => item.nodeId === it.id)
            obj = { ...info }
          }
          return obj
        })
        this.showGroupPick = false
      },
      handleTabstype(val) {
        this.tabsType = val
        this.$nextTick(() => {
          this.handlegetTargetAndPriceGrp()
        })
      },
      handleAddFormItem() {
        if (this.isCurrUse) {
          let length = this.groupFormItem.length + 1
          this.groupFormItem.unshift({
            index: length,
            id: '',
            groupList: [],
            deleteTarget: false,
            priceList: [{ id: '', disabled1: false, disabled2: true, pwrLevelFrom: '0', pwrLevelTo: '+∞', topPeakPrice: '', peakPrice: '', flatPrice: '', valleyPrice: '', configPowerCycle: this.$store.state.configPowerCycle }],
          })
        } else {
          let length = this.tobeUsergourpFormItem.length
          this.tobeUsergourpFormItem.unshift({
            index: length,
            id: '',
            groupList: [],
            deleteTarget: false,
            priceList: [{ id: '', disabled1: false, disabled2: true, pwrLevelFrom: '0', pwrLevelTo: '+∞', topPeakPrice: '', peakPrice: '', flatPrice: '', valleyPrice: '', configPowerCycle: this.$store.state.configPowerCycle }],
          })
        }
      },
      hanldeDelete(type, index, row) {
        if (row.deleteTarget) {
          this.hanldeleteTarget(row, 'group', this.handlegetTargetAndPriceGrp)
        } else {
          this[type].splice(index, 1)
        }
      },
      async handlegetTargetAndPriceGrp() {
        let params = { projectCode: this.$store.state.projectCode, isCurrUse: this.isCurrUse, priceType: '1' }
        const res = await getTargetAndPriceGrp(params)
        if (res.success) {
          this.groupFormItem = []
          this.tobeUsergourpFormItem = []
          this.validStartTime = ''
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.validStartTime = res.data[0].validStartTime ? res.data[0].validStartTime : ''
          }
          if (this.isCurrUse) {
            this.groupFormItem = res.data.map((val, index) => {
              const priceList = val.priceList.map(item => ({
                ...item,
                pwrLevelTo: item.pwrLevelTo === 2147483647 ? '+∞' : item.pwrLevelTo,
                configPowerCycle: this.$store.state.configPowerCycle,
                disabled1: true,
                disabled2: item.pwrLevelTo === 2147483647,
              }))
              const groupList = val.targetInfoVoList.map(it => ({
                nodeId: it.nodeId,
                nodeName: it.nodeName,
                groupTypeId: it.groupId,
                typeName: it.groupName,
              }))
              return { id: '', index: index, groupList, targetInfoVoList: val.targetInfoVoList, deleteTarget: true, priceList }
            })
          } else {
            this.tobeUsergourpFormItem = res.data.map((val, index) => {
              let priceList = val.priceList.map(item => ({
                ...item,
                pwrLevelTo: item.pwrLevelTo === 2147483647 ? '+∞' : item.pwrLevelTo,
                configPowerCycle: this.$store.state.configPowerCycle,
                disabled1: true,
                disabled2: item.pwrLevelTo === 2147483647,
              }))
              let groupList = val.targetInfoVoList.map(it => ({
                nodeId: it.nodeId,
                nodeName: it.nodeName,
                groupTypeId: it.groupId,
                typeName: it.groupName,
              }))
              return { id: '', groupList, deleteTarget: true, targetInfoVoList: val.targetInfoVoList, index: index, priceList }
            })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleAddconfiguration(item, indexs) {
        if (this.isCurrUse) {
          let length = this.groupFormItem.length + 1
          this.groupFormItem.push({ index: length, id: item.id, groupList: cloneDeep(item.groupList), priceList: [] })
          item.priceList.map(val => {
            this.groupFormItem[length - 1].priceList.push({
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
            })
          })
        } else {
          let length = this.tobeUsergourpFormItem.length + 1
          this.tobeUsergourpFormItem.push({
            index: length,
            id: item.id,
            groupList: cloneDeep(item.groupList),
            priceList: [],
          })
          item.priceList.map(val => {
            this.tobeUsergourpFormItem[length - 1].priceList.push({
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
            })
          })
        }
      },
      // 校验分组只能出现一次
      checkAddrOnlyOne() {
        let list = []
        this.groupItemList.forEach(it => {
          list = list.concat(it.groupList.map(v => v.nodeId))
        })
        return this.findMostFrequentCount(list)
      },
      // 保存分组电量
      async saveData(cb) {
        if (this.groupItemList.length === 0) return this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip1') })
        cb && cb()
        if (!this.returnTimeValidity()) return
        if (!this.groupItemList.every(it => it.groupList.length > 0)) return this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip2') })
        if (this.checkAddrOnlyOne() > 1) return this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip3') })
        if (!this.groupItemList.every(it => it.priceList.length > 0)) return this.$Message.error({ content: this.$t('ns_electricityPriceConfig.tip4') })
        this.postIndex = 0
        for (let index = 0; index < this.groupItemList.length; index++) {
          let { groupList, priceList } = this.groupItemList[index]
          let params = {
            projectCode: this.$store.state.projectCode,
            isCurrUse: this.isCurrUse,
            priceType: '1',
            targetInfoStr: JSON.stringify(groupList.map(node => ({ nodeId: node.nodeId }))),
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
          if (this.postIndex >= this.groupItemList.length) {
            this.$emit('saveState', true)
          }
        }
      },
    },
    mounted() {
      this.handlegetTargetAndPriceGrp()
    },
    computed: {
      groupItemList() {
        if (this.tabsType === 'current') {
          return this.groupFormItem
        }
        return this.tobeUsergourpFormItem
      },
      disabledGroupIds() {
        let list = []
        if (this.tabsType === 'current') {
          this.groupFormItem.forEach(it => {
            list = list.concat(it.groupList.map(v => v.nodeId))
          })
        } else {
          this.tobeUsergourpFormItem.forEach(it => {
            list = list.concat(it.groupList.map(v => v.nodeId))
          })
        }
        return [...new Set(list)]
      },
    },
  }
</script>
