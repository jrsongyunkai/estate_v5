<template>
  <div class="airDisinfectioOperationLog">
    <div class="pt-15">
      <Row type="flex" justify="space-between">
        <Breadcrumb separator-class="el-icon-arrow-right">
          <BreadcrumbItem class="pointer" @click.native="$router.push({ path: 'console/device' })" style="color: #7b7b7b">{{ $t('back') }}</BreadcrumbItem>
          <BreadcrumbItem>{{ $t('operationLog') }}</BreadcrumbItem>
        </Breadcrumb>
        <!-- <Col class="history-text pointer"> <Button type="text"  @click="$router.push({path:'/AlarmHistory'})"> 历史数据>></Button></Col> -->
      </Row>
    </div>
    <div>
      <Table :data="airDisnfectorDataList" :columns="airDisnfectorColumns">
        <template #operateAt="{ row }">
          {{ row.operateAt === 1 ? row.operateParam : row.operateAt === 11 ? $t('linkage') : '' }}
        </template>
        <template #type="{ row }">
          {{ row.isObj ? labelText(row.paramDesc.cmdType) : row.paramDesc }}
        </template>
        <template #detail="{ row }">
          {{ detailLabel(row.paramDesc.cmdType, row.paramDesc.value1, row.paramDesc.value2) }}
        </template>
      </Table>
      <div class="page-Group">
        <Button @click="handleCurrentChange('home')">{{ $t('home') }}</Button>
        <Button icon="el-icon-arrow-left" :disabled="currentPage === 1" @click="handleCurrentChange('prev')" class="center-button">{{ $t('prev') }}</Button>
        <Button :disabled="airDisnfectorDataList.length < 10" @click="handleCurrentChange('next')" class="mar-r10">
          {{ $t('next') }}
          <i class="el-icon-arrow-right el-icon--right"></i>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
  import { labelText, detailLabel, isJSON } from '../console/device/mockList'
  import { operationLogThirdDevice } from '@/api/console/device'
  export default {
    data() {
      return {
        prevId: [''],
        lastId: '',
        mac: '',
        logTotal: 0,
        pageSize: 10,
        currentPage: 1,
        airDisnfectorDataList: [],
        airDisnfectorColumns: [
          {
            title: this.$t('operator'),
            slot: 'operateAt',
          },
          {
            title: this.$t('time'),
            key: 'createTime',
          },
          {
            title: this.$t('executionActionType'),
            slot: 'type',
          },
          {
            title: this.$t('remark'),
            slot: 'detail',
          },
        ],
      }
    },
    mounted() {
      this.mac = this.$route.params.mac
      this.getAirDisnfectorList()
    },
    methods: {
      labelText,
      detailLabel,
      async getAirDisnfectorList() {
        const params = {
          projectCode: this.$store.state.projectCode,
          mac: this.mac,
          lastId: this.lastId,
          pageSize: this.pageSize,
        }
        const res = await operationLogThirdDevice(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.airDisnfectorDataList = res.data.map(v => ({ ...v, paramDesc: isJSON(v.paramDesc) ? JSON.parse(v.paramDesc) : v.paramDesc, isObj: isJSON(v.paramDesc) }))
        if (res.data.length > 0 && res.data.length === 10) {
          this.lastId = res.data[9].id
        } else {
          this.lastId = ''
        }
      },
      handleCurrentChange(e) {
        if (e === 'home') {
          this.prevId = ['']
          this.lastId = ''
          this.currentPage = 1
        } else if (e === 'prev') {
          if (this.currentPage !== 1) {
            this.currentPage -= 1
            this.prevId.pop()
            this.lastId = this.prevId[this.prevId.length - 1]
          } else {
            return false
          }
        } else if (e === 'next') {
          this.currentPage += 1
          this.prevId.push(this.airDisnfectorDataList[this.airDisnfectorDataList.length - 1].id)
        }
        this.getAirDisnfectorList()
      },
    },
  }
</script>

<style lang="less">
  .airDisinfectioOperationLog {
    .pt-15 {
      padding: 15px;
    }
    .page-Group {
      margin-top: 10px;
      text-align: right;
    }
    .center-button {
      margin: 0 10px;
    }
    .mar-r10 {
      margin-right: 10px;
    }
  }
</style>
