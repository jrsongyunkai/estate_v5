<template>
  <div class="three-threshold-config">
    <Row>
      <Col :span="8" v-for="(item, index) in thresholdList" :key="index" v-display="'flex'" class="ivu-mt-8">
        <div class="name-style">{{ item.name }}：</div>
        <div>
          <Input v-model="item.value" class=""></Input>
          <span class="unit-position">
            <span class="unit-style">{{ item.unit }}</span>
          </span>
        </div>
      </Col>
    </Row>
    <Button type="primary" @click="saveThresholdList">{{ $t('save') }}</Button>
  </div>
</template>

<script>
  const thresholdList = [
    { name: window.$t('ACurrentAlarm'), type: 'ca', value: null, unit: 'A' },
    { name: window.$t('AVoltAlarm'), type: 'va', value: null, unit: 'V' },
    { name: window.$t('ATemperatureAlarm'), type: 'ta', value: null, unit: '℃' },
    { name: window.$t('BCurrentAlarm'), type: 'cb', value: null, unit: 'A' },
    { name: window.$t('BVoltAlarm'), type: 'vb', value: null, unit: 'V' },
    { name: window.$t('BTemperatureAlarm'), type: 'tb', value: null, unit: '℃' },
    { name: window.$t('CCurrentAlarm'), type: 'cc', value: null, unit: 'A' },
    { name: window.$t('CVoltAlarm'), type: 'vc', value: null, unit: 'V' },
    { name: window.$t('CTemperatureAlarm'), type: 'tc', value: null, unit: '℃' },
  ]
  export default {
    data() {
      return {
        thresholdList,
      }
    },
    methods: {
      saveThresholdList() {
        this.$emit('saveThresholdList', this.thresholdList)
      },
    },
  }
</script>

<style lang="less" scoped>
  .three-threshold-config {
    margin-left: 10px;
  }
  .unit-position {
    position: relative;
  }
  .unit-style {
    position: absolute;
    right: 5px;
    top: 0;
  }
  .name-style {
    margin-top: 5px;
  }
</style>
