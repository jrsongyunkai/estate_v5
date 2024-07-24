<template>
  <div style="height: calc(100vh - 86px)">
    <iframe :src="url" width="100%" height="100%" frameborder="0"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'quicklyMenu',
    data() {
      return {
        url: '',
      }
    },
    mounted() {
      this.url = this.$route.query.link
    },
  }
</script>

<style></style>
