<template>
  <ELPCascader style="width: 285px" v-model="macLine" :options="macData" @on-change="$emit('onChange', $event)" filterable placeholder="请选择设备/线路">
    <template slot-scope="{ data }">
      <div class="el-cascader-label-content">
        <Tooltip :content="data.label" :disabled="data.label.length < 8" placement="left" transfer transfer-class-name="el-cascader-label-tips">
          <div class="label-text-content">{{ data.label }}</div>
        </Tooltip>
      </div>
    </template>
  </ELPCascader>
</template>

<script>
  import { pageQueryAddrCommon } from '../request/api'
  export default {
    props: {
      value: { type: Array, default: () => [] },
    },
    watch: {
      value: {
        handler(val) {
          this.macLine = val
        },
        immediate: true,
      },
      macLine(val) {
        this.$emit('input', val)
      },
    },
    data() {
      return {
        macLine: [],
        macData: [],
      }
    },
    methods: {
      async getDeviceSelectList() {
        let param = { projectCode: this.$store.state.projectCode || this.$route.query.projectCode, lineType: 'EXCEPT_IO', pageSize: 999999, pageNo: 1 }
        const res = await pageQueryAddrCommon(param)
        if (res.success) {
          this.macData = res.datas.map(item => ({
            value: item.resId,
            label: item.name + '(' + item.mac + ')',
            addrs: item.addrs,
            children: item.addrs.map(v => ({ value: v.addr, label: v.title })) || [],
          }))
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    created() {
      this.getDeviceSelectList()
    },
  }
</script>

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
