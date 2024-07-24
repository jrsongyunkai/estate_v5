<template>
  <Modal :title="$t('reCloseEnableConfig')" class="re-close-enable" width="860" v-bind="$attrs" v-on="$listeners">
    <div class="explanation">
      <div>
        <Icon custom="icon-v5 icon-v5-xiaoxi"></Icon>
        {{ $t('explanation') }}: 1.{{ $t('description1') }}
      </div>
      <div class="description" style="margin-left: 55px">2.{{ $t('description2') }}</div>
    </div>
    <div class="enable-form">
      <div class="left">
        <Checkbox :indeterminate="allCheckedSate === 'partial'" :value="allCheckedSate === 'all'" @on-change="toggleAll">
          {{ $t('selectAll') }}
        </Checkbox>
      </div>
      <div class="right">
        <template v-for="item in configList">
          <Checkbox v-if="!item.hidden" class="check-box" :key="item.name" v-model="item.value" true-value="1" false-value="0">{{ item.name }}</Checkbox>
        </template>
      </div>
    </div>
    <div slot="footer">
      <Button type="primary" @click="$refs.operationCheckAuth.openModal()">{{ $t('save') }}</Button>
      <Button @click="closeModal">{{ $t('cancel') }}</Button>
    </div>
    <OperationCheckAuth ref="operationCheckAuth" :action="save"></OperationCheckAuth>
  </Modal>
</template>

<script>
  import { compose, map, getOr, reverse, join } from 'lodash/fp'
  import { modifyParams } from '@/api/console/device'

  export default {
    props: {
      mac: {
        type: String,
        required: true,
      },
      addr: {
        type: Number,
        required: true,
      },
      bits: {
        type: String,
        required: true,
        default: '',
      },
    },
    data() {
      return {
        configList: [
          {
            name: this.$t('reCloseDict.label1'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label2'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label3'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label4'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label5'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label6'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label7'),
            value: '0',
          },
          {
            name: this.$t('reserved'),
            hidden: true,
            value: '0',
          },
          {
            name: this.$t('reserved'),
            hidden: true,
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label8'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label9'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label10'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label11'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label12'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label13'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label14'),
            value: '0',
          },
          {
            name: this.$t('reserved'),
            hidden: true,
            value: '0',
          },
          {
            name: this.$t('reserved'),
            hidden: true,
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label17'),
            value: '0',
          },
          {
            name: this.$t('reserved'),
            hidden: true,
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label19'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label20'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label21'),
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label22'),
            value: '0',
          },
          {
            name: this.$t('reserved'),
            hidden: true,
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label23'),
            value: '0',
          },
          {
            name: this.$t('reserved'),
            hidden: true,
            value: '0',
          },
          {
            name: this.$t('reserved'),
            hidden: true,
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label24'),
            value: '0',
          },
          {
            name: this.$t('reserved'),
            hidden: true,
            value: '0',
          },
          {
            name: this.$t('reCloseDict.label25'),
            value: '0',
          },
          {
            name: this.$t('reserved'),
            hidden: true,
            value: '0',
          },
        ],
      }
    },
    computed: {
      allCheckedSate() {
        const effectItems = this.configList.filter(item => !item.hidden)
        const checkedCount = effectItems.filter(item => item.value === '1').length

        if (checkedCount === 0) return 'none'
        if (checkedCount === effectItems.length) return 'all'
        return 'partial'
      },
    },
    created() {
      const last = this.configList.length - 1
      this.configList.forEach((item, index) => {
        const checkedValue = this.bits[last - index] || '0'
        item.value = item.hidden ? '0' : checkedValue
      })
    },
    methods: {
      toggleAll(checked) {
        this.configList.forEach(item => {
          const checkedValue = checked ? '1' : '0'
          item.value = item.hidden ? '0' : checkedValue
        })
      },
      async save() {
        const getBits = compose(join(''), reverse, map(getOr('0', 'value')))
        const params = {
          mac: this.mac,
          nnos: this.addr,
          echo: 195,
          param: getBits(this.configList),
        }
        const { success, message } = await modifyParams(params)
        if (success) {
          this.$Message.success(this.$t('submitCommand'))
          this.closeModal()
        } else {
          this.$Message.error(message)
        }
      },
      closeModal() {
        this.$emit('input', false)
      },
    },
  }
</script>

<style lang="less" scoped>
  .re-close-enable {
    /deep/.ivu-modal-footer {
      border: none;
    }
  }
  .explanation {
    border: 1px solid #3d3d41;
    padding: 10px;
    color: #999999;
    background: rgba(153, 153, 153, 0.05);
    margin-bottom: 20px;
  }
  .enable-form {
    display: flex;
    .left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 140px;
      flex-shrink: 0;
      border: 1px dashed #535b6c;
      margin-right: 20px;
    }
    .right {
      display: flex;
      flex-wrap: wrap;
      .check-box {
        width: 210px;
        margin: 8px 0;
      }
    }
  }
</style>
