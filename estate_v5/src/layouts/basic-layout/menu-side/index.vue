<template>
  <div class="menuside">
    <div class="menu">
      <div class="i-layout-sider-logo" :class="{ 'i-layout-sider-logo-dark': siderTheme === 'dark' }">
        <transition name="fade-quick">
          <i-link to="/" v-show="!hideLogo">
            <img src="@/assets/images/logo-small.png" v-if="menuCollapse" />
            <img src="@/assets/images/logo.png" v-else-if="siderTheme === 'light'" />
            <img src="@/assets/images/logo-dark.png" v-else />
          </i-link>
        </transition>
      </div>
      <Menu ref="menu" class="i-layout-menu-side i-scrollbar-hide menus" :class="{ 'i-layout-menu-side-collapse': menuCollapse }" :theme="siderTheme" :accordion="menuAccordion" :active-name="activePath" :open-names="openNames" width="auto">
        <div>
          <template v-for="(item, index) in filterSider">
            <template v-if="!menuCollapse">
              <i-menu-side-item v-if="item.children === undefined || !item.children.length" :menu="item" :key="index" />
              <i-menu-side-submenu v-else :menu="item" :key="index" />
            </template>
            <template v-else>
              <Tooltip :content="tTitle(item.title)" placement="right" v-if="item.children === undefined || !item.children.length" :key="index">
                <i-menu-side-item :menu="item" hide-title />
              </Tooltip>
              <i-menu-side-collapse v-else :menu="item" :key="index" top-level />
            </template>
          </template>
        </div>
        <div class="version" @click="handleVersion('1')">{{ versionNum }}</div>
      </Menu>
    </div>
    <Modal v-model="versionStatus" width="1400" class="versionModel" :fullscreen="fullscreenModal" class-name="versionModelMask">
      <div slot="header">
        <div style="display: flex; justify-content: space-between">
          <div>{{ $t('versionCharacteristics') }}</div>
          <div class="mar-full pd-t">
            <Icon custom="icon-v5 icon-v5-quanjufangda1_full-screen-one" v-if="!fullscreenModal" @click="getModalChange(true)" />
            <Icon custom="icon-v5 icon-v5-quanpingshouqi" style="font-size: 20px" v-if="fullscreenModal" @click="getModalChange(false)" />
          </div>
        </div>
      </div>
      <Row class="versionMenu">
        <Col :span="5">
          <div class="menuVersionClass">
            <Menu :theme="theme" @on-select="handleMenuSelect" :active-name="active">
              <MenuItem v-for="item in versionList" :key="item.id" :name="item.id">
                <div @click="handleItem(item)">
                  <template v-if="item.tag === '1,2,3'">
                    <i class="icon-v5 icon-v5-shoucangxiao"></i>
                    <i class="icon-v5 icon-v5-weixianyuan"></i>
                    {{ item.version }}
                    <i class="newData"></i>
                  </template>
                  <template v-if="item.tag === '2,3'">
                    <i class="icon-v5 icon-v5-shoucangxiao"></i>
                    <i class="icon-v5 icon-v5-weixianyuan"></i>
                    {{ item.version }}
                  </template>
                  <template v-if="item.tag === '1,2'">
                    <i class="icon-v5 icon-v5-shoucangxiao"></i>
                    {{ item.version }}
                    <i class="newData"></i>
                  </template>
                  <template v-if="item.tag === '1'">
                    {{ item.version }}
                    <i class="newData"></i>
                  </template>
                  <template v-if="item.tag === '2'">
                    <i class="icon-v5 icon-v5-shoucangxiao"></i>
                    {{ item.version }}
                  </template>
                  <template v-if="item.tag === '3'">
                    <i class="icon-v5 icon-v5-weixianyuan"></i>
                    {{ item.version }}
                  </template>
                  <template v-if="item.tag === '1,3'">
                    <i class="icon-v5 icon-v5-weixianyuan"></i>
                    {{ item.version }}
                    <i class="newData"></i>
                  </template>
                  <template v-if="item.tag === '0' || item.tag === ''">
                    {{ item.version }}
                  </template>
                </div>
              </MenuItem>
            </Menu>
          </div>
        </Col>
        <Col><div :class="fullscreenModal ? 'border-height' : 'line-border'"></div></Col>
        <Col class="content" :span="18">
          <div class="menuVersionClass" :class="fullscreenModal ? 'full-height' : 'default-height'">
            <template v-if="this.versionList.length > 0">
              <h2>{{ title }}</h2>
              <h3 style="margin-bottom: 30px">{{ time }}</h3>
              <h3 style="margin-bottom: 10px">{{ $t('changeContentAs') }}:</h3>
            </template>
            <div v-html="content" @click="wrapClick($event, content)" id="content_html" data-leaves="47"></div>
            <el-image-viewer v-if="showViewer" :z-index="20000" :on-close="closeViewer" :url-list="srcList" />
          </div>
        </Col>
      </Row>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store/index'
  import iMenuSideItem from './menu-item'
  import iMenuSideSubmenu from './submenu'
  import iMenuSideCollapse from './menu-collapse'
  import tTitle from '../mixins/translate-title'
  import { mapState, mapGetters } from 'vuex'
  import { sliderList, menuObjArr } from '@/menu/controlMenuSider'
  import { queryUserProjectMemu, felist, findContent, doRate, getRate } from '@/api/public'
  import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
  import { queryMenusByProjectCode } from '@api/quicklyMenu/quicklyMenu'
  import { getSketchMenu } from '@/api/multiManage/diagram'
  import { cloneDeep } from 'lodash'
  // 元素是否在可视区域
  function isElementInViewport(el) {
    let rect = el.getBoundingClientRect()
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  }
  export default {
    name: 'iMenuSide',
    data() {
      return {
        fullscreenModal: false,
        proSider: [],
        theme: 'dark',
        showViewer: false,
        versionList: [],
        active: 1,
        content: '',
        time: '',
        title: '',
        problemRate: 0,
        versionStatus: this.$store.state.versionStatus,
        rateid: [],
        versionNum: this.$store.state.versionNum,
      }
    },
    mixins: [tTitle],
    components: { iMenuSideItem, iMenuSideSubmenu, iMenuSideCollapse, ElImageViewer },
    props: {
      hideLogo: { type: Boolean, default: false },
    },
    inject: ['reload'],
    computed: {
      ...mapState('admin/layout', ['siderTheme', 'menuAccordion', 'menuCollapse']),
      ...mapState('admin/menu', ['activePath', 'openNames']),
      ...mapGetters('admin/menu', ['filterSider']),
      projectCode() {
        return this.$store.state.projectCode
      },
    },
    created() {},
    watch: {
      $route: {
        handler() {
          this.handleUpdateMenuState()
        },
        immediate: true,
      },
      menuCollapse() {
        this.handleUpdateMenuState()
      },
      '$store.state.showMenus': {
        handler() {
          this.handleFilter()
        },
        immediate: true,
      },
      versionStatus: {
        handler(newVal) {
          if (!newVal) {
            document.getElementsByClassName('versionModelMask')[0].firstChild.style = `width:1400px;animation: dialogSlipUp 2s linear;animation-fill-mode: forwards;`
          } else {
            document.getElementsByClassName('versionModelMask')[0].firstChild.style = `width:1400px;animation: dialogSlipToBottom 1s linear;animation-fill-mode: forwards;`
          }
        },
      },
    },
    mounted() {
      if (this.versionStatus) {
        this.handleVersion()
      }
    },
    methods: {
      getModalChange(val) {
        if (val) {
          const element = document.getElementsByClassName('versionModelMask')[0].firstChild
          element.style.animation = ''
          element.style.transition = ''
        }
        this.fullscreenModal = val
      },
      closeViewer() {
        this.showViewer = false
      },
      handleItem(item) {
        this.time = item.createTime
        this.title = item.title
      },
      handleUpdateMenuState() {
        this.$nextTick(() => {
          if (this.$refs.menu) {
            this.$refs.menu.updateActiveName()
            if (this.menuAccordion) this.$refs.menu.updateOpened()
            this.$nextTick(() => {
              const $activeMenu = document.getElementsByClassName('ivu-menu-item ivu-menu-item-active ivu-menu-item-selected')
              if ($activeMenu && $activeMenu.length && !isElementInViewport($activeMenu[0])) {
                const activeMenuTop = $activeMenu[0].getBoundingClientRect().top
                const $menu = this.$refs.menu.$el
                setTimeout(() => {
                  this.$ScrollTop($menu, { to: activeMenuTop, time: 0 })
                }, 300)
              }
            })
          }
        })
      },
      returnQuickMenuItem(data) {
        const { id, openWay, link, menuName, iconUrl } = data
        const path = openWay === 1 ? `/quicklyMenu?link=${encodeURIComponent(link)}&id=${id}` : link
        const target = openWay === 1 ? '_self' : '_blank'
        return { path, title: menuName, target, custom: iconUrl, isCustom: 1 }
      },
      async handleFilter() {
        let Sider = cloneDeep(sliderList)
        let sliderArr = cloneDeep(sliderList)
        const { data: quickMenuList } = await queryMenusByProjectCode({ projectCode: this.$store.state.projectCode })
        const { data: sketchListMenu } = await getSketchMenu({ projectCode: this.$store.state.projectCode })
        const orderMenu = [...(quickMenuList || []), ...(sketchListMenu || [])].sort((a, b) => (a.menuOrder === b.menuOrder ? b.createTime - a.createTime : b.menuOrder - a.menuOrder))
        if (Array.isArray(orderMenu) && orderMenu.length) {
          orderMenu.forEach(item => {
            const putHare = item.parentMenu ? JSON.parse(item.parentMenu) : []
            let innerIndex = item.menuOrder
            let innerMenu = item.link ? { ...this.returnQuickMenuItem(item) } : { ...this.returnSketchMenuItem(item) }
            if (item.menuLevel === 0) {
              sliderArr[innerIndex] ? sliderArr.splice(innerIndex, 0, innerMenu) : sliderArr.push(innerMenu)
            } else if (item.menuLevel === 1) {
              const findIndex = sliderArr.findIndex(item => item.path === putHare[0])
              if (sliderArr[findIndex].children) {
                sliderArr[findIndex].children[innerIndex] ? sliderArr[findIndex].children.splice(innerIndex, 0, innerMenu) : sliderArr[findIndex].children.push(innerMenu)
              } else {
                sliderArr[findIndex].children = [innerMenu]
              }
            } else if (item.menuLevel === 2) {
              const findIndex = sliderArr.findIndex(item => item.path === putHare[0])
              let innerIndex2 = sliderArr[findIndex].children.findIndex(item => item.path === putHare[1])
              if (sliderArr[findIndex].children[innerIndex2].children) {
                sliderArr[findIndex].children[innerIndex2].children[innerIndex] ? sliderArr[findIndex].children[innerIndex2].children.splice(innerIndex, 0, innerMenu) : sliderArr[findIndex].children[innerIndex2].children.push(innerMenu)
              } else {
                sliderArr[findIndex].children[innerIndex2].children = [innerMenu]
              }
            }
          })
        }
        const res = await queryUserProjectMemu({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          let keys = [...menuObjArr.keys()]
          sliderArr.forEach((v, i) => {
            for (let key of keys) {
              if (v.path && v.path === `/${key}`) {
                let configListValues = (res.data[menuObjArr.get(key)] && res.data[menuObjArr.get(key)].split(',')) || []
                v.children = this.getFilterChild(v.children, configListValues)
              }
            }
          })
          Sider = sliderArr.filter(v => !v.children || v.children.length > 0)
          this.$store.commit('admin/menu/setSider', [...Sider])
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getFilterChild(arr, list) {
        let arrList = arr.filter(j => list.includes(`${j.isVisibleValue}`) || j.isCustom)
        arrList.forEach(it => {
          if (it.children && it.children.length > 0) {
            it.children = this.getFilterChild(it.children, list)
          }
        })
        return arrList
      },
      returnSketchMenuItem(item) {
        const { tabType, name, id, code } = item
        return {
          path: tabType === 1 ? `/sketch?code=${code}` : `/multiManage/diagram/detail/${id}`,
          target: tabType === 1 ? '_blank' : '_self',
          title: name,
          custom: 'icon-v5 icon-v5-peidiantutongyongchakan',
          isCustom: 1,
        }
      },
      async handleVersion(type) {
        let params = { alwaysShow: type }
        this.content = ''
        const res = await felist(params)
        if (res.success) {
          store.commit('versionStatus', false)
          this.versionStatus = true
          this.versionList = res.datas.map(val => ({ version: val.version, id: val.id, title: val.title, tag: val.tags, createTime: val.createTime }))
          setTimeout(() => {
            this.time = this.versionList[0].createTime
            this.title = this.versionList[0].title
            this.active = this.versionList[0].id
            this.handleFindContent(this.active)
          }, 0)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      wrapClick(event, item) {
        const target = event.target
        if (target.tagName === 'IMG') {
          event.preventDefault()
          const content = item
          const imgReg = /<img.*?(?:>|\/>)/gi // 匹配图片中的img标签
          const srcReg = /src=['"]?([^'"]*)['"]?/i // 匹配图片中的src
          const arr = content.match(imgReg) // 筛选出所有的img
          const srcArr = []
          for (const element of arr) {
            const src = element.match(srcReg)
            srcArr.push(src[1])
          }
          this.srcList = srcArr
          this.srcList.unshift(event.target.src)
          const set = new Set(this.srcList)
          this.srcList = Array.from(set)
          this.showViewer = true
        }
      },
      handleFindContent(id) {
        findContent({ id }).then(res => {
          this.content = res.data
          let arr = document.getElementById('content_html')
          this.$nextTick(() => {
            let newArr = Array.from(arr.getElementsByTagName('div'))
            this.rateid = []
            newArr.forEach(val => {
              this.rateid.push(val.getAttribute('rateid'))
              val.innerHTML = `<span class="star">
                                <b class="ct-star"></b>
                                <b class="ct-star"></b>
                                <b class="ct-star"></b>
                                <b class="ct-star"></b>
                                <b class="ct-star"></b>
                            </span>`
            })
            let aSpan = document.getElementsByClassName('star')
            let newaSpan = Array.from(aSpan)
            let num = 0
            this.handleGetRate(this.active, this.rateid, newaSpan)
            let id = this.active
            newaSpan.forEach((val, index) => {
              for (let i = 0; i < val.getElementsByTagName('b').length; i++) {
                val.getElementsByTagName('b')[i].index = i
                // 鼠标点击
                val.getElementsByTagName('b')[i].onclick = function () {
                  // 先清空
                  for (const element of val.getElementsByTagName('b')) {
                    element.className = 'ct-star'
                  }
                  // 点击当前星星，之前的都点亮包含自己
                  num = this.index
                  for (let j = 0; j <= this.index; j++) {
                    val.getElementsByTagName('b')[j].className = 'ct-star ct-star2'
                  }
                }
              }
              let that = this
              function handleDoRate(rateid) {
                let params = { id: id, rateId: rateid, star: num + 1 }
                doRate(params).then(res => {
                  if (res.success) {
                    that.$Message.success({ content: res.message })
                  } else {
                    that.$Message.error({ content: res.message })
                  }
                })
              }
              val.onclick = function () {
                handleDoRate(newArr[index].getAttribute('rateid'))
              }
            })
          })
        })
      },
      handleGetRate(id, rateid, newaSpan) {
        this.rateid.map((val, ind) => {
          let params = { id: id, rateId: val, type: '1' }
          getRate(params).then(res => {
            if (res.success) {
              for (let j = 0; j <= res.data.starRated - 1; j++) {
                newaSpan[ind].getElementsByTagName('b')[j].className = 'ct-star ct-star2'
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        })
      },
      handleMenuSelect(val) {
        this.handleFindContent(val)
      },
    },
  }
</script>
<style lang="less">
  // .ivu-menu-submenu-title {
  //   padding: 14px 30px !important;
  // }
  .menuVersionClass {
    width: 100%;
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
      width: 0px;
    }
  }
  .full-height {
    height: calc(100vh);
  }
  .default-height {
    height: 600px;
  }
  .versionModel {
    .ivu-modal-footer {
      padding: 0;
    }
  }
  .mar-full {
    margin-right: 25px;
  }
  .pd-t {
    padding-top: 2px;
  }
  #content_html {
    img {
      width: 100%;
    }
    p {
      img {
        width: 100%;
      }
    }
    .ql-video {
      width: 700px;
      height: 500px;
    }
  }

  @keyframes dialogSlipToBottom {
    0% {
      top: 100%;
      opacity: 0.3;
      transform: translate(-100%, 0%);
    }
    100% {
      top: 10%;
      opacity: 1;
      transform: translate(0, 0);
    }
  }
  @keyframes dialogSlipUp {
    0% {
      top: 10%;
      opacity: 1;
      transform: translate(0, 0);
    }
    100% {
      top: 100%;
      opacity: 0.3;
      //  transform: translate(0, 0);
    }
  }

  .versionMenu {
    i {
      color: #f4ea2a;
    }

    .ivu-menu-item {
      background: #303642 !important;
      margin: 10px;
      border-radius: 10px;
      color: #fff !important;
    }
    .ivu-menu-item-active {
      background: #02a7f0 !important;
    }
    .ivu-menu-item:hover {
      background: rgba(2, 167, 240, 0.5) !important;
    }
    .newData {
      width: 34px;
      height: 34px;
      position: absolute;
      right: 0px;
      top: 0px;
      transform: rotate(1deg);
      background: url('../../../assets/images/new.png');
    }
    .line-border {
      width: 1px;
      height: calc(100%);
      margin: 5px 25px 10px 0;
      border: 1px solid #797979;
    }
    .border-height {
      width: 1px;
      height: calc(100vh);
      margin: 10px 25px 0 0;
      border: 1px solid #797979;
    }
    .content {
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .export {
          background: rgba(0, 126, 255, 0.1);
          border: 1px solid #007eff;
          border-radius: 5px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 10px;
          .ivu-icon {
            color: #007eff;
            margin: 0 !important;
          }
        }
      }
      .time {
        color: #898a8e;
        font-size: 12px;
      }
      .explain {
        margin-top: 20px;
        margin-bottom: 40px;
      }
      .problem {
        .problemHeader {
          display: flex;
          align-items: center;
          h2 {
            margin-right: 30px;
          }
          span {
            i {
              color: #078ecc;
            }
          }
        }
        ul {
          margin-top: 20px;
          padding-left: 20px;
          li {
            margin: 15px 0px;
          }
        }
        .problemEvaluation {
          width: 600px;
          margin-top: 30px;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .menuside {
    .menus {
      .version {
        width: 100%;
        text-align: center;
        height: 30px;
        line-height: 30px;
        background: rgba(2, 167, 240, 0.2);
        border-top: 1px solid #02a7f0;
        color: #02a7f0;
        cursor: pointer;
      }
    }

    .ct-star {
      display: inline-block;
      margin: 0 1px;
      width: 19px;
      height: 19px;
      background: url('../../../assets/images/star.png') no-repeat;
      background-size: 100% 100%;
      vertical-align: -2px;
      cursor: pointer;
    }
    .ct-star2 {
      background: url('../../../assets/images/star-fill.png') no-repeat !important;
      background-size: 100% 100% !important;
    }
    .ic-star-off {
      background-position: -39px 0;
    }
  }
</style>
