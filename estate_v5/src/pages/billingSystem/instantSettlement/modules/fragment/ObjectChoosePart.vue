<template>
  <div class="object-pick bgColor">
    <div class="header">
      <div class="left">{{ $t('objectSelect') }}</div>
      <div>
        <Button class="b-blue ml-10" v-if="!disabled" @click.stop="openAddModal">{{ $t('addObject') }}</Button>
      </div>
    </div>
    <div>
      <Table :columns="macLineColumns" :data="tablePageData" border class="table-add-list">
        <template #deviceName="{ row }">{{ `${row.name}（${row.mac}）` }}</template>
        <template #lines="{ row }">
          <template v-if="row.configs && row.configs.length">
            <Tag v-for="(item, i) in row.configs" :key="i" :closable="!disabled" @on-close="deleteTagLine(i, row)">
              <span>{{ item.title }}</span>
            </Tag>
          </template>
          <template v-else>-</template>
        </template>
        <template #deviceAddress="{ row }">{{ row.location }}</template>
        <template slot-scope="{ row }" slot="action">
          <Button type="primary" style="margin-left: 5px" size="small" ghost @click="editTableItem(row)">{{ $t('edit') }}</Button>
          <Button type="error" class="b-warning" size="small" ghost @click="deleteTable(row)">{{ $t('delete') }}</Button>
        </template>
      </Table>
      <Page :page-size="pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="pageNo" :total="total" show-total show-sizer></Page>
      <div class="error-tip" v-if="!validateFlag">{{ $t('pleaseAddObjectTip') }}</div>
    </div>
    <DevicePickerModal
      ref="DevicePickerModal"
      :initialSelectedIds="initialSelectedIds"
      :disabledIds="disabledIds"
      :conditions="deviceParams"
      v-model="deviceChooseModel"
      :checkDisabled="checkDisabled"
      :level="2"
      @on-ok="deviceSelectConfirm"
      @on-cancel="deviceChooseModel = false"
      :showSearch="!editDeviceMac"
      :showPagination="!editDeviceMac"></DevicePickerModal>
  </div>
</template>

<script>
  import { uniqBy, cloneDeep, omit } from 'lodash'
  import { queryTimeSettlementObjPage } from '@/api/billingSystem/instantSettlement'
  export default {
    props: {
      value: { type: Array, default: () => [] },
      disabled: { type: Boolean, default: false },
    },
    data() {
      return {
        tableData: [],
        deviceChooseModel: false,
        editDeviceMac: '',
        deviceMap: new Map(),
        validateFlag: true,
        pageSize: 10,
        pageNo: 1,
        disabledIds: [],
      }
    },
    computed: {
      macLineColumns() {
        return this.disabled
          ? [
              { title: this.$t('deviceMessage'), slot: 'deviceName', minWidth: 90 },
              { title: this.$t('line'), slot: 'lines', minWidth: 200 },
              { title: this.$t('equipmentLocation'), slot: 'deviceAddress', minWidth: 130 },
            ]
          : [
              { title: this.$t('deviceMessage'), slot: 'deviceName', minWidth: 90 },
              { title: this.$t('line'), slot: 'lines', minWidth: 200 },
              { title: this.$t('equipmentLocation'), slot: 'deviceAddress', minWidth: 130 },
              { title: this.$t('operation'), slot: 'action', width: 160, align: 'center', fixed: 'right' },
            ]
      },
      deviceParams() {
        const params = { lineType: 'EXCEPT_IO' }
        if (this.editDeviceMac) {
          params.mac = this.editDeviceMac
        }
        return params
      },
      initialSelectedIds() {
        let list = []
        const uniqueMacList = uniqBy(this.tableData, 'mac')
        for (let device of uniqueMacList) {
          let addrs = device.configs
          const resId = device.resId
          if (addrs && addrs.length > 0) {
            for (let addrInfo of addrs) {
              list.push(`${resId}-${addrInfo.addr}`)
            }
          } else {
            list.push(`${resId}-`)
          }
        }
        return list
      },
      total() {
        return this.tableData.length
      },
      tablePageData() {
        return this.tableData.slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
      },
    },
    methods: {
      checkDisabled(data) {
        return data.isMonitorLine
      },
      changePageSize(e) {
        this.pageNo = 1
        this.pageSize = e
      },
      changePageNo(e) {
        this.pageNo = e
      },
      async openAddModal() {
        const { data } = await queryTimeSettlementObjPage({ projectCode: this.$store.state.projectCode, pageSize: 9999999, pageNo: 1 })
        this.disabledIds = data.datas && data.datas.map(it => `${it.resId}-${it.addr}`)
        this.editDeviceMac = ''
        this.deviceChooseModel = true
      },
      deviceSelectConfirm(data) {
        this.tableData = this.convertSelectList(data)
        this.deviceChooseModel = false
      },
      getDeviceInfoList(lowList) {
        let resIds = [...new Set(lowList.map(it => it.resId))]
        return resIds.map(resId => {
          const deviceInfo = cloneDeep(this.deviceMap.get(resId))
          let configs = [...new Set(lowList.filter(v => v.resId === resId && v.addr).map(v => ({ addr: +v.addr, title: v.title })))]
          return { ...deviceInfo, resId: +resId, configs }
        })
      },
      convertSelectList(data) {
        let lowList = data.map(it => {
          let spList = it.id.split('-')
          let macInfo, title
          let resId = spList[0]
          const info = cloneDeep(it.data)
          if (info) {
            macInfo = omit(info.parent, ['children', 'id'])
            title = info.title
          } else {
            macInfo = this.tableData.find(item => item.resId === Number(spList[0]))
            title = (macInfo && macInfo.configs.find(item => item.addr === Number(spList[1])).title) || ''
          }
          if (!this.deviceMap.has(resId)) {
            this.deviceMap.set(resId, macInfo)
          }
          return { resId, mac: macInfo.mac, addr: spList[1], title }
        })
        return this.getDeviceInfoList(lowList)
      },
      deleteTagLine(i, row) {
        let index = this.tableData.findIndex(item => item.resId === row.resId)
        this.tableData[index].configs.splice(i, 1)
        if (this.tableData[index].configs.length === 0) {
          this.tableData.splice(index, 1)
        }
      },
      deleteTable(row) {
        let index = this.tableData.findIndex(item => item.resId === row.resId)
        this.tableData.splice(index, 1)
      },
      editTableItem(row) {
        this.editDeviceMac = row.mac
        this.deviceChooseModel = true
      },
      validate() {
        this.validateFlag = this.tableData.length > 0
        return this.validateFlag
      },
    },
    watch: {
      tableData: {
        handler(val) {
          this.validateFlag = val && val.length > 0
          this.$emit('input', val)
        },
        deep: true,
      },
      tablePageData: {
        handler(val) {
          if (val.length === 0) {
            this.pageNo = Math.max(this.pageNo - 1, 1)
          }
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .object-pick {
    padding: 15px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .left {
        font-size: 16px;
      }
    }
    .error-tip {
      color: #ed4014;
      font-size: 14px;
      line-height: 30px;
    }
  }
</style>
