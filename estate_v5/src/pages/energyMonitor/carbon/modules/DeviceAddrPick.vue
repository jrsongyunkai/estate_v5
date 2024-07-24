<template>
  <el-cascader style="width: 100%; margin-left: 0; padding: 0px" :options="addrData" v-model="addrValue" transfer filterable :placeholder="$t('pullDownRetrieveDeviceLines')" />
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
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      async loadData() {
        let res = await pageQueryAddrCommon({ projectCode: this.$store.state.projectCode, equipmentTypes: 'all', pageSize: 9999, pageNo: 1 })
        if (res.success) {
          this.addrData = res.datas
            .filter(it => it.addrs && it.addrs.length > 0)
            .map(it => {
              return {
                value: it.resId,
                label: it.name,
                children: it.addrs.map(item => ({ value: item.addr, label: item.title })),
              }
            })
        } else {
          this.$Message.error(res.message)
        }
      },
    },
    mounted() {
      this.addrValue = this.value
    },
    watch: {
      addrValue: {
        handler(val) {
          this.$emit('input', val)
        },
        deep: true,
      },
    },
  }
</script>
