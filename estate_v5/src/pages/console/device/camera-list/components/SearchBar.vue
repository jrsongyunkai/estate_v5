<template>
  <Row style="padding: 20px 10px 0; background-color: #1a202e" justify="space-between">
    <Col style="margin-bottom: 20px">
      <Row :gutter="10">
        <Col>
          <Select style="width: 150px" transfer clearable v-model="selectedGroupType" :placeholder="$t('selectGroupingType')" @on-change="onGroupTypeChange">
            <Option z-index="5" v-for="item in groupTypeList" :key="item.id" :label="item.type" :value="item.id"></Option>
          </Select>
        </Col>
        <Col>
          <TreeSelect :placeholder="$t('selectGroup')" style="width: 150px" multiple show-checkbox v-model="selectedGroups" transfer :data="groupTreeData" />
        </Col>
        <Col>
          <Select style="width: 150px" transfer clearable v-model="selectBuilding" :placeholder="`${$t('selectBuilding')}`" @on-change="onBuildingChange">
            <Option z-index="5" v-for="item in buildings" :key="item.value" :label="item.text" :value="item.value"></Option>
          </Select>
        </Col>
        <Col>
          <Select transfer clearable style="width: 150px" v-model="selectUnit" :placeholder="`${$t('selectUnit')}`">
            <Option v-for="item in units" :key="item.value" :label="item.text" :value="item.value"></Option>
          </Select>
        </Col>
        <Col>
          <Button type="primary" @click.stop="search">{{ $t('query') }}</Button>
          <Button type="default" class="ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
        </Col>
        <Col>
          <Button type="primary" @click.stop="playByGrid">{{ $t('maskPlay') }}</Button>
        </Col>
      </Row>
    </Col>
    <Col style="margin-bottom: 20px">
      <Row :gutter="10">
        <Col>
          <Select v-model="sortType" style="width: 150px" @on-change="onSortChange" :value="1" transfer>
            <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col>
          <Select v-model="orderType" style="width: 100px" @on-change="onSortChange" transfer>
            <Option v-for="item in orderList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
    </Col>
  </Row>
</template>

<script>
  import { getGroupType, getGroupTree, getBuildings } from '@/api/public'
  import { saveKeyValue, getKeyValue } from '@/api/common/index'

  export default {
    data() {
      return {
        groupTypeList: [],
        selectedGroupType: null,
        groupTreeData: [],
        selectedGroups: [],
        buildings: [],
        selectBuilding: null,
        units: [],
        selectUnit: null,
        sortType: 3,
        sortList: [
          {
            value: 1,
            label: this.$t('accordingDeviceID'),
          },
          {
            value: 2,
            label: this.$t('accordingDeviceAlias'),
          },
          {
            value: 3,
            label: this.$t('accordingEquipmentLocation'),
          },
        ],
        orderType: 1,
        orderList: [
          {
            value: 1,
            label: this.$t('positiveSequence'),
          },
          {
            value: 2,
            label: this.$t('reverseOrder'),
          },
        ],
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getGroupTypeList()
        this.getBuildings()
        this.search()
      },
      search() {
        const valid = this.validateSearchParams()
        if (!valid) return
        this.$emit('search', {
          build: this.selectBuilding,
          unit: this.selectUnit,
          nodeId: this.selectedGroups.join(','),
          sortType: this.sortType,
          orderType: this.orderType,
        })
      },
      reset() {
        this.selectedGroupType = null
        this.groupTreeData = []
        this.selectedGroups = []
        this.selectBuilding = null
        this.units = []
        this.selectUnit = null
      },
      playByGrid() {
        this.$emit('playByGrid')
      },
      validateSearchParams() {
        if (this.selectedGroupType && this.selectedGroups.length === 0) {
          this.$Message.error({ content: this.$t('selectGroup') })
          return false
        }
        return true
      },
      onGroupTypeChange() {
        this.selectedGroups = []
        this.groupTreeData = []
        this.getGroupTreeData()
      },
      async getGroupTypeList() {
        const { success, message, data } = await getGroupType({
          projectCode: this.$store.state.projectCode,
        })
        if (!success) return this.$Message.error(message)
        this.groupTypeList = data
      },
      async getGroupTreeData() {
        if (!this.selectedGroupType) {
          this.groupTreeData = []
          return
        }
        const { success, message, data } = await getGroupTree({
          groupId: this.selectedGroupType,
        })
        if (!success) return this.$Message.error(message)
        const arr = data.map(item => ({
          ...item,
          value: item.id,
          title: item.name,
          expand: true,
          selected: false,
          checked: false,
        }))
        this.groupTreeData = this.arr2Tree(arr)
      },
      arr2Tree(arr, rootId = 0) {
        const ret = []
        const map = {}
        arr.forEach(item => {
          let node = map[item.id]
          if (!node) {
            node = {
              ...item,
              children: [],
            }
          } else {
            node = {
              ...item,
              children: node.children,
            }
          }
          map[item.id] = node
          if (item.parentId === rootId) {
            ret.push(node)
          }
          let pNode = map[item.parentId]
          if (!pNode) {
            pNode = { children: [] }
            map[item.parentId] = pNode
          }
          pNode.children.push(node)
        })
        return ret
      },
      async getBuildings() {
        const { success, message, data } = await getBuildings({
          projectCode: this.$store.state.projectCode,
          equipmentTypes: 20,
        })
        if (!success) return this.$Message.error(message)
        this.buildings = this.addressDataFactory(data)
      },
      onBuildingChange() {
        this.selectUnit = null
        this.units = []
        this.getUnits()
      },
      async getUnits() {
        if (!this.selectBuilding) {
          this.units = []
          return
        }
        const { success, message, data } = await getBuildings({
          projectCode: this.$store.state.projectCode,
          equipmentTypes: 20,
          build: this.selectBuilding,
        })
        if (!success) return this.$Message.error(message)
        this.units = this.addressDataFactory(data)
      },
      addressDataFactory(data) {
        return [{ text: this.$t('all'), value: '' }].concat(data)
      },
      async onSortChange() {
        await this.saveSortConfig()
        this.search()
      },
      async getSortConfig() {
        const { data, message, success } = await getKeyValue({
          at: 'cache',
          tag: 'acc',
          key: 'SORT_CFG_FOR_BOX_LIST',
          ep: 0,
          sec: 0,
        })
        if (!success) {
          this.$Message.error(message)
        } else if (data) {
          const sortValue = JSON.parse(data)
          this.sortType = sortValue.sortType
          this.orderType = sortValue.orderType
        }
      },
      async saveSortConfig() {
        const { message, success } = await saveKeyValue({
          at: 'cache', // 可取值：cache 存redis；db 存数据库
          tag: 'acc', // 可取值：gbl 全局；acc 账号相关；prj 项目相关；box 设备相关
          key: 'SORT_CFG_FOR_BOX_LIST',
          value: JSON.stringify({ sortType: this.sortType, orderType: this.orderType }),
          ep: 0, // 根据tag而不同，当prj、box时，表示项目编号、设备号
          sec: 0, // 当at是cache时，保存到缓存的时效(秒), -1表删除，0表不设超时存储; at是db时,-1表删除;
        })
        if (!success) {
          this.$Message.error(message)
        }
      },
    },
  }
</script>

<style lang="less" scoped></style>
