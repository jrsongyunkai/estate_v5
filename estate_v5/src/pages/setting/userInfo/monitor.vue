<template>
  <div class="monitor">
    <h2>{{ $t('menuConfig') }}</h2>
    <div class="radio-box-monitor">
      <RadioGroup v-model="openAndClose" type="button">
        <Radio :label="'1'">{{ $t('enabled') }}</Radio>
        <Radio :label="'2'">{{ $t('disabled') }}</Radio>
      </RadioGroup>
    </div>
    <Row v-for="(menu, index) in menuList" class="row-group-menu" :class="{ topBorder: index === 0 }" :key="menu.path">
      <Col class="pdconsole" :span="3">
        <Checkbox :value="checkAllArr[index]" :indeterminate="indeterminateArr[index]" :disabled="openAndClose === '2'" @on-change="v => checkedChecked(v, index)">{{ getLabelName(menu.title) }}</Checkbox>
      </Col>
      <Col :span="21" style="padding: 10px 0px">
        <div v-for="item in menu.children" :key="item.label" class="list-monitor-item-box" :class="{ 'list-monitor-item-box-list': item.children && item.children.length > 0 }">
          <template v-if="item.children && item.children.length > 0">
            <Checkbox :value="checkCheckedChild(item)" :indeterminate="isAllCheckedChild(item)" @on-change="v => changeChecked(v, item)" :disabled="openAndClose === '2' || item.isDisabled" class="list-monitor-item">
              <span @click.stop="openToopTip" class="click-box">{{ getLabelName(item.label) }}</span>
            </Checkbox>
            <div class="sub-item-list">
              <div v-for="it in item.children" :key="it.label" class="list-monitor-item-box">
                <Checkbox v-model="it.isChecked" :disabled="openAndClose === '2' || it.isDisabled" class="list-monitor-item">
                  <span @click.stop="openToopTip" class="click-box">{{ getLabelName(it.label) }}</span>
                </Checkbox>
              </div>
            </div>
          </template>
          <template v-else>
            <Checkbox v-model="item.isChecked" :disabled="openAndClose === '2' || item.isDisabled" class="list-monitor-item">
              <span @click.stop="openToopTip" class="click-box">{{ getLabelName(item.label) }}</span>
            </Checkbox>
          </template>
        </div>
      </Col>
    </Row>
    <Button type="primary" style="margin-top: 20px" @click="handleShowMenus">{{ $t('save') }}</Button>
  </div>
</template>
<script>
  import store from '@/store'
  import { saveMenuConfig, queryMenuConfig } from '@/api/public'
  import menuMixins from './mixins/menuMixins'
  export default {
    data() {
      return { openAndClose: '2' }
    },
    mixins: [menuMixins],
    created() {
      this.getConfig()
    },
    mounted() {},
    inject: ['reload'],
    methods: {
      openToopTip() {
        if (this.openAndClose === '2') return this.$Message.error({ content: this.$t('accountMenuDisabled') })
      },
      async getConfig(isChange = false) {
        const res = await queryMenuConfig()
        if (res.success) {
          this.openAndClose = res.data.isUse ? '1' : '2'
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
        let params = { isUse: this.openAndClose === '1', ...obj }
        const res = await saveMenuConfig(params)
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
  .monitor {
    .ivu-checkbox-disabled .ivu-checkbox-inner {
      border: 1px solid #3d3d41;
      background: #28282b;
    }
    .row-group-menu {
      border-bottom: 1px solid #3d3d41;
      border-left: 1px solid #3d3d41;
      border-right: 1px solid #3d3d41;
    }
    .row-group-menu.topBorder {
      border: 1px solid #3d3d41;
    }
    .radio-box-monitor {
      margin-top: 15px;
      margin-bottom: 15px;
      .ivu-radio-group-button .ivu-radio-wrapper:first-child {
        border-radius: 4px 0 0 4px;
        border-left: 1px solid #3d3d41;
      }
    }
    .click-box {
      width: 15px;
      height: 15px;
      z-index: 20;
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
      margin-left: 20px;
      margin-top: 5px;
      margin-bottom: 5px;
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
    .list-monitor-item {
      position: relative;
    }
    .list-monitor {
      width: 140px;
      margin-top: 10px;
      margin-left: 20px;
      position: relative;
    }
  }
</style>
