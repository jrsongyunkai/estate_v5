<template>
  <div class="alarm-sound">
    <Alert show-icon>{{ $t('alarmSoundTip') }}</Alert>
    <div class="header">
      <div class="title">{{ $t('alarmSound') }}</div>
      <Button type="primary" @click="addConfig">{{ $t('addConfigration') }}</Button>
    </div>
    <el-table :data="configList" class="table">
      <el-table-column prop="device" :label="$t('soundFile')" width="300">
        <template #default="{ row }">
          <div v-if="!row.path">
            <Upload v-if="isShowInEdit(row)" :show-upload-list="false" class="upload" action="/alarmPopup/v5/soundFileUpload.as" :data="{ name: 'file' }" accept=".mp3" :format="['mp3']" :on-success="res => onUploadSuccess(row, res)">
              <Button type="text" icon="ios-cloud-upload-outline" class="c-primary">{{ $t('uploadFile') }}</Button>
            </Upload>
            <div v-else>-</div>
          </div>
          <div class="sound-layout" v-else>
            <img class="sound-icon" src="@/assets/svg/alarm-sound.svg" />
            <div class="right">
              <div class="text" v-textRoll>{{ row.defaultSound ? '默认报警声音.mp3' : path2name(row.path) }}</div>
              <div>
                <!-- <Button type="text" icon="ios-volume-up" class="operation-btn c-primary" @click="playSound('url', row.path)">{{ currentPlaying === $index ? '停止' : '试听' }}</Button> -->
                <TrialButton :id="row.id" type="url" :srcOrText="row.path" />
                <Upload v-if="isShowInEdit(row)" :show-upload-list="false" class="upload" action="/alarmPopup/v5/soundFileUpload.as" :data="{ name: 'file' }" accept=".mp3" :format="['mp3']" :on-success="res => onUploadSuccess(row, res)">
                  <Button type="text" icon="ios-cloud-upload-outline" class="operation-btn c-primary">{{ $t('reupload') }}</Button>
                </Upload>
                <Button v-if="isShowInEdit(row)" type="text" icon="ios-trash-outline" class="operation-btn c-error" @click="row.path = ''">{{ $t('delete') }}</Button>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="device" :label="$t('loopTimes')">
        <template #default="{ row }">
          <InputNumber v-if="row.isEdit" v-model="row.playLoop" :min="1" :max="100" v-inputNumberRule="'Integer'" />
          <span v-else>{{ row.playLoop }}{{ $t('times') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="device" :label="$t('TTSSound')">
        <template #default="{ row }">
          <Switch :disabled="!row.isEdit" v-model="row.ttsStatus" :true-value="1" :false-value="0" />
        </template>
      </el-table-column>
      <el-table-column prop="device" :label="$t('soundTpl')" width="240">
        <template #default="{ row }">
          <div v-if="!row.ttsTemplate">
            <Button v-if="isShowInEdit(row)" type="text" icon="ios-cloud-upload-outline" class="c-primary" @click="editTTSTemplate(row)">{{ $t('tplConfig') }}</Button>
            <div v-else>-</div>
          </div>
          <div class="sound-layout" v-else>
            <img class="sound-icon" src="@/assets/svg/alarm-tts.svg" />
            <div class="right">
              <div class="text" v-textRoll>{{ row.ttsTemplateName }}</div>
              <div>
                <!-- <Button type="text" icon="ios-volume-up" class="operation-btn c-primary" @click="playSound('tts', getTemplateText(row.ttsTemplate))">试听</Button> -->
                <TrialButton :id="row.id" type="tts" :srcOrText="getTemplateText(row.ttsTemplate)" />
                <Button v-if="isShowInEdit(row)" type="text" icon="ios-cloud-upload-outline" class="operation-btn c-primary" @click="editTTSTemplate(row)">{{ $t('tplConfig') }}</Button>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="device" :label="$t('alarmType')" width="400">
        <template #default="{ row }">
          <span v-if="row.defaultSound">{{ $t('otherUnconfigAlarm') }}</span>
          <div v-else style="display: flex; align-items: center">
            <Button v-if="row.isEdit" type="primary" ghost style="margin-right: 10px" @click="editTypeNumbers(row)">{{ $t('edit') }}</Button>
            <template v-if="row.typeNumberList.length > 0">
              <Tag>{{ alarmInfoFactory(row.typeNumberList[0]) }}</Tag>
              <Tooltip placement="top" transfer>
                <Tag v-if="row.typeNumberList.length > 1">{{ `+${row.typeNumberList.length - 1}` }}</Tag>
                <div slot="content">
                  <div v-for="item in row.typeNumberList" :key="item.typeNumber">
                    <Tag>{{ alarmInfoFactory(item) }}</Tag>
                  </div>
                </div>
              </Tooltip>
            </template>
            <div v-if="row.typeNumberList.length === 0 && !row.isEdit">-</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="device" :label="$t('operation')" class="x">
        <template #default="{ row, $index }">
          <template v-if="row.isEdit">
            <Button type="text" class="operation-btn c-primary" @click="save(row)">{{ $t('save') }}</Button>
            <Button type="text" class="operation-btn c-error" @click="cancelEdit(row, $index)">{{ $t('cancel') }}</Button>
          </template>
          <template v-else>
            <Button type="text" class="operation-btn c-primary" @click="startEdit(row)">{{ $t('edit') }}</Button>
            <Button type="text" class="operation-btn c-error" v-if="!row.defaultSound" @click="deleteCfg($index)">{{ $t('delete') }}</Button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <TTSTemplateModal v-model="templateModalVisible" :templateName="currentEditRow ? currentEditRow.ttsTemplateName : ''" :templateContent="currentEditRow ? currentEditRow.ttsTemplate : []" @on-confirm="onTemplateConfirm" />

    <Modal :title="$t('configurationObject')" v-model="alarmModalVisible" width="1200">
      <AlarmTreeList ref="alarmListRef" :checkedAlarm="checkedAlarm" :disabledAlarm="disabledAlarm" />
      <template #footer>
        <Button type="primary" @click="onAlarmTypeConfirm">{{ $t('confirm2') }}</Button>
        <Button @click="alarmModalVisible = false">{{ $t('cancel') }}</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
  import AlarmTreeList from './AlarmTreeList.vue'
  import TTSTemplateModal from './TTSTemplateModal.vue'
  import { cloneDeep } from 'lodash/fp'
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import TrialButton from './TrialButton.vue'

  export default {
    components: { AlarmTreeList, TTSTemplateModal, TrialButton },
    data() {
      return {
        checkedAlarm: [],
        disabledAlarm: [],
        currentEditRow: null,
        templateModalVisible: false,
        alarmModalVisible: false,
      }
    },
    computed: {
      ...mapState('alarmSound', ['configList']),
      ...mapGetters('alarmSound', ['allCheckedAlarmNumber', 'getTemplateText']),
    },
    created() {
      this.cache = {}
      this.getConfigList()
    },
    provide() {
      return {
        getTemplateText: this.getTemplateText,
      }
    },
    methods: {
      ...mapMutations('alarmSound', ['updateConfig', 'addConfig', 'removeConfig']),
      ...mapActions('alarmSound', ['getConfigList', 'saveConfig', 'deleteConfig']),
      path2name(path) {
        return path.split('/').pop()
      },
      isShowInEdit(row) {
        return !row.defaultSound && row.isEdit
      },
      onUploadSuccess(row, res) {
        if (!res.success) return this.$message.error(res.message)
        row.path = res.data
      },
      alarmInfoFactory({ alarmInfo, projectName }) {
        return projectName !== undefined ? `${projectName}:${alarmInfo}` : alarmInfo
      },
      startEdit(row) {
        this.cache[row.id] = cloneDeep(row)
        row.isEdit = true
      },
      cancelEdit(row, index) {
        if (row.id === null) {
          this.removeConfig(index)
          return
        }
        const cfg = this.cache[row.id]
        this.updateConfig({ index, cfg })
        delete this.cache[row.id]
      },
      save(row) {
        if (!row.defaultSound && row.typeNumberList.length === 0) return this.$message.error(this.$t('pleaseSelectAlarmType'))
        if (!row.playLoop) return this.$message.error(this.$t('pleaseEnterLoopTimes'))
        this.saveConfig(row)
      },
      deleteCfg(index) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('confirmDeleteConfig'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: () => {
            this.deleteConfig(index)
          },
          onCancel: () => {
            this.$Message.info({
              content: this.$t('canceled'),
            })
          },
        })
      },
      editTTSTemplate(row) {
        this.currentEditRow = row
        this.templateModalVisible = true
      },
      editTypeNumbers(row) {
        this.currentEditRow = row
        this.checkedAlarm = row.typeNumberList.map(item => item.typeNumber)
        this.disabledAlarm = this.allCheckedAlarmNumber.filter(n => !this.checkedAlarm.includes(n))
        this.alarmModalVisible = true
      },
      onTemplateConfirm({ name, template }) {
        this.currentEditRow.ttsTemplateName = name
        this.currentEditRow.ttsTemplate = template
        this.templateModalVisible = false
      },
      onAlarmTypeConfirm() {
        this.currentEditRow.typeNumberList = this.$refs.alarmListRef.checkedList.map(({ info, ...rest }) => ({ alarmInfo: info, ...rest }))
        this.alarmModalVisible = false
      },
    },
  }
</script>

<style lang="less" scoped>
  .alarm-sound {
    .c-primary {
      color: #007eff;
    }
    .c-error {
      color: #ff5b59;
      &:hover {
        color: #ff5b59;
      }
    }
    .ivu-alert {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      padding-top: 15px;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    /deep/.ivu-alert-icon {
      top: 50%;
      transform: translateY(-50%);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .upload {
      display: inline-block;
    }
    .sound-layout {
      display: flex;
      align-items: center;
      .sound-icon {
        display: block;
        width: 50px;
        max-height: 50px;
        margin-right: 10px;
        flex-shrink: 0;
      }
      .right {
        flex: 1;
        overflow: hidden;
      }
      .text {
        font-size: 14px;
      }
      .operation-btn {
        font-size: 12px;
        padding: 0;
        margin-right: 15px;
      }
    }
  }
</style>
