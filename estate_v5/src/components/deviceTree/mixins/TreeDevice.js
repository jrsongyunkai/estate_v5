export default {
  props: {
    keyWord: { type: String, default: '' },
    energyType: { type: Number, default: 1 },
  },
  data() {
    return {
      loading: true,
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.keyword.indexOf(value) !== -1
    },
  },
  watch: {
    keyWord: {
      handler(value) {
        this.$refs.treeRef && this.$refs.treeRef.filter(value)
      },
      deep: true,
    },
  },
}
