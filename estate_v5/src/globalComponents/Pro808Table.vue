<template>
  <div class="tableBox">
    <div class="selecteds-box" v-if="curSelect.length">
      <span v-if="curSelect.length !== all808Total">
        <span class="clear">{{ $t('checkedManyData', { num: curSelect.length }) }}</span>
        <span class="selectedAll" @click="getAllSelectedInfo">
          ，
          <span class="under-line">{{ $t('checkeAllPageManyData', { num: total }) }}</span>
        </span>
      </span>
      <span v-else>
        <span class="clear">{{ $t('checkedAllPageManyData', { num: curSelect.length }) }}</span>
        <span class="selectedAll" @click="clearSelected">
          ，
          <span class="under-line">{{ $t('cancelCheckAll') }}</span>
        </span>
      </span>
    </div>
    <div class="p-relative">
      <!-- <MLoading :loading="loading" /> -->
      <Table ref="table" :columns="columns" :data="tableData" v-bind="$attrs" @on-sort-change="handleSortChange" @on-select="handleSelect" @on-select-cancel="handleSelectCancel" @on-select-all="handleSelectAll" @on-select-all-cancel="handleClearSelect">
        <template v-for="item in columns" :slot="item.slot ? item.slot : ''" slot-scope="{ row, column, index }">
          <slot :name="item.slot ? item.slot : ''" v-bind="{ row, column, index }"></slot>
        </template>
      </Table>
    </div>
    <Page :total="total" v-model="pageNo" show-total show-sizer show-elevator :page-size="pageSize" @on-change="handleChangePage" :page-size-opts="pageSizeOpts" @on-page-size-change="handleChangePageSize" />
  </div>
</template>

<script>
  export default {
    name: 'Pro808Table',
    props: {
      columns: Array, // 列
      source: Function, // 数据请求接口
      // 自动初始化
      autoInit: {
        type: Boolean,
        default: false,
        required: false,
      },
      searchBarValues: Object, // 外部的参数
      selectedAllApi: Function, // 选中全部的请求
      selectedAllParams: Object, // 选中全部的参数
      idField: String, // 指定主key
    },
    data: () => ({
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      order: 'descending',
      sortName: '',
      curSelect: [],
      dataDict: {}, // 全量的数据字典, 供外部其他组件使用
      pageSizeOpts: [10, 20, 50, 100, 200],
      curSelectType: 0, // 808标识位 0-初始状态，都可以选择，1-是808 2非808
      all808Total: 0,
    }),
    computed: {},
    methods: {
      // 基础方法 获取数据  表格外会用的到这个方法
      reset() {
        this.pageNo = 1
        this.getData()
      },
      async getData() {
        const sort = this.sortName ? { sortName: this.sortName, order: this.order } : {}
        const params = {
          ...this.searchBarValues,
          ...sort,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        }
        const res = await this.source(params)
        this.pageNo = res.pageNo
        this.total = res.total
        this.syncTableDataCheckData(res.datas)
        this.syncDict(res.datas)
      },
      // 排序改变
      handleSortChange({ order, prop }) {
        if (order === 'ascending') {
          this.order = 'asc'
        } else if (order === 'descending') {
          this.order = 'desc'
        }
        this.sortName = prop
        this.pageNo = 1
        this.getData()
      },
      // 单个选择
      handleSelect(v) {
        // 如果是第一个选的
        if (!this.curSelect.length) {
          this.curSelectType = Number(v[0].lineType) === 5 ? 1 : 2
        }
        const ids = v.map(v => `${v[this.idField]}`)
        this.curSelect = [...new Set([...this.curSelect, ...ids])]
        this.syncTableDataCheckData(this.tableData)
      },
      // 单个取消
      handleSelectCancel(v) {
        const ids = v.map(v => `${v[this.idField]}`)
        const tIds = this.tableData.map(v => `${v[this.idField]}`)
        const diffIds = Array.from(new Set(ids.concat(tIds).filter(v => !new Set(ids).has(v) || !new Set(tIds).has(v))))
        diffIds.forEach(v => {
          const index = this.curSelect.findIndex(item => item === v)
          if (index !== -1) {
            this.curSelect.splice(index, 1)
          }
        })
        // 如果curSelect没有一个了，就把808状态置为初始化
        if (!this.curSelect.length) {
          this.curSelectType = 0
        }
        this.syncTableDataCheckData(this.tableData)
      },
      // 当前列表选中全部
      handleSelectAll(v) {
        // 如果是808模式，就清空所有的已选id，并且把808状态改为非808
        if (this.curSelectType === 1) {
          this.curSelect = []
          this.curSelectType = 2
        }
        this.handleSelect(v.filter(item => Number(item.lineType) !== 5))
      },
      // 当前列表全部不选
      handleClearSelect(v) {
        this.handleSelectCancel(v)
      },
      // 点击页码发生改变
      handleChangePage(v) {
        this.pageNo = v
        this.getData()
      },
      // 页码数量发生变化
      handleChangePageSize(v) {
        this.pageNo = 1
        this.pageSize = v
        this.getData()
      },
      // 发请求获取全部的列信息， 并且全部勾选上
      async getAllSelectedInfo() {
        const res = await this.selectedAllApi({
          ...this.selectedAllParams,
          projectCode: this.searchBarValues.projectCode,
        })
        // 把808禁选
        this.curSelectType = 2
        this.curSelect = res.data.filter(v => Number(v.lineType) !== 5).map(v => `${v[this.idField]}`)
        this.all808Total = this.curSelect.length
        this.syncTableDataCheckData(this.tableData)
        this.syncDict(res.data)
      },
      // 取消全部的勾选
      clearSelected() {
        // 808状态恢复初始
        this.curSelectType = 0
        this.curSelect = []
        this.syncTableDataCheckData(this.tableData)
      },
      // 同步勾选状态
      syncTableDataCheckData(source) {
        this.$nextTick(() => {
          this.tableData = source.map(item => {
            const is808 = Number(item.lineType) === 5
            let _disabled = false
            if (this.curSelectType === 1) {
              // 808模式 808可以勾选 非808禁选
              _disabled = !is808
            } else if (this.curSelectType === 2) {
              // 非808模式 808需要禁选 非808可以选择
              _disabled = is808
            }
            return {
              ...item,
              _checked: this.curSelect.includes(`${item[this.idField]}`),
              _disabled,
            }
          })
        })
      },
      syncDict(source) {
        if (!this.selectedAllParams || !this.selectedAllParams.filterFields) {
          return
        }
        this.dataDict = source.reduce((pre, cur) => {
          pre[cur[this.idField]] = this.selectedAllParams.filterFields.split(',').reduce((p, c) => {
            p[c] = cur[c]
            return p
          }, {})
          return pre
        }, {})
      },
      deleteItems(items) {
        this.curSelect = this.curSelect.filter(item => !items.includes(item))
        if (!this.curSelect.length) {
          this.curSelectType = 0
        }
        this.syncTableDataCheckData(this.tableData)
      },
    },
    mounted() {
      if (this.autoInit) this.getData()
    },
    watch: {
      curSelect: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.$emit('updateCurSelect', newVal)
          }
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .tableBox {
    position: relative;

    .column-setting {
      position: absolute;
      right: 20px;
      top: 15px;
      z-index: 20;

      .display-row {
        display: flex;
        justify-content: space-between;
      }

      .column-setting-icon {
        font-size: 16px;
        color: #ccc;
      }

      .reset {
        color: rgb(0, 118, 213);
        cursor: pointer;
      }
    }

    .selecteds-box {
      width: 100%;
      height: 25px;
      line-height: 16px;
      text-align: center;
      padding: 4px 0;
      background-color: rgba(0, 118, 213, 0.1);
      border-top: 1px solid rgb(0, 118, 213);

      .selecteds-length {
        flex: none;
        width: max-content;
      }

      .selecteds-labels {
        margin: 0 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: rgba(54, 194, 188, 1);
        display: flex;

        .label-box {
          background: rgba(0, 118, 213, 0.1);
          height: 20px;
          display: flex;
          border: 1px solid rgba(0, 118, 213, 0.1);
          font-size: 12px;
          border-radius: 2px;
          margin-right: 5px;

          .label-icon {
            border-right: 1px solid rgba(54, 194, 188, 1);
            cursor: pointer;
          }

          .label-id {
            text-align: center;
            line-height: 18px;
            padding: 0 4px;
          }
        }
      }

      .clear {
        width: auto;
        color: rgb(0, 118, 213);
      }

      .selectedAll {
        color: rgb(0, 118, 213);

        .under-line {
          text-decoration: underline;
          cursor: pointer;
        }

        .under-line:hover {
          text-decoration: underline;
          cursor: pointer;
          color: #ccc;
        }
      }
    }
  }
</style>
