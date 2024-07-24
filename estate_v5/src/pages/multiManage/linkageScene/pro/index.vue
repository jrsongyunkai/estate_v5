<template>
  <div class="linkage-pro">
    <!-- 首页列表 -->
    <div class="linkage-list" v-if="pageMode === 'index'">
      <Row class="linkage-list-top" justify="space-between" :wrap="false">
        <Row>
          <Input v-model="search.linkId" :placeholder="$t('pleaseInputConfigId')" style="width: 200px" />
          <DatePicker v-model="createTime" type="daterange" placement="bottom-end" :placeholder="$t('pleaseSelectCreateTimeRange')" style="width: 200px" class="ml-10" />
          <Select v-model="search.linkageMode" style="width: 200px" class="ml-10" :placeholder="$t('pleaseSelectExecuteMode')">
            <Option v-for="item in constants.LINKAGE_MODE_FILTERS" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select v-model="search.status" style="width: 200px" class="ml-10" :placeholder="$t('pleaseSelectState')">
            <Option v-for="item in constants.LINKAGE_STATUS_FILTERS" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Button type="primary" class="ml-10" @click="queryList">{{ $t('query') }}</Button>
          <Button class="ml-10" @click="reset">{{ $t('reset') }}</Button>
        </Row>
        <Button class="ml-10" type="primary" ghost @click="setVersion('old')">
          <Icon type="ios-undo" />
          {{ $t('switchTo2021') }}
        </Button>
      </Row>
      <div class="linkage-list-content">
        <Row class="header">
          <h4>{{ $t('linkageList') }}</h4>
          <Button type="primary" class="b-blue" @click="handleAddLinkageScene">{{ $t('addLinkage') }}</Button>
        </Row>
        <Table :columns="constants.TABLE_COLUMNS" :data="tableData.data">
          <template #name="{ row }">
            <div v-textRoll="6">{{ row.name }}</div>
          </template>
          <template #loopCycle="{ row }">
            {{ row | loopCycle }}
          </template>
          <template #timeRangeList="{ row }">
            {{ row | timeRangeList }}
          </template>
          <template slot-scope="{ row }" slot="status">
            <Switch :true-value="1" :false-value="2" v-model="row.status" @on-change="toggleLinkage(row.sceneId, $event)" />
          </template>
          <template slot-scope="{ row }" slot="action">
            <div class="operation">
              <Button type="text" class="blueC" @click="viewDetail(row)">{{ $t('view') }}</Button>
              <Button type="text" class="blueC" @click="openEdit(row)">{{ $t('edit') }}</Button>
              <Button type="text" class="redC" @click="openToolModal(row.sceneId, row)">{{ $t('delete') }}</Button>
              <Button type="text" class="blueC" @click="viewDetail(row, 'his')">{{ $t('commandHistory') }}</Button>
            </div>
          </template>
        </Table>
        <Page show-total :current="search.pageNo" @on-change="changePage" :total="tableData.total" show-elevator />
      </div>
    </div>
    <template v-if="pageMode === 'addLinkageScene'">
      <Marginal @changePageMode="changePageMode" :rowEditData="rowEditData" />
    </template>
    <template v-if="pageMode === 'viewLinkageSceneDetail'">
      <linkageDetailsVue @changePageMode="changePageMode" :idAndRowData="idAndRowData" :tabTohis="tabTohis"></linkageDetailsVue>
    </template>
    <Modal :title="$t('tip')" v-model="promptModal" width="420px" :mask="false" :close-on-click-modal="false">
      <Row>
        <Col class="pd-20">
          <div class="el-message-box__status el-icon-warning"></div>
        </Col>
        <Col class="mal-30">
          <div class="el-message-box__message">
            {{ textMessageBox }}
          </div>
        </Col>
      </Row>
      <div slot="footer" :class="rowDelData.linkageMode === 1 ? 'disb-button' : ''">
        <Col v-if="rowDelData.linkageMode === 1">
          <Checkbox v-model="forceDelete">{{ this.$t('forceDeletePlatformRecord') }}</Checkbox>
        </Col>
        <Col>
          <Button @click="promptModal = false">{{ $t('cancel') }}</Button>
          <Button class="b-blue" @click="handleOk">{{ $t('confirm') }}</Button>
        </Col>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'
  import Marginal from './marginal.vue'
  import { time2seconds } from '@utils/time'
  import { TABLE_COLUMNS, LINKAGE_MODE_FILTERS, LINKAGE_STATUS_FILTERS } from './constants'
  import dayjs from 'dayjs'
  import { queryList, modifyStatus, deleteConfig } from '@api/multiManage/linkagePro'
  import { cloneDeep } from 'lodash'
  import linkageDetailsVue from './linkageDetails.vue'

  const defaultSearch = {
    linkId: '',
    startTime: '',
    endTime: '',
    linkageMode: -1,
    status: -1,
    pageNo: 1,
    pageSize: 10,
  }

  export default {
    name: 'multiManage-linkage-pro',
    components: {
      Marginal,
      linkageDetailsVue,
    },
    data() {
      return {
        forceDelete: false,
        textMessageBox: this.$t('confirmDeleteThisLinkageConfig'),
        promptModal: false,
        pageMode: 'index',
        search: cloneDeep(defaultSearch),
        tableData: {
          data: [],
          total: 0,
        },
        rowEditData: {},
        rowDelData: {},
        rowSceneId: '',
        idAndRowData: {},
        tabTohis: '',
      }
    },
    created() {
      this.constants = {
        TABLE_COLUMNS,
        LINKAGE_MODE_FILTERS,
        LINKAGE_STATUS_FILTERS,
      }
    },
    computed: {
      createTime: {
        get() {
          return [this.search.startTime, this.search.endTime]
        },
        set(v) {
          const format = 'YYYY-MM-DD HH:mm:ss'
          this.search.startTime = v[0] ? dayjs(v[0]).format(format) : ''
          this.search.endTime = v[1] ? dayjs(v[1]).format(format) : ''
        },
      },
    },
    methods: {
      ...mapMutations('linkage', ['setVersion']),
      changePageMode(val) {
        this.pageMode = val
        this.queryList()
      },
      async queryList() {
        const { success, message, datas, total } = await queryList({
          resCode: this.$store.state.projectCode,
          ...this.search,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        this.tableData.data = datas
        this.tableData.total = total
      },
      changePage(n) {
        this.search.pageNo = n
        this.queryList()
      },
      reset() {
        this.search = cloneDeep(defaultSearch)
        this.queryList()
      },
      async toggleLinkage(sceneId, status) {
        const { success, message } = await modifyStatus({
          projectCode: this.$store.state.projectCode,
          sceneId,
          status,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        this.$Message.success(message)
        this.queryList()
      },
      handleOk() {
        this.deleteLinkage(this.rowSceneId, 'isForceDel')
      },
      openToolModal(sceneId, row) {
        this.rowSceneId = sceneId
        this.rowDelData = row
        this.promptModal = true
        // if (row.linkageMode === 1) {
        // } else {
        //   this.deleteLinkage(sceneId)
        // }
      },
      async deleteLinkage(sceneId, type) {
        const { success, message } = await deleteConfig({
          projectCode: this.$store.state.projectCode,
          sceneId,
          isForceDel: type === 'isForceDel' ? this.forceDelete : true,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        if (this.promptModal) {
          this.promptModal = false
        }
        this.queryList()
      },
      handleAddLinkageScene() {
        this.rowEditData = { isEdit: false }
        // console.log('🚀 ~ file: index.vue:158 ~ handleAddLinkageScene ~ this.rowEditData:', this.rowEditData)
        this.pageMode = 'addLinkageScene'
      },
      openEdit(row) {
        this.rowEditData = { ...row, isEdit: true }
        this.pageMode = 'addLinkageScene'
      },
      viewDetail(row, type) {
        this.idAndRowData = row
        if (type === 'his') {
          this.tabTohis = type
        } else {
          this.tabTohis = ''
        }
        this.pageMode = 'viewLinkageSceneDetail'
      },
    },
    filters: {
      loopCycle(row) {
        switch (row.loopMode) {
          case 1:
            return row.loopCycle
          case 2:
            return '-'
          case 3:
            return row.loopCycle
              .split(',')
              .map(s => `${s}`)
              .join(',')
        }
      },
      timeRangeList(row) {
        return row.timeRangeList
          .map(({ startTime, endTime }) => {
            const nextDayStr = time2seconds(endTime) < time2seconds(startTime) ? `【${this.$t('nextDay')}】` : ''
            return `${startTime} ~ ${nextDayStr}${endTime}`
          })
          .join(',')
      },
    },
    mounted() {
      this.queryList()
    },
  }
</script>
<style lang="less" scoped>
  .mal-30 {
    margin-left: 30px;
  }
  .blueC {
    color: #007eff;
  }
  .redC {
    color: #e03c3a;
  }
  .disb-button {
    display: flex;
    justify-content: space-between;
  }
  .linkage-list {
    .linkage-list-top {
      background: #1a202e;
      padding: 10px 20px;
    }
    .linkage-list-content {
      background: #1a202e;
      margin: 10px 0;
      padding: 10px;
      .header {
        padding: 10px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        font-size: 16px;
        align-items: center;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .linkage-list-content {
    .operation {
      display: flex;
      // flex-wrap: wrap;
      // justify-content: space-between;
      // align-content: space-between;
      // height: 68px;
      // .ivu-btn {
      //   width: 80px;
      // }
    }
  }
</style>
