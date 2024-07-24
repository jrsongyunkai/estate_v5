<template>
  <div class="config-page">
    <div class="search">
      <div>
        <LineCascader v-model="searchData.macAddr" />
        <Select class="ml-10" v-model="searchData.supervisorId" style="width: 200px" :transfer="true" :placeholder="$t('supervisor')">
          <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button class="b-blue ml-10" @click.stop="changePageNo(1)">{{ $t('query') }}</Button>
        <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
      </div>
    </div>
    <div class="content">
      <div class="header">
        <div>{{ $t('configurationList') }}</div>
        <div>
          <Button class="b-blue ml-10" @click.stop="openSubPage('inspectUserList', null, getSupervisorOptions)">{{ $t('listOfSupervisors') }}</Button>
        </div>
      </div>
      <div class="table">
        <Table :columns="columns" :data="tableData.list" style="margin-top: 10px">
          <template #device="{ row }">{{ `${row.macName}（${row.mac}）` }}</template>
          <template #addr="{ row }">{{ `${row.addrName}（${row.mac}-${row.addr.toString().padStart(2, '0')}）` }}</template>
          <template #rtsSupervisorList="{ row }">
            <TagsAutoTableCell v-if="row.rtsSupervisorList.length" :tagList="row.rtsSupervisorList"></TagsAutoTableCell>
          </template>
          <template #action="{ row }">
            <Button type="text" size="small" class="text-btn-primary" @click.stop="showModel(row)">{{ $t('supervisorManagement') }}</Button>
          </template>
        </Table>
        <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
      </div>
    </div>
    <Modal v-model="isShowModel" :title="$t('supervisorManagement')" :width="600" @on-cancel="cancel">
      <Table v-if="userList.length" :columns="userColumns" :maxHeight="600" :data="userList" @on-selection-change="selectChange" style="margin-top: 10px"></Table>
      <div v-else class="empty-supervisor-tips">
        {{ $t('noSupervisorTip') }}
        <el-button type="text" @click.stop="gotoAddInspectUserList">{{ $t('pleaseAddSupervisor') }}</el-button>
      </div>
      <div slot="footer">
        <Button type="default" @click.stop="cancel">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click.stop="confirm">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import LineCascader from '../../component/LineCascader.vue'
  import tableMixins from './mixins/tableMixins.js'
  import { chnlSupervisorPage, prjSupervisorList, modifySupervisor } from '@/api/billingSystem/instantSettlement'
  import TagsAutoTableCell from '@/pages/billingSystem/component/TagsAutoTableCell.vue'
  export default {
    name: 'noticeConfigView',
    components: { LineCascader, TagsAutoTableCell },
    inject: ['openSubPage'],
    mixins: [tableMixins],
    data() {
      return {
        isShowModel: false,
        allSupervisorList: [],
        searchData: { supervisorId: '', macAddr: [] },
        options: [],
        columns: [
          { title: this.$t('device'), key: 'mac', slot: 'device', minWidth: 150 },
          { title: this.$t('line'), key: 'addr', slot: 'addr', minWidth: 200 },
          { title: this.$t('supervisor'), slot: 'rtsSupervisorList', minWidth: 300 },
          { title: this.$t('operation'), slot: 'action', fixed: 'right', align: 'center', minWidth: 120 },
        ],
        userColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: this.$t('fullName'), key: 'userName' },
          { title: this.$t('phone'), key: 'phone' },
          { title: this.$t('mailbox'), key: 'email' },
        ],
        userList: [],
        editRowInfo: null,
        selectedUsers: [],
      }
    },
    computed: {},
    methods: {
      async search() {
        let params = { pageNo: this.tableData.pageNo, pageSize: this.tableData.pageSize, resId: this.searchData.macAddr[0], addr: this.searchData.macAddr[1], supervisorId: this.searchData.supervisorId, projectCode: this.$store.state.projectCode }
        const res = await chnlSupervisorPage(params)
        if (res.success) {
          this.tableData.list =
            Array.isArray(res.data.datas) &&
            res.data.datas.map(item => ({
              ...item,
              rtsSupervisorList: item.rtsSupervisorList.map(it => ({ ...it, label: `${it.userName}(${it.phone})` })),
            }))
          this.tableData.total = res.data.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      gotoAddInspectUserList() {
        this.isShowModel = false
        this.openSubPage('inspectUserList', null, this.getSupervisorOptions)
      },
      reset() {
        this.searchData.macAddr = []
        this.searchData.supervisorId = ''
        this.changePageNo(1)
      },
      async getSupervisorOptions() {
        const res = await prjSupervisorList({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.options = Array.isArray(res.data) && res.data.map(item => ({ label: `${item.userName}(${item.phone})`, value: item.id }))
          this.allSupervisorList = Array.isArray(res.data) && res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      showModel(row) {
        let rtsSupervisorListIds = row.rtsSupervisorList.map(it => it.supervisorId)
        this.userList = this.allSupervisorList.map(it => ({ ...it, _checked: rtsSupervisorListIds.includes(it.id) }))
        this.selectedUsers = this.userList.filter(it => it._checked)
        this.isShowModel = true
        this.editRowInfo = row
      },
      selectChange(data) {
        this.selectedUsers = [...data]
      },
      async confirm() {
        let supervisorIdList = this.selectedUsers.map(it => it.id)
        let params = { cfgId: this.editRowInfo.id, supervisorIdList }
        const res = await modifySupervisor(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.search()
          this.cancel()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      cancel() {
        this.isShowModel = false
        this.editRowInfo = null
      },
    },
    mounted() {
      this.search()
    },
    created() {
      this.getSupervisorOptions()
    },
  }
</script>

<style lang="less" scoped>
  .config-page {
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
    }
  }
</style>
<style lang="less">
  .empty-supervisor-tips {
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
</style>
