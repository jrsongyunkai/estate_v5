<template>
  <div class="right-top">
    <Alert show-icon>{{ $t('predictionPlanTip') }}</Alert>
    <div>
      <div class="line-input">
        <span class="label">{{ $t('defaultPredictionScheme') }}:</span>
        <Select class="ml-10" v-width="250" v-model="programme">
          <Option v-for="item in programmeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="line-input">
        <span class="label">{{ $t('observationBasePoint') }}:</span>
        <Input class="ml-10" v-model="count" v-width="250" v-inputNumberRule="'PositiveNum'" />
      </div>
    </div>
    <div class="btn">
      <Button type="primary" class="ml-10" @click.stop="setDefaultKeyValue">{{ $t('save') }}</Button>
    </div>
  </div>
</template>

<script>
  import { getKeyValue, saveKeyValue } from '@/api/energyMonitor/prediction'
  export default {
    data() {
      return {
        programmeList: [
          { name: 'xLR', value: '1' },
          { name: 'MAM', value: '2' },
          { name: 'ESM', value: '3' },
          { name: 'YoYS', value: '4' },
          { name: 'CRS', value: '5' },
          { name: 'CPDRS', value: '6' },
        ],
        programme: '1',
        count: 1,
      }
    },
    methods: {
      async getDefaultKeyValue() {
        const params = { at: 'db', tag: 'prj', key: 'DEFAULT_POWER_PREDICTION_PLAN', ep: this.$store.state.projectCode }
        const res = await getKeyValue(params)
        if (res.success) {
          if (res.data) {
            this.programme = JSON.parse(res.data).default
            this.count = JSON.parse(res.data).count
          }
        } else {
          this.$Message.error(res.message)
        }
      },
      async setDefaultKeyValue() {
        if (!this.programme) return this.$Message.error(this.$t('pleaseSelectAPredictionAlgorithm'))
        if (!this.count) return this.$Message.error(this.$t('pleaseEnterTheNumberOfObservationBases'))
        const params = { at: 'db', tag: 'prj', key: 'DEFAULT_POWER_PREDICTION_PLAN', value: JSON.stringify({ default: this.programme, count: +this.count }), ep: this.$store.state.projectCode }
        const res = await saveKeyValue(params)
        if (res.success) {
          this.$Message.success(this.$t('setSuccessfully'))
          this.getDefaultKeyValue()
        } else {
          this.$Message.error(res.message)
        }
      },
    },
    mounted() {
      this.getDefaultKeyValue()
    },
  }
</script>

<style lang="less" scoped>
  .right-top {
    padding: 10px 20px;
    background: #1a202e;
    height: 358px;
    position: relative;
    /deep/.ivu-alert {
      width: 100%;
    }
    .line-input {
      margin-bottom: 20px;
      margin-top: 20px;
      > span.label {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }
    .btn {
      position: absolute;
      bottom: 20px;
      left: 20px;
    }
  }
</style>
