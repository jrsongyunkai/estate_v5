<template>
  <div class="config-details">
    <BackTopTitle title="参数配置（小时电量）" @close="$emit('close')">
      <Button ghost @click.stop="$emit('close')">取消</Button>
      <Button class="ml-10" type="primary" ghost @click.stop="">保存</Button>
    </BackTopTitle>
    <div class="info">
      <div class="config">
        <div class="header-title">参数配置</div>
        <div class="prompt" v-if="!disabled">
          <Icon color="#f2f2f2" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
          请谨慎根据您当前项目的实际计费模式进行以下参数配置，以下配置会决定当前项目的费用计算模式。
        </div>
        <Form :model="formData" label-position="right" :label-width="200" :rules="formRules">
          <FormItem label="阶梯计量周期:" prop="billingCycle">
            <RadioGroup v-model="formData.billingCycle">
              <Radio label="1">月</Radio>
              <Radio label="2">季</Radio>
              <Radio label="3">年</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="计量方式:" prop="meteringMode">
            <RadioGroup v-model="formData.meteringMode">
              <Radio label="1">
                <span>阶梯累进制</span>
                <TooltipVue style="margin-left: -5px; display: inline-block">在同一个计量周期内，用每个阶梯内的所使用的电量乘每个阶梯对应的单价所得出的电费相加得到当前计量周期内的总电费。</TooltipVue>
              </Radio>
              <Radio label="2" class="ml-20">
                <span>单一阶梯制</span>
                <TooltipVue style="margin-left: -5px; display: inline-block">在同一个计量周期内，用总使用电量乘当前所在阶梯的单价所得出当前阶段总电费。</TooltipVue>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="费用计量最短周期:" prop="way">
            <div>{{ '一小时' }}</div>
          </FormItem>
          <FormItem prop="billingTarget">
            <template #label>
              <span v-if="disabled">使用电价</span>
              <span v-else>
                计费模式
                <TooltipVue style="margin-left: -5px; display: inline-block">同一个项目内仅一个计费模式会生效，请根据当前项目内的计费模式谨慎进行选择，配置完成后将不可进行修改</TooltipVue>
                :
              </span>
            </template>
            <span @click.stop="tooltipModal">
              <RadioGroup v-model="formData.billingTarget" type="button">
                <Radio label="1">项目级</Radio>
                <Radio label="3">分组级</Radio>
                <Radio label="2">设备/线路级</Radio>
              </RadioGroup>
            </span>
          </FormItem>
          <FormItem label="尖锋平谷分时段:" prop="way">
            <Switch v-model="formData.isSwitch" />
          </FormItem>
        </Form>
      </div>
      <periodConfig v-model="config" style="margin-top: 10px"></periodConfig>
      <Modal v-model="toolModal" class-name="vertical-center-modal" footer-hide>
        <div style="text-align: left; padding-right: 30px">
          <p class="mar-t10">
            <Icon type="ios-information-circle" class="yell-icon"></Icon>
            一经配置保存后将无法修改，
            <span class="red-text">请谨慎配置，</span>
            如有问题，请联系技术支持。
          </p>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import noMarginTop from '@/mixins/noMarginTop'
  import BackTopTitle from '@/pages/billingSystem/component/BackTopTitle.vue'
  import periodConfig from '../fragment/periodConfig.vue'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      disabled: { type: Boolean, default: false },
    },
    components: { BackTopTitle, periodConfig },
    mixins: [noMarginTop],
    data() {
      return {
        toolModal: false,
        formData: { billingCycle: '1', meteringMode: '1', isSwitch: true, billingTarget: '1' },
        config: { top: [], peak: [], normal: [], valley: [] },
        formRules: {
          billingCycle: [{ required: true, message: '请选择阶梯计量周期', trigger: 'change' }],
          meteringMode: [{ required: true, message: '请选择计量方式', trigger: 'change' }],
          billingTarget: [{ required: true, message: '请选择计费模式', trigger: 'change' }],
        },
      }
    },
    methods: {
      tooltipModal() {
        this.toolModal = true
      },
    },
    watch: {
      config: {
        handler(val) {
          console.log('🚀 ~ handler ~ val:', val)
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .config-details {
    .info {
      padding: 0 10px;
      height: calc(~'100vh - 185px');
      overflow: auto;
      margin-top: 10px;
      scrollbar-width: none; // firefox
      &::-webkit-scrollbar {
        width: 0px;
        display: none;
      }
      .config {
        padding: 15px;
        background: #1a202e;
      }
      .prompt {
        background: #454a55;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        i {
          color: red;
        }
      }
    }
    .header-title {
      line-height: 30px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #007fff;
      &::before {
        display: inline-block;
        content: '';
        width: 3px;
        height: 20px;
        background: #007fff;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }
</style>
<style lang="less">
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    .mar-t10 {
      margin-top: 15px;
    }
    .red-text {
      color: red;
    }
  }
  .vertical-center-modal .ivu-modal {
    top: -10em;
  }
</style>
