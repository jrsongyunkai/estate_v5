<template>
  <div class="multiple-pen-props">
    <Collapse simple>
      <Panel name="A1">
        <div class="collapse-title">{{ $t('align_Reference') }}</div>
        <template #content>
          <div class="align-icon-box">
            <Icon class="align-icon" v-for="(item, i) in alignIcons1" :key="i" :custom="`icon-v5 ${item.icon}`" :title="item.title" @click="item.fun" />
          </div>
        </template>
      </Panel>
      <Panel name="A2">
        <div class="collapse-title">{{ $t('align_ReferringFirstSelectedNode') }}</div>
        <template #content>
          <div class="align-icon-box">
            <Icon class="align-icon" v-for="(item, i) in alignIcons2" :key="i" :custom="`icon-v5 ${item.icon}`" :title="item.title" @click="item.fun" />
          </div>
        </template>
      </Panel>
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
  import { dashOptions, lineCapOptions, lineJoinOptions, strokeTypeOptions, fontFamilyOptions, fontStyleOptions, fontWeightOptions, textAlignOptions, textBaselineOptions, whiteSpaceOptions } from '../../util/process'
  export default {
    data() {
      return {
        commonPenAttr: {
          dash: 0,
          lineDash: [],
          lineWidth: 10,
          lineCap: 'butt',
          lineJoin: 'miter',
          strokeType: '0',
          color: 'rgba(179, 152, 162, 1)',
          lineGradientColors: 'linear-gradient(90deg,rgba(255, 98, 46, 1) 0%,rgb(255, 98, 46) 18%,rgb(204, 0, 0) 20%,rgb(255, 98, 46) 50%,rgb(204, 0, 0) 80%,rgb(255, 98, 46) 82%,rgb(255, 98, 46) 100%)',
          globalAlpha: 0,
          background: '',
          fontFamily: '',
          fontSize: 0,
          textColor: '',
          hoverTextColor: '',
          activeTextColor: '',
          textBackground: '',
          fontStyle: 'normal',
          fontWeight: '300',
          textAlign: '',
          textBaseline: '',
          lineHeight: 0,
          whiteSpace: '',
          textLeft: 0,
          textTop: 0,
        },
        penConfig: null,
        activePen: null,
        dash: [
          [0, 0],
          [5, 5],
          [10, 10, 2, 10],
        ],
        alignIcons1: [
          { title: this.$t('leftAlignment'), icon: 'icon-v5-duiqi_duiqi_zuoduiqi', fun: () => window.meta2d.alignNodes('left', this.activePen) },
          { title: this.$t('rightAlignment'), icon: 'icon-v5-duiqi_duiqi_youduiqi', fun: () => window.meta2d.alignNodes('right', this.activePen) },
          { title: this.$t('topAlignment'), icon: 'icon-v5-duiqi_duiqi_dingduiqi', fun: () => window.meta2d.alignNodes('top', this.activePen) },
          { title: this.$t('bottomAlignment'), icon: 'icon-v5-duiqi_duiqi_zuoduiqi', fun: () => window.meta2d.alignNodes('bottom', this.activePen) },
          { title: this.$t('centerAlignment'), icon: 'icon-v5-duiqi_duiqi_juzhongduiqi', fun: () => window.meta2d.alignNodes('center', this.activePen) },
          { title: this.$t('textAlignCenter'), icon: 'icon-v5-duiqi_duiqi_chuizhiduiqi', fun: () => window.meta2d.alignNodes('middle', this.activePen) },
          { title: this.$t('equidistantDistributionLeftAndRightAlignment'), icon: 'icon-v5-jurassic_HorCenter-fenbu', fun: () => window.meta2d.spaceBetween(this.activePen) },
          { title: this.$t('equidistantDistributionTopAndBottomAlignment'), icon: 'icon-v5-jurassic_VerCenter-fenbu', fun: () => window.meta2d.spaceBetweenColumn(this.activePen) },
        ],
        alignIcons2: [
          { title: this.$t('leftAlignment'), icon: 'icon-v5-duiqi_duiqi_zuoduiqi', fun: () => window.meta2d.alignNodesByFirst('left', this.activePen) },
          { title: this.$t('rightAlignment'), icon: 'icon-v5-duiqi_duiqi_youduiqi', fun: () => window.meta2d.alignNodesByFirst('right', this.activePen) },
          { title: this.$t('topAlignment'), icon: 'icon-v5-duiqi_duiqi_dingduiqi', fun: () => window.meta2d.alignNodesByFirst('top', this.activePen) },
          { title: this.$t('bottomAlignment'), icon: 'icon-v5-duiqi_duiqi_zuoduiqi', fun: () => window.meta2d.alignNodesByFirst('bottom', this.activePen) },
          { title: this.$t('centerAlignment'), icon: 'icon-v5-duiqi_duiqi_juzhongduiqi', fun: () => window.meta2d.alignNodesByFirst('center', this.activePen) },
          { title: this.$t('textAlignCenter'), icon: 'icon-v5-duiqi_duiqi_chuizhiduiqi', fun: () => window.meta2d.alignNodesByFirst('middle', this.activePen) },
          { title: this.$t('sameSize'), icon: 'icon-v5-fuzhi', fun: () => window.meta2d.beSameByFirst(this.activePen) },
          {
            title: this.$t('formatPainter'),
            icon: 'icon-v5-geshishua',
            fun: () => {
              const [first, ...other] = this.activePen
              for (const i of other) {
                const attrs = Object.keys(this.commonPenAttr).reduce((pre, cur) => {
                  pre[cur] = first[cur]
                  return pre
                }, {})
                window.meta2d.setValue({ id: i.id, ...attrs }, { render: false })
                window.meta2d.setValue({ id: i.id, ...attrs }, { render: false })
              }
              window.meta2d.render()
            },
          },
        ],
      }
    },
    computed: {
      commonPenAttrKeys() {
        return Object.keys(this.commonPenAttr)
      },
      penConfigMap() {
        const activePen = this.activePen
        const dash = this.dash
        return [
          {
            title: this.$t('style'),
            children: [
              {
                formType: 'Select',
                label: this.$t('lineStyle'),
                prop: 'dash',
                colSpan: 24,
                event: 'on-change',
                options: dashOptions,
                attr: { placeholder: this.$t('lineStyle') },
                func(value) {
                  for (const i of activePen) {
                    window.meta2d.setValue({ id: i.id, lineDash: dash[value], dash: value }, { render: false })
                  }
                  window.meta2d.render()
                },
              },
              { formType: 'InputNumber', label: this.$t('lineWidth'), prop: 'lineWidth', colSpan: 24, event: 'on-change', func: this.setValueFunc('lineWidth') },
              { formType: 'Select', label: this.$t('endStyle'), prop: 'lineCap', colSpan: 24, event: 'on-change', options: lineCapOptions, attr: { placeholder: this.$t('endStyle') }, func: this.setValueFunc('lineCap') },
              { formType: 'Select', label: this.$t('connectStyle'), prop: 'lineJoin', colSpan: 24, event: 'on-change', options: lineJoinOptions, attr: { placeholder: this.$t('connectStyle') }, func: this.setValueFunc('lineJoin') },
              { formType: 'Select', label: this.$t('lineGradient'), prop: 'strokeType', colSpan: 24, event: 'on-change', options: strokeTypeOptions, attr: { placeholder: this.$t('lineGradient') }, func: this.setValueFunc('strokeType') },
              { isLoad: this.penConfig.strokeType === '0', formType: 'Color', label: this.$t('colour'), prop: 'color', colSpan: 24, event: 'on-change', func: this.setValueFunc('color') },
              { isLoad: this.penConfig.strokeType === '1', formType: 'Input', label: this.$t('lineGradientColor'), prop: 'lineGradientColors', colSpan: 24, event: 'on-change', func: this.setValueFunc('lineGradientColors') },
              { formType: 'InputNumber', label: this.$t('pellucidity'), prop: 'globalAlpha', colSpan: 24, event: 'on-change', attr: { min: 0, step: 0.1, max: 1 }, func: this.setValueFunc('globalAlpha') },
              { formType: 'Color', label: this.$t('backgroundColor'), prop: 'background', colSpan: 24, event: 'on-change', func: this.setValueFunc('background') },
            ],
          },
          {
            title: this.$t('characters'),
            children: [
              { formType: 'Select', label: this.$t('font'), prop: 'fontFamily', colSpan: 24, event: 'on-change', options: fontFamilyOptions, func: this.setValueFunc('fontFamily'), attr: { placeholder: this.$t('pleaseSelectFont') } },
              { formType: 'InputNumber', label: this.$t('fontSize'), prop: 'fontSize', colSpan: 24, event: 'on-change', func: this.setValueFunc('fontSize') },
              { formType: 'Color', label: this.$t('fontColor'), prop: 'textColor', colSpan: 24, event: 'on-change', func: this.setValueFunc('textColor') },
              { formType: 'Color', label: this.$t('hoverTextColor'), prop: 'hoverTextColor', colSpan: 24, event: 'on-change', func: this.setValueFunc('hoverTextColor') },
              { formType: 'Color', label: this.$t('activeTextColor'), prop: 'activeTextColor', colSpan: 24, event: 'on-change', func: this.setValueFunc('activeTextColor') },
              { formType: 'Color', label: this.$t('textBackground'), prop: 'textBackground', colSpan: 24, event: 'on-change', func: this.setValueFunc('textBackground') },
              { formType: 'Select', label: this.$t('italic'), prop: 'fontStyle', colSpan: 24, event: 'on-change', options: fontStyleOptions, func: this.setValueFunc('fontStyle') },
              { formType: 'Select', label: this.$t('bold'), prop: 'fontWeight', colSpan: 24, event: 'on-change', options: fontWeightOptions, func: this.setValueFunc('fontWeight') },
              { formType: 'Select', label: this.$t('horizontalAlignment'), prop: 'textAlign', colSpan: 24, event: 'on-change', options: textAlignOptions, func: this.setValueFunc('textAlign'), attr: { placeholder: this.$t('pleaseSelectAlignment') } },
              { formType: 'Select', label: this.$t('verticalAlignment'), prop: 'textBaseline', colSpan: 24, event: 'on-change', options: textBaselineOptions, func: this.setValueFunc('textBaseline'), attr: { placeholder: this.$t('pleaseSelectAlignment') } },
              { formType: 'InputNumber', label: this.$t('lineHeight'), prop: 'lineHeight', colSpan: 24, event: 'on-change', attr: { step: 0.1 }, func: this.setValueFunc('lineHeight') },
              { formType: 'Select', label: this.$t('whiteSpace'), prop: 'whiteSpace', colSpan: 24, event: 'on-change', options: whiteSpaceOptions, func: this.setValueFunc('whiteSpace'), attr: { placeholder: this.$t('pleaseSelectWhiteSpace') } },
              { formType: 'InputNumber', label: this.$t('horizontalOffset'), prop: 'textLeft', colSpan: 24, event: 'on-change', func: this.setValueFunc('textLeft') },
              { formType: 'InputNumber', label: this.$t('verticalOffset'), prop: 'textTop', colSpan: 24, event: 'on-change', func: this.setValueFunc('textTop') },
            ],
          },
        ]
      },
    },
    created() {
      this.penConfig = this.getInitPenConfig()
    },
    methods: {
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
      getInitPenConfig() {
        return { ...this.commonPenAttr }
      },
      setValueFunc(prop) {
        return value => {
          const val = value && value.target ? value.target.value : value
          for (const i of this.activePen) {
            window.meta2d.setValue({ id: i.id, [prop]: val }, { render: false })
          }
          window.meta2d.render()
        }
      },
    },
    mounted() {},
    watch: {
      '$store.state.diagram.activePenIds': {
        handler(value) {
          if (window.meta2d) {
            this.activePen = value.map(it => window.meta2d.findOne(it))
            this.mergeProps(this.penConfig, this.getInitPenConfig(), true)
          }
        },
        deep: true,
        immediate: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .multiple-pen-props {
    position: relative;
    top: -1px;
    .align-icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      .align-icon {
        flex: 1;
        cursor: pointer;
        font-size: 20px;
        margin: 4px;
      }
    }
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
