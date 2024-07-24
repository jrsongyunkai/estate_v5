<template>
  <div v-if="isOverLoad">
    <EnablingView v-if="isNeedAuth" @ActivationStatus="getConfigValue" />
    <div v-else class="control-box">
      <div class="header">
        <div class="left"></div>
        <div class="right">
          <Button type="primary" @click.stop="queryData" v-if="!addModalFlag" ghost><Icon custom="icon-v5 icon-v5-refresh"></Icon></Button>
          <Button type="primary" class="ml-10" ghost @click.stop="showAddSetting" v-if="!addModalFlag">{{ $t('modeAddition') }}</Button>
        </div>
      </div>
      <div class="table-box" v-show="!addModalFlag">
        <Table :columns="columns" :data="tableData.list">
          <template #status="{ row }">
            <span class="status open" v-if="row.status === 0">{{ $t('enabled') }}</span>
            <span class="status" v-else>{{ $t('disabled') }}</span>
          </template>
          <template #operate="{ row }">
            <Button @click="editItem(row)" type="text">{{ $t('edit') }}</Button>
            <Button @click="switchItem(row)" type="text">{{ $t('stopOrStart') }}</Button>
            <Button @click="delItem(row)" type="text" class="del-btn">{{ $t('delete') }}</Button>
          </template>
        </Table>
        <Page show-total :current="tableData.pageNum" @on-change="changePage" @on-page-size-change="changePageSize" :total="tableData.total" show-elevator />
      </div>
      <mode-form v-if="addModalFlag" :action="modeFormAction" :editId="editId"></mode-form>
    </div>
  </div>
</template>
<script>
  import EnablingView from '@/components/energyModule/EnablingView.vue'
  import enablingEnergy from '@/mixins/enablingEnergy'
  import modeForm from './modeForm.vue'
  import { modeMatchRuleList, changeStatus, deleteModeMatch } from '@/api/energySaving/index'

  export default {
    name: 'energySaving-modeConfig',
    components: { modeForm, EnablingView },
    mixins: [enablingEnergy],
    data() {
      return {
        tableData: { list: [], pageSize: 10, pageNum: 1, total: 0 },
        columns: [
          { title: this.$t('index'), type: 'index', width: 80, align: 'center' },
          { title: this.$t('schemaName'), key: 'name', align: 'center' },
          { title: this.$t('state'), slot: 'status', align: 'center' },
          { title: this.$t('remark'), key: 'remark', align: 'center' },
          { title: this.$t('operation'), slot: 'operate', align: 'center' },
        ],
        addModalFlag: false,
        modeFormAction: 'add',
        editId: '',
      }
    },
    methods: {
      changePage(e) {
        this.tableData.pageNum = e
        this.queryData()
      },
      changePageSize(e) {
        this.tableData.pageNum = 1
        this.tableData.pageSize = e
        this.queryData()
      },
      async queryData() {
        let res = await modeMatchRuleList({
          projectCode: this.$store.state.projectCode,
          pageNo: this.tableData.pageNum,
          pageSize: this.tableData.pageSize,
        })
        if (res.success) {
          this.tableData.list = res.datas
          this.tableData.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      editItem(row) {
        this.editId = row.id
        this.modeFormAction = 'edit'
        this.addModalFlag = true
      },
      switchItem(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('switchModeConfigurationStatusTip'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            let res = await changeStatus({ id: row.id, status: row.status === 0 ? 1 : 0 })
            if (res.success) {
              this.$Message.success({ content: res.message })
              this.queryData()
            } else {
              this.$Message.error({ content: res.message })
            }
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
      },
      delItem(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('deleteConfirmTip'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            let res = await deleteModeMatch({ id: row.id })
            if (res.success) {
              this.queryData()
            } else {
              this.$Message.error({ content: res.message })
            }
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('canceled') })
          },
        })
      },
      showAddSetting() {
        this.editId = ''
        this.modeFormAction = 'add'
        this.addModalFlag = true
      },
    },
    mounted() {
      this.queryData()
    },
  }
</script>
<style lang="less" scoped>
  .control-box {
    background: #1a202e;
    padding: 20px;
    border-radius: 5px;
    .header {
      font-size: 16px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
    }
    .table-box {
      padding-top: 10px;
      .del-btn {
        color: #992d2a;
      }
      .status {
        padding: 5px;
        background: #992d2a30;
        color: #992d2a;
      }
      .status.open {
        background: #2e992a30;
        color: #2e992a;
      }
    }
  }
</style>
