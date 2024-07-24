<template>
  <Modal width="1000" class="power-loop-config" @on-visible-change="onVisibleChange" v-bind="$attrs" v-on="$listeners">
    <Form label-position="left" :label-width="120" :model="formData" :rules="rules" ref="formIns">
      <FormItem :label="$t('statsPeriodName')" prop="name">
        <Input v-model="formData.name" style="width: 200px" :placeholder="$t('pleaseEnter')" />
      </FormItem>
      <FormItem :label="$t('statsContent')">
        <RadioGroup v-model="formData.config.statType">
          <Radio v-for="item in STATS_TYPE_RADIOS" :key="item.value" :label="item.value">{{ item.label }}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem :label="$t('cycleTime')">
        <template #label>
          {{ $t('cycleTime') }}
          <Tooltip class="tips" max-width="200" placement="right" transfer :content="$t('powerPageTips7')"><Icon type="ios-information-circle-outline" size="12" color="#1497db" /></Tooltip>
        </template>
        <TimePicker :editable="false" v-model="formData.config.statStartHour" format="HH:00" class="time-picker" style="width: 100px" />
        {{ $t('to') }}
        <TimePicker :editable="false" v-model="formData.config.statEndHour" format="HH:00" class="time-picker" style="width: 100px" />
      </FormItem>
      <FormItem :label="$t('statsObject')">
        <Row align="middle">
          <Input style="width: 200px" :placeholder="$t('topologyPlaceholder2')" v-model="search.mac" />
          <Input style="width: 200px" :placeholder="$t('topologyPlaceholder3')" v-model="search.location" class="ml-12" />
          <Button type="primary" ghost class="ml-12" @click="query">{{ $t('query') }}</Button>
          <Button type="default" ghost class="ml-12" @click="resetSearch">{{ $t('reset') }}</Button>
        </Row>
        <DeviceTable ref="tableIns" :level="level" :initialSelectedIds="initialSelectedIds" :disabledIds="disabledIds" :data="tableData.data">
          <template v-for="(item, key) in $slots" v-slot:[key]="slotProps">
            <slot :name="key" v-bind="slotProps"></slot>
          </template>
        </DeviceTable>
        <Page :current="search.pageNo" @on-change="changePage" :total="tableData.total" :showTotal="false" />
      </FormItem>
    </Form>

    <template #footer>
      <Button type="primary" @click="onConfirm">{{ confirmText }}</Button>
      <Button type="primary" ghost @click="$emit('on-cancel')">{{ cancelText }}</Button>
    </template>
  </Modal>
</template>

<script>
  import { cloneDeep } from 'lodash'
  import { pageQueryAddrCommon } from '@api/public'
  import { STATS_TYPE_RADIOS } from './constants'

  const defaultSearch = {
    mac: '',
    location: '',
    pageNo: 1,
    pageSize: 10,
  }
  const defaultTableData = {
    data: [],
    total: 0,
  }

  export default {
    props: {
      formData: {
        type: Object,
        default: () => {},
      },
      level: {
        type: Number,
        default: 1,
      },
      conditions: {
        type: Object,
        default: () => {},
      },
      initialSelectedIds: {
        type: Array,
        default: () => [],
      },
      disabledIds: {
        type: Array,
        default: () => [],
      },
      confirmText: {
        type: String,
        default: window.$t('confirm2'),
      },
      cancelText: {
        type: String,
        default: window.$t('cancel'),
      },
    },
    data() {
      return {
        visible: true,
        search: cloneDeep(defaultSearch),
        tableData: cloneDeep(defaultTableData),
        rules: {
          name: [{ required: true, message: this.$t('periodNameCannotEmpty'), trigger: 'blur' }],
        },
      }
    },
    created() {
      this.STATS_TYPE_RADIOS = STATS_TYPE_RADIOS
    },
    methods: {
      async query() {
        const { success, message, total, datas } = await pageQueryAddrCommon({
          projectCode: this.$store.state.projectCode,
          ...this.search,
          ...this.conditions,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        this.tableData.total = total
        this.tableData.data = datas
      },
      resetSearch() {
        this.search = cloneDeep(defaultSearch)
        this.query()
      },
      changePage(n) {
        this.search.pageNo = n
        this.query()
      },
      onVisibleChange(visible) {
        if (visible) {
          this.$refs.tableIns.setSelected(this.initialSelectedIds)
          this.query()
        } else {
          this.search = cloneDeep(defaultSearch)
          this.tableData = cloneDeep(defaultTableData)
          this.$refs.tableIns.clearSelected()
          this.$refs.formIns.resetFields()
        }
      },
      async onConfirm() {
        const isValid = await this.$refs.formIns.validate()
        if (!isValid) return
        const selectedMap = this.$refs.tableIns.selectedMap
        if (selectedMap.size === 0) {
          return this.$Message.error(this.$t('selectedNotNull'))
        }
        this.$emit(
          'on-ok',
          Array.from(selectedMap).map(([id, data]) => ({ id, data }))
        )
      },
    },
  }
</script>

<style lang="less" scoped>
  .power-loop-config {
    .ml-12 {
      margin-left: 12px;
    }
    /deep/.ivu-modal-body {
      padding-bottom: 0;
    }
    /deep/.ivu-modal-footer {
      border-color: transparent;
    }
  }
  .time-picker {
    width: 100px;
    /deep/.ivu-time-picker-cells-list {
      width: 100%;
      display: none;
      overflow: auto;
      &:first-child {
        display: block;
      }
      .ivu-time-picker-cells-cell {
        padding-left: 0;
        text-align: center;
      }
    }
  }
</style>
