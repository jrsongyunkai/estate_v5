<template>
  <div>
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <span>{{ $t('operationLog') }}</span>
      </div>
      <div class="right">
        <Button @click.stop="goToLogs" type="primary" ghost>{{ $t('viewAll') }}</Button>
      </div>
    </div>
    <Table :columns="oprationColumns" :data="oprationData" :max-height="285">
      <template slot-scope="{ row }" slot="operName">{{ row.staffName }}</template>
      <template slot-scope="{ row }" slot="macs">{{ row.mac }}</template>
      <template slot-scope="{ row }" slot="operTime">{{ row.operaTime }}</template>
      <template slot-scope="{ row }" slot="address">{{ row.address }}</template>
      <template slot-scope="{ row }" slot="content">
        <div v-if="row.contents === 0">{{ $t('unknown2') }}</div>
        <div v-if="row.contents === 1">{{ $t('restart') }}</div>
        <div v-if="row.contents === 2">{{ $t('reset1') }}</div>
        <div v-if="row.contents === 3">{{ $t('brightnessAdjustment') }}</div>
        <div v-if="row.contents === 4">{{ $t('lightControlOn') }}</div>
        <div v-if="row.contents === 5">{{ $t('lightControlOff') }}</div>
      </template>
      <template slot-scope="{ row }" slot="logType">
        <div v-if="row.type === 0">{{ $t('unknown2') }}</div>
        <div v-if="row.type === 1">{{ $t('restartDevice') }}</div>
        <div v-if="row.type === 2">{{ $t('resetDevice') }}</div>
        <div v-if="row.type === 3">{{ $t('dimmingCommand') }}</div>
      </template>
      <template slot-scope="{ row }" slot="results">
        <div v-if="row.result === '0'" style="color: #21f27f">{{ $t('success') }}</div>
        <div v-if="row.result === '1'" style="color: #f24e4c">{{ $t('fail') }}</div>
      </template>
    </Table>
  </div>
</template>

<script>
  import { logsthirdDevice } from '@/api/public'
  import store from '@/store'
  export default {
    props: {
      mac: { type: String, default: '' },
    },
    data() {
      return {
        oprationColumns: [
          { title: this.$t('operator'), slot: 'operName' },
          { title: this.$t('equipmentNo'), slot: 'macs' },
          { title: this.$t('operatingTime'), slot: 'operTime' },
          { title: this.$t('place'), slot: 'address' },
          { title: this.$t('logContent'), slot: 'content' },
          { title: this.$t('logType'), slot: 'logType' },
          { title: this.$t('resultFeedback'), slot: 'results' },
        ],
        oprationData: [{ mac: '32115' }],
      }
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        let parmars = { mac: this.mac }
        const res = await logsthirdDevice(parmars)
        if (res.success) {
          this.oprationData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      goToLogs() {
        store.commit('detailsFlagMore', false)
        this.$router.push('/Logs')
      },
    },
  }
</script>

<style lang="less">
  .theader {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;
    .right {
      display: flex;
      align-content: flex-end;
      align-items: center;
    }
  }
</style>
