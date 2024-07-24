<template>
  <div class="price-config">
    <BackTopTitle :title="!disabled ? $t('configurationEditing') : $t('configurationDetails')" @close="$emit('close')">
      <Button class="ml-10" type="primary" ghost v-if="disabled && record[0].status !== 2" @click.stop="disabled = false">{{ $t('edit') }}</Button>
      <Button class="ml-10" type="primary" ghost v-if="!disabled" @click.stop="save">{{ $t('save') }}</Button>
      <Button class="ml-10" ghost @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
    </BackTopTitle>
    <div class="config-view">
      <ObjectListView :record="record" class="bgColor" style="margin-bottom: 10px"></ObjectListView>
      <SettlementPart ref="settlementPart" class="bgColor" :disabled="disabled" v-model="strategy" style="margin-bottom: 10px" />
      <PriceConfigPart v-if="[1, 2].includes(strategy.feeStandardType)" ref="priceConfigPart" class="bgColor" :disabled="disabled" :chargeType="strategy.chargeType" v-model="priceConf" style="margin-bottom: 10px" />
      <PackageConfigPart v-if="strategy.feeStandardType === 3" ref="packageConfigPart" v-model="packageConfig" :disabled="disabled" class="bgColor" style="margin-bottom: 10px"></PackageConfigPart>
      <WarningConfigPart ref="warningConfigPart" class="bgColor" :disabled="disabled" :chargeType="strategy.chargeType" v-model="warnConfList" />
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
    data() {
      return { disabled: true }
    },
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
