<template>
  <div id="IntelligentWaterMeter" style="width: 100%">
    <div class="header">
      <div class="left"></div>
      <div class="right">
        <Button type="primary" ghost @click="queryChaoBiaoMaoTable">{{ $t('refresh') }}</Button>
        <DatePicker class="ml-10" :value="value1" :editable="false" type="daterange" format="yyyy-MM-dd" @on-change="handleDateRangeChange" :clearable="false" transfer style="width: 220px"></DatePicker>
      </div>
    </div>
    <Row class="tc">
      <Col style="padding: 15px">
        <span>{{ $t('meterReadingDegree') + ':' }}</span>
        <span>{{ lastScale + $t('ton') }}</span>
      </Col>
    </Row>
    <Table :data="tableData" :columns="columnstable" max-height="520"></Table>
  </div>
</template>
<script>
  import { findLastChannelByMac, queryChaobiaomaoChannel } from '@/api/public'
  import dayjs from 'dayjs'
  export default {
    props: { param: { type: Object } },
    data() {
      return {
        columnstable: [
          { title: this.$t('preScale'), key: 'preScale' },
          { title: this.$t('curScale'), key: 'curScale' },
          { title: this.$t('waterVolume'), key: 'waterVolume' },
          { title: this.$t('timeRange1'), key: 'timeRange' },
          { title: this.$t('meterReadTime'), key: 'meterReadTime' },
        ],
        lastScale: '',
        tableData: [],
        value1: [],
      }
    },
    mounted() {
      this.value1 = [this.$func.formatDate('yyyy-MM-dd', new Date(new Date().setDate(new Date().getDate() - 7))), this.$func.formatDate('yyyy-MM-dd', new Date(new Date().setDate(new Date().getDate() - 1)))]
      this.init()
      this.queryChaoBiaoMaoTable()
    },
    methods: {
      async init() {
        const res = await findLastChannelByMac({ mac: this.param.mac })
        if (res.success) {
          this.lastScale = res.data.lastScale
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryChaoBiaoMaoTable() {
        let params = { mac: this.param.mac, startTime: this.value1[0], endTime: this.value1[1] }
        const res = await queryChaobiaomaoChannel(params)
        if (res.success) {
          this.tableData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleDateRangeChange(val) {
        this.value1 = val
        this.queryChaoBiaoMaoTable()
      },
    },
  }
</script>

<style lang="less" scoped>
  .header {
    height: 43px;
    border-bottom: 1px solid #5e626c;
    .right {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  /deep/::-webkit-scrollbar {
    width: 6px; //竖轴宽度
    height: 6px; //横轴宽度
  }
  /* 滚动槽 */
  /deep/::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  /deep/::-webkit-scrollbar-thumb {
    background-color: #1a202e;
  }
</style>
