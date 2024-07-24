<template>
  <div id="app">
    <BizModalContext>
      <router-view></router-view>
    </BizModalContext>
  </div>
</template>
<script>
  import { setMatchMedia } from 'view-design/src/utils/assist'
  import { keepAliveas } from '@/api/public'
  setMatchMedia()
  export default {
    name: 'app',
    data() {
      return {}
    },
    provide() {
      return {
        reload: this.reload,
      }
    },
    computed: {
      isKeepAlive() {
        return this.$store.state.closeTable
      },
    },
    methods: {
      querykeepAliveas() {
        keepAliveas({}).then(res => {})
      },
      reload() {},
    },
    destroyed() {
      window.clearInterval(this.timer)
    },
    mounted() {
      this.timer = window.setInterval(() => {
        this.querykeepAliveas()
      }, 3000000)
    },
  }
</script>
<style lang="less">
  .mt-10 {
    margin-top: 10px;
  }
  .dFlex {
    display: flex;
  }
  .aItem {
    align-items: center;
  }
  .sbet {
    justify-content: space-between;
  }
  .exceed {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .bor {
    width: 2px;
    height: 14px;
    background: #0372e5;
    margin-right: 10px;
  }
  #app {
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .ivu-poptip-title:after {
    background-color: transparent !important;
  }
  .w200 {
    width: 200px !important;
  }
  .w150 {
    width: 150px;
  }
  .c9 {
    color: #999;
  }
  .c-success {
    color: #21f27f !important;
  }

  .c-danger {
    color: #d83524 !important;
  }

  .c-warning {
    color: #e6a23c;
  }

  .c-primary {
    color: #409eff !important;
  }

  .c-info {
    color: #909399;
  }
  .c-yelo {
    color: #e8ea2a;
  }
  .detailsBtn {
    padding: 0 7px !important;
    border-color: #007eff !important;
    background: rgba(0, 126, 255, 0.1) !important;
  }
  .ml-10 {
    margin-left: 10px;
  }
  .ml-20 {
    margin-left: 20px;
  }
  .mt-20 {
    margin-top: 20px;
  }
  .mr10 {
    margin-right: 10px;
  }
  .b-success {
    color: #21f27f !important;
    background: rgba(0, 186, 138, 0.15);
    border-radius: 5px;
    padding: 5px;
  }
  .b-blueing {
    color: #4e91f0 !important;
    border-radius: 5px;
    margin-left: 5px;
    background: rgba(0, 126, 255, 0.1);
    height: 22px;
    padding: 2px 5px;
  }
  .b-primary {
    background: #007eff !important;
  }
  .b-danger {
    color: #f56c6c !important;
    background: rgba(255, 79, 79, 0.15) !important;
    border-radius: 5px;
    padding: 5px;
  }
  .x-success {
    color: #21f27f !important;
    background: rgba(0, 186, 138, 0.15);
    width: 40px;
    height: 22px;
    padding: 2px 4px 2px 1px;
  }
  .b-warning {
    margin-left: 5px;
    background: #443630;
    color: #e6a23c;
    height: 22px;
    padding: 5px;
  }
  .b-yelo {
    color: #e8ea2a !important;
    background: rgba(232, 234, 42, 0.15) !important;
    border-radius: 5px;
    padding: 5px;
  }

  .b-info {
    color: #909399;
    background: rgba(144, 147, 153, 0.15);
    border-radius: 5px;
    padding: 5px;
  }
  .pointer,
  i {
    cursor: pointer;
  }
  .b-olg {
    background: rgba(255, 168, 84, 0.1) !important;
    border: 1px solid #ffa854 !important;
    color: #ffa854 !important;
  }
  .b-dger {
    color: #f56c6c !important;
    background: rgba(255, 79, 79, 0.15) !important;
    border: 1px solid #f24e4c !important;
  }
  .b-blue {
    color: #007eff !important;
    border: 1px solid #007eff !important;
    background: rgba(0, 126, 255, 0.1) !important;
  }
  .b-gre {
    color: #21f27f !important;
    border: 1px solid #21f27f !important;
    background: rgba(33, 242, 127, 0.1) !important;
  }
  .c-default {
    color: #fff;
    &:hover {
      color: #409eff !important;
    }
  }
  .cp {
    cursor: pointer;
  }
  .fw {
    font-weight: 600;
  }
  .danger-text {
    color: #ff5722 !important;
  }
  .danger-pra {
    color: #007eff !important;
  }
  .dangers-text {
    background: rgba(255, 79, 79, 0.15) !important;
    padding: 5px;
    color: #ff5722;
  }

  .normal-text {
    color: #5fb878;
  }
  .normals-text {
    background: rgba(0, 186, 138, 0.15);
    padding: 5px;
    color: #5fb878;
  }

  // 日月按钮
  .dateBnt {
    position: relative;
    right: 30px;
    button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      line-height: 30px;
      border: none;
      color: #fff;
      padding: 0 8px;
    }
    .dayCirc {
      background: #19be6b;
      border-color: #19be6b;
    }
    .monthCirc {
      background: #ccc !important;
      border-color: #ccc !important;
    }
  }
  .content {
    background: #1a202e;
  }
  i {
    font-style: normal;
  }
  .export {
    color: #007eff !important;
    border: 1px solid #007eff !important;
    padding: 0 4px !important;
    background: rgba(0, 126, 255, 0.1) !important;
    border-radius: 5px;
    margin-left: 10px;
    i {
      font-size: 22px;
    }
  }
  .wp {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .systemBody {
    background: #1a202e;
    padding: 16px;
  }
</style>
