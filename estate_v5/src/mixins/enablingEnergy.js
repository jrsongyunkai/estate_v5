import { getKeyValue } from '@/api/common/index'
export default {
  data() {
    return {
      isOverLoad: false,
      isNeedAuth: true,
    }
  },
  methods: {
    async getConfigValue() {
      let params = { at: 'db', tag: 'prj', key: 'SMART_ENERGY_AUTH', ep: this.$store.state.projectCode }
      const res = await getKeyValue(params)
      if (res.success) {
        this.isNeedAuth = !res.data
      } else {
        this.$message.error(res.message)
      }
      this.isOverLoad = true
    },
  },
  created() {
    this.getConfigValue()
  },
}
