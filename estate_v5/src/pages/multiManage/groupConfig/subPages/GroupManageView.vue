<template>
  <div class="group-manage-view">
    <div v-show="!subPageName">
      <BackTopTitle :title="$t('groupMgtTips', { groupName })" @close="$emit('close')"></BackTopTitle>
      <div class="group-manage-view-content">
        <div class="content-table">
          <Table :columns="columns" :data="nodeList" row-key="id">
            <template slot-scope="{ row, index }" slot="name">
              <Poptip placement="top" transfer>
                <div class="group-name">
                  <span>{{ row.name ? row.name : $t('addName') }}</span>
                  <Icon class="edit-icon" custom="icon-v5 icon-v5-xiugai"></Icon>
                </div>
                <div slot="content">
                  <div><Input v-model="row.name" @on-blur="addName(row.name, row, index)" /></div>
                </div>
              </Poptip>
            </template>
            <template slot-scope="{ row }" slot="periodElectricityConsumption">{{ row.periodElec || '-' }}</template>
            <template slot-scope="{ row }" slot="timeFeeMoney">{{ row.periodConsumptionAmount || '-' }}</template>
            <template slot-scope="{ row }" slot="periodClearingBalance">{{ row.periodSettlementBalance || '-' }}</template>
            <template slot-scope="{ row }" slot="deviceNum">
              <span class="num-value" @click="openBindObject(row, 'look')">{{ row.deviceNum }}</span>
            </template>
            <template slot-scope="{ row }" slot="addrNum">
              <span class="num-value" @click="openBindObject(row, 'look')">{{ row.addrNum }}</span>
            </template>
            <template slot-scope="{ row }" slot="loadNum">
              <span class="num-value" @click="openModal('LoadConfigModal', row, groupManage)">{{ row.loadNum }}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <div>
                <Button @click.stop="openModal('ElectricityMonitorModal', row)" :disabled="!row.id" class="text-btn-primary" type="text" size="small">{{ $t('electricityConsumptionAndFeeMonitoring') }}</Button>
                <Dropdown transfer trigger="click" @on-click="addGroupChildParent($event, row, index)">
                  <Button class="text-btn-primary" :disabled="!row.id" type="text" size="small">{{ $t('addGroup') }}</Button>
                  <DropdownMenu slot="list">
                    <DropdownItem :name="$t('addThisLevel')">{{ $t('addThisLevel') }}</DropdownItem>
                    <DropdownItem :name="$t('addSubordinates')">{{ $t('addSubordinates') }}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Button class="text-btn-primary" type="text" size="small" :disabled="!row.id" @click="openModal('AttributeManageModal', row)">{{ $t('attributeManagement') }}</Button>
                <Button class="text-btn-primary" type="text" size="small" :disabled="!row.id" @click.stop="openBindObject(row, 'edit')">{{ $t('bindObj') }}</Button>
                <Button class="text-btn-primary" type="text" size="small" :disabled="!row.id" @click="openModal('LoadConfigModal', row, groupManage)">{{ $t('add') + $t('load') }}</Button>
                <Button class="text-btn-primary" type="text" size="small" :disabled="!row.id" @click="openSubPage('OperationRecords', row)">{{ $t('operationRecords') }}</Button>
                <Poptip confirm transfer :title="$t('confirmDeleteGroup')" placement="left" :ok-text="$t('delete')" :cancel-text="$t('cancel')" @on-ok="delBoxGroupNodeList(row)">
                  <Button :disabled="!row.id" class="text-btn-error" type="text" size="small">{{ $t('deleteGroup') }}</Button>
                </Poptip>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <component :is="modalName" :record="record" :callback="callbackAction" @close="modalName = null" />
    <component :is="subPageName" :record="infoRecord" :callback="callAction" @close="subPageName = null" />
  </div>
</template>

<script>
  import noMarginTop from '@/mixins/noMarginTop'
  import BackTopTitle from '../component/BackTopTitle.vue'
  import OperationRecords from './OperationRecords.vue'
  import { queryBoxGroupTreeDetail, saveBoxGroupNode, delBoxGroupNode, listBoxGroupDevices } from '@/api/public'
  export default {
    props: {
      groupId: { type: Number, default: null },
      groupName: { type: String, default: '' },
    },
    components: {
      BackTopTitle,
      OperationRecords,
      ElectricityMonitorModal: () => import('../modals/ElectricityMonitorModal.vue'),
      AttributeManageModal: () => import('../modals/AttributeManageModal.vue'),
      LoadConfigModal: () => import('../modals/LoadConfigModal.vue'),
      BindObjectConfigModal: () => import('../modals/BindObjectConfigModal.vue'),
    },
    mixins: [noMarginTop],
    data() {
      return {
        consumptionAmountText: '',
        columns: [
          { title: this.$t('groupName'), slot: 'name', tree: true, minWidth: 300 },
          { title: this.$t('periodPower'), slot: 'periodElectricityConsumption', width: 140 },
          {
            title: '',
            slot: 'timeFeeMoney',
            width: 170,
            renderHeader: h => {
              return h('div', {}, [
                h('span', {}, window.$t('ns_billingDetails.label2')),
                h('Tooltip', { props: { placement: 'top', maxWidth: '300', transfer: true } }, [
                  h('Icon', { props: { color: '#007EFF', size: '16', type: 'ios-information-circle-outline' }, style: { marginLeft: '5px' } }),
                  h('div', { slot: 'content', style: { whiteSpace: 'normal' } }, this.consumptionAmountText),
                ]),
              ])
            },
          },
          { title: this.$t('timePeriodSettlementBalance'), slot: 'periodClearingBalance', width: 130 },
          { title: this.$t('numberOfBoundDevices'), slot: 'deviceNum', width: 130 },
          { title: this.$t('numberOfBoundLines'), slot: 'addrNum', width: 130 },
          { title: this.$t('numberOfBoundLoad'), slot: 'loadNum', width: 130 },
          { title: this.$t('operation'), slot: 'action', align: 'center', minWidth: 240, fixed: 'right' },
        ],
        modalName: null,
        record: null,
        callbackAction: null,
        nodeList: [],
        subPageName: '',
        callAction: null,
        infoRecord: null,
      }
    },
    provide() {
      return { openModal: this.openModal, openSubPage: this.openSubPage }
    },
    methods: {
      openModal(e, row, cb) {
        this.record = row
        this.callbackAction = cb
        this.modalName = e
      },
      openSubPage(e, row, cb) {
        this.subPageName = e
        this.infoRecord = row
        this.callAction = cb
      },
      async openBindObject(row, action) {
        this.$Spin.show({
          render: h => {
            return h('div', [h('Icon', { class: 'demo-spin-icon-load', props: { type: 'ios-loading', size: 18 } }), h('div', this.$t('dataLoading1'))])
          },
        })
        const res = await listBoxGroupDevices({ nodeId: row.id })
        if (res.success) {
          this.openModal('BindObjectConfigModal', { action, info: row, selectedDevices: res.data }, this.groupManage)
        } else {
          this.$Message.error({ content: res.message })
        }
        this.$Spin.hide()
      },
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj = { ...item, _showChildren: true }
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
      async groupManage() {
        let params = { projectCode: this.$store.state.projectCode, groupId: this.groupId }
        const res = await queryBoxGroupTreeDetail(params)
        if (res.success) {
          if (res.data && res.data.length > 0) {
            let newArr = res.data.map(item => ({ ...item, groupId: this.groupId, children: item.children ? item.children : [] }))
            this.nodeList = this.getTree(newArr)
            this.consumptionAmountText = res.data[0].periodDateRange ? this.$t('currentPeriodValue', { start: res.data[0].periodDateRange[0].substr(0, 10), end: res.data[0].periodDateRange[1].substr(0, 10) }) : this.$t('thereIsCurrentlyNoCycle')
          } else {
            this.nodeList = [{ addrNum: 0, children: [], deviceNum: 0, id: '', loadNum: 0, name: '', parentId: 0, groupId: this.groupId, _showChildren: true }]
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async addName(val, row) {
        if (!val) return this.$Message.error({ content: this.$t('pleaseAddName') })
        row.name = val
        let params = { groupId: this.groupId, parentId: row.parentId, name: val, id: row.id }
        const res = await saveBoxGroupNode(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('savedSuccessfully') })
          this.groupManage()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      addGroupChildParent(e, row, index) {
        if (row.id === '' || !row.name) return this.$Message.error({ content: this.$t('pleaseAddName') })
        if (e === this.$t('addThisLevel')) {
          this.handleChildEdit(row.parentId)
        } else if (e === this.$t('addSubordinates')) {
          this.handleChildEdit(row.id)
        }
      },
      async handleChildEdit(parentId) {
        let params = { groupId: this.groupId, parentId, name: this.$t('groupName') }
        const res = await saveBoxGroupNode(params)
        if (res.success) {
          this.groupManage()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async delBoxGroupNodeList(row) {
        if (!row.id) return this.$Message.error({ content: this.$t('keepAtLeastOne') })
        const res = await delBoxGroupNode({ nodeId: row.id })
        if (res.success) {
          this.$Message.success({ content: this.$t('deleteSuccessful') })
          this.groupManage()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    created() {
      this.groupManage()
    },
    mounted() {},
  }
</script>

<style lang="less" scoped>
  .group-manage-view {
    .group-manage-view-content {
      padding: 10px;
      max-height: calc(~'100vh - 168px');
      overflow: auto;
      .content-table {
        background: #1a202e;
        padding: 10px;
        /deep/.ivu-table-cell {
          display: flex;
          align-items: center;
          .group-name {
            margin-left: 5px;
            .edit-icon {
              margin-left: 5px;
              color: #2d8cf0;
              opacity: 0;
            }
            &:hover {
              .edit-icon {
                opacity: 1;
              }
            }
          }
          .num-value {
            cursor: pointer;
            color: #2d8cf0;
          }
        }
      }
    }
  }
</style>
