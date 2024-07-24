import { cloneDeep } from 'lodash'
export default {
  props: {
    electDataList: { type: Array, default: () => [] },
  },
  data() {
    return {
      model: 'echart',
      pageNo: 1,
      pageSize: 10,
      echartItem: { type: 'bar', emphasis: { focus: 'series' } },
    }
  },
  methods: {
    handleCurrentChange(e) {
      this.pageNo = e
    },
  },
  computed: {
    total() {
      return this.electDataList.length
    },
    tableData() {
      let electDataList = cloneDeep(this.electDataList)
      let list = electDataList
        .reverse()
        .slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
        .flatMap(it => [it, it, it])
      return list
    },
  },
  watch: {
    electDataList: {
      handler() {
        this.pageNo = 1
      },
      deep: true,
    },
  },
}
