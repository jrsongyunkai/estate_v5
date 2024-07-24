<template>
  <div class="price-config">
    <BackTopTitle :title="$t('edit')" @close="$emit('close')">
      <Button class="ml-10" type="primary" ghost @click.stop="save">{{ $t('save') }}</Button>
      <Button class="ml-10" ghost @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
    </BackTopTitle>
    <div class="config-view">
      <ObjectListView :record="record" class="bgColor" style="margin-bottom: 10px"></ObjectListView>
      <SettlementPart ref="settlementPart" class="bgColor" v-model="strategy" style="margin-bottom: 10px" />
      <PriceConfigPart v-if="[1, 2].includes(strategy.feeStandardType)" ref="priceConfigPart" class="bgColor" :chargeType="strategy.chargeType" v-model="priceConf" style="margin-bottom: 10px" />
      <PackageConfigPart v-if="strategy.feeStandardType === 3" ref="packageConfigPart" v-model="packageConfig" class="bgColor" style="margin-bottom: 10px"></PackageConfigPart>
      <WarningConfigPart ref="warningConfigPart" :chargeType="strategy.chargeType" v-model="warnConfList" class="bgColor" />
    </div>
  </div>
</template>

<script>
  import noMarginTop from '@/mixins/noMarginTop'
  import BackTopTitle from '@/pages/billingSystem/component/BackTopTitle.vue'
  import SettlementPart from '../fragment/SettlementPart.vue'
  import PriceConfigPart from '../fragment/PriceConfigPart.vue'
  import PackageConfigPart from '../fragment/PackageConfigPart.vue'
  import WarningConfigPart from '../fragment/WarningConfigPart.vue'
  import ObjectListView from '../fragment/ObjectListView.vue'
  import modifyObjConfig from '../mixins/modifyObjConfig'
  export default {
    mixins: [noMarginTop, modifyObjConfig],
    components: { BackTopTitle, SettlementPart, PriceConfigPart, WarningConfigPart, ObjectListView, PackageConfigPart },
  }
</script>
<style lang="less" scoped>
  .price-config {
    .config-view {
      height: calc(~'100vh - 185px');
      overflow: auto;
      margin-top: 10px;
      padding: 0 10px;
      scrollbar-width: none; // firefox
      &::-webkit-scrollbar {
        width: 0px;
        display: none;
      }
    }
    .bgColor {
      background: var(--card-bg-color);
    }
  }
</style>
