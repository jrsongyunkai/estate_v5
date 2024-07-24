<template>
  <div class="configuration-header-container">
    <div class="left-menus">
      <div class="back-btn">
        <div class="configuration-header-menu" @click.stop="$emit('close')">
          <div class="configuration-header-menu-btn"><Icon custom="icon-v5 icon-v5-back1" /></div>
          <div class="configuration-header-menu-text">{{ $t('back') }}</div>
        </div>
      </div>
      <div class="name-input">
        <Input v-model="editDiagram.name" style="width: 100%"></Input>
        <span class="state" v-if="saveLoadIng">
          <Icon type="md-sync" />
          {{ $t('saving') }}
        </span>
      </div>
      <div class="lac-input">
        <RadioGroup v-model="editDiagram.positionType" type="button">
          <Radio :label="0">{{ $t('withinTheList') }}</Radio>
          <Radio :label="1">{{ $t('independentMenu') }}</Radio>
        </RadioGroup>
      </div>
      <div class="lac-input" v-if="editDiagram.positionType === 1">
        <RadioGroup v-model="editDiagram.menuLevel">
          <Radio :label="0">{{ $t('oneLevelMenu') }}</Radio>
          <Radio :label="1">{{ $t('twoLevelMenu') }}</Radio>
          <Radio :label="2">{{ $t('threeLevelMenu') }}</Radio>
        </RadioGroup>
        <Cascader v-if="editDiagram.menuLevel > 0" change-on-select :data="menuData" v-model="parentMenu" style="margin-left: 5px" v-width="200" transfer></Cascader>
      </div>
      <div class="lac-input" v-if="editDiagram.positionType === 1">
        <Select v-model="editDiagram.menuOrder" v-width="150" transfer>
          <Option v-for="item in menuOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="lac-input">
        <Select v-model="editDiagram.tabType" v-width="150" transfer placeholder="打开形式">
          <Option :value="0">当前页</Option>
          <Option :value="1">新窗口</Option>
        </Select>
      </div>
    </div>
    <div class="right-menus">
      <div class="configuration-header-menu" @click="onLock">
        <div class="configuration-header-menu-btn">
          <Icon custom="icon-v5 icon-v5-unlock1" v-show="lockState === 0" />
          <Icon custom="icon-v5 icon-v5-lock" v-show="lockState === 1" class="lock-preview-icon" />
          <Icon custom="icon-v5 icon-v5-lock" v-show="lockState === 2" class="lock-icon" />
        </div>
        <div class="configuration-header-menu-text" :class="{ 'lock-preview-icon': lockState === 1, 'lock-icon': lockState === 2 }">{{ lockStateText }}</div>
      </div>
      <Dropdown @on-click="exportClick">
        <div class="configuration-header-menu">
          <div class="configuration-header-menu-btn"><Icon custom="icon-v5 icon-v5-tubiao-09" /></div>
          <div class="configuration-header-menu-text">{{ $t('export') }}</div>
        </div>
        <template #list>
          <DropdownMenu>
            <DropdownItem name="JSON">JSON</DropdownItem>
            <DropdownItem name="PNG">PNG</DropdownItem>
          </DropdownMenu>
        </template>
      </Dropdown>
      <Upload :before-upload="handleUpload" accept=".json" action="#" :show-upload-list="false">
        <div class="configuration-header-menu">
          <div class="configuration-header-menu-btn"><Icon custom="icon-v5 icon-v5-tubiao-05" /></div>
          <div class="configuration-header-menu-text">{{ $t('import') }}</div>
        </div>
      </Upload>
      <div class="configuration-header-menu" @click.stop="onPreview">
        <div class="configuration-header-menu-btn"><Icon custom="icon-v5 icon-v5-quanping" /></div>
        <div class="configuration-header-menu-text">{{ $t('fullScreen') }}</div>
      </div>
      <div class="configuration-header-menu" @click.stop="onSave">
        <div class="configuration-header-menu-btn"><Icon custom="icon-v5 icon-v5-memory-card-one" /></div>
        <div class="configuration-header-menu-text">{{ $t('save') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { saveSketch, uploadSketch } from '@/api/multiManage/diagram'
  import { diagramIndexedDB, diagramPreviewIndexDB } from '@/plugins/indexDB/index'
  import tTitle from '@/layouts/basic-layout/mixins/translate-title'
  export default {
    mixins: [tTitle],
    data() {
      return {
        lockState: 0,
        lockMap: {
          0: { fn: () => (this.lockState = 1), text: this.$t('edit') },
          1: { fn: () => (this.lockState = 2), text: this.$t('preview') },
          2: { fn: () => (this.lockState = 0), text: this.$t('lock') },
        },
        editDiagram: {
          name: '',
          positionType: 1,
          parentMenu: '',
          menuLevel: null,
          menuOrder: '',
          code: '',
          tabType: null,
          ...this.$store.state.diagram.editDiagram,
        },
        parentMenu: this.$store.state.diagram.editDiagram.parentMenu ? JSON.parse(this.$store.state.diagram.editDiagram.parentMenu) : [],
        previewPath: '',
        saveLoadIng: false,
        autoSaveSetInterval: null,
        menuData: [],
        useMenuList: this.$store.state.admin.menu.sider,
        delKeys: ['editor', 'editorId', 'editorName', 'favorite', 'owner', 'shared', 'star', 'updatedAt', 'createdAt', 'username', 'version', 'view'],
      }
    },
    computed: {
      lockStateText() {
        return this.lockMap[this.lockState].text
      },
      menuOptions() {
        let menuLevel = this.editDiagram.menuLevel
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
      onLock() {
        this.lockMap[this.lockState].fn()
        window.meta2d.lock(this.lockState)
      },
      // 保存基本信息
      async updateBaseInfo() {
        this.saveLoadIng = true
        const res = await saveSketch({ ...this.editDiagram, parentMenu: JSON.stringify(this.parentMenu) })
        if (res.success) {
          this.saveSketchInfo()
        } else {
          this.$message.error(res.message)
        }
      },
      base64toBlob(base64, type) {
        const bstr = atob(base64.substring(base64.indexOf(',') + 1))
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type })
      },
      async saveSketchInfo() {
        let metaData = window.meta2d.data()
        if (metaData.pens.length === 0) {
          this.saveLoadIng = false
          return this.$message.error(this.$t('emptySystemDiagramCannotSaved'))
        }
        this.delKeys.forEach(key => {
          if (Object.keys(metaData).includes(key)) delete metaData[key]
        })
        const blobsPng = this.base64toBlob(window.meta2d.toPng(10, undefined, true), 'image/png')
        const json = JSON.stringify(metaData)
        const blobJSON = new Blob([json], { type: 'application/json' })
        let formData = new FormData()
        formData.append('id', this.editDiagram.id)
        formData.append('projectCode', this.$store.state.projectCode)
        formData.append('file1', blobJSON, `${this.editDiagram.id}.json`)
        formData.append('file2', blobsPng, `${this.editDiagram.id}.png`)
        let res = await uploadSketch(formData)
        if (res.success) {
          this.$message.success(this.$t('savedSuccessfully'))
        } else {
          this.$message.error(res.message)
        }
        this.saveLoadIng = false
      },
      onSave() {
        if (this.saveLoadIng) return
        if (this.editDiagram.positionType === 1) {
          if (this.editDiagram.menuLevel === 1 && this.parentMenu.length !== 1) return this.$message.error(this.$t('pleaseSelectOwnOneLevelMenu'))
          if (this.editDiagram.menuLevel === 2 && this.parentMenu.length !== 2) return this.$message.error(this.$t('pleaseSelectOwnTwoLevelMenu'))
          if (this.menuOrder === null) return this.$message.error(this.$t('pleaseSelectMenuPosition'))
        }
        this.updateBaseInfo()
      },
      // 预览
      onPreview() {
        let JSONData = JSON.stringify(window.meta2d.data())
        diagramPreviewIndexDB.setItem(this.editDiagram.code, JSONData).then(() => {
          window.open(`/sketch/preview?code=${this.editDiagram.code}&projectCode=${this.$store.state.projectCode}`, '_blank')
        })
      },
      // 导出图片
      onExportPng() {
        window.meta2d.downloadPng(`${this.editDiagram.name || 'topology'}`)
      },
      // 导出JSON文件
      onExportJson() {
        const filename = `${this.editDiagram.name || 'topology'}.json`
        const data = window.meta2d.data()
        const json = JSON.stringify(data, undefined, 2)
        const blob = new Blob([json], { type: 'text/json' })
        const a = document.createElement('a')
        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        a.click()
      },
      exportClick(type) {
        if (type === 'JSON') {
          this.onExportJson()
        } else if (type === 'PNG') {
          this.onExportPng()
        }
      },
      // 自动保存
      autoSaveEditInfo() {
        diagramIndexedDB.setItem(this.editDiagram.code, JSON.stringify(window.meta2d.data()))
      },
      handleUpload(file) {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = event => {
          try {
            const jsonStr = event.target.result
            const jsonObj = JSON.parse(jsonStr)
            window.meta2d.open(jsonObj)
            this.$nextTick(() => {
              this.$parent.updateTree()
            })
          } catch (e) {
            this.$message.error(this.$t('jsonFileFormatError'))
          }
        }
        return false
      },
    },
    mounted() {
      this.autoSaveSetInterval = setInterval(() => {
        this.autoSaveEditInfo()
      }, 3000)
    },
    destroyed() {
      clearInterval(this.autoSaveSetInterval)
    },
    watch: {
      'editDiagram.menuLevel': {
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

<style lang="less" scoped>
  .configuration-header-container {
    display: flex;
    justify-content: space-around;
    .left-menus {
      flex: none;
      display: flex;
      .back-btn {
        padding-right: 10px;
        padding-left: 10px;
        cursor: pointer;
        color: #fff;
        border-right: 1px solid #424b5f;
        &:hover {
          color: #007eff;
        }
      }
      .name-input {
        margin-left: 10px;
        position: relative;
        display: flex;
        align-items: center;
        width: 300px;
        padding-right: 10px;
        border-right: 1px solid #424b5f;
        /deep/.ivu-input {
          padding-right: 78px;
        }
        .state {
          position: absolute;
          padding: 2px 5px;
          font-size: 12px;
          right: 16px;
          background: rgba(2, 167, 240, 0.098);
          color: #2d8cf0;
          /deep/.ivu-icon {
            animation: rotate 2s linear infinite;
          }
        }
      }
      .lac-input {
        display: flex;
        align-items: center;
        padding-left: 10px;
      }
    }
    .right-menus {
      flex: none;
      display: flex;
      align-items: center;
      .lock-icon {
        color: rgb(247, 63, 63);
      }
      .lock-preview-icon {
        color: rgb(229, 171, 0);
      }
      /deep/.ivu-upload-list {
        display: none;
      }
      .configuration-header-menu {
        color: #fff;
        margin-left: 8px;
        margin-right: 8px;
        cursor: pointer;
        user-select: none;
        .configuration-header-menu-btn {
          text-align: center;
        }
        .configuration-header-menu-text {
          white-space: nowrap;
        }
        &:hover,
        &:active {
          color: #007eff;
        }
      }
    }
  }
</style>
<style lang="less">
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
