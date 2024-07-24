<template>
  <Card :bordered="false" dis-hover class="config-page">
    <Row justify="space-between" align="middle" class="config-page-title">
      <div>{{ $t('timeConfigList') }}</div>
      <Button type="primary" ghost @click="createConfig">{{ $t('addConfig') }}</Button>
    </Row>
    <Table :columns="columns" :data="tableData.data">
      <template #loopTime="{ row }">
        {{ $t('timeRangeValue', { startTime: row.config.statStartHour, endTime: row.config.statEndHour }) }}
        <span v-if="row.config.isNextDay">({{ $t('nextDay') }})</span>
      </template>
      <template #statsType="{ row }">{{ STATS_TYPE_MAP[row.config.statType] }}</template>
      <template #addrList="{ row }">
        <div class="tag" v-textRoll>{{ getTagText(row.config.statObj[0]) }}</div>
        <Tooltip placement="top" transfer transfer-class-name="fix-tooltip-max-width" v-if="row.config.statObj.length > 1">
          <Tag>{{ `+${row.config.statObj.length - 1}` }}</Tag>
          <div slot="content">
            <div v-for="(item, index) in row.config.statObj" :key="index">
              {{ getTagText(item) }}
            </div>
          </div>
        </Tooltip>
      </template>
      <template #actions="{ row }">
        <Button style="color: #007eff" type="text" @click="viewStatsTable(row.id, row.config.statType)">{{ $t('viewPowerStats') }}</Button>
        <Button style="color: #007eff" type="text" @click="editConfig(row)">{{ $t('edit') }}</Button>
        <Button style="color: #e03c3a" type="text" @click="beforeDeleteConfig(row.id)">{{ $t('delete') }}</Button>
      </template>
    </Table>
    <Page show-total :current="search.pageNo" @on-change="changeConfigListPage" :total="tableData.total" />
    <CustomLoopPowerConfig v-model="configModalVisible" :title="formData.groupId ? $t('editConfig') : $t('addConfig')" :formData="formData" @on-ok="saveConfig" @on-cancel="configModalVisible = false" :level="2" :initialSelectedIds="initialSelectedIds" :conditions="{ lineType: 'EXCEPT_IO' }" />
    <CustomLoopPowerStats v-model="statsModalConfig.visible" :groupId="statsModalConfig.groupId" :type="statsModalConfig.type" />
  </Card>
</template>

<script>
  import { cloneDeep, omit } from 'lodash'
  import { addrEditGroup, delGroup } from '@api/public'
  import { pageByType } from '@api/energyMonitor/power'
  import CustomLoopPowerConfig from './CustomLoopPowerConfig.vue'
  import { STATS_TYPE_MAP } from './constants'
  import { time2hour, hour2time } from '@utils/time'
  import CustomLoopPowerStats from './CustomLoopPowerStats.vue'

  const defaultSearch = {
    type: 1,
    pageNo: 1,
    pageSize: 10,
  }
  const defaultTableData = {
    data: [],
    total: 0,
  }

  const defaultFormData = {
    groupId: null,
    name: '',
    config: {
      statStartHour: '00:00',
      statEndHour: '00:00',
      statType: 1,
      statObj: [],
    },
  }

  export default {
    components: {
      CustomLoopPowerConfig,
      CustomLoopPowerStats,
    },
    data() {
      return {
        search: cloneDeep(defaultSearch),
        tableData: cloneDeep(defaultTableData),
        configModalVisible: false,
        formData: cloneDeep(defaultFormData),
        statsModalConfig: {
          visible: false,
          groupId: null,
          type: null,
        },
      }
    },
    computed: {
      initialSelectedIds() {
        return this.formData.config.statObj.map(item => `${item.resId}-${item.addr}`)
      },
    },
    created() {
      this.STATS_TYPE_MAP = STATS_TYPE_MAP
      this.columns = [
        {
          title: this.$t('periodName'),
          key: 'name',
        },
        {
          title: this.$t('cycleTime'),
          slot: 'loopTime',
        },
        {
          title: this.$t('statsTime'),
          slot: 'statsType',
        },
        {
          title: this.$t('statsObject'),
          slot: 'addrList',
          minWidth: 200,
        },
        {
          title: this.$t('createdTime'),
          key: 'createTime',
        },
        {
          title: this.$t('operation'),
          slot: 'actions',
          width: 210,
          align: 'center',
        },
      ]
    },
    mounted() {
      this.queryConfigList()
    },
    methods: {
      deserializeConfig(configStr) {
        const { statStartHour, statEndHour, ...rest } = JSON.parse(configStr)

        return {
          ...rest,
          statStartHour: hour2time(statStartHour),
          statEndHour: hour2time(statEndHour),
          isNextDay: statStartHour >= statEndHour,
        }
      },
      serializeConfig(config) {
        const { statStartHour, statEndHour, ...rest } = omit(config, 'isNextDay')

        return JSON.stringify({
          ...rest,
          statStartHour: time2hour(statStartHour),
          statEndHour: time2hour(statEndHour),
        })
      },
      getTagText(item) {
        return `${item.deviceName}（${item.mac}）/${item.addrName}（${item.mac}-${item.addr.toString().padStart(2, '0')}）`
      },
      async queryConfigList() {
        const { success, message, total, datas } = await pageByType({
          projectCode: this.$store.state.projectCode,
          ...this.search,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        this.tableData.total = total
        this.tableData.data = datas.map(item => {
          return {
            ...item,
            config: item.config ? this.deserializeConfig(item.config) : {},
          }
        })
      },
      changeConfigListPage(n) {
        this.search.pageNo = n
        this.queryConfigList()
      },
      async deleteConfig(groupId) {
        const { success, message } = await delGroup({ groupId })
        if (!success) return this.$Message.error(message)
        this.queryConfigList()
      },
      beforeDeleteConfig(groupId) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmRemoveConfig'),
          onOk: () => this.deleteConfig(groupId),
        })
      },
      viewStatsTable(groupId, type) {
        this.statsModalConfig = {
          visible: true,
          groupId,
          type,
        }
      },
      createConfig() {
        this.formData = cloneDeep(defaultFormData)
        this.configModalVisible = true
      },
      editConfig(row) {
        const { isNextDay, ...config } = omit(row.config, 'isNextDay')
        this.formData = {
          groupId: row.id,
          name: row.name,
          config,
        }
        this.configModalVisible = true
      },
      async saveConfig(addrList) {
        this.formData.config.statObj = addrList.map(({ id, data }) => {
          // 已经选中的线路在弹窗分页中尚未查询到的data为null，直接用旧配置中的数据
          if (!data) {
            const [resId, addr] = id.split('-').map(Number)
            return this.formData.config.statObj.find(item => {
              return item.resId === resId && item.addr === addr
            })
          }
          return {
            resId: data.resId,
            mac: data.parent.mac,
            deviceName: data.parent.name,
            addr: data.addr,
            addrName: data.title,
          }
        })
        const { success, message } = await addrEditGroup({
          projectCode: this.$store.state.projectCode,
          type: 1,
          name: this.formData.name,
          groupId: this.formData.groupId,
          config: this.serializeConfig(this.formData.config),
        })
        if (!success) return this.$Message.error(message)
        this.configModalVisible = false
        this.queryConfigList()
      },
    },
  }
</script>

<style lang="less" scoped>
  .config-page {
    .config-page-title {
      margin-bottom: 20px;
    }
    /deep/.ivu-btn-text {
      padding: 0 4px;
    }
    .tag {
      border: 1px solid #3d3d41;
      padding: 0 8px;
      margin: 2px 4px 2px 0;
      vertical-align: middle;
      display: inline-block;
      max-width: 100%;
    }
  }
</style>
