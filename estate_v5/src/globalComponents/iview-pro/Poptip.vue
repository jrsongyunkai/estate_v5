<script>
  import { Poptip } from 'view-design'
  import mousedownOutside from '@/directive/v-mousedownOutside'

  export default {
    name: 'Poptip',
    extends: Poptip,
    directives: {
      clickOutside: mousedownOutside,
    },
    methods: {
      rawHandleTransferClick() {
        if (this.transfer) this.disableCloseUnderTransfer = true
      },
      handleTransferClick() {},
    },
    mounted() {
      this.$refs.popper.addEventListener('mousedown', this.rawHandleTransferClick)
    },
    beforeDestroy() {
      this.$refs.popper.removeEventListener('mousedown', this.rawHandleTransferClick)
    },
  }
</script>
