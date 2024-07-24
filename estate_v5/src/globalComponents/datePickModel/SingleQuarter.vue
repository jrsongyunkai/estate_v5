<template>
  <el-popover trigger="click" v-model="showSeason" popper-class="m-date-pop">
    <el-input
      @focus="focusselect"
      slot="reference"
      class="inputStyle"
      :placeholder="status === 'single' ? (language === 'zh' ? $t('pleaseSelectSeason') : 'Please select the quarter') : status === 'start' ? (language === 'zh' ? $t('startSeason') : 'start quarter') : language === 'zh' ? $t('endSeason') : 'end quarter'"
      v-model="showValueText">
      <i slot="prefix" class="el-input__icon el-icon-date"></i>
      <i slot="suffix" class="el-input__icon el-icon-circle-close clearIconStyle" v-if="showClear" @click="resetQuarter"></i>
    </el-input>
    <div style="width: 320px; margin-top: 10px">
      <div style="display: flex; padding: 0 0 10px 0; border-bottom: 1px solid #e5e5e5; text-align: center" class="clearfix">
        <div v-if="isReduce" style="width: 15%"><i class="el-icon-d-arrow-left" style="opacity: 0.3"></i></div>
        <div v-else :aria-label="$t('preYear')" style="width: 15%" @click="prev"><i class="el-icon-d-arrow-left"></i></div>
        <span style="width: 70%">{{ year }}</span>
        <div v-if="isAdd" style="width: 15%"><i class="el-icon-d-arrow-right" style="opacity: 0.3"></i></div>
        <div v-else :aria-label="$t('lastYear1')" style="width: 15%" @click="next"><i class="el-icon-d-arrow-right"></i></div>
      </div>
      <div class="textitem">
        <el-radio-group v-model="optTime[curIndex].queryTime" @change="selectSeason()">
          <el-radio v-for="(item, index) in DateList[curIndex].queryTime" :disabled="setDisabled(index)" :key="index" :label="`${DateList[curIndex].TimeYear}-Q${item}`" class="oneitem QuarterlySelect">
            {{ getPropertyByLg(findDataById(quarterName, 'id', item), 'name') }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
  </el-popover>
</template>
<script>
  import dayjs from 'dayjs'

  export default {
    name: 'SingleQuarter',
    props: {
      status: {
        default: 'start',
        type: String,
      },
      canSelectList: {
        // 可选择的日期列表
        type: Array,
        default: () => [],
      },
      isHasfilter: {
        // 默认为false，为true需要传canSelectList
        type: Boolean,
        default: false,
      },
      language: {
        type: String,
        default: 'zh',
      },
      value: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        showSeason: false,
        year: new Date().getFullYear(),
        showValue: '',
        showClear: false, // 是否显示输入框右边的“清空”小图标
        optTime: [],
        DateList: {},
        curIndex: 0,
        quarterName: [
          { id: 1, name: this.$t('Q1 '), name_en: 'Q1th', data: '01' },
          { id: 2, name: this.$t('Q2'), name_en: 'Q2nd', data: '04' },
          { id: 3, name: this.$t('Q3'), name_en: 'Q3rd', data: '07' },
          { id: 4, name: this.$t('Q4'), name_en: 'Q4th', data: '10' },
        ],
        quarterMap: { Q1: this.$t('Q1'), Q2: this.$t('Q2'), Q3: this.$t('Q3'), Q4: this.$t('Q4') },
        selectList: [], // 接收的可选择canSelectList数据
      }
    },
    created() {
      this.init()
    },
    watch: {
      canSelectList: {
        handler(newVal) {
          this.selectList = JSON.parse(JSON.stringify(newVal))
          this.selectList.map(item => {
            return item.start_time.slice(0, 4) + '-' + item.start_time.slice(5, 7)
          })
        },
        deep: true,
      },
      value: {
        handler(value) {
          this.$nextTick(() => {
            if (value) {
              this.showValue = value
              let year = value ? value.split('-')[0] : ''
              let curIndex = this.optTime.findIndex(it => it.TimeYear === Number(year))
              this.curIndex = curIndex > -1 ? curIndex : 0
              this.optTime[this.curIndex].queryTime = value
            } else {
              this.showValue = value
            }
          })
        },
        deep: true,
        immediate: true,
      },
    },
    computed: {
      findDataById() {
        return function (dataList, searchIndex, value) {
          let data = dataList.find(data => {
            return data[searchIndex] === value
          })
          return data || {}
        }
      },
      getPropertyByLg() {
        return function retVal(data, property) {
          return this.language === 'zh' ? data[property] : data[property + '_en']
        }
      },
      isAdd() {
        let Dates = new Date()
        return this.year === Dates.getFullYear()
      },
      isReduce() {
        let Dates = new Date()
        return this.year === Dates.getFullYear() - 20
      },
      showValueText() {
        return this.showValue ? `${this.showValue.split('-')[0]}年${this.quarterMap[this.showValue.split('-')[1]]}` : ''
      },
    },
    methods: {
      // 初始化
      init() {
        let _opt = []
        let _optTime = []
        let optDate = this.getDateList()
        optDate.map((item, index) => {
          _optTime[index] = { TimeYear: item, queryTime: '' }
          _opt[index] = { TimeYear: item, queryTime: [1, 2, 3, 4] }
        })
        this.optTime = _optTime
        this.DateList = _opt
      }, // 聚焦input事件设定可选择项
      focusselect() {
        this.$nextTick(() => {
          var lis = document.getElementsByClassName('QuarterlySelect')
          var lists = Array.from(lis)
          this.isDisabled = Array.from({ length: lists.length }).map(() => {
            return true
          })
          if (this.isHasfilter) {
            for (var j = 0; j < this.selectList.length; j++) {
              for (var i = 0; i < lists.length; i++) {
                var text = this.changeQuarterFomat(lists[i].innerText)
                if (Number(this.selectList[j].start_time.slice(0, 4)) === Number(this.year) && text === this.selectList[j].start_time.slice(5, 7)) {
                  this.isDisabled.splice(i, 1, false)
                }
              }
            }
          } else {
            this.isDisabled = Array.from({ length: lists.length }).map(() => {
              return false
            })
          }
        })
      }, // 将“第1季度”转为“01”格式、“第2季度”转为“04”格式...
      changeQuarterFomat(text) {
        var ret = this.quarterName.find(p => {
          return text.trim() === this.getPropertyByLg(p, 'name')
        })
        return ret.data
      },
      // 获取近20年年份列表，倒序排列，最新一年在最前面
      getDateList() {
        let Dates = new Date()
        let year = Dates.getFullYear()
        this.OneY = year
        let optDate = []
        for (let i = year - 20; i <= year; i++) {
          optDate.push(i)
        }
        return optDate.reverse()
      },
      prev() {
        if (this.curIndex === this.DateList.length - 1) return // 当前下标值-1，根据下标值获取年份值
        this.curIndex = this.curIndex + 1
        this.year = this.DateList[this.curIndex].TimeYear
        this.focusselect()
      },
      next() {
        if (this.curIndex === 0) return // 当前下标值-1，根据下标值获取年份值
        this.curIndex = this.curIndex - 1
        this.year = this.DateList[this.curIndex].TimeYear
        this.focusselect()
      },
      selectSeason() {
        this.showValue = this.optTime[this.curIndex].queryTime // 根据输入框是否有值来判断清空图标是否渲染
        this.showSeason = false
        this.optTime.map(p => {
          if (p.queryTime !== '' && p.TimeYear !== this.year) {
            this.$set(p, 'queryTime', '')
          }
        })
        this.showClear = !this.showValue === ''
        this.$emit('input', this.showValue, this.status)
      }, // 重置
      resetQuarter() {
        // 将年份重置到当前年份
        this.year = new Date().getFullYear() // 将已选择的月份清空
        for (let i in this.optTime) {
          this.optTime[i].queryTime = ''
        } // 将输入框清空
        this.showValue = '' // 根据输入框是否有值来判断清空图标是否渲染，此处必然不渲染
        this.showClear = false
        this.curIndex = 0
        this.$emit('getMultiple', [])
      },
      setDisabled(index) {
        let year = `${this.DateList[this.curIndex].TimeYear}`
        let month = this.quarterName[index].data
        return dayjs().isBefore(`${year}-${month}-01`, 'month')
      },
    },
  }
</script>
<style scoped>
  ::v-deep .el-radio__input {
    display: none;
  }
  ::v-deep .el-radio__label {
    display: inline-block;
    padding: 0;
  }
  ::v-deep .el-radio__input.is-checked + .el-radio__label {
    color: #fff;
    background-color: #409eff;
    width: 60px !important;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 20px;
    padding: 0;
  }
  .el-radio__input.is-disabled + span.el-radio__label {
    color: #62666f;
  }
  .textitem {
    text-align: center;
  }
  .oneitem {
    color: #fff;
    width: 60px !important;
    height: 36px;
    line-height: 36px;
    margin: 10px;
    text-align: center;
    border-radius: 20px;
  }
  .oneitem:not(.is-disabled):hover {
    color: #fff;
    background-color: #409eff;
  }
  .clearIconStyle {
    display: none;
  }
  .inputStyle:hover .clearIconStyle {
    display: block;
  }
</style>
