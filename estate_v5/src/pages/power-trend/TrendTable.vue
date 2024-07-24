<template>
  <div class="power-trend-table">
    <el-table :data="currentPageData" border :row-class-name="rowClassName">
      <el-table-column minWidth="200" prop="time" align="center" :label="$t('time')"></el-table-column>
      <el-table-column minWidth="200" prop="value" align="center" :label="`${$t('instantaneousPowerValue')}（kW）`" :formatter="valueFormatter"></el-table-column>
    </el-table>
    <Page show-elevator @on-change="pageNo = $event" :current="pageNo" :page-size="pageSize" :total="data.length"></Page>
  </div>
</template>

<script>
  import { maxBy, get } from 'lodash/fp'

  export default {
    props: {
      data: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        pageSize: 10,
        pageNo: 1,
      }
    },
    computed: {
      currentPageData() {
        const start = (this.pageNo - 1) * this.pageSize
        const end = start + this.pageSize
        return this.data.slice(start, end)
      },
      maxItem() {
        return maxBy(get('value'), this.data) || null
      },
    },
    watch: {
      data() {
        this.pageNo = 1
      },
    },
    methods: {
      valueFormatter(row, _column, cellValue, _index) {
        let value = cellValue === null ? '-' : cellValue
        if (this.maxItem && this.maxItem.time === row.time) {
          value = `${value}（MAX）`
        }
        return value
      },
      rowClassName({ row }) {
        return row === this.maxItem ? 'power-trend-row-max' : ''
      },
    },
  }
</script>

<style lang="less" scoped>
  .power-trend-table {
    margin-top: 20px;
  }
</style>
<style lang="less">
  .power-trend-row-max {
    position: relative;
    td:last-child {
      color: #d9001b;
    }
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      box-sizing: border-box;
      width: ~'calc(100% - 1px)';
      height: 100%;
      border: 2px solid #d9001b;
    }
  }
</style>
