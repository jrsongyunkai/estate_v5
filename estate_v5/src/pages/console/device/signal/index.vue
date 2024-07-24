<template>
  <Tooltip :content="tooltipContent" transfer>
    <img class="signal-icon" :src="iconSrc" alt="" :style="iconStyle" />
    <template #content>
      <div :style="{ color: tooltipContentColor }">{{ tooltipContent }}</div>
    </template>
  </Tooltip>
</template>

<script>
  import { SIGNAL_TYPE, SIGNAL_TYPE_NAME, SIGNAL_TYPE_ICON, SIGNAL_LEVEL_NAME, SIGNAL_LEVEL_COLOR } from './constants'

  export default {
    props: {
      type: {
        type: Number,
        default: SIGNAL_TYPE.UNKNOWN,
      },
      value: {
        type: Number,
        default: 0,
      },
      size: {
        type: Number,
        default: 30,
      },
    },
    computed: {
      level() {
        const breakPoints = [0, 60, 70, 85, 100]
        if (this.value > breakPoints.at(-1)) {
          return breakPoints.length - 1
        }
        for (let i = 0; i < breakPoints.length; i++) {
          if (this.value <= breakPoints[i]) {
            return i
          }
        }
      },
      tooltipContent() {
        return `${this.$t('current2')}${SIGNAL_TYPE_NAME[this.type]}${this.$t('signal')}${SIGNAL_LEVEL_NAME[this.level]}，${this.$t('signalValue')}${this.value}`
      },
      tooltipContentColor() {
        return SIGNAL_LEVEL_COLOR[this.level]
      },
      iconStyle() {
        return {
          width: `${this.size}px`,
          height: `${this.size}px`,
        }
      },
      iconSrc() {
        return `/static/img/signal/${SIGNAL_TYPE_ICON[this.type]}-${this.level}.svg`
      },
    },
  }
</script>

<style lang="less" scoped>
  .signal-icon {
    display: block;
  }
</style>
