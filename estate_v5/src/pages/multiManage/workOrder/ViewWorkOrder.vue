<template>
  <div>
    <BackTopTitle @close="backTable" :title="$t('workOrderDetail')">
      <Button v-for="item in rowData.handleTypeList" :key="item.type" :type="item.type === 7 ? 'error' : 'primary'" ghost @click="processOrderInfo(rowData, item.type)">{{ item.typeInfo }}</Button>
    </BackTopTitle>

    <div class="content-main">
      <div class="left-content default-content">
        <ViewBaseInfo ref="viewBaseInfoRef" :rowData="rowData" :infoDetail="infoDetail"></ViewBaseInfo>
      </div>
      <div class="right-content default-content">
        <ProcessFlow ref="processFlowRef" :logList="logList"></ProcessFlow>
      </div>
    </div>
    <ActionModal ref="actionModalRef" @saveCompleteModal="saveCompleteModal"></ActionModal>
  </div>
</template>

<script>
  import ViewBaseInfo from './components/ViewBaseInfo.vue'
  import BackTopTitle from '@/pages/billingSystem/component/BackTopTitle.vue'
  import ProcessFlow from './components/ProcessFlow.vue'
  import ActionModal from './ActionModal.vue'
  import { handleMaintenance, getDetailMaintenanceNew } from '@/api/multiManage/workOrder'
  import { fileTypeList } from './maintenanceOrder'
  export default {
    components: {
      ActionModal,
      ViewBaseInfo,
      ProcessFlow,
      BackTopTitle,
    },
    props: {
      rowData: Object,
    },
    data() {
      return {
        infoDetail: null,
        logList: [],
      }
    },
    mounted() {
      // console.log('🚀 ~ mounted ~ this.rowData:', this.rowData)
      this.init()
    },
    computed: {},
    methods: {
      async init() {
        const res = await getDetailMaintenanceNew({
          projectCode: this.$store.state.projectCode,
          id: this.rowData.id,
        })
        // console.log('🚀 ~ init ~ res:', res)
        if (!res.success) return this.$Message.error(res.message)
        const { addrs, boxName, content, expectedTime, fileUrls, fileSizes, imgUrls, mac, handleLogList, titles } = res.data // relatedPeopleList, resId,
        const findImgType = fileTypeList.find(item => fileUrls.includes(item.type))
        const fileNameArr = fileUrls ? fileUrls.split('/') : []
        this.infoDetail = {
          macAddr: `${boxName}${mac ? `(${mac})` : ''}  ${addrs ? `/${titles}(${mac}-${addrs.padStart(2, '0')})` : ''}`,
          time: expectedTime,
          detail: content,
          imgUrl: imgUrls ? imgUrls.split(',') : [],
          file: fileUrls,
          fileName: fileNameArr.length ? fileNameArr[fileNameArr.length - 1] : '',
          size: null,
          img: findImgType ? findImgType.img : '',
          fileSizes,
        }
        this.logList = handleLogList
      },
      backTable() {
        this.$emit('changePage', 'table')
      },
      processOrderInfo(row, type) {
        const typeConfig = {
          4: 'openCompleteModal',
          2: 'openReviewModal',
          5: 'openAcceptanceModal',
          7: 'openRevokeModal',
          3: 'openProcessModal',
        }
        this.$refs.actionModalRef[typeConfig[type]](row, type)
      },
      async saveCompleteModal(val) {
        const isTypeThree = val.type === 3
        let params = {
          id: val.id,
          projectCode: this.$store.state.projectCode,
          type: val.type, // 2-审核,3-处理,4-完成,5-验收,7-撤销
          content: val.detail,
          otherData: {
            status: val.status,
            beforeImgs: isTypeThree ? val.img[0].map(v => v.data).join(',') : '',
            afterImgs: isTypeThree ? val.img[1].map(v => v.data).join(',') : '',
            files: isTypeThree && val.img[2] ? val.img[2] : '',
            fileNames: isTypeThree && val.img[3] ? val.img[3] : '',
          },
        }
        const res = await handleMaintenance(params)
        if (!res.success) return this.$Message.error(res.message)
        this.$Message.success(this.$t('actionSuccess'))
        this.$refs.actionModalRef.closeModal(val.type)
        this.init()
      },
    },
  }
</script>

<style lang="less" scoped>
  .view-maintenance-head {
    display: flex;
    justify-content: space-between;
    background: #1a202e;
    margin: 10px 0;
    padding: 10px;
  }
  .content-main {
    margin: 10px;
    height: ~'calc(100vh - 195px)';
    display: flex;
  }
  .left-content {
    margin-right: 10px;
  }
  .right-content {
  }
  .default-content {
    height: 100%;
    flex: 1;
    overflow: auto;
    background: #1a202e;
  }
</style>
