<template>
  <div class="content-inner">
    <Input :placeholder="$t('topologyPlaceholder1')" :border="false" v-model.trim="inputValue" @on-enter="search" class="search" style="border: none" clearable>
      <Icon type="ios-search" slot="prefix" @click="search" />
    </Input>
    <div class="tree">
      <vue-easy-tree height="calc(100vh - 320px)" :item-size="40" ref="elTree" :data="elTreeList" node-key="id" showCheckbox checkStrictly defaultExpandAll renderAfterExpand :expandOnClickNode="false" highlightCurrent :filterNodeMethod="filterNodeMethod">
        <template #default="{ data }">
          <div class="tree-item">
            <div class="tree-item-text" v-textRoll @click="selectAddr(data)">
              {{ data.name }}
            </div>
            <Tag :color="data.others.oc ? '#f24e4c' : '#21f27f'" class="tree-item-tag" v-if="data.others && data.isSupportOc">{{ data.others.oc ? $t('closed') : $t('opened') }}</Tag>
            <Tag color="#D9001B" class="tree-item-tag" v-if="data.mainline === 1">{{ $t('projectMainLine') }}</Tag>
            <Tag color="#007eff" class="tree-item-tag" v-else-if="data.others && data.others.gatherAddr">{{ $t('directInputLine') }}</Tag>
            <Tag color="#F59A23" class="tree-item-tag" v-if="data.status === 0">{{ $t('abnormal') }}</Tag>
            <Icon custom="icon-v5 icon-v5-lajitong" color="#D9001B" size="24" v-if="data.status === 0" class="tree-item-del" @click="beforeDeleteNode(data)" />
          </div>
        </template>
      </vue-easy-tree>
    </div>
    <BatchOcAlarmTips ref="batchOcAlarmTips" @commitOK="handleChannelsOcPost" />
  </div>
</template>
<script>
  import Tag from './settings/Tag.vue'
  import { queryTopologyTree, deleteExceptionNode, batchRemotectrlWithJson } from '@api/console/topology'
  import { Util } from '@antv/g6'
  import { groupBy, get, toPairs, map, compose, curry } from 'lodash/fp'
  import BatchOcAlarmTips from '@/pages/console/device/deviceDetail/viewModules/common/BatchOcAlarmTips.vue'
  import { isAlarmStatus } from '@/api/control'
  import uuid from 'uuid/v1'

  const ALL = 'all'
  const FREE = 'free'
  const BLACKLIST_ID = [ALL, FREE]

  export default {
    name: 'bingo-tree-demo',
    components: {
      Tag,
      BatchOcAlarmTips,
    },
    props: {
      tabsVal: String,
    },
    data() {
      return {
        inputValue: '',
        elTreeList: [],
      }
    },
    computed: {},
    created() {},
    watch: {
      tabsVal: {
        handler(newVal) {
          if (newVal) {
            this.$refs.elTree.setCheckedNodes([])
          }
        },
      },
    },
    mounted() {
      this.getConfig()
    },
    methods: {
      filterNodeMethod(value, data) {
        if (!value) return true
        return data.name.includes(value)
      },
      async getConfig() {
        const {
          success,
          message,
          data,
        } = await queryTopologyTree({
          projectCode: this.$store.state.projectCode,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        const { freeList = [], treeList = [] } = data
        const wrapTree = tree => {
          if (tree.custom) {
            tree.id = uuid()
            tree.disabled = true
          } else {
            const {
              resId,
              addr,
              others: { name, title, mac, isSupportOc },
            } = tree
            tree.id = `${resId}-${addr}`
            tree.lineInfo = `${title}（${mac}-${addr.toString().padStart(2, '0')}）`
            tree.deviceInfo = `${name}（${mac}）`
            tree.name = `${tree.lineInfo}/${tree.deviceInfo}`
            tree.disabled = !isSupportOc
            tree.isSupportOc = isSupportOc
          }
          return true
        }
        treeList.forEach(tree => {
          Util.traverseTree(tree, wrapTree)
        })
        freeList.forEach(tree => {
          Util.traverseTree(tree, wrapTree)
        })
        let children = treeList
        // 有游离节点时才显示未归类线路
        if (freeList.length > 0) {
          children = treeList.concat({
            id: FREE,
            name: this.$t('unallocatedLine'),
            disabled: true,
            children: freeList,
          })
        }
        this.elTreeList = [
          {
            id: ALL,
            name: 'ALL',
            disabled: true,
            children,
          },
        ]
      },
      search() {
        this.$refs.elTree.filter(this.inputValue)
      },
      // 右侧显示线路
      selectAddr(data) {
        if (BLACKLIST_ID.includes(data.id) || data.custom) return
        this.$emit('electTreeObj', this.transformAddrData(data))
      },
      transformAddrData(addrData) {
        const {
          addr,
          mainline,
          status,
          others: { title, oc, mac },
        } = addrData
        return {
          name: title,
          oc,
          addr,
          mac,
          mainRoad: mainline === 1,
          status,
          title,
        }
      },
      // 批量分合闸
      async batchSwitch(status) {
        const checkedNodes = this.$refs.elTree.getCheckedNodes().filter(node => !BLACKLIST_ID.includes(node.id))
        if (checkedNodes.length === 0) {
          return this.$Message.error(this.$t('pleaseSelectLine'))
        }
        const groupByMac = groupBy(get(['others', 'mac']))
        const wrapItem = curry((onOrOff, [mac, nodeList]) => ({ mac, addrOptInfos: [{ onOrOff, addrs: map(get('addr'), nodeList) }] }))
        const getParams = compose([map(wrapItem(status)), toPairs, groupByMac])
        const params = getParams(checkedNodes)
        const res = await isAlarmStatus(params)
        if (!res.success) return this.$Message.error({ content: res.message })
        if (res.data.length > 0) {
          this.$refs.batchOcAlarmTips.openModal(res.data, status, params)
        } else {
          this.handleChannelsOcPost(params)
        }
      },
      async handleChannelsOcPost(params) {
        await batchRemotectrlWithJson(params)
        this.$Message.success(this.$t('commandSent'))
      },
      // 删除异常节点
      beforeDeleteNode({ resId, addr }) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('topologyTips1'),
          onOk: () => this.deleteNode(resId, addr),
        })
      },
      async deleteNode(resId, addr) {
        const { success, message } = await deleteExceptionNode({
          projectCode: this.$store.state.projectCode,
          resId,
          addr,
        })
        if (!success) {
          return this.$Modal.warning({
            title: this.$t('tip'),
            content: message,
          })
        }
        this.getConfig()
      },
    },
  }
</script>
<style lang="less" scoped>
  .content-inner {
    position: relative;
    height: 980px;
    .buttonGrounds {
      z-index: 99;
      margin: 5px 0;
      position: absolute;
      right: 20px;
      top: -50px;
      Button {
        margin-left: 5px;
      }
    }
    .tree {
      padding: 0 10px;
      margin-top: 16px;
      height: ~'calc(100vh - 320px)';
      overflow: auto;
      /deep/.vue-recycle-scroller {
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
      }

      /deep/.el-tree {
        background: transparent;
        color: rgba(255, 255, 255, 0.65);
      }
      /deep/.el-tree-node__content {
        height: 30px;
      }
      /deep/.el-checkbox.is-disabled {
        display: none;
      }
      .tree-item {
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-right: 30px;
        .tree-item-text {
          overflow: hidden;
          margin-right: 4px;
        }
        .tree-item-tag {
          flex-shrink: 0;
          margin-left: 8px;
        }
        .tree-item-del {
          position: absolute;
          right: 0;
        }
      }
    }
    /deep/.el-tree--highlight-current {
      .el-tree-node:focus > .el-tree-node__content {
        background: transparent;
      }
      .el-tree-node.is-current > .el-tree-node__content,
      .el-tree-node .el-tree-node__content:hover {
        background: rgba(2, 167, 240, 0.1);
        color: #02a7f0;
      }
    }
  }
</style>
