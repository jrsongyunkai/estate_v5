<template>
  <div>
    <div class="menusConfig">
      <h2 style="margin-bottom: 10px">{{ $t('menuConfig') }}</h2>
      <Row v-for="(menu, index) in menuList" class="row-group-menu" :key="index">
        <Col class="pdconsole" :span="4">
          <Checkbox :value="checkAllArr[index]" :indeterminate="indeterminateArr[index]" @on-change="v => checkedChecked(v, index)">{{ getLabelName(menu.title) }}</Checkbox>
        </Col>
        <Col :span="20" style="padding: 10px 0px">
          <div v-for="item in menu.children" :key="item.label" class="list-monitor-item-box" :class="{ 'list-monitor-item-box-list': item.children && item.children.length > 0 }">
            <template v-if="item.children && item.children.length > 0">
              <Checkbox :value="checkCheckedChild(item)" :indeterminate="isAllCheckedChild(item)" @on-change="v => changeChecked(v, item)" :disabled="item.isDisabled" class="list-monitor-item">
                {{ getLabelName(item.label) }}
              </Checkbox>
              <div class="sub-item-list">
                <div v-for="it in item.children" :key="it.label" class="list-monitor-item-box">
                  <Checkbox v-model="it.isChecked" :disabled="it.isDisabled" class="list-monitor-item">{{ getLabelName(it.label) }}</Checkbox>
                </div>
              </div>
            </template>
            <template v-else>
              <Checkbox v-model="item.isChecked" :disabled="item.isDisabled" class="list-monitor-item">{{ getLabelName(item.label) }}</Checkbox>
            </template>
          </div>
        </Col>
      </Row>
      <Button type="primary" style="margin-top: 20px" @click="handleShowMenus">{{ $t('save') }}</Button>
    </div>
    <QuickLinkForMenu />
  </div>
</template>
<script>
  import store from '@/store'
  import QuickLinkForMenu from './modules/QuickLinkForMenu.vue'
  import { projectsaveMenuConfig, projectQueryMenuConfig } from '@/api/public'
  import menuMixins from './mixins/menuMixins'
  export default {
    data() {
      return {}
    },
    mixins: [menuMixins],
    components: { QuickLinkForMenu },
    created() {
      this.getConfig()
    },
    inject: ['reload'],
    methods: {
      async getConfig(isChange = false) {
        const res = await projectQueryMenuConfig({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.menuList.forEach(it => {
            let selectArr = (res.data[it.value] && res.data[it.value].split(',')) || []
            it.children.forEach(v => {
              if (v.children && v.children.length > 0) {
                v.children.forEach(r => {
                  r.isChecked = selectArr.includes(`${r.value}`)
                })
              } else {
                v.isChecked = selectArr.includes(`${v.value}`)
              }
            })
          })
          if (isChange) {
            store.commit('showMenus', Math.random())
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleShowMenus() {
        let obj = {}
        this.selectedMenus.forEach(it => {
          let str = it.children.map(v => v.value)
          it.children
            .filter(v => v.children && v.children.length > 0)
            .forEach(v => {
              let child = v.children.map(r => r.value)
              str = str.concat(child)
            })
          obj[it.value] = str.join(',')
        })
        let params = { projectCode: this.$store.state.projectCode, ...obj }
        const res = await projectsaveMenuConfig(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('savedSuccessfully') })
          this.getConfig(true)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .menusConfig {
    background: #19202e;
    padding: 20px;
    .row-group-menu {
      border-bottom: 1px solid #3d3d41;
      border-left: 1px solid #3d3d41;
      border-right: 1px solid #3d3d41;
      &:nth-of-type(1) {
        border: 1px solid #3d3d41;
      }
    }
    .pdconsole {
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #3d3d41;
    }
    .list-monitor-item-box {
      width: 160px;
      display: inline-block;
      margin-top: 5px;
      margin-bottom: 5px;
      margin-left: 20px;
    }
    .list-monitor-item-box-list {
      width: 100%;
      display: block;
      .sub-item-list {
        position: relative;
        padding-left: 10px;
        padding-top: 5px;
        &::before {
          content: '';
          display: block;
          height: calc(~'100% - 7px');
          width: 1px;
          background: #afafbf;
          position: absolute;
          left: 8px;
          top: 7px;
        }
      }
    }
  }
</style>
