<template>
  <div class="rule-config-box">
    <div class="header">
      <div class="left">{{ $t('ruleList') }}</div>
      <div class="right">
        <Button style="margin-right: 10px" class="pointer detailsBtn" custom-icon="icon-v5 icon-v5-refresh" type="primary" @click.stop="queryData" ghost></Button>
        <Button class="b-blue" @click.stop="$emit('toAddRule')">{{ $t('createRules') }}</Button>
      </div>
    </div>
    <div class="table-box">
      <Table :columns="columns" :data="tableData.list">
        <template #index="{ index }">{{ index + 1 }}</template>
        <template #objectSlot="{ row }">{{ $t('deviceNumAndLinesNum', { num1: row.deviceCount, num2: row.deviceAddrCount }) }}</template>
        <template #bizSceneName="{ row }">{{ typeList[+row.bizSceneType - 1] }}</template>
        <template #action="{ row }">
          <Button type="text" class="primary" ghost size="small" @click.stop="$emit('toAddRule', row)">{{ $t('edit') }}</Button>
          <Button type="text" class="error" ghost size="small" @click.stop="deleteRule(row)">{{ $t('delete') }}</Button>
        </template>
      </Table>
      <Page class="page" :total="tableData.total" :page-size="tableData.pageSize" show-total @on-change="changePage" :current="tableData.current" show-elevator />
    </div>
  </div>
</template>

<script>
  import { queryRulePage, deleteRule } from '@/api/energySaving/index'
  import { energyTypeMap } from '@/untils/configuration'
  export default {
    data() {
      return {
        columns: [
          { title: this.$t('index'), key: '', slot: 'index', align: 'center' },
          { title: this.$t('energyConsumptionType'), key: 'bizSceneType', slot: 'bizSceneName', align: 'center' },
          { title: this.$t('ruleObject'), slot: 'objectSlot', align: 'center' },
          { title: this.$t('createdTime'), key: 'createTime', align: 'center' },
          { title: this.$t('operation'), align: 'center', slot: 'action' },
        ],
        typeList: energyTypeMap.map(it => it.label),
        tableData: { list: [], current: 1, pageSize: 10, total: 0 },
      }
    },
    methods: {
      changePage(e) {
        this.tableData.current = e
        this.queryData()
      },
      async queryData() {
        const params = {
          projectCode: this.$store.state.projectCode,
          bizScene: '',
          bizSceneType: '',
          pageNo: this.tableData.current,
          pageSize: this.tableData.pageSize,
        }
        const res = await queryRulePage(params)
        if (res.success) {
          this.tableData.list = res.datas
          this.tableData.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      deleteRule(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('deleteConfirmTip'),
          onOk: async () => {
            const res = await deleteRule({ id: row.id })
            if (res.success) {
              this.$Message.success({ content: res.message })
              this.queryData()
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
    },
    mounted() {
      this.queryData()
    },
  }
</script>
<style lang="less" scoped>
  .rule-config-box {
    padding: 15px;
    background: #1a202e;
    border-radius: 4px;
    margin-top: 10px;
    .header {
      display: flex;
      justify-content: space-between;
      height: 40px;
      .left {
        text-align: left;
        font-size: 14px;
      }
      .right {
        display: flex;
        flex: 1;
        justify-content: flex-end;
      }
    }
    .table-box {
      padding: 10px 0px;
      .primary {
        color: #007eff;
      }
      .error {
        color: #ed4014;
      }
    }
  }
</style>
