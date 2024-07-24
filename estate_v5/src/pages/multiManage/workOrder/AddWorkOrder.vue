<template>
  <div>
    <div class="add-maintenance-head">
      <h3 @click="backTable" class="pointer">
        <Icon type="md-arrow-back" size="20" />
        {{ $t('InitiateWorkOrder') }}
      </h3>
      <div>
        <Button type="default" @click="backTable">{{ $t('cancel') }}</Button>
        <Button type="primary" class="ml-10" @click="saveOrderInfo">{{ $t('save') }}</Button>
      </div>
    </div>
    <div class="content-main">
      <div class="left-content default-content">
        <AddBaseInfo ref="addBaseInfoRef"></AddBaseInfo>
      </div>
      <div class="right-content default-content">
        <OrderTwistingProcess ref="orderTwistingProcessRef"></OrderTwistingProcess>
      </div>
    </div>
  </div>
</template>

<script>
  import AddBaseInfo from './components/AddBaseInfo.vue'
  import OrderTwistingProcess from './components/OrderTwistingProcess.vue'
  import { saveInfoMaintenanceNew } from '@/api/multiManage/workOrder'
  import dayjs from 'dayjs'
  export default {
    components: {
      AddBaseInfo,
      OrderTwistingProcess,
    },
    data() {
      return {}
    },
    methods: {
      backTable() {
        this.$emit('changePage', 'table')
      },
      async saveOrderInfo() {
        const { addMainForm, fileObj } = this.$refs.addBaseInfoRef
        this.$refs.addBaseInfoRef.validateForm()
        if (!addMainForm.detail || !addMainForm.time) return this.$Message.error($t('uninformation'))
        const { orderData } = this.$refs.orderTwistingProcessRef
        const filterOrder = orderData.filter((item, index) => index !== 0 && index + 1 !== orderData.length)
        // console.log('🚀 ~ saveOrderInfo ~ filterOrder:', filterOrder)
        if (filterOrder.some(v => !v.name || (!!v.name && !v.value))) return this.$Message.error(this.$t('workorderTypeTip'))
        const params = {
          id: 0,
          projectCode: this.$store.state.projectCode,
          expectedTime: dayjs(addMainForm.time).format('YYYY-MM-DD HH:mm'),
          content: addMainForm.detail,
          imgUrls: addMainForm.imgUrl.map(v => v.data).join(','),
          fileUrls: fileObj.fileUrl,
          resId: addMainForm.resId || 0,
          addrs: addMainForm.line || '',
          relatedPeopleList: filterOrder.map(v => ({ type: v.type, staffIds: Array.isArray(v.value) && v.value.length ? v.value.join(',') : '' })),
        }
        const res = await saveInfoMaintenanceNew(params)
        if (!res.success) return this.$Message.error(res.message)
        this.$Message.success(this.$t('savedSuccessfully'))
        this.backTable()
      },
    },
  }
</script>

<style lang="less" scoped>
  .add-maintenance-head {
    display: flex;
    justify-content: space-between;
    background: #1a202e;
    margin: 10px 0;
    padding: 10px;
  }
  .ml-10 {
    margin-left: 10px;
  }
  .mlf-10 {
    margin: 10px;
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
