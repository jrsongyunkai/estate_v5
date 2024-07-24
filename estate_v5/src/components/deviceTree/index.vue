<template>
  <div class="tree-box" :class="{ fold: isFold }">
    <div class="top-menus">
      <Menu mode="horizontal" :active-name="activeName" @on-select="selectItem">
        <MenuItem name="device">{{ $t('deviceDimension') }}</MenuItem>
        <Submenu name="100" v-if="classGroupList.length || !noAddress">
          <template #title>
            <div v-textRoll class="title-text" style="max-width: 92px">{{ activeTitle }}</div>
          </template>
          <MenuItem name="location" v-if="!noAddress">{{ $t('locationFiltering') }}</MenuItem>
          <MenuItem v-for="(menu, index) in classGroupList" :key="index" :name="menu.id.toString()">{{ menu.type }}</MenuItem>
        </Submenu>
      </Menu>
      <div class="pointer icon-v5 icon-v5-shouqi-01-copy" v-if="isChangeFold" @click.stop="$emit('fold')"></div>
    </div>
    <div class="mt-10 search-box">
      <Input class="input-box" :placeholder="placeholder" v-model="keyWord" />
    </div>
    <div class="tree-content mt-10">
      <Device-tree ref="deviceTree" v-if="activeName === 'device'" @currentChange="currentChange" :keyWord="keyWord"></Device-tree>
      <Location-tree ref="locationTree" v-else-if="activeName === 'location'" @currentChange="currentChange" :keyWord="keyWord"></Location-tree>
      <Group-tree ref="groupTree" v-else @currentChange="currentChange" :isDefFirstGroup="isDefFirstGroup" :groupTypeID="activeName" :keyWord="keyWord" :key="activeName"></Group-tree>
    </div>
  </div>
</template>

<script>
  import DeviceTree from './treeModel/deviceTree.vue'
  import GroupTree from './treeModel/groupTree.vue'
  import LocationTree from './treeModel/locationTree.vue'
  import { listBoxGroups } from '@/api/public'
  export default {
    components: { DeviceTree, GroupTree, LocationTree },
    props: {
      isFold: { type: Boolean, default: false },
      isChangeFold: { type: Boolean, default: true },
      isDefFirstGroup: { type: Boolean, default: false },
      noAddress: { type: Boolean, default: false },
      strictMode: { type: Boolean, default: false },
      treeHeight: { type: String, default: 'calc(100vh - 258px)' },
    },
    provide() {
      return {
        strictMode: this.strictMode,
        treeHeight: this.treeHeight,
      }
    },
    data() {
      return {
        activeName: 'device',
        keyWord: '',
        classGroupList: [],
      }
    },
    computed: {
      activeTitle() {
        let groupObj = this.classGroupList.find(it => it.id.toString() === this.activeName)
        return (groupObj && groupObj.type) || (!this.noAddress ? this.$t('locationFiltering') : this.$t('groupType'))
      },
      placeholder() {
        return this.activeName === 'device' ? this.$t('devicePlaceholder') : this.activeName === 'location' ? this.$t('addrDevicePlaceholder') : this.$t('nodeDevicePlaceholder')
      },
    },
    created() {
      this.getClassGroupList()
    },
    methods: {
      selectItem(e) {
        this.activeName = e.toString()
        if (this.activeName === 'device') {
          this.currentChange({ statType: 1, label: this.$t('allDevice') })
        } else if (this.activeName === 'location') {
          this.currentChange({ statType: 2, label: this.$t('allDevice') })
        } else if (!this.isDefFirstGroup) {
          this.currentChange({ groupId: +e, statType: 3, label: this.$t('allGroup') })
        }
        window.localStorage.setItem('tree-active-view', this.activeName)
      },
      currentChange(data) {
        this.$emit('clickNode', data)
      },
      async getClassGroupList() {
        let res = await listBoxGroups({ projectCode: this.$store.state.projectCode, pageNo: 1, pageSize: 99999 })
        if (res.success) {
          this.classGroupList = res.datas && res.datas.length ? [...res.datas.map(it => ({ ...it, label: it.type }))] : []
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {},
  }
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
