<template>
  <div id="pop-Notice">
    <Alert show-icon>{{ $t('popupNorufucal') }}</Alert>
    <AlarmTreeList ref="alarmListRef" :checkedAlarm="checkedAlarm"></AlarmTreeList>
    <div class="mt-20">
      <Button plain type="primary" style="margin-top: 50px" @click="handleSubmitSystems">{{ $t('save') }}</Button>
    </div>
  </div>
</template>

<script>
  import { queryPoPup, updatePoPup } from '@/api/public'

  import AlarmTreeList from './AlarmTreeList.vue'
  export default {
    components: { AlarmTreeList },
    data() {
      return {
        alarmKey: 'alarmKey',
        checkedAlarm: [],
      }
    },
    created() {},
    mounted() {
      this.getCheckedList()
    },
    methods: {
      async getCheckedList() {
        const { data, message, success } = await queryPoPup({})
        if (!success) {
          return this.$Message.error(message)
        }
        const customTypeNumbersList = data.customTypeNumbers.split(',').map(v => +v)
        this.checkedAlarm = customTypeNumbersList.concat(data.typeNumbers.split(','))
      },
      async handleSubmitSystems() {
        const checkList = this.$refs.alarmListRef.checkedList
        const typeNumbers = checkList
          .filter(v => !v.projectCode)
          .map(j => j.typeNumber)
          .join(',')
        const customTypeNumbers = checkList
          .filter(v => !!v.projectCode)
          .map(j => j.typeNumber)
          .join(',')
        let params = {
          typeNumbers,
          customTypeNumbers,
        }
        const res = await updatePoPup(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.$Message.success({
          content: this.$t('modifySuccess'),
        })
        this.getCheckedList()
      },
    },
    watch: {},
  }
</script>

<style lang="less" scoped>
  #pop-Notice {
    overflow: auto;
    .ivu-alert {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      padding-top: 15px;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    /deep/.ivu-alert-icon {
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
