<template>
  <div class="editor-icon">
    <div class="search-box">
      <Input suffix="ios-search" v-model="searchInput" :placeholder="$t('pleaseEnterComponentName')" class="search-input" />
    </div>
    <Tabs value="system" :animated="false">
      <TabPane :label="$t('systemComponents')" name="system">
        <div class="system-icon">
          <Collapse v-model="activeCollapse" @on-change="onCollapse" simple accordion>
            <Panel name="common" v-if="oftenIcons">
              <div class="collapse-title">{{ `${$t('commonGraphics')}(${oftenIcons.length})` }}</div>
              <template #content>
                <div class="collapse-content">
                  <div v-show="oftenIcons.length < 1" class="empty-configuration">
                    <span>{{ $t('noCommonlyUsedIcons') }}</span>
                  </div>
                  <div class="icon" v-for="(icon, index) in oftenIcons" :key="index" draggable="true" @dragstart="onDragstart(icon, $event)" @dragend="onDragEnd(icon)" :title="icon.name">
                    <img :src="icon.image" v-if="icon.image" />
                    <Icon :custom="`icon-v5 ${icon.icon}`" v-else />
                  </div>
                </div>
              </template>
            </Panel>
            <Panel v-for="(group, index) in IconGroupsRef" :key="index" :name="group.name">
              <div class="collapse-title" :title="`${group.name}(${group.list.length})`">{{ `${group.name}(${group.list.length})` }}</div>
              <template #content>
                <div class="empty-configuration" v-if="group.list.length === 0">
                  <span>{{ $t('NoComponents') }}</span>
                </div>
                <div class="collapse-content flex" v-else>
                  <div class="icon" v-for="(icon, i) in group.list" :key="i" draggable="true" @dragstart="onDragstart(icon, $event)" @dragend="onDragEnd(icon)" :title="icon.name">
                    <img :src="icon.image" v-if="icon.image" />
                    <Icon :custom="`icon-v5 ${icon.icon}`" v-else />
                  </div>
                </div>
              </template>
            </Panel>
          </Collapse>
        </div>
      </TabPane>
      <TabPane :label="$t('personalComponents')" name="self">
        <div class="system-icon self-icon">
          <Button class="add-icon-btn" type="dashed" @click.stop="addMyGroupType">{{ $t('addClassification') }}</Button>
          <Collapse v-model="activeSelfCollapse" @on-change="onCollapseSelf" simple accordion>
            <Panel v-for="(group, index) in selfIcons" :key="index" :name="group.uuid">
              <div class="collapse-title collapse-title-btn-box">
                <div class="collapse-title" :title="`${group.name}(${group.list.length})`">{{ `${group.name}(${group.list.length})` }}</div>
                <span class="collapse-title-box">
                  <div @click.stop="" style="display: flex; align-items: center">
                    <Upload style="display: flex; align-items: center" accept=".svg,.png,.jpg" name="imgFile" :data="{ name: 'imgFile' }" :action="uploadUrl" :show-upload-list="false" :before-upload="file => beforeUpload(file, group)" :on-success="handleSuccess">
                      <Icon custom="icon-v5 icon-v5-tubiao-05" :title="$t('fileImport')" />
                    </Upload>
                    <Icon v-if="index > 0" custom="icon-v5 icon-v5-changyonggoupiaorenshanchu" @click.stop="delGroupItem(group)" :title="$t('delete')" class="collapse-title-del-icon" />
                  </div>
                </span>
              </div>
              <template #content>
                <div class="empty-configuration" v-if="group.list.length === 0">
                  <span>{{ $t('NoComponents') }}</span>
                </div>
                <div class="collapse-content" v-else>
                  <div class="icon" draggable="true" v-for="(icon, idx) in group.list" :key="idx" @dragstart="onDragstart(icon.pensData, $event)" @dragend="onDragEnd(icon.pensData)" :title="icon.name">
                    <img :src="activeSelfCollapse.includes(group.uuid) || group.loadData ? icon.pensData.image : ''" />
                    <Icon custom="icon-v5 icon-v5-changyonggoupiaorenshanchu" @click.stop="delIconItem(icon)" class="collapse-title-del-icon" />
                  </div>
                </div>
              </template>
            </Panel>
          </Collapse>
        </div>
      </TabPane>
    </Tabs>
    <Modal v-model="isOpenAdd" :title="$t('addClassification')" width="520px" :mask-closable="false">
      <MForm ref="formDataRef" v-if="isOpenAdd" :formSetting="formSetting" v-model="formData" :labelWidth="100"></MForm>
      <div slot="footer">
        <Button type="primary" class="ml-10" @click.stop="saveGroupInfo">{{ $t('save') }}</Button>
        <Button type="default" class="ml-10" @click.stop="closeModal">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { IconGroups, svg2Pens, png2Pens } from '../util/process'
  import { httpRequest, baseUrl } from '../util/http'
  import { diagramIndexedDB } from '@/plugins/indexDB/index'
  import { getUnitClassList, saveUnitClass, delUnitClass, addUnit, delUnit } from '@/api/multiManage/diagram'
  import store from '@/store/index'
  import uuid from 'uuid/v1'

  export default {
    name: 'EditorProps',
    data() {
      return {
        IconGroupsVal: IconGroups,
        searchInput: '',
        activeCollapse: [this.$t('ns_iconGroups.basicShape')],
        activeSelfCollapse: [],
        isOpenAdd: false,
        formSetting: [
          {
            formType: 'Input',
            label: this.$t('classificationName'),
            prop: 'name',
            colSpan: 24,
            placeholder: this.$t('pleaseEnterClassificationName'),
            attr: { maxlength: 10, 'show-word-limit': true },
            event: '',
            rules: [{ required: true, message: this.$t('pleaseEnterClassificationName'), trigger: 'blur' }],
          },
        ],
        formData: { name: '' },
        uploadUrl: '/sketch/file/upload.as?fileType=1&&urlAbsolute=true',
        selfIconsArray: [],
        uploadFile: null,
        uploadFileGroup: null,
      }
    },
    computed: {
      IconGroupsRef() {
        if (this.searchInput) {
          return this.IconGroupsVal.map(group => {
            return {
              ...group,
              list: group.list.filter(icon => {
                return icon.name.includes(this.searchInput)
              }),
            }
          }).filter(group => {
            return group.list.length > 0
          })
        }
        return this.IconGroupsVal
      },
      oftenIcons() {
        if (this.searchInput) {
          const filterIcons = this.$store.state.diagram.oftenIcons.filter(icon => {
            return icon.name.includes(this.searchInput)
          })
          return filterIcons.length ? filterIcons : ''
        }
        return this.$store.state.diagram.oftenIcons
      },
      selfIcons() {
        return this.selfIconsArray
      },
    },
    methods: {
      beforeUpload(file, group) {
        this.uploadFile = file
        this.uploadFileGroup = group
        return true
      },
      handleSuccess(res) {
        if (res.success) {
          this.saveUnitIcon(res.data)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async saveUnitIcon(filePath) {
        const res = await addUnit({
          projectCode: this.$store.state.projectCode,
          uuid: this.uploadFileGroup.uuid,
          fileName: this.uploadFile.name && this.uploadFile.name,
          filePath,
        })
        if (res.success) {
          this.getSelfIcon()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      sliceArrayByCount(array, sliceCount) {
        const slicedArray = []
        for (let i = 0; i < array.length; i += sliceCount) {
          slicedArray.push(array.slice(i, i + sliceCount))
        }
        return slicedArray
      },
      async onCollapse(activeNames) {
        this.activeCollapse = activeNames
        const activeItem = this.IconGroupsVal.find(v => v.name === activeNames[0])
        if (activeItem && activeItem.loadData && activeItem.loadData === 1) {
          // 如果进来就算加载一次了， 此时不会再进行第二次加载
          activeItem.loadData = 2
          const url = `${baseUrl}${activeNames[0]}`
          const lists = this.sliceArrayByCount(activeItem.list, 50)
          activeItem.list = []
          for (let i = 0; i < lists.length; i++) {
            const result = await Promise.allSettled(
              lists[i].map(f => {
                f.fullUrl = `${url}/${f.name}`
                return f.name.includes('svg') ? svg2Pens(f, activeNames[0]) : png2Pens(f, activeNames[0])
              })
            )
            activeItem.list.push(...result.map(v => v.value))
          }
        }
      },
      async onCollapseSelf(activeNames) {
        this.activeSelfCollapse = activeNames
        const activeItem = this.selfIconsArray.find(v => v.uuid === activeNames[0])
        if (activeItem && !activeItem.loadData) {
          activeItem.loadData = 1
        }
      },
      onDragstart(icon, e) {
        e.dataTransfer && e.dataTransfer.setData('meta2d', JSON.stringify(icon.data))
      },
      onDragEnd(icon) {
        store.commit('diagram/addOftenIcon', icon)
      },
      addMyGroupType() {
        this.formData.name = ''
        this.isOpenAdd = true
      },
      // 新增分组
      async saveGroupInfo() {
        if (this.$refs.formDataRef.validate()) {
          const res = await saveUnitClass({ name: this.formData.name, uuid: uuid(), projectCode: this.$store.state.projectCode })
          if (res.success) {
            this.getSelfIcon()
            this.$Message.success(this.$t('newSuccessfullyAdded'))
            this.closeModal()
          } else {
            this.$Message.error(res.message)
          }
        }
      },
      closeModal() {
        this.$refs.formDataRef.reset()
        this.isOpenAdd = false
      },
      async init() {
        const res = await httpRequest.get()
        const result = Array.isArray(res) && res.length > 0 ? res.map(v => ({ ...v, loadData: 1 })) : []
        this.IconGroupsVal = [...IconGroups, ...result]
      },
      // 获取自定义分组组件
      async getSelfIcon() {
        const res = await getUnitClassList({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.selfIconsArray = res.data.map(it => {
            let listObj = this.selfIconsArray.find(v => v.uuid === it.uuid)
            return {
              ...it,
              loadData: listObj && listObj.list.length === it.list.length ? listObj.loadData : 0,
              list: [
                ...it.list.map(im => {
                  let obj = { ...im, fullUrl: im.filePath, name: im.fileName }
                  if (obj.name.includes('svg')) {
                    Object.assign(obj, { pensData: svg2Pens(obj, it.name) })
                  } else {
                    Object.assign(obj, { pensData: png2Pens(obj, it.name) })
                  }
                  return obj
                }),
              ],
            }
          })
        } else {
          this.$Message.error(res.message)
        }
      },
      // 删除分组
      delGroupItem(group) {
        const params = { uuid: group.uuid, projectCode: this.$store.state.projectCode }
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: `<div>${this.$t('deleteConfirmTip')}</div>`,
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: async () => {
            const res = await delUnitClass(params)
            if (res.success) {
              this.$Message.success({ content: res.message })
              this.getSelfIcon()
            } else {
              this.$Message.error({ content: res.message })
            }
          },
        })
      },
      // 删除图片
      async delIconItem(icon) {
        const res = await delUnit({ id: icon.id, uuid: icon.uuid })
        if (res.success) {
          this.getSelfIcon()
        } else {
          this.$Message.error(res.message)
        }
      },
    },
    mounted() {
      this.init()
      this.getSelfIcon()
      diagramIndexedDB.getItem('oftenIcons').then(res => {
        if (res) {
          store.commit('diagram/setOftenIcons', res)
        }
      })
    },
    destroyed() {},
  }
</script>

<style lang="less" scoped>
  .editor-icon {
    .search-box {
      width: 100%;
      padding: 10px;
    }
    /deep/.ivu-tabs {
      height: 100%;
      .ivu-tabs-nav {
        margin-left: 16px;
        .ivu-tabs-tab {
          padding: 8px 6px;
        }
      }
      .ivu-tabs-nav-wrap {
        margin-bottom: 0px;
        border-bottom: 1px solid #424b5f;
      }
      .ivu-tabs-bar {
        margin-bottom: 0px;
      }
      .ivu-tabs-content {
        height: calc(~'100% - 87px');
        overflow: auto;
      }
    }
    .system-icon {
      /deep/.ivu-collapse {
        background: #1a202e;
        border: none;
        .ivu-collapse-item {
          border: none;
          &.ivu-collapse-item-active > .ivu-collapse-header {
            border: none;
          }
          .ivu-collapse-content {
            padding: 0 0 0 15px;
          }
        }
      }
    }
    .self-icon {
      /deep/.ivu-collapse {
        background: #1a202e;
        border: none;
        .ivu-collapse-item {
          border: none;
          &.ivu-collapse-item-active > .ivu-collapse-header {
            border: none;
          }
          .ivu-collapse-content {
            padding: 0 0 0 15px;
          }
        }
      }
    }
    .add-icon-btn {
      width: calc(~'100% - 16px') !important;
      margin: 8px;
    }
    .collapse-title-btn-box {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
      padding-right: 8px;
      width: 100%;
      .collapse-title-box {
        display: none;
        /deep/.ivu-upload-select {
          display: flex;
          align-items: center;
        }
      }
      &:hover {
        .collapse-title-box {
          display: block;
        }
      }
    }
    /deep/.ivu-collapse-content {
      padding: 10px;
    }
  }
  .empty-configuration {
    width: 100%;
    font-size: 12px;
    color: #afafaf;
    text-align: center;
    user-select: none;
    padding: 10px;
  }
  .collapse-title {
    padding: 0 5px 0 0px;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 1;
  }
  .collapse-title-del-icon {
    color: rgb(247, 63, 63) !important;
    margin-left: 4px;
  }
  .collapse-content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  :deep(.ivu-collapse-content-box) {
    padding: 0;
  }
  :deep(.ivu-icon-ios-arrow-forward) {
    width: 20px !important;
    margin-right: 0px !important;
  }
  .icon {
    flex: none;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    color: #eee;
    margin: 6px;
    cursor: pointer;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .collapse-title-del-icon {
      position: absolute;
      top: 4px;
      right: 4px;
      z-index: 1;
      font-size: 16px;
    }
  }
  .icon:hover {
    background-color: #00000010;
  }
  .icon > i {
    font-size: 46px;
  }

  .icon-v5 {
    color: #eee;
  }
</style>
