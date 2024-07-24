<template>
  <div id="container" :style="baseStyle"></div>
</template>
<script>
  import { Venn } from '@antv/g2plot'
  const colorMap = {
    1: '#e03c3a',
    2: '#e0e71c',
    3: '#ea903a',
    4: '#de3384',
    5: '#0096ff',
  }

  let nameTypeMap = {}

  export default {
    props: ['options'],
    data() {
      return {
        baseStyle: { height: '230px' },
      }
    },
    mounted() {
      this.handleVeen()
    },
    methods: {
      handleVeen() {
        setTimeout(() => {
          let data = []
          nameTypeMap = this.options.reduce((pre, cur) => {
            pre[cur.name] = cur.type
            return pre
          }, {})
          this.options.map(val => {
            data.push({
              sets: Array.isArray(val.name) ? val.name : [val.name],
              size: val.total === 0 ? 10 : 10 + val.total,
              label: val.total,
              type: val.type,
            })
          })
          const plot = new Venn('container', {
            data: data,
            autoFit: true,
            color: ['#e03c3a', '#e0e71c', '#ea903a', '#de3384', '#0096ff'],
            blendMode: 'normal',
            legend: false,
            setsField: 'sets',
            sizeField: 'size',
            pointStyle: ({ sets }) => {
              return {
                fillOpacity: 0.1,
                fill: colorMap[nameTypeMap[sets[0]]],

                stroke: colorMap[nameTypeMap[sets[0]]],
                // opacity: 0.1
              }
            },
            label: {
              formatter: datum => {
                return datum.sets.length >= 2 ? '' : datum.label
              },
            },
            tooltip: {
              fields: ['label', 'size', 'sets'],
              formatter: datum => {
                return { name: `${datum.sets}`, value: datum.size - 10 }
              },
            },
          })
          plot.render()
        }, 1000)
      },
    },
  }
</script>
