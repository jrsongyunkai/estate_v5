<template>
  <div class="select-addr-box">
    <Select v-model="device.mac" :placeholder="$t('pleaseSelectADevice')" style="width: 200px" @on-change="changeDevice">
      <Option v-for="op in deviceOptions" :key="op.value" :value="op.value">{{ op.label }}</Option>
    </Select>
    <Select class="ml-10" v-model="device.addrs" multiple :max-tag-count="1" :placeholder="$t('pleaseSelectLine2')" style="width: 300px">
      <Option v-for="op in deviceAddrList" :key="op.value" :value="op.value">{{ op.label }}</Option>
    </Select>
  </div>
</template>

<script>
  import { elecTopology4BoxTree, queryDeviceDimensionChildsTree } from '@/api/public'
  export default {
    props: {
      value: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        deviceOptions: [],
        deviceAddrList: [],
        device: { mac: '', addrs: [] },
      }
    },
    methods: {
      async getAllDevice() {
        let res = await elecTopology4BoxTree({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.deviceOptions = res.data && res.data.length > 0 ? [...res.data.map(it => ({ label: it.name, value: it.mac }))] : []
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      changeDevice() {
        this.device.addrs = []
      },
    },
    watch: {
      device: {
        handler(value) {
          this.$emit('input', value)
        },
        deep: true,
      },
      'device.mac': {
        async handler(value) {
          if (value) {
            this.deviceAddrList = []
            let res = await queryDeviceDimensionChildsTree({ projectCode: this.$store.state.projectCode, mac: value, addr: '' })
            if (res.success) {
              this.deviceAddrList = res.data && res.data.length > 0 ? [...res.data.map(it => ({ label: it.name, value: it.addr }))] : []
            } else {
              this.$Message.error({ content: res.message })
            }
          }
        },
        deep: true,
      },
    },
    mounted() {
      this.getAllDevice()
      this.device.mac = this.value.mac
      this.device.addrs = [...this.value.addrs]
    },
  }
</script>
<style lang="less" scoped>
  .select-addr-box {
    display: inline-block;
  }
</style>
