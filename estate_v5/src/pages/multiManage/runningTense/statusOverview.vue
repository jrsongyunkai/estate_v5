<template>
  <div>
    <div class="status-content" v-if="isOpen">
      <div class="status-flex-1">
        <div>{{ $t('realTimeStatusStatistics') }}</div>
        <div class="dis-flex status-statistics" v-for="(item, index) in statusList" :key="index">
          <div class="">
            <div :class="`${item.color}-status`" class="common-status-class">
              <i class="icon-v5" :class="[item.iconClass, item.color]" style="font-size: 50px"></i>
            </div>
          </div>
          <div class="status-flex-1 status-pdt">
            <div>{{ item.type }}</div>
            <div :class="item.color">{{ item.value }}</div>
          </div>
        </div>
      </div>
      <div class="status-trend">
        <div>{{ $t('todayStateChangeTrend') }}</div>
        <LineAreaChart style="height: 80%" :options="statusOptions"></LineAreaChart>
      </div>
    </div>
    <div v-else>
      <div class="img-noReport">
        <div style="text-align: center">
          <div><img src="/static/img/common/noReport.png" alt="" class="img-style" /></div>
          <div class="center-text">{{ $t('noDataTips') }}</div>
          <div>
            <Button type="primary" @click="startStatistics">{{ $t('startStatistics') }}</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LineAreaChart from './statusViewCharts.vue'
  import { statisticStart, statisticHistory } from '@api/multiManage/runningTense'
  export default {
    components: { LineAreaChart },
    props: {
      isOpen: Boolean,
    },
    data() {
      return {
        statusList: [
          { type: this.$t('poweredOff'), color: 'greenClass', value: '', iconClass: 'icon-v5-yiduan' },
          { type: this.$t('notPoweredOff'), color: 'redClass', value: '', iconClass: 'icon-v5-weiduan' },
          { type: this.$t('shouldBrokenButNotBroken'), color: 'orangeClass', value: '', iconClass: 'icon-v5-yingduanweiduan' },
        ],
        statusOptions: {
          title: {
            show: true,
            text: this.$t('unitPieces'),
          },
          xAxis: [],
          series: [],
          yAxis: [],
        },
      }
    },
    created() {
      if (this.isOpen) {
        this.getInitData()
      }
    },
    methods: {
      async startStatistics() {
        const res = await statisticStart({ projectCode: this.$store.state.projectCode })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.getInitData()
        this.$emit('changeIsOpen', true)
      },
      async getInitData() {
        const res = await statisticHistory({ projectCode: this.$store.state.projectCode })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        const { abnormal, off, on } = res.data.realTimeStatus
        this.statusList[0].value = off || '0'
        this.statusList[1].value = on || '0'
        this.statusList[2].value = abnormal || '0'
        this.statusOptions.xAxis = res.data.xAxis.map(v => v.substr(10))
        this.statusOptions.series = [
          { name: this.$t('poweredOff'), data: res.data.offStatusList, type: 'line', smooth: true },
          { name: this.$t('notPoweredOff'), data: res.data.onStatusList, type: 'line', smooth: true },
          { name: this.$t('shouldBrokenButNotBroken'), data: res.data.abnormalStatusList, type: 'line', smooth: true },
        ]
      },
    },
  }
</script>

<style lang="less" scoped>
  .img-noReport {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    background: #1a202e;
    height: ~'calc(100vh - 220px)';
    width: 100%;
    .img-style {
      height: 300px;
      width: 400px;
    }
    .center-text {
      margin: 10px 0;
    }
  }
  .status-content {
    margin-top: 10px;
    display: flex;
    background: #1a202e;
    padding: 10px;
    .dis-flex {
      display: flex;
    }

    .status-pdt {
      padding-top: 15px;
    }
    .status-flex-1 {
      flex: 1;
    }
    .status-statistics {
      margin-top: 10px;
      height: 100px;
      padding: 10px;
    }
    .status-trend {
      flex: 3;
      height: 370px;
    }
    .common-status-class {
      width: 95px;
      padding: 10px;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
    }
    .greenClass-status {
      background: #222f29;
    }
    .redClass-status {
      background: #2c1d2c;
    }
    .orangeClass-status {
      background: #2f2c2c;
    }
    .greenClass {
      color: #20ee7f;
    }
    .redClass {
      color: #ff5959;
    }
    .orangeClass {
      color: #ffa854;
    }
  }
</style>
