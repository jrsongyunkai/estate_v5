<template>
  <div>
    <Form :model="ruleForm" ref="ruleForm" class="rule-form" @submit.native.prevent>
      <FormItem>
        <Row>
          <Col :span="5" class="left-padding-right">
            <Input v-model="ruleForm.mac" :placeholder="$t('equipmentNo')"></Input>
          </Col>
          <Col :span="4" style="margin-left: 10px">
            <Button type="primary" @click="queryMac">{{ $t('query') }}</Button>
          </Col>
          <Col :span="15" v-if="false" class="tr">
            <Button type="text" @click="handleLine('')">{{ $t('allDevice1') }}</Button>
          </Col>
        </Row>
      </FormItem>
    </Form>
    <Table class="mt-20 device-wrap" :data="data" :columns="columns">
      <template slot-scope="{ row }" slot="macname">
        <div>{{ row.name }}</div>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Button v-if="source === 'DetectionRules'" type="text" @click="handleLine(row.mac)">{{ $t('selectedLine') }}</Button>
        <Button v-if="source === 'BuiltInTiming'" type="text" @click="handleMac(row)">{{ $t('selectedDevice') }}</Button>
      </template>
    </Table>
    <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current.sync="currentPage" :page-size-opts="[20, 50, 100, 500]" :page-size="20" layout="sizes, prev, pager, next" :total="total" show-elevator show-total style="margin-top: 20px"></Page>
    <Modal :title="$t('channelList')" :visible.sync="dialogVisible" width="60%" append-to-body="true">
      <LineList :mac="mac" source="DetectionRules" v-if="dialogVisible" @handleLineListClose="handleLineListClose"></LineList>
      <div slot="footer" />
    </Modal>
  </div>
</template>
<script>
  import LineList from '../Common/LineList.vue'
  import { queryBoxes } from '@/api/detectionRules/index'
  export default {
    props: {
      source: {
        type: String,
        default: function () {
          return ''
        },
      },
      attrFlag: {
        type: String,
        default: function () {
          return ''
        },
      },
    },
    data() {
      return {
        ruleForm: {
          mac: '',
        },
        mac: '',
        data: [],
        currentPage: 1,
        pageSize: 20,
        total: 0,
        dialogVisible: false,
        columns: [
          {
            title: this.$t('equipmentNo'),
            key: 'mac',
            align: 'center',
          },
          {
            title: this.$t('deviceAliases'),
            slot: 'macname',
            align: 'center',
          },
          {
            title: this.$t('place'),
            key: 'build',
            align: 'center',
          },
          {
            title: this.$t('unit'),
            key: 'unit',
            align: 'center',
          },
          {
            title: this.$t('roomNum'),
            key: 'room',
            align: 'center',
          },
          {
            title: this.$t('operation'),
            slot: 'action',
            align: 'center',
          },
        ],
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.queryList()
      },
      queryList(mac) {
        let params = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          projectCode: this.$store.state.projectCode,
        }
        if (mac) params.key = mac
        if (this.attrFlag) params.attrFlag = 'enableAdvancedTiming'
        queryBoxes(params)
          .then(res => {
            if (res.success) {
              this.total = res.total
              this.data = res.datas
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
      queryMac() {
        this.currentPage = 1
        this.queryList(this.ruleForm.mac)
      },
      handleLine(mac) {
        this.dialogVisible = true
        this.mac = mac
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.queryList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.queryList()
      },
      handleLineClose() {
        this.dialogVisible = false
      },
      handleLineListClose() {
        this.$emit('handleDeviceClose')
      },
      handleMac(row) {
        this.$emit('sendBuiltInTimingMac', row.mac)
        this.$emit('sendBuiltInTimingName', row.name)
      },
    },
    components: {
      LineList,
    },
  }
</script>
<style lang="less" scoped>
  .device-wrap {
    border: none;
    color: #606266;
    .el-table__header-wrapper,
    .el-table__body-wrapper {
      th,
      tr,
      td {
        color: #606266;
      }
    }
  }
  .Button--text {
    color: #409eff;
  }
</style>
