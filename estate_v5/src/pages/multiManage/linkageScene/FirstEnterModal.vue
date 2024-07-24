<template>
  <Modal width="600" v-model="visible" :title="$t('linkageMode')" @on-ok="setVersion(selectedVersion)" @on-visible-change="setFirstEnter">
    <div class="version-tips">{{ $t('linkageVersionTips') }}</div>
    <div class="version-item" :class="{ active: selectedVersion === 'pro' }" @click="setCurrentVersion('pro')">
      <img src="@/assets/images/new.png" alt="" class="icon-new" />
      <div class="version-item-title">
        {{ $t('advancedLinkage') }}
        <Tag color="rgb(242, 78, 76)">{{ $t('recommend') }}</Tag>
      </div>
      <div class="version-item-subtitle">{{ $t('advancedLinkageFeature') }}</div>
      <Divider />
      <Grid :col="2" :border="false" padding="0 0 10px 0">
        <GridItem v-for="text in proFeatures" :key="text">
          <div class="version-feature">
            <Icon type="md-checkmark-circle" color="#70b603" size="20" />
            <span>{{ text }}</span>
          </div>
        </GridItem>
      </Grid>
    </div>
    <div class="version-item" :class="{ active: selectedVersion === 'old' }" @click="setCurrentVersion('old')">
      <div class="version-item-title">{{ $t('linkageVersion2021') }}</div>
      <div class="version-item-subtitle">{{ $t('linkageVersion2021Feature') }}</div>
      <Divider />
      <Grid :col="2" :border="false" padding="0 0 10px 0">
        <GridItem v-for="text in oldFeatures" :key="text">
          <div class="version-feature">
            <Icon type="md-checkmark-circle" color="#70b603" size="20" />
            <span>{{ text }}</span>
          </div>
        </GridItem>
      </Grid>
    </div>
  </Modal>
</template>
<script>
  import LinkagePro from './pro/index.vue'
  import LinkageOld from '../builtInTimer/LinkageScene.vue'
  import { mapMutations } from 'vuex'
  export default {
    name: 'multiManage-linkageScene',
    components: {
      LinkagePro,
      LinkageOld,
    },
    data() {
      return {
        visible: this.$store.state.linkage.firstEnter,
        selectedVersion: 'pro',
        proFeatures: [window.$t('linkageProFeat1'), window.$t('linkageProFeat2'), window.$t('linkageProFeat3'), window.$t('linkageProFeat4')],
        oldFeatures: [window.$t('linkageOldFeat1'), window.$t('linkageOldFeat2')],
      }
    },
    methods: {
      ...mapMutations('linkage', ['setFirstEnter', 'setVersion']),
      setCurrentVersion(version) {
        this.selectedVersion = version
      },
    },
  }
</script>
<style lang="less" scoped>
  .version-tips {
    padding: 10px 0;
    font-size: 14px;
  }
  .version-item {
    position: relative;
    padding: 10px;
    border: 1px solid #aaa;
    border-radius: 4px;
    margin-bottom: 10px;
    cursor: pointer;
    .icon-new {
      position: absolute;
      right: 0;
      top: 0;
    }
    .version-item-title {
      font-size: 16px;
      display: flex;
      align-items: center;
      /deep/.ivu-tag {
        margin-left: 6px;
      }
    }
    .version-item-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
    /deep/ .ivu-divider-horizontal {
      margin: 10px 0;
    }
    .version-feature {
      display: flex;
      align-items: center;
      span {
        margin-left: 6px;
        line-height: 20px;
      }
    }
    &.active {
      background: rgba(2, 167, 240, 0.098);
      border-color: #02a7f0;
      .version-item-title {
        color: rgb(2, 167, 240);
      }
    }
  }
</style>
