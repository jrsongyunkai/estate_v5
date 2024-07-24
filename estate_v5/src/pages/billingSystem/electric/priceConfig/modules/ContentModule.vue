<template>
  <Row class="price-group" :gutter="10">
    <Col span="8" v-for="item in list" class="price-card" :key="item.id">
      <div class="price-item">
        <div class="item-top">
          <MImage ref="mImage" class="image" :src="item.imageUrl" />
          <div class="info-right">
            <div>{{ item.name }}</div>
            <div>来源设备类型：{{ item.sources }}</div>
          </div>
        </div>
        <div class="item-bottom">
          <div class="left-tips">
            <div>
              <Icon type="ios-apps-outline" />
              值类型：{{ item.valueType === 1 ? '相对量' : '绝对量' }}
            </div>
            <div>
              <Icon type="ios-browsers-outline" />
              已配置单价数量：{{ item.configCount }}
            </div>
          </div>
          <div class="right-button">
            <Button type="primary" ghost @click.stop="">详情</Button>
            <Button type="primary" class="ml-5" ghost @click.stop="openSubPage('parameterConfig')">参数配置</Button>
            <Button type="primary" class="ml-5" ghost @click.stop="openSubPage('priceConfig')">单价管理</Button>
          </div>
        </div>
      </div>
    </Col>
  </Row>
</template>

<script>
  export default {
    props: {
      configType: { type: String, default: 'all' },
    },
    data() {
      return {
        list: [
          { name: '小时电量', sources: '智能空开', imageUrl: '', valueType: 1, configCount: 12 },
          { name: '绝对电量', sources: '智能空开', imageUrl: '', valueType: 1, configCount: 12 },
          { name: '绝对电量', sources: '智能空开', imageUrl: '', valueType: 1, configCount: 12 },
          { name: '小时电量', sources: '智能空开', imageUrl: '', valueType: 1, configCount: 12 },
          { name: '小时电量', sources: '智能空开', imageUrl: '', valueType: 1, configCount: 12 },
          { name: '小时电量', sources: '智能空开', imageUrl: '', valueType: 1, configCount: 12 },
          { name: '小时电量', sources: '智能空开', imageUrl: '', valueType: 1, configCount: 12 },
        ],
      }
    },
    inject: ['openSubPage'],
    methods: {},
  }
</script>

<style lang="less" scoped>
  .price-group {
    max-height: calc(~'100vh - 184px');
    overflow: auto;
    padding-top: 5px;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .price-card {
      height: 210px;
      margin-bottom: 10px;
      overflow: hidden;
      min-width: 450px;
      .price-item {
        width: 100%;
        height: 100%;
        background: #1a202e;
        border-radius: 5px;
        padding: 15px;
        .item-top {
          display: flex;
          height: 90px;
          align-items: center;
          .image {
            width: 70px;
            height: 70px;
            margin-right: 10px;
          }
          .info-right {
            line-height: 40px;
          }
        }
        .item-bottom {
          height: 100px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left-tips {
            line-height: 40px;
          }
          .right-button {
            margin-top: 20px;
            .ml-5 {
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
</style>
