<template>
  <div>
    <div class="navigation">
      <div v-for="(item, index) in stepArr" :key="index">
        <div class="disFlx">
          <div class="roundCyle" :class="isClick === item.step ? 'blueBg' : 'grayBg'">{{ index + 1 }}</div>
          <div v-textRoll class="textStyle pointer" :class="isClick === item.step ? 'bluetext' : ''" @click="getClick(item.step)">{{ item.title }}</div>
        </div>
        <div class="lineColumn" v-if="index + 1 < stepArr.length"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      stepArr: {
        type: Array,
        default: () => [],
        required: true,
      },
    },
    data() {
      return {
        isClick: '',
      }
    },
    mounted() {
      this.isClick = this.stepArr[0].step
    },
    methods: {
      getClick(item) {
        this.isClick = item
        this.$emit('customScroll', item)
      },
    },
  }
</script>

<style lang="less">
  .disFlx {
    display: flex;
  }
  .bluetext {
    color: #1882e5;
  }
  .navigation {
    background: #1a202e;
    border-radius: 5px;
    padding: 20px;
  }
  .blueBg {
    background: #1882e5;
  }
  .grayBg {
    background: #999;
  }
  .textStyle {
    margin: 10px;
    padding: 5px;
  }
  .roundCyle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 10px;
    padding: 5px;
    text-align: center;
    flex-shrink: 0;
  }
  .lineColumn {
    height: 25px;
    width: 1px;
    background: #1882e5;
    margin: 0 25px;
  }
</style>
