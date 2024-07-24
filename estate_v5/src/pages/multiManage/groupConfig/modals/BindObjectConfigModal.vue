<template>
  <div>
    <Modal width="80%" class="object-picker" :title="$t('bindObj')" @on-cancel="$emit('close')" v-model="isShow">
      <div class="content-box">
        <div class="left">
          <div class="type-item" v-for="(item, index) in deviceClass" :key="index" :class="{ active: selectType === index }" @click.stop="selectDeviceClass(index)">
            <div class="name" v-textRoll>{{ item.name }}</div>
            <div class="value">{{ `(${$t('selectedTip', { num: getLength(item.types) })} )` }}</div>
          </div>
        </div>
        <div class="right">
          <ObjectTable ref="objectTable" v-if="record.action === 'edit'" :level="selectType === 0 ? 2 : 1" :key="selectType" @cancelAllSelect="cancelAllSelect" @change="changeSelect" :conditions="conditions" :initialSelectedIds="initialSelectedIds"></ObjectTable>
          <LookObjectTable v-else :key="selectType" :deviceList="typeDeviceList" :level="selectType === 0 ? 2 : 1"></LookObjectTable>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" v-if="record.action === 'edit'" @click="onConfirm">{{ $t('confirm2') }}</Button>
        <Button type="primary" ghost @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { saveBoxGroupDevices } from '@/api/public'
  import deviceClassification from '@/mixins/deviceClassification'
  import ObjectTable from '../component/ObjectTable.vue'
  import LookObjectTable from '../component/LookObjectTable.vue'
  import { omit } from 'lodash'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    components: { ObjectTable, LookObjectTable },
    mixins: [deviceClassification],
    data() {
      return {
        isShow: false,
        selectType: 0,
        selectedDevices: [],
        selectedDevicesMap: {},
      }
    },
    computed: {
      initialSelectedIds() {
        let list = []
        this.selectedDevices.forEach(item => {
          list.push(`${item.resId}`)
          item.addrs &&
            item.addrs.forEach(it => {
              list.push(`${item.resId}-${it}`)
            })
        })
        return list
      },
      conditions() {
        return { equipmentTypes: this.deviceClass[this.selectType].types.toString() }
      },
      typeDeviceList() {
        let types = this.deviceClass[this.selectType].types
        return this.selectedDevices
          .filter(it => types.includes(it.equipmentType))
          .map(item => ({
            ...item,
            addrList: item.lines ? item.lines.map(v => ({ value: v.addr, label: `${v.title}(${item.mac}-${v.addr.toString().padStart(2, '0')})` })) : [],
          }))
      },
    },
    methods: {
      changeSelect(list) {
        let addrList = list
          .filter(it => it.id.includes('-'))
          .map(it => it.id.split('-'))
          .filter(([resId, addr]) => +addr)
        let deviceList = list
          .filter(it => !it.id.includes('-'))
          .map(it => {
            if (it.data) {
              this.selectedDevicesMap[it.id] = { resId: +it.id, mac: it.data.mac, equipmentType: it.data.equipmentType }
            }
            return it.data
              ? {
                  resId: +it.id,
                  mac: it.data.mac,
                  equipmentType: it.data.equipmentType,
                  addrs: addrList.filter(([rid, addr]) => rid === it.id).map(([rid, addr]) => +addr),
                }
              : {
                  ...omit(this.selectedDevicesMap[it.id], ['lines', 'boxName', 'boxAddress', 'onlineStatus']),
                  addrs: addrList.filter(([rid, addr]) => rid === it.id).map(([rid, addr]) => +addr),
                }
          })
        this.selectedDevices = deviceList
      },
      getLength(types) {
        return this.selectedDevices.filter(it => it && types.includes(it.equipmentType)).length
      },
      cancelAllSelect() {
        this.selectedDevices = this.selectedDevices.filter(it => !this.deviceClass[this.selectType].types.includes(it.equipmentType))
      },
      selectDeviceClass(index) {
        this.selectType = index
      },
      async onConfirm() {
        this.$Spin.show({
          render: h => {
            return h('div', [h('Icon', { class: 'demo-spin-icon-load', props: { type: 'ios-loading', size: 18 } }), h('div', window.$t('saving'))])
          },
        })
        const res = await saveBoxGroupDevices({ id: this.record.info.id, devices: this.selectedDevices })
        if (res.success) {
          this.$Spin.hide()
          this.$Message.success({ content: res.message })
          this.$emit('close')
          this.callback && this.callback()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    created() {},
    mounted() {
      this.isShow = true
      this.selectedDevices = this.record.selectedDevices
      this.selectedDevicesMap = this.selectedDevices.reduce((map, item) => {
        map[item.resId] = item
        return map
      }, {})
    },
  }
</script>

<style lang="less">
  .object-picker {
    padding: 10px;
    .ivu-modal-body {
      padding: 10px;
    }
    .content-box {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      .left {
        flex-shrink: 0;
        width: 250px;
        border-right: 1px solid #3d3d41;
        height: 626px;
        overflow-y: auto;
        padding-right: 10px;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
        .type-item {
          height: 36px;
          width: 100%;
          line-height: 36px;
          margin-bottom: 10px;
          background: #ffffff0d;
          padding: 0px 10px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          flex-wrap: nowrap;
          .name {
            flex: 1;
            overflow: hidden;
            margin-right: 8px;
          }
          &:hover {
            background: #ffffff1a;
            color: #2d8cf0;
          }
          &.active {
            background: #ffffff1a;
            color: #2d8cf0;
            border: 1px solid #2d8cf0;
          }
        }
      }
      .right {
        width: calc(~'100% - 250px');
        padding-left: 10px;
      }
    }
  }
</style>
