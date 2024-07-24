<template>
  <div class="three-level-threshold-table">
    <DeviceParamHead :text="$t('threeLevelTHresold')"></DeviceParamHead>
    <div>
      <Table :columns="columnsTable" :data="thresholdData" class="thresholdTable">
        <template #paramsType="{ row }">{{ row.paramsType || '-' }}</template>
        <template #aLevelAlarm="{ row }">
          <div v-if="row.isSetting">
            <Input v-inputNumberRule="'TwoDecimal'" v-model="row.aLevelAlarm" />
            <div class="alarm-position action">
              <div class="position-Right pointer" @click="row.aLevelAlarm = row.aLevelAlarmDefault">{{ $t('writeDefault') }}</div>
            </div>
          </div>
          <span v-else>{{ row.aLevelAlarm || '-' }}</span>
        </template>

        <template #bLevelAlarm="{ row }">
          <div v-if="row.isSetting">
            <Input v-inputNumberRule="'TwoDecimal'" v-model="row.bLevelAlarm" />
            <div class="alarm-position action">
              <div class="position-Right pointer" @click="row.bLevelAlarm = row.bLevelAlarmDefault">{{ $t('writeDefault') }}</div>
            </div>
          </div>
          <span v-else>{{ row.bLevelAlarm || '-' }}</span>
        </template>
        <template #cLevelAlarm="{ row }">
          <div v-if="row.isSetting">
            <Input v-inputNumberRule="'TwoDecimal'" v-model="row.cLevelAlarm" />
            <div class="alarm-position action">
              <div class="position-Right pointer" @click="row.cLevelAlarm = row.cLevelAlarmDefault">{{ $t('writeDefault') }}</div>
            </div>
          </div>
          <span v-else>{{ row.cLevelAlarm || '-' }}</span>
        </template>
        <template #operation="{ row }">
          <Button type="text" class="action" @click="thresholdSetting(row)" v-if="!row.isSetting">{{ $t('setting1') }}</Button>
          <template v-if="row.isSetting">
            <Button type="text" class="action" @click="saveConfig(row)">{{ $t('save') }}</Button>
            <Button type="text" class="alarm" @click="cancelSave(row)">{{ $t('cancel') }}</Button>
          </template>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
  import DeviceParamHead from './DeviceDataHead.vue'
  import { getThreeLevelAlarmThreshold, setThreeLevelAlarmThreshold } from '@/api/console/device.js'
  const columnsTable = [
    {
      title: window.$t('paramsType'),
      slot: 'paramsType',
    },
    {
      title: window.$t('ALevelAlarm'),
      slot: 'aLevelAlarm',
    },
    {
      title: window.$t('ALevelAlarmDefault'),
      key: 'aLevelAlarmDefault',
    },
    {
      title: window.$t('BLevelAlarm'),
      slot: 'bLevelAlarm',
    },
    {
      title: window.$t('BLevelAlarmDefault'),
      key: 'bLevelAlarmDefault',
    },
    {
      title: window.$t('CLevelAlarm'),
      slot: 'cLevelAlarm',
    },
    {
      title: window.$t('CLevelAlarmDefault'),
      key: 'cLevelAlarmDefault',
    },
    {
      title: window.$t('operation'),
      slot: 'operation',
    },
  ]
  export default {
    components: {
      DeviceParamHead,
    },
    props: {
      addrInfo: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        columnsTable,
        thresholdData: [],
        middleValue: {
          aLevelAlarm: '',
          bLevelAlarm: '',
          cLevelAlarm: '',
        },
      }
    },
    methods: {
      async getTableConfig() {
        const res = await getThreeLevelAlarmThreshold({ mac: this.addrInfo.mac, addr: this.addrInfo.addr })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        // this.thresholdData=res.datas.map(v=>({...v,isSetting:false,}))
        const { va, vb, vc, ca, cb, cc, ta, tb, tc } = res.data
        this.thresholdData = [
          { id: 1, paramsType: this.$t('ampere'), aLevelAlarm: ca, aLevelAlarmDefault: 81.9, bLevelAlarm: cb, bLevelAlarmDefault: 75.6, cLevelAlarm: cc, cLevelAlarmDefault: 69.3 },
          { id: 2, paramsType: this.$t('volt'), aLevelAlarm: va, aLevelAlarmDefault: 286, bLevelAlarm: vb, bLevelAlarmDefault: 264, cLevelAlarm: vc, cLevelAlarmDefault: 242 },
          { id: 3, paramsType: this.$t('temperature1'), aLevelAlarm: ta, aLevelAlarmDefault: 84.5, bLevelAlarm: tb, bLevelAlarmDefault: 71.5, cLevelAlarm: tc, cLevelAlarmDefault: 65 },
        ].map(v => ({ ...v, isSetting: false }))
      },
      thresholdSetting(row) {
        row.isSetting = !row.isSetting
        for (let key in this.middleValue) {
          this.middleValue[key] = row[key]
        }
      },
      async saveConfig(row) {
        const paramsConfig = {
          1: {
            ca: row.aLevelAlarm,
            cb: row.bLevelAlarm,
            cc: row.cLevelAlarm,
          },
          2: {
            va: row.aLevelAlarm,
            vb: row.bLevelAlarm,
            vc: row.cLevelAlarm,
          },
          3: {
            ta: row.aLevelAlarm,
            tb: row.bLevelAlarm,
            tc: row.cLevelAlarm,
          },
        }
        const res = await setThreeLevelAlarmThreshold({
          mac: this.addrInfo.mac,
          addr: this.addrInfo.addr,
          ...paramsConfig[row.id],
        })
        if (!res.success) return this.$Message.error(res.message)
        this.$Message.success(this.$t('savedSuccessfully'))
        this.getTableConfig()
      },
      cancelSave(row) {
        for (let key in this.middleValue) {
          row[key] = this.middleValue[key]
        }
        row.isSetting = !row.isSetting
      },
    },

    watch: {
      addrInfo: {
        handler() {
          this.getTableConfig()
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .three-level-threshold-table {
    .thresholdTable {
      margin-top: 10px;
      width: 100%;
    }
    .alarm-position {
      position: relative;
    }
    .position-Right {
      position: absolute;
      right: 0;
      bottom: 5px;
    }
    .warn {
      color: #f7a352;
      // input {
      //   color: #f7a352;
      // }
    }
    .alarm {
      color: #da3b39;
      // input {
      //   color: #da3b39;
      // }
      // .ivu-btn-text:hover {
      //   color: #da3b39 !important;
      // }
    }
    .action {
      color: #0375f4;
    }
  }
</style>
