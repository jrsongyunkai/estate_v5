<template>
  <i-link class="i-layout-header-logo" :class="{ 'i-layout-header-logo-stick': !isMobile }" to="/console/project">
    <img v-if="individual.mainPageLogo" :src="individual.mainPageLogo.imageUrl" :style="`height:${individual.mainPageLogo.height};width:${individual.mainPageLogo.width}`" alt="" />
  </i-link>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    name: 'iHeaderLogo',
    data() {
      return {
        individual: '',
      }
    },
    computed: {
      ...mapState('admin/layout', ['isMobile', 'headerTheme']),
    },
    mounted() {
      this.individual = this.$store.state.individual
    },
  }
</script>
