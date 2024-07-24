<template>
  <div class="canvas-menu">
    <div class="configuration-header-menu" @click.stop="undo">
      <Icon custom="icon-v5 icon-v5-back1" />
      <div class="configuration-header-menu-text">{{ $t('revoke') }}</div>
    </div>
    <div class="configuration-header-menu" @click.stop="redo">
      <Icon custom="icon-v5 icon-v5-next" />
      <div class="configuration-header-menu-text">{{ $t('redo') }}</div>
    </div>
    <div class="split-line"></div>
    <div class="configuration-header-menu active" @click.stop="selectHandle">
      <Icon custom="icon-v5 icon-v5-move-one" />
      <div class="configuration-header-menu-text">{{ $t('selectWithShortcutKey') }}</div>
    </div>
    <div class="configuration-header-menu" :class="{ active: isPenActive }" @click.stop="onTogglePen">
      <Icon custom="icon-v5 icon-v5-pen" />
      <div class="configuration-header-menu-text">{{ $t('penWithShortcutKey') }}</div>
    </div>
    <div class="configuration-header-menu" :class="{ active: isPencilActive }" @click.stop="onTogglePencil">
      <Icon custom="icon-v5 icon-v5-pencil" />
      <div class="configuration-header-menu-text">{{ $t('pencil') }}</div>
    </div>
    <Dropdown @on-click="lineClick">
      <div class="configuration-header-menu">
        <Icon :custom="`icon-v5 ${LineType[lineTypeCode].icon}`" />
        <div class="configuration-header-menu-text">{{ LineType[lineTypeCode].text || $t('connectionLine') }}</div>
      </div>
      <template #list>
        <DropdownMenu>
          <DropdownItem :name="item" v-for="(item, index) in Object.keys(LineType)" :class="{ active: item === lineTypeCode }" :key="index">
            <Icon :custom="`icon-v5 ${LineType[item].icon}`" />
            {{ LineType[item].text }}
          </DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
    <div class="configuration-header-menu" :class="{ active: isMagnifierActive }" @click.stop="onToggleMagnifier">
      <Icon custom="icon-v5 icon-v5-search" />
      <div class="configuration-header-menu-text">{{ $t('magnifier') }}</div>
    </div>
    <div class="configuration-header-menu" :class="{ active: isShowMap }" @click.stop="openMap">
      <Icon custom="icon-v5 icon-v5-thumbnail" />
      <div class="configuration-header-menu-text">{{ $t('thumbnail') }}</div>
    </div>
  </div>
</template>

<script>
  import { LineType } from '../util/process'
  export default {
    data() {
      return {
        isPenActive: false,
        isPencilActive: false,
        isMagnifierActive: false,
        isShowMap: false,
        lineTypeCode: 'polyline',
        LineType: LineType,
      }
    },
    methods: {
      // 撤销
      undo() {
        window.meta2d.undo()
      },
      //  重做
      redo() {
        window.meta2d.redo()
      },
      selectHandle() {
        // 取消钢笔
        this.cancelPen()
        // 取消铅笔
        this.cancelPencil()
        // 取消放大镜
        window.meta2d && window.meta2d.hideMagnifier()
        this.isMagnifierActive = false
        // // 取消缩略图
        // if (window.meta2d && window.meta2d.map && window.meta2d.map.isShow) {
        //   this.isShowMap = false
        //   window.meta2d.hideMap()
        // }
        // const canvasDom = document.getElementById('editor-canvas')
        // // 创建鼠标点击事件
        // const event = new MouseEvent('click', {
        //   clientX: x,
        //   clientY: y,
        // })
        // debugger
        // // 触发点击事件
        // canvasDom.dispatchEvent(event)
      },
      onTogglePen() {
        this.isPenActive = !this.isPenActive
        if (this.isPenActive) {
          this.usePen()
          this.cancelPencil()
        } else {
          this.cancelPen()
        }
      },
      usePen() {
        this.isPenActive = true
        window.meta2d.drawLine(this.lineTypeCode)
      },
      cancelPen() {
        this.isPenActive = false
        window.meta2d.drawLine()
        window.meta2d.finishDrawLine()
      },
      onTogglePencil() {
        this.isPencilActive = !this.isPencilActive
        if (this.isPencilActive) {
          this.usePencil()
          this.cancelPen()
        } else {
          this.cancelPencil()
        }
      },
      usePencil() {
        this.isPencilActive = true
        window.meta2d.drawingPencil()
      },
      cancelPencil() {
        this.isPencilActive = false
        window.meta2d.stopPencil()
        window.meta2d.finishPencil()
      },
      lineClick(type) {
        if (this.lineTypeCode === type) {
          this.lineTypeCode = 'polyline'
        } else if (window.meta2d) {
          this.lineTypeCode = type
          window.meta2d.store.options.drawingLineName = type
          window.meta2d.canvas.drawingLineName && (window.meta2d.canvas.drawingLineName = type)
          window.meta2d.store.active &&
            window.meta2d.store.active.forEach(pen => {
              window.meta2d.updateLineType(pen, type)
            })
          window.meta2d.render()
        }
      },
      onToggleMagnifier() {
        this.isMagnifierActive = !this.isMagnifierActive
        this.isMagnifierActive ? window.meta2d.showMagnifier() : window.meta2d.hideMagnifier()
      },
      openMap() {
        if (window.meta2d.map && window.meta2d.map.isShow) {
          this.isShowMap = false
          window.meta2d.hideMap()
        } else {
          this.isShowMap = true
          window.meta2d.showMap()
        }
      },
      onkeydown(e) {
        if (e.key.toLocaleLowerCase() === 'v') {
          return this.selectHandle()
        }
        if (e.key.toLocaleLowerCase() === 'p') {
          return this.usePen()
        }
        if (e.ctrlKey && e.key.toLocaleLowerCase() === 'e') {
          return this.usePen()
        }
      },
    },
    mounted() {
      window.addEventListener('keydown', this.onkeydown)
    },
    destroyed() {
      window.removeEventListener('keydown', this.onkeydown)
    },
  }
</script>

<style lang="less" scoped>
  .canvas-menu {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translate(-50%, 0px);
    display: flex;
    z-index: 6;
    height: 45px;
    font-size: 12px;
    background: #1a202e;
    padding: 0px 8px;
    border-radius: 4px;
    border: 1px solid #424b5f;
    align-items: center;
    box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.13);
    .split-line {
      margin-left: 8px;
      margin-right: 8px;
      background: #424b5f;
      height: 20px;
      width: 1px;
      margin-top: 10px;
    }
    .configuration-header-menu.active {
      color: #007eff;
    }
    .configuration-header-menu {
      color: #fff;
      margin-left: 5px;
      margin-right: 5px;
      cursor: pointer;
      user-select: none;
      text-align: center;
      &:hover,
      &:active {
        color: #007eff;
      }
      .configuration-header-menu-text {
        white-space: nowrap;
      }
    }
    /deep/ .ivu-dropdown-item:hover,
    /deep/.ivu-dropdown-item.active {
      color: #007eff;
    }
  }
</style>
