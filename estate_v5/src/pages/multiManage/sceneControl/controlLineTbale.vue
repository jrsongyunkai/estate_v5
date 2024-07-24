<template>
  <div class="line-details">
    <div>
      <span>
        {{ $t('owningDevice') }} &nbsp;&nbsp;
        <Input v-model="inputList" class="wd" :placeholder="$t('enterDeviceNo')"></Input>
      </span>
      <span class="ml">
        {{ $t('state') }} &nbsp;&nbsp;
        <Select v-model="statusValue" class="wd" :placeholder="$t('pleaseSelect')">
          <Option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></Option>
        </Select>
      </span>
      <span>
        &nbsp;&nbsp;
        <Button type="primary" @click="queryLineList">{{ $t('query') }}</Button>
        &nbsp;&nbsp;
        <Button type="default" @click="resetList">{{ $t('reset') }}</Button>
      </span>
      <span class="ml80">
        &nbsp;&nbsp;
        <Button type="primary" @click="addSelectLine">{{ $t('addSelectedRoute') }}</Button>
      </span>
    </div>
    <Table disabled-hover :columns="lineColumns" :data="lineListTable" :span-method="objectSpanMethod" class="table-top">
      <template slot-scope="{ row, index }" slot="check">
        <div :title="row.name" :style="{ backgroundColor: row.is2n ? '#212834' : '#1a202e', width: '100%', height: '100%', display: 'flex', justifyContent: 'left', paddingLeft: '20px', alignItems: 'center' }">
          <Checkbox v-model="row.checked" :indeterminate="row.isIndeterminate" @on-change="handlenameChange($event, index, row)">
            {{ row.name.length > 8 ? row.name.substr(0, 8) + '...' : row.name }}
          </Checkbox>
        </div>
      </template>
      <template slot-scope="{ row }" slot="mac">
        <div :style="{ backgroundColor: row.is2n ? '#212834' : '#1a202e', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }">{{ row.mac }}</div>
      </template>
      <template slot-scope="{ row }" slot="location">
        <div :style="{ backgroundColor: row.is2n ? '#212834' : '#1a202e', height: '100%', width: '100%', whiteSpace: 'nowrap', display: 'flex', justifyContent: 'center', alignItems: 'center' }">{{ row.location }}</div>
      </template>
      <template slot-scope="{ row, index }" slot="line">
        <div v-if="row.title" :style="{ backgroundColor: row.is2n ? '#212834' : '#1a202e', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }">
          <Checkbox v-model="row.linechecked" @on-change="handleAddrChange($event, index, row)">{{ row.title }}</Checkbox>
        </div>
        <div v-else :style="{ backgroundColor: row.is2n ? '#212834' : '#1a202e', height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }">&nbsp;</div>
      </template>
      <template slot-scope="{ row }" slot="lineStatus">
        <div :style="{ backgroundColor: row.is2n ? '#212834' : '#1a202e', height: '100%', width: '100%', color: row.oc ? '#70b603' : '#d8240d', display: 'flex', justifyContent: 'center', alignItems: 'center' }">{{ row.oc ? this.$t('closed') : this.$t('opened') }} &nbsp;</div>
      </template>
    </Table>
    <Page @on-page-size-change="handleNewSizeChange" @on-change="handleNewCurrentChange" :current.sync="newCurrentPage" :page-size-opts="[10, 20, 50, 100]" :page-size="PageSize" layout="sizes, prev, pager, next" :total="newTotal" class="pages" show-elevator show-total></Page>
  </div>
</template>

<script>
  import { pageQueryAddrCommon, sceneyAddrmod } from '@/api/public'
  export default {
    props: {
      sceneId: { type: String, default: '' },
    },
    data() {
      return {
        PageSize: 10,
        newCurrentPage: 1,
        newTotal: 0,
        inputList: '',
        statusValue: '',
        options: [
          { label: this.$t('offline'), value: 0 },
          { label: this.$t('online'), value: 1 },
        ],
        lineColumns: [
          {
            slot: 'check',
            renderHeader: h => {
              return h('span', { style: { marginLeft: '20px' } }, [
                h(
                  'Checkbox',
                  {
                    props: { indeterminate: this.checkAlles, value: this.checkValue },
                    on: {
                      'on-change': val => {
                        this.changeValue(val)
                      },
                    },
                  },
                  this.$t('owningDeviceAlias')
                ),
              ])
            },
          },
          { title: this.$t('deviceId'), slot: 'mac', align: 'center' },
          { title: this.$t('position'), slot: 'location' },
          { title: this.$t('lineName'), slot: 'line', align: 'center' },
          { title: this.$t('lineStatus'), slot: 'lineStatus', align: 'center' },
        ],
        lineListTable: [],
        checkNum: '',
        checkAlles: false,
        checkValue: false,
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        let params = { projectCode: this.$store.state.projectCode, pageSize: this.PageSize, pageNo: this.newCurrentPage, onlineStatus: this.statusValue, mac: this.inputList }
        pageQueryAddrCommon(params).then(res => {
          if (res.success) {
            let arrList = []
            res.datas.forEach(item => {
              if (Array.isArray(item.addrs) && item.addrs.length) {
                arrList.push(...item.addrs.map((itm, i) => ({ ...itm, name: item.name, location: item.location, mac: item.mac, isIndeterminate: false, checked: false, linechecked: false })))
              } else {
                arrList.push({ name: item.name, location: item.location, mac: item.mac, checked: false })
                arrList = Array.from(new Set(arrList))
              }
            })
            Array.isArray(arrList) && arrList.length && this.listFunction(arrList, 'name')
            Array.isArray(arrList) && arrList.length && this.listFunction(arrList, 'mac')
            Array.isArray(arrList) && arrList.length && this.listFunction(arrList, 'location')
            arrList = Array.from(new Set(arrList))

            this.lineListTable = arrList
            this.newTotal = res.total
          } else if (res.code === '-1') {
          } else {
            if (res.message) {
              this.$message({ message: res.message, type: 'error' })
            } else {
              this.$message({ message: this.$t('unknown'), type: 'error' })
            }
          }
        })
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (row.nameRow) {
            return { rowspan: row.nameRow, colspan: 1 }
          } else {
            return { rowspan: 0, colspan: 0 }
          }
        }
        if (columnIndex === 1) {
          if (row.macRow) {
            return { rowspan: row.macRow, colspan: 1 }
          } else {
            return { rowspan: 0, colspan: 0 }
          }
        }
        if (columnIndex === 2) {
          if (row.locationRow) {
            return { rowspan: row.locationRow, colspan: 1 }
          } else {
            return { rowspan: 0, colspan: 0 }
          }
        }
      },
      changeValue(val) {
        if (val) {
          this.checkAlles = false
          this.checkValue = true
          Array.isArray(this.lineListTable) &&
            this.lineListTable.length &&
            this.lineListTable.forEach(item => {
              item.checked = true
              item.linechecked = true
              item.isIndeterminate = false
            })
        } else {
          this.checkAlles = false
          this.checkValue = false
          Array.isArray(this.lineListTable) &&
            this.lineListTable.length &&
            this.lineListTable.forEach(item => {
              item.checked = false
              if (item.linechecked) {
                item.linechecked = false
              }
            })
        }
      },
      listFunction(data, key) {
        let flag = ''
        let count = 0
        let statrtIndex = 0
        const tnArr = Array.from(new Set(data.map(v => v.name)))
        const tnKeys = tnArr.reduce((pre, cur, index) => {
          pre[cur] = index % 2 === 0
          return pre
        }, {})

        data.forEach((v, i) => {
          if (i === 0) {
            flag = v[key]
          }
          if (v[key] !== flag) {
            data[statrtIndex][`${key}Row`] = count
            count = 0
            statrtIndex = i
            flag = v[key]
          }
          // 第一遍遍历完成
          if (v.nameRow && (key === 'mac' || key === 'location')) {
            data[statrtIndex][`${key}Row`] = count
            count = 0
            statrtIndex = i
            flag = v[key]
          }
          // 第二遍遍历完成
          if (v.macRow && key === 'location') {
            data[statrtIndex][`${key}Row`] = count
            count = 0
            statrtIndex = i
            flag = v[key]
          }
          count++
          if (i === data.length - 1) {
            data[statrtIndex][`${key}Row`] = count
          }

          // is2n
          if (v.name) {
            v.is2n = tnKeys[v.name]
          }
        })
      },
      handlenameChange(val, index, row) {
        if (val) {
          this.lineListTable.forEach(item => {
            if (item.mac === row.mac) {
              item.checked = true
              item.isIndeterminate = false
            }
          })
          if (row.macRow) {
            this.checkNum = row.macRow
            for (let i = 0; i < row.macRow; i++) {
              this.lineListTable[index + i].linechecked = true
            }
          }
        } else {
          this.lineListTable.forEach(item => {
            if (item.mac === row.mac) {
              item.checked = false
              item.isIndeterminate = false
            }
          })
          if (row.macRow) {
            for (let i = 0; i < row.macRow; i++) {
              this.lineListTable[index + i].linechecked = false
            }
          }
        }
        let filterList = this.lineListTable.filter(item => item.checked === true)
        if (filterList.length < this.lineListTable.length && filterList.length > 0) {
          this.checkValue = false
          this.checkAlles = true
        }
        if (filterList.length === this.lineListTable.length && filterList.length > 0) {
          this.checkValue = true
          this.checkAlles = false
        }
        if (filterList.length === 0) {
          this.checkValue = false
          this.checkAlles = false
        }
      },
      handleAddrChange(val, index, row) {
        let macINdex = []
        this.lineListTable.forEach((item, index) => {
          if (item.macRow) {
            macINdex.push({ index, macRow: item.macRow })
          }
        })
        let filterList = []
        if (val) {
          this.lineListTable.forEach((item, idx) => {
            if (item.mac === row.mac && index === idx) {
              item.checked = true
              item.isIndeterminate = false
              item.linechecked = true
            }
          })
          if (row.macRow) {
            this.checkNum = row.macRow
            let account = 0
            for (let i = 0; i < row.macRow; i++) {
              if (this.lineListTable[index + i].linechecked === true) {
                account++
              }
            }
            if (account === row.macRow) {
              this.lineListTable[index].checked = true
              this.lineListTable[index].isIndeterminate = false
            } else {
              this.lineListTable[index].checked = false
              this.lineListTable[index].isIndeterminate = true
            }
          } else {
            if (this.checkNum) {
              let newNUm = 0
              macINdex.forEach(item => {
                if (index > item.index && index <= item.index + item.macRow) {
                  for (let i = 0; i < item.macRow; i++) {
                    if (this.lineListTable[item.index + i].linechecked === true) {
                      newNUm++
                    }
                  }
                  if (newNUm === item.macRow) {
                    this.lineListTable[item.index].checked = true
                    this.lineListTable[item.index].isIndeterminate = false
                  } else {
                    this.lineListTable[item.index].checked = false
                    this.lineListTable[item.index].isIndeterminate = true
                  }
                }
              })
            } else {
              macINdex.forEach(item => {
                if (index > item.index && index < item.index + item.macRow && index !== item.index) {
                  this.lineListTable[item.index].checked = false
                  this.lineListTable[item.index].isIndeterminate = true
                }
              })
            }
          }
        } else {
          this.lineListTable.forEach((item, idx) => {
            if (item.mac === row.mac && index === idx) {
              item.checked = false
              item.isIndeterminate = false
              item.linechecked = false
            }
          })
          let newNUm = 0
          macINdex.forEach(item => {
            if (index >= item.index && index < item.index + item.macRow) {
              for (let i = 0; i < item.macRow; i++) {
                if (this.lineListTable[item.index + i].linechecked === false) {
                  newNUm++
                }
              }
              this.lineListTable[item.index].checked = false
              if (newNUm === item.macRow) {
                this.lineListTable[item.index].isIndeterminate = false
              } else {
                this.lineListTable[item.index].isIndeterminate = true
              }
            }
          })
        }
        this.$nextTick(() => {
          filterList = this.lineListTable.filter(item => item.checked === true)
          if (filterList.length === this.lineListTable.length && filterList.length > 0) {
            this.checkValue = true
            this.checkAlles = false
          } else {
            this.checkAlles = true
          }
          let filter = this.lineListTable.filter(item => item.checked === false)
          if (filter.length === this.lineListTable.length && filter.length > 0) {
            this.checkValue = false
            this.checkAlles = false
          }
        })
      },
      queryLineList() {
        this.init()
      },
      resetList() {
        this.statusValue = ''
        this.inputList = ''
        this.init()
      },
      addSelectLine() {
        if (this.lineListTable.every(item => !item.checked && !item.linechecked)) {
          return this.$Message.error({ content: this.$t('pleaseSelectLineBeforeAdding') })
        }
        const fn = (data, key) => {
          const arr = []
          let keys = []
          let flag = ''
          data.forEach((v, i) => {
            if (i === 0) {
              flag = v[key]
            }
            if (v[key] !== flag) {
              arr.push({ addrs: keys.join(), mac: flag })
              flag = v[key]
              keys = []
            }
            keys.push(v.addrs)
            if (i === data.length - 1) {
              arr.push({ addrs: keys.join(), mac: flag })
            }
          })

          return arr
        }
        this.$nextTick(() => {
          let macArr = this.lineListTable.filter(item => (item.checked === true || (item.isIndeterminate === true && item.linechecked === true)) && item.addr)
          let macAddrsArr = macArr.map(item => ({ addrs: item.addr, mac: item.mac }))
          const result = fn(macAddrsArr, 'mac')
          let params = { projectCode: this.$store.state.projectCode, sceneId: this.sceneId, oper: 'add', macAddrs: JSON.stringify(result) }
          sceneyAddrmod(params).then(res => {
            if (res.success) {
              this.$Message.success({ content: res.message })
              this.$emit('closeFlag', false)
            } else if (res.code === '-1') {
            } else {
              if (res.message) {
                this.$Message.error({ content: res.message })
              } else {
                this.$Message.error({ content: this.$t('unknown') })
              }
            }
          })
        })
      },
      handleNewCurrentChange(val) {
        this.newCurrentPage = val
        this.init()
      },
      handleNewSizeChange(val) {
        this.PageSize = val
        this.init()
      },
    },
  }
</script>

<style lang="less" scoped>
  .line-details {
    .wd {
      width: 200px;
    }
    /deep/ .ivu-table-column-center {
      padding: 0;
    }
    /deep/ .ivu-table-cell {
      padding: 0;
      height: 100% !important;
    }
    /deep/.ivu-table-cell-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100% !important;
    }
    .ml {
      margin-left: 10px;
    }
    .ml80 {
      margin-left: 100px;
    }
    .table-top {
      margin-top: 20px;
    }
    .pages {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
</style>
