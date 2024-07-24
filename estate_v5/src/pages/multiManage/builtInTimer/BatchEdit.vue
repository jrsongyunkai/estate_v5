<template>
  <div id="BatchEdit">
    <Table class="mb-20 device-wrap" :data="options" :columns="columns" max-height="280" :header-cell-style="{ 'text-align': 'center' }" style="width: 100%">
      <template slot-scope="{ row }" slot="mac">
        <div>{{ row.mac }}</div>
        <div>{{ row.others.name }}</div>
      </template>
      <template slot-scope="{ row }" slot="others.address">
        <div>{{ row.others.address }}</div>
      </template>
      <template slot-scope="{ row, index }" slot="others.titles">
        <Button type="text" class="mr-15 tl" @click="handleLine(row, index)">+{{ $t('selectLine') }}</Button>
        <Tag v-show="row.others.titles.length > 0" v-for="(tag, index) in row.others.titles" :key="index" :closable="true" @on-close="handleCloseTag(index, row)">
          {{ tag }}
        </Tag>
      </template>
    </Table>
    <Form :model="form" :label-width="120" style="margin-top: 20px">
      <FormItem :label="$t('timingType') + '：'">
        <Select :clearable="true" v-model="form.type" @on-change="handleChangeType" style="width: 200px">
          <Option :label="item.label" v-for="item in timingOptions" :key="item.value" :value="item.value"></Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('executionTime') + '：'">
        <DatePicker v-if="form.type === 1" :value="form.time" style="width: 199px" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" :clearable="false" type="datetime" :placeholder="$t('pleaseSelectDateTime')"></DatePicker>
        <TimePicker v-if="form.type === 2" style="width: 199px" :value="form.time" format="HH:mm" value-format="HH:mm:ss" :editable="false" :clearable="false" :placeholder="$t('anyTime')"></TimePicker>
      </FormItem>
      <FormItem v-if="form.type === 2" :label="this.$t('selectRepeat') + '：'">
        <Checkbox :indeterminate="isIndeterminate" v-model="checkAll" @on-change="handleCheckAllChange">{{ $t('selectAll') }}</Checkbox>

        <CheckboxGroup v-model="form.weekday" @on-change="handleCheckedTypesChange">
          <Checkbox v-for="item in weekDays" :label="item.value" :key="item.value">{{ item.label }}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem :label="$t('performAction') + '：'">
        <Select :clearable="true" v-model="form.action" style="width: 200px">
          <template v-if="isLine">
            <Option v-for="item in actionsEight" :key="item.value" :label="item.label" :value="item.value"></Option>
          </template>
          <template v-else>
            <Option v-for="item in actions" :key="item.value" :label="item.label" :value="item.value"></Option>
          </template>
        </Select>
      </FormItem>
      <FormItem v-if="form.action === 'closeAndLock'" :label="$t('unlockClose') + '：'">
        <div>
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

            <TimePicker @on-change="BeforestartTimeChange" v-if="form.type === 2" v-model="form.beforetime" format="HH:mm:ss" :editable="false" :clearable="false" :placeholder="$t('anyTime')"></TimePicker>
          </template>
        </div>

        <span v-if="timeStatus" style="color: #f24e4c; margin-left: 80px">{{ $t('lockingTime') }}</span>
      </FormItem>
      <FormItem>
        <Button class="b-blue" @click="onSubmit" style="margin-right: 10px">{{ $t('save') }}</Button>
        <Button @click="handleCancel">{{ $t('cancel') }}</Button>
      </FormItem>
    </Form>
    <Modal :title="$t('channelList')" v-model="lineVisible" width="60%" append-to-body>
      <LineList :mac="lineMac" :tags="tags" @sendChannels="receiveChannels" source="BuiltInTiming" v-if="lineVisible"></LineList>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import LineList from '../../Common/LineList.vue'
  import { batchModifyTiming, associateTimerPush } from '@/api/multiManage/builtlnTimer'

  export default {
    components: { LineList },
    props: {
      options: {
        type: [Object, Array],
        default() {
          return []
        },
      },
    },
    data() {
      return {
        timeStatus: false,
        switchBefore: false,
        form: {
          type: '',
          time: '',
          weekday: [],
          action: '',
          beforetime: '',
        },
        beforenowTime: '',
        lineMac: '',
        tags: [],
        index: 0,
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
        isIndeterminate: false,
        checkAll: false,
        lineVisible: false,
        weekDays: [
          {
            value: '一',
            label: this.$t('sunday'),
          },
          {
            value: '二',
            label: this.$t('monday'),
          },
          {
            value: '三',
            label: this.$t('tuesday'),
          },
          {
            value: '四',
            label: this.$t('wednesday'),
          },
          {
            value: '五',
            label: this.$t('thursday'),
          },
          {
            value: '六',
            label: this.$t('friday'),
          },
          {
            value: '日',
            label: this.$t('saturday'),
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
        actionsEight: [
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
        ],
        columns: [
          {
            title: this.$t('equipmentNo'),
            slot: 'mac',
            align: 'center',
          },
          {
            title: this.$t('place'),
            slot: 'others.address',
            align: 'center',
          },
          {
            title: this.$t('line'),
            slot: 'others.titles',
            align: 'center',
          },
        ],
      }
    },
    computed: {
      isLine() {
        let flag = false
        this.options.map(item => {
          if (item.digitalOuts === '2') {
            flag = true
          }
        })
        return flag
      },
    },
    mounted() {},
    methods: {
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
      handleChangeType(val) {
        this.form.type = val
        if (this.form.type === 1) {
          this.form.time = this.$func.getNowFormatDateTime()
        } else {
          this.form.time = this.$func.getNowFormatDateTime('time')
        }
      },
      handleCheckAllChange(val) {
        this.form.weekday = val ? [this.$t('sunday'), this.$t('monday'), this.$t('tuesday'), this.$t('wednesday'), this.$t('thursday'), this.$t('friday'), this.$t('saturday')] : []
        this.isIndeterminate = false
      },
      handleCheckedTypesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.weekDays.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekDays.length
      },
      onSubmit() {
        if (this.form.action === 'closeAndLock') {
          let time
          time = this.form.time
          let params
          const jsonData = []
          this.options.map(element => {
            if (!this.switchBefore) {
              jsonData.push({
                associate: !!this.switchBefore,
                updateTimers: [
                  {
                    mac: element.mac,
                    autoid: element.autoId ? element.autoId : 0,
                    channel: `${element.channelAddrs}`,
                    weekday: this.form.weekday.join(''),
                    time: time,
                    type: 1,
                    status: this.form.action,
                  },
                ],
                _operate_at: 4 + ':',
                mac_autoids: '',
              })
            } else {
              jsonData.push({
                associate: !!this.switchBefore,
                updateTimers: [
                  {
                    mac: element.mac,
                    autoid: element.autoId ? element.autoId : 0,
                    channel: `${element.channelAddrs}`,
                    weekday: this.form.weekday.join(''),
                    time: time,
                    type: 1,
                    status: this.form.action,
                  },
                  {
                    mac: element.mac,
                    autoid: 0,
                    channel: `${element.channelAddrs}`,
                    weekday: this.form.weekday.join(''),
                    time: this.form.beforetime,
                    type: 1,
                    status: 'unlockAndOpen',
                  },
                ],
                _operate_at: 4 + ':',
                mac_autoids: '',
              })
            }
          })

          params = jsonData
          associateTimerPush(params)
            .then(res => {
              if (res.success) {
                this.$Message.success({
                  content: res.message,
                })
                this.$emit('closeEdit', false)
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
          let typeMsg = this.$t('submitCommand')
          if (this.form.time === '' || this.form.action === '') {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return
          }
          if (this.form.type === 2 && this.form.weekday.length === 0) {
            this.$Message.error({
              content: this.$t('uninformation'),
            })
            return
          }
          let addrs = this.options.map(element => {
            return element.channelAddrs.join(',')
          })
          let macs = this.options.map(element => {
            return element.mac
          })
          let autoIds = this.options.map(element => {
            return element.autoId
          })
          let operates = this.options.map(element => {
            return 4 + ':' + element.autoId
          })
          let week = this.form.weekday.map(element => {
            return element
          })
          let time = ''
          if (this.form.time.length === 8 || 19) {
            let arr = this.form.time.split(':')
            time = arr.pop()
            time = arr.join(':') + ':00'
          }
          let parmas = {
            macs: macs.join('_'),
            channels: addrs.join('_'),
            autoids: autoIds.join('_'),
            weekDay: week.join(''),
            time: time,
            status: this.form.action,
            _operate_at: operates.join('_'),
          }
          batchModifyTiming(parmas).then(res => {
            if (res.success) {
              this.$Message.success({
                content: res.message,
              })
            } else if (res.code === '-1') {
            } else {
              let errMsg =
                res.data !== undefined && res.data.length > 0
                  ? res.data.split('<br/>').map(item => {
                      if (item.indexOf(':0') !== -1) {
                        item = item.split(':0').join('')
                        return `<div style="color: #67C23A">${item + ':\xa0' + typeMsg}</div>`
                      } else {
                        return `<div style="color: #F56C6C">${item}</div>`
                      }
                    })
                  : res.message
              this.$Modal.error({
                content: res.data !== undefined && res.data.length > 0 ? errMsg.join('\n') : errMsg,
              })
            }
          })
          // this.$emit('closeBatchEdit', true)
          this.$emit('closeEdit', false)
        }
      },
      handleCancel() {
        this.$emit('closeEdit', false)
        this.$emit('closeBatchEdit', true)
      },
      receiveChannels(val) {
        this.options[this.index].channelAddrs = val.map(item => {
          return item.addr
        })
        this.options[this.index].others.titles = val.map(item => {
          return item.title
        })
        this.lineVisible = false
        this.$Message.success({
          content: this.$t('save') + this.$t('success'),
        })
      },
      handleLine(row, index) {
        this.tags = []
        this.tags = row.channelAddrs.map((item, index) => {
          return {
            addr: item,
            title: row.others.titles[index],
          }
        })
        this.index = index
        this.lineVisible = true
        this.lineMac = row.mac
      },
      handleCloseTag(index, row) {
        row.others.titles.splice(index, 1)
        row.channelAddrs.splice(index, 1)
      },
    },
    watch: {},
  }
</script>
