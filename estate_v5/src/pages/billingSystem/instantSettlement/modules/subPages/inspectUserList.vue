<template>
  <div class="user-list">
    <BackTopTitle :title="$t('listOfSupervisors')" @close="closePage"></BackTopTitle>
    <div class="config-view">
      <div class="search bgColor">
        <Input v-model="searchData.name" v-width="200" :placeholder="$t('enterSupervisorNameTip')" />
        <Input v-model="searchData.phone" class="ml-10" v-width="200" :placeholder="$t('enterSupervisorPhoneTip')" />
        <Button class="b-blue ml-10" @click="changePageNo(1)">{{ $t('query') }}</Button>
        <Button class="b-info ml-10" @click="reset">{{ $t('reset') }}</Button>
      </div>
      <div class="trend bgColor" style="margin-top: 10px">
        <div class="header">
          <div>{{ $t('listOfSupervisors') }}</div>
          <div>
            <Button class="b-blue ml-10" @click.stop="openModal('importInspectUserModal', null, search)">{{ $t('batchImport') }}</Button>
            <Button class="b-blue ml-10" @click.stop="openModal('addInspectUserModal', null, search)">{{ $t('add') }}</Button>
          </div>
        </div>
        <div class="table">
          <Table :columns="columns" :data="tableData.list" style="margin-top: 10px">
            <template #action="{ row }">
              <Button type="text" size="small" class="text-btn-primary" @click.stop="openModal('addInspectUserModal', row, search)">{{ $t('edit') }}</Button>
              <Button type="text" size="small" class="text-btn-error" @click.stop="deleteRow(row)">{{ $t('delete') }}</Button>
            </template>
          </Table>
          <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import noMarginTop from '@/mixins/noMarginTop'
  import BackTopTitle from '@/pages/billingSystem/component/BackTopTitle.vue'
  import LineCascader from '@/pages/billingSystem/component/LineCascader.vue'
  import tableMixins from '../mixins/tableMixins'
  import { querySupervisor, deleteSupervisor } from '@/api/billingSystem/instantSettlement'
  export default {
    props: {
      callback: { type: Function, default: () => {} },
    },
    components: { BackTopTitle, LineCascader },
    data() {
      return {
        searchData: { name: '', phone: '' },
        columns: [
          { title: this.$t('fullName'), key: 'userName', minWidth: 150 },
          { title: this.$t('contactNumber'), key: 'phone', minWidth: 150 },
          { title: this.$t('mailbox'), key: 'email', minWidth: 150 },
          { title: this.$t('operation'), slot: 'action', fixed: 'right', align: 'center', width: 150 },
        ],
      }
    },
    mixins: [noMarginTop, tableMixins],
    inject: ['openSubPage', 'openModal'],
    methods: {
      async search() {
        let params = {
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          projectCode: this.$store.state.projectCode,
          ...this.searchData,
        }
        const res = await querySupervisor(params)
        if (res.success) {
          this.tableData.list = res.data.datas
          this.tableData.total = res.data.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      reset() {
        this.searchData = { name: '', phone: '' }
        this.changePageNo(1)
      },
      deleteRow(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('deleteConfirmTip'),
          onOk: async () => {
            const res = await deleteSupervisor({ id: row.id })
            if (res.success) {
              this.$Message.success({ content: res.message })
              this.changePageNo(1)
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      closePage() {
        this.callback && this.callback()
        this.$emit('close')
      },
    },
    mounted() {
      this.changePageNo(1)
    },
  }
</script>
<style lang="less" scoped>
  .user-list {
    .config-view {
      height: calc(~'100vh - 185px');
      overflow: auto;
      margin-top: 10px;
      padding: 0 10px;
      scrollbar-width: none; // firefox
      &::-webkit-scrollbar {
        width: 0px;
        display: none;
      }
      .search {
        padding: 10px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        border-radius: 4px;
      }
      .trend {
        padding: 15px;
        .header {
          font-size: 16px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
      }
    }
    .bgColor {
      background: var(--card-bg-color);
    }
  }
</style>
