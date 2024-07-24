<template>
  <div>
    <div class="title-asset">
      <h3>{{ $t('assetManagement') }}</h3>
    </div>
    <div class="nav-asset">
      <div style="display: flex">
        <Button type="primary" @click="$emit('changeShow', 'addEditAsset', 'add')">{{ $t('addAsset') }}</Button>
        <Upload :format="['xlsx', 'xls']" :data="fileData" :name="fileData.name" :show-upload-list="false" :action="actionUrl" :before-upload="onBeforeUpload" :on-error="onError" :on-success="(res, file, fileList) => onSuccessPerson(res, file, fileList)">
          <Button class="mar-lf-10" type="primary">{{ $t('ImportAssets') }}</Button>
        </Upload>
        <Button type="primary" ghost @click="downLoadTemplate">{{ $t('templateDownload') }}</Button>
        <Button type="primary" class="mar-lf-10" ghost @click="exportExcel">{{ $t('export') }}</Button>
        <Button type="error" ghost :disabled="selection.length === 0" @click="batchDelete" :style="selection.length === 0 ? 'color:#999' : ''">{{ $t('batchDelete') }}</Button>
      </div>
      <div>
        <Input :placeholder="$t('enterNameNumAddress')" class="w150" v-model="query.nameNumAddress"></Input>
        <Select v-model="query.status" class="w150 mar-lf-10" :placeholder="$t('pleaseSelectState')" clearable>
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="query.type" class="w150" :placeholder="$t('pleaseSelectType')" clearable>
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary" class="mar-lf-10" @click="init">{{ $t('query') }}</Button>
        <Button class="b-info" @click="reset">{{ $t('reset') }}</Button>
      </div>
    </div>
    <div class="asset-pd-10">
      <Table :columns="assetColumns" :data="assetData" style="width: 100%" @on-selection-change="selectChange">
        <template #indexNum="{ index }">{{ `${index + 1}`.padStart(2, '0') }}</template>
        <template #assetType="{ row }">{{ typeConfig[row.assetType] }}</template>
        <template #status="{ row }">{{ statusConfig[row.status] }}</template>
        <template #action="{ row }">
          <Button type="text" @click="viewDetail(row)">
            <span class="b-primary-asset">{{ $t('view') }}</span>
          </Button>
          <Button type="text" @click="editInfo(row)">
            <span class="b-primary-asset">{{ $t('edit') }}</span>
          </Button>
          <Button type="text" class="b-delete" @click="deleteTable(row)">{{ $t('delete') }}</Button>
        </template>
      </Table>
      <Page show-total :current="pageNo" @on-change="changePage" :total="total" show-elevator></Page>
    </div>
  </div>
</template>

<script>
  import { assetColumns } from './assetMange'
  import qs from 'qs'
  import { listPageAssetManagement, assetManagementDelete, assetManagementBatchDelete, assetManagementImportBatch } from '@/api/multiManage/assetManagement'
  const statusList = [
    { value: '', label: window.$t('whole') },
    { value: '1', label: window.$t('enabled') },
    { value: '0', label: window.$t('overdue') },
  ]
  const statusConfig = {
    1: window.$t('enabled'),
    0: window.$t('overdue'),
  }
  const typeList = [
    { value: '', label: window.$t('whole') },
    { value: '1', label: window.$t('ordinaryAssets') },
    { value: '2', label: window.$t('hazardSources') },
  ]
  const typeConfig = {
    1: window.$t('ordinaryAssets'),
    2: window.$t('hazardSources'),
  }

  const defaultConfig = () => ({ nameNumAddress: '', status: '', type: '' })
  export default {
    props: {
      treeData: {
        type: Array,
        default: () => [],
      },
      filterType: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        statusConfig,
        typeConfig,
        fileData: { name: 'excelFile' },
        actionUrl: '/common/file/upload.as?fileType=4&&urlAbsolute=false&&subDir=asset_management',
        pageNo: 1,
        total: 0,
        pageSize: 10,
        statusList,
        typeList,
        assetColumns,
        query: defaultConfig(),
        assetData: [],
        assetCategoryIds: null,
        regionIds: null,
        selection: [],
      }
    },
    mounted() {
      this.init()
    },
    watch: {
      filterType: {
        handler(val) {
          if (val.length) {
            this.assetCategoryIds = val.join(',')
            this.regionIds = ''
          } else {
            this.assetCategoryIds = ''
          }
          this.init()
        },
        deep: true,
      },
      treeData: {
        handler(val) {
          if (val.length) {
            this.regionIds = val.join(',')
            this.assetCategoryIds = ''
          } else {
            this.regionIds = ''
          }
          this.init()
        },
        deep: true,
      },
    },
    methods: {
      changePage(e) {
        this.pageNo = 1
        this.init()
      },
      async init() {
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          keyword: this.query.nameNumAddress,
          status: this.query.status,
          assetType: this.query.type,
          assetCategoryIds: this.assetCategoryIds,
          regionIds: this.regionIds,
        }
        const res = await listPageAssetManagement(params)
        if (!res.success) return this.$Message.error(res.message)
        const { datas, pageNo, total } = res.data
        this.total = total
        this.pageNo = pageNo
        this.assetData = datas
      },
      selectChange(val) {
        this.selection = val
      },
      exportExcel() {
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          keyword: this.query.nameNumAddress,
          status: this.query.status,
          assetType: this.query.type,
        }
        this.$func.windowCountDown(`${this.$func.ctxPaths()}/assetManagement/export.as?${qs.stringify(params)}`)
      },
      downLoadTemplate() {
        this.$func.windowCountDown('/common/tpl/download.as?type=asset_management_template')
      },
      onBeforeUpload(file) {
        const fileExt = file.name.split('.').pop().toLocaleLowerCase()
        let isXlsx
        if (fileExt === 'xlsx' || fileExt === 'xls') {
          isXlsx = true
        } else {
          isXlsx = false
        }
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isXlsx) {
          this.$Message.error(this.$t('uploadExcel'))
        }
        if (!isLt1M) {
          this.$Message.error(this.$t('cannotExceed1m'))
        }
        return isLt1M && isXlsx
      },
      onError(file) {
        this.$Message.error({ content: this.$t('uploadFileFailTip') })
      },
      onSuccessPerson(res, file, fileList) {
        assetManagementImportBatch({ projectCode: this.$store.state.projectCode, absPath: res.data }).then(response => {
          if (response.success) {
            this.init()
            this.$Message.success({ content: this.$t('importSuccessful') })
          } else {
            this.$Message.error(response.message)
          }
        })
      },
      reset() {
        this.query = defaultConfig()
      },
      viewDetail(row) {
        this.$emit('viewCategoryInfo', row)
      },
      editInfo(row) {
        this.$emit('editCategoryInfo', row)
      },
      deleteTable(row) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('tipDeleteAsset'),
          onOk: async () => {
            const res = await assetManagementDelete({ id: row.id })
            if (!res.success) return this.$Message.error(res.message)
            this.$Message.success(this.$t('deleteSuccessful'))
            this.init()
          },
        })
      },
      batchDelete() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('tipBatchDeleteAsset'),
          onOk: async () => {
            const res = await assetManagementBatchDelete({ ids: this.selection.map(item => item.id).join(',') })
            if (!res.success) return this.$Message.error(res.message)
            this.$Message.success(this.$t('deleteSuccessful'))
            this.init()
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .title-asset {
    margin: 15px;
  }
  .b-primary-asset {
    color: #007eff;
  }
  .b-delete {
    color: #f56c6c;
  }
  .nav-asset {
    display: flex;
    justify-content: space-between;
    margin: 10px;
    .w150 {
      width: 150px;
    }
    .mar-lf-10 {
      margin: 0px 10px;
    }
  }
  .asset-pd-10 {
    padding: 10px;
  }
</style>
