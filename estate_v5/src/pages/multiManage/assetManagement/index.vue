<template>
  <div>
    <div style="display: flex">
      <div class="left-Content">
        <Tabs v-model="curTab" @on-click="handleTabsVal">
          <TabPane :label="$t('regionalHierarchy')" name="1">
            <div class="tab-tree">
              <RegionalHierarchy ref="regionalHierarchy" @emitTree="emitTree" :regionalData="regionalData"></RegionalHierarchy>
            </div>
          </TabPane>
          <TabPane :label="$t('assetCategory')" name="2">
            <AssetCategory ref="assetCategory" :typeList="typeList" @emitType="emitType"></AssetCategory>
          </TabPane>
        </Tabs>
        <div>
          <Button type="primary" class="w100-button" @click="openRegionalModal">{{ $t('regionalManagement') }}</Button>
        </div>
        <div>
          <Button type="primary" class="w100-button" @click="openCategoryModal">{{ $t('categoryManagement') }}</Button>
        </div>
      </div>
      <div class="right-Content">
        <div v-if="curShow === 'table'">
          <AssetTable :filterType="filterType" :treeData="treeData" @changeShow="changeShow" @editCategoryInfo="editCategoryInfo" @viewCategoryInfo="viewCategoryInfo"></AssetTable>
        </div>
        <div v-if="curShow === 'addEditAsset'">
          <AddEditAsset @changeShow="changeShow" :typeList="typeList" :regionalData="regionalData" :editRow="editRow" @editEmitSave="editEmitSave" @addEmitSave="addEmitSave"></AddEditAsset>
        </div>
        <div v-if="curShow === 'viewAsset'">
          <ViewAssetInfo @changeShow="changeShow" :typeList="typeList" :regionalData="regionalData" :editRow="editRow"></ViewAssetInfo>
        </div>
      </div>
    </div>
    <Modal :title="$t('regionalHierarchyManagement')" v-model="regionalModal">
      <RegionalManagement ref="regionalManagement" :regionalData="regionalData" @editNodeName="editNodeName" @addNode="addNode" @emitDeleteNode="emitDeleteNode" @dragNode="dragNode"></RegionalManagement>
      <div slot="footer">
        <Button type="primary" @click="regionalModal = false">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('categoryManagement')" v-model="typeModal">
      <CategoryManagement ref="categoryManagement" :typeList="typeList" @addCategory="addCategory" @editCategory="editCategory" @deleteEmitCategory="deleteEmitCategory"></CategoryManagement>
      <div slot="footer">
        <Button type="primary" @click="typeModal = false">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import CategoryManagement from './CategoryManagement.vue'
  import RegionalManagement from './RegionalManagement.vue'
  import RegionalHierarchy from './RegionalHierarchy.vue'
  import AssetCategory from './AssetCategory.vue'
  import AssetTable from './AssetTable.vue'
  import AddEditAsset from './AddEditAsset.vue'
  import ViewAssetInfo from './ViewAssetInfo.vue'
  import {
    assetRegionalLevelList,
    assetCategoryList,
    assetRegionalLevelAdd,
    assetRegionalLevelUpdate,
    assetRegionalLevelDragNode,
    assetRegionalLevelDelete,
    assetCategoryAdd,
    assetCategoryUpdate,
    assetCategoryDelete,
    assetManagementAdd,
    assetManagementUpdate,
  } from '@/api/multiManage/assetManagement'
  import { cloneDeep, pickBy } from 'lodash'
  import dayjs from 'dayjs'
  export default {
    components: {
      RegionalHierarchy,
      AssetCategory,
      AssetTable,
      RegionalManagement,
      CategoryManagement,
      AddEditAsset,
      ViewAssetInfo,
    },
    data() {
      return {
        curShow: 'table',
        curTab: '1',
        regionalModal: false,
        typeModal: false,
        filterType: null,
        treeData: null,
        regionalData: [],
        typeList: [],
        editRow: null,
      }
    },
    async created() {
      await this.getList()
      await this.getTypeList()
    },
    methods: {
      changeShow(val, type) {
        this.curShow = val
        if (type === 'add') {
          this.editRow = null
        }
      },
      handleTabsVal(val) {
        if (val === '1') {
          const keyArr = this.$refs.regionalHierarchy.$refs.reTree.getCheckedKeys()
          if (keyArr.length) {
            this.treeData = keyArr
          }
        } else {
          // 切换到资产类别
          const typeIdArr = this.$refs.assetCategory.typeList.filter(v => v.checked).map(v => v.id)
          if (typeIdArr.length) {
            this.filterType = typeIdArr
          }
        }
      },
      async getList() {
        const res = await assetRegionalLevelList({ projectCode: this.$store.state.projectCode, regionName: this.regionName }) // 'P0000009'
        if (!res.success) return this.$Message.error(res.message)
        this.regionalData = [
          {
            id: 'all',
            label: this.$t('allAsset'),
            parentId: 0,
            children: this.getTreeData(res.data),
          },
        ]
      },
      async getTypeList() {
        const res = await assetCategoryList({ projectCode: this.$store.state.projectCode }) //
        if (!res.success) return this.$Message.error(res.message)
        this.typeList = res.data.map(item => ({ ...item, checked: false, name: item.categoryName }))
      },
      async addCategory(categoryName) {
        const res = await assetCategoryAdd({ projectCode: this.$store.state.projectCode, categoryName })
        if (!res.success) return this.$Message.error(res.message)
        await this.getTypeList()
        this.$Message.success(this.$t('addSuccess'))
        this.$refs.categoryManagement.isAddCategory = false
      },
      async editCategory({ id, categoryName }) {
        const res = await assetCategoryUpdate({ projectCode: this.$store.state.projectCode, id, categoryName })
        if (!res.success) return this.$Message.error(res.message)
        await this.getTypeList()
        this.$Message.success(this.$t('modifySuccess'))
        this.$refs.categoryManagement.isEdit = false
      },
      async deleteEmitCategory({ id }) {
        const res = await assetCategoryDelete({ id })
        if (!res.success) return this.$Message.error(res.message)
        await this.getTypeList()
        this.$Message.success(this.$t('deleteSuccessful'))
        this.$refs.categoryManagement.currentClickCategory = ''
      },
      // 获取树形结构
      getTreeData(data) {
        const dataTree = cloneDeep(data)
        const TrrData = data => {
          if (!data.length) {
            return []
          }
          if (Array.isArray(data) && data.length) {
            data.forEach(item => {
              item['label'] = item.regionName
              item['expand'] = true
              item['children'] = item.childNodeList
              if (Array.isArray(item.children) && item.children.length > 0) {
                return TrrData(item.children)
              }
            })
          }

          return data
        }
        return TrrData(dataTree)
      },
      async editNodeName(data) {
        const params = {
          id: data.id,
          parentId: data.parentId,
          projectCode: this.$store.state.projectCode, //  'P0000009'
          regionName: data.label,
        }
        const res = await assetRegionalLevelUpdate(params)
        if (!res.success) return this.$Message.error(res.message)
        await this.getList()
        this.$refs.regionalManagement.isEdit = false
        this.$refs.regionalManagement.$refs.regionalTree.setCurrentKey(data.id)
      },
      async addNode(val) {
        const { parentId, addNodeInputValue } = val
        const params = {
          projectCode: this.$store.state.projectCode, //
          parentId: parentId,
          regionName: addNodeInputValue,
        }
        const res = await assetRegionalLevelAdd(params)
        if (!res.success) return this.$Message.error(res.message)
        await this.getList()
      },
      async emitDeleteNode(data) {
        const res = await assetRegionalLevelDelete({ id: data.id })
        if (!res.success) return this.$Message.error(res.message)
        this.getList()
      },
      async dragNode(data) {
        const { draggingNode, dropNode, dropType } = data
        const params = {
          id: draggingNode.data.id,
        }
        params['parenId'] = dropType === 'inner' ? dropNode.data.id : dropNode.data.parentId
        const res = await assetRegionalLevelDragNode(params)
        if (!res.success) return this.$Message.error(res.message)
        await this.getList()
        this.$Message.success(res.message)
      },
      emitType(val) {
        const checkedList = val.filter(v => v.checked)
        if (checkedList.length) {
          this.filterType = checkedList.map(v => v.id)
        }
      },
      emitTree({ data, key }) {
        this.treeData = key.checkedKeys.filter(v => v !== 'all')
      },
      openRegionalModal() {
        this.regionalModal = true
        this.$refs.regionalManagement.currentNodeId = ''
        this.$refs.regionalManagement.$refs.regionalTree.setCurrentKey(null)
      },
      openCategoryModal() {
        this.typeModal = true
        this.$refs.categoryManagement.currentClickCategory = ''
      },
      editCategoryInfo(row) {
        this.editRow = row
        this.changeShow('addEditAsset')
      },
      viewCategoryInfo(row) {
        this.editRow = row
        this.changeShow('viewAsset')
      },
      async editEmitSave(data) {
        const params = {
          projectCode: this.$store.state.projectCode, //
          ...pickBy(data, value => !!value),
          productionDate: dayjs(data.productionDate).format('YYYY-MM-DD'),
        }
        const res = await assetManagementUpdate(params)
        if (!res.success) return this.$Message.error(res.message)
        await this.getTypeList()
        this.$Message.success(this.$t('modifySuccess'))
        this.changeShow('table')
      },
      async addEmitSave(data) {
        const params = {
          projectCode: this.$store.state.projectCode, //
          ...pickBy(data, value => !!value),
          productionDate: dayjs(data.productionDate).format('YYYY-MM-DD'),
        }

        const res = await assetManagementAdd(params)
        if (!res.success) return this.$Message.error(res.message)
        await this.getTypeList()
        this.$Message.success(this.$t('addSuccess'))
        this.changeShow('table')
      },
    },
  }
</script>

<style lang="less" scoped>
  .right-Content {
    margin-left: 10px;
    flex: 4;
    height: ~'calc(100vh - 142px)';
    background: #1a202e;
    overflow-x: auto;
  }
  .left-Content {
    padding: 10px;
    flex: 1;
    width: 100%;
    height: ~'calc(100vh - 142px)';
    background: #1a202e;
    .tab-tree {
      height: 100%;
      overflow: auto;
    }
    .w100-button {
      width: 100%;
      margin: 10px 20px 0 0;
    }
  }
</style>
