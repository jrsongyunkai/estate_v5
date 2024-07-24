<template>
  <div class="menusConfig">
    <div class="dis-between">
      <h3>{{ $t('quickLinkMenu') }}</h3>
      <Button type="primary" ghost @click="openAddMenuModal">{{ $t('addMenu') }}</Button>
    </div>
    <Table :columns="columnsCustom" :data="customTableList">
      <template slot-scope="{ row }" slot="linkTo">{{ `${row.link}` }}</template>
      <template slot-scope="{ row }" slot="openType">{{ row.openWay === 1 ? $t('currentPage') : $t('newWindow') }}</template>
      <template slot-scope="{ row }" slot="startStatus">
        <div><Switch v-model="row.status" @on-change="changeMenuStatus($event, row)" :true-value="1" :false-value="0" /></div>
      </template>
      <template slot-scope="{ row }" slot="operation">
        <Button type="primary" size="small" ghost @click="editMenuList(row)">{{ $t('edit') }}</Button>
        <Button type="error" size="small" ghost class="marl-10" @click="delMenuTable(row)">{{ $t('delete') }}</Button>
      </template>
    </Table>
    <Page @on-change="changCurrentPage" :current="currentPage" :total="total" show-elevator show-total></Page>
    <Modal :title="$t('addLink')" v-model="addLinkModal">
      <div class="dis-flex">
        <div class="flex-1 pd-t">{{ $t('menuName') }}：</div>
        <div class="flex-3"><Input v-model="addMenus.menuName"></Input></div>
      </div>
      <div class="dis-flex">
        <div class="flex-1 pd-t">{{ $t('menuIcon') }}：</div>
        <div class="flex-3">
          <RadioGroup v-model="addMenus.iconUrl" type="button">
            <Radio v-for="icon in icons" :key="icon" :label="icon"><Icon :custom="icon" /></Radio>
          </RadioGroup>
        </div>
      </div>
      <div class="dis-flex">
        <div class="flex-1 pd-t">{{ $t('quickLink') }}：</div>
        <div class="flex-3">
          <Input v-model="addMenus.linkValue">
            <Select v-model="selectAgreement" slot="prepend" style="width: 80px">
              <Option value="http">http://</Option>
              <Option value="https">https://</Option>
            </Select>
          </Input>
        </div>
      </div>
      <div class="dis-flex">
        <div class="flex-1">{{ $t('level') }}：</div>
        <div class="flex-3">
          <RadioGroup v-model="addMenus.menuLevel">
            <Radio :label="0">{{ $t('oneLevelMenu') }}</Radio>
            <Radio :label="1">{{ $t('twoLevelMenu') }}</Radio>
            <Radio :label="2">{{ $t('threeLevelMenu') }}</Radio>
          </RadioGroup>
        </div>
      </div>
      <div class="dis-flex" v-if="addMenus.menuLevel > 0">
        <div class="flex-1">{{ $t('ownMenu') }}：</div>
        <div class="flex-3">
          <Cascader change-on-select :data="menuData" v-model="parentMenu" v-width="250" transfer></Cascader>
        </div>
      </div>
      <div class="dis-flex">
        <div class="flex-1">{{ $t('showPosition') }}：</div>
        <div class="flex-3">
          <Select v-model="addMenus.menuOrder" v-width="250" transfer>
            <Option v-for="item in menuOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
      <div class="dis-flex">
        <div class="flex-1">{{ $t('openMethod') }}：</div>
        <div class="flex-3">
          <RadioGroup v-model="addMenus.openWay" type="button">
            <Radio :label="1">{{ $t('currentPage') }}</Radio>
            <Radio :label="2">{{ $t('newWindow') }}</Radio>
          </RadioGroup>
        </div>
      </div>
      <div class="dis-flex">
        <div class="flex-1">{{ $t('enabled') }}：</div>
        <div class="flex-3"><Switch v-model="addMenus.status" :true-value="1" :false-value="0" /></div>
      </div>
      <div slot="footer">
        <Button @click="addLinkModal = false">{{ $t('cancel') }}</Button>
        <Button type="primary" @click="saveMenuList">{{ $t('save') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import store from '@/store'
  import tTitle from '@/layouts/basic-layout/mixins/translate-title'
  import { queryPageListByProjectCode, saveMenu, updateMenu, changeStatus, deleteMenu } from '@api/quicklyMenu/quicklyMenu'
  export default {
    mixins: [tTitle],
    data() {
      return {
        useMenuList: this.$store.state.admin.menu.sider,
        icons: ['icon-v5 icon-v5-lianjie', 'icon-v5 icon-v5-shujuku', 'icon-v5 icon-v5-xihuan', 'icon-v5 icon-v5-lianjie2', 'icon-v5 icon-v5-chengxu', 'icon-v5 icon-v5-biaoge', 'icon-v5 icon-v5-caidan1'],
        addMenus: { menuName: '', linkValue: '', menuLevel: 1, iconUrl: '', openWay: 1, status: 1, menuOrder: 0 },
        total: 0,
        currentPage: 1,
        pageSize: 10,
        isAddMenuTable: false,
        selectAgreement: 'https',
        addLinkModal: false,
        customTableList: [],
        columnsCustom: [
          { type: 'index', title: this.$t('index') },
          { title: this.$t('menuName'), key: 'menuName' },
          { title: this.$t('link'), slot: 'linkTo' },
          { title: this.$t('openFunciton'), slot: 'openType' },
          { title: this.$t('enabled'), slot: 'startStatus' },
          { title: this.$t('operation'), slot: 'operation' },
        ],
        rowList: {},
        menuData: [],
        parentMenu: [],
      }
    },
    computed: {
      menuOptions() {
        let menuLevel = this.addMenus.menuLevel
        let first = { label: this.$t('firstRow'), value: 0 }
        if (menuLevel === 0) {
          return [first, ...this.useMenuList.map((it, index) => ({ label: this.tTitle(it.title), value: index + 1 }))]
        } else if (menuLevel === 1) {
          let findObj = this.useMenuList.find(v => v.path === this.parentMenu[0])
          let residue = findObj && findObj.children ? findObj.children.map((it, index) => ({ label: this.tTitle(it.title), value: index + 1 })) : []
          return [first, ...residue]
        } else {
          let findObj = this.useMenuList.find(v => v.path === this.parentMenu[0])
          let findObjSub = findObj && findObj.children ? findObj.children.find(v => v.path === this.parentMenu[1]) : null
          let residue = findObjSub && findObjSub.children ? findObjSub.children.map((it, index) => ({ label: this.tTitle(it.title), value: index + 1 })) : []
          return [first, ...residue]
        }
      },
    },
    methods: {
      delMenuTable(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmDeleteMenuConfig'),
          onOk: async () => {
            const params = { id: row.id }
            const res = await deleteMenu(params)
            if (!res.success) return this.$Message.error({ content: res.message })
            this.getMenuTable(true)
            this.$Message.success({ content: res.message })
          },
          onCancel: () => {
            this.$Message.info({ content: this.$t('cancelDelete') })
          },
        })
      },
      async saveMenuList() {
        const { menuName, linkValue, menuLevel, iconUrl, openWay, menuOrder } = this.addMenus
        if (!menuName) return this.$Message.error({ content: this.$t('pleaseInputMenuName') })
        if (!iconUrl) return this.$Message.error({ content: this.$t('pleaseSelectMenuIcon') })
        if (!linkValue) return this.$Message.error({ content: this.$t('pleaseInputMenuLink') })
        if (menuLevel === 1 && this.parentMenu.length !== 1) return this.$Message.error({ content: this.$t('pleaseSelectOwnOneLevelMenu') })
        if (menuLevel === 2 && this.parentMenu.length !== 2) return this.$Message.error({ content: this.$t('pleaseSelectOwnTwoLevelMenu') })
        if (!openWay) return this.$Message.error({ content: this.$t('pleaseSelectOpenMethod') })
        if (menuOrder === '') return this.$Message.error({ content: this.$t('pleaseSelectShowPosition') })
        let param = {
          ...this.addMenus,
          link: `${this.selectAgreement}://${linkValue}`,
          parentMenu: JSON.stringify(this.parentMenu),
          projectCode: this.$store.state.projectCode,
          id: this.isAddMenuTable ? null : this.rowList.id,
        }
        let res
        if (this.isAddMenuTable) {
          res = await saveMenu(param)
        } else {
          delete param.updateTime
          res = await updateMenu(param)
        }
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.addLinkModal = false
        this.$Message.success({ content: res.message })
        this.getMenuTable(true)
      },
      editMenuList(row) {
        this.rowList = row
        this.isAddMenuTable = false
        this.addLinkModal = true
        const { menuName, link, menuLevel, iconUrl, openWay, parentMenu, menuOrder } = row
        this.addMenus = { menuName, menuLevel, iconUrl, openWay, parentMenu, menuOrder, linkValue: link.split('://')[1] }
        this.parentMenu = JSON.parse(parentMenu)
        this.selectAgreement = row.link.includes('://') ? row.link.split('://')[0] : 'https'
      },
      async changeMenuStatus(val, row) {
        const params = { id: row.id, status: val ? 1 : 0, projectCode: this.$store.state.projectCode }
        const res = await changeStatus(params)
        if (!res.success) return this.$Message.error({ content: res.message })
        this.getMenuTable(true)
        this.$Message.success({ content: res.message })
      },
      changCurrentPage(e) {
        this.currentPage = e
        this.getMenuTable()
      },
      async getMenuTable(isChange = false) {
        let param = { projectCode: this.$store.state.projectCode, pageSize: this.pageSize, pageNo: this.currentPage }
        const res = await queryPageListByProjectCode(param)
        if (!res.success) return this.$Message.error({ content: res.message })
        if (isChange) {
          store.commit('showMenus', Math.random())
        }
        this.customTableList = res.datas
        this.total = res.total
      },
      openAddMenuModal() {
        this.rowList = {}
        this.parentMenu = []
        this.addLinkModal = true
        this.isAddMenuTable = true
        this.addMenus = { menuName: '', linkValue: '', openWay: 1, menuLevel: 0, iconUrl: this.icons[0], status: 1 }
        this.selectAgreement = 'https'
      },
    },
    watch: {
      'addMenus.menuLevel': {
        handler(value) {
          if (value === 1) {
            this.menuData = this.useMenuList.filter(it => it.children && it.children.length > 0).map(it => ({ label: this.tTitle(it.title), value: it.path }))
          } else if (value === 2) {
            this.menuData = this.useMenuList
              .filter(it => it.children && it.children.length > 0)
              .map(it => {
                let obj = { value: it.path, label: this.tTitle(it.title) }
                let children = it.children && it.children.filter(item => !item.isCustom)
                if (children && children.length > 0) {
                  obj.children = children.map(item => ({ label: this.tTitle(item.title), value: item.path }))
                }
                return obj
              })
          }
        },
        deep: true,
        immediate: true,
      },
    },
    mounted() {
      this.getMenuTable()
    },
  }
</script>

<style lang="less" scoped>
  .menusConfig {
    .dis-between {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }
    .marl-10 {
      margin-left: 10px;
    }
  }
</style>
<style lang="less">
  .dis-flex {
    margin: 15px 0;
    display: flex;
    align-items: center;
  }
  .flex-1 {
    flex: 1;
    text-align: right;
  }
  .flex-3 {
    flex: 3;
  }
  .pd-t {
    padding-top: 5px;
  }
</style>
