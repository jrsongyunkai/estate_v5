<template>
  <span class="i-layout-menu-side-title" :class="{ 'i-layout-menu-side-title-with-collapse': collapse }">
    <span class="i-layout-menu-side-title-icon" :class="{ 'i-layout-menu-side-title-icon-single': hideTitle }" v-if="withIcon">
      <Icon :type="menu.icon" v-if="menu.icon" />
      <Icon :custom="menu.custom" v-else-if="menu.custom" />
      <img :src="menu.img" v-else-if="menu.img" />
    </span>
    <span class="i-layout-menu-side-title-text" :class="{ 'i-layout-menu-side-title-text-selected': selected, 'i-layout-menu-side-title-text-with-subtitle': menu.subtitle, 'i-layout-menu-side-title-text-with-icon': withIcon }" v-if="!hideTitle" :title="tTitle(menu.title)">
      {{ tTitle(menu.title) }}
      <em v-if="menu.subtitle" :title="tTitle(menu.title)">{{ tTitle(menu.subtitle) }}</em>
    </span>
    <!-- <span v-if="menu.path === '/safetyMonitor'" class="setup" @click.stop="handleSetup"><i class="icon-v5 icon-v5-shezhi"></i> </span> -->
  </span>
  <!-- <Modal
        class="setWindow"
        v-model="showWind"
        :mask="false"
        width="300px"
        title="设置显示/隐藏项">
        <Checkbox>$t('system.Indeterminate')</Checkbox>
        <CheckboxGroup>
            <Checkbox label="测试"></Checkbox>
            <Checkbox label="测试"></Checkbox>
            <Checkbox label="测试"></Checkbox>
        </CheckboxGroup>
    </Modal> -->
</template>
<script>
  import tTitle from '../mixins/translate-title'
  export default {
    name: 'iMenuSideTitle',
    mixins: [tTitle],
    props: {
      menu: {
        type: Object,
        default() {
          return {}
        },
      },
      hideTitle: {
        type: Boolean,
        default: false,
      },
      // 用于侧边栏收起 Dropdown 当前高亮
      selected: {
        type: Boolean,
        default: false,
      },
      // 侧边栏折叠状态
      collapse: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        showWind: false,
      }
    },
    computed: {
      withIcon() {
        return this.menu.icon || this.menu.custom || this.menu.img
      },
    },
    methods: {
      handleSetup() {
        this.showWind = !this.showWind
      },
    },
    mounted() {},
  }
</script>
<style lang="less" scoped>
  .setup {
    position: absolute;
    right: 30px;
    z-index: 999;
  }
  .i-layout-menu-side-title {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /deep/.ivu-modal {
    left: 210px;
    top: 200px;
    margin: 0;
    position: relative;
    top: 200px;
    header {
      padding: 10px;
      div,
      span {
        color: #898a8c;
      }
    }
  }
</style>
