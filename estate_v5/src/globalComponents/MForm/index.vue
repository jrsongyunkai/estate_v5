<!-- eslint-disable vue/valid-v-on -->
<template>
  <Form class="form-box" ref="formValidate" :model="formData" :label-width="labelWidth" :label-position="labelPosition" :disabled="disabled" v-bind="$attrs">
    <Row class="flex1">
      <template v-for="(v, i) in formSetting">
        <Col :key="i" v-if="v.isLoad === undefined ? true : v.isLoad" v-show="!v.hidden" :span="v.colSpan ? v.colSpan : lineRowTypes.includes(v.formType) ? 24 : 8" v-bind="v.attrCol">
          <Divider v-if="v.formType === 'Divider'" :key="i" v-bind="v.attr" />
          <Title v-else-if="v.formType === 'Title'" :title="v.label" :key="i" v-bind="v.attr" />
          <div v-else-if="v.formType === 'FormItemSlot'" :key="i.prop"><slot :name="v.prop" :row="v" :formData="formData" /></div>
          <FormItem v-else :prop="v.prop" :rules="v.rules" :label-width="!!v.label || v.labelSlot ? v.labelWidth || labelWidth : 0" :label-for="v.prop" :key="i">
            <template #label v-if="!!v.label || v.labelSlot">
              <slot v-if="v.labelSlot" :name="v.labelSlot"></slot>
              <div v-else class="label-text" :style="{ maxWidth: `${labelWidth}px` }" v-textRoll>{{ v.label }}</div>
            </template>
            <!-- 文本输入框类型 -->
            <Input v-if="v.formType === 'Input'" v-model="formData[v.prop]" :placeholder="v.placeholder || $t('pleaseEnter')" :disabled="!!v.disabled" :readonly="!!v.readonly" :element-id="v.prop" v-bind="v.attr" :type="inputTypeRange.includes(v.type) ? v.type : 'text'" @[v.event]="v.func"></Input>
            <!-- 数字输入框 -->
            <InputNumber v-else-if="v.formType === 'InputNumber'" v-bind="v.attr" v-model="formData[v.prop]" :disabled="!!v.disabled" :element-id="v.prop" @[v.event]="v.func" />
            <!-- 限定数字输入框 -->
            <div class="number-input" v-else-if="v.formType === 'NumberInput'">
              <Input v-model="formData[v.prop]" type="text" :placeholder="v.placeholder || $t('pleaseEnter')" v-inputNumberRule="`${v.InputRule || 'PositiveNum'}`" :disabled="!!v.disabled" :readonly="!!v.readonly" :element-id="v.prop" v-bind="v.attr"></Input>
              <span v-if="v.unit" class="unit">{{ v.unit }}</span>
            </div>
            <!-- 选择输入框类型 -->
            <Select v-else-if="v.formType === 'Select'" v-model="formData[v.prop]" :placeholder="v.placeholder || $t('pleaseSelect')" :disabled="!!v.disabled" :readonly="!!v.readonly" :multiple="v.multiple" :element-id="v.prop" v-bind="v.attr" transfer @[v.event]="v.func">
              <Option v-for="(item, i) in v.options" :value="item.value" :key="i">{{ item.label }}</Option>
            </Select>
            <!-- 级联选择器 -->
            <Cascader v-else-if="v.formType === 'Cascader'" v-model="formData[v.prop]" :data="v.treeData" v-bind="v.attr" :disabled="!!v.disabled" :readonly="!!v.readonly" :placeholder="v.placeholder || $t('pleaseSelect')" :element-id="v.prop" filterable transfer @[v.event]="v.func" />
            <!-- 单选框 -->
            <RadioGroup class="form-item-radio-group" v-else-if="v.formType === 'RadioGroup'" v-bind="v.attr" v-model="formData[v.prop]" :disabled="!!v.disabled" :readonly="!!v.readonly" @[v.event]="v.func">
              <Radio v-for="(radio, index) in v.options" :key="index" :label="radio.value">
                <slot v-if="v.slotRadioName" :name="v.slotRadioName" :row="radio" :index="index"></slot>
                <template v-else>{{ radio.label }}</template>
              </Radio>
            </RadioGroup>
            <!-- 开关 -->
            <div class="form-item-switch" v-else-if="v.formType === 'Switch'" @[v.event]="v.func">
              <Switch v-model="formData[v.prop]" :disabled="!!v.disabled" :readonly="!!v.readonly" :true-value="true" :false-value="false" :loading="v.loading" v-bind="v.attr" size="large" :before-change="v.BeforeChange" @[v.event]="v.func">
                <template #open v-if="v.slotSetting">
                  <span>{{ v.slotSetting.open.label }}</span>
                </template>
                <template #close v-if="v.slotSetting">
                  <span>{{ v.slotSetting.close.label }}</span>
                </template>
              </Switch>
            </div>
            <!-- Slider 滑块 -->
            <Slider v-else-if="v.formType === 'Slider'" v-bind="v.attr" v-model="formData[v.prop]" :disabled="!!v.disabled" @[v.event]="v.func"></Slider>
            <!-- 评分组件 -->
            <Rate v-else-if="v.formType === 'Rate'" v-bind="v.attr" v-model="formData[v.prop]" :disabled="!!v.disabled" :readonly="!!v.readonly" @[v.event]="v.func" />
            <!-- 树选择器 -->
            <TreeSelect v-else-if="v.formType === 'TreeSelect'" v-bind="v.attr" v-model="formData[v.prop]" :load-data="v.loadData" :multiple="!!v.multiple" :data="v.treeData" transfer :placeholder="v.placeholder || $t('pleaseSelect')" @[v.event]="v.func" />
            <!-- 文本 -->
            <div v-else-if="v.formType === 'Text'" v-textRoll :style="{ width: '100%', ...v.style }">{{ formData[v.prop] || '-' }}</div>
            <!-- 颜色 -->
            <ColorPicker v-else-if="v.formType === 'Color'" v-model="formData[v.prop]" alpha hue v-bind="v.attr" transfer @[v.event]="v.func" />
            <!-- 文件上传 -->
            <Button v-else-if="v.formType === 'File'" class="file-upload-btn">
              <input class="file-upload-input" type="file" :accept="v.accept || '*/*'" @[v.event]="v.func" />
              {{ $t('selectFile') }}
            </Button>
            <template v-else-if="v.formType === 'Slot'">
              <slot :name="v.prop" :row="v" :formData="formData" :index="i"></slot>
            </template>
          </FormItem>
        </Col>
      </template>
    </Row>
  </Form>
</template>

<script>
  import Title from './modules/Title.vue'
  import { cloneDeep } from 'lodash'
  export default {
    components: { Title },
    props: {
      labelPosition: {
        type: String,
        default: 'right',
      },
      labelWidth: {
        type: Number,
        default: 120,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      formSetting: {
        type: Array,
        default: () => [],
      },
      value: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        lineRowTypes: ['Divider', 'Title', 'FormItemSlot'],
        formData: {},
        formDataInit: {},
        inputTypeRange: ['text', 'password', 'textarea', 'url', 'email', 'date', 'number', 'tel'],
      }
    },
    methods: {
      changeValue(item, value) {
        this.formData[item.prop] = value
      },
      validate() {
        let validRes = false
        this.$refs.formValidate.validate(valid => {
          validRes = valid
        })
        return validRes
      },
      reset() {
        this.formSetting.forEach(it => {
          if (it.formType === 'Slot' && it.prop && !Object.hasOwn(this.formDataInit, it.prop)) {
            delete this.formData[it.prop]
          }
          this.formData[it.prop] = null
        })
        const keys = Object.keys(this.formData)
        keys.forEach(key => {
          if (Object.hasOwn(this.formDataInit, key)) {
            this.formData[key] = this.formDataInit[key]
          } else {
            delete this.formData[key]
          }
        })
        this.$refs.formValidate.resetFields()
      },
    },
    mounted() {
      this.formData = { ...this.value }
      this.formDataInit = cloneDeep({ ...this.value })
    },
    watch: {
      formData: {
        handler(value) {
          this.$emit('input', value)
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .form-box {
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    .flex1 {
      display: flex;
      flex: 1;
      /deep/.ivu-form-item-label {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .label-text {
          display: inline-block;
        }
      }
      /deep/.ivu-input-number {
        width: 100%;
      }
      .file-upload-btn {
        position: relative;
        .file-upload-input {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .number-input {
        position: relative;
        display: flex;
        align-items: center;
        .unit {
          position: absolute;
          right: 10px;
          color: #ddd;
        }
      }
    }
  }
</style>
