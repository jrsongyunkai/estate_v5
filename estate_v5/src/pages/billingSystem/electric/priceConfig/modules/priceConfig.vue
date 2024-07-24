<template>
  <div class="price-config-details">
    <BackTopTitle title="单价配置（小时电量）" @close="$emit('close')">
      <!-- <Button ghost @click.stop="$emit('close')">取消</Button>
      <Button class="ml-10" type="primary" ghost @click.stop="">保存</Button> -->
      <Button class="ml-10" type="primary" ghost @click.stop="">添加单价</Button>
    </BackTopTitle>
    <div class="info">
      <Tabs :value="tabName" :animated="false" @on-click="handleTabsSelect">
        <TabPane label="当前使用电价" name="current" tab="subTab">
          <div class="card-item">
            <div class="header-title">
              <div class="left">配置对象</div>
              <div class="right">
                <Button class="ml-10" type="primary" ghost @click.stop="">管理</Button>
                <Button class="ml-10" type="primary" ghost @click.stop="" icon="md-copy"></Button>
                <Button class="ml-10" type="error" ghost @click.stop="" icon="ios-trash-outline"></Button>
              </div>
            </div>
            <groupPickView v-if="chargeType === 'group'" v-model="groupList"></groupPickView>
            <linePickView v-if="chargeType === 'line'" v-model="addrList"></linePickView>
            <Tag v-if="chargeType === 'project'" class="tag-item" size="medium">{{ `${$store.state.prjTitle}` }}</Tag>
            <div class="header-title mt-10">
              <div class="left">单价阶梯</div>
              <div class="right"></div>
            </div>
            <tablePricesView v-model="priceList"></tablePricesView>
          </div>
        </TabPane>
        <TabPane label="待用电价" name="activated" tab="subTab"></TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import noMarginTop from '@/mixins/noMarginTop'
  import BackTopTitle from '@/pages/billingSystem/component/BackTopTitle.vue'
  import groupPickView from '../fragment/groupPickView.vue'
  import linePickView from '../fragment/linePickView.vue'
  import tablePricesView from '../fragment/tablePricesView.vue'
  export default {
    props: {
      chargeType: { type: String, default: 'line' },
      record: { type: Object, default: () => {} },
    },
    components: { BackTopTitle, groupPickView, linePickView, tablePricesView },
    mixins: [noMarginTop],
    data() {
      return {
        groupList: [],
        addrList: [],
        priceList: [],
        tabName: 'current',
      }
    },
    mounted() {},
    methods: {
      handleTabsSelect(name) {
        this.tabName = name
      },
    },
    watch: {
      priceList: {
        handler(val) {
          console.log('🚀 ~ handler ~ val:', val)
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .price-config-details {
    .info {
      padding: 0 10px;
      height: calc(~'100vh - 185px');
      overflow: auto;
      margin-top: 10px;
      scrollbar-width: none; // firefox
      &::-webkit-scrollbar {
        width: 0px;
        display: none;
      }
      .card-item {
        padding: 15px;
        background: #1a202e;
        margin-bottom: 10px;
      }
      /deep/ .ivu-tabs-bar {
        margin-bottom: 10px;
        background: #1a202e;
      }
      /deep/.ivu-tabs-nav-wrap {
        background: var(--card-bg-color);
        border-radius: 5px;
        .ivu-tabs-nav-prev,
        .ivu-tabs-nav-next {
          line-height: 50px;
        }
      }
      /deep/ .ivu-tabs-nav-scroll {
        background: var(--card-bg-color);
        padding: 5px;
        font-size: 16px;
      }
    }
    .header-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      .left {
        font-size: 14px;
        font-weight: bold;
        line-height: 30px;
        color: #007fff;
      }
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
      &::before {
        display: inline-block;
        content: '';
        width: 3px;
        height: 20px;
        background: #007fff;
        vertical-align: middle;
        margin-right: 10px;
      }
    }
  }
</style>
