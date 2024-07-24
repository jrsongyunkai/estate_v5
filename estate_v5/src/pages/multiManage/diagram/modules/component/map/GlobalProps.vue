<template>
  <div class="global-props">
    <Collapse simple>
      <Panel :name="item.title" v-for="item in globalConfigMap" :key="item.title">
        <div class="collapse-title">{{ item.title }}</div>
        <template #content>
          <MForm :formSetting="item.children" label-position="left" :label-width="100" v-model="globalConfig" />
        </template>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        globalConfig: {
          color: '',
          activeColor: '',
          hoverColor: '',
          hoverBackground: '',
          anchorColor: '',
          anchorRadius: 0,
          anchorBackground: '',
          dockColor: '',
          dragColor: '',
          animateColor: '',
          textColor: '',
          fontFamily: '',
          fontSize: 0,
          lineHeight: 0,
          textAlign: '',
          textBaseline: '',
          rotateCursor: '',
          hoverCursor: '',
          disableInput: false,
          disableRotate: false,
          disableAnchor: false,
          disableEmptyLine: false,
          disableRepeatLine: false,
          disableScale: false,
          disableDockLine: false,
          disableTranslate: false,
          minScale: 0.1,
          maxScale: 10,
          autoAnchor: true,
          interval: 60,
          animateInterval: 60,
          textRotate: true,
          textFlip: false,
        },
      }
    },
    computed: {
      globalConfigMap() {
        return [
          {
            title: this.$t('brush'),
            children: [
              { formType: 'Color', label: this.$t('defaultColor'), prop: 'color', colSpan: 24, event: 'on-change', func: this.setOptionFunc('color') },
              { formType: 'Color', label: this.$t('selectedColor'), prop: 'activeColor', colSpan: 24, event: 'on-change', func: this.setOptionFunc('activeColor') },
              { formType: 'Color', label: this.$t('hoverColor'), prop: 'hoverColor', colSpan: 24, event: 'on-change', func: this.setOptionFunc('hoverColor') },
              { formType: 'Color', label: this.$t('hoverBackgroundColor'), prop: 'hoverBackground', colSpan: 24, event: 'on-change', func: this.setOptionFunc('hoverBackground') },
            ],
          },
          {
            title: this.$t('anchorPoint'),
            children: [
              { formType: 'Color', label: this.$t('anchorPointColor'), prop: 'anchorColor', colSpan: 24, event: 'on-change', func: this.setOptionFunc('anchorColor') },
              { formType: 'InputNumber', label: this.$t('anchorRadius'), prop: 'anchorRadius', colSpan: 24, event: 'on-change', func: this.setOptionFunc('anchorRadius') },
              { formType: 'Color', label: this.$t('anchorBackground'), prop: 'anchorBackground', colSpan: 24, event: 'on-change', func: this.setOptionFunc('anchorBackground') },
            ],
          },
          {
            title: this.$t('guidelines'),
            children: [
              { formType: 'Color', label: this.$t('anchorPointColor'), prop: 'dockColor', colSpan: 24, event: 'on-change', func: this.setOptionFunc('dockColor') },
              { formType: 'Color', label: this.$t('dragColor'), prop: 'dragColor', colSpan: 24, event: 'on-change', func: this.setOptionFunc('dragColor') },
              { formType: 'Color', label: this.$t('lineAnimateColor'), prop: 'animateColor', colSpan: 24, event: 'on-change', func: this.setOptionFunc('animateColor') },
            ],
          },
          {
            title: this.$t('characters'),
            children: [
              { formType: 'Color', label: this.$t('textColor'), prop: 'textColor', colSpan: 24, event: 'on-change', func: this.setOptionFunc('textColor') },
              { formType: 'Input', label: this.$t('fontFamily'), prop: 'fontFamily', colSpan: 24, event: 'on-change', func: this.setOptionFunc('fontFamily') },
              { formType: 'InputNumber', label: this.$t('charactersSize'), prop: 'fontSize', colSpan: 24, event: 'on-change', func: this.setOptionFunc('fontSize') },
              { formType: 'InputNumber', label: this.$t('charactersLineHeight'), prop: 'lineHeight', colSpan: 24, event: 'on-change', func: this.setOptionFunc('lineHeight') },
              {
                formType: 'Select',
                label: this.$t('horizontalAlignmentOfText'),
                prop: 'textAlign',
                colSpan: 24,
                event: 'on-change',
                func: this.setOptionFunc('textAlign'),
                options: [
                  { label: this.$t('leftAlignment'), value: 'left' },
                  { label: this.$t('textAlignCenter'), value: 'center' },
                  { label: this.$t('rightAlignment'), value: 'right' },
                ],
              },
              {
                formType: 'Select',
                label: this.$t('verticalAlignmentOfText'),
                prop: 'textBaseline',
                colSpan: 24,
                event: 'on-change',
                func: this.setOptionFunc('textBaseline'),
                options: [
                  { label: this.$t('top'), value: 'top' },
                  { label: this.$t('middle'), value: 'middle' },
                  { label: this.$t('bottom'), value: 'bottom' },
                ],
              },
            ],
          },
          {
            title: this.$t('inhibit'),
            children: [
              { formType: 'Switch', label: this.$t('ns_inhibit.disableInput'), prop: 'disableInput', colSpan: 24, event: 'on-change', func: this.setOptionFunc('disableInput') },
              { formType: 'Switch', label: this.$t('ns_inhibit.disableRotate'), prop: 'disableRotate', colSpan: 24, event: 'on-change', func: this.setOptionFunc('disableRotate') },
              { formType: 'Switch', label: this.$t('ns_inhibit.disableAnchor'), prop: 'disableAnchor', colSpan: 24, event: 'on-change', func: this.setOptionFunc('disableAnchor') },
              { formType: 'Switch', label: this.$t('ns_inhibit.disableEmptyLine'), prop: 'disableEmptyLine', colSpan: 24, event: 'on-change', func: this.setOptionFunc('disableEmptyLine') },
              { formType: 'Switch', label: this.$t('ns_inhibit.disableRepeatLine'), prop: 'disableRepeatLine', colSpan: 24, event: 'on-change', func: this.setOptionFunc('disableRepeatLine') },
              { formType: 'Switch', label: this.$t('ns_inhibit.disableScale'), prop: 'disableScale', colSpan: 24, event: 'on-change', func: this.setOptionFunc('disableScale') },
              { formType: 'Switch', label: this.$t('ns_inhibit.disableDockLine'), prop: 'disableDockLine', colSpan: 24, event: 'on-change', func: this.setOptionFunc('disableDockLine') },
              { formType: 'Switch', label: this.$t('ns_inhibit.disableTranslate'), prop: 'disableTranslate', colSpan: 24, event: 'on-change', func: this.setOptionFunc('disableTranslate') },
            ],
          },
          {
            title: this.$t('canvasSettings'),
            children: [
              { formType: 'InputNumber', label: this.$t('canvasMinScale'), prop: 'minScale', colSpan: 24, event: 'on-change', func: this.setOptionFunc('minScale') },
              { formType: 'InputNumber', label: this.$t('canvasMaxScale'), prop: 'maxScale', colSpan: 24, event: 'on-change', func: this.setOptionFunc('maxScale') },
            ],
          },
          {
            title: this.$t('otherSettings'),
            children: [
              { formType: 'Switch', label: this.$t('ns_otherSettings.autoAnchor'), prop: 'autoAnchor', colSpan: 24, event: 'on-change', func: this.setOptionFunc('autoAnchor') },
              { formType: 'InputNumber', label: this.$t('ns_otherSettings.interval'), prop: 'interval', colSpan: 24, event: 'on-change', func: this.setOptionFunc('interval'), attr: { min: 1 } },
              { formType: 'InputNumber', label: this.$t('ns_otherSettings.animateInterval'), prop: 'animateInterval', colSpan: 24, event: 'on-change', func: this.setOptionFunc('animateInterval'), attr: { min: 1 } },
              { formType: 'Switch', label: this.$t('ns_otherSettings.textRotate'), prop: 'textRotate', colSpan: 24, event: 'on-change', func: this.setOptionFunc('textRotate') },
              { formType: 'Switch', label: this.$t('ns_otherSettings.textFlip'), prop: 'textFlip', colSpan: 24, event: 'on-change', func: this.setOptionFunc('textFlip') },
            ],
          },
        ]
      },
    },
    methods: {
      loadOptionsFromMeta2d(options, target) {
        for (const i in target) {
          if (target[i]) continue
          target[i] = options[i] || target[i]
        }
      },
      init() {
        const options = window.meta2d.getOptions()
        this.loadOptionsFromMeta2d(options, this.globalConfig)
        for (const p in this.globalConfig) {
          window.meta2d.setOptions({
            [p]: this.globalConfig[p],
          })
        }
        window.meta2d.render()
      },
      setOptionFunc(prop) {
        return val => {
          const value = val.target ? val.target.value : val
          window.meta2d.setOptions({
            [prop]: value,
          })
          window.meta2d.render()
        }
      },
    },
    mounted() {
      this.init()
    },
  }
</script>

<style lang="less" scoped>
  .global-props {
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
