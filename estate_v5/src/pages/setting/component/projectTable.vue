<template>
  <div>
    <div style="margin: 10px 0">
      <Input v-model="name" clearable :placeholder="$t('projectName')" style="width: 200px; margin-right: 10px"></Input>
      <Button type="primary" @click="init">{{ $t('query') }}</Button>
    </div>
    <Table ref="multipleTable" :data="tableData" :columns="columnsTable">
      <template #check="{ row, index }">
        <Checkbox v-model="tableData[index].checked" @on-change="selectMap($event, row.code)"></Checkbox>
      </template>
    </Table>
    <Page class="position-page" style="margin-top: 20px" background show-elevator @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="total" show-total></Page>
  </div>
</template>

<script>
  import { listProjectForConfig } from '@/api/public'
  export default {
    props: {
      prjList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        selectAll: false,
        name: '',
        pageNo: 1,
        pageSize: 10,
        total: 0,
        columnsTable: [
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center',
          // },
          {
            title: '',
            width: 100,
            align: 'center',
            slot: 'check',
            renderHeader: (h, params) => {
              return h('span', {}, [
                h(
                  'Checkbox',
                  {
                    ref: 'checkboxAll',
                    props: {
                      value: this.selectAll,
                    },
                    on: {
                      'on-change': event => {
                        this.setTableSelect(event)
                        this.selectAll = event
                        if (event) {
                          this.setAllSelectedPro()
                          return
                        }
                        this.deleteSelectAll()
                      },
                    },
                  },
                  this.$t('selectAll')
                ),
              ])
            },
          },
          {
            title: this.$t('projectCode'),
            key: 'code',
          },
          {
            title: this.$t('projectName'),
            key: 'name',
          },
        ],
        tableData: [],
        allProjectCode: [],
        selectDataMap: new Map(),
      }
    },
    async mounted() {
      this.getSelectedPro()
      await this.getAllProject()
      await this.init()
    },
    computed: {
      selectTableData() {
        return this.projectList.filter(item => this.selectDataMap.has(item.code)).map(item => ({ ...item, projectName: item.name, projectCode: item.code }))
      },
    },
    methods: {
      async init() {
        let params = {
          keyword: this.name,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        }
        const res = await listProjectForConfig(params)
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.tableData = res.datas.map(v => ({ ...v, checked: this.selectDataMap.has(v.code) }))
        this.total = res.total
      },
      setTableSelect(val) {
        this.tableData.forEach(v => {
          v.checked = val
        })
      },
      selectMap(event, code) {
        if (event) {
          this.setMap(code, null)
        } else {
          this.delMap(code)
        }
        this.$nextTick(() => {
          this.selectAll = !!this.allProjectCode.length && this.selectDataMap.size === this.allProjectCode.length
        })
      },
      setMap(val) {
        if (this.selectDataMap.has(val)) return
        this.selectDataMap.set(val, null)
      },
      delMap(code) {
        if (!this.selectDataMap.has(code)) return
        this.selectDataMap.delete(code)
      },
      getSelectedPro() {
        !!this.prjList.length &&
          this.prjList.forEach(v => {
            this.setMap(v.projectCode, null)
          })
      },
      deleteSelectAll() {
        this.selectDataMap.clear()
      },

      setAllSelectedPro() {
        this.deleteSelectAll()
        this.allProjectCode.forEach(v => {
          this.setMap(v, null)
        })
      },
      async getAllProject() {
        let params = {
          keyword: this.name,
          pageNo: this.pageNo,
          pageSize: 9999999,
        }
        const res = await listProjectForConfig(params)
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.allProjectCode = res.datas.map(v => v.code)
        this.projectList = res.datas
      },
      handleCurrentChange(e) {
        this.pageNo = e
        this.init()
      },
    },
  }
</script>

<style lang="less" scoped></style>
