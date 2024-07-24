<template>
  <Modal :title="$t('reCloseTimeConfig')" class="re-close-time" width="610" v-bind="$attrs" v-on="$listeners">
    <Form label-position="top" ref="formIns" :model="formData">
      <FormItem v-for="item in configList" :key="item.echo" :label="item.name" :prop="item.echo.toString()">
        <Input v-model="formData[item.echo]" v-inputNumberRule="'Integer'"></Input>
        <span class="unit">S</span>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="$refs.operationCheckAuth.openModal()">{{ $t('save') }}</Button>
      <Button @click="closeModal">{{ $t('cancel') }}</Button>
    </div>
    <OperationCheckAuth ref="operationCheckAuth" :action="save"></OperationCheckAuth>
  </Modal>
</template>

<script>
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
      values: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        configList: [
          {
            name: this.$t('reCloseTime1'),
            echo: 209,
          },
          {
            name: this.$t('reCloseTime2'),
            echo: 210,
          },
          {
            name: this.$t('reCloseTime3'),
            echo: 211,
          },
          {
            name: this.$t('reCloseTime4'),
            echo: 212,
          },
          {
            name: this.$t('reCloseTime5'),
            echo: 213,
          },
          {
            name: this.$t('reCloseResetTime'),
            echo: 214,
          },
        ],
        formData: {},
      }
    },
    created() {
      this.formData = this.configList.reduce((ret, item, index) => {
        const value = this.values[index]
        ret[item.echo] = value
        return ret
      }, {})
    },
    methods: {
      async save() {
        const effectiveConfig = this.configList.filter(item => this.formData[item.echo])
        if (!effectiveConfig.length) {
          this.closeModal()
          return
        }
        const modifyItem = async item => {
          const params = {
            mac: this.mac,
            nnos: this.addr,
            echo: item.echo,
            param: Number(this.formData[item.echo]),
          }
          return modifyParams(params)
        }
        const results = await Promise.allSettled(effectiveConfig.map(modifyItem))
        for (const result of results) {
          if (result.status === 'rejected') {
            return this.$Message.error(this.$t('unknown'))
          }
          const { success, message } = result.value
          if (!success) {
            return this.$Message.error(message)
          }
        }
        this.$Message.success(this.$t('submitCommand'))
        this.closeModal()
      },
      closeModal() {
        this.$emit('input', false)
      },
    },
  }
</script>

<style lang="less" scoped>
  .re-close-time {
    /deep/.ivu-modal-footer {
      border: none;
    }
    /deep/.ivu-form-item {
      margin-top: 16px;
    }
    .unit {
      position: absolute;
      right: 10px;
    }
  }
</style>
