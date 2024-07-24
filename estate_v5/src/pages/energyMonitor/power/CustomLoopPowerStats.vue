<template>
  <Modal :title="$t('electricityStatistics')" width="800" :mask="false" :footer-hide="true" @on-visible-change="onOnVisibleChange" v-bind="$attrs" v-on="$listeners">
    <Table border show-summary :summary-method="handleSummary" :columns="columns" :data="powerData" style="margin-top: 20px" maxHeight="522" class="fix-summary-scroll"></Table>
  </Modal>
</template>

<script>
  import { queryCustomizePowerStatistics } from '@api/energyMonitor/power'
  import { roundPrecision } from '@utils/math'

  export default {
    props: {
      groupId: Number,
      type: Number,
    },
    data() {
      return {
        columns: [],
        powerData: [],
      }
    },
    methods: {
      handleSummary({ columns, data }) {
        return columns.reduce((sums, { key }, index) => {
          if (index === 0) {
            sums[key] = {
              key,
              value: this.$t('total'),
            }
          } else {
            const values = data.map(item => item[key])
            const total = values.reduce((total, v) => {
              total += v
              return total
            }, 0)
            sums[key] = {
              key,
              value: roundPrecision(total, 3),
            }
          }
          return sums
        }, {})
      },
      wrapItem(keys, item) {
        return keys.reduce(
          (ret, key) => {
            const n = roundPrecision(item[key] || 0, 3)
            ret[key] = n
            ret.total += n
            return ret
          },
          { ...item, total: 0 }
        )
      },
      async query() {
        const {
          success,
          message: errMsg,
          data,
        } = await queryCustomizePowerStatistics({
          groupId: this.groupId,
          type: this.type,
        })
        if (!success) {
          return this.$Message.error(errMsg)
        }
        if (!data.rowList || !data.timeList) {
          return this.$Message.info(this.$t('noData'))
        }
        this.powerData = data.rowList.map(item => {
          return this.wrapItem(data.timeList, item)
        })
        this.columns = [
          {
            title: this.$t('lineInfo'),
            key: 'lineInfo',
            width: 200,
            align: 'center',
            fixed: 'left',
          },
          ...data.timeList.map(key => {
            return {
              title: `${key}（kW·h）`,
              key,
              minWidth: 200,
              align: 'center',
            }
          }),
          {
            title: `${this.$t('total')}（kW·h）`,
            key: 'total',
            width: 200,
            align: 'center',
            fixed: 'right',
          },
        ]
      },
      onOnVisibleChange(visible) {
        if (visible) {
          this.query()
        } else {
          this.columns = []
          this.powerData = []
        }
      },
    },
  }
</script>

<style lang="less" scoped></style>
