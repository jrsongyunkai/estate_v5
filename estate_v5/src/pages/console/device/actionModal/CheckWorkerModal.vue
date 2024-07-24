<template>
  <Modal :title="$t('checkJob')" v-model="checkWorkerModal" class="chek-modal">
    <div v-if="showOne" style="padding-left: 80px">
      <span>{{ $t('responseTimeoutDuration') }}：</span>
      <Select v-model="minValue" style="width: 100px" filterable @on-change="getMinValue">
        <Option v-for="item in timelist" :key="item.label" :value="item.value">{{ item.label }}</Option>
      </Select>
      <span>{{ $t('minute') }}</span>
    </div>
    <span></span>
    <div class="ds-center" v-if="showTwo">
      <div>
        <div><Icon type=" icon-v5  icon-v5-refresh1" class="demo-spin-icon-load" style="font-size: 40px"></Icon></div>
        <div style="margin-left: -30px">{{ $t('waitingResponse', { hour: countDown, minute: fiveNight }) }}</div>
      </div>
    </div>
    <div v-if="showThree" class="ds-center" style="margin: 20px 0">
      <div><Icon type=" icon-v5 icon-v5-dui" style="color: green"></Icon></div>
      <div>{{ $t('responsed') }}</div>
    </div>
    <div v-if="showFour" class="ds-center">
      <div><Icon type="ios-close-circle" style="color: red" /></div>
      <div>{{ $t('commandTimedOutNotResponding') }}</div>
    </div>
    <div slot="footer">
      <div v-if="isShowButton">
        <Button type="primary" @click="openCountdown">{{ $t('confirm') }}</Button>
        <Button @click="checkWorkerModal = false">{{ $t('cancel') }}</Button>
      </div>
    </div>
  </Modal>
</template>

<script>
  import { timelistData } from '../mockList'
  import { queryCheckInfo, checkUtDevice } from '@/api/public'
  export default {
    data() {
      return {
        checkWorkerModal: false,
        timelist: [],
        showOne: false,
        showTwo: false,
        showThree: false,
        showFour: false,
        isShowButton: false,
        macParmas: '',
        countDown: '',
        fiveNight: 59,
        minValue: '',
      }
    },
    methods: {
      openModal(row) {
        this.checkWorkerModal = true
        this.macParmas = row.mac
        this.timelist = timelistData([])
        this.showOne = true
        this.showTwo = false
        this.showThree = false
        this.showFour = false
        this.isShowButton = true
      },
      getMinValue(val) {
        this.countDown = +this.minValue - 1
      },
      async openCountdown() {
        if (!this.minValue) return this.$Message.error({ content: this.$t('selectDurationFirst') })
        let parmars = { mac: this.mac, checkTime: this.minValue }
        const res = await checkUtDevice(parmars)
        if (res.success) {
          this.showOne = false
          this.showTwo = true
          this.countDown = +this.minValue - 1
          let countSet = setInterval(() => {
            this.fiveNight--
            if (this.fiveNight === -1) {
              this.countDown -= 1
              this.fiveNight = 59
            }
            if (this.countDown === -1) {
              this.fiveNight = 59
              clearInterval(countSet)
            }
          }, 1000)
          this.isShowButton = false
          this.checkCounts = setInterval(() => {
            queryCheckInfo({ mac: this.macParmas }).then(res => {
              if (res.success) {
                if (res.data === 0 || res.data === 2) {
                  if (res.data === 0) {
                    this.showOne = false
                    this.showTwo = false
                    this.showThree = true
                    this.showFour = false
                  }
                  if (res.data === 2) {
                    this.showOne = false
                    this.showTwo = false
                    this.showThree = false
                    this.showFour = true
                  }
                  clearInterval(this.checkCounts)
                  clearInterval(countSet)
                }
              } else {
                clearInterval(countSet)
                clearInterval(this.checkCounts)
                this.checkWorkerModal = false
                this.$Message.error({ content: res.message })
              }
            })
          }, 5000)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>

<style></style>
