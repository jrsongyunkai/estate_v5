<template>
  <div>
    <div class="head-view">
      <div class="pointer head-text" @click="$emit('changeShow', 'table')">
        <Icon type="md-arrow-back" size="20" />
        {{ $t('assetInformation') }}
      </div>
    </div>
    <div class="view-content">
      <div class="view-item">
        <div class="view-item-label">{{ $t('assetImg') }}：</div>
        <div class="view-item-value">
          <img v-show="!!assetData.assetPicture" :src="assetData.assetPicture" alt="" style="width: 58px; height: 58px; margin-left: 12px" />
        </div>
      </div>
      <div class="view-item">
        <div class="view-item-label">{{ $t('assetName') }}：</div>
        <div class="view-item-value">{{ assetData.assetName }}</div>
      </div>
      <div class="view-item">
        <div class="view-item-label">{{ $t('assetNum') }}：</div>
        <div class="view-item-value">{{ assetData.assetNo }}</div>
      </div>
      <div class="view-item">
        <div class="view-item-label">{{ $t('assetType') }}：</div>
        <div class="view-item-value">{{ assetTypeConfig[assetData.assetType] }}</div>
      </div>
      <div class="view-item">
        <div class="view-item-label">{{ $t('assetCategory') }}：</div>
        <div class="view-item-value">{{ assetCategoryText }}</div>
      </div>
      <div class="view-item" v-if="assetData.assetType === 1">
        <div class="view-item-label">{{ $t('productSpecifications') }}：</div>
        <div class="view-item-value">{{ assetData.productStandard }}</div>
      </div>
      <div class="view-item">
        <div class="view-item-label">{{ $t('personCharge') }}：</div>
        <div class="view-item-value">{{ assetData.manager }}</div>
      </div>
      <div class="view-item" v-if="assetData.assetType === 1">
        <div class="view-item-label">{{ $t('manufacturer') }}：</div>
        <div class="view-item-value">{{ assetData.manufacturer }}</div>
      </div>
      <div class="view-item">
        <div class="view-item-label">{{ $t('dateOfManufacture') }}：</div>
        <div class="view-item-value">{{ assetData.productionDate }}</div>
      </div>
      <div class="view-item">
        <div class="view-item-label">{{ $t('serviceLifeYear') }}：</div>
        <div class="view-item-value">{{ assetData.lifeSpan }}</div>
      </div>
      <div class="view-item">
        <div class="view-item-label">{{ $t('region1') }}：</div>
        <div class="view-item-value">{{ regionalListText }}</div>
      </div>
      <div class="view-item" v-if="assetData.assetType === 1">
        <div class="view-item-label">{{ $t('assetAddress') }}：</div>
        <div class="view-item-value">{{ assetData.assetAddress }}</div>
      </div>
      <div class="view-item" v-if="assetData.assetType === 1">
        <div class="view-item-label">{{ $t('remark') }}：</div>
        <div class="view-item-value">{{ assetData.remark }}</div>
      </div>
      <div class="view-item" v-if="assetData.assetType === 2">
        <div class="view-item-label">{{ $t('contactInformationPersonCharge') }}：</div>
        <div class="view-item-value">{{ assetData.managerPhone }}</div>
      </div>
      <div class="view-item" v-if="assetData.assetType === 2">
        <div class="view-item-label">{{ $t('controlMeasures') }}：</div>
        <div class="view-item-value">{{ assetData.controlMeasures }}</div>
      </div>
      <div class="view-item" v-if="assetData.assetType === 2">
        <div class="view-item-label">{{ $t('characteristicsHazardSources') }}：</div>
        <div class="view-item-value">{{ assetData.hazardSourcesChars }}</div>
      </div>
      <div class="view-item" v-if="assetData.assetType === 2">
        <div class="view-item-label">{{ $t('hazardLevel') }}：</div>
        <div class="view-item-value">{{ dangerConfig[assetData.hazardLevel] }}</div>
      </div>
      <div class="view-item" v-if="assetData.assetType === 2">
        <div class="view-item-label">{{ $t('hazardSourceStatus') }}：</div>
        <div class="view-item-value">{{ dangerConfig[assetData.hazardState] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { assetManagementDetail } from '@/api/multiManage/assetManagement'
  import { flatDeep } from './assetMange.js'
  const assetTypeConfig = {
    1: window.$t('ordinaryAssets'),
    2: window.$t('dangerousAssets'),
  }
  const dangerConfig = { 1: window.$t('levelOne'), 2: window.$t('levelTwo'), 3: window.$t('levelThree'), 4: window.$t('levelFour') }
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
    data() {
      return {
        assetTypeConfig,
        dangerConfig,
        categoryList: [],
        regionalList: [],
        assetData: {},
      }
    },
    computed: {
      assetCategoryText() {
        const categoryList = this.typeList.find(item => item.id === this.assetData.assetCategoryId)
        return categoryList ? categoryList.name : ''
      },
      regionalListText() {
        const regionalList = flatDeep(this.regionalData)
        const text = regionalList.find(item => item.value === this.assetData.regionId)
        return text ? text.label : ''
      },
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      async getInfo() {
        const res = await assetManagementDetail({ id: this.editRow.id })
        if (!res.success) return this.$Message.error(res.message)
        this.assetData = res.data
      },
    },
  }
</script>

<style lang="less" scoped>
  .head-text {
    font-size: 18px;
    font-weight: 500;
    margin: 20px;
  }
  .view-content {
    width: 520px;
  }
  .view-item {
    display: flex;
    margin: 20px;
  }
  .view-item-label {
    flex: 1;
    text-align: right;
    color: #999;
  }
  .view-item-value {
    flex: 2;
  }
</style>
