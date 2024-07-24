<template>
  <div>
    <div class="ds-flex between">
      <h3>{{ $t('alarmReciverMgt') }}</h3>
      <div>
        <Button type="primary" ghost @click="addRecipient">{{ $t('addReceiver') }}</Button>
      </div>
    </div>

    <div class="mart-20">
      <Table :columns="recipientColumns" :data="recipientData">
        <template #channels="{ row }">{{ noticeText(row) }}</template>
        <template #action="{ row }">
          <Button type="text" class="blue-c-button" @click="openEditModal(row)">{{ $t('edit') }}</Button>
          <Button type="text" class="red-c-button" @click="delTableData(row)">{{ $t('delete') }}</Button>
        </template>
      </Table>
      <Page style="margin-top: 20px" background show-elevator @on-change="handlePage" :current="pageNo" :page-size="pageSize" :total="total" show-total></Page>
    </div>
    <Modal v-model="recipientPeopleModal" :title="recipientTitle">
      <div>
        <div class="ds-flex mar-l-b-10">
          <div class="flex-1 text-right padding-t-5">{{ $t('receiverName') }}：</div>
          <div class="flex-3">
            <Input v-model="recipientModal.name" class="w150" :placeholder="$t('pleaseEnter')"></Input>
          </div>
        </div>
        <div class="ds-flex mar-l-b-10">
          <div class="flex-1 text-right padding-t-5">{{ $t('contactNumber') }}：</div>
          <div class="flex-3">
            <Input v-model="recipientModal.tel" class="w150" :placeholder="$t('pleaseEnter')"></Input>
          </div>
        </div>
        <div class="ds-flex mar-l-b-10">
          <div class="flex-1 text-right">{{ $t('phoneNotice') }}：</div>
          <div class="flex-3">
            <Switch v-model="recipientModal.isTel" />
          </div>
        </div>
        <div class="ds-flex mar-l-b-10">
          <div class="flex-1 text-right">{{ $t('msgNotice') }}：</div>
          <div class="flex-3">
            <Switch v-model="recipientModal.isMessage" />
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" @click="recipientPeopleModal = false">{{ $t('cancel') }}</Button>
        <Button type="primary" @click="saveRecipient">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { getPushObjectListPage, savePushObject, delPushObject } from '@api/setting/projectInfo.js'
  export default {
    data() {
      return {
        recipientPeopleModal: false,
        recipientModal: {
          name: '',
          tel: '',
          isTel: false,
          isMessage: false,
        },
        isEdit: null,

        recipientColumns: [
          { title: this.$t('index'), type: 'index' },
          { title: this.$t('reciverName'), key: 'name' },
          { title: this.$t('contactMethod'), key: 'address' },
          { title: this.$t('noticeMethod'), slot: 'channels' },
          { title: this.$t('createdTime'), key: 'createTime' },
          { title: this.$t('operation'), slot: 'action' },
        ],
        recipientData: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        rowData: null,
      }
    },
    computed: {
      recipientTitle() {
        const text = this.isEdit ? this.$t('edit') : this.$t('add')
        return `${text} ${this.$t('receiver')}`
      },
    },
    mounted() {
      this.initList()
    },
    methods: {
      async initList() {
        const res = await getPushObjectListPage({ pageNo: this.pageNo, pageSize: this.pageSize })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.recipientData = res.datas
        this.total = res.total
      },
      handlePage(e) {
        this.pageNo = e
        this.initList()
      },
      noticeText(row) {
        const testConfig = {
          3: this.$t('sms'),
          6: this.$t('phone'),
          '3,6': this.$t('smsPhone'),
          '6,3': this.$t('smsPhone'),
        }
        return testConfig[row.channels]
      },
      saveRecipient() {
        if (!this.recipientModal.name || !this.recipientModal.tel) {
          return this.$Message.error(this.$t('pleaseEnterReveiverNameAndPhoneNum'))
        }
        const channelsConfig = (a, b) => {
          if (!!a && !b) {
            return '6'
          }
          if (!!a && !!b) {
            return '3,6'
          }
          if (!a && !!b) {
            return '3'
          }
          if (!a && !b) {
            return ''
          }
        }
        const params = {
          name: this.recipientModal.name,
          address: this.recipientModal.tel,
          channels: channelsConfig(this.recipientModal.isTel, this.recipientModal.isMessage),
        }
        if (this.isEdit) {
          params.id = this.rowData.id
        }
        this.editSave(params)
      },
      async editSave(params) {
        const res = await savePushObject(params)
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.recipientPeopleModal = false
        this.$Message.success(res.message)
        this.initList()
      },
      openEditModal(row) {
        this.rowData = row
        this.recipientPeopleModal = true
        this.isEdit = true
        this.recipientModal = {
          name: row.name,
          tel: row.address,
          isTel: row.channels.includes('6'),
          isMessage: row.channels.includes('3'),
        }
      },
      addRecipient() {
        this.isEdit = false
        this.recipientPeopleModal = true
        this.recipientModal = {
          name: '',
          tel: '',
          isTel: false,
          isMessage: false,
        }
      },
      delTableData(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmDeleteThisConfig'),
          onOk: async () => {
            const res = await delPushObject({ id: row.id })
            if (!res.success) {
              return this.$Message.error(res.message)
            }
            this.$Message.success(this.$t('deleteSuccessful'))
            this.initList()
          },
          onCancel: () => {
            this.$Message.info({
              content: this.$t('cancelDelete'),
            })
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .blue-c-button {
    color: #007eff !important;
  }
  .red-c-button {
    color: #ff5b59 !important;
  }
  .mart-20 {
    margin-top: 20px;
  }
  .padding-t-5 {
    padding-top: 5px;
  }
  .between {
    justify-content: space-between;
  }
  .mar-l-b-10 {
    margin: 10px 0;
  }
  .w150 {
    width: 180px;
  }
  .text-right {
    text-align: right;
  }
  .ds-flex {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
  .flex-3 {
    flex: 3;
  }
</style>
