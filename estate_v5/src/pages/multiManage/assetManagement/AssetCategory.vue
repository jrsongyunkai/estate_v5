<template>
  <div>
    <div class="default-style">{{ $t('allAsset') }}</div>
    <div v-for="(item, index) in assetList" :key="index" class="default-style" :class="item.checked ? 'check-style' : ''">
      <Checkbox v-model="item.checked">
        {{ item.name }}
      </Checkbox>
      <span></span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      typeList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        assetList: [{ name: this.$t('categoryOne'), checked: false }],
      }
    },
    mounted() {},
    methods: {},
    watch: {
      typeList: {
        handler(newVal) {
          this.assetList = newVal
        },
        deep: true,
      },
      assetList: {
        handler(newVal) {
          this.$emit('emitType', newVal)
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .default-style {
    width: 100%;
    padding: 10px 0 10px 15px;
    background: #272d39;
    margin: 10px;
  }
  .check-style {
    background: #172e41;
    color: #02a7f0;
  }
</style>
