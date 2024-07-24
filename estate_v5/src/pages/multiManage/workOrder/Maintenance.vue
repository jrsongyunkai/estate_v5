<template>
  <div>
    <div v-if="showPage === 'table'">
      <div class="maintenance-head">
        <Input :placeholder="$t('enterWorkOrderNum')" v-model="queryParams.orderNum" clearable class="select-w150" />
        <Select clearable v-model="queryParams.create" filterable class="ml-10 w190" :placeholder="$t('createrPersonSelect')">
          <Option v-for="item in createList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select clearable v-model="queryParams.workStatus" class="select-w150" :placeholder="$t('pleaseSelectState')">
          <Option v-for="item in workStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select clearable v-model="queryParams.overdueStatus" class="select-w150" :placeholder="$t('selectOverdueStatus')">
          <Option v-for="item in allOverdueStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <DatePicker type="datetimerange" v-model="queryParams.timeRange" format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('selectDate')" class="time-picker" :editable="false" clearable></DatePicker>
        <Button @click="query" type="primary" class="btnb">{{ $t('query') }}</Button>
        <Button @click="reset" class="ml-10">{{ $t('reset') }}</Button>
      </div>
      <div class="maintenance-content">
        <div class="table-title">
          <h3>{{ $t('workOrderList') }}</h3>
          <div>
            <Tooltip :content="$t('export')">
              <Button @click="output" type="primary" ghost><Icon custom="icon-v5 icon-v5-daochu2" size="18" /></Button>
            </Tooltip>
            <Button type="primary" class="ml-10" @click="changePage('addOrder')">{{ $t('InitiateWorkOrder') }}</Button>
          </div>
        </div>
        <Table :data="tableData" :columns="tableColumns">
          <template #indexNum="{ index }">{{ (index + 1).toString().padStart(2, '0') }}</template>
          <template #orderNum="{ row }">
            <Badge dot v-if="!row.isRead">
              <span>{{ row.orderNumber }}</span>
            </Badge>
            <div v-else>{{ row.orderNumber }}</div>
          </template>
          <template #createPerson="{ row }">
            {{ `${row.creatorName}(${row.platformType === 2 ? row.creatorTel : row.creatorAccount})` }}
          </template>
          <template #content="{ row }">
            <div class="ellipsis-box" :title="row.content">{{ row.content }}</div>
          </template>
          <template #status="{ row }">
            <span :class="getColor[row.status]" class="default-box">{{ getStatus(row.status) }}</span>
          </template>
          <template #isOverdue="{ row }">
            <span v-if="row.isOverdue" class="default-box r-color-table">{{ $t('overdue1') }}</span>
            <span v-else class="default-box g-color-table">{{ $t('notOverdue') }}</span>
          </template>
          <template #finishTime="{ row }">
            {{ row.finishTime || '-' }}
          </template>
          <template #action="{ row }">
            <Button type="text" class="blue-color" @click="openViewOrder('viewOrder', row)">{{ $t('view') }}</Button>
            <Button v-if="isShowButton(row.handleTypeList, 2)" type="text" class="blue-color" @click="openModal(row, 2)">{{ $t('examine') }}</Button>
            <Button v-if="isShowButton(row.handleTypeList, 3)" type="text" class="blue-color" @click="openModal(row, 3)">{{ $t('handle') }}</Button>
            <Button v-if="isShowButton(row.handleTypeList, 4)" type="text" class="blue-color" @click="openModal(row, 4)">{{ $t('complete') }}</Button>
            <!--  -->
            <Button v-if="isShowButton(row.handleTypeList, 5)" type="text" class="blue-color" @click="openModal(row, 5)">{{ $t('checkAcceptance') }}</Button>
            <Button v-if="isShowButton(row.handleTypeList, 7)" type="text" class="red-color" @click="openModal(row, 7)">{{ $t('revoke') }}</Button>
          </template>
        </Table>
        <Page show-total :current="pageNo" @on-change="changeTablePage" :total="total" show-elevator />
      </div>
    </div>

    <ActionModal ref="actionModal" @saveCompleteModal="saveCompleteModal"></ActionModal>
  </div>
</template>

<script>
  import { getCreatorInfoList, getListMaintenanceNew, handleMaintenance } from '@/api/multiManage/workOrder'

  import { tableColumns } from './maintenanceOrder'
  import dayjs from 'dayjs'
  import ActionModal from './ActionModal.vue'
  import qs from 'qs'
  const defaultParams = () => ({
    orderNum: null,
    timeRange: [],
    create: null,
    workStatus: null,
    overdueStatus: null,
  })
  const workStatusList = [
    { value: -1, label: window.$t('allStatus') },
    { value: 0, label: window.$t('notProcessed') },
    { value: 1, label: window.$t('processing') },
    { value: 2, label: window.$t('processed') },
    { value: 3, label: window.$t('completed') },
    { value: 4, label: window.$t('revoked') },
    { value: 5, label: window.$t('rejected') },
  ]
  const getColor = {
    0: 'b-color-table',
    1: 'b-g-color-table',
    2: 'g-color-table',
    3: 'g-color-table',
    4: 'r-color-table',
    5: 'warn-color-table',
  }
  export default {
    components: {
      ActionModal,
    },
    data() {
      return {
        getColor,
        total: 0,
        pageNo: 1,
        showPage: 'table',
        queryParams: defaultParams(),
        createList: [],
        tableData: [],
        workStatusList,
        allOverdueStatusList: [
          { value: -1, label: this.$t('allOverdueStatus') },
          { value: 0, label: this.$t('notOverdue') },
          { value: 1, label: this.$t('overdue2') },
        ],
        tableColumns,
        initParams: null,
      }
    },
    async mounted() {
      await this.getStaffList()
      await this.init()
    },
    methods: {
      async init() {
        let platformType
        if (this.queryParams.create) {
          const platform = this.createList.find(v => v.value === this.queryParams.create)
          platformType = 0
          if (platform) {
            platformType = platform.isCloud ? 1 : 2
          }
        }
        this.initParams = {
          projectCode: this.$store.state.projectCode,
          orderNumber: this.queryParams.orderNum,
          platformType: platformType || 0, // 0 所有 1 云平台 2 小程序
          creatorId: this.queryParams.create,
          status: this.queryParams.workStatus,
          overdueStatus: this.queryParams.overdueStatus,
          createTimeFrom: this.queryParams.timeRange[0] && dayjs(this.queryParams.timeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
          createTimeTo: this.queryParams.timeRange[1] && dayjs(this.queryParams.timeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
        }
        const res = await getListMaintenanceNew({ ...this.initParams, pageNo: this.pageNo, pageSize: 10 })
        if (!res.success) return this.$Message.error(res.message)
        this.tableData = res.datas
        this.total = res.total
        this.$emit('changeUnReadTotal', res.unReadTotal)
      },
      changePage(val) {
        this.$emit('changeMaintenancePage', val)
      },
      openViewOrder(val, row) {
        this.$emit('openViewOrder', { ...row, page: val })
      },
      query() {
        this.pageNo = 1
        this.init()
      },
      changeTablePage(e) {
        this.pageNo = e
        this.init()
      },
      addDetailText(item) {
        if (this.completeForm.detail && this.completeForm.detail.includes(item.text)) return
        this.completeForm.detail = (this.completeForm.detail || '') + ' ' + item.text
      },
      openModal(row, type) {
        const typeConfig = {
          4: 'openCompleteModal',
          2: 'openReviewModal',
          5: 'openAcceptanceModal',
          7: 'openRevokeModal',
          3: 'openProcessModal',
        }
        this.$refs.actionModal[typeConfig[type]](row, type)
      },
      async saveCompleteModal(val) {
        const isTypeThree = val.type === 3
        let params = {
          id: val.id,
          projectCode: this.$store.state.projectCode,
          type: val.type, // 2-{{$t('examine')}},3-{{$t('handle')}},4-完成,5-验收,7-撤销
          content: val.detail,
          otherData: {
            status: val.status,
            beforeImgs: isTypeThree ? val.img[0].map(v => v.data).join(',') : '',
            afterImgs: isTypeThree ? val.img[1].map(v => v.data).join(',') : '',
            files: isTypeThree && val.img[2] ? val.img[2] : '',
            fileNames: isTypeThree && val.img[3] ? val.img[3] : '',
          },
        }
        const res = await handleMaintenance(params)
        if (!res.success) return this.$Message.error(res.message)
        this.$Message.success('操作成功')
        this.$refs.actionModal.closeModal(val.type)
        this.init()
      },
      isShowButton(val, type) {
        return !!val.find(v => v.type === type)
      },
      getStatus(type) {
        const findStatus = this.workStatusList.find(v => v.value === type)
        return findStatus ? findStatus.label : '-'
      },
      getOverdueStatus(type) {
        const label = this.allOverdueStatusList.find(v => v.value === type)
        return label ? label.label : ''
      },
      async getStaffList() {
        const res = await getCreatorInfoList({ projectCode: this.$store.state.projectCode })
        if (!res.success) return this.$Message.error(res.message)
        const createList = res.data.cloud_platform.map(v => ({ ...v, isCloud: true })).concat(res.data.mini_program.map(v => ({ ...v, isCloud: false })))
        this.createList = createList.map(v => ({ value: v.staffId, label: v.staffName, isCloud: v.isCloud }))
      },
      reset() {
        this.queryParams = defaultParams()
      },
      output() {
        if (this.tableData.length === 0) return this.$Message.error({ content: this.$t('exportedDataCannotEmpty') })
        this.$func.windowCountDown(`/maintenanceNew/exportList.as?${qs.stringify(this.initParams)}`)
      },
    },
  }
</script>

<style lang="less" scoped>
  .time-picker {
    width: 300px;
    margin-left: 10px;
  }
  .ellipsis-box {
    white-space: nowrap; /* 禁止换行 */
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 使用省略号代替超出部分 */
  }
  .ml-10 {
    margin-left: 10px;
  }
  .maintenance-head {
    background: #1a202e;
    margin: 10px;
    padding: 10px;

    .w190 {
      width: 190px;
    }
  }
  .maintenance-content {
    background: #1a202e;
    padding: 10px;
    margin: 0 10px;
    /deep/.ivu-table-cell {
      overflow: visible;
    }
  }

  .table-title {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }
  .select-w150 {
    width: 150px;
    margin-left: 10px;
  }
  .blue-color {
    color: #007eff;
  }
  .red-color {
    color: #f56c6c;
  }
  .b-color-table {
    color: #007eff;
    background: rgba(0, 126, 255, 0.1);
  }

  .b-g-color-table {
    color: aqua;
    background: #173642;
  }
  .g-color-table {
    color: #21f27f;
    background: rgba(33, 242, 127, 0.1);
  }
  .r-color-table {
    color: #f56c6c;
    background: rgba(255, 79, 79, 0.15);
  }
  .warn-color-table {
    background: #443630;
    color: #e6a23c;
  }
  .default-box {
    padding: 3px 5px;
  }
</style>
