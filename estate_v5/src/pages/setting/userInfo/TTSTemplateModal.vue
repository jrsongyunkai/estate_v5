<template>
  <Modal :title="$t('tplConfig')" width="800" v-bind="$attrs" v-on="$listeners" @on-visible-change="stopSound">
    <Form :label-width="80">
      <FormItem :label="$t('tplSource')">
        <Select v-model="formData.from" @on-select="selectFrom">
          <Option v-for="(op, idx) in options" :value="idx" :key="op.id">{{ op.ttsTemplateName }}</Option>
        </Select>
      </FormItem>
      <FormItem :label="$t('tplName')">
        <Input v-model="formData.name" />
      </FormItem>
      <FormItem :label="$t('tplContent')">
        <div style="position: relative">
          <TplEditor ref="tplEditorRef" :content="templateValue" />
          <!-- <Button type="text" icon="ios-volume-up" class="operation-btn c-primary" @click="playSound('tts', getTemplateText($refs.tplEditorRef.list))">试听</Button> -->
          <TrialButton id="modal" type="tts" :srcOrText="() => getTemplateText($refs.tplEditorRef.list)" />
        </div>
      </FormItem>
    </Form>
    <template #footer>
      <Button type="primary" @click="onConfirm">{{ $t('confirm2') }}</Button>
      <Button @click="$emit('input', false)">{{ $t('cancel') }}</Button>
    </template>
  </Modal>
</template>

<script>
  import TplEditor from './TplEditor.vue'
  import { mapState, mapActions } from 'vuex'
  import { cloneDeep } from 'lodash'
  import TrialButton from './TrialButton.vue'

  export default {
    components: { TplEditor, TrialButton },
    props: {
      templateName: {
        type: String,
        default: '',
      },
      templateContent: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        formData: { name: '', from: '' },
        templateValue: [],
      }
    },
    computed: {
      ...mapState('alarmSound', ['snapshot']),
      options() {
        return [{ id: -1, ttsTemplate: [], ttsTemplateName: this.$t('custom') }, ...this.snapshot]
      },
    },
    inject: ['getTemplateText'],
    watch: {
      templateName(val) {
        this.formData.name = val
      },
      templateContent: {
        handler(val) {
          this.templateValue = cloneDeep(val) || []
        },
        deep: true,
      },
    },
    methods: {
      ...mapActions('alarmSound', ['stopSound']),
      selectFrom(op) {
        this.templateValue = cloneDeep(this.options[op.value].ttsTemplate) || []
      },
      onConfirm() {
        const valid = this.validate()
        if (!valid) return
        this.$emit('on-confirm', {
          ...this.formData,
          template: this.$refs.tplEditorRef.template,
        })
      },
      validate() {
        if (!this.formData.name) {
          this.$message.error(this.$t('pleaseTplName'))
          return false
        }
        if (!this.$refs.tplEditorRef.template.map(item => item.value).join('').length) {
          this.$message.error(this.$t('pleaseEnterTplContent'))
          return false
        }
        if (this.$refs.tplEditorRef.bytes > 100) {
          this.$message.error(this.$t('tplConTentLessThan100word'))
          return false
        }
        return true
      },
    },
  }
</script>

<style lang="less" scoped>
  .operation-btn {
    position: absolute;
    left: 0;
    bottom: 0;
  }
</style>
