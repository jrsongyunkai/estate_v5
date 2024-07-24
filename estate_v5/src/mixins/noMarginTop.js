// 去除页面的顶部边距，用于设备详情页面，以及部分不需要顶部间距的子页面

export default {
  activated() {
    let contentDom = document.querySelector('.i-layout-content-with-tabs-fix .i-layout-content-main')
    if (contentDom) {
      contentDom.style.margin = '1px'
      contentDom.style.marginTop = '61px'
    }
  },
  destroyed() {
    let contentDom = document.querySelector('.i-layout-content-with-tabs-fix .i-layout-content-main')
    if (contentDom) {
      contentDom.style.margin = '12px'
      contentDom.style.marginTop = '70px'
    }
  },
  mounted() {
    let contentDom = document.querySelector('.i-layout-content-with-tabs-fix .i-layout-content-main')
    if (contentDom) {
      contentDom.style.margin = '1px'
      contentDom.style.marginTop = '61px'
    }
  },
}
