export default {
  data() {
    return {
      initTimeValue: {
        levelRange: 'month',
        timeType: 3,
        dateValue: this.$Date().format('YYYY-MM-01'),
        dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
      },
      timeValue: {
        levelRange: 'month',
        timeType: 3,
        dateValue: this.$Date().format('YYYY-MM-01'),
        dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
      },
      tableData: { list: [], pageSize: 10, pageNo: 1, total: 0 },
      resultQueryParams: null,
    }
  },
  methods: {
    changePageSize(e) {
      this.tableData.pageSize = e
      this.$nextTick(() => {
        this.search()
      })
    },
    changePageNo(e) {
      this.tableData.pageNo = e
      this.$nextTick(() => {
        this.search()
      })
    },
  },
}
