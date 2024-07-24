<template>
  <div class="canvas-props">
    <Collapse simple>
      <Panel :name="item.title" v-for="item in canvasConfigMap" :key="item.title">
        <div class="collapse-title">{{ item.title }}</div>
        <template #content>
          <MForm :formSetting="item.children" label-position="left" :label-width="100" v-model="canvasConfig" />
        </template>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  import { uploadSketch } from '@/api/public'
  export default {
    data() {
      return {
        canvasConfig: {
          color: '#eeeeee',
          penBackground: '',
          background: '',
          backGroundImage: '',
          rule: false,
          ruleColor: '',
          grid: false,
          gridColor: '',
          gridSize: 10,
          gridRotate: 90,
        },
      }
    },
    computed: {
      canvasConfigMap() {
        return [
          {
            title: this.$t('canvas'),
            children: [
              {
                formType: 'Color',
                label: this.$t('defaultColor'),
                prop: 'color',
                colSpan: 24,
                event: 'on-change',
                func(value) {
                  window.meta2d.setOptions({ color: value })
                  window.meta2d.render()
                },
              },
              {
                formType: 'Color',
                label: this.$t('brushFillColor'),
                prop: 'penBackground',
                colSpan: 24,
                event: 'on-change',
                func(value) {
                  window.meta2d.store.data.penBackground = value
                  window.meta2d.render()
                },
              },
              {
                formType: 'Color',
                label: this.$t('backgroundColor'),
                prop: 'background',
                colSpan: 24,
                event: 'on-change',
                func(value) {
                  window.meta2d.setBackgroundImage('')
                  window.meta2d.setBackgroundColor(value)
                  window.meta2d.render()
                },
              },
              { formType: 'File', label: this.$t('backgroundImage'), prop: 'backGroundImage', colSpan: 24, event: 'change', func: e => this.upDateBackgroundImage(e) },
              {
                formType: 'Switch',
                label: this.$t('scaleplate'),
                prop: 'rule',
                colSpan: 24,
                event: 'on-change',
                func(value) {
                  window.meta2d.setRule({ rule: value })
                  window.meta2d.render()
                },
              },
              {
                formType: 'Color',
                label: this.$t('scaleplateColor'),
                prop: 'ruleColor',
                colSpan: 24,
                event: 'on-change',
                func(value) {
                  window.meta2d.setRule({ ruleColor: value })
                  window.meta2d.render()
                },
              },
              {
                formType: 'Switch',
                label: this.$t('grid'),
                prop: 'grid',
                colSpan: 24,
                event: 'on-change',
                func(value) {
                  window.meta2d.setGrid({ grid: value })
                  window.meta2d.render()
                },
              },
              {
                formType: 'Color',
                label: this.$t('gridColor'),
                prop: 'gridColor',
                colSpan: 24,
                event: 'on-change',
                func(value) {
                  window.meta2d.setGrid({ gridColor: value })
                  window.meta2d.render()
                },
              },
              {
                formType: 'InputNumber',
                label: this.$t('gridSize'),
                prop: 'gridSize',
                colSpan: 24,
                event: 'on-change',
                attr: { min: 1, max: 100 },
                func(value) {
                  window.meta2d.setGrid({ gridSize: +value })
                  window.meta2d.render()
                },
              },
              {
                formType: 'InputNumber',
                label: this.$t('gridRotate'),
                prop: 'gridRotate',
                colSpan: 24,
                attr: { min: -Infinity, max: Infinity },
                event: 'on-change',
                func(value) {
                  window.meta2d.setGrid({ gridRotate: +value })
                  window.meta2d.render()
                },
              },
            ],
          },
        ]
      },
    },
    methods: {
      loadOptionsFromMeta2d(options, target) {
        for (const i in target) {
          target[i] = options[i] || target[i]
        }
      },
      async upDateBackgroundImage(e) {
        let file = e.target.files[0]
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) return this.$message.error(this.$t('imageUploadSizeLimitTip', { size: 5 }))
        let formData = new FormData()
        formData.append('imgFile', file)
        formData.append('name', 'imgFile')
        const res = await uploadSketch(formData)
        if (res.success) {
          let url = res.data
          const resultUrl = `//${url.split('//')[1]}`
          this.canvasConfig.backGroundImage = resultUrl
          window.meta2d.setBackgroundColor('')
          window.meta2d.setBackgroundImage(resultUrl)
          window.meta2d.render()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      window.meta2d.on('opened', () => {
        const options = window.meta2d.data()
        this.loadOptionsFromMeta2d(options, this.canvasConfig)
        this.loadOptionsFromMeta2d(options, window.meta2d.getOptions())
      })
      const options = window.meta2d.getOptions()
      this.loadOptionsFromMeta2d(options, this.canvasConfig)
    },
  }
</script>
<style lang="less" scoped>
  .canvas-props {
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
  }
</style>
