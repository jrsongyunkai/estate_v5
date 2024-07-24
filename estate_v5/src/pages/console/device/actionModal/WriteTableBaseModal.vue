<template>
  <Modal v-model="baseStutas" :title="$t('writeTableBase')" class-name="baseconfiguration" width="450">
    <Form :label-width="80">
      <FormItem :label="$t('writeTableBase') + ':'">
        <div style="position: relative; width: 100%">
          <el-input v-model="baseValue" @input="limitInput($event)"></el-input>
          <i style="position: absolute; right: 16px; top: 2px; color: #808695">
            m
            <sub style="position: absolute; top: 10px">3</sub>
          </i>
        </div>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button class="baseSure" @click="handleBaseStutas">{{ $t('confirm') }}</Button>
      <Button @click="handlecancle" class="baseCancle">{{ $t('cancel') }}</Button>
    </div>
  </Modal>
</template>

<script>
  import { lqfindRealParam, sendOrder } from '@/api/public'
  export default {
    data() {
      return {
        baseStutas: false,
        baseValue: '',
        mac: '',
      }
    },
    methods: {
      async openModal(row) {
        this.mac = row.mac
        let params = { mac: row.mac, projectCode: this.$store.state.projectCode, equipmentType: row.equipmentType }
        const res = await lqfindRealParam(params)
        if (res.success) {
          this.baseStutas = true
          this.baseValue = res.data.amount
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleBaseStutas() {
        let params = { mac: this.mac, type: '1', value: this.baseValue }
        const res = await sendOrder(params)
        if (res.success) {
          this.baseStutas = false
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handlecancle() {
        this.baseStutas = false
      },
      limitInput(value, name) {
        this.baseValue =
          ('' + value) // 第一步：转成字符串
            .replace(/[^\d.]+/g, '') // 第二步：把不是数字，不是小数点的过滤掉
            .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
            .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
            .match(/^\d*(\.?\d{0,2})/g)[0] || '' // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
      },
    },
    watch: {
      baseValue: {
        handler(newVal) {
          if (newVal > 65535) {
            this.baseValue = 65535
          }
        },
      },
    },
  }
</script>

<style></style>
