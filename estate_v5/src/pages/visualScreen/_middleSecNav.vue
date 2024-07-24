<template>
  <div class="content_middleSec tc">
    <Row type="flex" justify="center">
      <Col class="content_middle_col" v-for="(item, i) in industryTypesData" @click="open(i)" :key="i">
        <img class="img" :src="item.imgSrc" alt="" srcset="" />
        <div class="img_row_art" ref="col" @click="open(i)" :class="{ active: active == i }">{{ item.name }}</div>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    props: {
      industryTypesData: Array,
    },
    components: {},
    data() {
      return {
        active: 0,
      }
    },
    created() {},
    mounted() {},
    methods: {
      open(i) {
        this.active = i
        this.industryTypesData.forEach((v, f) => {
          if (f === i) {
            v.imgSrc = require('../../assets/images/btn.gif')
          } else {
            v.imgSrc = require('../../assets/images/code-single.png')
          }
        })
        this.$emit('changeProjectShow', this.industryTypesData[i].code)
      },
    },
    watch: {},
  }
</script>

<style lang="less" scoped>
  .active {
    color: #74ffff !important;
  }
  .content_middleSec {
    width: 100%;
    .content_middle_col {
      padding: 0 5px;
      position: relative;
      .img {
        width: 100%;
      }
      .img_row_art {
        position: absolute;
        cursor: pointer;
        top: 35%;
        left: 50%;
        margin-left: -52%;
        width: 100%;
        // font-style:italic;
        // font-family: 'SimHei';
        font-size: 18px;
        // text-shadow: 5px 5px 5px black, 0px 0px 2px black; // 没错这里设置了两个 shadow
        color: #bae7ff;
      }
    }
  }
  @media only screen and (min-width: 1024px) {
    .content_middle_col {
      width: 80px;
    }
  }
  @media only screen and (min-width: 1366px) {
    .content_middle_col {
      width: 120px;
    }
  }
  @media only screen and (min-width: 1920px) {
    .content_middle_col {
      width: 140px;
    }
  }
</style>
