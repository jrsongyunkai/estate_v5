<template>
  <span class="i-layout-header-trigger i-layout-header-trigger-min" @click="toggleFullscreen">
    <!-- <Icon custom="icon-v5 icon-v5-quanjufangda1_full-screen-one" v-show="!isFullscreen" /> -->
    <img src="../../../../assets/images/icon_nav_visFull.png" v-show="!isFullscreen" alt="" />
    <img src="../../../../assets/images/icon_nav_visNotFull.png" v-show="isFullscreen" alt="" />
    <!-- <Icon type="ios-expand" /> -->
    <!-- <Icon custom="icon-v5 icon-v5-quanjufangda1_full-screen-one" v-show="isFullscreen" /> -->
  </span>
</template>
<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'iHeaderFullscreen',
    computed: {
      ...mapState('admin/layout', ['isFullscreen']),
    },
    methods: {
      ...mapActions('admin/layout', ['toggleFullscreen']),
    },
  }
</script>
