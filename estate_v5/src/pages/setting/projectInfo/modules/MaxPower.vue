<template>
  <div class="max-power">
    <h3>{{ $t('instantaneousPowerAlarmRuleConfiguration') }}</h3>
    <div style="padding-left: 50px">
      <Form :label-width="100">
        <FormItem :label="`${$t('alarmSwitch')}：`">
          <Switch v-model="enable" />
        </FormItem>
        <FormItem :label="`${$t('alarmReferenceValue')}：`">
          {{ $t('thisMonth') }}
          <Select v-model="days" style="width: 80px">
            <Option v-for="item in 7" :value="item" :key="item">{{ item }}</Option>
          </Select>
          {{ $t('alarmTip') }}
        </FormItem>
        <FormItem :label="`${$t('alarmRatio')}：`">
          {{ $t('whenTheInstantaneousPowerValueExceedsTheReferenceValue') }}
          <InputNumber v-model="percent" :min="1" :max="100000" v-inputNumberRule="'Integer'" style="width: 100px" />
          {{ $t('whenAnAlarmIsGenerated') }}
        </FormItem>
      </Form>
      <Button type="primary" style="margin-top: 80px" @click="save">{{ $t('save') }}</Button>
    </div>
  </div>
</template>

<script>
  import { getInstantPowerConfig, saveInstantPowerConfig } from '@/api/setting/projectInfo'

  export default {
    data() {
      return {
        enable: false,
        days: null,
        percent: 200,
      }
    },
    mounted() {
      this.query()
    },
    methods: {
      async query() {
        const { success, message, data } = await getInstantPowerConfig({
          projectCode: this.$store.state.projectCode,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        this.enable = data.enable
        this.days = data.days
        this.percent = data.percent
      },
      async save() {
        const { success, message } = await saveInstantPowerConfig({
          projectCode: this.$store.state.projectCode,
          enable: this.enable,
          days: this.days,
          percent: this.percent,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        this.$Message.success(this.$t('savedSuccessfully'))
      },
    },
  }
</script>

<style lang="less" scoped>
  .max-power {
    background: #1a202e;
    height: 400px;
    padding: 20px;
    h3 {
      margin-bottom: 20px;
    }
    /deep/.ivu-input-number-handler-wrap {
      a {
        display: none;
      }
      opacity: 1;
      text-align: center;
      &::after {
        content: '%';
      }
    }
  }
</style>
