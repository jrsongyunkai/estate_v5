<template>
  <div class="thresholdShow">
    <h3 class="title-thresholdShow">{{ $t('projectUnifiedThresholdDisplay') }}</h3>
    <Table :columns="columns2" :data="data3">
      <template #thresholdC="{ row }">
        <span>{{ row.thresholdC }}</span>
      </template>
      <template #thresholdB="{ row }">
        <span>{{ row.thresholdB }}</span>
      </template>
      <template #thresholdA="{ row }">
        <span>{{ row.thresholdA }}</span>
      </template>
    </Table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns2: [
          {
            title: this.$t('paramsType'),
            key: 'name',
          },
          {
            title: this.$t('CLevelAlarmValue'),
            slot: 'thresholdC',
          },
          {
            title: this.$t('BLevelAlarmValue'),
            slot: 'thresholdB',
          },
          {
            title: this.$t('ALevelAlarmValue'),
            slot: 'thresholdA',
          },
        ],
        data3: [
          {
            name: this.$t('CurrentA'),
            thresholdA: '81.9',
            thresholdB: '75.6',
            thresholdC: '69.3',
          },
          {
            name: this.$t('volt'),
            thresholdA: '286',
            thresholdB: '264',
            thresholdC: '242',
          },
          {
            name: this.$t('temperature1'),
            thresholdA: '84.5',
            thresholdB: '71.5',
            thresholdC: '65',
          },
        ],
      }
    },
  }
</script>

<style lang="less" scoped>
  .thresholdShow {
    background: #1a202e;
    height: 435px;
    padding: 20px;
    .title-thresholdShow {
      margin-bottom: 10px;
    }
  }
</style>
