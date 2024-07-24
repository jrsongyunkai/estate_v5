<template>
  <div class="appearance-props">
    <Collapse simple>
      <Panel :name="item.title" v-for="item in penConfigMap" :key="item.title">
        <div class="collapse-title">{{ item.title }}</div>
        <template #content>
          <MForm :formSetting="item.children" label-position="left" :label-width="100" v-model="penConfig" />
        </template>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  import { connectLineOptions, lineDashOptions, whiteSpaceOptions, dashOptions, lineNameOptions, lineCapOptions, lineJoinOptions, fontStyleOptions, fontWeightOptions, textAlignOptions, textBaselineOptions, fontFamilyOptions, strokeTypeOptions } from '../../util/process'
  export default {
    props: { activePen: { type: Object, default: () => {} } },
    data() {
      return {
        penConfig: null,
        activePenType: '',
      }
    },
    computed: {
      penConfigMap() {
        const _this = this
        const isLine = this.activePenType === 'line'
        return [
          {
            title: isLine ? this.$t('position') : this.$t('positionAndSize'),
            children: [
              {
                isLoad: !isLine,
                formType: 'InputNumber',
                label: 'x',
                prop: 'x',
                colSpan: 24,
                event: 'on-change',
                attr: { placeholder: 'px' },
                func(value) {
                  window.meta2d.setPenRect(_this.activePen, { x: value, y: _this.activePen.y, width: _this.activePen.width, height: _this.activePen.height }, false)
                  window.meta2d.canvas.calcActiveRect()
                  _this.mergeProps(_this.penConfig, _this.activePen)
                  window.meta2d.render()
                },
              },
              {
                isLoad: !isLine,
                formType: 'InputNumber',
                label: 'y',
                prop: 'y',
                colSpan: 24,
                event: 'on-change',
                attr: { placeholder: 'px' },
                func(value) {
                  window.meta2d.setPenRect(_this.activePen, { x: _this.activePen.x, y: value, width: _this.activePen.width, height: _this.activePen.height }, false)
                  window.meta2d.canvas.calcActiveRect()
                  _this.mergeProps(_this.penConfig, _this.activePen)
                  window.meta2d.render()
                },
              },
              {
                isLoad: !isLine,
                formType: 'InputNumber',
                label: this.$t('width'),
                prop: 'width',
                colSpan: 24,
                event: 'on-change',
                attr: { min: 0 },
                func(value) {
                  if (_this.activePen.ratio) {
                    window.meta2d.setValue({ id: _this.activePen.id, width: value, height: (value / _this.activePen.width) * _this.activePen.height })
                  } else {
                    window.meta2d.setValue({ id: _this.activePen.id, width: value })
                  }
                  _this.mergeProps(_this.penConfig, _this.activePen)
                },
              },
              {
                isLoad: !isLine,
                formType: 'InputNumber',
                label: this.$t('height'),
                prop: 'height',
                colSpan: 24,
                event: 'on-change',
                attr: { min: 0 },
                func(value) {
                  if (_this.activePen.ratio) {
                    window.meta2d.setValue({ id: _this.activePen.id, height: value, width: (value / _this.activePen.height) * _this.activePen.width })
                  } else {
                    window.meta2d.setValue({ id: _this.activePen.id, height: value })
                  }
                  _this.mergeProps(_this.penConfig, _this.activePen)
                },
              },
              { isLoad: !isLine, formType: 'Switch', label: this.$t('lockAspectRatio'), prop: 'ratio', colSpan: 24, event: 'on-change', func: value => _this.setSwitchRatio(value) },
              { isLoad: !isLine, formType: 'InputNumber', label: this.$t('borderRadius'), prop: 'borderRadius', colSpan: 24, event: 'on-change', attr: { placeholder: this.$t('borderRadiusInputTip'), min: 0 }, func: _this.setValueFunc('borderRadius') },
              { isLoad: !isLine, formType: 'InputNumber', label: this.$t('ns_animateType.rotate'), prop: 'rotate', colSpan: 24, event: 'on-change', attr: { placeholder: this.$t('angle') }, func: _this.setValueFunc('rotate') },
              { isLoad: !isLine, formType: 'InputNumber', label: this.$t('paddingTop'), prop: 'paddingTop', colSpan: 24, event: 'on-change', attr: { placeholder: 'px' }, func: _this.setValueFunc('paddingTop') },
              { isLoad: !isLine, formType: 'InputNumber', label: this.$t('paddingBottom'), prop: 'paddingBottom', colSpan: 24, event: 'on-change', attr: { placeholder: 'px' }, func: _this.setValueFunc('paddingBottom') },
              { isLoad: !isLine, formType: 'InputNumber', label: this.$t('paddingLeft'), prop: 'paddingLeft', colSpan: 24, event: 'on-change', attr: { placeholder: 'px' }, func: _this.setValueFunc('paddingLeft') },
              { isLoad: !isLine, formType: 'InputNumber', label: this.$t('paddingRight'), prop: 'paddingRight', colSpan: 24, event: 'on-change', attr: { placeholder: 'px' }, func: _this.setValueFunc('paddingRight') },
              { isLoad: !isLine, formType: 'InputNumber', label: this.$t('progress'), prop: 'progress', colSpan: 24, event: 'on-change', attr: { placeholder: 'px', min: 0, step: 0.1, max: 1 }, func: _this.setValueFunc('progress') },
              { isLoad: !isLine, formType: 'Color', label: this.$t('progressColor'), prop: 'progressColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('progressColor') },
              { isLoad: !isLine, formType: 'Switch', label: this.$t('verticalProgress'), prop: 'verticalProgress', colSpan: 24, event: 'on-change', func: _this.setValueFunc('verticalProgress') },
              { isLoad: !isLine, formType: 'Switch', label: this.$t('flipX'), prop: 'flipX', colSpan: 24, event: 'on-change', func: _this.setValueFunc('flipX') },
              { isLoad: !isLine, formType: 'Switch', label: this.$t('flipY'), prop: 'flipY', colSpan: 24, event: 'on-change', func: _this.setValueFunc('flipY') },
              { isLoad: !isLine, formType: 'Switch', label: this.$t('inputBox'), prop: 'input', colSpan: 24, event: 'on-change', func: _this.setValueFunc('input') },
              { isLoad: isLine, formType: 'Select', label: this.$t('fromArrow'), prop: 'fromArrow', colSpan: 24, event: 'on-change', options: connectLineOptions, attr: { placeholder: this.$t('fromArrow') }, func: _this.setValueFunc('fromArrow') },
              { isLoad: isLine, formType: 'InputNumber', label: this.$t('fromArrowSize'), prop: 'fromArrowSize', colSpan: 24, event: 'on-change', attr: { min: 1, step: 1, max: 100 }, func: _this.setValueFunc('fromArrowSize') },
              { isLoad: isLine, formType: 'Color', label: this.$t('fromArrowColor'), prop: 'fromArrowColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('fromArrowColor') },
              { isLoad: isLine, formType: 'Select', label: this.$t('toArrow'), prop: 'toArrow', colSpan: 24, event: 'on-change', options: connectLineOptions, attr: { placeholder: this.$t('toArrow') }, func: _this.setValueFunc('toArrow') },
              { isLoad: isLine, formType: 'InputNumber', label: this.$t('toArrowSize'), prop: 'toArrowSize', colSpan: 24, event: 'on-change', attr: { min: 1, step: 1, max: 100 }, func: _this.setValueFunc('toArrowSize') },
              { isLoad: isLine, formType: 'Color', label: this.$t('toArrowColor'), prop: 'toArrowColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('toArrowColor') },
            ],
          },
          {
            title: this.$t('style'),
            children: [
              { formType: 'Select', label: this.$t('lineStyle'), prop: 'dash', colSpan: 24, event: 'on-change', options: dashOptions, attr: { placeholder: this.$t('lineStyle') }, func: value => _this.setDash(value) },
              {
                isLoad: isLine,
                formType: 'Select',
                label: this.$t('connectionType'),
                prop: 'lineName',
                colSpan: 24,
                event: 'on-change',
                options: lineNameOptions,
                func(value) {
                  window.meta2d.updateLineType(_this.activePen, value)
                  window.meta2d.render()
                },
              },
              { formType: 'Select', label: this.$t('endStyle'), prop: 'lineCap', colSpan: 24, event: 'on-change', options: lineCapOptions, attr: { placeholder: this.$t('endStyle') }, func: _this.setValueFunc('lineCap') },
              { formType: 'Select', label: this.$t('connectStyle'), prop: 'lineJoin', colSpan: 24, event: 'on-change', options: lineJoinOptions, attr: { placeholder: this.$t('connectStyle') }, func: _this.setValueFunc('lineJoin') },
              { isLoad: _this.penConfig.strokeType === '1' && isLine, formType: 'InputNumber', label: this.$t('gradientSmooth'), prop: 'gradientSmooth', colSpan: 24, event: 'on-change', func: _this.setValueFunc('gradientSmooth') },
              { formType: 'Select', label: this.$t('lineGradient'), prop: 'strokeType', colSpan: 24, event: 'on-change', options: strokeTypeOptions, attr: { placeholder: this.$t('lineGradient') }, func: _this.setValueFunc('strokeType') },
              { formType: 'Color', label: this.$t('colour'), prop: 'color', colSpan: 24, event: 'on-change', func: _this.setValueFunc('color') },
              { isLoad: _this.penConfig.strokeType === '1', formType: 'Input', label: this.$t('lineGradientColor'), prop: 'lineGradientColors', colSpan: 24, event: 'on-change', func: _this.setValueFunc('lineGradientColors') },
              { formType: 'Color', label: this.$t('floatingColors'), prop: 'hoverColor', colSpan: 24, event: 'on-change', attr: { placeholder: '推荐1-3' }, func: _this.setValueFunc('hoverColor') },
              { formType: 'Color', label: this.$t('selectedColor'), prop: 'activeColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('activeColor') },
              { formType: 'InputNumber', label: this.$t('lineWidth'), prop: 'lineWidth', colSpan: 24, event: 'on-change', func: _this.setValueFunc('lineWidth') },
              { isLoad: isLine, formType: 'Color', label: this.$t('borderColor'), prop: 'borderColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('borderColor') },
              { isLoad: isLine, formType: 'InputNumber', label: this.$t('borderWidth'), prop: 'borderWidth', colSpan: 24, event: 'on-change', func: _this.setValueFunc('borderWidth') },
              { formType: 'Color', label: this.$t('backgroundColor'), prop: 'background', colSpan: 24, event: 'on-change', func: _this.setValueFunc('background') },
              { formType: 'Color', label: this.$t('hoverBackground'), prop: 'hoverBackground', colSpan: 24, event: 'on-change', func: _this.setValueFunc('hoverBackground') },
              { formType: 'Color', label: this.$t('activeBackground'), prop: 'activeBackground', colSpan: 24, event: 'on-change', func: _this.setValueFunc('activeBackground') },
              { formType: 'InputNumber', label: this.$t('pellucidity'), prop: 'globalAlpha', colSpan: 24, event: 'on-change', attr: { min: 0, step: 0.1, max: 1 }, func: _this.setValueFunc('globalAlpha') },
              { formType: 'Color', label: this.$t('anchorPointColor'), prop: 'anchorColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('anchorColor') },
              { formType: 'InputNumber', label: this.$t('anchorRadius'), prop: 'anchorRadius', colSpan: 24, event: 'on-change', attr: { min: 0, step: 1, max: 10 }, func: _this.setValueFunc('anchorRadius') },
              { formType: 'Color', label: this.$t('shadowColor'), prop: 'shadowColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('shadowColor') },
              { formType: 'InputNumber', label: this.$t('shadowBlur'), prop: 'shadowBlur', colSpan: 24, event: 'on-change', attr: { min: 0, step: 1, max: Infinity }, func: _this.setValueFunc('shadowBlur') },
              { formType: 'InputNumber', label: this.$t('shadowOffsetX'), prop: 'shadowOffsetX', colSpan: 24, event: 'on-change', func: _this.setValueFunc('shadowOffsetX') },
              { formType: 'InputNumber', label: this.$t('shadowOffsetY'), prop: 'shadowOffsetY', colSpan: 24, event: 'on-change', func: _this.setValueFunc('shadowOffsetY') },
              { formType: 'Switch', label: this.$t('textHasShadow'), prop: 'textHasShadow', colSpan: 24, event: 'on-change', func: _this.setValueFunc('textHasShadow') },
            ],
          },
          {
            title: this.$t('characters'),
            children: [
              { formType: 'Select', label: this.$t('font'), prop: 'fontFamily', colSpan: 24, event: 'on-change', options: fontFamilyOptions, func: _this.setValueFunc('fontFamily'), attr: { placeholder: this.$t('pleaseSelectFont') } },
              { formType: 'InputNumber', label: this.$t('fontSize'), prop: 'fontSize', colSpan: 24, event: 'on-change', func: _this.setValueFunc('fontSize') },
              { formType: 'Color', label: this.$t('fontColor'), prop: 'textColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('textColor') },
              { formType: 'Color', label: this.$t('hoverTextColor'), prop: 'hoverTextColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('hoverTextColor') },
              { formType: 'Color', label: this.$t('activeTextColor'), prop: 'activeTextColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('activeTextColor') },
              { formType: 'Color', label: this.$t('textBackground'), prop: 'textBackground', colSpan: 24, event: 'on-change', func: _this.setValueFunc('textBackground') },
              { formType: 'Select', label: this.$t('italic'), prop: 'fontStyle', colSpan: 24, event: 'on-change', options: fontStyleOptions, func: _this.setValueFunc('fontStyle') },
              { formType: 'Select', label: this.$t('bold'), prop: 'fontWeight', colSpan: 24, event: 'on-change', options: fontWeightOptions, func: _this.setValueFunc('fontWeight') },
              { formType: 'Select', label: this.$t('horizontalAlignment'), prop: 'textAlign', colSpan: 24, event: 'on-change', options: textAlignOptions, func: _this.setValueFunc('textAlign'), attr: { placeholder: this.$t('pleaseSelectAlignment') } },
              { formType: 'Select', label: this.$t('verticalAlignment'), prop: 'textBaseline', colSpan: 24, event: 'on-change', options: textBaselineOptions, func: _this.setValueFunc('textBaseline'), attr: { placeholder: this.$t('pleaseSelectAlignment') } },
              { formType: 'InputNumber', label: this.$t('lineHeight'), prop: 'lineHeight', colSpan: 24, event: 'on-change', attr: { step: 0.1 }, func: _this.setValueFunc('lineHeight') },
              { formType: 'Select', label: this.$t('whiteSpace'), prop: 'whiteSpace', colSpan: 24, event: 'on-change', options: whiteSpaceOptions, func: _this.setValueFunc('whiteSpace'), attr: { placeholder: this.$t('pleaseSelectWhiteSpace') } },
              { formType: 'InputNumber', label: this.$t('textWidth'), prop: 'textWidth', colSpan: 24, event: 'on-change', attr: { min: 0 }, func: _this.setValueFunc('textWidth') },
              { formType: 'InputNumber', label: this.$t('textHeight'), prop: 'textHeight', colSpan: 24, event: 'on-change', attr: { min: 0 }, func: _this.setValueFunc('textHeight') },
              { formType: 'InputNumber', label: this.$t('horizontalOffset'), prop: 'textLeft', colSpan: 24, event: 'on-change', func: _this.setValueFunc('textLeft') },
              { formType: 'InputNumber', label: this.$t('verticalOffset'), prop: 'textTop', colSpan: 24, event: 'on-change', func: _this.setValueFunc('textTop') },
              { formType: 'Switch', label: this.$t('ellipsis'), prop: 'ellipsis', colSpan: 24, event: 'on-change', func: _this.setValueFunc('ellipsis') },
              { formType: 'Switch', label: this.$t('hiddenText'), prop: 'hiddenText', colSpan: 24, event: 'on-change', func: _this.setValueFunc('hiddenText') },
              { formType: 'InputNumber', label: this.$t('keepDecimal'), prop: 'keepDecimal', colSpan: 24, event: 'on-change', attr: { min: 0, step: 1 }, func: _this.setValueFunc('keepDecimal') },
              { formType: 'Switch', label: this.$t('underline'), prop: 'textDecoration', colSpan: 24, event: 'on-change', func: _this.setValueFunc('textDecoration') },
              { formType: 'Color', label: this.$t('textDecorationColor'), prop: 'textDecorationColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('textDecorationColor') },
              { formType: 'Select', label: this.$t('textDecorationDash'), prop: 'textDecorationDash', colSpan: 24, event: 'on-change', options: lineDashOptions, func: _this.setValueFunc('textDecorationDash') },
              { formType: 'Switch', label: this.$t('deleteLine'), prop: 'textStrickout', colSpan: 24, event: 'on-change', func: _this.setValueFunc('textStrickout') },
              { formType: 'Color', label: this.$t('textStrickoutColor'), prop: 'textStrickoutColor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('textStrickoutColor') },
              { formType: 'Select', label: this.$t('textStrickoutDash'), prop: 'textStrickoutDash', colSpan: 24, event: 'on-change', options: lineDashOptions, func: _this.setValueFunc('textStrickoutDash') },
              { formType: 'Input', label: this.$t('textContent'), prop: 'text', colSpan: 24, event: 'on-change', func: _this.setValueFunc('text'), attr: { type: 'textarea' } },
            ],
          },
          {
            title: this.$t('inhibit'),
            children: [
              { formType: 'Switch', label: this.$t('ns_inhibit.disableEnter'), prop: 'disableInput', colSpan: 24, event: 'on-change', func: _this.setValueFunc('disableInput') },
              { formType: 'Switch', label: this.$t('ns_inhibit.disableRotate'), prop: 'disableRotate', colSpan: 24, event: 'on-change', func: _this.setValueFunc('disableRotate') },
              { formType: 'Switch', label: this.$t('ns_inhibit.disableSize'), prop: 'disableSize', colSpan: 24, event: 'on-change', func: _this.setValueFunc('disableSize') },
              { formType: 'Switch', label: this.$t('ns_inhibit.disableAnchor'), prop: 'disableAnchor', colSpan: 24, event: 'on-change', func: _this.setValueFunc('disableAnchor') },
            ],
          },
        ]
      },
    },
    created() {
      this.penConfig = this.getInitPenConfig()
    },
    methods: {
      getInitPenConfig() {
        return {
          x: 0,
          y: 0,
          text: '',
          color: 'rgba(179, 152, 162, 1)',
          width: 0,
          height: 0,
          lineWidth: 10,
          borderWidth: 5,
          borderColor: 'rgba(98, 52, 52, 1)',
          hoverColor: '',
          activeColor: '',
          strokeType: '0',
          lineGradientColors: 'linear-gradient(90deg,rgba(255, 98, 46, 1) 0%,rgb(255, 98, 46) 18%,rgb(204, 0, 0) 20%,rgb(255, 98, 46) 50%,rgb(204, 0, 0) 80%,rgb(255, 98, 46) 82%,rgb(255, 98, 46) 100%)',
          gradientSmooth: 1,
          background: '',
          hoverBackground: '',
          activeBackground: '',
          shadowColor: '',
          shadowBlur: 0,
          textHasShadow: false,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          anchorColor: '',
          anchorRadius: 0,
          borderRadius: 0,
          globalAlpha: 0,
          ratio: false,
          rotate: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
          progress: 0,
          progressColor: '',
          verticalProgress: false,
          flipX: false,
          flipY: false,
          dash: 0,
          fontFamily: '',
          fontSize: 0,
          textColor: '',
          hoverTextColor: '',
          activeTextColor: '',
          textBackground: '',
          textAlign: '',
          textBaseline: '',
          lineHeight: 0,
          whiteSpace: '',
          textWidth: 0,
          textHeight: 0,
          ellipsis: '',
          hiddenText: false,
          disableAnchor: false,
          disableInput: false,
          disableRotate: false,
          disableSize: false,
          image: '',
          input: false,
          fromArrow: '',
          fromArrowSize: '',
          fromArrowColor: '',
          toArrow: '',
          toArrowSize: '',
          toArrowColor: '',
          lineName: 'curve',
          lineCap: 'butt',
          lineJoin: 'miter',
          fontStyle: 'normal',
          fontWeight: '300',
          textLeft: 0,
          textTop: 0,
          textDecoration: false,
          textDecorationColor: '',
          textDecorationDash: '',
          textStrickout: false,
          textStrickoutColor: '',
          textStrickoutDash: '',
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
          const resourceVal = resource[i] !== undefined ? resource[i] : undefined
          const resourceCalculativeVal = resource.calculative && resource.calculative[i] !== undefined ? resource.calculative[i] : undefined
          const val = resourceVal || resourceCalculativeVal || target[i]
          target[i] = init ? resource[i] : val
        }
      },
      setValueFunc(prop) {
        return value => {
          const val = value && value.target ? value.target.value : value
          if (this.activePen && this.activePen.id) {
            window.meta2d.setValue({ id: this.activePen.id, [prop]: ['textDecorationDash', 'textStrickoutDash'].includes(prop) && val ? val.split(',') : val })
          }
        }
      },
      setSwitchRatio(value) {
        this.activePen.ratio = value
        window.meta2d.render()
        this.mergeProps(this.penConfig, this.activePen)
      },
      setDash(value) {
        const dash = [
          [0, 0],
          [5, 5],
          [10, 10, 2, 10],
        ]
        this.activePen.dash = value
        window.meta2d.setValue({ id: this.activePen.id, lineDash: dash[value] })
      },
      lockRatio() {
        this.activePen.ratio = true
        window.meta2d.render()
        this.mergeProps(this.penConfig, this.activePen)
      },
      onkeydown(e) {
        if (e.ctrlKey && e.key.toLocaleLowerCase() === 'e') {
          this.lockRatio()
          e.preventDefault()
        }
      },
    },
    mounted() {
      window.addEventListener('keydown', onkeydown)
      this.mergeProps(this.penConfig, this.activePen, true)
    },
    destroyed() {
      window.removeEventListener('keydown', this.onkeydown)
    },
  }
</script>

<style lang="less" scoped>
  .appearance-props {
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
