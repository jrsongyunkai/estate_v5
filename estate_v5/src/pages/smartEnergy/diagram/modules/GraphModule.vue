<template>
  <div class="content-box">
    <div class="search-bar">
      <Form ref="searchForm" label-position="right" style="display: flex">
        <FormItem>
          <Select v-model="modelTemp" v-width="200">
            <Option v-for="item in models" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <MKindDatePick class="ml-10" :typeRange="energyType === 1 ? [$t('year'), $t('season'), $t('month'), $t('week'), $t('day')] : [$t('year'), $t('season'), $t('month'), $t('week')]" v-model="timeValueTemp" />
        <Button class="b-blue ml-10" @click.stop="search">{{ $t('query') }}</Button>
        <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
      </Form>
    </div>
    <div class="chart-box mt-10">
      <energyGraph ref="graphRef" :energyType="energyType" :model="model" :timeValue="timeValue" :models="models"></energyGraph>
    </div>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import energyGraph from './energyGraph.vue'
  export default {
    props: {
      energyType: { type: Number, default: 1 },
      models: { type: Array, default: () => [] },
    },
    data() {
      return {
        model: 'location',
        modelTemp: 'location',
        timeValue: {
          levelRange: 'month',
          timeType: 3,
          dateValue: this.$Date().format('YYYY-MM-01'),
          dateValueText: this.$Date().format('YYYY-MM'),
          dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        },
        timeValueTemp: {
          levelRange: 'month',
          timeType: 3,
          dateValue: this.$Date().format('YYYY-MM-01'),
          dateValueText: this.$Date().format('YYYY-MM'),
          dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        },
      }
    },
    components: { energyGraph },
    methods: {
      search() {
        this.timeValue = cloneDeep(this.timeValueTemp)
        this.model = this.modelTemp
        this.$nextTick(() => {
          this.$refs.graphRef.reDrawGraph()
        })
      },
      reset() {
        this.model = 'location'
        this.modelTemp = 'location'
        this.timeValueTemp = {
          levelRange: 'month',
          timeType: 3,
          dateValue: this.$Date().format('YYYY-MM-01'),
          dateValueText: this.$Date().format('YYYY-MM'),
          dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        }
        this.search()
      },
    },
    mounted() {},
  }
</script>
<style lang="less" scoped>
  .content-box {
    height: calc(~'100vh - 210px');
    .search-bar {
      padding: 15px;
      background: #1a202e;
      border-radius: 5px;
      /deep/.ivu-form-item {
        margin-bottom: 0;
      }
    }
    .chart-box {
      height: calc(~'100% - 73px');
      border-radius: 5px;
    }
  }
</style>
