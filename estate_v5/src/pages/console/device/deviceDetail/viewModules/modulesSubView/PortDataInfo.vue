<template>
  <div style="padding-top: 10px">
    <DeviceParamHead :text="$t('portData')">
      <div class="port-Data-flex"></div>
    </DeviceParamHead>
    <div v-if="isShareTime" class="box-flex">
      <div class="out-in-box" v-for="(item, index) in outputInAllList" :key="index" :class="item.class">
        <div class="out-in-box-title">
          <div v-display="'flex'">
            <span class="round-box" :style="{ background: item.color }"></span>
            <span>{{ item.name }}</span>
          </div>
          <div v-if="item.isOut">
            <span class="green-text marginL-14">{{ item.desc }}</span>
            <Switch v-model="item.statusValue" />
          </div>
          <div v-else class="blue-text marginL-14">{{ item.desc }}</div>
        </div>
      </div>
    </div>
    <div>
      <Table :columns="timeShareColumns" :data="loopList" height="400" @on-selection-change="getSelection">
        <template #portStatus="{ index }">
          {{ $t('loop2', { index: index + 1 }) }}
        </template>
        <template #otherName="{ index }">
          {{ $t('loop2', { index: index + 1 }) }}
        </template>
        <template #status="{ row, index }">
          <div v-if="[1, 2].includes(row.status)"><Switch v-model="loopList[index].value" @on-change="change" /></div>
          <div v-else>{{ statusConfig[row.status] || $t('nothing') }}</div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
  import DeviceParamHead from '../component/DeviceDataHead.vue'
  const columnsTable = [
    {
      title: window.$t('loop'),
      slot: 'portStatus',
    },
    {
      title: window.$t('alias'),
      slot: 'otherName',
    },
    {
      title: window.$t('state'),
      slot: 'status',
    },
    {
      title: window.$t('CurrentA'),
      key: 'culVal',
    },
    {
      title: `${window.$t('leakage')}（mA）`,
      key: 'lkVal',
    },
  ]
  const inConfig = {
    0: window.$t('default'),
    1: window.$t('input'),
  }
  const outConfig = {
    0: window.$t('default'),
    1: window.$t('output2'),
  }
  const statusConfig = {
    3: window.$t('overCurrentAlarm'),
    4: window.$t('leakageAlarm'),
  }
  export default {
    components: {
      DeviceParamHead,
    },
    props: {
      mac: String,
      infoData: {
        type: Object,
        default: () => {},
      },
    },

    data() {
      return {
        statusConfig,
        columnsTable,
        outputInAllList: [],
        isShareTime: null,
        loopList: [],
      }
    },
    mounted() {},
    watch: {
      infoData: {
        handler(val) {
          if (val) {
            this.getRealData()
          }
        },
        deep: true,
      },
    },
    computed: {
      timeShareColumns() {
        return this.isShareTime ? columnsTable : columnsTable.filter(v => v.key !== 'lkVal')
      },
    },
    methods: {
      openConfigModal() {},
      getSelection(val) {},
      change() {},
      getRealData() {
        const { loopList, switchInputList, switchOuputList, isShareTime } = this.infoData
        this.isShareTime = isShareTime
        const mapInputList = switchInputList.map((v, i) => ({ class: 'blue-style', color: '#02a7f0', name: this.$t('switchInput', { index: i + 1 }), status: v, desc: inConfig[v], isOut: false }))
        const mapOutputList = switchOuputList.map((v, i) => ({ class: 'green-style', color: '#0cccce', name: this.$t('switchOutput2', { index: i + 1 }), status: v, desc: outConfig[v], statusValue: !!v, isOut: true }))
        this.outputInAllList = mapInputList.concat(mapOutputList)
        this.loopList = loopList.map(v => ({ ...v, value: !!v.status }))
      },
    },
  }
</script>

<style lang="less" scoped>
  .port-Data-flex {
    display: flex;
    flex: end;
  }
  .out-in-box {
    flex: 1;
    height: 60px;
    margin: 10px;
    padding: 10px;
  }
  .round-box {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-top: 5px;
    margin-right: 5px;
  }
  .out-in-box-flex {
    display: flex;
    justify-content: space-between;
  }
  .out-in-box-flex-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .box-flex {
    display: flex;
    justify-content: space-around;
  }
  .green-style {
    background-color: #173642;
  }
  .marginL-14 {
    margin-left: 14px;
  }
  .green-text {
    color: #0cccce;
  }
  .blue-text {
    color: #02a7f0;
  }
  .blue-style {
    background-color: #172d41;
  }
</style>
