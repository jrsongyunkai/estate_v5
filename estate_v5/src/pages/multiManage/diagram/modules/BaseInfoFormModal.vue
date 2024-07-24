<template>
  <Modal v-model="openAddDiagram" :title="$t('addSystemDiagram')" width="820px" :mask-closable="false">
    <MForm ref="formDataRef" v-if="openAddDiagram" :formSetting="formSetting" v-model="formData" :labelWidth="100">
      <template #templateSelect>
        <div class="temp-config">
          <Card class="temp-item-radio" :class="{ active: !pickTemp }">
            <div @click.stop="pickTemp = null">
              <div class="image-box" style="background: #1a202e"></div>
              <div class="name-box">{{ $t('blankTemplate') }}</div>
            </div>
          </Card>
          <Card v-for="(item, index) in templateList" :key="index" :class="{ active: pickTemp && pickTemp.name === item.name }" class="temp-item-radio">
            <div @click.stop="selectTemp(item)">
              <div class="image-box">
                <MImage ref="mImage" class="image" :src="item.imageUrl" />
                <span class="preview" @click.stop="previewImage(index)">{{ $t('clickToPreview') }}</span>
              </div>
              <div class="name-box">{{ item.name }}</div>
            </div>
          </Card>
        </div>
      </template>
      <template #positionType>
        <RadioGroup class="position-type mr-10" v-model="formData.positionType" type="button">
          <Radio :label="0">{{ $t('withinTheList') }}</Radio>
          <Radio :label="1">{{ $t('independentMenu') }}</Radio>
        </RadioGroup>
      </template>
      <template #BelongMenu>
        <Cascader change-on-select :data="menuData" v-model="parentMenu" v-width="250" transfer></Cascader>
      </template>
      <template #menuLocation>
        <Select v-model="formData.menuOrder" v-width="250" transfer>
          <Option v-for="item in menuOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </template>
    </MForm>
    <div slot="footer">
      <Button type="primary" @click="saveInfo(true)">{{ $t('saveAndStartDrawingSystemDiagram') }}</Button>
      <Button type="primary" class="ml-10" @click.stop="saveInfo(false)">{{ $t('save') }}</Button>
      <Button type="default" class="ml-10" @click.stop="closeModal">{{ $t('cancel') }}</Button>
    </div>
  </Modal>
</template>

<script>
  import { saveSketch } from '@/api/multiManage/diagram'
  import { mapMutations } from 'vuex'
  import tTitle from '@/layouts/basic-layout/mixins/translate-title'
  import { httpRequest } from './util/http'
  import store from '@/store/index'
  export default {
    data() {
      return {
        openAddDiagram: false,
        formData: { name: '', parentMenu: '', positionType: 0, projectCode: this.$store.state.projectCode, tabType: 1, menuLevel: 0, menuOrder: 0 },
        parentMenu: [],
        templateList: [],
        pickTemp: null,
        menuData: [],
        useMenuList: this.$store.state.admin.menu.sider,
      }
    },
    mixins: [tTitle],
    computed: {
      formSetting() {
        let { positionType, menuLevel } = this.formData
        return [
          { isLoad: this.templateList.length, label: this.$t('selectEditTemplate'), colSpan: 24, formType: 'Slot', prop: 'templateSelect' },
          {
            formType: 'Input',
            label: this.$t('systemDiagramName'),
            prop: 'name',
            colSpan: 24,
            placeholder: this.$t('pleaseEnterSystemDiagramName'),
            attr: { maxlength: 30, 'show-word-limit': true },
            event: '',
            rules: [{ required: true, message: this.$t('pleaseEnterSystemDiagramName'), trigger: 'blur' }],
          },
          { formType: 'Slot', label: this.$t('displayType'), prop: 'positionType', colSpan: 24 },
          {
            formType: 'RadioGroup',
            label: this.$t('level'),
            isLoad: positionType === 1,
            colSpan: 24,
            prop: 'menuLevel',
            options: [
              { label: this.$t('oneLevelMenu'), value: 0 },
              { label: this.$t('twoLevelMenu'), value: 1 },
              { label: this.$t('threeLevelMenu'), value: 2 },
            ],
            placeholder: this.$t('pleaseSelectLevel'),
            event: '',
            rules: [
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (this.formData.menuLevel === null) {
                    callback(new Error(this.$t('pleaseSelectLevel')))
                  }
                  callback()
                },
              },
            ],
          },
          {
            formType: 'Slot',
            label: this.$t('ownMenu'),
            isLoad: positionType === 1 && menuLevel > 0,
            prop: 'BelongMenu',
            colSpan: 24,
            event: '',
            rules: [
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (this.formData.positionType === 1 && this.formData.menuLevel === 1 && this.parentMenu.length === 0) {
                    callback(new Error(this.$t('pleaseSelectOwnOneLevelMenu')))
                  } else if (this.formData.positionType === 1 && this.formData.menuLevel === 2 && this.parentMenu.length < 2) {
                    callback(new Error(this.$t('pleaseSelectOwnTwoLevelMenu')))
                  }
                  callback()
                },
              },
            ],
          },
          {
            formType: 'Slot',
            label: this.$t('menuPosition'),
            isLoad: positionType === 1,
            prop: 'menuLocation',
            colSpan: 24,
            rules: [
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (this.formData.menuOrder === null) {
                    callback(new Error(this.$t('pleaseSelectMenuPosition')))
                  }
                  callback()
                },
              },
            ],
          },
          {
            formType: 'RadioGroup',
            label: this.$t('openMethod'),
            isLoad: positionType === 1,
            colSpan: 24,
            prop: 'tabType',
            options: [
              { label: this.$t('currentPage'), value: 0 },
              { label: this.$t('newWindow'), value: 1 },
            ],
            attr: { type: 'button' },
            event: '',
            rules: [
              {
                required: true,
                validator: (rule, value, cb) => {
                  if (this.formData.tabType === null) {
                    cb(new Error(this.$t('pleaseSelectOpenMethod')))
                  }
                  cb()
                },
                trigger: 'change',
              },
            ],
          },
        ]
      },
      menuOptions() {
        let menuLevel = this.formData.menuLevel
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
      ...mapMutations('diagram', ['setEditDiagram']),
      openModal() {
        this.pickTemp = null
        this.openAddDiagram = true
      },
      async getConfigTpl() {
        this.templateList = await httpRequest.getConfigTpl()
      },
      previewImage(i) {
        this.$refs.mImage[i].showPreview()
      },
      selectTemp(item) {
        this.pickTemp = item
      },
      closeModal() {
        this.formData = { name: '', parentMenu: '', positionType: 0, projectCode: this.$store.state.projectCode, tabType: 1 }
        this.parentMenu = []
        this.$parent.loadList()
        this.$nextTick(() => {
          this.openAddDiagram = false
        })
      },
      async saveInfo(isUpLoad = false) {
        if (this.$refs.formDataRef.validate()) {
          let params = { ...this.formData, parentMenu: JSON.stringify(this.parentMenu) }
          if (this.pickTemp) {
            params.previewPath = this.pickTemp.imageUrl
            params.filePath = this.pickTemp.url
          }
          const res = await saveSketch(params)
          if (res.success) {
            this.$message.success(this.$t('savedSuccessfully'))
            this.closeModal()
            if (isUpLoad) {
              this.$emit('callback', res.data)
            }
            if (params.positionType === 1) {
              // 刷新菜单
              store.commit('showMenus', Math.random())
            }
          } else {
            this.$message.error(res.message)
          }
        }
      },
    },
    mounted() {
      this.getConfigTpl()
    },
    watch: {
      'formData.menuLevel': {
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
  }
</script>

<style lang="less">
  .position-type.mr-10 {
    margin-right: 10px;
    margin-left: 0px;
  }
  .temp-config {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .temp-item-radio {
    width: 160px;
    margin-right: 10px;
    cursor: pointer;
    .ivu-card-body {
      padding: 5px;
      .image-box {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .image {
          pointer-events: none;
        }
        .preview {
          position: absolute;
          font-size: 12px;
          color: #409eff;
        }
      }
      .name-box {
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
    }
  }
  .temp-item-radio.active,
  .temp-item-radio:hover {
    border: 1px solid #409eff;
  }
</style>
