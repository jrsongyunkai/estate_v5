<template>
  <div>
    <div class="head-asset">
      <div class="pointer head-text" @click="$emit('changeShow', 'table')">
        <Icon type="md-arrow-back" size="20" />
        {{ assetTitle }}
      </div>
      <div>
        <Button type="primary" @click="submitInfo">{{ $t('submit') }}</Button>
        <Button type="primary" ghost class="ml10" @click="$emit('changeShow', 'table')">{{ $t('cancel') }}</Button>
      </div>
    </div>
    <div class="content-asset">
      <div class="mt-20">
        <DeviceDataHead class="ml10" :text="$t('assetInformation')"></DeviceDataHead>
      </div>
      <div>
        <div class="auto-margin">
          <div class="asset-upload mt-20" style="">
            <div class="pic-style">{{ $t('assetImg') }}</div>
            <div style="margin-left: 12px">
              <Upload
                ref="upload"
                :show-upload-list="false"
                :format="['jpg', 'jpeg', 'png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :on-success="handleSuccess"
                type="drag"
                :action="uploadUrl"
                name="imgFile"
                :data="{ name: 'imgFile' }"
                style="display: inline-block; width: 58px">
                <div style="width: 58px; height: 58px; line-height: 58px">
                  <Icon type="md-add" size="20"></Icon>
                </div>
              </Upload>
            </div>
            <div>
              <img v-show="!!formValidate.assetPicture" :src="formValidate.assetPicture" alt="" style="width: 58px; height: 58px; margin-left: 12px" />
            </div>
          </div>
        </div>

        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="right" :label-width="110" style="width: 600px; margin: 0 auto">
          <FormItem :label="$t('assetName')" prop="assetName">
            <Input v-model="formValidate.assetName"></Input>
          </FormItem>
          <FormItem :label="$t('assetNum')" prop="assetNo">
            <Input v-model="formValidate.assetNo" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('assetType')" prop="assetType">
            <RadioGroup v-model="formValidate.assetType">
              <Radio :label="1">{{ $t('ordinaryAssets') }}</Radio>
              <Radio :label="2">{{ $t('hazardSources') }}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem :label="$t('assetCategory')" prop="assetCategoryId">
            <Select v-model="formValidate.assetCategoryId" :placeholder="$t('selectCategory')">
              <Option v-for="(item, index) in categoryList" :key="index" :value="item.value" :label="item.label"></Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('productSpecifications')" prop="productStandard" v-if="formValidate.assetType === 1">
            <Input v-model="formValidate.productStandard" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('personCharge')" prop="manager" v-if="formValidate.assetType === 1">
            <Input v-model="formValidate.manager" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('manufacturer')" prop="manufacturer" v-if="formValidate.assetType === 1">
            <Input v-model="formValidate.manufacturer" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('dateOfManufacture')" prop="productionDate">
            <DatePicker type="date" :value="formValidate.productionDate" format="yyyy-MM-dd" :placeholder="$t('pleaseSelectDate')" style="width: 200px" @on-change="changeValue"></DatePicker>
          </FormItem>
          <FormItem :label="$t('serviceLifeYear')" prop="lifeSpan">
            <InputNumber v-model="formValidate.lifeSpan" :placeholder="$t('pleaseEnter')" style="width: 200px" :min="0"></InputNumber>
          </FormItem>
          <FormItem :label="$t('region1')" prop="regionId">
            <!-- <Select v-model="formValidate.regionId" :placeholder="$t('pleaseSelectRegion')">
              <Option v-for="(item, index) in regionalList" :key="index" :value="item.value" :label="item.label"></Option>
            </Select> -->
            <TreeSelect v-model="formValidate.regionId" :data="regionalList" :placeholder="$t('pleaseSelectRegion')" />
          </FormItem>
          <FormItem :label="$t('assetAddress')" prop="assetAddress" v-if="formValidate.assetType === 1">
            <Input v-model="formValidate.assetAddress" :placeholder="$t('pleaseEnter')" style="width: 200px"></Input>
            <Button type="primary" class="ivu-ml-8" ghost @click="openMap">{{ $t('mapPoint') }}</Button>
          </FormItem>
          <FormItem :label="$t('remark')" prop="remark" v-if="formValidate.assetType === 1">
            <Input v-model="formValidate.remark" type="textarea" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('namePersonCharge')" prop="manager" v-if="formValidate.assetType === 2">
            <Input v-model="formValidate.manager" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('contactInformationPersonCharge')" prop="managerPhone" v-if="formValidate.assetType === 2">
            <Input v-model="formValidate.managerPhone" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('controlMeasures')" prop="controlMeasures" v-if="formValidate.assetType === 2">
            <Input v-model="formValidate.controlMeasures" type="textarea" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('characteristicsHazardSources')" prop="hazardSourcesChars" v-if="formValidate.assetType === 2">
            <Input v-model="formValidate.hazardSourcesChars" type="textarea" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('hazardLevel')" prop="hazardLevel" v-if="formValidate.assetType === 2">
            <Select v-model="formValidate.hazardLevel" :placeholder="$t('selectCategory')">
              <Option v-for="(item, index) in hazardLevelList" :key="index" :value="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('hazardSourceStatus')" prop="hazardState" v-if="formValidate.assetType === 2">
            <Select v-model="formValidate.hazardState" :placeholder="$t('selectCategory')">
              <Option v-for="(item, index) in hazardLevelList" :key="index" :value="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </div>
    <Modal v-model="mapAddressModal" :title="$t('mapPoint')" width="800" @on-ok="getAddressValue">
      <MapAddress v-if="mapAddressModal" ref="mapAddressRef"></MapAddress>
    </Modal>
  </div>
</template>

<script>
  import DeviceDataHead from '@/pages/console/device/deviceDetail/viewModules/component/DeviceDataHead.vue'
  import { assetManagementDetail, getIncId } from '@/api/multiManage/assetManagement'
  import MapAddress from './MapAddress.vue'
  const defaultFormValidate = (data = {}) => ({
    assetPicture: data.assetPicture || '',
    assetName: data.assetName || '',
    assetNo: data.assetNo || '',
    assetType: data.assetType || 1,
    assetCategoryId: data.assetCategoryId || null,
    productStandard: data.productStandard || null,
    manager: data.manager || null,
    manufacturer: data.manufacturer || null,
    productionDate: data.productionDate || '',
    lifeSpan: data.lifeSpan || null,
    regionId: data.regionId || null,
    assetAddress: data.assetAddress || null,
    remark: data.remark || null,
    managerPhone: data.managerPhone || null,
    controlMeasures: data.controlMeasures || null,
    hazardSourcesChars: data.hazardSourcesChars || null,
    hazardLevel: data.hazardLevel || null,
    hazardState: data.hazardState || null,
  })
  export default {
    props: {
      regionalData: {
        type: Array,
        default: () => [],
      },
      typeList: {
        type: Array,
        default: () => [],
      },
      editRow: {
        type: Object,
        default: () => {},
      },
    },
    components: { DeviceDataHead, MapAddress },
    data() {
      return {
        mapAddressModal: false,
        uploadUrl: `/common/file/upload.as?fileType=1&urlAbsolute=${true}`, // 图片上传地址
        formValidate: defaultFormValidate(),
        categoryList: [],
        regionalList: [],
        hazardLevelList: [
          { value: 1, label: this.$t('levelOne') },
          { value: 2, label: this.$t('levelTwo') },
          { value: 3, label: this.$t('levelThree') },
          { value: 4, label: this.$t('levelFour') },
        ],
        ruleValidate: {
          assetName: [{ required: true, message: this.$t('assetNameCannotEmpty'), trigger: 'blur' }],
          assetNo: [{ required: true, message: this.$t('assetNumCannotEmpty'), trigger: 'blur' }],
          assetType: [{ required: true, type: 'number', message: this.$t('pleaseSelectAssetType'), trigger: 'change' }],
          assetCategoryId: [{ required: true, type: 'number', message: this.$t('assetCategoryCannotEmpty'), trigger: 'change' }],
          productStandard: [{ required: true, message: this.$t('productSpecificationsCannotEmpty'), trigger: 'blur' }],
          manager: [{ required: true, message: this.$t('personChargeCannotEmpty'), trigger: 'blur' }],
          manufacturer: [{ required: true, message: this.$t('manufacturerCannotEmpty'), trigger: 'blur' }],
          productionDate: [{ required: true, message: this.$t('productionDateCannotEmpty'), trigger: 'change' }],
          regionId: [{ required: true, type: 'number', message: this.$t('pleaseSelectRegion'), trigger: 'change' }],
          assetAddress: [{ required: true, message: this.$t('assetAddressCannotEmpty'), trigger: 'blur' }],
          controlMeasures: [{ required: true, message: this.$t('controlMeasuresCannotEmpty'), trigger: 'blur' }],
          hazardSourcesChars: [{ required: true, message: this.$t('HazardSourceCannotEmpty'), trigger: 'blur' }],
          hazardLevel: [{ required: true, type: 'number', message: this.$t('hazardLevelCannotEmpty'), trigger: 'change' }],
          hazardState: [{ required: true, type: 'number', message: this.$t('hazardSourceStatusCannotEmpty'), trigger: 'change' }],
        },
      }
    },
    async mounted() {
      this.getConfigList()
      if (this.editRow && this.editRow.id) {
        await this.getInfo()
      } else {
        await this.getId()
      }
    },
    computed: {
      assetTitle() {
        return this.editRow && this.editRow.id ? this.$t('editAsset') : this.$t('addAsset')
      },
    },
    methods: {
      changeValue(val) {
        this.formValidate.productionDate = val
      },
      async getInfo() {
        const res = await assetManagementDetail({ id: this.editRow.id })
        if (!res.success) return this.$Message.error(res.message)
        this.formValidate = defaultFormValidate(res.data)
      },
      async getId() {
        const res = await getIncId({ projectCode: this.$store.state.projectCode })
        if (!res.success) return this.$Message.error(res.message)
        this.formValidate.assetNo = res.data
      },
      getConfigList() {
        this.categoryList = this.typeList.map(item => ({ value: item.id, label: item.name }))
        this.regionalList = this.handleData(this.regionalData)
      },
      handleData(data) {
        data.forEach(v => {
          v.value = v.id
          v.selected = false
          v.title = v.label
          v.expand = true
          if (Array.isArray(v.children) && v.children.length > 0) {
            this.handleData(v.children)
          }
        })
        return data
      },
      handleFormatError() {
        this.$Message.error(this.$t('uploadError'))
      },
      handleMaxSize() {
        // 超过2M
        this.$Message.error(this.$t('imgLarger2M'))
      },
      handleSuccess(res, file) {
        if (!res.success) return this.$Message.error(res.message)
        this.formValidate.assetPicture = res.data
      },
      submitInfo() {
        this.$refs.formValidate.validate(valid => {
          if (valid) {
            if (this.editRow && this.editRow.id) {
              this.$emit('editEmitSave', { id: this.editRow.id, ...this.formValidate })
            } else {
              this.$emit('addEmitSave', this.formValidate)
            }
          }
        })
      },
      getAddressValue() {
        this.formValidate.assetAddress = this.$refs.mapAddressRef.addressValue
      },
      openMap() {
        this.mapAddressModal = true
      },
    },

    watch: {},
  }
</script>

<style lang="less" scoped>
  .head-asset {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    margin: 10px;
    border-bottom: 1px solid #5e626c;
    .head-text {
      font-size: 18px;
      font-weight: 500;
    }
  }
  .asset-upload {
    display: flex;
  }
  .pic-style {
    margin-top: 10px;
  }
  .auto-margin {
    width: 520px;
    margin: 0 auto;
  }
  .content-asset {
    height: ~'calc(100vh - 250px)';
    overflow: auto;
  }
  .ml10 {
    margin: 0 10px;
  }
  .mt-20 {
    margin-top: 20px;
  }
</style>
