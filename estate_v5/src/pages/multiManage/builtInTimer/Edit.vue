<template>
  <div id="edit">
    <Form :model="form" :label-width="80">
      <FormItem :label-width="0">
        <div style="display: flex">
          <div class="slot-label pointer">{{ $t('device') }}</div>
          <Button class="btn" @click="handleDevice">{{ $t('clickSelect') }}</Button>
          <Input v-model="form.mac" readonly style="width: 300px"></Input>
        </div>
      </FormItem>
      <FormItem v-show="form.mac" :label-width="0">
        <div style="display: flex; flex-wrap: wrap">
          <div class="slot-label pointer">{{ $t('line') }}</div>
          <Select v-model="lineListSelect" style="width: 200px" @on-select="getValquery" :multiple="linechangeIo === '' ? true : false" @on-change="getValue" :clearable="true" @on-clear="onclear">
            <Option v-for="item in linesList" :value="`${item.addr};${item.lineType}`" :key="item.addr" :disabled="item.disabled">{{ item.title }}</Option>
          </Select>
        </div>
        <span v-if="linechangeIo !== ''" style="margin-left: 80px; color: #2d8cf0">{{ $t('t3808Tip') }}</span>
      </FormItem>
      <FormItem v-if="linechangeIo === '' ? false : true" :label-width="20">
        <div style="display: flex">
          <div class="slot-label pointer" style="margin-right: 20px">{{ $t('switchOutput') }}</div>

          <Select v-model="sqmodel" multiple style="width: 300px" placement="bottom" :max-tag-count="2" transfer>
            <Option v-for="(item, index) in actionQuantity" :value="item.index" :key="index">{{ item.name }}</Option>
          </Select>
        </div>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display: flex">
          <div class="slot-label pointer">{{ $t('type') }}</div>
          <Select v-model="form.type" @on-change="handleChangeType" style="width: 200px">
            <Option :label="item.label" v-for="item in timingOptions" :key="item.value" :value="item.value"></Option>
          </Select>
        </div>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display: flex">
          <div class="slot-label pointer">{{ $t('time') }}</div>
          <DatePicker @on-change="startTimeChange" style="width: 200px" v-if="form.type === 1" v-model="form.time" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" :clearable="false" type="datetime" :placeholder="$t('pleaseSelectDateTime')"></DatePicker>
          <TimePicker @on-change="startTimeChange" v-if="form.type === 2" v-model="nowTime" format="HH:mm:ss" :editable="false" :clearable="false" :placeholder="$t('anyTime')"></TimePicker>
        </div>
      </FormItem>
      <FormItem v-if="form.type === 2" :label-width="0">
        <div style="display: flex">
          <div class="slot-label pointer">{{ $t('repeat') }}</div>
          <Button class="btn" @click="handleRepeat">{{ $t('clickSelect') }}</Button>
          <Tag v-for="tag in form.week" :key="tag" :closable="true" :disable-transitions="false" @on-close="handleRepeatClose(tag)">
            <span>{{ $t('week') }}{{ tag }}</span>
          </Tag>
        </div>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display: flex">
          <div class="slot-label pointer">{{ $t('action') }}</div>
          <Select v-model="form.action" style="width: 200px">
            <Option v-for="item in actions" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </div>
      </FormItem>
      <FormItem :label-width="20" v-if="form.action === 'closeAndLock'">
        <div style="display: flex; align-items: center">
          <div class="slot-label pointer">{{ $t('unlockClose') }}</div>
          <Switch :before-change="handleBeforeChange" v-model="switchBefore" style="margin: 0 20px" />
          <template v-if="switchBefore">
            <DatePicker
              @on-change="BeforestartTimeChange"
              style="width: 200px"
              v-if="form.type === 1"
              v-model="form.beforetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :editable="false"
              :clearable="false"
              type="datetime"
              :placeholder="$t('pleaseSelectDateTime')"></DatePicker>

            <TimePicker @on-change="BeforestartTimeChange" v-if="form.type === 2" v-model="beforenowTime" format="HH:mm:ss" :editable="false" :clearable="false" :placeholder="$t('anyTime')"></TimePicker>
          </template>
        </div>
        <span v-if="timeStatus" style="color: #f24e4c; margin-left: 160px">{{ $t('lockingTime') }}</span>
      </FormItem>
      <FormItem class="tr">
        <Button class="b-blue" type="primary" @click="handleSubmit" :disabled="form.mac === '' || (form.type === 2 && form.week.length === 0)">{{ $t('save') }}</Button>
        <Button @click="handleCancel">{{ $t('cancel') }}</Button>
      </FormItem>
    </Form>
    <Modal id="equipment" :title="$t('addDeviceLine')" v-model="deviceVisible" width="75%" append-to-body>
      <Device source="BuiltInTiming" @sendBuiltInTimingMac="receiveBuiltInTimingMac"></Device>
    </Modal>
    <Modal class="line" :title="$t('channelList')" v-model="lineVisible" width="60%" append-to-body>
      <LineList :mac="form.mac" :tags="tags" @sendChannels="receiveChannels" source="BuiltInTiming" v-if="lineVisible"></LineList>
      <div slot="footer"></div>
    </Modal>
    <Modal :title="$t('selectRepeat')" v-model="repeatFlag" append-to-body>
      <WeekSelection :options="form.week" @sendWeekSelection="receiveWeekSelection" @receive="receive"></WeekSelection>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import Device from '../../DetectionRules/Device.vue'
  import { queryChannels } from '@/api/common'
  import LineList from '../../Common/LineList.vue'
  import WeekSelection from '../../Common/WeekSelection'
  import { modifyTiming, associateTimerPush } from '@/api/multiManage/builtlnTimer'
  import { checkSupportTimeCloseLock } from '@/api/public'
  export default {
    props: {
      options: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        timeStatus: false,
        switchBefore: this.options.statusto ? this.options.statusto : false,
        lineListSelect: [],
        linesList: [],
        form: {
          mac: this.options.mac,
          type: this.options.weekday.length > 0 ? 2 : 1,
          time: this.options.time ? this.options.time : this.$func.getNowFormatDateTime(),
          week: this.options.weekday ? this.options.weekday : [],
          action: this.options.status,
          others: this.options.others,
          beforetime: this.options.others.relation === undefined ? '' : this.options.others.relation.time,
          autoid: this.options.autoId,
          relationId: this.options.relationId,
          tags: this.options.tags,
          addrDigitalOuts: this.options.addrDigitalOuts,
        },

        nowTime: '',
        beforenowTime: this.options.others.relation === undefined ? '' : this.options.others.relation.time,
        timingOptions: [
          {
            value: 1,
            label: this.$t('singleTiming'),
          },
          {
            value: 2,
            label: this.$t('cycleTiming'),
          },
        ],
        actions: [
          {
            value: 'true',
            label: this.$t('closing'),
          },
          {
            value: 'false',
            label: this.$t('opening'),
          },
          {
            label: this.$t('openAndLock'),
            value: 'closeAndLock',
          },
        ],
        deviceVisible: false,
        lineVisible: false,
        repeatFlag: false,
        tags: this.options.tags,
        linechangeIo: '',
        sqmodel: '',
        actionQuantity: '',
      }
    },
    mounted() {
      this.nowTime = this.options.time
      this.getLinelist(this.options.mac)
      if (this.form.others.relation !== undefined) {
        this.switchBefore = this.form.others.relation.status === 'unlockAndOpen'
        this.form.beforetime = this.form.others.relation.time
        this.beforenowTime = this.form.others.relation.time
      }
      if (this.options.addrDigitalOuts !== undefined) {
        this.sqmodel = this.options.addrDigitalOuts.split(',').map(parseFloat)
      }
    },
    methods: {
      onclear(val) {
        this.linechangeIo = ''
        this.linesList.map(val => {
          val.disabled = false
        })
      },
      BeforestartTimeChange(val) {
        this.form.beforetime = val
        let olddata = new Date(this.form.time)
        let oldtime = olddata.getTime()
        let newdata = new Date(val)
        let newtime = newdata.getTime()
        this.timeStatus = oldtime >= newtime
      },
      handleBeforeChange() {
        if (!this.switchBefore) {
          return new Promise(resolve => {
            this.$Modal.confirm({
              title: '',
              content: this.$t('caution'),
              onOk: () => {
                resolve()
              },
            })
          })
        } else {
          this.switchBefore = false
        }
      },
      getValquery(val) {
        this.sqmodel = ''
      },
      getValue(val) {
        this.tags = []
        let str = ''
        if (Array.isArray(val)) {
          val.forEach(v => {
            this.tags.push(v.split(';')[0])
            if (v.split(';')[1] === 'IO') {
              this.lineListSelect = []
              this.actions = []
              this.lineListSelect.push(`${v.split(';')[0]};${v.split(';')[1]}`)
              this.linechangeIo = v.split(';')[1]
              this.linesList.map(val => {
                if (val.lineType === 'IO') {
                  val.disabled = false
                } else {
                  val.disabled = true
                }
              })
              this.getactionquantity(`${v.split(';')[0]}`)
              this.actions = [
                {
                  label: 'ON',
                  value: '1',
                },
                {
                  label: 'OFF',
                  value: '2',
                },
                {
                  label: this.$t('inching'),
                  value: '4',
                },
              ]
            } else {
              this.linesList.map(val => {
                if (val.lineType === 'IO') {
                  val.disabled = true
                  str = `${val.title}(T3-808)`
                  if (val.title.includes('808')) {
                    val.title = val.title
                  } else {
                    val.title = str
                  }
                } else {
                  val.disabled = false
                }
              })
              this.actions = [
                {
                  value: 'true',
                  label: this.$t('closing'),
                },
                {
                  value: 'false',
                  label: this.$t('opening'),
                },
                {
                  label: this.$t('openAndLock'),
                  value: 'closeAndLock',
                },
              ]
            }
          })
        } else {
          this.tags.push(val.split(';')[0])
          if (val.split(';')[1] === 'IO') {
            this.lineListSelect = []
            this.actions = []
            this.lineListSelect.push(`${val.split(';')[0]};${val.split(';')[1]}`)
            this.linechangeIo = val.split(';')[1]
            this.linesList.map(val => {
              if (val.lineType === 'IO') {
                val.disabled = false
              } else {
                val.disabled = true
              }
            })
            this.getactionquantity(`${val.split(';')[0]}`)
            this.actions = [
              {
                label: 'ON',
                value: 1,
              },
              {
                label: 'OFF',
                value: 2,
              },
              {
                label: this.$t('inching'),
                value: 4,
              },
            ]
          }
        }
      },
      getactionquantity(v) {
        queryChannels({ mac: this.form.mac }).then(res => {
          res.datas.map(val => {
            if (val.addr === Number(v)) {
              this.actionQuantity = val.digitalOuts
            }
          })
        })
      },
      getLinelist(val) {
        queryChannels({ mac: val }).then(res => {
          this.lineListSelect = []
          if (res.success) {
            if (Array.isArray(res.datas) && res.datas.length) {
              this.linesList = res.datas.map(item => ({ addr: item.addr, title: item.title, lineType: item.lineType, disabled: false }))
              this.linesList.map(val => {
                this.options.tags.forEach(v => {
                  if (val.addr === Number(v.addr)) {
                    this.lineListSelect.push(`${val.addr};${val.lineType}`)
                  }
                })
              })
            } else {
              this.linesList = []
              this.lineListSelect = []
            }
          }
        })
      },
      handleChangeType(val) {
        this.form.type = val
        if (val === 1) {
          this.form.time = this.$func.getNowFormatDateTime()
        } else {
          this.form.time = this.options.time ? this.options.time : this.$func.getNowFormatDateTime('time')
        }
      },
      handleDevice() {
        this.deviceVisible = true
      },
      handleLine() {
        this.lineVisible = true
      },
      handleRepeat() {
        this.repeatFlag = true
      },
      handleCancel() {
        this.$emit('closeEdit', false)
      },
      handleRepeatClose(tag) {
        this.form.week.splice(this.form.week.indexOf(tag), 1)
      },
      receiveWeekSelection(val) {
        this.form.week = val
        this.repeatFlag = false
      },
      receive(val) {
        this.repeatFlag = val
      },
      receiveBuiltInTimingMac(val) {
        this.form.mac = val
        this.tags = []
        this.deviceVisible = false
        this.getLinelist(val)
      },
      receiveChannels(val) {
        this.tags = val
        this.lineVisible = false
      },
      handleCloseTag(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1)
      },
      startTimeChange(val) {
        this.form.time = val
      },
      handleSubmit() {
        let macAddrsList = [{ mac: this.form.mac, addrs: this.tags.map(item => item).join() }]
        let paramses = {
          macAddrsList: JSON.stringify(macAddrsList),
        }
        if (this.form.action === 'closeAndLock') {
          checkSupportTimeCloseLock(paramses).then(res => {
            if (res.success) {
              let noOpenList = res.data.noOpenList
              let noSupportList = res.data.noSupportList
              if (!(Array.isArray(noOpenList) && noOpenList.length) && !(Array.isArray(noSupportList) && noSupportList.length)) {
                let time = ''
                if (this.form.type === 1) {
                  time = this.form.time
                }
                if (this.form.type === 2) {
                  time = this.form.time
                  time = time.substring(time.length - 8, time.length)
                }
                let params
                const jsonData = [
                  {
                    associate: !!this.switchBefore,
                    updateTimers: [],
                    _operate_at: 4 + ':' + this.options.autoid,
                    mac_autoids: '',
                  },
                ]

                if (this.options.mac === '') {
                  jsonData[0].updateTimers.push({
                    mac: this.form.mac,
                    autoid: this.options.autoid ? this.options.autoid : 0,
                    channel: `${this.tags}`,
                    weekday: this.form.week.join(''),
                    time: time,
                    type: 1,
                    status: this.form.action,
                  })
                  if (this.switchBefore) {
                    jsonData[0].updateTimers.push({
                      mac: this.form.mac,
                      autoid: this.options.autoid ? this.options.autoid : 0,
                      channel: `${this.tags}`,

                      weekday: this.form.week.join(''),
                      time: this.form.beforetime,
                      type: 1,
                      status: 'unlockAndOpen',
                    })
                  }
                  params = jsonData
                }
                if (this.form.others.relation !== undefined) {
                  if (!this.switchBefore) {
                    jsonData[0].updateTimers.push({
                      mac: this.form.mac,
                      autoid: this.options.autoid ? this.options.autoid : 0,
                      channel: this.tags
                        .map(item => {
                          return item.addr
                        })
                        .join(','),
                      weekday: this.form.week.join(''),
                      time: time,
                      type: 1,
                      status: this.form.action,
                      relationId: this.form.relationId,
                    })
                    jsonData[0].mac_autoids = [this.options.mac, this.options.others.relation.autoId].join('_')
                  }
                }
                if (this.options.mac !== '' && this.form.others.relation === undefined) {
                  jsonData.updateTimers.push({
                    mac: this.form.mac,
                    autoid: this.options.autoid ? this.options.autoid : 0,
                    channel: this.tags
                      .map(item => {
                        return item.addr
                      })
                      .join(','),
                    weekday: this.form.week.join(''),
                    time: time,
                    type: 1,
                    relationId: this.form.relationId,
                    status: this.form.action,
                  })
                  if (this.switchBefore) {
                    jsonData[0].updateTimers.push({
                      mac: this.form.mac,
                      autoid: 0,
                      channel: this.tags
                        .map(item => {
                          return item.addr
                        })
                        .join(','),
                      weekday: this.form.week.join(''),
                      time: this.form.beforetime,
                      type: 1,
                      status: 'unlockAndOpen',
                    })
                  }
                  params = jsonData
                }
                associateTimerPush(params)
                  .then(res => {
                    if (res.success) {
                      this.$Message.success({
                        content: res.message,
                      })
                      this.$emit('closeEdit', true)
                      // if (this.form.action === 'closeAndLock') {
                      //     this.$emit('openTooltipFlag', this.form.mac, this.tags)
                      // }
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
              } else if (!(Array.isArray(noOpenList) && noOpenList.length) && Array.isArray(noSupportList) && noSupportList.length && noSupportList.length < this.tags.length) {
                let time = ''
                if (this.form.type === 1) {
                  time = this.form.time
                }
                if (this.form.type === 2) {
                  time = this.form.time
                  time = time.substring(time.length - 8, time.length)
                }
                let params
                const jsonData = [
                  {
                    associate: !!this.switchBefore,
                    updateTimers: [],
                    _operate_at: 4 + ':' + this.options.autoid,
                    mac_autoids: '',
                  },
                ]

                if (this.options.mac === '') {
                  jsonData[0].updateTimers.push({
                    mac: this.form.mac,
                    autoid: this.options.autoid ? this.options.autoid : 0,
                    channel: `${this.tags}`,
                    weekday: this.form.week.join(''),
                    time: time,
                    type: 1,
                    status: this.form.action,
                  })
                  if (this.switchBefore) {
                    jsonData[0].updateTimers.push({
                      mac: this.form.mac,
                      autoid: this.options.autoid ? this.options.autoid : 0,
                      channel: this.tags
                        .map(item => {
                          return item.addr
                        })
                        .join(','),
                      weekday: this.form.week.join(''),
                      time: this.form.beforetime,
                      type: 1,
                      status: 'unlockAndOpen',
                    })
                  }
                  params = jsonData
                }
                if (this.form.others.relation !== undefined) {
                  if (!this.switchBefore) {
                    jsonData[0].updateTimers.push({
                      mac: this.form.mac,
                      autoid: this.options.autoid ? this.options.autoid : 0,
                      channel: `${this.tags}`,
                      weekday: this.form.week.join(''),
                      time: time,
                      type: 1,
                      status: this.form.action,
                      relationId: this.form.relationId,
                    })
                    jsonData[0].mac_autoids = [this.options.mac, this.options.others.relation.autoId].join('_')
                  }
                }
                if (this.options.mac !== '' && this.form.others.relation === undefined) {
                  jsonData[0].updateTimers.push({
                    mac: this.form.mac,
                    autoid: this.options.autoid ? this.options.autoid : 0,
                    channel: `${this.tags}`,
                    weekday: this.form.week.join(''),
                    time: time,
                    type: 1,
                    relationId: this.form.relationId,
                    status: this.form.action,
                  })
                  if (this.switchBefore) {
                    jsonData[0].updateTimers.push({
                      mac: this.form.mac,
                      autoid: 0,
                      channel: this.tags
                        .map(item => {
                          return item.addr
                        })
                        .join(','),
                      weekday: this.form.week.join(''),
                      time: this.form.beforetime,
                      type: 1,
                      status: 'unlockAndOpen',
                    })
                  }
                  params = jsonData
                }
                associateTimerPush(params)
                  .then(res => {
                    if (res.success) {
                      this.$Message.success({
                        content: res.message,
                      })
                      this.$emit('closeEdit', true)
                      if (this.form.action === 'closeAndLock') {
                        this.$emit('openTooltipFlag', this.form.mac, this.tags, 'three', noSupportList)
                      }
                      // if (this.form.action === 'closeAndLock') {
                      //     this.$emit('openTooltipFlag', this.form.mac, this.tags)
                      // }
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
              } else if (!(Array.isArray(noOpenList) && noOpenList.length) && Array.isArray(noSupportList) && noSupportList.length === this.tags.length) {
                this.$emit('closeEdit', true)
                this.$emit('openTooltipFlag', this.form.mac, this.tags, 'two', noSupportList)
              } else if (Array.isArray(noOpenList) && noOpenList.length) {
                let time = ''
                if (this.form.type === 1) {
                  time = this.form.time
                }
                if (this.form.type === 2) {
                  time = this.form.time
                  time = time.substring(time.length - 8, time.length)
                }
                let params
                const jsonData = [
                  {
                    associate: !!this.switchBefore,
                    updateTimers: [],
                    _operate_at: 4 + ':' + this.options.autoid,
                    mac_autoids: '',
                  },
                ]

                if (this.options.mac === '') {
                  jsonData[0].updateTimers.push({
                    mac: this.form.mac,
                    autoid: this.options.autoid ? this.options.autoid : 0,
                    channel: `${this.tags}`,
                    weekday: this.form.week.join(''),
                    time: time,
                    type: 1,
                    status: this.form.action,
                  })
                  if (this.switchBefore) {
                    jsonData[0].updateTimers.push({
                      mac: this.form.mac,
                      autoid: this.options.autoid ? this.options.autoid : 0,
                      channel: `${this.tags}`,
                      weekday: this.form.week.join(''),
                      time: this.form.beforetime,
                      type: 1,
                      status: 'unlockAndOpen',
                    })
                  }
                  params = jsonData
                }
                if (this.form.others.relation !== undefined) {
                  if (!this.switchBefore) {
                    jsonData[0].updateTimers.push({
                      mac: this.form.mac,
                      autoid: this.options.autoid ? this.options.autoid : 0,
                      channel: `${this.tags}`,
                      weekday: this.form.week.join(''),
                      time: time,
                      type: 1,
                      status: this.form.action,
                      relationId: this.form.relationId,
                    })
                    jsonData.mac_autoids = [this.options.mac, this.options.others.relation.autoId].join('_')
                  }
                }
                if (this.options.mac !== '' && this.form.others.relation === undefined) {
                  jsonData[0].updateTimers.push({
                    mac: this.form.mac,
                    autoid: this.options.autoid ? this.options.autoid : 0,
                    channel: `${this.tags}`,
                    weekday: this.form.week.join(''),
                    time: time,
                    type: 1,
                    relationId: this.form.relationId,
                    status: this.form.action,
                  })
                  if (this.switchBefore) {
                    jsonData[0].updateTimers.push({
                      mac: this.form.mac,
                      autoid: 0,
                      channel: `${this.tags}`,
                      weekday: this.form.week.join(''),
                      time: this.form.beforetime,
                      type: 1,
                      status: 'unlockAndOpen',
                    })
                  }
                  params = jsonData
                }
                associateTimerPush(params)
                  .then(res => {
                    if (res.success) {
                      this.$Message.success({
                        content: res.message,
                      })
                      this.$emit('closeEdit', true)
                      if (this.form.action === 'closeAndLock') {
                        this.$emit('openTooltipFlag', this.form.mac, this.tags, 'one', noSupportList, noOpenList)
                      }
                      // if (this.form.action === 'closeAndLock') {
                      //     this.$emit('openTooltipFlag', this.form.mac, this.tags)
                      // }
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
            }
          })
        } else {
          let time = ''
          if (this.form.type === 1) {
            time = this.form.time
          }
          if (this.form.type === 2) {
            time = this.form.time
            time = time.substring(time.length - 8, time.length)
          }

          if (this.form.others.relation !== undefined) {
            let params
            const jsonData = [
              {
                associate: !!this.switchBefore,
                updateTimers: [],
                _operate_at: 4 + ':' + this.options.autoid,
                mac_autoids: '',
              },
            ]
            jsonData[0].associate = false
            jsonData[0].mac_autoids = `${[this.options.mac, this.options.autoid].join('_')},${[this.options.mac, this.options.others.relation.autoId].join('_')}`
            jsonData[0].updateTimers.push({
              mac: this.form.mac,
              autoid: 0,
              channel: `${this.tags}`,
              weekday: this.form.week.join(''),
              time: time,
              type: 1,
              status: this.form.action,
            })

            params = jsonData
            associateTimerPush(params)
              .then(res => {
                if (res.success) {
                  this.$Message.success({
                    content: res.message,
                  })
                  this.$emit('closeEdit', true)
                  // if (this.form.action === 'closeAndLock') {
                  //     this.$emit('openTooltipFlag', this.form.mac, this.tags)
                  // }
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
            if (this.lineListSelect.length === 0) {
              this.$Message.error({
                content: this.$t('pleaseSelectLine2'),
              })
              return
            }
            if (this.linechangeIo !== '' && this.sqmodel === '') {
              this.$Message.error({
                content: this.$t('plsSwitchOutput'),
              })
              return
            }

            let type = this.linechangeIo ? 4 : 1
            let params = {
              mac: this.form.mac,
              autoid: this.options.autoid ? this.options.autoid : 0,
              channel: `${this.tags}`,
              weekday: this.form.week.join(''),
              time: time,
              type: type,
              status: this.form.action,
              digitalOut: `${this.sqmodel}`,
              _operate_at: 4 + ':' + this.options.autoid,
            }
            modifyTiming(params)
              .then(res => {
                if (res.success) {
                  this.$Message.success({
                    content: res.message,
                  })
                  this.$emit('closeEdit', true)
                  // if (this.form.action === 'closeAndLock') {
                  //     this.$emit('openTooltipFlag', this.form.mac, this.tags)
                  // }
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
        }
      },
    },
    components: {
      Device,
      LineList,
      WeekSelection,
    },
    watch: {
      tags: {
        handler(newVal) {
          if (newVal.length === 0) {
            this.linesList.map(val => {
              val.disabled = false
              val.title = val.title.split('(')[0]
            })
          }
        },
      },
    },
  }
</script>
<style lang="less" scoped>
  #edit {
    .Form-item__label {
      color: #333;
    }

    .el-tag .el-tag {
      margin-left: 5px;
    }
    .slot-label {
      width: 80px;
      text-align: center;
    }
    .btn {
      background: rgba(0, 126, 255, 0.1);
      border: 1px solid #007eff;
      border-radius: 5px;
      color: #007eff;
      margin-right: 10px;
    }
    .ivu-tag {
      height: 32px;
      line-height: 32px;
    }
    .tr {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0;

      Button {
        margin: 5px;
      }
    }
  }
  .line {
    /deep/.ivu-modal-footer {
      padding: 0px;
      border: none;
    }
  }
</style>
