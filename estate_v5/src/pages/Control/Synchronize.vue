<template>
  <div>
    <div class="header">{{ $t('sceneDeviceTip') }}</div>
    <Row class="funcontent">
      <Col class="funcontent-flex" :span="24">
        <Form ref="form" @submit.native.prevent :inline="true" :model="form" class="tr">
          <FormItem>
            <Input v-model="form.mac" @keyup.enter.native="queryList" :placeholder="$t('enterDeviceNo')"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="queryList">{{ $t('query') }}</Button>
            <Button style="margin-left: 10px" @click="empty">{{ $t('reset') }}</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <Row class="table">
      <div class="tableHeader">
        <span>{{ $t('pushList') }}</span>
        <Button type="primary" :disabled="syncDisable" @click="handleSyncToDevice">
          <span :class="syncDisable ? 'blues' : 'defaults'">{{ $t('batchPushToDevices') }}</span>
        </Button>
      </div>
      <Col :span="24">
        <Table :data="syncData" :columns="synccolumns" ref="multipleTable" @on-sort-change="sortChange" @on-selection-change="handleSelectionChange">
          <template slot-scope="{ row }" slot="others.address">
            {{ row.others.address }}
          </template>

          <template slot-scope="{ row }" slot="mac">
            <div>{{ row.mac }}</div>
            <div>{{ row.others.name }}</div>
          </template>
          <template slot-scope="{ row }" slot="others.titles">
            {{ row.others.titles }}
          </template>
          <template slot-scope="{ row }" slot="weekdays">
            <span>{{ row.weekday ? row.weekday : $t('single') }}</span>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status === 1" class="c-success">{{ $t('closing') }}</span>
            <span v-if="row.status === 4">ON</span>
            <span v-if="row.status === 5">OFF</span>
            <span v-if="row.status === 7">{{ $t('inching') }}</span>
            <span v-if="row.status === 0" class="c-danger">{{ $t('opening') }}</span>
          </template>

          <template slot-scope="{ row }" slot="pushDownStatus">
            <span :class="row.pushStatus === 0 ? 'b-danger' : 'b-success'" @click="toBuiltIn(row)">{{ row.pushStatus === 0 ? $t('notIssued') : $t('pushed') + '(' + row.pushTime + ')' }}</span>
          </template>

          <template slot-scope="{ row }" slot="action">
            <Button type="text" :disabled="row.others.syncFlag === '1'" @click="handleSync(row.id, row)">
              <span class="c-primary">{{ $t('push') }}</span>
              <span class="c-primary" v-if="row.others.syncFlag === '1'">{{ '(' + $t('pushing') + ')' }}</span>
              <span class="c-notProcess" v-if="row.others.syncFlag === '2'">{{ '(' + $t('pushNotEffective') + ')' }}</span>
            </Button>
          </template>
        </Table>
      </Col>
    </Row>

    <Col class="tc mt-5 page">
      <Page @on-change="handlePageNo" show-total :current="currentPage" :total="totals"></Page>
    </Col>
  </div>
</template>
<script>
  import { queryListData, queryListsync } from '@/api/control/index'
  export default {
    props: ['paramsId'],
    data() {
      return {
        totals: 0,
        form: {
          mac: '',
        },
        syncDisable: false,
        currentPage: 1,
        pageSize: 20,
        syncData: [],
        synccolumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: this.$t('place'),
            slot: 'others.address',
            align: 'center',
          },
          {
            title: this.$t('equipmentNo'),
            slot: 'mac',
            align: 'center',
          },
          {
            title: this.$t('line'),
            slot: 'others.titles',
            align: 'center',
          },
          {
            title: this.$t('cycle'),
            slot: 'weekdays',
            align: 'center',
          },
          {
            title: this.$t('time'),
            key: 'time',
            align: 'center',
          },
          {
            title: this.$t('action'),
            slot: 'status',
            align: 'center',
          },
          {
            title: this.$t('pushDown'),
            slot: 'pushDownStatus',
            width: 210,
            align: 'center',
          },
          {
            title: this.$t('operation'),
            slot: 'action',
            width: 210,
            align: 'center',
          },
        ],
        multipleSelection: [],
      }
    },
    mounted() {
      this.queryList()
    },
    methods: {
      queryList() {
        this.$nextTick(() => {
          this.$refs.multipleTable.clearCurrentRow()
        })
        this.currentPage = 1
        this.queryListDatas()
      },
      handlePageNo(e) {
        this.currentPage = e
        this.queryListDatas()
      },
      queryListDatas(prop, order) {
        let params = {
          pageSize: this.pageSize,
          pageNo: this.currentPage,
          params: {
            sceneId: this.paramsId,
            mac: this.form.mac,
          },
        }
        if (prop) {
          params.sortName = prop
          if (order === 'ascending') {
            params.order = 'asc'
          } else if (order === 'descending') {
            params.order = 'desc'
          }
        }
        queryListData(params)
          .then(res => {
            this.syncDisable = true
            if (res.success) {
              this.syncData = res.datas
              this.totals = res.total
            } else if (res.code === '-1') {
            } else {
              if (res.message) {
                this.$Message.error({
                  content: res.message,
                })
              } else {
                this.$Message.error({
                  content: this.$t('unknown'),
                })
              }
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      sortChange({ column, prop, order }) {
        this.queryListDatas(prop, order)
      },
      toBuiltIn(row) {
        if (row.pushStatus === 1) {
          this.$router.push({
            name: 'BuiltInTiming',
            params: {
              mac: row.mac,
            },
          })
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.syncDisable = val.length > 0 ? !1 : !0
      },
      handleSyncToDevice() {
        let params = this.multipleSelection.map(item => {
          return item.id
        })
        this.handleSync(params.toString(), this.multipleSelection)
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.queryList()
      },
      handleSync(id, row) {
        queryListsync({ ids: id }).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('submitCommand'),
            })
            if (row.length > 1) {
              row.forEach(element => {
                if (element.timerAutoid === 0) {
                  element.others.syncFlag = '1'
                }
              })
            } else {
              row.others.syncFlag = '1'
            }
          } else if (res.code === '-1') {
          } else {
            if (res.data) {
              for (let elem of res.data) {
                if (elem.errorMsg === '0') {
                  this.$Message.success({
                    content: elem.mac + '：' + this.$t('inEffect'),
                  })
                  row.map(element => {
                    if (elem.mac === element.mac && element.timerAutoid === 0) {
                      element.others.syncFlag = '1'
                    }
                  })
                } else {
                  this.$Message.error({
                    content: elem.mac + '：' + elem.errorMsg,
                  })
                }
              }
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          }
        })
      },
      handleCurrentChange(e) {
        if (e === 'home') {
          this.currentPage = 1
        } else if (e === 'prev') {
          if (this.currentPage !== 1) {
            this.currentPage -= 1
          } else {
            return false
          }
        } else if (e === 'next') {
          this.currentPage += 1
        }
        this.queryListDatas()
      },
      empty() {
        this.form.mac = ''
        this.queryList()
      },
    },
    watch: {},
  }
</script>
<style lang="less" scoped>
  .blues {
    color: #999999;
  }
  .defaults {
    color: aliceblue;
  }
  .header {
    background: rgba(153, 153, 153, 0.05);
    border: 1px solid #999999;
    padding: 10px;
  }
  .funcontent {
    margin-top: 10px;
    padding: 20px;
    background: #1a202e;
    .ivu-btn-primary {
      background: #007eff;
    }
    &-flex {
      display: flex;
    }
  }
  /deep/.ivu-form-item {
    margin-bottom: 0px;
  }
  .table {
    margin-top: 10px;
    background: #1a202e;
    padding: 20px;
  }
  .tableHeader {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
    span {
      font-size: 16px;
      font-family: PingFang SC;
    }
    Button {
      // background: #007eff;
      color: #999 !important;
    }
  }
  .page {
    display: flex;
    margin-top: 20px;
    justify-content: flex-end;
    button {
      margin-right: 10px;
    }
    .ivu-page {
      padding: 0;
    }
  }
</style>
