<template>
  <div class="unitPrice">
    <div class="info" style="margin-top: 10px">
      <div class="prompt" v-if="!unitPriceStatus">
        <Icon color="#f2f2f2" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
        {{ $t('unitPriceConfigTip1') }}
        <i>{{ $t('unitPriceConfigTip2') }}</i>
      </div>
      <Form :label-width="100">
        <FormItem :label="`${$t('billingCycle')}:`">
          <template v-if="unitPriceStatus">
            <span>{{ cycle === '1' ? $t('month') : cycle === '2' ? $t('season') : cycle === '3' ? $t('year') : '' }}</span>
          </template>
          <template v-else>
            <RadioGroup v-model="cycle">
              <Radio label="1">{{ $t('month') }}</Radio>
              <Radio label="2">{{ $t('season') }}</Radio>
              <Radio label="3">{{ $t('year') }}</Radio>
            </RadioGroup>
          </template>
        </FormItem>
        <FormItem :label="`${$t('measuringMethod')}:`">
          <template v-if="unitPriceStatus">
            <span>{{ way === '1' ? $t('ladderAccumulation') : way === '2' ? this.$t('singleStepSystem') : '' }}</span>
          </template>
          <template v-else>
            <RadioGroup v-model="way">
              <Radio label="1">
                <span>{{ $t('ladderAccumulation') }}</span>
                <Tooltip placement="top" max-width="470">
                  <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
                  <div slot="content" style="white-space: normal; width: 400px">{{ $t('ladderAccumulationTip') }}</div>
                </Tooltip>
              </Radio>
              <Radio label="2" class="ml-20">
                <span>{{ $t('singleStepSystem') }}</span>
                <Tooltip placement="top" max-width="470">
                  <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
                  <div slot="content" style="white-space: normal; width: 400px">{{ $t('singleStepSystemTip') }}</div>
                </Tooltip>
              </Radio>
            </RadioGroup>
          </template>
        </FormItem>
        <FormItem :label="unitPriceStatus ? `${$t('electricityPriceUsage')}:` : ''" :label-width="unitPriceStatus ? 100 : 0">
          <span v-if="!unitPriceStatus">
            {{ $t('billingMode') }}
            <Tooltip placement="top-start" max-width="470">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('billingModeTip') }}</div>
            </Tooltip>
            :
          </span>
          <template v-if="unitPriceStatus">
            <span>{{ typeMap[unitPricetype] || '' }}</span>
          </template>
          <template v-else>
            <span @click.stop="tooltipModal">
              <RadioGroup v-model="unitPricetype" type="button">
                <template v-if="isBillingTargetCanModify">
                  <Radio label="project">{{ $t('projectElectricityPrice') }}</Radio>
                  <Radio label="addr">{{ $t('lineElectricityPrice') }}</Radio>
                  <Radio label="group">{{ $t('groupElectricityPrice') }}</Radio>
                </template>
                <template v-else>
                  <Radio label="project" :disabled="unitPricetype !== 'project'">{{ $t('projectElectricityPrice') }}</Radio>
                  <Radio label="addr" :disabled="unitPricetype !== 'addr'">{{ $t('lineElectricityPrice') }}</Radio>
                  <Radio label="group" :disabled="unitPricetype !== 'group'">{{ $t('groupElectricityPrice') }}</Radio>
                </template>
              </RadioGroup>
            </span>
          </template>
        </FormItem>
      </Form>
    </div>
    <div class="unitContent">
      <ProjectCurrentPriceView ref="projectCurrentPriceRef" v-if="unitPricetype === 'project'" :unitPriceStatus="unitPriceStatus" @saveState="saveStateCall" />
      <LinePriceView ref="linePriceRef" v-if="unitPricetype === 'addr'" :unitPriceStatus="unitPriceStatus" @saveState="saveStateCall" />
      <GroupPriceView ref="groupPriceRef" v-if="unitPricetype === 'group'" :unitPriceStatus="unitPriceStatus" @saveState="saveStateCall" />
    </div>
    <Modal v-model="toolModal" class-name="vertical-center-modal" footer-hide>
      <div style="text-align: left; padding-right: 30px">
        <p class="mar-t10">
          <Icon type="ios-information-circle" class="yell-icon"></Icon>
          <i18n path="unitPriceConfigWarnTip">
            <span class="red-text">{{ $t('pleaseConfigureWithCaution') }}</span>
          </i18n>
        </p>
      </div>
    </Modal>
  </div>
</template>
<script>
  import ProjectCurrentPriceView from './component/ProjectPriceView.vue'
  import LinePriceView from './component/LinePriceView.vue'
  import GroupPriceView from './component/GroupPriceView.vue'
  import { configPowerCycle, getPowerCycle } from '@/api/public'
  export default {
    props: {
      unitPriceStatus: Boolean,
    },
    components: {
      ProjectCurrentPriceView,
      LinePriceView,
      GroupPriceView,
    },
    data() {
      return {
        typeMap: { project: this.$t('projectElectricityPrice'), group: this.$t('groupElectricityPrice'), addr: this.$t('lineElectricityPrice') },
        unitPricetype: '',
        toolModal: false,
        isBillingTargetCanModify: false,
        billingTarget: '',
        model: 'project',
        way: '',
        cycle: '',
      }
    },
    methods: {
      init() {
        if (this.unitPricetype === 'project') {
          this.$refs.projectCurrentPriceRef.hanldegetTargetAndPrice4Prj()
        } else if (this.unitPricetype === 'addr') {
          this.$refs.linePriceRef.handlegetTargetAndPriceChn()
        } else if (this.unitPricetype === 'group') {
          this.$refs.groupPriceRef.handlegetTargetAndPriceGrp()
        }
      },
      saveStateCall(val) {
        this.$emit('saveState', val)
      },
      tooltipModal() {
        this.toolModal = true
      },
      handleCleanData() {
        this.cycle = ''
        this.way = ''
        this.unitPricetype = ''
      },
      /**
       * 获取电价配置信息
       */
      async handlegetPowerCycle() {
        let params = { projectCode: this.$store.state.projectCode, isCurr: true }
        const res = await getPowerCycle(params)
        if (res.success) {
          let data = res.data
          this.cycle = data.billingCycle ? `${data.billingCycle}` : ''
          this.way = data.meteringMode ? `${data.meteringMode}` : ''
          this.billingTarget = data.billingTarget
          this.isBillingTargetCanModify = data.isBillingTargetCanModify
          if (data.billingTarget !== undefined) {
            this.unitPricetype = data.billingTarget === 1 ? 'project' : data.billingTarget === 2 ? 'addr' : data.billingTarget === 3 ? 'group' : ''
          }
          this.$emit('unitPricetype', this.unitPricetype)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleconfigPowerCycle() {
        if (this.cycle === '' || this.way === '' || this.unitPricetype === '') {
          this.$Message.error({ content: this.$t('enterElectricityPriceCycle') })
        } else {
          let params = {
            projectCode: this.$store.state.projectCode,
            billingCycle: this.cycle,
            meteringMode: this.way,
            billingTarget: this.unitPricetype === 'project' ? '1' : this.unitPricetype === 'addr' ? '2' : this.unitPricetype === 'group' ? '3' : '',
          }
          const res = await configPowerCycle(params)
          if (res.success) {
          } else {
            this.$Message.error({ content: res.message })
          }
        }
      },
      save() {
        if (this.unitPricetype === 'project') {
          this.$refs.projectCurrentPriceRef.saveData(this.handleconfigPowerCycle)
        } else if (this.unitPricetype === 'addr') {
          this.$refs.linePriceRef.saveData(this.handleconfigPowerCycle)
        } else if (this.unitPricetype === 'group') {
          this.$refs.groupPriceRef.saveData(this.handleconfigPowerCycle)
        }
      },
      handleCascaderState(val) {
        if (val.disabled) {
          this.$Message.error({ content: this.$t('unitPriceConfigTip3') })
        }
      },
    },
    mounted() {
      this.handlegetPowerCycle()
    },
  }
</script>
<style lang="less">
  .ivu-radio-wrapper-disabled:first-child {
    border-color: #3d3d41 !important;
    background-color: #28282b !important;
    color: #4c4c51 !important;
  }
  .popper .el-cascader-panel .el-checkbox {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .red-text {
    color: red;
  }
  .yell-icon {
    color: #d7984c;
    font-size: 20px;
  }
  .mar-t10 {
    margin-top: 15px;
  }
  .popper .el-cascader-menu__wrap {
    width: 196px;
  }
  .popper .el-cascader-panel .el-checkbox__input {
    margin-top: 2px;
    margin-left: 8px;
  }
  .popper .el-cascader-panel .el-cascader-node__postfix {
    position: static;
  }
  .el-cascader-node.is-selectable.in-active-path {
    color: #fff;
  }
  .el-radio__input.is-checked .el-radio__inner::after {
    transform: translate(-50%, -50%) scale(0);
  }
  .popper .el-cascader-panel .el-radio {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .popper .el-cascader-panel .el-checkbox {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .popper .el-cascader-panel .el-radio__input {
    margin-top: 10px;
    margin-left: 8px;
  }
  .popper .el-cascader-panel .el-checkbox__input {
    margin-top: 2px;
    margin-left: 8px;
  }
  .popper .el-cascader-panel .el-cascader-node__postfix {
    top: 10px;
  }
  .el-cascader-node__label {
    font-weight: normal;
    padding: 0 5px;
    position: relative;
    .before {
      position: absolute;
      right: 10px;
      top: 5px;
      font-size: 12px;
      height: 22px;
      line-height: 22px;
      padding: 0 10px;
      background: #134767;
      color: #06a1eb;
    }
  }
  .el-cascader__suggestion-item:focus,
  .el-cascader__suggestion-item:hover {
    background: #2c2c2e;
  }

  .el-cascader__dropdown {
    background: #1a202e !important;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
    border: transparent;
    line-height: 30px;
  }
  .el-cascader-node {
    min-width: 150px;
  }
  .el-cascader-menu {
    border-right: solid 2px #36383d;
  }
  .el-cascader-menu__list {
    padding: 0;
  }
  .el-radio__input.is-disabled .el-radio__inner {
    background-color: rgba(193, 193, 193, 0.5) !important;
    border-color: transparent !important;
  }

  .popper__arrow,
  .popper__arrow::after {
    border-bottom-color: transparent !important;
  }
  .el-cascader-node:not(.is-disabled):focus,
  .el-cascader-node:not(.is-disabled):hover {
    background: #2c2c2e !important;
    color: #409eff;
  }
  .el-cascader-node {
    padding: 5px;
    color: #fff;
  }
  .el-cascader__suggestion-list {
    color: #fff;
  }
  .el-cascader {
    width: 250px;
    margin-left: 4px;
    padding: 0 8px;
    height: 32px;
    line-height: 32px;
    input {
      background: #1a202e;
    }

    .el-input__inner {
      height: 32px;
      line-height: 32px;
      color: #fff;
      border: 1px solid #3d3d41;
      padding: 0 5px;
      &::placeholder {
        color: #606266;
      }
      &:hover {
        cursor: pointer;
        border-color: #3d3d41;
      }
    }
  }
  .el-radio__inner {
    border-radius: 0;
    border: 0;
    width: 180px;
    height: 34px;
    background-color: transparent;
    cursor: pointer;
    box-sizing: border-box;
    position: absolute;
    top: -14px;
    left: -8px;
  }

  .el-radio__input.is-checked .el-radio__inner {
    background: transparent;
  }
  .unitPrice {
    .addrGround {
      background: #080f19;
    }
    .info {
      .prompt {
        background: #454a55;
        border-radius: 5px;
        padding: 10px;
        i {
          color: red;
        }
      }
    }
    .unitContent {
      .addrFormItemContent {
        background: #080f19;
        padding: 10px;
        margin-top: 10px;
      }
      .ivu-tabs-nav-container {
        border-bottom: 1px solid #797979;
      }
      .header {
        padding: 10px;
        display: flex;
        margin-bottom: 10px;
        .left-box {
          display: flex;
          flex: 1;
          .label-span {
            line-height: 32px;
          }
          .left-value {
            flex: 1;
          }
        }
      }

      .grouping {
        align-items: center;
        span {
          margin: 0 10px;
        }
      }
      .addMacprice {
        width: 100%;
        margin-top: 10px;
        background: rgba(2, 167, 240, 0.1);
        border: 1px dotted #02a7f0;
        color: #02a7f0;
      }
    }
  }
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vertical-center-modal .ivu-modal {
    top: -10em;
  }
</style>
