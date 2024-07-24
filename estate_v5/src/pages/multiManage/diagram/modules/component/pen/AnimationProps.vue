<template>
  <div class="animation-props">
    <Collapse simple>
      <Panel :name="item.title" v-for="item in animationConfigMap" :key="item.title">
        <div class="collapse-title">{{ item.title }}</div>
        <template #content>
          <MForm :formSetting="item.children" label-position="left" :label-width="100" v-model="animationConfig" />
          <div class="event-button-box">
            <Button @click.stop="startAnimate" type="primary" size="small" class="event-button">{{ $t('startAnimation') }}</Button>
            <Button @click.stop="pauseAnimate" type="error" size="small" class="event-button">{{ $t('pauseAnimation') }}</Button>
            <Button @click.stop="stopAnimate" type="error" size="small">{{ $t('stopAnimation') }}</Button>
          </div>
        </template>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  import { lineDashOptions } from '../../util/process'
  import { uploadSketch, uploadSketchVideo } from '@/api/public'
  export default {
    props: {
      activePen: { type: Object, default: () => {} },
    },
    data() {
      return {
        anmitionFramesMap: {
          upDown: {
            frame: [
              { y: -10, duration: 100 },
              { y: 10, duration: 80 },
              { y: -10, duration: 50 },
              { y: 10, duration: 30 },
              { y: 0, duration: 300 },
            ],
            duration: 560,
          },
          leftRight: {
            frame: [
              { x: -10, duration: 100 },
              { x: 10, duration: 80 },
              { x: -10, duration: 50 },
              { x: 10, duration: 30 },
              { x: 0, duration: 300 },
            ],
            duration: 560,
          },
          heart: {
            frame: [
              { scale: 1.1, duration: 100 },
              { scale: 1, duration: 400 },
            ],
            duration: 500,
          },
          success: { frame: [{ background: '#389e0d22', color: '#237804', duration: 500 }], duration: 500 },
          warning: {
            frame: [
              { color: '#fa8c16', lineDash: [10, 10], duration: 300 },
              { color: '#fa8c16', duration: 500 },
              { color: '#fa8c16', lineDash: [10, 10], duration: 300 },
            ],
            duration: 1100,
          },
          error: { frame: [{ color: '#cf1322', background: '#cf132222', duration: 100 }], duration: 100 },
          show: {
            frame: [
              { color: '#fa541c', rotate: -10, duration: 100 },
              { color: '#fa541c', rotate: 10, duration: 100 },
              { color: '#fa541c', rotate: 0, duration: 100 },
            ],
            duration: 300,
          },
          rotate: { frame: [{ rotate: 360, duration: 1000 }], duration: 1000 },
        },
        animationConfig: null,
        activePenType: '',
      }
    },
    created() {
      this.animationConfig = this.getInitAnimationConfig()
    },
    computed: {
      animationConfigMap() {
        const isLine = this.activePenType === 'line'
        const _this = this
        return [
          {
            title: this.$t('animation'),
            children: [
              { isLoad: !isLine, formType: 'InputNumber', label: this.$t('duration'), prop: 'animateDuration', colSpan: 24, event: 'on-change', attr: { min: 1, max: 60 }, func: _this.setValueFunc('animateDuration') },
              {
                isLoad: !isLine,
                formType: 'Select',
                label: this.$t('animateType'),
                prop: 'animateType',
                colSpan: 24,
                event: 'on-change',
                options: [
                  { value: '', label: this.$t('nothing') },
                  { value: 'upDown', label: this.$t('ns_animateType.upDown') },
                  { value: 'leftRight', label: this.$t('ns_animateType.leftRight') },
                  { value: 'heart', label: this.$t('ns_animateType.heart') },
                  { value: 'success', label: this.$t('ns_animateType.success') },
                  { value: 'warning', label: this.$t('ns_animateType.warning') },
                  { value: 'error', label: this.$t('ns_animateType.error') },
                  { value: 'show', label: this.$t('ns_animateType.show') },
                  { value: 'rotate', label: this.$t('ns_animateType.rotate') },
                ],
                func: _this.setValueFunc('animateType'),
                attr: { placeholder: this.$t('animateType') },
              },
              {
                isLoad: isLine,
                formType: 'Select',
                label: this.$t('animateType'),
                prop: 'lineAnimateType',
                colSpan: 24,
                event: 'on-change',
                options: [
                  { label: this.$t('ns_lineAnimateType.waterFlow'), value: 0 },
                  { label: this.$t('ns_lineAnimateType.waterDropletFlow'), value: 1 },
                  { label: this.$t('ns_lineAnimateType.roundDot'), value: 2 },
                ],
                func: _this.setValueFunc('lineAnimateType'),
                attr: { placeholder: this.$t('animateType') },
              },
              {
                isLoad: isLine && _this.animationConfig.lineAnimateType === 1,
                formType: 'Select',
                label: this.$t('animatedLines'),
                prop: 'customAnimateLineDash',
                colSpan: 24,
                event: 'on-change',
                options: lineDashOptions,
                func: _this.setValueFunc('customAnimateLineDash'),
                attr: { placeholder: this.$t('animatedLines') },
              },
              { isLoad: isLine && _this.animationConfig.lineAnimateType === 2, formType: 'InputNumber', label: this.$t('animateDotSize'), prop: 'animateDotSize', colSpan: 24, event: 'on-change', attr: { min: 6 }, func: _this.setValueFunc('animateDotSize') },
              { isLoad: isLine, formType: 'InputNumber', label: this.$t('animateLineWidth'), prop: 'animateLineWidth', colSpan: 24, event: 'on-change', attr: { min: 0 }, func: _this.setValueFunc('animateLineWidth') },
              { isLoad: isLine, formType: 'Color', label: this.$t('animateColor'), prop: 'animateColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('animateColor') },
              { isLoad: isLine, formType: 'Slider', label: this.$t('animateSpan'), prop: 'animateSpan', colSpan: 24, event: 'on-change', func: _this.setValueFunc('animateSpan'), attr: { min: 1, max: 5 } },
              { isLoad: isLine, formType: 'Switch', label: this.$t('animateReverse'), prop: 'animateReverse', colSpan: 24, event: 'on-change', func: _this.setValueFunc('animateReverse') },
              { formType: 'InputNumber', label: this.$t('animateCycle'), prop: 'animateCycle', colSpan: 24, event: 'on-change', attr: { min: 1, max: Infinity }, func: _this.setValueFunc('animateCycle') },
              { formType: 'Input', label: this.$t('nextAnimate'), prop: 'nextAnimate', colSpan: 24, event: 'on-change', func: _this.setValueFunc('nextAnimate') },
              { formType: 'Switch', label: this.$t('autoPlay'), prop: 'autoPlay', colSpan: 24, event: 'on-change', func: _this.setValueFunc('autoPlay') },
              { formType: 'Switch', label: this.$t('keepAnimateState'), prop: 'keepAnimateState', colSpan: 24, event: 'on-change', func: _this.setValueFunc('keepAnimateState') },
              { formType: 'Switch', label: this.$t('linearPlay'), prop: 'linear', colSpan: 24, event: 'on-change', func: _this.setValueFunc('linear') },
              { isLoad: _this.activePenType === 'iframe', formType: 'Input', label: this.$t('iframeAddress'), prop: 'iframe', colSpan: 24, event: 'on-change', func: _this.setValueFunc('iframe') },
              { isLoad: _this.activePenType === 'video', formType: 'File', accept: '.mp4', label: this.$t('uploadVideo'), prop: 'video', colSpan: 24, event: 'change', func: e => _this.updateVideoFile(e) },
              { isLoad: _this.activePenType === 'video', formType: 'Input', label: this.$t('videoAddress'), prop: 'video', colSpan: 24, event: 'on-change', func: _this.setValueFunc('video') },
              { isLoad: _this.activePenType === 'image', formType: 'File', accept: '.jpg,.png', label: this.$t('uploadImg'), prop: 'image', colSpan: 24, event: 'change', func: e => _this.updateImageFile(e) },
              { isLoad: _this.activePenType === 'image', formType: 'Input', label: this.$t('imageAddress'), prop: 'image', colSpan: 24, event: 'on-change', func: _this.setValueFunc('image') },
            ],
          },
        ]
      },
    },
    methods: {
      getInitAnimationConfig() {
        return {
          frames: [],
          animateDuration: 1,
          animateType: '',
          lineAnimateType: 0,
          customAnimateLineDash: '',
          animateDotSize: 6,
          animateCycle: 1,
          nextAnimate: '',
          autoPlay: false,
          keepAnimateState: false,
          linear: false,
          animateLineWidth: 0,
          animateColor: '',
          animateSpan: 1,
          animateReverse: '',
          iframe: '',
          video: '',
          image: '',
        }
      },
      setAnimationConfig(propValue) {
        if (this.activePen && this.activePen.id) {
          const result = this.anmitionFramesMap[propValue]
          this.animationConfig.frames = propValue ? result.frame : []
          this.animationConfig.animateDuration = propValue ? result.duration : 0
          window.meta2d.setValue({ id: this.activePen.id, frames: this.animationConfig.frames, animateDuration: this.animationConfig.animateDuration }, { history: true })
          window.meta2d.render()
        }
      },
      mergeProps(target, resource, init = false) {
        for (const i in target) {
          if (!target[i]) {
            switch (typeof target[i]) {
              case 'string':
                target[i] = ''
                break
              case 'number':
                target[i] = 0
                break
              case 'boolean':
                target[i] = false
                break
              default:
                break
            }
          }
          target[i] = init ? resource[i] : resource[i] || target[i]
        }
      },
      setValueFunc(prop) {
        return value => {
          const val = value && value.target ? value.target.value : value
          window.meta2d.setValue({ id: this.activePen.id, [prop]: val })
          if (prop === 'animateType') {
            this.setAnimationConfig(val)
          }
        }
      },
      startAnimate() {
        window.meta2d.startAnimate(this.activePen.id)
      },
      pauseAnimate() {
        window.meta2d.pauseAnimate(this.activePen.id)
      },
      stopAnimate() {
        window.meta2d.stopAnimate(this.activePen.id)
      },
      async updateImageFile(e) {
        let file = e.target.files[0]
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) return this.$message.error(this.$t('imageUploadSizeLimitTip', { size: 5 }))
        let formData = new FormData()
        formData.append('imgFile', file)
        formData.append('name', 'imgFile')
        const res = await uploadSketch(formData)
        if (res.success) {
          const resultUrl = `//${res.data.split('//')[1]}`
          this.animationConfig.image = resultUrl
          window.meta2d.setValue({ id: this.activePen.id, image: resultUrl })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async updateVideoFile(e) {
        let file = e.target.files[0]
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) return this.$message.error(this.$t('videoUploadSizeLimitTip', { size: 50 }))
        let formData = new FormData()
        formData.append('file1', file)
        const res = await uploadSketchVideo(formData)
        if (res.success) {
          const resultUrl = `//${res.data.split('//')[1]}`
          this.animationConfig.video = resultUrl
          window.meta2d.setValue({ id: this.activePen.id, video: resultUrl })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      this.activePenType = this.activePen && this.activePen.name
      this.mergeProps(this.animationConfig, this.activePen)
    },
  }
</script>

<style lang="less" scoped>
  .animation-props {
    position: relative;
    top: -1px;
    /deep/.ivu-collapse {
      background: none;
      border: none;
      .ivu-collapse-item {
        border: none;
        &.ivu-collapse-item-active > .ivu-collapse-header {
          border: none;
        }
      }
      .collapse-title {
        flex: 1;
      }
    }
    .event-button-box {
      padding-top: 8px;
      padding-bottom: 8px;
      .event-button {
        margin-right: 4px;
        margin-bottom: 5px;
      }
    }
  }
</style>
