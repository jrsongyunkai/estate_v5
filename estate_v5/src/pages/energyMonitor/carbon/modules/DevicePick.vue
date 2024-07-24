<template>
  <Select transfer v-model="deviceID" :clearable="false" :placeholder="$t('pullDownRetrieveDevice')" filterable>
    <Option v-for="item in deviceList" :key="item.id" :label="`${item.name}(${item.mac})`" :value="item.resId"></Option>
  </Select>
</template>

<script>
  import { queryBoxes } from '@/api/public'
  export default {
    props: {
      value: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        deviceList: [],
        deviceID: null,
      }
    },
    methods: {
      async loadDevices() {
        let res = await queryBoxes({ pageNo: 1, pageSize: 999999, projectCode: this.$store.state.projectCode, equipmentTypes: '1', mac: null, addr: null })
        if (res.success) {
          this.deviceList = [...res.datas]
        } else {
          this.$Message.error(res.message)
        }
      },
    },
    created() {
      this.loadDevices()
    },
    mounted() {
      this.deviceID = this.value
    },
    watch: {
      deviceID: {
        handler(value) {
          this.$emit('input', value)
        },
        deep: true,
      },
    },
  }
</script>

<style></style>
