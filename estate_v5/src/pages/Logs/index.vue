<template>
  <div style="padding: 20px">
    <Row class="header">
      <Col style="line-height: 52px; margin-left: 20px">
        <span class="span" @click="back">{{ $t('back') }}</span>
        &nbsp;>&nbsp; {{ $t('operationLog') }}
      </Col>
      <Col class="rightData">
        <span style="margin-right: 10px">{{ $t('date') }}</span>
        <DatePicker type="daterange" :placeholder="$t('pleaseSelectTime')" style="width: 210px" :separator="$t('to')" @on-change="datechange" v-model="dateArr"></DatePicker>
        <Select :clearable="true" v-model="model1" style="width: 210px; margin-left: 10px" :placeholder="$t('relatedPersonnel')" @on-change="getstaffId" @on-clear="clearPeople">
          <Option v-for="item in peopleList" :value="item.value" :key="item.staffId">{{ item.value }}</Option>
        </Select>
        <Input :placeholder="$t('enterIdentification')" style="width: 210px; margin-left: 10px" v-model="params.keyword"></Input>
        <Button @click="search" type="primary" style="margin-left: 10px" class="btnb">{{ $t('query') }}</Button>
        <Button @click="reset" style="margin-left: 10px">{{ $t('reset') }}</Button>
        <div class="export">
          <Dropdown placement="bottom" @on-click="outputs">
            <a href="javascript:void(0)">
              <Icon custom="icon-v5 icon-v5-daochu2" size="20" class="buts" />
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="current">{{ $t('currentPageData') }}</DropdownItem>
              <DropdownItem name="all">{{ $t('allData') }}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Col>
    </Row>

    <div>
      <Table :data="tableData1" :columns="tableColumns1" :disabled-hover="true" ref="table">
        <div slot="status" slot-scope="{ row }">
          <Poptip content="content" placement="bottom" word-wrap>
            <Icon type="ios-eye-outline" @click.native="handleViewLogs(row)"></Icon>
            <div slot="content">
              <json-viewer v-if="logsView" :value="logsView"></json-viewer>
            </div>
            <div slot="title">
              {{ $t('parameterStructure') }}
            </div>
          </Poptip>
        </div>
      </Table>
      <Button-group class="buttonGroup">
        <Button @click="handlePage('home')">{{ $t('home') }}</Button>
        <Button icon="el-icon-arrow-left" :disabled="params.pageNo === 1" @click="handlePage('prev')">{{ $t('prev') }}</Button>
        <!-- :disabled="quantityData.length < quantityPageSize" -->
        <Button :disabled="tableData1 === undefined || tableData1.length !== 20" @click="handlePage('next')">
          {{ $t('next') }}
          <i class="el-icon-arrow-right el-icon--right"></i>
        </Button>
      </Button-group>
    </div>
  </div>
</template>

<script>
  import { queryOperateLog, findParamsById, queryFollwerByStaff } from '@/api/index.js'
  import JsonViewer from 'vue-json-viewer'
  export default {
    data() {
      return {
        model1: '',
        peopleList: [],
        tableData1: [],
        pathUrl: '',
        tableColumns1: [
          { title: this.$t('operator1'), key: 'staffName' },
          { title: this.$t('keyIdentification'), key: 'keyId' },
          { title: this.$t('loginChannel'), key: 'loginChannel' },
          { title: this.$t('operatingTime'), key: 'operateTime' },
          { title: this.$t('description'), key: 'remark' },
          { title: this.$t('clientIP'), key: 'clientIp' },
          { title: this.$t('parameter'), slot: 'status' },
        ],
        params: {
          pageNo: 1,
          pageSize: 20,
          order: 'desc',
          startTime: this.$Date().format('YYYY-MM-DD'),
          endTime: this.$Date().format('YYYY-MM-DD'),
          keyword: this.$route.query.mac ? this.$route.query.mac : this.$route.params.mac ? this.$route.params.mac : '',
          staffId: '',
        },
        logsView: {},
        total: 0,
        dateArr: [this.$Date().format('YYYY-MM-DD'), this.$Date().format('YYYY-MM-DD')],
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.pathUrl = from.fullPath
      })
    },
    methods: {
      init() {
        this.handleLoadAll()
        this.queryOperateLogs()
      },
      handleLoadAll() {
        queryFollwerByStaff({})
          .then(res => {
            this.peopleList = res.data
          })
          .catch(err => {
            if (err) {
              this.$Message.error(this.$t('unknown'))
            }
          })
      },
      queryOperateLogs() {
        if (this.$route.query.mac) {
          this.params.keyword = this.$route.query.mac
        }
        queryOperateLog(this.params)
          .then(res => {
            if (res.success) {
              this.tableData1 = res.datas
              this.total = res.total
            } else if (res.code === '-1') {
            } else {
              if (res.message) {
                this.$Message.error(res.message)
              } else {
                this.$Message.error(this.$t('unknown'))
              }
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error(this.$t('unknown'))
            }
          })
      },
      getstaffId(e) {
        let arr = this.peopleList.filter(item => {
          return e === item.value
        })
        this.params.staffId = arr[0].staffId
      },
      search() {
        // 搜索
        if (this.params.startTime === '' && this.params.endTime === '') {
          this.$Message.error(this.$t('pleaseSelectDateFrist'))
          return false
        }
        this.params.pageNo = 1
        this.queryOperateLogs()
      },
      reset() {
        // 重置
        this.model1 = ''
        this.dateArr = [this.$Date().format('YYYY-MM-DD'), this.$Date().format('YYYY-MM-DD')]
        this.params = {
          pageNo: 1,
          pageSize: 20,
          order: 'desc',
          startTime: this.$Date().format('YYYY-MM-DD'),
          endTime: this.$Date().format('YYYY-MM-DD'),
          keyword: '',
          staffId: '',
        }
        this.queryOperateLogs()
      },
      handleViewLogs(obj) {
        findParamsById({ id: obj.id })
          .then(res => {
            this.logsView = ''
            this.logsView = res
          })
          .catch(err => {
            if (err) {
              this.$Message.error(this.$t('unknown'))
            }
          })
      },
      outputs(e) {
        let ctxPaths = this.$func.ctxPaths()
        // pageNo: this.params.pageNo,
        // pageSize: 20,
        // order: 'desc',
        // startTime: this.params.startTime,
        // endTime: this.params.endTime,
        // keyword: this.params.keyword,
        // staffId: this.params.staffId
        if (e === 'current') {
          if (this.$func.checkDateOneYear(this.params.startTime, this.params.endTime) === 'true') {
            this.$func.windowCountDown(
              ctxPaths + '/operateLog/exportPageList.as?keyword=' + this.params.keyword + '&startTime=' + this.params.startTime + '&endTime=' + this.params.endTime + '&staffId=' + this.params.staffId + '&pageNo=' + this.params.pageNo + '&pageSize=' + 20 + '&order=desc&export=' + e
            )
          } else {
            this.$Message.error(this.$t('exportCurrent') + this.$t('limitYear'))
          }
        }
        if (e === 'all') {
          if (this.$func.checkDateOneMonth(this.params.startTime, this.params.endTime) === 'true') {
            this.$func.windowCountDown(
              ctxPaths + '/operateLog/exportPageList.as?keyword=' + this.params.keyword + '&startTime=' + this.params.startTime + '&endTime=' + this.params.endTime + '&staffId=' + this.params.staffId + '&pageNo=' + this.params.pageNo + '&pageSize=' + 20 + '&order=desc&export=' + e
            )
          } else {
            this.$Message.error(this.$t('exportAll') + this.$t('powerPageErrorMessage8'))
          }
        }
      },
      datechange(e) {
        this.params.startTime = e[0]
        this.params.endTime = e[1]
      },
      handlePage(e) {
        if (e === 'home') {
          this.params.pageNo = 1
        } else if (e === 'prev') {
          if (this.params.pageNo !== 1) {
            this.params.pageNo -= 1
          } else {
            return false
          }
        } else if (e === 'next') {
          this.params.pageNo += 1
        }
        this.queryOperateLogs()
      },
      clearPeople() {
        this.params.staffId = ''
      },
      back() {
        if (this.pathUrl === '/visualScreen') {
          this.$router.push('/visualScreen')
        } else if (this.pathUrl === '/console/device') {
          this.$router.push('/console/device')
        } else {
          this.$router.push('/console/project')
        }
      },
    },
    mounted() {
      this.init()
    },
    components: {
      JsonViewer,
    },
  }
</script>

<style lang="less" scoped>
  .btnb {
    background: #007eff;
    color: #fff;
    border: none;
    margin-left: 10px;
  }
  .header {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .rightData {
    display: flex;
    align-items: center;
  }
  .export {
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007eff;
    border-radius: 5px;
    width: 32px;
    height: 32px;
    margin-left: 10px;

    .ivu-icon {
      color: #007eff;
      padding-top: 5px;
      margin: 0 !important;
    }
  }
  .buttonGroup {
    float: right;
    // margin-top: 10px;
    padding: 10px;
    button {
      margin-right: 20px;
    }
  }
  .span {
    cursor: pointer;
  }
</style>
