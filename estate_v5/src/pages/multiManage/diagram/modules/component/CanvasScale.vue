<template>
  <div class="canvas-scale">
    <div class="zoom-out zoom-box" :class="$store.state.diagram.editorScale === 50 && 'disabled'" @click.stop="zoomSize(1)">
      <Icon custom="icon-v5 icon-v5-line-v" class="zoom-out-icon zoom-box-icon"></Icon>
    </div>
    <Dropdown @on-click="scaleClick">
      <div class="zoom-val">
        {{ $store.state.diagram.editorScale }}%
        <Icon custom="icon-v5 icon-v5-backt" class="zoom-val-icon"></Icon>
      </div>
      <template #list>
        <DropdownMenu>
          <DropdownItem name="1">{{ $t('reset') }}</DropdownItem>
          <DropdownItem name="2">{{ $t('zoomToFitAllContent') }}</DropdownItem>
          <Divider />
          <DropdownItem name="500">500%</DropdownItem>
          <DropdownItem name="400">400%</DropdownItem>
          <DropdownItem name="300">300%</DropdownItem>
          <DropdownItem name="200">200%</DropdownItem>
          <DropdownItem name="100">100%</DropdownItem>
          <DropdownItem name="50">50%</DropdownItem>
          <DropdownItem name="10">10%</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
    <div class="zoom-in zoom-box" :class="$store.state.diagram.editorScale === 300 && 'disabled'" @click.stop="zoomSize(2)">
      <Icon custom="icon-v5 icon-v5-addtwo" class="zoom-box-icon"></Icon>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    data() {
      return {}
    },
    methods: {
      ...mapMutations('diagram', ['setEditorScale']),
      onScale(val) {
        this.setEditorScale(val)
        window.meta2d && window.meta2d.canvas && window.meta2d.scale(val / 100)
      },
      zoomSize(type) {
        if (type === 1) {
          if (this.$store.state.diagram.editorScale <= 10) {
            return
          }
          this.$store.state.diagram.editorScale -= 10
        } else {
          if (this.$store.state.diagram.editorScale >= 1000) {
            return
          }
          this.$store.state.diagram.editorScale += 10
        }
        window.meta2d && window.meta2d.canvas && window.meta2d.scale(this.$store.state.diagram.editorScale / 100)
      },
      scaleClick(val) {
        switch (val) {
          case '1':
            this.onScale(100)
            return window.meta2d.centerView()
          case '2':
            return window.meta2d.fitView()
          default:
            return this.onScale(Number(val))
        }
      },
    },
    mounted() {},
  }
</script>

<style lang="less" scoped>
  :deep(.ivu-divider-horizontal) {
    margin: 8px 0;
  }
  .canvas-scale {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    z-index: 6;
    width: 180px;
    height: 45px;
    border-radius: 4px;
    border: 1px solid #424b5f;
    background: #1a202e;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    user-select: none;
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.13);
    .zoom-out-icon {
      transform: rotate(90deg);
    }
    .zoom-box {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
      cursor: pointer;
    }
    .zoom-out {
      border-right: 1px solid #424b5f;
    }
    .zoom-in {
      border-left: 1px solid #424b5f;
    }
    .zoom-box-icon {
      font-size: 24px;
    }
    .zoom-box:hover {
      .zoom-box-icon {
        color: #007eff;
      }
    }
    .zoom-box:active {
      background: ~'rgba(54, 194, 188, .1)';
    }
    .zoom-val {
      flex: 1;
      text-align: center;
      cursor: pointer;
    }
    .zoom-val-icon {
      transform: rotate(270deg);
    }
  }
</style>
