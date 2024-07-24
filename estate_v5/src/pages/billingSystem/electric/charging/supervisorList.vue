<template>
  <div class="supervisorList">
    <div class="back" @click="back">
      <span class="icon-v5 icon-v5-xiangzuo"></span>
      {{ $t('back') }}
    </div>
    <Row class="filterCriteria">
      <Input v-model="searchValue" style="width: 200px" :placeholder="type === 'supervisorList' ? $t('searchNameOrPhoneSupervisor') : $t('searchNameOrPhoneElectricityUser')" />
      <Button class="b-blue ml-10" @click="searchList">{{ $t('query') }}</Button>
      <Button class="b-info ml-10" @click="reset">{{ $t('reset') }}</Button>
    </Row>
    <div class="content">
      <Row class="header">
        <h3>{{ type === 'supervisorList' ? $t('listOfSupervisors') : $t('listOfElectricityUsers') }}</h3>
        <div>
          <Button class="b-blue ml-10" @click="handleImport">{{ $t('batchImport') }}</Button>
          <Button class="b-blue ml-10" @click="handleAddr('add')">{{ $t('add') }}</Button>
        </div>
      </Row>
      <Table :columns="listColumns" :data="listData">
        <template slot-scope="{ row, index }" slot="action">
          <Button class="c-primary" type="text" @click="handleAddr('edit', row)">{{ $t('edit') }}</Button>
          <Button class="ml-10 c-danger" type="text" @click="deleteUser(row, index)">{{ $t('delete') }}</Button>
        </template>
      </Table>
      <Page show-total :current="pageNo" @on-change="changePage" :total="totalTables" show-elevator />
    </div>

    <Modal :title="type === 'supervisorList' ? $t('addOrEditSupervisor') : $t('AddOrEditElectricityUser')" v-model="addUser" class-name="recharge" width="900">
      <Form ref="userInfoForm" :label-width="150" label-position="right" :model="user" :rules="formRules">
        <template v-if="type === 'supervisorList'">
          <FormItem :label="$t('accountSource')" prop="source">
            <RadioGroup v-model="user.source" type="button">
              <Radio label="within">{{ $t('usersWithinTheProject') }}</Radio>
              <Radio label="outside">{{ $t('offProjectUsers') }}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem :label="$t('accountName')" prop="username" v-if="user.source === 'within' && action == 'add'">
            <Input v-model="user.username" style="width: 400px" :placeholder="$t('pleaseEnterAccountNameForRetrieval')" />
            <Button class="b-blue ml-10" @click="queryName">{{ $t('query') }}</Button>
          </FormItem>
        </template>
        <FormItem :label="$t('fullName')" prop="name">
          <Input v-model="user.name" :disabled="isDisable && user.source === 'within'" style="width: 400px" :placeholder="$t('pleaseEnter')" />
        </FormItem>
        <FormItem :label="$t('contactNumber')" prop="phone">
          <Input v-model="user.phone" style="width: 400px" :placeholder="$t('pleaseEnter')" />
        </FormItem>
        <FormItem :label="$t('mailbox')" prop="mail">
          <Input v-model="user.mail" style="width: 400px" :placeholder="$t('pleaseEnter')" />
        </FormItem>
        <FormItem :label="$t('remark')" prop="notes">
          <Input v-model="user.notes" style="width: 400px" type="textarea" :placeholder="$t('pleaseEnter')" />
        </FormItem>
        <FormItem :label="$t('notificationMethodPayAfterSuccessful')" prop="callType" :label-width="150">
          <CheckboxGroup v-model="user.callType">
            <Checkbox label="system" v-if="user.source === 'within' && type === 'supervisorList'">{{ $t('systemNotification') }}</Checkbox>
            <Checkbox label="phone">{{ $t('phone') }}</Checkbox>
            <Checkbox label="messages">{{ $t('sms') }}</Checkbox>
            <Checkbox label="emails">{{ $t('email') }}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div class="tableContent">
        <div style="margin-bottom: 10px">{{ $t('callNotificationConfiguration') }}</div>
        <Table :columns="callColumns" :data="user.callData">
          <template slot-scope="{ row, index }" slot="trigger">
            <Input v-model="user.callData[index].trigger" :disabled="row.disabled" :placeholder="$t('pleaseEnter')"></Input>
          </template>
          <template slot-scope="{ index }" slot="method">
            <CheckboxGroup v-model="user.callData[index].method">
              <Checkbox label="system" v-if="user.source === 'within'">{{ $t('systemNotification') }}</Checkbox>
              <Checkbox label="phone">{{ $t('phone') }}</Checkbox>
              <Checkbox label="messages">{{ $t('sms') }}</Checkbox>
              <Checkbox label="emails">{{ $t('email') }}</Checkbox>
            </CheckboxGroup>
          </template>
          <template slot-scope="{ index }" slot="frequency">
            <i18n path="notificationPeriodValue">
              <Select place="input" v-model="user.callData[index].time" style="width: 80px" :transfer="true">
                <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </i18n>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <Button :class="row.disabled ? 'c-info' : 'c-danger'" type="text" :disabled="row.disabled" @click="delTableConfig(index)">{{ $t('delete') }}</Button>
          </template>
        </Table>
        <Button class="b-blue ml-10" style="margin-top: 20px" type="dashed" @click="handleAddnotice">{{ $t('addNotificationToTriggerBalance') }}</Button>
      </div>
      <div slot="footer">
        <Button class="b-blue ml-10" @click="saveUserWork">{{ $t('confirm2') }}</Button>
        <Button class="b-info ml-10" @click="addUser = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('batchImport')" v-model="inport" class-name="recharge" width="500">
      <Row style="justify-content: space-between; margin-bottom: 10px">
        <span>{{ $t('fileImport') }}</span>
        <div style="color: #02a7f0" class="pointer" @click="downLoadMode">
          <Icon type="md-cloud-download" style="font-size: 16px" />
          {{ $t('templateDownload') }}
        </div>
      </Row>
      <Upload multiple type="drag" :format="['xlsx', 'xls']" :data="fileData" :name="fileData.name" :show-upload-list="false" :action="actionUrl" :before-upload="onBeforeUpload" :on-error="onError" :on-success="(res, file, fileList) => onSuccessPerson(res, file, fileList)">
        <div style="padding: 60px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>{{ $t('importFileActionTip') }}</p>
        </div>
      </Upload>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import { queryElectricityUserList, importElectricityUser, importPaymentNotifier, queryPaymentNotifierList, delPaymentNotifier, delElectricityUser, saveElectricityUser, findStaffByName, savePaymentNotifier } from '@/api/public'
  export default {
    props: {
      type: { type: String },
    },
    computed: {},
    data() {
      return {
        actionUrl: '',
        isDisable: false,
        fileData: { name: 'excelName' },
        rowEdit: '',
        pageNo: 1,
        pageSize: 10,
        totalTables: 0,
        staffIds: '',
        user: {
          source: '',
          username: '',
          name: '',
          number: '',
          email: '',
          notes: '',
          phone: '',
          callType: [],
          callData: [{ trigger: '0', disabled: false, method: [], time: '' }],
        },
        formRules: {
          source: [{ required: true, message: this.$t('pleaseSelectAccountSource'), trigger: 'change' }],
          username: [{ required: true, message: this.$t('pleaseEnterAccountName'), trigger: 'change' }],
          name: [{ required: true, message: this.$t('pleaseEnterFullName'), trigger: 'change' }],
          phone: [{ required: true, message: this.$t('pleaseEnterContactNumber'), trigger: 'blur' }],
          callType: [{ required: true, message: this.$t('pleaseSelectNotificationMethod') }],
        },
        timeList: [],
        callColumns: [
          { title: this.$t('addNotificationToTriggerBalance'), slot: 'trigger', align: 'center', width: 180 },
          { title: this.$t('notificationMethod'), slot: 'method', align: 'center', width: 350 },
          { title: this.$t('notificationFrequency'), slot: 'frequency', align: 'center', width: 220 },
          { title: this.$t('operation'), slot: 'action', align: 'center', width: 100 },
        ],
        addUser: false,
        searchValue: '',
        action: '',
        listColumns: [
          { title: this.$t('fullName'), key: 'name' },
          { title: this.$t('contactNumber'), key: 'telephone' },
          { title: this.$t('mailbox'), key: 'email' },
          { title: this.$t('operation'), slot: 'action', align: 'center' },
        ],
        listData: [],
        inport: false,
      }
    },
    created() {
      if (this.type === 'electricityList') {
        this.getElectricityUserList()
      } else if (this.type === 'supervisorList') {
        this.getPaymentNotifierList()
      }
      this.actionUrl = `/common/file/upload.as?fileType=4&&urlAbsolute=false&&subDir=${this.type === 'electricityList' ? 'electricity_user' : 'payment_notifier'}`
    },
    mounted() {
      for (let i = 1; i <= 30; i++) {
        this.timeList.push({ value: i, label: i })
      }
    },
    methods: {
      onError(file) {
        this.$Message.error({ content: this.$t('uploadFileFailTip') })
      },
      onSuccessPerson(res, file, fileList) {
        if (this.type === 'electricityList') {
          importElectricityUser({ projectCode: this.$store.state.projectCode, absPath: res.data }).then(response => {
            if (response.success) {
              this.getElectricityUserList()
              this.inport = false
            } else {
              this.$Message.error(response.message)
            }
          })
        } else if (this.type === 'supervisorList') {
          importPaymentNotifier({ projectCode: this.$store.state.projectCode, absPath: res.data }).then(response => {
            if (response.success) {
              this.getPaymentNotifierList()
              this.inport = false
            } else {
              this.$Message.error(response.message)
            }
          })
        }
        this.$Message.success({ content: this.$t('uploadSuccess') })
      },
      downLoadMode() {
        this.$func.windowCountDown('/common/tpl/download.as?type=' + this.type === 'supervisorList' ? 'bill_payment_notifier_import' : 'bill_electricity_user_import')
      },
      onBeforeUpload(file) {
        const fileExt = file.name.split('.').pop().toLocaleLowerCase()
        let isXlsx
        if (fileExt === 'xlsx' || fileExt === 'xls') {
          isXlsx = true
        } else {
          isXlsx = false
        }
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isXlsx) {
          this.$Message.error(this.$t('uploadFileTypeTip', { fileType: 'excel' }))
        }
        if (!isLt1M) {
          this.$Message.error(this.$t('uploadFileSizeTip', { size: 1 }))
        }
        return isLt1M && isXlsx
      },
      async queryName() {
        if (!this.user.username) {
          return this.$Message.error({ content: this.$t('pleaseEnterAccountName') })
        }
        const res = await findStaffByName({ projectCode: this.$store.state.projectCode, loginName: this.user.username })
        if (res.success) {
          let resData = res.data
          if (Object.keys(resData).length > 0) {
            this.user.name = resData.realName
            this.user.phone = resData.telephone
            this.user.mail = resData.email
            this.isDisable = true
            this.staffIds = resData.staffId
          } else {
            this.$Message.error({ content: this.$t('noAccountInfoTip') })
            this.isDisable = false
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getPaymentNotifierList() {
        let params = { projectCode: this.$store.state.projectCode, keyword: this.searchValue, pageNo: this.pageNo, pageSize: this.pageSize }
        const res = await queryPaymentNotifierList(params)
        if (res.success) {
          this.listData = res.datas
          this.totalTables = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getElectricityUserList() {
        let params = {
          projectCode: this.$store.state.projectCode,
          keyword: this.searchValue,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        }
        const res = await queryElectricityUserList(params)
        if (res.success) {
          this.listData = res.datas
          this.totalTables = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changePage(e) {
        this.pageNo = e
        if (this.type === 'supervisorList') {
          this.getPaymentNotifierList()
        } else {
          this.getElectricityUserList()
        }
      },
      saveUserWork() {
        this.$refs.userInfoForm.validate(valid => {
          if (valid) {
            this.saveUserWorkAfter()
          }
        })
      },
      saveUserWorkAfter() {
        if (!this.user.name) {
          return this.$Message.error({ content: this.$t('pleaseEnterFullName') })
        }
        const methodList = [
          { label: 'phone', value: '0' },
          { label: 'messages', value: '1' },
          { label: 'emails', value: '2' },
          { label: 'system', value: '3' },
        ]
        let callNoticParams = (this.user.callData.length && this.user.callData.map(v => ({ lt: v.trigger, t: (methodList.filter(j => v.method.includes(j.label)).length && methodList.filter(j => v.method.includes(j.label)).map(val => +val.value)) || [], f: v.time }))) || []
        const paySuccNoticList = methodList.filter(v => this.user.callType.includes(v.label))
        let params = {
          id: this.rowEdit ? this.rowEdit.id : 0,
          projectCode: this.$store.state.projectCode,
          name: this.user.name,
          telephone: this.user.phone,
          email: this.user.mail,
          remark: this.user.notes,
          paySuccNotic: (paySuccNoticList.length && paySuccNoticList.map(j => j.value).join(',')) || '',
          callNotic: JSON.stringify(callNoticParams),
        }
        if (this.type === 'supervisorList') {
          if (!this.user.source) {
            return this.$Message.error({ content: this.$t('pleaseSelectAccountSource') })
          }
          if (!this.rowEdit) {
            params.staffId = this.staffIds
          } else {
            params.staffId = this.rowEdit.staffId
          }
          if (this.user.source === 'outside') {
            params.staffId = 0
          }
          savePaymentNotifier(params).then(res => {
            if (res.success) {
              this.$Message.success({ content: this.$t('savedSuccessfully') })
              this.addUser = false
              this.getPaymentNotifierList()
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        } else {
          saveElectricityUser(params).then(res => {
            if (res.success) {
              this.$Message.success({ content: this.$t('savedSuccessfully') })
              this.addUser = false
              this.getElectricityUserList()
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        }
      },
      searchList() {
        if (this.type === 'electricityList') {
          this.getElectricityUserList()
        } else if (this.type === 'supervisorList') {
          this.getPaymentNotifierList()
        }
      },
      deleteUser(val, index) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('deleteConfirmTip'),
          onOk: () => {
            if (this.type === 'electricityList') {
              delElectricityUser({ projectCode: this.$store.state.projectCode, id: val.id }).then(res => {
                if (res.success) {
                  this.getElectricityUserList()
                } else {
                  this.$Message.error({ content: res.message })
                }
              })
            } else if (this.type === 'supervisorList') {
              delPaymentNotifier({ projectCode: this.$store.state.projectCode, id: val.id }).then(res => {
                if (res.success) {
                  this.getPaymentNotifierList()
                } else {
                  this.$Message.error({ content: res.message })
                }
              })
            }
            this.search()
          },
        })
      },
      search() {
        if (this.type === 'supervisorList') {
          this.listData = this.getJsUserList
        } else {
        }
        if (this.searchValue) {
        }
      },
      handleImport() {
        this.inport = true
      },
      handleAddnotice() {
        this.user.callData.push({ trigger: '', disabled: false, method: [], time: '' })
      },
      handleAddr(type, item) {
        this.isDisable = false
        this.action = type
        if (type === 'add') {
          this.user.id = null
          this.rowEdit = ''
          this.user = { source: '', username: '', name: '', number: '', email: '', notes: '', callType: [], callData: [{ trigger: '0', disabled: false, method: [], time: '' }] }
        } else {
          this.rowEdit = item
          this.user.id = item.id
          this.user.name = item.name
          this.user.phone = item.telephone
          this.user.mail = item.email
          this.user.notes = item.remark || ''
          if (this.type === 'electricityList') {
            this.user.callType = ['phone', 'messages', 'emails'].filter((v, index) => item.paySuccNotic.includes(index))
          } else if (this.type === 'supervisorList') {
            this.user.source = item.staffId === 0 ? 'outside' : 'within'
            this.user.callType = ['phone', 'messages', 'emails', 'system'].filter((v, index) => item.paySuccNotic.includes(index))
          }
          this.user.callData = item.callNotic.map(v => ({ ...v, trigger: v.lt, method: ['phone', 'messages', 'emails', 'system'].filter((j, index) => v.t.includes(index)), time: v.f, disabled: false }))
        }
        this.addUser = true
      },
      delTableConfig(index) {
        this.user.callData.splice(index, 1)
      },
      back() {
        this.$emit('index', 'index')
      },
      reset() {
        this.searchValue = ''
        this.search()
      },
    },
  }
</script>
<style lang="less">
  .recharge {
    .tableContent {
      input {
        text-align: center;
      }
    }
  }
  .supervisorList {
    .back {
      font-size: 16px;
      cursor: pointer;
    }
    .filterCriteria {
      background: #1a202e;
      padding: 20px;
      border-radius: 5px;
      margin-top: 10px;
    }
    .content {
      background: #1a202e !important;
      padding: 20px;
      .header {
        justify-content: space-between;
        margin-bottom: 10px;
      }
    }
  }
</style>
