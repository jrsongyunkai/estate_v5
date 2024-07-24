<template>
  <div class="prjectRoad">
    <div class="header">{{ $t('projectRoadTip1') }}</div>
    <div class="tab">
      <span>{{ $t('projectRoadMode') }}:</span>
      <div style="margin-left: 10px">
        <Button v-for="(item, index) in ButtonList" :key="index" class="ml-10" :class="{ active: active === index + 1 }" @click="selectType(index)">{{ item }}</Button>
      </div>
      <TooltipVue>
        <div>
          <p>{{ $t('projectRoadTip2') }}</p>
          <p>{{ $t('projectRoadTip3') }}</p>
        </div>
      </TooltipVue>
    </div>
    <div class="content">
      <div class="flex-1">
        <div class="handmove">
          <div style="min-width: 60px">{{ $t('projectRoad') }}:</div>
          <div class="treeContent tree-content">
            <vue-easy-tree
              ref="vueEasyRef"
              height="calc(100vh - 340px)"
              v-loading="loading"
              element-loading-background="rgba(0, 0, 0, 0)"
              node-key="id"
              :item-size="30"
              :data="deviceTree"
              :show-checkbox="active === 2"
              :indent="10"
              check-strictly
              highlight-current
              @check="checkClick"
              :expand-on-click-node="false"
              :check-on-click-node="true">
              <div class="custom-tree-node" slot-scope="{ data }">
                <div class="title-text" :class="{ noWhole: checkedKeys.includes(data.id) && data.addr }" v-textRoll>{{ data.label }}</div>
                <span class="main-load-tag" v-if="checkedKeys.includes(data.id) && data.addr">{{ $t('projectRoad') }}</span>
              </div>
            </vue-easy-tree>
          </div>
        </div>
      </div>
      <div class="flex-1" style="min-width: 500px">
        <div class="form-content">
          <Form label-position="right" :label-width="140">
            <div class="form-title">{{ $t('timePeriodValueMonitoring') }}</div>
            <FormItem :label="$t('bucketType') + ':'">
              <div style="display: flex">
                <Select v-model="charginForm.rangeType" style="width: 120px">
                  <Option v-for="item in charginTimeList" :value="item.value" :key="item.value">
                    {{ item.label }}
                  </Option>
                </Select>

                <div class="time-expand-row" v-if="charginForm.rangeType === '2'">
                  <Select v-model="StartMonth" style="width: 150px" class="startMonth" :placeholder="$t('startDate')">
                    <Option v-for="item in monthData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>

                  -
                  <Select v-model="EndMonth" style="width: 150px" class="endMonth" :placeholder="$t('endDate')">
                    <Option v-for="item in monthData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </div>
                <div class="time-expand-row" v-if="charginForm.rangeType === '3'">
                  <DatePicker type="date" v-model="startDayValue" :placeholder="$t('startDate')" format="MM-dd" :clearable="false" style="width: 150px" @on-change="startDay"></DatePicker>

                  -
                  <DatePicker type="date" v-model="endDayValue" :placeholder="$t('endDate')" format="MM-dd" :clearable="false" style="width: 150px" @on-change="endDay"></DatePicker>
                </div>
              </div>
            </FormItem>
            <FormItem>
              <div slot="label" class="label-dev">
                <span>{{ $t('ns_electricityAndFeeMonitoringConfig.label1') }}</span>
                <TooltipVue placement="top" :tooltipText="$t('tip1')" />
                <span>:</span>
              </div>
              <InputNumberRange unit="kW·h" style="width: 340px" :minValue.sync="charginForm.pwrWarnDw" :maxValue.sync="charginForm.pwrWarnUp" @isRed="getRed" :minPlaceholder="$t('pleaseEnterLowerLimit')" :maxPlaceholder="$t('pleaseEnterUpperLimit')" />
            </FormItem>
            <FormItem>
              <div slot="label" class="label-dev">
                {{ $t('ns_electricityAndFeeMonitoringConfig.label2') }}
                <TooltipVue placement="top" :tooltipText="$t('tip2')" />
                :
              </div>
              <InputNumberRange unit="kW·h" style="width: 340px" :minValue.sync="charginForm.pwrAlarmDw" @isRed="getRed" :maxValue.sync="charginForm.pwrAlarmUp" :minPlaceholder="$t('pleaseEnterLowerLimit')" :maxPlaceholder="$t('pleaseEnterUpperLimit')" />
            </FormItem>
            <FormItem>
              <div slot="label" class="label-dev">
                {{ $t('ns_electricityAndFeeMonitoringConfig.label3') }}
                <TooltipVue placement="top" :tooltipText="$t('tip1')" />
                :
              </div>
              <InputNumberRange :unit="$t('yuan')" style="width: 340px" :disabled="isDisabledInput" :minValue.sync="charginForm.feeWarnDw" :maxValue.sync="charginForm.feeWarnUp" @isRed="getRed" :minPlaceholder="holderText" :maxPlaceholder="holderText2" />
            </FormItem>
            <FormItem>
              <div slot="label" class="label-dev">
                {{ $t('ns_electricityAndFeeMonitoringConfig.label4') }}
                <TooltipVue placement="top" :tooltipText="$t('tip2')" />
                :
              </div>
              <InputNumberRange :unit="$t('yuan')" style="width: 340px" :disabled="isDisabledInput" :minValue.sync="charginForm.feeAlarmDw" :maxValue.sync="charginForm.feeAlarmUp" @isRed="getRed" :minPlaceholder="holderText" :maxPlaceholder="holderText2" />
            </FormItem>
            <div class="form-title">{{ $t('dailyValueMutationMonitoring') }}</div>
            <FormItem>
              <div slot="label" class="label-dev">
                {{ $t('ns_electricityAndFeeMonitoringConfig.label5') }}
                <TooltipVue placement="top" :tooltipText="textsTipElecUp" />
                :
              </div>
              <InputNumber style="width: 340px" class="suddenlyChange none-handler-wrap" type="number" :min="0" v-model="charginForm.dayPwrUpRatio" :placeholder="$t('pleaseEnter')" />
              <span style="position: relative"><i style="position: absolute; left: -20px">%</i></span>
            </FormItem>
            <FormItem>
              <div slot="label" class="label-dev">
                {{ $t('ns_electricityAndFeeMonitoringConfig.label6') }}
                <TooltipVue placement="top" :tooltipText="textsTipElecFall" />
                :
              </div>
              <InputNumber style="width: 340px" class="suddenlyChange none-handler-wrap" type="number" :min="0" v-model="charginForm.dayPwrDwRatio" :placeholder="$t('pleaseEnter')" />
              <span style="position: relative"><i style="position: absolute; left: -20px">%</i></span>
            </FormItem>
            <FormItem>
              <div slot="label" class="label-dev">
                {{ $t('ns_electricityAndFeeMonitoringConfig.label7') }}
                <TooltipVue placement="top" :tooltipText="textsTipUp" />
                :
              </div>
              <InputNumber style="width: 340px" class="suddenlyChange none-handler-wrap" type="number" :min="0" v-model="charginForm.dayFeeUpRatio" :disabled="isDisabledInput" :placeholder="holderText3" />
              <span style="position: relative"><i style="position: absolute; left: -20px">%</i></span>
            </FormItem>
            <FormItem>
              <div slot="label" class="label-dev">
                {{ $t('ns_electricityAndFeeMonitoringConfig.label8') }}
                <TooltipVue placement="top" :tooltipText="textsTipFall" />
                :
              </div>
              <InputNumber style="width: 340px" class="suddenlyChange none-handler-wrap" type="number" :min="0" v-model="charginForm.dayFeeDwRatio" :disabled="isDisabledInput" :placeholder="holderText3" />
              <span style="position: relative"><i style="position: absolute; left: -20px">%</i></span>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="footerSumit">
      <template>
        <Button class="b-blue" @click="queryMainLineModeConfig">{{ $t('save') }}</Button>
      </template>
    </div>
  </div>
</template>
<script>
  import { mainLineModeConfig, getMainLineMode, queryPowerFeeMonitorConfig, savePowerFeeMonitorConfig } from '@/api/public'
  import { monthDateday, timeSpan } from '../../multiManage/threShold/data'
  export default {
    props: { actives: Number },
    data() {
      return {
        isRed: false,
        textsTipFall: this.$t('ns_electricityAndFeeMonitoringConfig.tip8'),
        textsTipUp: this.$t('ns_electricityAndFeeMonitoringConfig.tip7'),
        textsTipElecFall: this.$t('ns_electricityAndFeeMonitoringConfig.tip6'),
        textsTipElecUp: this.$t('ns_electricityAndFeeMonitoringConfig.tip5'),
        startDayValue: '01-01',
        endDayValue: '12-31',
        StartMonth: '01',
        EndMonth: '31',
        monthData: monthDateday(),
        dataDayOptions: timeSpan,
        holderText: this.$t('pleaseEnterLowerLimit'),
        holderText2: this.$t('pleaseEnterUpperLimit'),
        holderText3: this.$t('pleaseEnter'),
        isDisabledInput: false,
        ButtonList: [this.$t('autoGenerate'), this.$t('manualAnnotation')],
        active: this.actives,
        treeList: [],
        childData: [],
        mineLines: [],
        charginForm: {
          rangeType: '',
          pwrWarnDw: '',
          pwrWarnUp: '',
          pwrAlarmDw: '',
          pwrAlarmUp: '',
          feeWarnDw: '',
          feeWarnUp: '',
          feeAlarmDw: '',
          feeAlarmUp: '',
          dayPwrUpRatio: null,
          dayPwrDwRatio: null,
          dayFeeUpRatio: null,
          dayFeeDwRatio: null,
        },
        charginTimeList: [
          // { value: '0', label: '每小时' },
          { value: '1', label: this.$t('everyDay') },
          { value: '2', label: this.$t('monthly') },
          { value: '3', label: this.$t('annually') },
        ],
        StartTime: '00',
        EndTime: '23',
        deviceTree: [],
        loading: false,
        checkedKeys: [],
      }
    },
    mounted() {
      this.handleGetMainLineMode()
      this.getProjectEnergyView()
    },
    computed: {
      rangeText() {
        if (this.charginForm.rangeType === '1') {
          return `${this.StartTime}~${this.EndTime}`
        } else if (this.charginForm.rangeType === '2') {
          return `${this.StartMonth}${this.StartTime}~${this.EndMonth}${this.EndTime}`
        } else if (this.charginForm.rangeType === '3') {
          return `${this.startDayValue.replace('-', '')}${this.StartTime}~${this.endDayValue.replace('-', '')}${this.EndTime}`
        }
      },
    },
    methods: {
      checkClick(data, { checkedKeys, checkedNodes }) {
        this.checkedKeys = [...checkedKeys]
        if (!data.addr) {
          let value = checkedKeys.includes(data.mac)
          const setChildChecked = list => {
            list.forEach(it => {
              this.$refs.vueEasyRef.setChecked(it.id, value)
              if (it.children && it.children.length) {
                setChildChecked(it.children)
              }
            })
          }
          data.children && setChildChecked(data.children)
        } else {
          let value = checkedKeys.includes(data.id)
          if (value) return this.$refs.vueEasyRef.setChecked(data.mac, true)
          if (!checkedNodes.find(it => it.mac === data.mac && it.addr)) return this.$refs.vueEasyRef.setChecked(data.mac, false)
        }
      },
      getRed(val) {
        this.isRed = val
      },
      startDay(val) {
        this.startDayValue = val
      },
      endDay(val) {
        this.endDayValue = val
      },
      selectType(v) {
        this.active = v + 1
        this.handleGetMainLineMode(v + 1)
      },
      async getProjectEnergyView() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await queryPowerFeeMonitorConfig(params)
        if (res.success) {
          const keys = Object.keys(this.charginForm)
          for (let index = 0; index < keys.length; index++) {
            const key = keys[index]
            this.charginForm[key] = typeof this.charginForm[key] === 'number' ? +res.data[key] : res.data[key]
          }
          this.isDisabledInput = !res.data.isSupportFee
          this.holderText = this.isDisabledInput ? this.$t('noConfigDeviceElectricityPrice') : this.$t('pleaseEnterLowerLimit')
          this.holderText2 = this.isDisabledInput ? this.$t('noConfigDeviceElectricityPrice') : this.$t('pleaseEnterUpperLimit')
          this.holderText3 = this.isDisabledInput ? this.$t('noConfigDeviceElectricityPrice') : this.$t('pleaseEnter')
          let timeRange = res.data.range && res.data.range.split('~')
          if (res.data.rangeType === '1') {
            // this.StartTime = timeRange[0]
            // this.EndTime = timeRange[1]
          } else if (res.data.rangeType === '2') {
            this.StartMonth = timeRange[0].substring(0, 2)
            this.EndMonth = timeRange[1].substring(0, 2)
            // this.StartTime = timeRange[0].substring(2)
            // this.EndTime = timeRange[1].substring(2)
            this.StartTime = '00'
            this.EndTime = '23'
          } else if (res.data.rangeType === '3') {
            this.startDayValue = timeRange[0].substring(0, 4).replace(/(\d{2})(\d{2})/, '$1-$2')
            this.endDayValue = timeRange[1].substring(0, 4).replace(/(\d{2})(\d{2})/, '$1-$2')
            // this.StartTime = timeRange[0].substring(4)
            // this.EndTime = timeRange[1].substring(4)
            this.StartTime = '00'
            this.EndTime = '23'
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryMainLineModeConfig() {
        if (this.isRed) {
          return this.$Message.error({ content: this.$t('ns_electricityAndFeeMonitoringConfig.saveTip1') })
        }
        if (this.charginForm.rangeType === '2' || this.charginForm.rangeType === '3') {
          let startTime = this.rangeText.split('~')[0]
          let endTime = this.rangeText.split('~')[1]
          if (endTime < startTime) {
            return this.$Message.error({ content: this.$t('ns_carbonEmissionAlarm.saveTip') })
          }
        }
        let mineLines = []
        if (this.active === 2) {
          let allAddrs = this.$refs.vueEasyRef.getCheckedNodes().filter(it => it.addr)
          let macs = [...new Set(allAddrs.map(it => it.mac))]
          mineLines = macs.map(mac => ({ mac, addrs: allAddrs.filter(it => it.mac === mac).map(it => it.addr.toString()) }))
        }
        let data = { projectCode: this.$store.state.projectCode, mode: this.active, mineLines }
        const res = await mainLineModeConfig(JSON.stringify(data))
        if (res.success) {
          if (mineLines.length === 0 && this.active === 2) {
            this.$Modal.confirm({
              title: this.$t('tip'),
              content: `<p>${this.$t('unSelectProjectMainLineTip')}</p>`,
              onOk: () => {
                this.handleGetMainLineMode(this.active)
                this.$Message.success({ content: res.message })
              },
            })
          } else {
            this.handleGetMainLineMode(this.active)
          }
        } else {
          this.$Message.error({ content: res.message })
        }
        let params = { projectCode: this.$store.state.projectCode, range: this.rangeText, ...this.charginForm }
        const res2 = await savePowerFeeMonitorConfig(params)
        if (res2.success) {
          this.$Message.success({ content: this.$t('savedSuccessfully') })
          this.getProjectEnergyView()
        } else {
          this.$Message.error({ content: res2.message })
        }
      },
      // 获取总路模式信息
      async handleGetMainLineMode(v) {
        let params = { projectCode: this.$store.state.projectCode }
        if (v) params.mode = v
        this.loading = true
        const res = await getMainLineMode(params)
        this.loading = false
        if (res.success) {
          this.active = res.data.mode
          let checkedKeys = []
          this.deviceTree =
            res.data.mainLines &&
            res.data.mainLines.map(it => {
              let pObj = { ...it, id: it.mac, label: `${it.boxName}(${it.mac})` }
              if (it.tts && it.tts.length) {
                pObj.children = it.tts.map(ev => {
                  if (ev.mainline) {
                    checkedKeys.push(it.mac)
                    checkedKeys.push(`${ev.resId}:${ev.addr}`)
                  }
                  return {
                    ...ev,
                    mac: it.mac,
                    id: `${ev.resId}:${ev.addr}`,
                    label: ev.others.addrName,
                    children: ev.others.childs.map(ov => {
                      if (ov.mainline) {
                        checkedKeys.push(it.mac)
                        checkedKeys.push(`${ov.resId}:${ov.addr}`)
                      }
                      return { ...ov, mac: it.mac, id: `${ov.resId}:${ov.addr}`, label: ov.others.addrName }
                    }),
                  }
                })
              }
              return pObj
            })
          if (this.active === 2) {
            this.$nextTick(() => {
              this.checkedKeys = [...new Set(checkedKeys)]
              this.$refs.vueEasyRef.setCheckedKeys(this.checkedKeys)
            })
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .prjectRoad {
    padding: 20px;
    background: #19202e;
    .header {
      border: 1px solid #eaeaec;
      padding: 10px;
      background: rgba(234, 234, 236, 0.1);
      margin-bottom: 15px;
    }
    .flex-1 {
      flex: 1;
      overflow: auto;
      text-align: left;
    }

    .tab {
      display: flex;
      align-items: center;
      .ivu-icon {
        color: #146898;
        margin-top: 10px;
        margin-left: 10px;
      }
      .active {
        background: #02a7f0;
        border: 1px solid #02a7f0;
        color: #fff;
      }
    }
    .form-content {
      margin-top: 20px;
      padding-left: 10px;
      .form-title {
        width: 140px;
        color: #d7d7d7;
        text-align: right;
        padding-right: 12px;
        margin-bottom: 20px;
      }
      .label-dev {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .time-expand-row {
        border: 1px solid #3d3d41;
        border-radius: 5px;
        display: flex;
        width: 280px;
        margin-left: 10px;
        // margin-left: 82px;
        .ivu-input {
          border: transparent;
          box-shadow: 0 0 0 0;
          text-align: center;
          padding: 0;
          color: #fff;
        }
        .ivu-date-picker-focused input:not([disabled]) {
          box-shadow: none;
        }
        .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
          line-height: 32px;
          height: 32px;
        }
        .ivu-date-picker-header-label:first-child,
        .ivu-date-picker-prev-btn-arrow-double,
        .ivu-date-picker-next-btn-arrow-double {
          display: none;
        }
        .ivu-icon-ios-calendar-outline:before {
          content: '';
        }
      }
    }
    .startMonth,
    .endMonth {
      .ivu-select-selection {
        border: transparent;
        box-shadow: 0 0 0 0;
        .ivu-icon-ios-arrow-down:before {
          content: '';
        }
      }
      .ivu-select-dropdown {
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .ivu-select-placeholder,
      .ivu-select-selected-value {
        text-align: center;
        padding: 0;
      }
    }

    .time-projectRoad {
      border: 1px solid #3d3d41;
      border-radius: 5px;
      display: flex;
      width: 280px;
      margin-left: 20px;
      // margin-left: 82px;
      .ivu-input {
        border: transparent;
        box-shadow: 0 0 0 0;
        text-align: center;
        padding: 0;
      }
      .ivu-date-picker-header-label:first-child,
      .ivu-date-picker-prev-btn-arrow-double,
      .ivu-date-picker-next-btn-arrow-double {
        display: none;
      }
      .ivu-icon-ios-calendar-outline:before {
        content: '';
      }
    }
    .content {
      margin-left: 50px;
      display: flex;
      height: calc(~'100vh - 304px');
      .handmove {
        display: flex;
        margin-top: 20px;
        .treeContent {
          height: 100%;
          width: 100%;
          overflow: auto;
          margin-left: 20px;
          scrollbar-width: none;
          &::-webkit-scrollbar {
            display: none;
          }
          /deep/.vue-recycle-scroller {
            &::-webkit-scrollbar {
              display: none;
              width: 0px;
            }
          }
          /deep/.el-tree {
            background: none;
            color: #fff;
            .custom-tree-node {
              width: calc(~'100% - 24px');
              display: flex;
              align-items: center;
              .title-text {
                overflow: hidden;
                max-width: 100%;
              }
              .title-text.noWhole {
                max-width: calc(~'100% - 100px');
              }
              .main-load-tag {
                padding: 2px;
                border-radius: 5px;
                background: rgba(217, 0, 27, 0.2);
                color: #d9001b;
                margin-left: 20px;
              }
            }
          }
          /deep/.el-tree-node,
          /deep/.el-tree-node:hover {
            background: none;
          }
          /deep/.el-tree-node:focus > .el-tree-node__content,
          /deep/.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content,
          /deep/.el-tree-node__content:hover {
            background: none;
            color: #2d8cf0;
          }
          /deep/.is-focusable {
            background: none;
          }
          /deep/.ivu-tree ul li {
            margin: 2px 0;
            line-height: 30px;
          }
          /deep/.ivu-tree .ivu-tree-empty {
            text-align: center;
          }
          /deep/ .ivu-tree-title-selected,
          /deep/ .ivu-tree-title-selected:hover {
            background-color: #2d8cf0;
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  /deep/.suddenlyChange input::-webkit-outer-spin-button,
  /deep/.suddenlyChange input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  /deep/.suddenlyChange input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
