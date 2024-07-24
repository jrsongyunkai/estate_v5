<template>
  <div class="canvas-wrapper" ref="canvasWrapper">
    <div id="editor-canvas"></div>
    <ContextMenu v-if="editable" :visible.sync="showContextmenu" :x="positionX" :y="positionY" :menu-list="contextmenuList" @menuClick="onContextMenuClick" />
    <CanvasMenu v-if="editable" ref="canvasMenu" />
    <CanvasScale v-if="editable || isLook" />
    <DeviceTooltip v-if="deviceInfo" ref="deviceTooltip" :deviceInfo="deviceInfo" :hideLookDevice="hideLookDevice" :style="tooltipStyle" />
  </div>
</template>

<script>
  import { EditorActiveType } from '../util/process'
  import { LockState, Meta2d } from '@meta2d/core'
  import { formPens, formPath2DPens } from '@meta2d/form-diagram'
  import { flowPens } from '@meta2d/flow-diagram'
  import { activityDiagram, activityDiagramByCtx } from '@meta2d/activity-diagram'
  import { sequencePens, sequencePensbyCtx } from '@meta2d/sequence-diagram'
  import { classPens } from '@meta2d/class-diagram'
  import { ud } from '../util/special'
  import ContextMenu from './ContextMenu.vue'
  import CanvasMenu from './CanvasMenu.vue'
  import CanvasScale from './CanvasScale.vue'
  import DeviceTooltip from './modules/DeviceTooltip.vue'
  import store from '@/store/index'
  export default {
    components: { CanvasMenu, ContextMenu, CanvasScale, DeviceTooltip },
    props: {
      editable: { type: Boolean, default: true },
      isLook: { type: Boolean, default: false },
      hideLookDevice: { type: Boolean, default: false },
    },
    data() {
      return {
        showContextmenu: false,
        positionX: 0,
        positionY: 0,
        contextmenuList: [],
        deviceInfo: null,
        tooltipStyle: null,
      }
    },
    methods: {
      initMeta2d() {
        const options = {
          fontFamily: 'Arial, "Microsoft YaHei"',
          rotateCursor: '/rotate.cur',
        }
        // eslint-disable-next-line no-new
        new Meta2d('editor-canvas', options)
        window.meta2d.setBackgroundColor('#1a202e')
        window.meta2d.store.options.color = '#ffffff'
        window.meta2d.store.options.drawingLineName = 'polyline'
        // 注册表单
        window.meta2d.registerCanvasDraw(formPens())
        window.meta2d.register(formPath2DPens())
        // 注册流程图
        window.meta2d.register(flowPens())
        //  注册活动图元
        window.meta2d.register(activityDiagram())
        window.meta2d.registerCanvasDraw(activityDiagramByCtx())
        // 注册时序图
        window.meta2d.register(sequencePens())
        window.meta2d.registerCanvasDraw(sequencePensbyCtx())
        // 注册类图
        window.meta2d.register(classPens())
        if (window.meta2dTools) {
          window.registerToolsNew()
        }
        window.meta2d.registerCanvasDraw(ud())

        this.$emit('init')
      },
      onOpenContextMenu(event) {
        const { e } = event
        this.positionX = e.clientX
        this.positionY = e.clientY
        const { active, histories, historyIndex } = window.meta2d.store
        const activePens = active.filter(v => v.locked !== 10)
        const len = activePens.length
        const hisLen = histories.length
        this.contextmenuList = [
          { type: 'menu-item', icon: 'el-icon-upload2', title: this.$t('topping'), value: 'top', shortcut: '', disabled: len === 0, visible: true },
          { type: 'menu-item', icon: 'el-icon-download', title: this.$t('placedBottom'), value: 'bottom', shortcut: '', disabled: len === 0, visible: true },
          { type: 'menu-item', icon: 'el-icon-top', title: this.$t('previousLayer'), value: 'up', shortcut: '', disabled: len === 0, visible: true },
          { type: 'menu-item', icon: 'el-icon-bottom', title: this.$t('nextLayer'), value: 'down', shortcut: '', disabled: len === 0, visible: true },
          { type: 'split-line' },
          { type: 'menu-item', icon: 'el-icon-connection', title: this.$t('combination'), value: 'combine', shortcut: '', disabled: len < 2, visible: true },
          { type: 'menu-item', icon: 'el-icon-copy-document', title: this.$t('ungroup'), value: 'uncombine', shortcut: '', disabled: len !== 1 || (activePens[0].children && activePens[0].children.length < 2), visible: true },
          { type: 'split-line' },
          { type: 'menu-item', icon: 'el-icon-lock', title: this.$t('lock'), value: 'lock', shortcut: '', disabled: len === 0 || (len > 0 && activePens[0].locked), visible: true },
          { type: 'menu-item', icon: 'el-icon-unlock', title: this.$t('unlock'), value: 'unlock', shortcut: '', disabled: len === 0 || (len > 0 && !activePens[0].locked), visible: true },
          { type: 'split-line' },
          { type: 'menu-item', icon: 'el-icon-delete', title: this.$t('delete'), value: 'remove', shortcut: 'Del', disabled: len === 0, visible: true },
          { type: 'split-line' },
          { type: 'menu-item', icon: 'el-icon-delete', title: this.$t('revoke'), value: 'undo', shortcut: 'Ctrl + Z', disabled: hisLen === 0 || historyIndex < 0, visible: true },
          { type: 'menu-item', icon: 'el-icon-delete', title: this.$t('redo'), value: 'redo', shortcut: 'Shift + Z', disabled: hisLen > 0 && historyIndex === hisLen - 1, visible: true },
          { type: 'split-line' },
          { type: 'menu-item', icon: 'el-icon-document-copy', title: this.$t('copy'), value: 'copy', shortcut: 'Ctrl + C', disabled: len === 0, visible: true },
          { type: 'menu-item', icon: 'el-icon-tickets', title: this.$t('paste'), value: 'paste', shortcut: 'Ctrl + V', disabled: false, visible: true },
          { type: 'menu-item', icon: 'el-icon-scissors', title: this.$t('shear'), value: 'cut', shortcut: 'Ctrl + X', disabled: len === 0, visible: true },
        ]
        this.showContextmenu = true
        // 清理选择的笔
        this.$refs.canvasMenu.selectHandle()
      },
      onClick(pen, e) {
        // 根据自己的需求实现
        this.showContextmenu = false
      },
      onResize() {
        window.meta2d.resize()
      },
      onContextMenuClick(type) {
        this.showContextmenu = false
        const activePens = window.meta2d.store.active.filter(v => v.locked !== 10)
        const pen = activePens[0]
        switch (type) {
          case 'top':
            activePens && window.meta2d.top(activePens)
            break
          case 'bottom':
            activePens && window.meta2d.bottom(activePens)
            break
          case 'up':
            activePens && window.meta2d.up(activePens)
            break
          case 'down':
            activePens && window.meta2d.down(activePens)
            break
          case 'combine':
            window.meta2d.combine(activePens)
            break
          case 'uncombine':
            pen && pen.name === 'combine' && window.meta2d.uncombine(pen)
            break
          case 'lock':
            if (activePens.length > 0) {
              activePens.forEach(pen => {
                window.meta2d.setValue({ id: pen.id, locked: LockState.DisableMoveScale }, { render: false, history: true })
              })
              window.meta2d.render()
            }
            break
          case 'unlock':
            if (activePens.length > 0) {
              activePens.forEach(pen => {
                window.meta2d.setValue({ id: pen.id, locked: LockState.None }, { render: false, history: true })
              })
              window.meta2d.render()
            }
            break
          case 'remove':
            activePens.length > 0 && window.meta2d.delete(activePens)
            break
          case 'undo':
            window.meta2d.undo()
            break
          case 'redo':
            window.meta2d.redo()
            break
          case 'copy':
            window.meta2d.copy()
            break
          case 'cut':
            window.meta2d.cut()
            break
          case 'paste':
            window.meta2d.paste()
            break
          default:
            break
        }
      },
      initEventListener() {
        this.observeCanvasWrapper = new ResizeObserver(this.onResize)
        this.observeCanvasWrapper.observe(this.$refs.canvasWrapper)
        window.meta2d.on('scale', number => {
          store.commit('diagram/setEditorScale', Math.round(number * 100))
        })
        if (this.editable) {
          window.meta2d.on('add', () => {
            window.meta2d.emit('pensTreeChange')
          })
          window.meta2d.on('update', () => {
            window.meta2d.emit('pensTreeChange')
            const activePens = window.meta2d.canvas.store.active
            if (activePens.length) {
              const rect = window.meta2d.getPenRect(activePens[0])
              activePens.length === 1 &&
                store.commit('diagram/setCurrentPenRect', {
                  x: Math.round(rect.x * 10) / 10,
                  y: Math.round(rect.y * 10) / 10,
                  width: Math.round(rect.width * 10) / 10,
                  height: Math.round(rect.height * 10) / 10,
                })
            }
          })
          window.meta2d.on('delete', () => {
            window.meta2d.emit('pensTreeChange')
          })
          window.meta2d.on('contextmenu', this.onOpenContextMenu)
          document.addEventListener('contextmenu', this.preventDefault, false)
        }
        window.meta2d.on('active', pens => {
          store.commit('diagram/setActivePens', [...pens.map(it => it.id)])
          let activePenType = pens.length === 0 ? EditorActiveType.CanvasActive : pens.length > 1 ? EditorActiveType.CombineActive : EditorActiveType.PenActive
          store.commit('diagram/setEditorActiveType', activePenType)
          window.meta2d.emit('pensTreeChange')
        })

        window.meta2d.on('inactive', () => {
          store.commit('diagram/setActivePens', [])
          store.commit('diagram/setEditorActiveType', EditorActiveType.CanvasActive)
          window.meta2d.emit('pensTreeChange')
        })
        window.meta2d.on('click', this.onClick)
      },
      preventDefault(e) {
        e.preventDefault()
      },
      tooltipOpen(event) {
        if (this.tooltipTimer) {
          clearTimeout(this.tooltipTimer)
        }
        this.tooltipTimer = setTimeout(() => {
          this.tooltipOpenTime(event)
        }, 30)
      },
      tooltipOpenTime(event) {
        if (this.deviceInfo) return
        const rect = this.$refs.canvasWrapper.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.top
        this.tooltipStyle = { left: `${x}px`, top: `${y}px`, display: 'block' }
      },
    },
    mounted() {
      this.initMeta2d()
      this.initEventListener()
      this.$nextTick(() => {
        this.onResize()
      })
    },
    created() {
      store.commit('diagram/setActivePens', [])
      window.enterDeviceShowTip = pen => {
        if (pen && pen.deviceName) {
          this.deviceInfo = pen
          this.$refs.canvasWrapper.addEventListener('mousemove', this.tooltipOpen)
        }
      }
      window.leaveDeviceHideTip = pen => {
        if (pen && pen.deviceName) {
          this.$refs.canvasWrapper.removeEventListener('mousemove', this.tooltipOpen)
          this.deviceInfo = null
        }
      }
    },
    destroyed() {
      this.observeCanvasWrapper.disconnect()
      this.observeCanvasWrapper = null
      window.removeEventListener('contextmenu', this.preventDefault)
      window.meta2d.destroy()
      window.meta2d = null
      delete window.enterDeviceShowTip
      delete window.leaveDeviceHideTip
    },
  }
</script>

<style lang="less" scoped>
  .canvas-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
  #editor-canvas {
    width: 100%;
    height: 100%;
  }
</style>
<style lang="less">
  #editor-canvas {
    .meta2d-map {
      border: 1px solid #424b5f;
    }
  }
</style>
