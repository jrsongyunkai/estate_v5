<template>
  <div class="custom-alarm systemBody">
    <div v-if="alarmSee">
      <h3 class="md-list">{{ $t('customizeAlertList') }}</h3>
      <div class="title-tip">
        <Icon type="md-text" class="mesg-tip" style="margin-top: 5px" />
        <span>{{ $t('customTitel') }}</span>
      </div>

      <div class="mt">
        <div class="fd marg">
          <Select v-model="modelStatus" clearable class="wds" :placeholder="$t('pleaseSelectState')">
            <Option v-for="item in alarmStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

          <Input class="wds" v-model="alarmTitle" :placeholder="$t('plsEAlarmTtle')" />
          <DatePicker :value="dataValue" type="daterange" format="yyyy-MM-dd" format-value="yyyy-MM-dd" :placeholder="$t('plsEcraTimer')" @on-change="changDate" class="wds"></DatePicker>
          <div class="mr">
            <Button type="primary" @click="checkList">{{ $t('query') }}</Button>
          </div>
          <div class="mf">
            <Button type="default" @click="delValue">{{ $t('reset') }}</Button>
          </div>
        </div>
        <div class="py">
          <Button type="primary" @click="addCustomList">{{ $t('newCustomAlarm') }}</Button>
        </div>
      </div>
      <Table :columns="columnsTable" :data="dataList">
        <template slot-scope="{ row }" slot="content">
          <div>{{ row.content }}</div>
        </template>
        <template slot-scope="{ row }" slot="staus">
          <div><Switch :true-value="1" :false-value="0" v-model="row.status" @on-change="chagneAlarmStatus($event, row)" /></div>
        </template>
        <template slot-scope="{ row }" slot="operation">
          <div class="fd">
            <Button type="text" @click="checkDetails(row)">
              <span class="buttons">{{ $t('view') }}</span>
            </Button>
            <Button type="text" @click="editDetails(row)">
              <span class="buttons">{{ $t('edit') }}</span>
            </Button>
            <Button type="text" @click="cancelDetails(row)">
              <span class="cancel-buttons">{{ $t('delete') }}</span>
            </Button>
          </div>
        </template>
      </Table>
      <Page @on-change="handlePageSize" show-elevator show-total :current="currentPage" :page-size="pageSize" :total="total"></Page>
    </div>
    <div v-if="editAddAlarm">
      <div class="mt">
        <h3>{{ txtTitles }}{{ $t('customAlarm') }}</h3>
      </div>
      <div>
        <Form class="form-wd" ref="formValidate" :model="formValidate" :rules="ruleValidate" @submit.native.prevent>
          <FormItem :label="$t('alarmTitle')" prop="title">
            <Input v-model="formValidate.title" class="formInput" maxlength="10" show-word-limit :placeholder="$t('psEcustomTitle')"></Input>
          </FormItem>
          <FormItem :label="$t('alarmContent')" prop="content">
            <Input v-model="formValidate.content" class="formInput" :rows="4" type="textarea" maxlength="100" show-word-limit :placeholder="$t('userDefined')"></Input>
          </FormItem>
          <FormItem :label="`${$t('state')}:`">
            <Switch size="large" :true-value="1" :false-value="0" v-model="formValidate.slider">
              <span slot="close">{{ $t('disabled') }}</span>
              <span slot="open">{{ $t('enabled') }}</span>
            </Switch>
          </FormItem>
          <FormItem label="">
            <span class="color-text">{{ tooltiip }}</span>
          </FormItem>
          <FormItem>
            <div>
              <Button class="mrf" type="primary" @click="handleSubmit('formValidate')">{{ $t('save') }}</Button>
              <Button type="default" @click="handleReset('formValidate')">{{ $t('cancel') }}</Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <div v-if="checkAlarm">
      <div></div>
      <div class="mt">
        <h3>{{ $t('customAlarmDetails') }}</h3>
        <div style="py">
          <Button type="primary" @click="openEdit">{{ $t('edit') }}</Button>
          <Button type="error" class="mrf rd" ghost @click="delModal">{{ $t('delete') }}</Button>
          <Button type="default" ghost @click="backList">
            <span>{{ $t('back') }}</span>
          </Button>
        </div>
      </div>
      <div>
        <Form :label-width="90">
          <FormItem :label="$t('alarmTitle') + ':'" class="text-color">
            {{ checkTitle }}
          </FormItem>
          <FormItem :label="$t('alarmContent') + ':'" class="text-color">
            {{ checkContent }}
          </FormItem>
          <FormItem :label="$t('state') + ':'" class="text-color">
            <span>
              <!-- {{ checkStatus ? "启用" : "停用" }}  -->
              <Switch v-model="checkStatus" :true-value="1" :false-value="0" :disabled="true"></Switch>
            </span>
          </FormItem>
          <FormItem :label="$t('createdTime') + ':'" class="text-color">
            {{ checkTime }}
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  import { alarmPageCustom, saveCustomAlarm, changeStatusCustom, delCustomAlarm } from '@/api/public'
  export default {
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        id: '',
        rowValue: '',
        tooltiip: this.$t('eCustomTips'),
        checkTitle: '',
        checkStatus: '',
        checkContent: '',
        checkTime: '',
        dataList: [],
        txtTitles: '',
        formValidate: {
          title: '',
          content: '',
          slider: 1,
        },
        ruleValidate: {
          title: [{ required: true, message: this.$t('contentEmpty'), trigger: 'blur' }],
          content: [{ required: true, message: this.$t('alarmContentDefinde'), trigger: 'blur' }],
        },
        alarmSee: true,
        editAddAlarm: false,
        checkAlarm: false,
        alarmTitle: '',
        modelStatus: '',
        alarmStatus: [
          { value: 2, label: this.$t('allStatus') },
          { value: 0, label: this.$t('disabled') },
          { value: 1, label: this.$t('enabled') },
        ],
        dataValue: [],
        columnsTable: [
          {
            type: 'index',
            title: this.$t('index'),
            align: 'left',
          },
          {
            title: this.$t('alarmTitle'),
            key: 'title',
          },
          { title: this.$t('alarmContent'), slot: 'content' },
          { title: this.$t('state'), slot: 'staus' },
          {
            title: this.$t('createdTime'),
            key: 'createTime',
            sortable: true,
          },
          { title: this.$t('operation'), slot: 'operation', width: 220, align: 'center' },
        ],
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        let params = {
          params: {
            projectCode: this.$store.state.projectCode,
          },
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        }
        alarmPageCustom(params).then(res => {
          if (res.success) {
            this.dataList = res.datas.map(item => ({
              ...item,
              title: item.name,
            }))
            this.total = res.total
            this.checkAlarm = false
            this.alarmSee = true
            this.editAddAlarm = false
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handlePageSize(e) {
        this.currentPage = e
        this.init()
      },
      checkList() {
        let params = {
          params: {
            projectCode: this.$store.state.projectCode,
            name: this.alarmTitle,
            startTime: this.dataValue.length > 1 ? this.dataValue[0] : '',
            endTime: this.dataValue.length > 1 ? this.dataValue[1] : '',
            status: this.modelStatus === 2 ? '' : this.modelStatus,
          },
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        }
        alarmPageCustom(params).then(res => {
          if (res.success) {
            this.dataList = res.datas.map(item => ({
              ...item,
              title: item.name,
            }))
            this.checkAlarm = false
            this.alarmSee = true
            this.editAddAlarm = false
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      changDate(val) {
        this.dataValue = val
      },
      chagneAlarmStatus(val, row) {
        let params = {
          projectCode: this.$store.state.projectCode,
          name: row.name,
          status: val,
        }
        changeStatusCustom(params).then(res => {
          if (res.success) {
            this.$Message.success(this.$t('modifiedSuccessfully'))
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
          this.init()
        })
      },
      addCustomList() {
        this.txtTitles = this.$t('create')
        this.alarmSee = false
        this.checkAlarm = false
        this.editAddAlarm = true
        this.formValidate = {
          title: '',
          content: '',
          slider: 1,
        }
      },
      delValue() {
        this.alarmTitle = ''
        this.modelStatus = ''
        this.dataValue = []
        this.init()
      },
      editDetails(val) {
        this.txtTitles = this.$t('edit')
        this.formValidate.title = val.title
        this.formValidate.content = val.content
        this.formValidate.slider = val.status
        this.id = val.id
        this.alarmSee = false
        this.checkAlarm = false
        this.editAddAlarm = true
      },
      checkDetails(val) {
        this.rowValue = val
        this.alarmSee = false
        this.editAddAlarm = false
        this.checkAlarm = true
        this.id = val.id
        this.checkTitle = val.title
        this.checkStatus = val.status
        this.checkContent = val.content
        this.checkTime = val.createTime
      },
      backList() {
        this.alarmSee = true
        this.checkAlarm = false
      },
      cancelDetails(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmDeletecustomAlarm'),
          onOk: () => {
            let params = {
              projectCode: this.$store.state.projectCode,
              name: row.name,
            }
            delCustomAlarm(params).then(res => {
              if (res.success) {
                this.$Message.success(this.$t('deleteSuccessful'))
                this.init()
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          },
          onCancel: () => {
            this.$Message.info({
              content: this.$t('cancelDelete'),
            })
          },
        })
      },
      delModal() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('deleteCustomAlarm'),
          onOk: () => {
            let params = {
              projectCode: this.$store.state.projectCode,
              name: this.rowValue.name,
            }
            delCustomAlarm(params).then(res => {
              if (res.success) {
                this.$Message.success(this.$t('deleteSuccessful'))
                this.init()
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          },
          onCancel: () => {
            this.$Message.info({
              content: this.$t('cancelDelete'),
            })
          },
        })
      },
      openEdit() {
        this.txtTitles = this.$t('edit')
        this.editAddAlarm = true
        this.checkAlarm = false
        this.formValidate.title = this.checkTitle
        this.formValidate.content = this.checkContent
        this.formValidate.slider = this.checkStatus
      },
      handleSubmit(name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            let params
            if (this.txtTitles === this.$t('edit')) {
              params = {
                projectCode: this.$store.state.projectCode,
                name: this.formValidate.title,
                content: this.formValidate.content,
                status: this.formValidate.slider,
                id: this.id,
              }
            } else {
              params = {
                projectCode: this.$store.state.projectCode,
                name: this.formValidate.title,
                content: this.formValidate.content,
                status: this.formValidate.slider === 1 ? '1' : '0',
              }
            }

            saveCustomAlarm(params).then(res => {
              if (res.success) {
                this.$Message.success(this.$t('savedSuccessfully'))
                this.alarmSee = true
                this.editAddAlarm = false
                this.init()
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
          } else {
            this.$Message.error(this.$t('titleEmpty'))
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields()
        this.editAddAlarm = false
        this.checkAlarm = false
        this.alarmSee = true
      },
    },
  }
</script>

<style lang="less">
  .custom-alarm {
    .md-list {
      padding: 15px 5px;
    }
    .cutton-alarm {
      padding: 10px 5px;
    }
    .wds {
      width: 200px;
      margin: 0 10px 0 0;
    }
    .marg {
      margin-left: -12px;
    }
    .text-color > .ivu-form-item-label {
      color: #999999;
    }
    .title-tip {
      display: flex;
      background: rgba(153, 153, 153, 0.05);
      color: #999999;
      border: 1px solid #888b92;
      padding: 10px 10px;
      .mesg-tip {
        padding-right: 5px;
      }
    }
    .fd {
      display: flex;
    }
    .text {
      padding: 5px 0;
      margin-left: 40px;
    }
    .buttons {
      color: #1890ff;
    }
    .cancel-buttons {
      color: #ff5b59;
    }
    .mr {
      margin-left: 10px;
    }
    .mf {
      margin-left: 20px;
    }
    .mrf {
      margin-right: 10px;
    }
    .rd {
      color: #e03c3a;
      margin-left: 10px;
      background: rgba(224, 60, 58, 0.1);
    }
    .color-text {
      color: #007eff;
    }
    .form-title {
      display: flex;
      justify-content: center;
      margin: 50px auto;
    }
    .form-wd {
      width: 500px;
      margin-top: 10px;
    }
    .formInput {
      width: 500px;
    }
    .mt {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding: 15px;
      .py {
        margin-bottom: 10px;
      }
    }
  }
</style>
