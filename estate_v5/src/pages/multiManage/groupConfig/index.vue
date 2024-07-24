<template>
  <div class="group-management">
    <div v-if="groupFlag" class="group-card">
      <div class="header-groupConfig">
        <h3>{{ $t('groupedList') }}</h3>
        <Button type="primary" @click.stop="goNewGroup">{{ $t('add1') }}</Button>
      </div>
      <Table ref="selection" style="margin-top: 10px" :columns="columns" :data="tableData.list">
        <template slot-scope="{ row, index }" slot="switch">
          <Switch @on-change="handleChangeState(row, index)" :value="row.status ? true : false">
            <span slot="open">{{ $t('open1') }}</span>
            <span slot="close">{{ $t('close1') }}</span>
          </Switch>
        </template>
        <template slot-scope="{ row }" slot="action">
          <div>
            <Button class="text-btn-primary" type="text" size="small" @click="goEditGroup(row)">{{ $t('edit') }}</Button>
            <Button class="text-btn-primary" type="text" size="small" @click="groupManage(row)">{{ $t('groupManage') }}</Button>
            <Poptip confirm :title="`${$t('confirmTodelete')}?`" transfer placement="left" :ok-text="$t('delete')" :cancel-text="$t('cancel')" @on-ok="deleteGroup(row)">
              <Button class="text-btn-error" type="text" size="small">{{ $t('delete') }}</Button>
            </Poptip>
          </div>
        </template>
      </Table>
      <Page :total="tableData.total" :page-size="tableData.pageSize" @on-change="changePageNo" :current="tableData.pageNo" show-total show-elevator />
    </div>
    <GroupManageView v-else :groupId="saveGroupId" :groupName="groupName" @close="groupFlag = true"></GroupManageView>
    <component :is="modalName" :record="record" :callback="callbackAction" @close="modalName = null" />
  </div>
</template>
<script>
  import { listBoxGroups, delBoxGroup, saveBoxGroup } from '@/api/public'
  import GroupInfoDataModal from './modals/GroupInfoDataModal.vue'
  import GroupManageView from './subPages/GroupManageView.vue'
  export default {
    name: 'multiManage-groupConfig',
    components: { GroupInfoDataModal, GroupManageView },
    data() {
      return {
        modalName: null,
        record: null,
        callbackAction: null,
        saveGroupId: '',
        groupName: '',
        groupFlag: true,
        columns: [
          { title: this.$t('index'), type: 'index' },
          { title: this.$t('groupType'), key: 'type' },
          { title: this.$t('groupDescription'), key: 'description' },
          { title: this.$t('state'), slot: 'switch' },
          { title: this.$t('createdTime'), key: 'createTime', sortable: true },
          { title: this.$t('operation'), align: 'center', width: 240, slot: 'action', fixed: 'right' },
        ],
        tableData: { list: [], pageNo: 1, pageSize: 10, total: 0 },
      }
    },
    methods: {
      async init() {
        const res = await listBoxGroups({
          projectCode: this.$store.state.projectCode,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
        })
        if (res.success) {
          this.tableData.list = res.datas
          this.tableData.total = res.total
        } else {
          this.$Message.error(res.message)
        }
      },
      goNewGroup() {
        this.modalName = 'GroupInfoDataModal'
        this.record = { title: this.$t('addListData'), rowInfo: null }
        this.callbackAction = this.init
      },
      goEditGroup(row) {
        this.modalName = 'GroupInfoDataModal'
        this.record = { title: this.$t('editGroupData'), rowInfo: row }
        this.callbackAction = this.init
      },
      async deleteGroup(row) {
        const res = await delBoxGroup({ groupId: row.id })
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.init()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleChangeState(row) {
        let params = { projectCode: this.$store.state.projectCode, type: row.type, description: row.description, id: row.id, status: row.status === 0 ? 1 : 0 }
        const res = await saveBoxGroup(params)
        if (res.success) {
          this.init()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changePageNo(e) {
        this.tableData.pageNo = e
        this.init()
      },
      groupManage(row) {
        this.saveGroupId = row.id
        this.groupName = row.type
        this.groupFlag = false
      },
    },
    created() {
      this.init()
    },
  }
</script>
<style lang="less" scoped>
  .group-management {
    .group-card {
      background: #1a202e;
      padding: 15px;
      .header-groupConfig {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
    }
  }
</style>
