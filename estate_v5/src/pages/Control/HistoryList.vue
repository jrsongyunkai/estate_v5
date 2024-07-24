<template>
  <div>
    <Row :gutter="20" style="margin: 0; padding: 20px">
      <!-- 固件操作历史 -->
      <Col style="width: 100%">
        <Row type="flex" justify="space-between">
          <Breadcrumb separator-class="el-icon-arrow-right">
            <BreadcrumbItem class="pointer" @click.native="$router.push({ path: 'console/device' })" style="color: #7b7b7b">{{ $t('back') }}</BreadcrumbItem>
            <BreadcrumbItem>{{ $t('firmwareOperationHistory') }}</BreadcrumbItem>
          </Breadcrumb>
          <!-- <Col class="history-text pointer"> <Button type="text"  @click="$router.push({path:'/AlarmHistory'})"> 历史数据>></Button></Col> -->
        </Row>
        <Row class="deveice-History">
          <Col :span="24">
            <Form :inline="true" :model="quantityForm" class="demo-form-inline mt-20" @submit.native.prevent>
              <FormItem>
                <span>
                  <DatePicker :clearable="false" v-model="quantityForm.month" format="yyyy-MM-dd" type="daterange" :placeholder="$t('pleaseSelectDateTime')"></DatePicker>
                </span>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="queryQuantity">{{ $t('query') }}</Button>
              </FormItem>
              <FormItem>
                <Button @click="handleReset">{{ $t('reset') }}</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
    <div style="padding: 0 30px">
      <Table :data="infomOperationList" :columns="infomOperationcolumns">
        <template slot-scope="{ row }" slot="opreTime">{{ row.operateTimeShow }}</template>
        <template slot-scope="{ row }" slot="opreObj">{{ row.mac }}</template>
        <template slot-scope="{ row }" slot="opreDetails">{{ row.detailShow }}</template>
        <template slot-scope="{ row }" slot="opreNum">{{ row.operateUserNo }}</template>
      </Table>
    </div>
    <Page show-elevator @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="total"></Page>
  </div>
</template>

<script>
  import { pageInnerLog } from '@/api/public'
  import dayjs from 'dayjs'
  export default {
    data() {
      return {
        total: 0,
        pageNo: 1,
        pageSize: 10,
        infomOperationList: [{ mac: '2225' }],
        infomOperationcolumns: [
          {
            title: this.$t('operatingTime'),
            slot: 'opreTime',
          },
          {
            title: this.$t('opreObj'),
            slot: 'opreObj',
          },
          {
            title: this.$t('opreDetails'),
            slot: 'opreDetails',
          },
          {
            title: this.$t('opreNo'),
            slot: 'opreNum',
          },
        ],
        quantityForm: {
          month: [],
        },
        statusList: [
          { value: '1', label: this.$t('all') },
          { value: '2', label: this.$t('transmissionDevice') },
          { value: '3', label: this.$t('fireProtectionFacilitySystem') },
        ],
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        let parmas = {
          mac: this.$route.query.mac,
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        }
        pageInnerLog(parmas).then(res => {
          if (res.success) {
            this.infomOperationList = res.datas
            this.total = res.total
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.init()
      },
      handleChangeDate(val) {},
      queryQuantity() {
        // refreshLog({ mac: this.$route.query.mac, beginTime: dayjs(this.quantityForm.month).unix(), count: 10 }).then(res => {

        let parmas = {
          mac: this.$route.query.mac,
          pageNo: 1,
          pageSize: 10,
          beginTime: dayjs(this.quantityForm.month[0]).unix(),
          endTime: dayjs(this.quantityForm.month[1]).unix(),
        }
        pageInnerLog(parmas).then(res => {
          if (res.success) {
            this.infomOperationList = res.datas
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleReset() {
        this.quantityForm.month = []
      },
    },
  }
</script>

<style>
  .deveice-History {
    margin-top: 10px;
    padding: 0 10px;
    background: #1c202c;
  }
</style>
