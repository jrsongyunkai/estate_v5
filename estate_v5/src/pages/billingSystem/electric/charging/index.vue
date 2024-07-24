<template>
  <div class="charging">
    <firstActivation v-if="status === '2'" @ActivationStatus="ActivationStatus" :billingCheckStatus="billingCheckStatus" :firstActivationStatus="firstActivationStatus"></firstActivation>
    <balanceList v-if="status === '1' && hadPowerPrice"></balanceList>
  </div>
</template>
<script>
  import balanceList from './balanceList.vue'
  import firstActivation from './firstActivation.vue'
  import { billingCheck, getPowerCycle, billPeriodList } from '@/api/public'
  import store from '@/store'
  export default {
    name: 'billingSystem-charging',
    components: {
      firstActivation,
      balanceList,
    },
    data() {
      return {
        firstActivationStatus: 'null',
        billingCheckStatus: false,
        status: '3',
        hadPowerPrice: false,
      }
    },
    mounted() {
      this.handlebillingCheck(false)
    },
    methods: {
      ActivationStatus() {
        this.handlebillingCheck()
      },
      async handlebillingCheck(type) {
        let params = { projectCode: this.$store.state.projectCode, isThrowError: type }
        const res = await billingCheck(params)
        if (res.success) {
          this.firstActivationStatus = res.data ? 'true' : 'false'
          this.status = res.data ? '1' : '2'
          if (res.data && !type) {
            this.handleBillPeriodList()
            this.handleGetPowerCycle()
          }
        } else {
          this.firstActivationStatus = 'null'
          this.billingCheckStatus = true
          this.$Message.error({ content: res.message })
        }
      },
      async handleBillPeriodList() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await billPeriodList(params)
        if (res.success) {
          let timerList = res.data.map(val => ({ label: val, value: val }))
          store.commit('charginTimer', timerList)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleGetPowerCycle() {
        let params = { projectCode: this.$store.state.projectCode, isCurr: true }
        const res = await getPowerCycle(params)
        if (res.success) {
          store.commit('billingTarget', res.data.billingTarget)
          store.commit('billCycle', res.data.billingCycle)
          store.commit('billingCycleName', res.data.billingCycleName)
          this.hadPowerPrice = true
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    watch: {},
  }
</script>
