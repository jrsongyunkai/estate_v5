<template>
  <div>
    <Row :gutter="20" style="margin: 0; padding: 20px">
      <Col style="width: 100%">
        <Breadcrumb separator-class="el-icon-arrow-right">
          <BreadcrumbItem class="pointer" @click.native="$router.push(pathUrl)">{{ $t('back') }}</BreadcrumbItem>
          <BreadcrumbItem>{{ $t('channelList') }}</BreadcrumbItem>
        </Breadcrumb>
        <div class="head-flex-end">
          <Row :gutter="5" :model="formInline" class="demo-form-inline tr">
            <Col>
              <Button :disabled="channelAbled" @click="batchClosingOrOpening((val = true))">{{ $t('batchClosing') }}</Button>
            </Col>
            <Col>
              <Button :disabled="channelAbled" @click="batchClosingOrOpening((val = false))">{{ $t('batchOpening') }}</Button>
            </Col>
            <Col>
              <!-- <Select v-model="formInline.projectCode" :clearable="true" filterable placeholder="请输入项目名称">
              <Option v-for="item in projectNames" :key="item.projectCode" :label="item.projectName" :value="item.projectCode"></Option>
            </Select> -->
              <PickProject :defaultCheckedKeys="checkedKeys" @pickProject="pickProject"></PickProject>
            </Col>
            <Col>
              <Input v-model="formInline.mac" clearable :placeholder="$t('enterDeviceNo')" @on-keyup.enter.native="onSubmit" />
            </Col>
            <Col>
              <Select v-model="formInline.status" :clearable="true" style="width: '130px'" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in stats" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Col>
              <Select v-model="formInline.state" :clearable="true" style="width: '130px'" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in state" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Col>
              <Button type="primary" @click="onSubmit">{{ $t('query') }}</Button>
            </Col>
            <Col>
              <Button :disabled="refreshAbled" @click="queryMacOcList">{{ $t('refresh') }}</Button>
            </Col>
          </Row>
        </div>

        <Table :data="tableData" :columns="columns" @on-selection-change="handleSelectionChange">
          <template slot-scope="{ row }" slot="status">
            <span v-show="row.stats === -1" class="c-info">{{ $t('disconnected') }} |</span>
            <span v-show="row.stats === 0" class="c-danger">{{ $t('offline') }} |</span>
            <span v-show="row.stats === 1" class="c-success">{{ $t('online') }} |</span>
            <span v-if="row.stats" class="c-danger">{{ $t('closing') }}</span>
            <span v-else class="c-success">{{ $t('opening') }}</span>
          </template>
        </Table>
        <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :page-size-opts="[20, 50, 100, 500]" :current="currentPage" :page-size="pageSize" :total="channelTotal"></Page>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { queryMacOcState, batchRemotectrl, queryProjectMacAddrDetailsV5 } from '@/api/public'
  import PickProject from '@/globalComponents/PickProject.vue'
  export default {
    components: {
      PickProject,
    },
    data() {
      return {
        columns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: this.$t('equipmentNo'), key: 'mac', align: 'center' },
          { title: this.$t('projectName'), key: 'projectName', align: 'center' },
          { title: this.$t('position'), key: 'projectAddress', align: 'center' },
          { title: this.$t('lineName'), key: 'chnlTitle', width: 120, align: 'center' },
          { title: this.$t('state'), slot: 'status', align: 'center' },
          { title: this.$t('onOffTime'), key: 'onOffTime', align: 'center' },
        ],
        stats: [
          { value: '', label: this.$t('pleaseSelect') },
          { value: '0', label: this.$t('offline') },
          { value: '1', label: this.$t('online') },
          { value: '-1', label: this.$t('disconnected') },
        ],
        state: [
          { value: '', label: this.$t('pleaseSelect') },
          { value: 1, label: this.$t('closing') },
          { value: 0, label: this.$t('opening') },
        ],
        formInline: {
          projectCode: this.$route.query.projectCode,
          status: this.$route.query.status,
          mac: this.$route.query.mac,
        },
        projectNames: [],
        currentPage: 1,
        channelTotal: 0,
        pageSize: 20,
        tableData: [],
        channelAbled: true,
        refreshAbled: true,
        multipleSelection: [],
        disableRefresh: null,
        disableClosingOrOpening: null,
        pathUrl: '',
        checkedKeys: [],
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.pathUrl = from.fullPath
      })
    },
    mounted() {
      this.checkedKeys = this.$route.query.projectCode.split(',')
      this.init()
    },
    methods: {
      init() {
        this.queryChannel()
      },
      pickProject(selectProjectTreeData, cb) {
        this.checkedKeys = selectProjectTreeData.filter(it => it.projectCode).map(it => it.projectCode)
        this.formInline.projectCode = this.checkedKeys.toString()
        cb()
      },
      queryChannel() {
        this.tableData = []
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          mac: this.formInline.mac,
          onOrOff: this.formInline.state === 1 ? true : this.formInline.state === 0 ? false : '',
          onlineStats: this.formInline.status,
          projectCode: this.formInline.projectCode,
        }
        queryProjectMacAddrDetailsV5(params)
          .then(res => {
            if (res.success) {
              this.tableData = res.datas
              this.channelTotal = res.total
              this.projectNames = this.$store.state.allProjects.data
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({ content: res.message })
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
      onSubmit() {
        this.currentPage = 1
        this.queryChannel()
      },
      handleSizeChange(val) {
        this.currentPage = 1
        this.pageSize = val
        this.queryChannel()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.queryChannel()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        if (this.multipleSelection.length > 0) {
          this.refreshAbled = false
          let onlineStatsArr = this.multipleSelection.map(item => {
            return item.onlineStats
          })
          this.channelAbled = onlineStatsArr.includes(0) || onlineStatsArr.includes(-1) ? !0 : !1
        } else {
          this.refreshAbled = this.channelAbled = true
        }
      },
      queryMacOcList() {
        this.refreshAbled = true
        this.disableRefresh = setTimeout(() => {
          this.refreshAbled = this.multipleSelection.length > 0 ? !1 : !0
        }, 2000)
        let params = this.multipleSelection.map(item => {
          return item.mac + '-' + item.chnlAddr
        })
        this.$nextTick(function () {
          queryMacOcState({ macAddr: params.join(',') })
            .then(res => {
              if (res.success) {
                for (let j = 0; j < this.tableData.length; j++) {
                  for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].mac === this.tableData[j].mac && res.data[i].chnlAddr === +this.tableData[j].chnlAddr) {
                      this.tableData[j].onOffTime = res.data[i].onOffTime
                      this.tableData[j].onlineStats = res.data[i].onlineStats
                      this.tableData[j].stats = res.data[i].state
                    }
                  }
                }
              } else if (res.code === '-1') {
              } else {
                this.$Message.error({
                  content: res.message,
                })
              }
            })
            .catch(err => {
              if (err) {
                this.$Message.error({
                  content: this.$t('unknown'),
                })
              }
            })
        })
      },
      batchClosingOrOpening(val) {
        this.channelAbled = true
        this.disableClosingOrOpening = setTimeout(() => {
          let onlineStatsArr = this.multipleSelection.map(item => {
            return item.onlineStats
          })
          if (this.multipleSelection.length > 0) {
            this.channelAbled = onlineStatsArr.includes(0) || onlineStatsArr.includes(-1) ? !0 : !1
          } else {
            this.channelAbled = true
          }
        }, 2000)
        let params = this.multipleSelection.map(item => {
          return item.mac + '-' + item.chnlAddr
        })
        batchRemotectrl({
          macAddr: params.join(','),
          onOrOff: val,
        })
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: this.$t('submitCommand'),
              })
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
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
      destroyed() {
        clearTimeout(this.disableRefresh)
        clearTimeout(this.disableClosingOrOpening)
      },
    },
  }
</script>

<style lang="less" scoped>
  .head-flex-end {
    background: #1a202e;
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
  }
  .channel {
    float: left;
  }

  .closing-button {
    margin-left: 17px;
  }
</style>
