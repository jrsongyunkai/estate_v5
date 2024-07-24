<template>
  <div class="mo-item">
    <div class="header">
      <div class="left-title">
        <div class="bor"></div>
        <div>{{ $t('phaseAngle') }}</div>
      </div>
      <div class="right-box"></div>
    </div>
    <div class="content">
      <div class="row-box">
        <div class="left">
          <div class="content">
            <div class="chart-box">
              <div class="dot-round"></div>
              <div class="round" v-for="r in roundList" :key="r" :style="`width: ${r}%; padding-bottom: ${r}%`"></div>
              <div class="divide" v-for="d in divideList" :class="{ leftLine: d === 0, topLine: d === 90 }" :key="d" :style="{ transform: `rotate(${d}deg)` }"></div>
              <!-- <div class="vector" title="A相电流" style="transform: rotate(60deg)"><VectorSvg style="width: 100%" color="#eeac1f" :lineWidth="2"></VectorSvg></div>
              <div class="vector" title="B相电流" style="transform: rotate(180deg)"><VectorSvg style="width: 50%" color="#046d29" :lineWidth="2"></VectorSvg></div>
              <div class="vector" title="C相电流" style="transform: rotate(300deg)"><VectorSvg style="width: 50%" color="#ff021b" :lineWidth="2"></VectorSvg></div> -->
              <!-- <div class="vector" title="A相电压"><VectorSvg style="width: 100%" color="#eeac1f" type="voltage" :lineWidth="4"></VectorSvg></div>
              <div class="vector" title="B相电压" style="transform: rotate(-120deg)"><VectorSvg style="width: 100%" color="#046d29" type="voltage" :lineWidth="4"></VectorSvg></div>
              <div class="vector" title="C相电压" style="transform: rotate(120deg)"><VectorSvg style="width: 100%" color="#ff021b" type="voltage" :lineWidth="4"></VectorSvg></div> -->
              <div v-for="(item, index) in standardVoltages" class="vector" :key="index" :title="item.title" :style="{ transform: `rotate(${item.rotate}rad)` }">
                <VectorSvg :style="{ width: `${item.rate}%` }" type="voltage" :color="item.color" :lineWidth="2"></VectorSvg>
              </div>
              <div v-for="(item, index) in currentList" class="vector" :key="index" :title="item.title" :style="{ transform: `rotate(${item.rotate}rad)` }">
                <VectorSvg :style="{ width: `${item.rate}%` }" :color="item.color" :lineWidth="4"></VectorSvg>
              </div>
              <!-- <div class="vector" title="A相电压" style="transform: rotate(-0.2rad)"><VectorSvg style="width: 90%" color="#eeac1f90" type="voltage" :lineWidth="2"></VectorSvg></div> -->
              <!-- <div class="vector" title="B相电压" style="transform: rotate(4rad)"><VectorSvg style="width: 60%" color="#046d29" type="voltage" :lineWidth="2"></VectorSvg></div> -->
              <!-- <div class="vector" title="C相电压" style="transform: rotate(4.3rad)"><VectorSvg style="width: 94%" color="#ff021b" type="voltage" :lineWidth="2"></VectorSvg></div> -->
            </div>
          </div>
        </div>
        <div class="right">
          <div class="top-des">
            <div>{{ $t('realTimePhasor') }} ：</div>
            <div class="des-item">
              <span>{{ $t('current') }} ：</span>
              <VectorSvg style="width: 100px" color="#fff"></VectorSvg>
            </div>
            <div class="des-item">
              <span>{{ $t('voltage') }} ：</span>
              <VectorSvg type="voltage" style="width: 100px" color="#fff"></VectorSvg>
            </div>
          </div>
          <div class="table-des">
            <table style="width: 100%">
              <thead>
                <tr class="tableStyle">
                  <th class="tCenter"></th>
                  <th class="tCenter">{{ $t('APhase') }}</th>
                  <th class="tCenter">{{ $t('BPhase') }}</th>
                  <th class="tCenter">{{ $t('CPhase') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="rowStyle">
                  <td class="tableTitle" style="color: #999999">{{ $t('currentValue') }}</td>
                  <td class="tableTitle" :style="{ color: aColor }">{{ info && info.aa }}(A)</td>
                  <td class="tableTitle" :style="{ color: bColor }">{{ info && info.ba }}(A)</td>
                  <td class="tableTitle" :style="{ color: cColor }">{{ info && info.ca }}(A)</td>
                </tr>
                <tr class="rowStyle">
                  <td class="tableTitle" style="color: #999999">{{ $t('voltageValue') }}</td>
                  <td class="tableTitle" :style="{ color: aColor }">{{ info && info.av }}(V)</td>
                  <td class="tableTitle" :style="{ color: bColor }">{{ info && info.bv }}(V)</td>
                  <td class="tableTitle" :style="{ color: cColor }">{{ info && info.cv }}(V)</td>
                </tr>
                <tr class="rowStyle">
                  <td class="tableTitle" style="color: #999999">{{ $t('currentPhaseAngle') }}</td>
                  <td class="tableTitle" :style="{ color: aColor }">{{ info && info.apDegrees }}(rad)</td>
                  <td class="tableTitle" :style="{ color: bColor }">{{ info && info.bpDegrees }}(rad)</td>
                  <td class="tableTitle" :style="{ color: cColor }">{{ info && info.cpDegrees }}(rad)</td>
                </tr>
                <tr class="rowStyle">
                  <td class="tableTitle" style="color: #999999">{{ $t('voltagePhaseAngle') }}</td>
                  <td class="tableTitle" :style="{ color: aColor }">{{ '0' }}(rad)</td>
                  <td class="tableTitle" :style="{ color: bColor }">{{ '0' }}(rad)</td>
                  <td class="tableTitle" :style="{ color: cColor }">{{ '0' }}(rad)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VectorSvg from '../common/VectorSvg.vue'
  import useQualityMixin from '../mixins/useQualityMixin'
  import { queryChannelDetailsByBoxAndAddr } from '@/api/control/index'
  export default {
    components: { VectorSvg },
    mixins: [useQualityMixin],
    data() {
      return {
        roundList: ['10', '30', '50', '70', '90'],
        divideList: [0, 45, 90, 135],
        indicateList: [
          { class: 'right', text: 0 },
          { class: 'left', text: 180 },
          { class: 'top', text: 90 },
          { class: 'bottom', text: -90 },
        ],
        info: { aa: null, ba: null, ca: null, apDegrees: null, bpDegrees: null, cpDegrees: null },
        aColor: '#dfe73d',
        bColor: '#21f27f',
        cColor: '#ff3d00',
      }
    },
    computed: {
      currentList() {
        const { aa, ba, ca, apDegrees, bpDegrees, cpDegrees } = this.info
        const max = Math.max(+aa, +ba, +ca)
        const rateA = 20 + (+aa / max) * 80
        const rateB = 20 + (+ba / max) * 80
        const rateC = 20 + (+ca / max) * 80
        return [
          { title: `${this.$t('APhaseCurrent')}:${aa === void 0 ? '-' : aa}A`, rotate: -(+apDegrees - Math.PI / 2), rate: rateA, color: this.aColor },
          { title: `${this.$t('BPhaseCurrent')}:${ba === void 0 ? '-' : ba}A`, rotate: -(+bpDegrees - Math.PI / 2) - (2 * Math.PI) / 3, rate: rateB, color: this.bColor },
          { title: `${this.$t('CPhaseCurrent')}:${ca === void 0 ? '-' : ca}A`, rotate: -(+cpDegrees - Math.PI / 2) + (2 * Math.PI) / 3, rate: rateC, color: this.cColor },
        ]
      },
      standardVoltages() {
        const { av, bv, cv } = this.info
        return [
          { title: `${this.$t('APhaseVoltage')} :${av === void 0 ? '-' : av}V`, rotate: 0, rate: 100, color: this.aColor },
          { title: `${this.$t('BPhaseVoltage')}:${bv === void 0 ? '-' : bv}V`, rotate: -(2 * Math.PI) / 3, rate: 100, color: this.bColor },
          { title: `${this.$t('CPhaseVoltage')}:${cv === void 0 ? '-' : cv}V`, rotate: (2 * Math.PI) / 3, rate: 100, color: this.cColor },
        ]
      },
    },
    methods: {
      async init() {
        const res = await queryChannelDetailsByBoxAndAddr({ mac: this.deviceInfo.mac, addrs: this.addrInfo.addr })
        if (res.success) {
          this.info = { ...(res.data && res.data[0]) }
        } else {
          this.$Message.error(res.message)
        }
      },
    },
    mounted() {
      this.init()
    },
  }
</script>

<style lang="less" scoped>
  .row-box {
    width: 100%;
    display: flex;
    .left {
      width: 50%;
      height: 360px;
      position: relative;
      .content {
        width: 80%;
        height: 80%;
        display: flex;
        justify-content: center; //水平居中
        align-items: center; //垂直居中
        position: absolute;
        left: 10%;
        top: 10%;
        .chart-box {
          width: 100%;
          height: 100%;
          max-height: 300px;
          max-width: 300px;
          display: flex;
          justify-content: center; //水平居中
          align-items: center; //垂直居中
          position: relative;
          .dot-round {
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background: #fff;
            position: absolute;
            z-index: 10;
          }
          .round {
            width: 40%;
            padding-bottom: 40%;
            border-radius: 100%;
            border: 1px solid #fff;
            position: absolute;
          }
          .divide {
            width: 90%;
            height: 1px;
            background: #ddd;
            position: absolute;
            transform: rotate(90deg);
          }
          .leftLine {
            &::before {
              content: '180°';
              line-height: 20px;
              height: 20px;
              position: absolute;
              display: inline-block;
              right: calc(~'100% + 5px');
              margin-top: -10px;
            }
            &::after {
              content: '0°';
              line-height: 20px;
              height: 20px;
              position: absolute;
              display: inline-block;
              left: calc(~'100% + 5px');
              margin-top: -10px;
            }
          }
          .topLine {
            &::before {
              content: '90°';
              line-height: 20px;
              height: 20px;
              position: absolute;
              display: inline-block;
              right: calc(~'100% + 5px');
              margin-top: -10px;
              transform: rotate(-90deg);
            }
            &::after {
              content: '-90°';
              line-height: 20px;
              height: 20px;
              position: absolute;
              display: inline-block;
              left: calc(~'100% + 5px');
              margin-top: -10px;
              transform: rotate(-90deg);
            }
          }
          .vector {
            width: 45%;
            height: 20px;
            position: absolute;
            left: 50%;
            transform-origin: 0px 10px;
            // /deep/.vector-svg {
            // }
          }
          .indicate {
            position: absolute;
            height: 20px;
            line-height: 20px;
          }
          .indicate.right {
            left: calc(~'95% + 5px');
            top: calc(~'50% - 10px');
          }
          .indicate.left {
            top: calc(~'50% - 10px');
            right: calc(~'95% + 5px');
            text-align: right;
          }
          .indicate.top {
            bottom: calc(~'90% - 20px');
          }
          .indicate.bottom {
            top: calc(~'90% - 20px');
          }
        }
      }
    }
    .right {
      width: 50%;
      .top-des {
        width: 100%;
        display: flex;
        height: 60px;
        align-items: center;
        .des-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-left: 30px;
        }
      }
      .table-des {
        margin-top: 20px;
        .tableStyle {
          padding: 15px;
          border-collapse: collapse;
          background-color: #28313f;
        }
        .rowStyle {
          padding: 15px 15px;
        }
        .tableTitle {
          text-align: center;
          width: 22%;
          padding: 15px 10px;
          border-bottom: 1px solid #4f5155;
          font-size: 16px;
        }
        .tCenter {
          padding: 15px;
        }
      }
    }
  }
</style>
