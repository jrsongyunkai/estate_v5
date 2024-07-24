export default {
  beforeCreate() {
    document.body.removeAttribute('class', 'ivu-theme-dark')
  },
  created() {
    this.$store.state.projectCode = this.$route.query.projectCode
  },
}
