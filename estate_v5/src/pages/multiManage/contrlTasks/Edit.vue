<template>
  <div id="edit">
    <div class="title">
      <div class="description-title">
        <i class="icon-v5 icon-v5-huifu"></i>
        {{ $t('explanation') + '：' }}
      </div>
      <div class="description-text">
        <div class="description">
          {{ '1. ' + $t('description1') }}
        </div>
        <div class="description">
          {{ '2. ' + $t('description3') }}
        </div>
      </div>
    </div>
    <Form :model="form" style="margin-top: 20px">
      <FormItem :label-width="0">
        <div style="display: flex">
          <div class="pointer w80">{{ $t('device') }}</div>
          <Button class="btn" @click="handleDevice">{{ $t('clickselect') }}</Button>
          <Input v-model="form.mac" readonly style="width: 300px"></Input>
        </div>
      </FormItem>
      <FormItem v-show="form.mac" :label-width="0">
        <div style="display: flex">
          <div class="pointer w80">{{ $t('line') }}</div>
          <Button class="btn" @click="handleLine">{{ $t('selectLine') }}</Button>
          <div style="word-break: hyphenate">
            <Tag v-show="tag.title.length > 0" v-for="(tag, index) in tags" :key="index" :closable="true" @on-close="handleCloseTag(tag)">
              {{ tag.title }}
            </Tag>
          </div>
        </div>
      </FormItem>
      <FormItem :label-width="0" v-show="isPorts">
        <div style="display: flex">
          <div class="pointer w80">{{ $t('port') }}</div>
          <Col :span="13">
            <Select :clearable="true" v-model="form.portes" multiple style="width: 250px" :max-tag-count="2">
              <Option v-for="item in digOutsMultiple" :key="item.value" :label="item.label" :value="item.value"></Option>
            </Select>
          </Col>
        </div>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display: flex">
          <div class="pointer w80">{{ $t('repeat') }}</div>
          <Button class="btn" @click="handleRepeat">{{ $t('clickselect') }}</Button>
          <Tag v-for="tag in form.week" :key="tag" :closable="true" :disable-transitions="false" @on-close="handleRepeatClose(tag)">
            <span v-show="tag === '日'">{{ $t('sunday') }}</span>
            <span v-show="tag === '一'">{{ $t('monday') }}</span>
            <span v-show="tag === '二'">{{ $t('tuesday') }}</span>
            <span v-show="tag === '三'">{{ $t('wednesday') }}</span>
            <span v-show="tag === '四'">{{ $t('thursday') }}</span>
            <span v-show="tag === '五'">{{ $t('friday') }}</span>
            <span v-show="tag === '六'">{{ $t('saturday') }}</span>
          </Tag>
        </div>
      </FormItem>

      <FormItem :label-width="0">
        <div style="display: flex">
          <div class="pointer" :class="$store.state.locale !== 'zh-CN' ? 'w100' : 'w80'">{{ $t('timeDelay') }}</div>
          <Col :span="3" style="padding-left: 0">
            <Select :clearable="true" v-model="form.type">
              <Option v-for="item in trigger" :key="item.value" :label="item.label" :value="item.value"></Option>
            </Select>
          </Col>
          <Col :span="3" style="margin-left: 10px">
            <Select :clearable="true" v-model="form.triggertype">
              <Option v-for="item in triggerType" :key="item.value" :label="item.label" :value="item.value"></Option>
            </Select>
          </Col>
          <Col>
            <Input style="margin-left: 10px" :class="$store.state.locale !== 'zh-CN' ? 'w120' : 'w80'" v-model="form.time">
              <i slot="suffix" style="font-style: normal">{{ $t('sec') }}</i>
            </Input>
            <!-- <span  style="margin-left:20px">{{ '(' + $t('placeholder.positiveNumber') + ')' }}</span> -->
          </Col>
        </div>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display: flex">
          <div class="pointer w80">{{ $t('action') }}</div>
          <Col :span="13">
            <Select :clearable="true" v-model="form.action" style="width: 200px">
              <Option v-for="item in actions" :key="item.value" :label="item.label" :value="item.value"></Option>
            </Select>
          </Col>
        </div>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display: flex">
          <div class="pointer" :class="$store.state.locale !== 'zh-CN' ? 'w200' : ''">{{ $t('setting') + $t('latLng') }}</div>
          <Button class="btn ml-10" @click="handleSetUp">{{ $t('click') + $t('setting') }}</Button>
          <Button type="text" @click="openNewlatlong" style="color: #0071ce">
            <ins>{{ $t('longitudeLatitudeQuery') }}</ins>
          </Button>
        </div>
      </FormItem>
      <FormItem :label-width="0">
        <div style="display: flex">
          <div class="pointer" :class="$store.state.locale !== 'zh-CN' ? 'w100' : 'w80'">{{ $t('monitorDuration') }}</div>
          <Input style="width: 199px" oninput="if(value>86399) {value=86399} else if (value<0) {value=0}" v-model="form.monitorTime">
            <i slot="suffix" style="font-style:normal;margin-right">{{ $t('sec') }}</i>
          </Input>
          <TooltipVue style="display: inline-block; margin-left: -5px" :tooltipText="tooltipTexts"></TooltipVue>
        </div>
      </FormItem>
      <FormItem>
        <Col :span="24" class="tr">
          <Button class="b-blue" @click="handleSubmit" :disabled="form.mac === '' || tags.length === 0 || form.week.length === 0 || form.action === '' || form.time === ''">{{ $t('save') }}</Button>
          <Button @click="handleCloseEdit">{{ $t('cancel') }}</Button>
        </Col>
      </FormItem>
    </Form>

    <Modal :title="$t('addDeviceLine')" :close-on-click-modal="false" custom-class="custom-device-dialog" v-model="deviceVisible" width="75%" append-to-body>
      <Device source="BuiltInTiming" @sendBuiltInTimingMac="receiveBuiltInTimingMac" attrFlag="attrFlag"></Device>
    </Modal>
    <Modal :title="$t('channelList')" v-model="lineVisible" width="60%" append-to-body>
      <LineList :mac="form.mac" :tags="tags" @sendChannels="receiveChannels" @sendCancel="sendCancel" source="BuiltInTiming" v-if="lineVisible"></LineList>
      <div slot="footer"></div>
    </Modal>
    <Modal :title="$t('select') + $t('repeat')" v-model="repeatFlag" append-to-body>
      <WeekSelection :options="form.week" @receive="receive" @sendWeekSelection="receiveWeekSelection" @receiveWeekSelectionCancel="receiveWeekSelectionCancel"></WeekSelection>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import Device from '../../DetectionRules/Device'
  import LineList from './lalongLinelist.vue'
  import WeekSelection from '../../Common/WeekSelection'
  import { queryChannels } from '@/api/common'
  import { modifyTiming, queryPageAuth } from '@/api/multiManage/latlongTimer'
  export default {
    props: {
      options: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        tooltipTexts: this.$t('tooltipTexts1'),
        Urls: 'https://jingweidu.bmcx.com/',
        isPorts: false,
        form: {
          mac: this.options.mac,
          triggerTime: '',
          time: this.options.time > 0 ? this.options.time : this.options.time * -1,
          week: [...this.options.weekday],
          action: '',
          type: this.options.type === 6 ? 3 : this.options.type === 5 ? 2 : this.options.type,
          monitorTime: this.options.monitorTime,
          triggertype: this.options.time > 0 ? 2 : 1,
          portes: [],
        },
        digOutsMultiple: [],
        triggerType: [
          {
            value: 1,
            label: this.$t('advance'),
          },
          {
            value: 2,
            label: this.$t('delay'),
          },
        ],
        trigger: [
          {
            value: 2,
            label: this.$t('sunrise'),
          },
          {
            value: 3,
            label: this.$t('sunset'),
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
        ],
        ioActions: [
          {
            value: 1,
            label: 'ON',
          },
          {
            value: 2,
            label: 'OFF',
          },
          {
            value: 4,
            label: this.$t('inching'),
          },
        ],
        setupFlag: false,
        monitorFlag: false,
        deviceVisible: false,
        lineVisible: false,
        repeatFlag: false,
        newDigArr: [],
        tags: this.options.tags,
      }
    },
    mounted() {
      this.init()
      if (this.form.monitorTime) {
        this.monitorFlag = true
      }

      this.getPosrList()
    },
    methods: {
      openNewlatlong() {
        window.open(this.Urls, '_blank')
      },
      init() {
        let parmas = {
          resKeys: 'AUTH_PROJECT_USE',
          operKeys: 'ADVANCED_TIMING_MONITOR',
        }

        queryPageAuth(parmas).then(res => {
          if (res.success) {
            this.setupFlag = res.data[0].result
            if (this.form.monitorTime.length > 0) {
              this.monitorFlag = true
            }
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      getPosrList() {
        if (this.options.digitalOuts) {
          queryChannels({ mac: this.options.mac }).then(res => {
            if (res.success) {
              this.newDigArr = res.datas
                .filter(item => item.addr === +this.options.tags[0].addr)
                .map(itm => itm.digitalOuts)
                .flat(Infinity)
              this.digOutsMultiple = this.newDigArr.map(item => ({ value: item.index, label: item.name }))
              this.form.portes = this.options.digitalOuts.split(',').map(item => +item)
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
        }

        if ((this.options.digitalOuts && this.options.digitalOuts.length) > 0 || (this.options.isDigtalouts && this.options.isDigtalouts.length > 0)) {
          this.isPorts = true
        } else {
          this.isPorts = false
        }

        if (this.options.status) {
          this.form.action = this.options.status === 'true' ? 'true' : this.options.status === 'false' ? 'false' : +this.options.status
        }
        if (this.options.autoid) {
          if (this.options.status === '1' || this.options.status === '2' || this.options.status === '4') {
            this.actions = this.ioActions
            this.form.action = +this.options.status
          } else {
            this.actions = [
              {
                value: 'true',
                label: this.$t('closing'),
              },
              {
                value: 'false',
                label: this.$t('opening'),
              },
            ]
            this.form.action = this.options.status
          }
        }
        if (this.options.isDigtalouts && this.options.isDigtalouts.length !== 0) {
          this.digOutsMultiple = this.options.isDigtalouts
          this.$nextTick(() => {
            this.form.portes = this.options.portes
          })
          this.actions = this.ioActions
        }
      },
      handleCloseEdit() {
        this.$emit('closeEdit', false)
      },
      handleChangeType(val) {
        this.form.type = val
        if (this.form.type === 1) {
          this.form.time = this.$func.getNowFormatDateTime()
        } else {
          this.form.time = this.options.time ? this.options.time : this.$func.getNowFormatDateTime('time')
        }
      },
      handleAdvanced() {
        this.monitorFlag = !this.monitorFlag
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
      handleRepeatClose(tag) {
        this.form.week.splice(this.form.week.indexOf(tag), 1)
      },
      receiveWeekSelection(val) {
        this.form.week = val
        this.repeatFlag = false
      },
      receiveWeekSelectionCancel() {
        this.repeatFlag = false
      },
      sendCancel() {
        this.lineVisible = false
      },
      receiveBuiltInTimingMac(val) {
        this.form.mac = val
        this.tags = []
        this.deviceVisible = false
      },
      receiveChannels(val) {
        if (val.length === 1 && val[0].lineType === 'IO' && Array.isArray(val[0].digitalOuts)) {
          this.digOutsMultiple = val[0].digitalOuts.map(item => ({ value: item.index, label: item.name }))
          this.isPorts = true
          this.actions = [
            {
              value: 1,
              label: 'ON',
            },
            {
              value: 2,
              label: 'OFF',
            },
            {
              value: 4,
              label: this.$t('inching'),
            },
          ]
          this.form.portes = []
        } else {
          this.actions = [
            {
              value: 'true',
              label: this.$t('closing'),
            },
            {
              value: 'false',
              label: this.$t('opening'),
            },
          ]
          this.isPorts = false
        }
        this.tags = val
        this.lineVisible = false
      },
      handleCloseTag(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1)
        if (this.tags.length === 0 && this.isPorts) {
          this.isPorts = false
          this.form.portes = []
        }
      },
      receive() {
        this.repeatFlag = false
      },
      handleSubmit() {
        let time = ''
        if (this.form.triggertype === 1) {
          time = -this.form.time
        } else {
          time = this.form.time
        }
        let portFlag = false
        if (this.tags.length === 1 && this.tags[0].lineType === 'IO') {
          if (!this.form.portes.length) {
            return this.$Message.error({
              content: this.$t('pleaseSelectPortFirst'),
            })
          } else {
            portFlag = true
          }
        }
        let parType = this.form.type === 2 ? '5' : '6'
        let params = {
          mac: this.form.mac,
          autoid: this.options.autoid ? this.options.autoid : 0,
          channel: this.tags
            .map(item => {
              return item.addr
            })
            .join(','),
          weekday: this.form.week.join(''),
          time: time,
          type: portFlag ? parType : this.form.type,
          status: this.form.action,
          digitalOut: portFlag ? this.form.portes.join(',') : '',
          _operate_at: 4 + ':' + this.options.autoid,
          monitorTime: this.form.monitorTime,
        }
        modifyTiming(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: res.message,
            })
            setTimeout(() => {
              this.$emit('queryList', true)
              this.$emit('closeEdit', true)
            }, 300)
          } else if (res.code === '-1') {
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },

      handleSetUp() {
        if (this.form.mac === '') {
          this.$Message.error({
            content: this.$t('pleaseSelectADevice'),
          })
          return false
        }
        this.form.flag = 'ture'
        this.form.autoid = this.options.autoid ? this.options.autoid : 0
        this.form.tags = this.tags
        if (!this.isPorts) {
        } else {
          this.form['isDigtalouts'] = this.digOutsMultiple || ''
        }

        this.$emit('handleLatitudeLongitude', this.form)
      },
    },
    watch: {
      monitorFlag: {
        handler(newVal, oldVal) {
          if (!newVal) {
            this.form.monitorTime = ''
          }
          if (newVal) {
            this.form.monitorTime = this.options.monitorTime
          }
        },
      },
    },
    components: {
      Device,
      LineList,
      WeekSelection,
    },
  }
</script>
<style lang="less" scoped>
  .form {
    display: flex;
    /deep/.ivu-input {
      width: 200px;
    }
  }
  .mr {
    margin-right: 20px;
  }
  .tr {
    display: flex;
    justify-content: flex-end;
    Button {
      margin: 0 5px;
      width: 80px;
      height: 36px;
      border-radius: 5px;
    }
  }
  .slot-label {
    text-align: center;
  }
  .w80 {
    width: 80px;
  }
  .w100 {
    width: 100px;
  }
  .w120 {
    width: 120px;
  }
  .w200 {
    width: 200px;
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
  .title {
    background: rgba(153, 153, 153, 0.05);
    border: 1px solid #999999;
    font-size: 14px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    display: flex;
    padding: 10px;
    .description-title {
      // width: 66px;
      display: flex;
    }
    .description-text {
    }
  }
  /deep/.ivu-modal-footer {
    border: none;
    padding: 0 !important;
  }
  /deep/.ivu-input-suffix {
    width: 60px;
    text-align: right;
    padding-right: 5px;
  }
</style>
