<template>
  <div id="LatitudeLongitudeTiming">
    <Modal :title="timingTitle" :close-on-click-modal="false" v-model="timingFlag" width="680px">
      <Edit :options="timing" v-if="timingFlag" @queryList="init" @closeEdit="timingFlag = false" @handleLatitudeLongitude="handleLatitudeLongitude"></Edit>
      <div slot="footer"></div>
    </Modal>
    <Modal :title="$t('tip')" v-model="delVisible" width="420px" top="45vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <Row>
        <Col :span="24" class="ml-20">
          <div class="el-message-box__status el-icon-warning"></div>
        </Col>
        <Col :span="24" style="margin-left: 50px">
          <div class="el-message-box__message">
            {{ $t('confirmDeleteTimer') }}
          </div>
        </Col>
      </Row>
      <div slot="footer" class="dialog-footer" style="display: flex">
        <Col :span="12" class="tl mt-10" v-show="msgboxFlag">
          <Checkbox v-model="checked">{{ this.$t('forceDeletePlatformRecord') }}</Checkbox>
        </Col>
        <Col :span="12" class="fr">
          <Button @click="handleCancel">{{ $t('cancel') }}</Button>
          <Button class="b-blue" @click="handleOk">{{ $t('confirm') }}</Button>
        </Col>
      </div>
    </Modal>
    <Modal :title="$t('setLatLng')" :close-on-click-modal="false" v-model="latitudeFlag" width="680px">
      <Form :model="setupForm" :label-width="120">
        <FormItem :label="$t('equipmentNo') + ':'">
          <Input style="width: 199px" :disabled="true" v-model="setupForm.mac"></Input>
        </FormItem>
        <FormItem :label="$t('lngValue') + ':'">
          <Input style="width: 199px" v-model="setupForm.longitude"></Input>
          <span class="pointer c-primary ml-20 mr-20" @click="handleRefresh" style="margin: 0 10px">{{ $t('refresh') }}</span>
          <span class="pointer c-primary" @click="handleExtract(setupForm.mac)" style="margin: 0 10px">{{ $t('extractFromDevice') }}</span>
        </FormItem>
        <FormItem :label="$t('latitudeVal') + ':'">
          <Input style="width: 199px" v-model="setupForm.latitude"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit" :disabled="setupForm.mac === '' || setupForm.longitude === '' || setupForm.latitude === ''">{{ $t('save') }}</Button>
        </FormItem>
      </Form>
      <div>
        <div class="description-title">{{ $t('explanation') + '：' }}</div>
        <div class="description">{{ '1. ' + $t('description1') }}</div>
        <div class="description">{{ '2. ' + $t('description2') }}</div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import { timeingList, findById, delTiming, longitudeAndLatitude, refreshLongitudeLatitude, setLongitudeLatitude, downGetTime } from '@/api/multiManage/latlongTimer'
  import Edit from './Edit.vue'
  export default {
    components: {
      Edit,
    },
    data() {
      return {
        formInline: {
          mac: '',
        },
        setupForm: {
          mac: '',
          longitude: '',
          latitude: '',
        },
        multipleSelection: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        rowList: {},
        latitudeData: [],
        timingTitle: '',
        checked: false,
        timingFlag: false,
        msgboxFlag: false,
        delVisible: false,
        latitudeFlag: false,
        returnFlag: false,
        forceDelData: [],
        BuiltInTimingHeight: this.$store.state.BuiltInTimingHeight,
        timing: {
          mac: '',
          autoid: '',
          channel: '',
          weekday: '',
          time: '',
          type: '',
          monitorTime: '',
          status: '',
          tags: '',
        },
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
        this.setupForm.mac = ''
        this.queryList()
      },
      queryList() {
        let params = {
          projectCode: this.$store.state.projectCode,
          mac: this.formInline.mac,
          type: '2,3',
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        }
        timeingList(params)
          .then(res => {
            if (res.success) {
              this.total = res.total
              this.latitudeData = res.datas
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
      handleAdd() {
        this.timing = {
          mac: '',
          autoid: '',
          channel: '',
          weekday: '',
          time: '',
          type: '',
          monitorTime: '',
          status: '',
          tags: '',
        }
        this.timingTitle = this.$t('addLatlongTimer')
        this.timingFlag = true
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
      handleEdit() {
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
                  type: data.type,
                  monitorTime: data.monitorTime,
                  status: data.status,
                  tags: tags,
                }
                this.timingTitle = this.$t('editLatlongTimer')
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
      handleSizeChange(val) {
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
      handleLatitudeLongitude(row) {
        this.rowList = row
        this.setupForm.mac = row.mac

        if (row.flag === 'ture') {
          this.returnFlag = true
        } else {
          this.returnFlag = false
        }
        this.setLatitudeLongitude()
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
      },
      setLatitudeLongitude() {
        this.timingFlag = false
        this.latitudeFlag = true
      },
      handleRefresh() {
        refreshLongitudeLatitude({ mac: this.setupForm.mac })
          .then(res => {
            if (res.success) {
              this.setupForm = {
                mac: this.setupForm.mac,
                longitude: res.data.longitude,
                latitude: res.data.latitude,
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
      },
      handleExtract(mac) {
        longitudeAndLatitude({ mac: mac })
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: res.message,
              })
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
      handleSubmit() {
        setLongitudeLatitude(this.setupForm)
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: res.message,
              })
              this.handlelatitudeClose()
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
      handleCommand(command) {
        if (command === 'all') {
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
        }
      },
      handlelatitudeClose() {
        if (this.returnFlag) {
          this.latitudeFlag = false
          this.timingFlag = true
          this.timing = {
            mac: this.rowList.mac,
            autoid: this.rowList.autoid,
            weekday: this.rowList.week,
            time: this.rowList.time,
            type: this.rowList.type,
            monitorTime: this.rowList.monitorTime,
            status: this.rowList.action,
            tags: this.rowList.tags,
          }
        } else {
          this.latitudeFlag = false
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
  }
</script>
<style lang="less" scoped>
  #LatitudeLongitudeTiming {
    .LatitudeLongitudeTiming-head {
      display: flex;
      padding-top: 10px;
    }
  }
</style>
