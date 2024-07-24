<template>
  <div class="con-view" :class="type">
    <div class="header">{{ modelMap[type] }}时时段</div>
    <div class="body">
      <div class="time-item" v-for="(period, index) in value" :key="index">
        <div class="time-item-picker">
          <CustomDatepicker class="time-picker" :class="{ error: isError && errorRepeatStartTime.includes(period[0]) && errorRepeatEndTime.includes(period[1]) }" type="timerange" format="HH:mm" :value="period" @on-change="changeValue($event, index)" placeholder="请选择时间"></CustomDatepicker>
          <Button type="error" class="del-btn ml-10" icon="ios-trash-outline" ghost @click.stop="deleteItem(index)"></Button>
        </div>
        <div v-if="isError && errorRepeatStartTime.includes(period[0]) && errorRepeatEndTime.includes(period[1])" class="tips">{{ '当前时段与其他时段有重叠' }}</div>
      </div>
    </div>
    <Button type="primary" class="button-add" ghost long @click.stop="addConfigItem">添加{{ modelMap[type] }}时时段</Button>
  </div>
</template>

<script>
  import CustomDatepicker from '../../price/component/customDatePick/date-picker/picker/time-picker'
  export default {
    components: { CustomDatepicker },
    props: {
      type: { type: String, default: 'top' },
      value: { type: Array, default: () => [] },
      errorRepeat: { type: Array, default: () => [] },
    },
    data() {
      return {
        modelMap: { top: '尖', peak: '峰', normal: '平', valley: '谷' },
      }
    },
    computed: {
      isError() {
        return this.errorRepeat.length > 1 && this.errorRepeat.some(it => it.series === this.type)
      },
      errorRepeatStartTime() {
        return this.errorRepeat.map(it => this.parseMinutesToTime(it.start))
      },
      errorRepeatEndTime() {
        return this.errorRepeat.map(it => this.parseMinutesToTime(it.end))
      },
    },
    methods: {
      parseMinutesToTime(minutes) {
        const hours = Math.floor(minutes / 60)
        const minutesLeft = minutes % 60
        return `${hours.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}`
      },
      addConfigItem() {
        let value = [...this.value, ['00:00', '00:00']]
        this.$emit('input', value)
      },
      changeValue(value, index) {
        let periods = [...this.value]
        periods[index] = value
        this.$emit('input', periods)
      },
      deleteItem(index) {
        let periods = [...this.value]
        periods.splice(index, 1)
        this.$emit('input', periods)
      },
    },
  }
</script>

<style lang="less" scoped>
  .con-view {
    width: 100%;
    position: relative;
    min-height: 360px;
    padding: 0px 10px;
    padding-bottom: 50px;
    background: #0080ff0c;
    .header {
      padding-top: 10px;
    }
    .body {
      .time-item {
        .time-item-picker {
          display: flex;
          align-items: center;
          margin-top: 10px;
          align-content: space-between;
          .time-picker {
            flex: 1;
          }
          .time-picker.error {
            /deep/ .ivu-input {
              border: 1px solid #e03c3a;
            }
          }
          .del-btn {
            width: 36px;
          }
        }
        .tips {
          color: #e03c3a;
        }
      }
    }
    .button-add {
      position: absolute;
      bottom: 10px;
      width: calc(~'100% - 20px');
      left: 10px;
    }
  }
  .con-view.top {
    border-top: 1px solid #df3d3a;
    background: #df3d3a0a;
    .header {
      color: #df3d3a;
    }
  }
  .con-view.peak {
    border-top: 1px solid #e19a51;
    background: #e19a510a;
    .header {
      color: #e19a51;
    }
  }
  .con-view.normal {
    border-top: 1px solid #0180ff;
    background: #0180ff0a;
    .header {
      color: #0180ff;
    }
  }
  .con-view.valley {
    border-top: 1px solid #0eb55c;
    background: #0eb55c0a;
    .header {
      color: #0eb55c;
    }
  }
</style>
