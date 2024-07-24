<template>
  <el-popover
    ref="popover"
    placement="bottom"
    v-model="showPanel"
    popper-class="custom_year_range"
    trigger="manual"
    v-clickOutside="
      () => {
        showPanel = false
      }
    ">
    <div class="_inner floatPanel">
      <div class="_inner leftPanel">
        <div class="_inner panelHead">
          <i class="_inner el-icon-d-arrow-left" @click="onClickLeft"></i>
          <span>
            {{ leftYearList[0] + $t('year') + ' ' + '- ' + leftYearList[9] + $t('year') }}
          </span>
        </div>
        <div class="_inner panelContent">
          <div
            :class="{
              oneSelected: item === startYear && oneSelected,
              startSelected: item === startYear,
              endSelected: item === endYear,
              betweenSelected: item > startYear && item < endYear,
            }"
            v-for="item in leftYearList"
            :key="item">
            <span
              :class="{
                cell: true,
                _inner: true,
                selected: item === startYear || item === endYear,
              }"
              @click="onClickItem(item)"
              @mouseover="onHoverItem(item)">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
      <div class="_inner rightPanel">
        <div class="_inner panelHead">
          <i class="_inner el-icon-d-arrow-right" @click="onClickRight"></i>
          <span>{{ rightYearList[0] + $t('year') + ' ' + '- ' + rightYearList[9] + $t('year') }}</span>
        </div>
        <div class="_inner panelContent">
          <div
            :class="{
              startSelected: item === startYear,
              endSelected: item === endYear,
              betweenSelected: item > startYear && item < endYear,
            }"
            v-for="item in rightYearList"
            :key="item">
            <span
              :class="{
                cell: true,
                _inner: true,
                selected: item === endYear || item === startYear,
              }"
              @click="onClickItem(item)"
              @mouseover="onHoverItem(item)">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div slot="reference">
      <div ref="yearPicker" style="width: 100%" class="el-date-editor el-range-editor el-input__inner el-date-editor--daterange el-range-editor--small">
        <i class="el-input__icon el-range__icon el-icon-date"></i>
        <input class="_inner range_input" ref="inputLeft" type="text" name="yearInput" :placeholder="$t('selectStartYear')" v-model="startShowYear" @focus="onFocus" @keyup="handleInput('start')" />
        <span class="el-range-separator">{{ sp }}</span>
        <input class="_inner range_input" ref="inputRight" type="text" name="yearInput" :placeholder="$t('selectEndYear')" v-model="endShowYear" @focus="onFocus" @keyup="handleInput('end')" />
      </div>
    </div>
  </el-popover>
</template>

<script>
  import dayjs from 'dayjs'

  const SELECT_STATE = {
    unselect: 0,
    selecting: 1,
    selected: 2,
  }

  export default {
    name: 'yearRangePicker',

    computed: {
      oneSelected() {
        return this.curState === SELECT_STATE.selecting && (this.startYear === this.endYear || this.endYear == null)
      },
      leftYearList() {
        return this.yearList.slice(0, 10)
      },
      rightYearList() {
        return this.yearList.slice(10, 20)
      },
    },
    props: {
      sp: {
        default: window.$t('to'),
      },
      value: {
        default: null,
      },
    },
    data() {
      return {
        itemBg: {},
        startShowYear: null,
        endShowYear: null,
        yearList: [],
        showPanel: false,
        startYear: null,
        endYear: null,
        curYear: 0,
        curSelectedYear: 0,
        curState: SELECT_STATE.unselect,
      }
    },
    methods: {
      handleInput(type) {
        switch (type) {
          case 'start':
            if (isNaN(this.startShowYear)) {
              this.startShowYear = this.startYear
              return
            }
            this.startYear = this.startShowYear * 1
            break
          case 'end':
            if (isNaN(this.endShowYear)) {
              this.endShowYear = this.endYear
              return
            }
            this.endYear = this.endShowYear * 1
            break
        }
        ;[this.startYear, this.endYear] = [this.endYear, this.startYear]
        this.startShowYear = this.startYear
        this.endShowYear = this.endYear
      },

      onHoverItem(iYear) {
        if (this.curState === SELECT_STATE.selecting) {
          const tmpStart = this.curSelectedYear
          this.endYear = Math.max(tmpStart, iYear)
          this.startYear = Math.min(tmpStart, iYear)
        }
      },

      async onClickItem(selectYear) {
        if (this.curState === SELECT_STATE.unselect || this.curState === SELECT_STATE.selected) {
          this.startYear = selectYear
          this.curSelectedYear = selectYear
          this.endYear = null
          this.curState = SELECT_STATE.selecting
        } else if (this.curState === SELECT_STATE.selecting) {
          this.endShowYear = this.endYear || this.startYear
          this.startShowYear = this.startYear
          this.curState = SELECT_STATE.selected
          await this.$nextTick()
          this.showPanel = false
        }
      },

      async onFocus() {
        await this.$nextTick()
        this.showPanel = true
      },

      updateYearList() {
        const startYear = ~~(this.curYear / 10) * 10
        this.yearList = []
        for (let index = 0; index < 20; index++) {
          this.yearList.push(startYear + index)
        }
      },

      onClickLeft() {
        this.curYear = this.curYear * 1 - 10
        this.updateYearList()
      },

      onClickRight() {
        this.curYear = this.curYear * 1 + 10
        this.updateYearList()
      },
    },
    watch: {
      value: {
        handler(val) {
          if (!val || val.length === 0) return
          const [first, end] = val || []
          this.startShowYear = first
          this.endShowYear = end
        },
        immediate: true,
        deep: true,
      },

      startShowYear: {
        handler(val) {
          this.$emit('input', [val.toString(), this.endShowYear ? this.endShowYear.toString() : ''])
        },
        immediate: true,
        deep: true,
      },

      endShowYear: {
        handler(val) {
          this.$emit('input', [this.startShowYear ? this.startShowYear.toString() : '', val.toString()])
        },
        immediate: true,
        deep: true,
      },
    },
    created() {
      const [startYear, endYear] = this.value || []
      if (startYear) {
        this.startYear = Number(startYear)
        this.endYear = Number(endYear)
        this.curState = SELECT_STATE.selected
        this.curYear = startYear
      } else {
        this.curYear = dayjs().format('YYYY')
      }
      this.updateYearList()
    },
  }
</script>
<style lang="less">
  .custom_year_range {
    padding: 0;
    border: none;
    color: #fff;

    .floatPanel {
      > div {
        width: 50%;
      }
      padding: 0 16px;
      // position: absolute;
      display: flex;
      background-color: #1a202e;
      z-index: 2000;
      border-radius: 4px;
      width: 650px;
      height: 250px;
      top: 40px;
      left: -50px;
      .panelContent {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: calc(100% - 70px);
        .oneSelected {
          border-top-right-radius: 24px;
          border-bottom-right-radius: 24px;
        }
        .startSelected {
          background-color: #2c2c2e;
          border-top-left-radius: 24px;
          border-bottom-left-radius: 24px;
        }
        .endSelected {
          background-color: #2c2c2e;
          border-top-right-radius: 24px;
          border-bottom-right-radius: 24px;
        }
        .betweenSelected {
          background-color: #2c2c2e;
        }
        > div {
          width: 75px;
          height: 48px;
          line-height: 48px;
          margin: 3px 0;
          // border-radius: 24px;
          text-align: center;
          &:hover {
            background: #2c2c2e;
            color: #fff;
          }
          span {
            display: inline-block;
            width: 60px;
            height: 36px;
            cursor: pointer;
            line-height: 36px;
            border-radius: 18px;
          }
          .selected {
            background-color: #409eff;
            color: #fff;
            &:hover {
              color: #fff !important;
            }
          }
        }
      }
      .panelHead {
        position: relative;
        height: 46px;
        line-height: 46px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 16px;
          font-weight: 500;
          padding: 0 5px;
          line-height: 22px;
          text-align: center;
          cursor: pointer;
          color: #fff;
        }
        i {
          position: absolute;
          cursor: pointer;
          &:hover {
            color: #3e77fc;
          }
        }
      }
      .rightPanel {
        padding-left: 8px;
      }
      .leftPanel .panelHead i {
        left: 20px;
      }
      .rightPanel .panelHead i {
        right: 20px;
      }
    }
  }
</style>
<style lang="less" scoped>
  .range_input {
    appearance: none;
    border: none;
    outline: 0;
    padding: 0;
    width: 39%;
    color: #606266;
    line-height: 1;
    height: 100%;
    margin: 0;
    text-align: center;
    display: inline-block;
  }
  .yearPicker {
    // font-size: 14px;
    // display: flex;
    // position: relative;
    // transition: all 0.3s;
    input:first-child {
      text-align: right;
    }
    .labelText {
      position: absolute;
      left: 8px;
    }
    background-color: #fff;
    span {
      padding: 0 8px;
      height: 32px;
      line-height: 32px;
    }
    border: 1px solid #eff1f3;
    height: 34px;
    line-height: 34px;
    border-radius: 4px;
    padding: 0 28px 0 8px;
    box-sizing: border-box;
  }
  input {
    width: 60px;
    border: none;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    background-color: transparent;
  }
  input:focus {
    outline: none;
    background-color: transparent;
  }
  .yearPicker:hover {
    border-color: #3e77fc;
  }
  .dateIcon {
    position: absolute;
    right: 16px;
    top: 9px;
    color: #adb2bc;
  }
</style>
