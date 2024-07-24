<template>
  <div>
    <Row class="mar-20">
      <Col :span="16">
        <span class="gray-color">{{ $t('patrolTime') }}:</span>
        <span>{{ row.completeTime }}</span>
      </Col>
      <Col :span="8">
        <span class="gray-color">{{ $t('patrolInspector') }}:</span>
        <span>{{ row.completeStaffName }}</span>
      </Col>
    </Row>
    <Row class="mar-20">
      <Col>
        <span class="gray-color">{{ $t('patrolContents') }}:</span>
        <span>{{ row.content }}</span>
      </Col>
    </Row>
    <Row class="mar-20">
      <Col>
        <span class="gray-color">{{ $t('patrolResults') }}:</span>
        <span>{{ row.result }}</span>
      </Col>
    </Row>
    <Row class="mar-20">
      <Col style="display: flex">
        <span class="gray-color">{{ $t('patrolPhotos') }}:</span>
        <span style="display: flex">
          <div style="width: 100px; height: 100px; margin: 0 5px" v-for="(item, index) in row.imgUrls.split(';')" :key="index">
            <el-image :src="item" alt="#" :preview-src-list="row.imgUrls.split(';')" style="width: 100%; height: 100%; border-radius: 5px"></el-image>
          </div>
        </span>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    props: {
      row: { type: Object, default: () => {} },
    },
    data() {
      return {
        property: 'value',
      }
    },
    mounted() {},
  }
</script>

<style lang="less">
  .gray-color {
    color: #999999;
  }
  .mar-20 {
    margin: 10px 0;
  }
</style>
