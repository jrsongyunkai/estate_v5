<template>
  <table style="width: 100%" v-if="details" class="table-phase">
    <thead>
      <tr class="tableStyle">
        <th class="tCenter">{{ $t('realTimeData') }}</th>
        <th v-if="[1, 2, 5, 6].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['120', '220'].indexOf(details.lineType) > -1)" class="tCenter">
          {{ $t('phaseLine') }}
        </th>
        <th class="tCenter" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          {{ $t('APhase') }}
        </th>
        <th class="tCenter" v-if="['120', '180'].indexOf(details.lineType) > -1 || ['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          {{ $t('BPhase') }}
        </th>
        <th class="tCenter" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          {{ $t('CPhase') }}
        </th>
        <th class="tCenter" v-if="['120', '180'].indexOf(details.lineType) > -1 || (details.switchType !== 1 && details.switchType !== 3)">
          {{ $t('zeroLine') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="rowStyle">
        <td class="tableTitle" style="color: #999999">{{ $t('ampere') }}</td>
        <td class="tableTitle" v-if="[1, 2, 5, 6].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['120', '220'].indexOf(details.lineType) > -1)">
          {{ typeof details.aa === 'undefined' ? '--' : details.aa + 'A' }}
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          {{ typeof details.aa === 'undefined' ? '--' : details.aa + 'A' }}
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          {{ typeof details.ba === 'undefined' ? '--' : details.ba + 'A' }}
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          {{ typeof details.ca === 'undefined' ? '--' : details.ca + 'A' }}
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || (details.switchType !== 1 && details.switchType !== 3)">
          {{ typeof details.na === 'undefined' ? '--' : details.na + 'A' }}
        </td>
      </tr>
      <tr class="rowStyle">
        <td class="tableTitle" style="color: #999999">{{ $t('voltage') }}</td>
        <td class="tableTitle" v-if="[1, 2, 5, 6].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['120', '220'].indexOf(details.lineType) > -1)">
          {{ typeof details.av === 'undefined' ? '--' : details.av + 'V' }}
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          {{ typeof details.av === 'undefined' ? '--' : details.av + 'V' }}
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          {{ typeof details.bv === 'undefined' ? '--' : details.bv + 'V' }}
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          {{ typeof details.cv === 'undefined' ? '--' : details.cv + 'V' }}
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || (details.switchType !== 1 && details.switchType !== 3)">
          {{ '--' }}
        </td>
      </tr>
      <tr class="rowStyle">
        <td class="tableTitle" style="color: #999999">
          {{ $t('temperatureUpperTerminal') }}
        </td>
        <td class="tableTitle" v-if="[1, 2, 5, 6].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['120', '220'].indexOf(details.lineType) > -1)">
          <span v-show="details.psdt > -60">{{ (details.psdt || '-') + (!!details.psdt ? '℃' : '-') }}</span>
          <span v-show="details.psdt < -60"><i class="icon-v5 icon-v5-weijierutantou" :title="$t('theDeviceCurrentlyDoesNotSupportIt')"></i></span>
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          <span v-show="details.asdt > -60">
            {{ (details.asdt || '-') + (!!details.asdt ? '℃' : '-') }}
          </span>
          <span v-show="details.asdt < -60"><i class="icon-v5 icon-v5-weijierutantou" :title="$t('theDeviceCurrentlyDoesNotSupportIt')"></i></span>
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          <span v-show="details.bsdt > -60">
            {{ (details.bsdt || '-') + (!!details.bsdt ? '℃' : '-') }}
          </span>
          <span v-show="details.bsdt < -60"><i class="icon-v5 icon-v5-weijierutantou" :title="$t('theDeviceCurrentlyDoesNotSupportIt')"></i></span>
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          <span v-show="details.csdt > -60">
            {{ (details.csdt || '-') + (!!details.csdt ? '℃' : '-') }}
          </span>
          <span v-show="details.csdt < -60"><i class="icon-v5 icon-v5-weijierutantou" :title="$t('theDeviceCurrentlyDoesNotSupportIt')"></i></span>
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || (details.switchType !== 1 && details.switchType !== 3)">
          <span v-show="details.nsdt > -60">{{ (details.nsdt || '-') + (!!details.nsdt ? '℃' : '-') }}</span>
          <span v-show="details.nsdt < -60"><i class="icon-v5 icon-v5-weijierutantou" :title="$t('theDeviceCurrentlyDoesNotSupportIt')"></i></span>
        </td>
      </tr>
      <tr class="rowStyle">
        <td class="tableTitle" style="color: #999999">
          {{ $t('terminalTemperature') }}
        </td>
        <td class="tableTitle" v-show="[1, 2, 5, 6].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['120', '220'].indexOf(details.lineType) > -1)">
          <span v-show="details.pxdt > -60">
            {{ (details.pxdt || '-') + (!!details.pxdt ? '℃' : '-') }}
          </span>
          <span v-show="details.pxdt < -60"><i class="icon-v5 icon-v5-weijierutantou" :title="$t('theDeviceCurrentlyDoesNotSupportIt')"></i></span>
        </td>
        <td class="tableTitle" v-show="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          <span v-show="['120', '180'].indexOf(details.lineType) > -1">
            <span v-show="details.axdt <= -35">{{ '--' }}</span>
            <span v-show="details.axdt >= -35">{{ (details.axdt || '-') + (!!details.axdt ? '℃' : '-') }}</span>
          </span>
          <span v-show="details.axdt > -60 && ['120', '180'].indexOf(details.lineType) < 0">
            {{ (details.axdt || '-') + (!!details.axdt ? '℃' : '-') }}
          </span>
          <span v-show="details.axdt < -60 && ['120', '180'].indexOf(details.lineType) < 0"><i class="icon-v5 icon-v5-weijierutantou" :title="$t('theDeviceCurrentlyDoesNotSupportIt')"></i></span>
        </td>
        <td class="tableTitle" v-show="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          <span v-show="['120', '180'].indexOf(details.lineType) > -1">
            <span v-show="details.bxdt <= -35">{{ '--' }}</span>
            <span v-show="details.bxdt >= -35">{{ (details.bxdt || '-') + (!!details.bxdt ? '℃' : '-') }}</span>
          </span>
          <span v-show="details.bxdt > -60 && ['120', '180'].indexOf(details.lineType) < 0">
            {{ (details.bxdt || '-') + (!!details.bxdt ? '℃' : '-') }}
          </span>
          <span v-show="details.bxdt < -60 && ['120', '180'].indexOf(details.lineType) < 0"><i class="icon-v5 icon-v5-weijierutantou" :title="$t('theDeviceCurrentlyDoesNotSupportIt')"></i></span>
        </td>
        <td class="tableTitle" v-show="['120', '180'].indexOf(details.lineType) > -1 || [3, 4].indexOf(details.switchType) > -1 || (details.switchType == 0 && ['180', '380'].indexOf(details.lineType) > -1)">
          <span v-show="['120', '180'].indexOf(details.lineType) > -1">
            <span v-show="details.cxdt <= -35">{{ '--' }}</span>
            <span v-show="details.cxdt >= -35">{{ (details.cxdt || '-') + (!!details.cxdt ? '℃' : '-') }}</span>
          </span>
          <span v-show="details.cxdt > -60 && ['120', '180'].indexOf(details.lineType) < 0">{{ (details.cxdt || '-') + (!!details.cxdt ? '℃' : '-') }}</span>
          <span v-show="details.cxdt < -60 && ['120', '180'].indexOf(details.lineType) < 0"><i class="icon-v5 icon-v5-weijierutantou" :title="$t('theDeviceCurrentlyDoesNotSupportIt')"></i></span>
        </td>
        <td class="tableTitle" v-if="['120', '180'].indexOf(details.lineType) > -1 || (details.switchType !== 1 && details.switchType !== 3)">
          <span v-show="['120', '180'].indexOf(details.lineType) > -1">
            <span v-show="details.nxdt <= -35">{{ '--' }}</span>
            <span v-show="details.nxdt >= -35">{{ (details.nxdt || '-') + (!!details.nxdt ? '℃' : '-') }}</span>
          </span>
          <span v-show="details.nxdt > -60 && ['120', '180'].indexOf(details.lineType) < 0">{{ (details.nxdt || '-') + (!!details.nxdt ? '℃' : '-') }}</span>
          <span v-show="details.nxdt < -60 && ['120', '180'].indexOf(details.lineType) < 0"><i class="icon-v5 icon-v5-weijierutantou" :title="$t('theDeviceCurrentlyDoesNotSupportIt')"></i></span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props: {
      details: {
        type: Object,
        default: () => {},
      },
    },
  }
</script>
<style lang="less" scoped>
  .table-phase {
    .tableStyle {
      padding: 5px;
      border-collapse: collapse;
      background-color: #28313f;
    }
    .tCenter {
      padding: 5px;
    }
    .rowStyle {
      padding: 10px;
    }
    .tableTitle {
      text-align: center;
      width: 22%;
      padding: 5px 10px;
      border-bottom: 1px solid #4f5155;
    }
  }
</style>
