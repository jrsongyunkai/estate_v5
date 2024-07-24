<template>
  <div class="project-selection">
    <Scroll>
      <Form ref="form" inline size="small" :model="form" @submit.native.prevent class="demo-form-inline">
        <FormItem>
          <Input v-model="form.name" clearable :placeholder="$t('projectCode') + '/' + $t('projectName')"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="onSubmit">{{ $t('query') }}</Button>
        </FormItem>
      </Form>
      <Col :span="24">
        <Table ref="multipleTable" :data="tableData" :columns="columnsTable" @on-select="handleSelect" @on-select-cancel="cancelSelect" @on-select-all="handleSelection" @on-select-all-cancel="cancelAllSelect"></Table>
      </Col>
    </Scroll>
    <Page class="position-page" style="margin-top: 20px" background show-elevator @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="currentPage" :page-size-opts="[10, 20, 30]" :page-size="pageSize" :total="total" show-total></Page>
  </div>
</template>
<script>
  import { listProjectForConfig } from '@/api/public'
  export default {
    name: 'project-select',
    model: { prop: 'options', event: 'select-multiple' },
    props: {
      options: {
        type: Array,
        defalut() {
          return []
        },
      },
      type: {
        type: String,
        defalut() {
          return ''
        },
      },
    },
    data() {
      return {
        columnsTable: [
          // { title: '选择', slot: 'chiose', with: 60 },
          { type: 'selection', width: 60, align: 'center' },
          { title: this.$t('projectCode'), key: 'code' },
          { title: this.$t('projectName'), key: 'name' },
        ],
        form: {
          name: '',
        },
        multipleSelection: [],
        tableData: [],
        pageNo: 1,
        pageSize: 10,
        currentPage: 1,
        total: 0,
        newOptions: this.options,
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.initTable()
      },
      async initTable() {
        let params = {
          params: { keyword: this.form.name },
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        }
        const res = await listProjectForConfig(params)
        if (res.success) {
          this.tableData = res.datas
          this.total = res.total
          this.$nextTick(function () {
            this.checked()
          })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      checked() {
        let _this = this
        this.newOptions.forEach(item => {
          _this.tableData.forEach((value, index) => {
            if (value.code === item.code) {
              _this.$refs.multipleTable.toggleSelect(index)
            }
          })
        })
      },
      cancelAllSelect(row) {
        this.$emit('cancelAll', row)
      },
      handleSelection(row) {
        let _index = JSON.stringify(this.newOptions).indexOf(JSON.stringify({ code: row.code, name: row.name, others: {} }))
        if (_index === -1) {
          let ownOptions = []
          row.map(item => {
            ownOptions.push({ code: item.code, name: item.name, others: {} })
          })
          this.$emit('select-all', ownOptions)
        } else {
          this.options.forEach((item, i) => {
            if (item.code === row.code) {
              this.options.splice(i, 1)
            }
          })
          this.$emit('select-multiple', this.options)
        }
      },
      handleSelectable(row, index) {
        let _index = JSON.stringify(this.newOptions).indexOf(JSON.stringify({ code: row.code, name: row.name, others: {} }))
        return _index === -1
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.initTable()
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.initTable()
      },
      cellStyle(row) {
        if (row.columnIndex === 0 && this.type !== 'firstChoice') {
          return 'choose-cell'
        }
      },
      onSubmit() {
        this.initTable()
      },
      cancelSelect(selection, row) {
        this.$emit('cancelProject', row)
      },
      handleSelect(selection, row) {
        this.Options = []
        this.Options.push(row)
        this.$emit('select-multiple', this.Options)
        this.$emit('closeProjects')
      },
    },
  }
</script>
<style lang="less" scoped>
  .project-selection {
    height: 400px;
  }
  .position-page {
    margin-left: 150px;
  }
  .el-table,
  .el-table th,
  .el-table td {
    border: 1px solid #ebeef5;
    color: #909399;
  }
  .el-table .choose-cell .cell {
    .el-checkbox__inner {
      display: none;
      position: relative;
      &::before {
        content: '选择';
        position: absolute;
        right: 8px;
      }
    }
  }
</style>
