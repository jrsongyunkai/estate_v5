<template>
  <div class="obj-page">
    <div class="search">
      <div class="left">
        <LineCascader v-model="searchData.macAddr" />
        <Select class="ml-10" v-model="searchData.status" v-width="120" :transfer="true" :placeholder="$t('currentState')">
          <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select class="ml-10" v-model="searchData.feeStandardType" v-width="120" :transfer="true" :placeholder="$t('billingMode')">
          <Option v-for="item in feeStandardTypeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select class="ml-10" v-model="searchData.chargeType" v-width="120" :transfer="true" :placeholder="$t('billingType')">
          <Option v-for="item in chargeTypeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <DatePicker format="yyyy-MM-dd HH:mm:ss" :value="[searchData.startTime, searchData.endTime]" @on-change="handleTimer" transfer type="datetimerange" :placeholder="$t('addTimeRange')" v-width="320" class="ml-10"></DatePicker>
        <Button class="b-blue ml-10" @click="changePageNo(1)">{{ $t('query') }}</Button>
        <Button class="b-info ml-10" @click="reset">{{ $t('reset') }}</Button>
        <Button class="b-blue ml-10" @click="exportExcel">{{ $t('export') }}</Button>
      </div>
      <div class="right">
        <Button class="b-blue ml-10" @click="openModal('appletModal')">{{ $t('miniProgramConfiguration') }}</Button>
      </div>
    </div>
    <div class="content">
      <div class="header">
        <div>{{ $t('objectList') }}</div>
        <div>
          <Button class="b-blue ml-10" @click="exportQrCodes">{{ $t('batchExportOfQRCodes') }}</Button>
          <Button class="b-blue ml-10" @click="batchConfig">{{ $t('batchConfig') }}</Button>
          <Button class="b-blue ml-10" @click="openSubPage('addObjectForm', null, search)">{{ $t('addObject') }}</Button>
        </div>
      </div>
      <div class="table">
        <Table :columns="columns" ref="tableRef" :data="tableData.list" @on-selection-change="selectionChange" style="margin-top: 10px">
          <template #device="{ row }">{{ `${row.macName}（${row.mac}）` }}</template>
          <template #addr="{ row }">{{ `${row.addrName}（${row.mac}-${row.addr.toString().padStart(2, '0')}）` }}</template>
          <template #status="{ row }">
            <span v-if="row.status === 2" class="status error">{{ row.statusDesc }}</span>
            <span v-else-if="row.status === 1" class="status success">{{ row.statusDesc }}</span>
            <span v-else-if="row.status === 0" class="status disabled">{{ row.statusDesc }}</span>
            <span v-else-if="row.status === 3" class="status disabled">{{ row.statusDesc }}</span>
            <span v-else-if="row.status === 4" class="status warn">{{ row.statusDesc }}</span>
            <span v-else class="status disabled">{{ row.statusDesc }}</span>
          </template>
          <template #dailyAvgUsageRate="{ row }">{{ row.dailyAvgUsageRate }}%</template>
          <template #rtsSupervisorList="{ row }">
            <TagsAutoTableCell v-if="row.rtsSupervisorList.length" :tagList="row.rtsSupervisorList"></TagsAutoTableCell>
          </template>
          <template #userPayCode="{ row }">
            <QRCodeCell :text="createQrCodeText(row)" trigger="hover" isNeedBackColor>
              <div style="text-align: center">
                <div>{{ `${row.macName}（${row.mac}）` }}</div>
                <div>{{ `${row.addrName}（${row.mac}-${row.addr.toString().padStart(2, '0')}）` }}</div>
              </div>
            </QRCodeCell>
          </template>
          <template #action="{ row }">
            <Button type="text" size="small" class="text-btn-primary" @click="lookItem(row)">{{ $t('view') }}</Button>
            <Button type="text" size="small" class="text-btn-primary" :disabled="row.status === 2" @click="editItem(row)">{{ $t('edit') }}</Button>
            <Button type="text" size="small" class="text-btn-primary" @click="openSubPage('SettlementHistory', row)">{{ $t('settlementHistory') }}</Button>
            <Button type="text" size="small" class="text-btn-primary" :class="{ 'text-btn-error': row.status !== 0 }" :disabled="row.status === 2" @click="switchStatus(row)">
              {{ row.status !== 0 ? $t('forbidden') : $t('unban') }}
            </Button>
          </template>
        </Table>
        <div class="page-warp">
          <div class="tips">
            {{ $t('selectedNumValue', { num: selectData.length }) }}
            <el-button type="text" class="ml-10" @click.stop="clearSelectData" v-if="selectData.length">{{ $t('deselect') }}</el-button>
          </div>
          <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LineCascader from '@/pages/billingSystem/component/LineCascader.vue'
  import QRCodeCell from '@/pages/billingSystem/component/QRCodeCell.vue'
  import TagsAutoTableCell from '@/pages/billingSystem/component/TagsAutoTableCell.vue'
  import { queryTimeSettlementObjPage, updateStatusObj } from '@/api/billingSystem/instantSettlement'
  import tableMixins from './mixins/tableMixins.js'
  import { QrCode } from '@/untils/QrCode'
  import qs from 'qs'
  import { cloneDeep } from 'lodash'
  import { createQrCodeText } from '../common'
  export default {
    name: 'objListView',
    components: { LineCascader, QRCodeCell, TagsAutoTableCell },
    mixins: [tableMixins],
    data() {
      return {
        statusOptions: [
          { label: this.$t('whole'), value: '' },
          { label: this.$t('inUse'), value: '2' },
          { label: this.$t('freeTime'), value: '1' },
          { label: this.$t('inForbidden'), value: '0' },
          { label: this.$t('nodeOffline'), value: '3' },
          { label: this.$t('nodeRemoval'), value: '4' },
        ],
        chargeTypeOptions: [
          { label: this.$t('whole'), value: '' },
          { label: this.$t('byElectricityConsumption'), value: '1' },
          { label: this.$t('byTimelong'), value: '2' },
        ],
        feeStandardTypeOptions: [
          { label: this.$t('whole'), value: '' },
          { label: this.$t('useAccordingToQuantity'), value: '1' },
          { label: this.$t('useByPer'), value: '2' },
          { label: this.$t('useAccordingToPackage'), value: '3' },
        ],
        searchData: { macAddr: [], status: null, startTime: null, endTime: null, chargeType: null, feeStandardType: null },
        columns: [
          { type: 'selection', width: 60, align: 'center', fixed: 'left' },
          { title: this.$t('device'), minWidth: 250, slot: 'device', fixed: 'left' },
          { title: this.$t('line'), minWidth: 250, slot: 'addr', fixed: 'left' },
          { title: this.$t('currentState'), key: 'status', width: 110, slot: 'status' },
          { title: this.$t('addTime'), key: 'createTime', width: 180 },
          { title: this.$t('billingMode'), key: 'feeStandardTypeDesc', width: 180 },
          { title: this.$t('billingType'), key: 'chargeTypeDesc', width: 180 },
          { title: this.$t('totalUsageTime'), key: 'useDuration', width: 150 },
          { title: this.$t('dailyAverageUsageRate'), key: 'dailyAvgUsageRate', slot: 'dailyAvgUsageRate', width: 150 },
          { title: this.$t('totalConsumptionAmount'), key: 'orderAmount', width: 150 },
          { title: this.$t('supervisor'), slot: 'rtsSupervisorList', width: 250 },
          { title: this.$t('userPaymentCode'), width: 110, slot: 'userPayCode', align: 'center', fixed: 'right' },
          { title: this.$t('operation'), slot: 'action', fixed: 'right', align: 'center', width: 240 },
        ],
        selectData: [],
        dateRange: [],
      }
    },
    inject: ['openSubPage', 'openModal'],
    computed: {
      selectIds() {
        return this.selectData.map(item => item.id)
      },
      queryParams() {
        return {
          projectCode: this.$store.state.projectCode,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          resId: this.searchData.macAddr[0],
          addr: this.searchData.macAddr[1],
          startDate: this.searchData.startTime || undefined,
          endDate: this.searchData.endTime || undefined,
          status: this.searchData.status || undefined,
          chargeType: this.searchData.chargeType || undefined,
          feeStandardType: this.searchData.feeStandardType || undefined,
        }
      },
    },
    methods: {
      createQrCodeText: createQrCodeText,
      handleTimer(e) {
        this.searchData.startTime = e[0]
        this.searchData.endTime = e[1]
      },
      async search() {
        const res = await queryTimeSettlementObjPage(this.queryParams)
        if (res.success) {
          this.resultQueryParams = cloneDeep(this.queryParams)
          this.tableData.list =
            (res.data &&
              res.data.datas &&
              res.data.datas.map(it => ({
                ...it,
                _checked: this.selectIds.includes(it.id),
                rtsSupervisorList: it.rtsSupervisorList.map(it => ({ ...it, label: `${it.userName}(${it.phone})` })),
              }))) ||
            []
          this.tableData.total = res.data.total || 0
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      exportQrCodes() {
        if (this.selectData.length === 0) {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: this.$t('exportAllQRCodesTip'),
            onOk: () => {
              this.$Spin.show({
                render: h => {
                  return h('div', [h('Icon', { class: 'demo-spin-icon-load', props: { type: 'ios-loading', size: 18 } }), h('div', this.$t('exportQrCodeWaitingTip'))])
                },
              })
              setTimeout(() => {
                this.exportAllObjQr()
              }, 100)
            },
          })
        } else {
          this.$Spin.show({
            render: h => {
              return h('div', [h('Icon', { class: 'demo-spin-icon-load', props: { type: 'ios-loading', size: 18 } }), h('div', this.$t('exportQrCodeWaitingTip'))])
            },
          })
          setTimeout(() => {
            this.exportQrZip(this.selectData)
          }, 100)
        }
      },
      async exportAllObjQr() {
        const { data, success, message } = await queryTimeSettlementObjPage({ ...this.queryParams, pageSize: 9999999, pageNo: 1 })
        if (!success) return this.$Message.error({ content: message })
        if (data.datas && data.datas.length === 0) return this.$Message.error({ content: this.$t('exportQrCodeEmptyTip') })
        this.exportQrZip(data.datas)
      },
      async exportQrZip(list) {
        let imgInstances = list.map(async (row, i) => {
          let text = createQrCodeText(row)
          let infoDom = document.createElement('div')
          infoDom.style.textAlign = 'center'
          infoDom.style.width = '100%'
          infoDom.style.color = '#fff'
          infoDom.innerHTML = `<div>${row.macName}（${row.mac}）</div><div>${row.addrName}（${row.mac}-${row.addr.toString().padStart(2, '0')}）</div>`
          const canvas = await QrCode.createdCustomQrCodeCanvas(text, infoDom)
          let file = await QrCode.canvasToBlob(canvas)
          return { fileName: `${row.macName}(${row.mac})_${row.addrName}`, file }
        })
        QrCode.downloadZip(await Promise.all(imgInstances), this.$t('qRCode'))
        this.$Spin.hide()
      },
      selectionChange(rows) {
        let ids = rows.map(item => item.id)
        let pageIds = this.tableData.list.map(item => item.id)
        let filterIds = this.tableData.list.filter(it => !ids.includes(it.id)).map(it => it.id)
        let selectData = this.selectData.filter(it => !pageIds.includes(it.id))
        this.selectData = [...selectData, ...rows].filter(item => !filterIds.includes(item.id))
      },
      switchStatus(row) {
        if (row.status === 2) return this.$Message.error({ content: this.$t('unableForbiddenTip') })
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: row.status === 1 ? this.$t('forbiddenConfirmTip') : this.$t('sureToUnBan'),
          onOk: async () => {
            let params = { id: row.id, enable: row.status === 1 ? 0 : 1 }
            const res = await updateStatusObj(params)
            if (res.success) {
              this.$message.success(this.$t('actionSuccess'))
              this.search()
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      exportExcel() {
        let params = { ...this.resultQueryParams, pageNo: 1, pageSize: 9999999 }
        if (this.selectData.length > 0) {
          params.cfgIds = this.selectData.map(it => it.id).toString()
        }
        this.$func.windowCountDown(`${this.$func.ctxPaths()}/realTimeSettlement/exportOrderOverView.as?${qs.stringify(params)}`)
      },
      reset() {
        this.searchData = { macAddr: [], status: null, startTime: null, endTime: null }
        this.changePageNo(1)
      },
      clearSelectData() {
        this.selectData = []
        this.$refs.tableRef.selectAll(false)
      },
      batchConfigCallback() {
        this.clearSelectData()
        this.search()
      },
      batchConfig() {
        if (this.selectData.length === 0) return this.$Message.error({ content: this.$t('selectObjectNeedToConfiguredTip') })
        let hasStatus = this.selectData.some(item => item.status === 0 || item.status === 2)
        if (hasStatus) return this.$Message.error({ content: this.$t('unableEditObjectTip') })
        let isAllType1 = this.selectData.every(item => item.chargeType === 1)
        let isAllType2 = this.selectData.every(item => item.chargeType === 2)
        if (!(isAllType1 || isAllType2) && this.selectData.length > 1) return this.$Message.error({ content: this.$t('unbleBatchConfigurationTip') })
        this.openSubPage('BatchConfigForm', this.selectData, this.batchConfigCallback)
      },
      editItem(row) {
        this.openSubPage('BatchConfigForm', [row], this.batchConfigCallback)
      },
      lookItem(row) {
        this.openSubPage('ObjConfigInfo', [row], this.batchConfigCallback)
      },
    },
    mounted() {
      this.search()
    },
  }
</script>
<style lang="less" scoped>
  .obj-page {
    height: calc(~'100vh - 201px');
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .search {
      padding: 10px;
      background: var(--card-bg-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      border-radius: 4px;
      overflow: auto;
      .left {
        display: flex;
        flex: 1;
      }
    }
    .content {
      padding: 10px;
      background: var(--card-bg-color);
      border-radius: 4px;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .page-warp {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .tips {
          color: #007eff;
        }
      }
    }
  }
</style>
