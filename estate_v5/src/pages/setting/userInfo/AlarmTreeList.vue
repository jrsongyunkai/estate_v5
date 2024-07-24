<template>
  <div class="alarm-tree-list">
    <div v-for="item1 in treeList" :key="item1.typeNumber" class="l1">
      <div class="l1-checkbox">
        <Checkbox :value="isChecked(item1)" :disabled="isDisabled(item1)" :indeterminate="isIndeterminate(item1)" @on-change="toggleAll(item1, $event)">{{ item1.info }}</Checkbox>
      </div>
      <div class="l1-children">
        <div v-for="item2 in item1.children" :key="item2.typeNumber" class="l2">
          <div class="l2-checkbox">
            <Checkbox :value="isChecked(item2)" :disabled="isDisabled(item2)" :indeterminate="isIndeterminate(item2)" @on-change="toggleAll(item2, $event)">{{ item2.info }}</Checkbox>
          </div>
          <div class="l2-children">
            <div class="l3" v-for="leaf in item2.children" :key="leaf.typeNumber">
              <Checkbox :disabled="leaf.disabled" v-model="leaf.checked" class="dx">
                <span v-textRoll>{{ leaf.info }}</span>
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { queryAlarmForConfig } from '@/api/public'

  export default {
    props: {
      checkedAlarm: {
        type: Array,
        default: () => [],
      },
      disabledAlarm: {
        type: Array,
        default: () => [],
      },
      projectList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        treeList: [],
      }
    },
    computed: {
      checkedList() {
        return this.getCheckedList(this.treeList)
      },
    },
    mounted() {
      this.getAlarmTreeList()
    },
    watch: {
      checkedAlarm: {
        handler(val) {
          this.updateCheckedAlarm(val)
        },
      },
      disabledAlarm: {
        handler(val) {
          this.updateDisabledAlarm(val)
        },
      },
    },
    methods: {
      getCheckedList(treeList) {
        return treeList.flatMap(item => {
          if (item.isLeaf) {
            return item.checked ? item : []
          } else {
            return this.getCheckedList(item.children)
          }
        }, Infinity)
      },
      async getAlarmTreeList() {
        const projectCodes = this.notEmptyArray(this.projectList) ? this.projectList.join(',') : ''
        const { success, message, data } = await queryAlarmForConfig({ projectCodes })
        if (!success) return this.$Message.error(message)

        if (this.notEmptyArray(data.alarms) || this.notEmptyArray(data.warns)) {
          const modalAlarm = {
            typeNumber: 'modal',
            info: this.$t('modalAlarm'),
            children: [],
          }
          this.treeList.push(modalAlarm)
          const wrapAlarm = item => ({ ...item, checked: false, disabled: false, isLeaf: true })
          if (this.notEmptyArray(data.alarms)) {
            modalAlarm.children.push({
              typeNumber: 'alarm',
              info: this.$t('alarm'),
              children: data.alarms.map(wrapAlarm),
            })
          }
          if (this.notEmptyArray(data.warns)) {
            modalAlarm.children.push({
              typeNumber: 'warn',
              info: this.$t('earlyWarning'),
              children: data.warns.map(wrapAlarm),
            })
          }
        }
        if (this.notEmptyArray(data.customs)) {
          this.treeList.push({
            typeNumber: 'custom',
            info: this.$t('customAlarm'),
            children: data.customs.map(({ projectCode, projectName, alarms }) => {
              return {
                typeNumber: projectCode,
                info: projectName,
                children: alarms.map(item => ({ projectCode, projectName, typeNumber: item.id, info: item.name, checked: false, disabled: false, isLeaf: true })),
              }
            }),
          })
        }
        this.updateCheckedAlarm(this.checkedAlarm)
        this.updateDisabledAlarm(this.disabledAlarm)
      },
      updateCheckedAlarm(list) {
        this.reset(this.treeList, 'checked')
        list.forEach(typeNumber => this.toggleAlarm(typeNumber, 'checked', true))
      },
      updateDisabledAlarm(list) {
        this.reset(this.treeList, 'disabled')
        list.forEach(typeNumber => this.toggleAlarm(typeNumber, 'disabled', true))
      },
      isChecked(item) {
        return this.every(item, 'checked')
      },
      isDisabled(item) {
        return this.every(item, 'disabled')
      },
      isIndeterminate(item) {
        return !this.every(item, 'checked') && this.some(item, 'checked')
      },
      notEmptyArray(arr) {
        return Array.isArray(arr) && arr.length > 0
      },
      every(item, field) {
        return item.children.every(child => (child.isLeaf ? child[field] : this.every(child, field)))
      },
      some(item, field) {
        return item.children.some(child => (child.isLeaf ? child[field] : this.some(child, field)))
      },
      toggleAll(item, value) {
        if (item.isLeaf) {
          if (!item.disabled) {
            item.checked = value
          }
        } else {
          item.children.forEach(child => this.toggleAll(child, value))
        }
      },
      toggleAlarm(typeNumber, field, value) {
        const alarm = this.findAlarm(typeNumber, this.treeList)
        if (alarm) alarm[field] = value
      },
      findAlarm(typeNumber, treeList) {
        for (let i = 0; i < treeList.length; i++) {
          const item = treeList[i]
          if (item.typeNumber === typeNumber) return item
          if (item.children) {
            const result = this.findAlarm(typeNumber, item.children)
            if (result) return result
          }
        }
      },
      reset(treeList, field, initialValue = false) {
        treeList.forEach(item => {
          if (item.isLeaf) {
            item[field] = initialValue
          } else {
            this.reset(item.children, field, (initialValue = false))
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .alarm-tree-list {
    .l1 {
      display: flex;
      align-items: center;
      border: 1px solid #797979;
      border-top: none;
      &:first-child {
        border: 1px solid #797979;
      }
      .l1-checkbox {
        width: 140px;
        padding: 30px 20px;
        flex-shrink: 0;
        align-self: stretch;
        background: #28303e;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .l1-children {
        flex: 1;
      }
    }
    .l2 {
      display: flex;
      align-items: center;
      border-left: 1px solid #797979;
      border-top: 1px solid #797979;
      &:first-child {
        border-top: none;
      }
      .l2-checkbox {
        width: 140px;
        padding: 30px 20px;
        flex-shrink: 0;
        align-self: stretch;
        background: #28303e;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #797979;
      }

      .l2-children {
        flex: 1;
        padding: 30px 20px;
        display: flex;
        flex-wrap: wrap;
      }
    }
    .dx {
      display: flex;
    }
    .l3 {
      width: 140px;
      margin: 5px 5px 5px 0;
    }
  }
</style>
