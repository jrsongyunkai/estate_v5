<template>
  <div id="BuiltInTiming">
    <Modal :title="timingTitle" v-model="timingFlag" width="680px">
      <Edit :options="timing" v-if="timingFlag" @closeEdit="timingFlag = false"></Edit>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import { timeingList, delTiming, findById, remotectrl, downGetTime } from '@/api/multiManage/builtlnTimer'
  import Edit from '../builtInTimer/Edit'
  import BatchEdit from '../builtInTimer/BatchEdit.vue'
  import CommandFeedback from '../../Common/CommandFeedback'
  export default {
    data() {
      return {
        formInline: {
          mac: '',
          action: '',
        },
        data: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        timingFlag: false,
        timingTitle: '',
        timing: null,
        instructionsFlag: false,
        allInstructions: false,
        instructionsData: [],
        multipleSelection: [],
        forceDelData: [],
        BuiltInTimingHeight: this.$store.state.BuiltInTimingHeight,
        msgboxFlag: false,
        delVisible: false,
        checked: false,
        batchEditFlag: false,
        batchEditData: [],
        rowData: {},
        actionTypes: [
          {
            label: this.$t('closing'),
            value: 1,
          },
          {
            label: this.$t('opening'),
            value: 2,
          },
        ],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: this.$t('place'),
            slot: 'others.address',
            align: 'center',
          },
          {
            title: this.$t('equipmentNo'),
            slot: 'mac',
            align: 'center',
          },
          {
            title: this.$t('line'),
            slot: 'others.titles',
            align: 'center',
          },
          {
            title: this.$t('cycle'),
            key: 'weekday',
            align: 'center',
          },
          {
            title: this.$t('time'),
            key: 'time',
            align: 'center',
          },
          {
            title: this.$t('state'),
            slot: 'status',
            align: 'center',
            width: 80,
          },
          {
            title: this.$t('operation'),
            slot: 'operating',
            align: 'center',
            width: 400,
          },
        ],
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        if (this.$route.params.mac) {
          this.formInline.mac = this.$route.params.mac
        }
        this.queryList()
      },
      queryList(prop, order) {
        let params = {
          projectCode: this.$store.state.projectCode,
          mac: this.formInline.mac,
          status: this.formInline.action,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        }
        if (prop) {
          params.sortName = prop
          if (order === 'ascending') {
            params.order = 'asc'
          } else if (order === 'descending') {
            params.order = 'desc'
          }
        }
        timeingList(params)
          .then(res => {
            if (res.success) {
              this.total = res.total
              this.data = res.datas
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      sortChange({ column, prop, order }) {
        this.queryList(prop, order)
      },
      onSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.currentPage = 1
            this.queryList()
          } else {
            return false
          }
        })
      },
      handleAdd() {
        this.timing = {
          mac: '',
          autoid: '',
          channel: '',
          weekday: [],
          time: '',
          status: 'true',
          tags: [],
          others: {},
        }
        this.timingTitle = this.$t('addTaskList')
        this.timingFlag = true
      },
      handleEdit() {
        //
        this.$nextTick(function () {
          findById({ id: this.id })
            .then(res => {
              if (res.success) {
                let data = res.data
                let titles = data.others.titles.split(',')
                let tags = []
                data.channelAddrs.split(',').map((item, index) => {
                  tags.push({ addr: item, title: titles[index] })
                })
                this.timing = {
                  mac: data.mac,
                  autoid: data.autoId,
                  channel: data.channelAddrs,
                  weekday: data.weekday ? data.weekday.replace(/,/g, '') : '',
                  time: data.time,
                  status: data.status,
                  statusto: data.status === 'unlockAndOpen',
                  tags: tags,
                  others: data.others,
                  relationId: data.relationId,
                  addrDigitalOuts: data.digitalOuts,
                }
                this.timingTitle = this.$t('editBuiltIntiming')
                this.timingFlag = true
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({
                  content: this.$t('unknown'),
                })
              }
            })
        })
      },
      handleDelete(row) {
        this.delVisible = true
        this.msgboxFlag = row.others.forceDeleteEnable
        this.rowData = row
      },
      handleforceDel() {
        this.msgboxFlag = this.delVisible = true
        this.rowData = {}
      },
      handleforceEdit() {
        this.batchEditFlag = true
      },
      handleBatchClose() {
        this.batchEditFlag = false
      },
      handleCancel() {
        this.$Message.info({
          content: this.$t('cancelDelete'),
        })
        this.checked = this.delVisible = false
      },
      handleOk() {
        let arr = []
        let params = {}
        if (Object.keys(this.rowData).length > 0) {
          params = {
            mac_autoids: this.rowData.mac ? [this.rowData.mac, this.rowData.autoId].join('_') : this.multipleSelection.join(','),
            _operate_at: 4,
          }
        } else {
          params = {
            mac_autoids: this.multipleSelection.join(','),
            _operate_at: 4,
          }
        }
        this.forceDelData.forEach(item => {
          if (!item.forceDel) arr.push(item.mac)
        })
        arr = Array.from(new Set(arr))
        if (this.checked && arr.length > 0 && Object.keys(this.rowData).length === 0) {
          this.checked = this.delVisible = false
          this.$Message.error({
            content: `${this.$t('device') + '\xa0\xa0' + arr.join('\n') + '\xa0\xa0' + this.$t('notSupportedDelRecords')}`,
          })
        } else {
          params.delFlag = this.checked ? 'Y' : ''
          delTiming(params)
            .then(res => {
              this.checked = this.delVisible = false
              if (res.success) {
                this.$Message.success({
                  content: res.message,
                })
              } else if (res.code === '-1') {
              } else {
                let errMsg =
                  res.data !== undefined && res.data.length > 0
                    ? res.data.map(item => {
                        if (item.errorMsg === '0') {
                          this.$Message.success({
                            content: `${item.mac + ':\xa0' + this.$t('submitCommand')}`,
                          })
                        } else {
                          this.$Message.success({
                            content: `${item.mac + ':\xa0' + item.errorMsg}`,
                          })
                        }
                      })
                    : res.message
                this.$alert(res.data !== undefined && res.data.length > 0 ? errMsg.join('\n') : errMsg, '', {
                  dangerouslyUseHTMLString: true,
                  showConfirmButton: false,
                  callback: action => {},
                })
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({
                  content: this.$t('unknown'),
                })
              }
            })
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val.map(item => {
          return item.mac + '_' + item.autoId
        })
        this.forceDelData = val.map(item => {
          return {
            mac: item.mac,
            forceDel: item.others.forceDeleteEnable,
          }
        })
        this.batchEditData = val.map(item => {
          return {
            autoId: item.autoId,
            channelAddrs: item.channelAddrs.split(','),
            mac: item.mac,
            others: {
              address: item.others.address,
              name: item.others.name,
              titles: item.others.titles.split(','),
            },
            weekday: item.weekday ? item.weekday.split('') : '',
          }
        })
      },
      handlePageSize(val) {
        this.pageSize = val
        this.queryList()
      },
      handleCurrentChange(e) {
        if (e === 'home') {
          this.currentPage = 1
        } else if (e === 'prev') {
          if (this.currentPage !== 1) {
            this.currentPage -= 1
          } else {
            return false
          }
        } else if (e === 'next') {
          this.currentPage += 1
        }
        this.queryList()
      },
      handleCommand(command) {
        if (command === 'extract') {
          if (this.formInline.mac === '') {
            this.$Message.error({
              content: this.$t('enterDeviceNo'),
            })
            return false
          }
          downGetTime({ mac: this.formInline.mac })
            .then(res => {
              if (res.success) {
                if (res.code === '0') {
                  this.$Message.success({
                    content: this.$t('submitCommand'),
                  })
                }
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({
                  content: this.$t('unknown'),
                })
              }
            })
        } else {
          this.$func.windowCountDown('/timing/export.as?projectCode=' + this.$store.state.projectCode + '&mac=' + this.formInline.mac + '&pageNo=' + this.currentPage + '&timingType=' + '1' + '&pageSize=' + this.pageSize + '&type=' + (command === 'all' ? 'exportAll' : ''))
        }
      },
      handleExecute(mac, addr, opr, row, autoId) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmYouWant') + (opr ? this.$t('closing') : this.$t('opening')) + '?',
          onOk: () => {
            let param = {
              cmd: 'OCSWITCH',
              mac: mac,
              value1: opr ? 'open' : 'close',
              value2: addr,
              _operate_at: 4 + ':' + autoId,
            }
            remotectrl(param)
              .then(res => {
                if (res.success) {
                  if (res.code === '0') {
                    this.$Message.success({
                      content: this.$t('submitCommand'),
                    })
                  }
                } else if (res.code === '-1') {
                } else {
                  this.$Message.error({
                    content: res.message,
                  })
                }
              })
              .catch(err => {
                if (err) {
                  this.$Message.error({
                    content: this.$t('unknown'),
                  })
                }

                let _param = {
                  cmd: 'OCSWITCH',
                  mac: mac,
                  value1: opr ? 'open' : 'close',
                  value2: addr,
                  _operate_at: 4 + ':' + autoId,
                }
                remotectrl(_param)
                  .then(res => {
                    if (res.success) {
                      if (res.code === '0') {
                        this.$Message.success({
                          content: this.$t('submitCommand'),
                        })
                      }
                    } else if (res.code === '-1') {
                    } else {
                      this.$Message.error({
                        content: res.message,
                      })
                    }
                  })
                  .catch(err => {
                    if (err) {
                      this.$Message.error({
                        content: this.$t('unknown'),
                      })
                    }
                  })
              })
              .catch(() => {
                this.$Message.info({
                  content: this.$t('canceled'),
                })
              })
          },
        })
      },
      handleInstructions(row) {
        this.allInstructions = false
        this.instructionsFlag = true
        this.instructionsData = row
        this.instructionsData.projectCode = this.$store.state.projectCode
      },
      viewAllInstruction() {
        this.allInstructions = this.instructionsFlag = true
        this.instructionsData = {
          projectCode: this.$store.state.projectCode,
        }
      },
    },
    watch: {
      '$store.state.projectCode': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.init()
          }
        },
      },
      '$store.state.BuiltInTimingHeight': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.BuiltInTimingHeight.height = newVal
          }
        },
      },
    },
    props: {
      id: {
        type: Number,
        default() {
          return {}
        },
      },
    },
    components: {
      Edit,
      BatchEdit,
      CommandFeedback,
    },
  }
</script>
<style lang="less" scoped>
  #BuiltInTiming {
    .BuiltInTiming-head {
      display: flex;
      padding-top: 10px;
    }
  }
  /deep/.ivu-modal-footer {
    padding: 0px;
    border: none;
  }
</style>
