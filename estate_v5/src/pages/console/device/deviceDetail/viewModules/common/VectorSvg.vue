<template>
  <span class="vector-svg" :class="{ current: type !== 'current' }" :style="{ '--fillColor': color, '--lineWidth': `${lineWidth}px`, '--lineMargin': `${lineWidth / 2}px` }">
    <template v-if="type === 'current'">
      <svg preserveAspectRatio="xMinYMid meet" viewBox="0 0 128 128">
        <polygon points="64,28 128,64 64,100 0,64" :fill="color" :stroke="color" />
      </svg>
    </template>
    <template v-else>
      <svg preserveAspectRatio="xMinYMid meet" viewBox="0 0 128 128">
        <polygon :fill="color" points="128 64 0 20 0 64 0 108 128 64" />
      </svg>
    </template>
  </span>
</template>
<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'current',
      },
      color: {
        type: String,
        default: '#e2e81b',
      },
      lineWidth: {
        type: Number,
        default: 3,
      },
    },
    data() {
      return {}
    },
  }
</script>

<style lang="less" scoped>
  .vector-svg {
    display: inline-flex;
    height: 20px;
    align-items: center;
    position: relative;
    width: 100%;
    &::after {
      content: '';
      display: block;
      height: ~'var(--lineWidth)';
      width: calc(~'100% - 16px');
      background: ~'var(--fillColor)';
      position: absolute;
      left: 0px;
      top: calc(~'50% - var(--lineMargin))');
    }
    svg {
      height: 20px;
      width: 20px;
      position: absolute;
      right: 0px;
      top: 0px;
    }
    &:hover {
      transform: scaleY(1.1);
    }
  }
  .vector-svg.current {
    &::after {
      width: calc(~'100% - 19px');
    }
  }
</style>
