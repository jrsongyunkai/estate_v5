import store from '@/store/index'
import { queryBoxDetails } from '@/api/public'
export default {
  data() {
    return {
      showDetail: false,
      showSwitch: false,
      initTab: 'deviceInfo',
      deviceInfo: {},
    }
  },
  methods: {
    closeView() {
      this.deviceInfo = {}
      this.showDetail = false
    },
    async handle(row) {
      const res = await queryBoxDetails({ mac: row.mac })
      if (res.success) {
        this.lookDeviceDetails(res.data)
      } else {
        this.$Message.error({ content: res.message })
      }
    },
    lookDeviceDetails(info) {
      store.commit('mac', info.mac)
      store.commit('equipmentType', info.equipmentType)
      this.deviceInfo = info
      this.showDetail = true
    },
  },
}
