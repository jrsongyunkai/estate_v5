<template>
  <div class="areaConfig">
    <div class="leftArea">
      <div class="header">
        <h2>{{ $t('mapAreaConfiguration') }}</h2>
        <div class="Button">
          <Checkbox v-model="single" @on-change="handleCheck">{{ $t('customizeMaps') }}</Checkbox>
          <Upload style="display: inline-block" :action="uploadUrl" ref="upload" name="img" :data="imgData" :on-success="handleSuccess" :before-upload="handleBefore" :show-file-list="false" :show-upload-list="false">
            <Button type="primary">{{ $t('importUnderlay') }}</Button>
          </Upload>
        </div>
      </div>
      <div class="tip" v-if="clone">
        <i class="icon-v5 icon-v5-huifu"></i>
        <span>{{ $t('customTips') }}</span>
        <div class="close" @click="clone = false">x</div>
      </div>
      <div class="content">
        <div class="mapArea" v-show="single">
          <div class="mapBigArea" :style="value" ref="maskBox" @mousedown="onmousedown($event)" @mouseup="onmouseup($event)" @mousemove="onmousemove" @mouseout="onmouseout" @drop="drop($event)" @dragover="allowDrop($event)">
            <template v-for="item in list">
              <vue-drag-resize :h="60" :x="item.offsetX" :y="item.offsetY" :parentLimitation="true" :isActive="true" :isDraggable="true" :aspectRatio="true" :isResizable="false" v-on:dragstop="resize($event, item)" :key="item.id">
                <div class="custom_node_initial" @mouseenter.stop.prevent>
                  <span>{{ item.text }}</span>
                  <i class="close" @click.stop="handledelNode(item.mac)">x</i>
                </div>
              </vue-drag-resize>
            </template>
          </div>
        </div>
        <div v-show="!single" class="map">
          <projectmap2 :height="mapAreaHeight" />
          <span v-if="tip">{{ $t('importImage') }}</span>
        </div>
      </div>
    </div>
    <div class="rightArea" v-show="single">
      <div class="header">
        <h2>{{ $t('deviceList') }}</h2>
      </div>
      <div class="menu-list">
        <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll(macList)">
          {{ $t('selectAll') }}
        </Checkbox>
        <Checkbox v-for="item in macList" :key="item.mac" ref="macRef" :value="item.check" :label="item.name" @on-change="checkAllGroupChange(item, $event)">
          <span :id="item.mac" draggable="true" @dragstart="drag($event, item.mac)">
            {{ `${item.name}` }}
          </span>
        </Checkbox>
        <Page :current="currentPage" :total="total" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changesize" />
      </div>
    </div>
  </div>
</template>
<script>
  import projectmap2 from '@/pages/console/project/projectMap2.vue'
  import { getConfigInfo, getMapData, pageQueryDevice, setMapData, delMapData, setStatus } from '@/api/public'
  import VueDragResize from 'vue-drag-resize'
  export default {
    components: { projectmap2, VueDragResize },
    computed: {
      childSize() {
        return 0.8 / this.size
      },
    },
    data() {
      return {
        mapAreaHeight: '720px',
        currentPage: 1,
        total: 0,
        page: 1,
        pageSize: 20,
        checkAll: false,
        single: false,
        clone: true,
        indeterminate: true,
        macData: [],
        macList: [],
        uploadUrl: '/boxCustomMap/uploadImg.as?projectCode=' + this.$store.state.projectCode + '&name=' + 'img',
        imgData: { imgFile: 'img' },
        list: [],
        mapElem: document.getElementsByClassName('map')[0],
        moveDistance: {},
        flag: false,
        tip: false,
        animation: { x: 100, y: 100, scale: 1, duration: 0 },
        value: '',
        newArr: [],
        rectState: false,
        infoImage: '',
        newRect: false,
      }
    },
    mounted() {
      // // 兼容火狐浏览器
      this.mousewheelevt = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel'
      // // 为空间区域绑定鼠标滚轮事件 =》 处理函数是wheelHandle
      // // 如果你监听了window的scroll或者touchmove事件，你应该把passive设置为true，这样滚动就会流畅很多
      this.$refs.maskBox.addEventListener(this.mousewheelevt, this.onwheel)
      // this.mapElem.addEventListener(this.mousewheelevt, this.onwheel)
      // this.setMapStyle(this.animation)
      this.handleDrawing()
      this.handlepageQueryDevice()
      setTimeout(() => {
        this.handlegetNode()
      }, 500)
    },
    beforeDestroy() {
      // 取消监听
      this.$refs.maskBox.removeEventListener(this.mousewheelevt, this.onwheel)
    },
    watch: {
      newRect: {
        handler(newVal, oldVal) {
          if (newVal.left === oldVal.left) {
            this.rectState = true
          } else {
            this.rectState = false
          }
        },
      },
    },
    methods: {
      async handlepageQueryDevice() {
        let params = { projectCode: this.$store.state.projectCode, equipmentTypes: 'all', pageNo: this.page, pageSize: this.pageSize }
        const res = await pageQueryDevice(params)
        this.total = res.total
        this.macList = res.datas
        this.macList.map(val => (val['type'] = 'logic'))
        this.macList.map(val => (val['check'] = false))
      },
      changesize(val) {
        this.pageSize = val
        this.handlepageQueryDevice()
      },
      changePage(val) {
        this.page = val
        this.handlepageQueryDevice()
        setTimeout(() => {
          this.handlegetNode()
        }, 500)
      },
      handleCheckAll(list) {
        let nodeData = []
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false
        list.map(val => {
          nodeData.push(val.mac)
        })
        if (this.checkAll) {
          this.handleSetAll(nodeData)
        } else {
          this.handledelNode(nodeData)
        }
      },
      handleSetAll(mac) {
        let params = { projectCode: this.$store.state.projectCode, macs: `${mac}`, offsetX: 150, offsetY: 150 }
        setMapData(params).then(res => {
          this.handlegetNode()
        })
      },
      checkAllGroupChange(item, event) {
        let newList = []
        let obj = {}
        if (event) {
          if (this.list.length > 0) {
            newList = this.list
            newList.map(val => {
              if (val.mac !== item.mac) {
                obj = { mac: item.mac, text: item.name, offsetX: 150, offsetY: 150 }
              }
            })
            this.list.push(obj)
            this.handlesetNode(obj)
            setTimeout(() => {
              this.handlegetNode()
            }, 1000)
          } else {
            obj = { mac: item.mac, text: item.name, offsetX: 150, offsetY: 150 }
            this.list.push(obj)
            this.handlesetNode(obj)
          }
        } else {
          this.list.forEach((val, index) => {
            if (val.mac === item.mac) {
              this.handledelNode(val.mac)
              this.list.splice(index, 1)
            }
          })
          setTimeout(() => {
            this.handlegetNode()
          }, 500)
        }

        if (this.list.length === 20) {
          this.indeterminate = false
          this.checkAll = true
        } else if (this.list.length < 20) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.checkAll = false
          this.indeterminate = false
        }
      },
      handleDrawing() {
        let params = {
          projectCode: this.$store.state.projectCode,
        }
        getConfigInfo(params).then(res => {
          if (res.success) {
            this.infoImage = res.data.imgUrl
            this.value = {
              background: `url(${res.data.imgUrl})`,
            }
            this.single = res.data.status === 1
            res.data.imgUrl === '' ? (this.tip = true) : (this.tip = false)
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleBefore(file) {
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
          this.$Message.error({
            content: this.$t('exceedSize'),
          })
        } else {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function (event) {
            let img = new Image()
            img.src = event.target.result
            img.onload = () => {
              this.nWidth = img.width
              this.nHeight = img.height
            }
          }
        }
        return isLt1M
      },
      handleSuccess(response, file, fileList) {
        if (response.success) {
          this.handleDrawing()

          this.$Message.success({
            content: response.message,
          })
        } else {
          this.$Message.error({
            content: response.message,
          })
        }
      },
      handleCheck(item) {
        this.single = item

        let params = {
          projectCode: this.$store.state.projectCode,
          status: item ? 1 : 0,
        }
        setStatus(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: res.message,
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      // 允许放下拖拽
      allowDrop(ev) {
        ev.preventDefault()
      },
      // 拖拽
      drag(ev, id) {
        this.id = id
        this.dom = ev.currentTarget.cloneNode(true)
      },
      // 放下事件
      drop(ev) {
        ev.preventDefault()
        this.list.push({
          mac: this.dom.id,
          text: this.dom.innerText,
          offsetX: 150,
          offsetY: 150,
        })
        let item = {
          mac: this.dom.id,
          offsetX: 150,
          offsetY: 150,
        }
        this.handlesetNode(item)
        setTimeout(() => {
          this.handlegetNode()
        }, 500)
      },
      // 拖拽时事件
      resize(newRect, item) {
        this.newRect = newRect
        if (this.time !== null) {
          clearTimeout(this.time)
        }

        this.time = setTimeout(() => {
          if (!this.rectState) {
            this.handlesetNode(item)
          }
        }, 500)
        this.list.forEach(val => {
          if (item.mac === val.mac) {
            val.offsetX = newRect.left
            val.offsetY = newRect.top
          }
        })
      },
      // 上传拖拽时节点坐标
      handlesetNode(item) {
        let params = {
          projectCode: this.$store.state.projectCode,
          macs: item.mac,
          offsetX: item.offsetX,
          offsetY: item.offsetY,
        }
        setMapData(params).then(res => {})
      },
      setStyle(elem, obj) {
        this.value = obj
      },
      handlegetNode() {
        let params = {
          projectCode: this.$store.state.projectCode,
        }
        getMapData(params).then(res => {
          this.list = []

          res.data.map(val => {
            this.list.push({
              mac: val.mac,
              text: val.name,
              offsetX: val.offsetX,
              offsetY: val.offsetY,
            })
          })

          this.list.map(vals => {
            this.macList.map(val => {
              if (vals.mac === val.mac) {
                val.check = true
              }
            })
          })
          this.macList = this.macList
        })
      },
      // 获取元素相对于目标元素的 offsetTop offsetLeft
      getElementTopLeft(elem, target) {
        if (elem === target) {
          return {
            top: 0,
            left: 0,
          }
        }

        target || (target = null)
        let elemTop = elem.offsetTop
        let elemLeft = elem.offsetLeft

        elem = elem.offsetParent
        if (elem !== target) {
          elemTop += elem.offsetTop
          elemLeft += elem.offsetLeft

          elem = elem.offsetParent
        }

        return {
          top: elemTop,
          left: elemLeft,
        }
      },
      // 删除数据
      handledelNode(item) {
        let params = {
          projectCode: this.$store.state.projectCode,
          macs: Array.isArray(item) ? `${item}` : item,
        }
        delMapData(params).then(res => {
          if (res.success) {
            this.rectState = true
            this.macList.map(val => (val['check'] = false))
            setTimeout(() => {
              this.handlegetNode()
            }, 500)

            this.$Message.success({
              content: this.$t('removedDeviceLocation'),
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      setMapStyle(obj) {
        let x = obj.x
        let y = obj.y
        let scale = obj.scale
        let duration = obj.duration

        this.setStyle(this.mapElem, {
          'transform-origin': '0px 0px',
          transition: `all ${duration / 1000}s ease-out 0s`,
          transform: `translate3d(${x}px, ${y}px, 0px) scale3d(${scale}, ${scale}, 1)`,
          background: `url(${this.infoImage})`,
        })
      },

      // 鼠标按钮被按下
      onmousedown(event) {
        // 0 为鼠标左键
        if (event.button === 0) {
          this.flag = true
          // clientX 鼠标指针相对于浏览器页面左边的水平坐标
          this.moveDistance = {
            x: event.clientX - this.animation.x,
            y: event.clientY - this.animation.y,
          }
        }
      },
      // 鼠标按键被松开
      onmouseup(event) {
        // 0 为鼠标左键
        if (event.button === 0) {
          this.flag = false
        }
      },

      // 鼠标被移动
      onmousemove(event) {
        if (this.flag) {
          let left = event.clientX - this.moveDistance.x
          let top = event.clientY - this.moveDistance.y

          this.animation = {
            x: left,
            y: top,
            scale: this.animation.scale,
            duration: 0,
          }

          this.setMapStyle(this.animation)
        }
      },

      // 鼠标移出
      onmouseout(event) {
        let mapIndex = event.path.findIndex(f => f === this.mapElem)
        let targetIndex = event.path.findIndex(f => f === event.relatedTarget)
        if (targetIndex > mapIndex) {
          this.flag = false
        }
      },

      // 鼠标滚轮
      onwheel(event) {
        let oldScale = this.animation.scale
        let scale = this.animation.scale

        if (event.wheelDelta > 0) {
          // 上滑放大
          let maxScale = 3
          if (scale === maxScale) return
          scale = (scale + 0.1).toFixed(1) * 1
          if (scale >= maxScale) scale = maxScale
        } else {
          // 下滑缩小
          let minScale = 0.1
          if (scale === 1) return
          scale = (scale - 0.1).toFixed(1) * 1
          if (scale <= minScale) scale = minScale
        }
        let ret = this.getElementTopLeft(event.target, this.mapElem)
        let left = this.animation.x + (event.offsetX + ret.left + 4) * (oldScale - scale)
        let top = this.animation.y + (event.offsetY + ret.top + 4) * (oldScale - scale)

        this.animation = {
          x: left,
          y: top,
          scale: scale,
          duration: 300,
        }

        this.setMapStyle(this.animation)
      },
    },
  }
</script>
<style lang="less">
  .areaConfig {
    display: flex;
    .leftArea {
      width: 100%;
      margin-right: 10px;
      background: #1a202e;
      padding: 20px;
      .header {
        display: flex;
        justify-content: space-between;
      }
      .tip {
        background: rgba(255, 168, 84, 0.05);
        border: 1px solid #ffa854;
        padding: 5px;
        color: #ffa854;
        margin: 10px 0;
        display: flex;
        position: relative;
        align-items: center;
        .icon-v5 {
          margin-right: 10px;
          font-size: 18px;
        }
        .close {
          position: absolute;
          right: 10px;
          cursor: pointer;
        }
      }
      .content {
        display: flex;
        .mapArea {
          overflow: auto;
          width: 100%;
          height: 720px;
          &::-webkit-scrollbar {
            display: none;
          }
        }

        .map {
          width: 100%;
        }
        .mapBigArea {
          width: 100%;
          height: 720px;
          overflow: hidden;
          position: relative;
          background-size: 100% 100% !important;
          img {
            width: 100%;
            cursor: move;
            position: absolute;
          }
        }
        .custom_node_initial {
          width: 100%;
          padding-top: 19px;
          padding-left: 53px;
          height: 60px;
          display: flex;
          border-radius: 3px;
          background: url('../../../../assets/images/macNos.png') no-repeat;
          flex-direction: column;
          background-size: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
          .close {
            position: absolute;
            right: 0px;
            top: 5px;
            z-index: 99;
          }
        }
        .vdr {
          cursor: pointer;
        }
        .vdr.active:before {
          outline: none;
        }
      }
    }
    .rightArea {
      width: 350px;
      margin-left: 10px;
      background: #1a202e;
      padding: 20px;
      height: 850px;
      overflow: auto;
      .ivu-page {
        justify-content: center;
        margin-top: 10px;
      }
      &::-webkit-scrollbar {
        display: none;
      }
      .ivu-checkbox-wrapper {
        margin-top: 20px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ivu-checkbox-group-item {
        display: block;
        margin-top: 20px;
        color: #999999;
        font-size: 16px;
      }
    }
  }
</style>
