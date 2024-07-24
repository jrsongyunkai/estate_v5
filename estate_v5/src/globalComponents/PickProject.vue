<template>
  <div class="pick-project-box">
    <div class="pick-project-box-input">
      <Select v-model="model" class="select-mode" transfer :disabled="disabled" :transfer-class-name="className">
        <Option v-for="item in models" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Poptip popper-class="tree-pop-tip" placement="bottom-start" width="400" @on-popper-show="setTreeData" :disabled="disabled" transfer :transfer-class-name="className">
        <div class="title-span">{{ checkedKeys.length ? $t('selectedNum', { number: checkedKeys.length }) : $t('plsSelectDataSource') }}</div>
        <div class="tree-box-content" slot="content">
          <div class="tree-content-search">
            <div class="input-search">
              <Input class="input-box" :class="className" v-model="keyWord" :placeholder="$t('enterProjectNameAndNodeNameCheck')"></Input>
            </div>
            <vue-easy-tree height="360px" ref="TreeProject" class="tree-content" default-expand-all :default-checked-keys="checkedKeys" :filter-node-method="filterKeyword" node-key="nodeId" :data="treeData" show-checkbox>
              <div class="custom-tree-node" v-textRoll slot-scope="{ data }" @click.stop="pickProjectOne(data)">
                {{ data.label }}
              </div>
            </vue-easy-tree>
          </div>
          <div class="tree-box-footer">
            <Button size="small" @click.stop="getCheckedKeys">{{ $t('confirm2') }}</Button>
            <Button class="ml-10" size="small" @click.stop="closeModel">{{ $t('cancel') }}</Button>
          </div>
        </div>
      </Poptip>
    </div>
  </div>
</template>

<script>
  import { loadAllLocationTree, loadProjectGroupTree, getStaffProjectGroupList } from '@/api/visualScreen/index'
  export default {
    props: {
      defaultCheckedKeys: {
        type: Array,
        default: () => {
          return []
        },
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      className: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        groupModels: [],
        localOptions: [],
        treeData: [],
        model: +window.sessionStorage.getItem('view-project-source-type') || 0,
        checkedKeys: [],
        selectProjectTreeData: [],
        keyWord: '',
        seed: 0,
      }
    },
    created() {
      this.getProjectGroupList()
      this.initAllLocation()
    },
    methods: {
      async getProjectGroupList() {
        let res = await getStaffProjectGroupList()
        if (res.success) {
          this.groupModels = res.data.map(it => ({ label: it.groupName, value: it.id }))
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleLocTree(list = []) {
        return list.map(it => {
          let obj = { ...it, label: it.name, value: it.id, title: it.name, nodeId: this.seed++ }
          if (it.childs && Array.isArray(it.childs)) {
            obj.children = [...this.handleLocTree(it.childs)]
          }
          if (it.projects && Array.isArray(it.projects) && it.projects.length) {
            obj.children = [...it.projects.map(it => ({ ...it, label: it.projectName, nodeId: it.projectCode }))]
          }
          return obj
        })
      },
      async initAllLocation() {
        let res = await loadAllLocationTree()
        if (res.success) {
          this.localOptions = [
            {
              label: this.$t('all'),
              nodeId: 'all',
              children: [...this.handleLocTree(res.data.locTree), ...res.data.noLocPrjList.map(it => ({ ...it, label: it.projectName, nodeId: it.projectCode }))],
            },
          ]
          // this.treeData = JSON.parse(JSON.stringify(this.localOptions))
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleGroupTree(list = []) {
        return list.map(it => {
          let obj = { ...it, label: it.nodeName, title: it.nodeName, nodeId: it.projectCode || it.nodeId }
          if (!it.leaf) {
            obj.children = this.handleGroupTree(it.children)
          } else {
            delete obj.children
          }
          return obj
        })
      },
      async getProjectGroupTree(groupId) {
        let res = await loadProjectGroupTree({ groupId })
        if (res.success) {
          this.treeData = [{ ...res.data, label: res.data.nodeName, title: res.data.nodeName, children: [...this.handleGroupTree(res.data.children)] }]
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      closeModel() {
        document.body.dispatchEvent(new Event('mousedown', { bubbles: true, cancelable: true }))
      },
      getCheckedKeys() {
        this.selectProjectTreeData = this.$refs.TreeProject.getCheckedNodes()
        if (this.selectProjectTreeData.length === 0) {
          this.$Message.error({ content: this.$t('pleaseSelectProject') })
        } else {
          this.$emit('pickProject', this.selectProjectTreeData, () => {
            this.closeModel()
          })
        }
      },
      setTreeData() {
        if (!this.model) {
          this.treeData = JSON.parse(JSON.stringify(this.localOptions))
        }
      },
      filterKeyword(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      lookForProject(data) {
        let proCodes = []
        const innerCode = data => {
          if (data.projectCode) {
            proCodes.push(data.projectCode)
          } else if (data.children && data.children.length > 0) {
            data.children.forEach(item => innerCode(item))
          }
        }
        innerCode(data)
        return proCodes
      },
      pickProjectOne(data) {
        let projectCodeList = this.lookForProject(data)
        this.$emit('clickSingle', projectCodeList, () => {
          this.closeModel()
        })
      },
    },
    computed: {
      models() {
        return [{ label: this.$t('locationTopologyTree'), value: 0 }, ...this.groupModels]
      },
    },
    watch: {
      model: {
        handler(value) {
          window.sessionStorage.setItem('view-project-source-type', value)
          if (value) {
            this.getProjectGroupTree(value)
          } else {
            this.treeData = JSON.parse(JSON.stringify(this.localOptions))
          }
        },
        deep: true,
        immediate: true,
      },
      defaultCheckedKeys: {
        handler(value) {
          this.checkedKeys = value
          this.$refs.TreeProject.setCheckedKeys([...value])
        },
        deep: true,
      },
      keyWord(value) {
        this.$refs.TreeProject.filter(value)
      },
    },
    mounted() {
      this.checkedKeys = [...this.defaultCheckedKeys]
    },
  }
</script>

<style lang="less" scoped>
  .pick-project-box {
    display: flex;
    align-items: center;
    height: 34px;
    overflow: hidden;
    .pick-project-box-input {
      display: flex;
      align-items: center;
      height: 32px;
      background: none;
      border: 1px solid #3d3d41;
      box-sizing: border-box;
      border-radius: 4px;
      min-width: 250px;
    }
    .select-mode {
      width: 100px;
      /deep/.ivu-select-visible .ivu-select-selection {
        box-shadow: none;
      }
      /deep/.ivu-select-selection {
        border: none;
        background: none;
        box-shadow: none;
      }
    }
    /deep/.ivu-poptip {
      height: 32px;
      border-left: 1px solid #3d3d41;
      padding-left: 8px;
      width: calc(~'100% - 101px');
      text-align: left;
    }
    /deep/.ivu-poptip-rel {
      height: 30px;
      line-height: 30px;
      width: 100%;
    }
    .title-span {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      width: 100%;
    }
  }
</style>
<style lang="less">
  .tree-pop-tip {
    .ivu-poptip-body {
      padding: 0px;
    }
    .tree-box-content {
      // height: 440px;
      overflow: hidden;
      position: relative;
      .input-search {
        padding-top: 10px;
        height: 40px;
        display: flex;
        align-items: center;
        width: 90%;
        margin: 0 auto;
        .input-box {
          height: 32px;
        }
      }
      .tree-content {
        overflow: auto;
        padding: 10px;
        background: none;
        color: #fff;
        .el-tree-node__content:hover,
        .el-tree-node:focus > .el-tree-node__content {
          background: none;
          color: #007eff;
        }
        .custom-tree-node {
          width: calc(~'100% - 48px');
        }
      }
      .tree-box-footer {
        height: 40px;
        width: 100%;
        border-top: 1px solid #686262;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 10px;
      }
    }
  }
</style>
