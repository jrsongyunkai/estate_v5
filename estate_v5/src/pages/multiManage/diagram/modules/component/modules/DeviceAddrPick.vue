<template>
  <ELPCascader class="addr-info-input" :options="addrData" style="width: 100%; margin-left: 0px; padding: 0px" v-model="addrValue" filterable :placeholder="$t('pullDownRetrieveDeviceLines')">
    <template slot-scope="{ data }">
      <div class="el-cascader-label-content">
        <Tooltip placement="left" :disabled="data.label.length < 8" transfer transfer-class-name="el-cascader-label-tips">
          <div class="label-text-content">{{ data.label }}</div>
          <template #content>
            <div>{{ data.label }}</div>
          </template>
        </Tooltip>
      </div>
    </template>
  </ELPCascader>
</template>

<script>
  import { pageQueryAddrCommon } from '@/api/public'
  export default {
    props: {
      value: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        addrData: [],
        addrValue: [],
        deviceList: [],
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      async loadData() {
        let res = await pageQueryAddrCommon({ projectCode: this.$store.state.projectCode, equipmentTypes: '1', pageSize: 9999, pageNo: 1 })
        if (res.success) {
          this.deviceList = res.datas
          this.addrData = res.datas.map(it => {
            return { value: it.resId, label: it.name, children: (it.addrs && it.addrs.map(item => ({ value: item.addr, label: item.title }))) || [] }
          })
        } else {
          this.$Message.error(res.message)
        }
      },
    },
    mounted() {},
    watch: {
      addrValue: {
        handler(val) {
          this.$emit('input', val)
          if (val[0]) {
            let deviceInfo = this.deviceList.find(it => it.resId === val[0])
            if (deviceInfo && !val[1]) {
              this.$emit('changeName', { deviceName: deviceInfo.name, mac: deviceInfo.mac })
            } else if (deviceInfo && val[1]) {
              let addrInfo = deviceInfo && deviceInfo.addrs.find(it => it.addr === val[1])
              if (addrInfo) {
                this.$emit('changeName', { deviceName: deviceInfo.name, mac: deviceInfo.mac, addrName: addrInfo.title })
                this.$emit('changeSwitchType', addrInfo.switchType)
              }
            }
          }
        },
        deep: true,
      },
      value: {
        handler(value) {
          this.addrValue = value
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less">
  .addr-info-input {
    .el-input__inner,
    .el-range-input {
      color: #fff;
    }
  }
</style>
<style lang="less">
  .el-cascader-label-content {
    width: 100%;
    height: 34px;
    display: flex;
    align-items: center;
    .label-text-content {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ivu-tooltip {
      width: 100%;
      height: 34px;
      line-height: 34px;
    }
  }
</style>
