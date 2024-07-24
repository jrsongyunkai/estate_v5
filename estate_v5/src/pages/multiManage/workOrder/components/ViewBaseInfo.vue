<template>
  <div>
    <div>
      <h3 class="title-info">
        <span class="blue-box"></span>
        {{ $t('baseInfo') }}
      </h3>
    </div>
    <Form class="base-info-form" v-if="info">
      <Form ref="" :model="info" label-position="right" :label-width="110">
        <FormItem :label="$t('maintenanceTargets') + '：'">
          <div class="text-box" v-textRoll>
            {{ info.macAddr }}
          </div>
        </FormItem>
        <FormItem :label="$t('expectedProcessingTime') + '：'">
          <div>{{ info.time }}</div>
        </FormItem>
        <FormItem :label="$t('maintenanceDetails') + '：'">
          <div class="detail-style">{{ info.detail }}</div>
        </FormItem>
        <FormItem :label="$t('siteImages') + '：'">
          <template>
            <el-image v-for="(item, index) in info.imgUrl" :src="item" :key="index" class="img-box" :preview-src-list="info.imgUrl"></el-image>
          </template>
        </FormItem>
        <FormItem :label="$t('enclosure') + '：'">
          <a :href="info.file" download v-if="info.file" class="text-style-a">
            <div class="file-box" v-if="info.fileName">
              <div>
                <img :src="info.img" alt="" class="img-style" />
              </div>
              <div>
                <div class="mt--20 file-name-style" v-textRoll>{{ info.fileName }}</div>
                <div class="text-height">{{ info.fileSizes || '' }}</div>
              </div>
            </div>
          </a>
        </FormItem>
      </Form>
    </Form>
  </div>
</template>

<script>
  export default {
    props: {
      rowData: Object,
      infoDetail: Object,
    },
    computed: {},
    data() {
      return {
        info: this.infoDetail,
      }
    },
    mounted() {},
    methods: {},
    watch: {
      infoDetail: {
        handler(val) {
          this.info = val
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .text-box {
    border: 1px solid #3d3d41;
    padding: 2px;
    border-radius: 4px;
  }
  .detail-style {
    white-space: normal;
  }
  .title-info {
    margin: 20px;
    display: flex;
    color: #0372e5;
  }
  .blue-box {
    display: inline-block;
    width: 2px;
    height: 18px;
    margin-right: 8px;
    margin-top: 3px;
    background: #0372e5;
  }
  .base-info-form {
    width: 500px;
    margin: 20px auto;
  }
  .img-box {
    width: 58px;
    height: 58px;
    display: inline-block;
    margin-left: 8px;
  }
  .file-box {
    display: flex;
    height: 80px;
    background: #28303e;
    width: 100%;
    align-items: center;
  }
  .text-height {
    line-height: 16px;
    height: 16px;
    color: #999;
  }
  .img-style {
    width: 25px;
    height: 25px;
    margin: 0 15px;
  }
  .mt--20 {
    margin-top: -20px;
  }
  .text-style-a {
    text-decoration: none;
    color: inherit;
    outline: none;
    &:hover {
      color: inherit;
    }
    &:visited {
      color: inherit;
    }
    &:active {
      color: inherit;
    }
  }
</style>
