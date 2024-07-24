<template>
  <div>
    <div class="day-heads">
      <Select v-model="macValue" filterable :placeholder="$t('pleaseSelectDeviceOrDeviceSearchSelect')" style="width: 270px">
        <Option v-for="item in macList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="excuteType" filterable :placeholder="$t('pleaseSelectExeType')" style="width: 200px; margin: 0 10px" class="type-select">
        <Option v-for="item in excuteTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button type="primary" style="margin-right: 10px" @click="queryInit">{{ $t('query') }}</Button>
      <Button @click="resetFrom">{{ $t('reset') }}</Button>
      <!-- <Button @click="openPassword">打开密码框</Button> -->
    </div>
    <div class="day-content-song">
      <h3 style="padding-top: 20px; padding-left: 20px">{{ $t('executelist') }}</h3>
      <div style="padding-left: 20px; margin: 10px 0; display: flex">
        <div style="margin: 0 20px; padding-top: 2px" class="radio-box">
          <RadioGroup v-model="buttonMonth" type="button" @on-change="getValueMonth">
            <Radio label="lastMonth">
              <span :style="isCurrent === 'lastMonth' ? 'color:#2d8cf0' : 'color:#999999'">{{ $t('lastMonth') }}</span>
            </Radio>
            <Radio label="curMonth">
              <span :style="isCurrent === 'curMonth' ? 'color:#2d8cf0' : 'color:#999999'">{{ $t('thisMonth') }}</span>
            </Radio>
            <Radio label="nextMonth">
              <span :style="isCurrent === 'nextMonth' ? 'color:#2d8cf0' : 'color:#999999'">{{ $t('nextMonth') }}</span>
            </Radio>
          </RadioGroup>
        </div>
        <div style="flex: 12; overflow: auto; display: flex">
          <div class="swiper">
            <div class="swiper-wrapper">
              <div v-for="item in isMonthList" :key="item.time" :class="item.time === curClick ? 'swiper-slide time-box blue-bgs pointer' : 'swiper-slide time-box gray-bg pointer'" @click="getItemValue(item)">
                <div style="padding-left: 8px">{{ item.time }}</div>
                <div v-if="item.isToday" style="position: relative">
                  <span style="position: absolute; top: -23px; right: -4px">
                    <img src="../../../assets/images/todayIcon.png" alt="" />
                  </span>
                </div>
                <div v-if="item.dayNum === '0'" :class="item.time === curClick ? 'mrg-left blues-today' : 'mrg-left  grays-today'">{{ $t('sunday') }}</div>
                <div v-if="item.dayNum === '1'" :class="item.time === curClick ? 'mrg-left blues-today' : 'mrg-left  grays-today'">{{ $t('monday') }}</div>
                <div v-if="item.dayNum === '2'" :class="item.time === curClick ? 'mrg-left blues-today' : 'mrg-left  grays-today'">{{ $t('tuesday') }}</div>
                <div v-if="item.dayNum === '3'" :class="item.time === curClick ? 'mrg-left blues-today' : 'mrg-left  grays-today'">{{ $t('wednesday') }}</div>
                <div v-if="item.dayNum === '4'" :class="item.time === curClick ? 'mrg-left blues-today' : 'mrg-left  grays-today'">{{ $t('thursday') }}</div>
                <div v-if="item.dayNum === '5'" :class="item.time === curClick ? 'mrg-left blues-today' : 'mrg-left  grays-today'">{{ $t('friday') }}</div>
                <div v-if="item.dayNum === '6'" :class="item.time === curClick ? 'mrg-left blues-today' : 'mrg-left  grays-today'">{{ $t('saturday') }}</div>
              </div>
            </div>

            <div class="swiper-button-next">
              <img src="../../../assets/images/right.png" style="width: 30px; height: 40px; display: inline-block" alt="" />
              <!-- <Icon type="md-arrow-round-forward" class="foward-hovers" style="font-size:30px;" /> -->
            </div>
            <div class="swiper-button-prev">
              <img src="../../../assets/images/left.png" style="width: 30px; height: 40px; display: inline-block" alt="" />
            </div>

            <!-- <div class="swiper-button-next"></div> -->
            <!-- 如果需要滚动条 -->
            <!-- <div class="swiper-scrollbar"></div><i class="icon-v5 icon-v5-xiangzuo"></i> -->
          </div>
        </div>
      </div>
    </div>
    <div class="day-contents">
      <div>
        <div style="width: 4382px; margin-left: 20px">
          <div class="head-title"></div>

          <div class="excute-Containt">
            <div class="head-contants">
              <Row v-for="(item, index) in excuteLists" :key="index" style="padding: 20px 0">
                <Col v-for="v in item" :key="`${v.executeConfigId}` + `${v.id}`" :style="{ marginRight: `${v.marginR ? v.marginR + 'px' : ''}`, marginLeft: `${v.marginL ? v.marginL + 'px' : ''}` }">
                  <!--   -->
                  <div :class="v.status === 0 ? 'faileImg' : v.status === 1 ? 'successImg' : v.status === 2 ? 'someSucImg' : v.status === 3 ? 'waitImg' : 'defaultImg'">
                    <div style="padding: 10px">
                      <div class="first-Rows">
                        <div>{{ v.executeTime }}</div>
                        <div style="color: #999999">{{ v.executeTypeShow }}</div>
                      </div>
                      <div class="blue-texts pointer" @click="gotoOtherPage(v)">
                        <span v-if="v.executeName" style="margin-right: 10px">{{ v.executeName }}</span>
                        <span class="box-blue" v-if="v.executeType !== 5">{{ v.modelShow }}</span>
                        <span class="box-blue" v-if="v.executeType === 5 && v.attr.typeShow">{{ v.attr.typeShow }}</span>
                      </div>
                      <div v-if="v.deviceList.length > 0" style="margin: 10px 0">
                        <Tooltip placement="top" transfer max-width="1030">
                          <span class="border-mac">
                            {{ (v.deviceList[0].deviceName + '(' + v.deviceList[0].mac + ')').length > 16 ? (v.deviceList[0].deviceName + '(' + v.deviceList[0].mac + ')').substr(0, 16) + '...' : v.deviceList[0].deviceName + '(' + v.deviceList[0].mac + ')' }}
                            <!-- {{v.deviceList[0].addrs.length?':'+v.deviceList[0].addrs[0]+'...':''}} -->
                            {{ v.deviceList[0].addrShow === 1 ? ':' + v.deviceList[0].addrs[0] + '...' : v.deviceList[0].addrShow === 2 ? ':' + v.deviceList[0].addrPortMapping[0].addr + '...' : '' }}
                          </span>
                          <div slot="content">
                            <div v-if="!v.deviceList[0].addrs.length">
                              <div>{{ v.deviceList[0].deviceName + '(' + v.deviceList[0].mac + ')' }}</div>
                            </div>
                            <div v-if="v.deviceList[0].addrs.length">
                              <div style="display: flex; white-space: nowrap">
                                <div>{{ v.deviceList[0].deviceName + '(' + v.deviceList[0].mac + ')' }}</div>
                                <div style="display: flex">
                                  <span v-if="v.deviceList[0].addrShow === 1">
                                    {{ ':' }}
                                    <span v-for="addr in v.deviceList[0].addrs" :key="addr" style="margin: 0 10px">
                                      {{ addr }}
                                    </span>
                                  </span>
                                  <span v-if="v.deviceList[0].addrShow === 2">
                                    {{ ':' }}
                                    <span v-for="port in v.deviceList[0].addrPortMapping" :key="port.addr" style="margin: 0 10px">
                                      {{ port.addr + '(' + port.index.join(',') + ')' }}
                                    </span>
                                  </span>
                                  <!-- {{(v.deviceList[0].addrPortMapping)
                                        &&v.deviceList[0].addrPortMapping[idx]
                                        &&(v.deviceList[0].addrPortMapping.map(j=>j.addr).includes(addr))
                                        &&v.deviceList[0].addrPortMapping.filter(vls=>vls.addr===addr).length?
                                        '('+v.deviceList[0].addrPortMapping.filter(vls=>vls.addr===addr)[0].index.join(',')+')':''}} -->
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tooltip>
                        <Tooltip placement="top" max-width="470" transfer>
                          <span class="border-mac" v-if="v.deviceList.length > 1" style="margin-left: 10px">{{ '+' + `${v.deviceList.length - 1}` }}</span>
                          <div slot="content">
                            <div v-for="(itm, idt) in v.deviceList" :key="itm.mac + `${idt}`" style="display: flex; white-space: nowrap; margin: 10px 0">
                              <span class="border-mac">
                                {{ itm.deviceName + '(' + itm.mac + ')' }}
                                <span v-if="itm.addrShow === 1">
                                  {{ ':' }}
                                  <span v-for="addr in itm.addrs" :key="addr + 'sss'">
                                    {{ addr }}
                                  </span>
                                </span>
                                <span v-if="itm.addrShow === 2">
                                  {{ ':' }}
                                  <span v-for="port in itm.addrPortMapping" :key="port.addr + '111'">
                                    {{ port.addr + '(' + port.index.join(',') + ')' }}
                                  </span>
                                </span>
                                <!-- <span v-if="itm.addrs.length"> -->
                                <!-- <span v-for="(addr,ids) in itm.addrs" :key="addr+'sss'"> -->
                                <!-- {{':'+addr}} -->
                                <!-- {{itm.addrPortMapping
                                        &&itm.addrPortMapping[ids]&&(itm.addrPortMapping.map(j=>j.addr).includes(addr))
                                        &&(itm.addrPortMapping.filter(vls=>vls.addr===addr).length)?
                                        '('+itm.addrPortMapping.filter(vls=>vls.addr===addr)[0].index.join(',')+')':''}} -->
                                <!-- </span> -->
                                <!-- </span> -->
                              </span>
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                      <div v-if="v.action === 12">
                        <span style="color: #999999">{{ $t('shouldBeInThe') }}</span>
                        <span style="color: #f24e4c">{{ '"' + v.actionShow + '"' }}</span>
                      </div>
                      <div v-if="v.action === 2 || v.action === 5" style="color: #f24e4c">{{ v.actionShow }}</div>
                      <div v-if="v.action === 13 && v.executeType !== 5">
                        <span style="color: #999999">{{ $t('shouldBeInThe') }}</span>
                        <span style="color: #007eff">{{ '"' + v.actionShow + '"' }}</span>
                      </div>
                      <div v-if="v.action === 11 && v.status !== 3">
                        <span style="color: #999999">{{ $t('shouldBeInThe') }}</span>
                        <span style="color: #0ecf64">{{ '"' + v.actionShow + '"' }}</span>
                      </div>
                      <div v-if="v.action === 11 && v.status === 3">
                        <span style="color: #0ecf64">{{ '"' + v.actionShow + '"' }}</span>
                      </div>
                      <div style="color: #0ecf64" v-if="v.action === 1 || v.action === 3 || v.action === 4">
                        {{ v.actionShow }}
                      </div>
                      <!-- <div v-if="v.action===13&&v.executeType===5&&Object.keys(v.attr).length>0" >
                                    <span class="border-mac" >

                                            <span> {{v.attr.attrValue[0].name+':'}}</span>
                                            <span style="color:#FFA854"> {{v.attr.attrValue[0].warnValue}}</span>
                                             <span v-if="v.attr.attrValue[0].alarmValue"> {{'/'}}</span>
                                            <span style="color:#F24E4C"> {{v.attr.attrValue[0].alarmValue}}</span>

                                    </span>
                                     <Tooltip placement="top" max-width="470" transfer>
                                    <span class="border-mac" v-if="v.attr.attrValue.length>1" style="margin-left:10px">{{`+${v.attr.attrValue.length-1}`}}</span>
                                    <div slot="content">

                                        <div v-for="(j,idx) in v.attr.attrValue" :key="idx+j.name" style="margin: 10px 0;">
                                            <span class="border-mac">

                                            <span> {{j.name+':'}}</span>
                                            <span style="color:#FFA854"> {{j.warnValue}}</span>
                                            <span v-if="j.alarmValue">{{'/'}}</span>
                                            <span style="color:#F24E4C" > {{+j.alarmValue}}</span>

                                    </span>
                                        </div>
                                    </div>
                                   </Tooltip>
                                   </div> -->
                      <div v-if="v.action === 13 && v.executeType === 5" style="color: #007eff">
                        {{ $t('thresholdIssuance') }}
                      </div>
                      <div v-if="v.action === 7" style="color: #007eff">{{ v.actionShow }}</div>
                      <div v-if="v.action === 14" style="color: #007eff">{{ v.actionShow }}</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // Import Swiper styles
  import PassWordInputs from '../../Common/PassWordInput.vue'
  import { pageQueryAddr, listDaily, checkValidConfigId } from '@/api/public'
  import Swiper, { Navigation } from 'swiper'
  import { processsData, allArrFunc, filtereveryData, filterFunc, lengthBubFuc, getCurrentMonth, getMonthDay, attributeBubFuc, mLandMrFuc } from './calilader'
  import dayjs from 'dayjs'
  export default {
    name: 'multiManage-dayExecuteList',
    components: { PassWordInputs },
    data() {
      return {
        excuteLists: [],
        curClick: '',
        num11: '',
        swiper: null,
        buttonMonth: '',
        isCurrent: '',
        macList: [],
        macValue: '',
        excuteType: '',
        excuteTypeList: [
          { value: '1', label: this.$t('sceneControl') },
          { value: '2', label: this.$t('builtInTimer') },
          { value: '3', label: this.$t('longitudeAndLatitudeTiming') },
          { value: '4', label: this.$t('linkageConfig') },
          { value: '5', label: this.$t('smartThresholdConfig') },
          { value: '6', label: this.$t('runtimeTense') },
        ],
      }
    },
    computed: {
      isAtMonth() {
        let isAtMonth
        if (this.buttonMonth === 'curMonth') {
          isAtMonth = new Date().getMonth() + 1
        } else if (this.buttonMonth === 'lastMonth') {
          isAtMonth = new Date().getMonth() === 0 ? 12 : new Date().getMonth()
        } else if (this.buttonMonth === 'nextMonth') {
          isAtMonth = new Date().getMonth() + 2 === 13 ? 1 : new Date().getMonth() + 2
        }
        return isAtMonth
      },
      isMonthList() {
        let month
        if (this.buttonMonth === 'curMonth') {
          month = new Date().getMonth() + 1
        } else if (this.buttonMonth === 'lastMonth') {
          month = new Date().getMonth() === 0 ? 12 : new Date().getMonth()
        } else if (this.buttonMonth === 'nextMonth') {
          month = new Date().getMonth() + 2 === 13 ? 1 : new Date().getMonth() + 2
        }
        let dayList = getMonthDay(getCurrentMonth(month), month)
        let isMonthList = []
        let year = new Date().getFullYear()
        for (let i = 0; i < dayList.length; i++) {
          isMonthList.push({ time: dayList[i], dayNum: `${new Date(`${year}-${dayList[i]}`).getDay()}`, isToday: new Date(`${year}-${dayList[i]}`).toDateString() === new Date().toDateString() })
        }
        return isMonthList
      },
    },
    methods: {
      init() {
        let date = new Date().getFullYear() + this.curClick
        let params = {
          projectCode: this.$store.state.projectCode,
          date: dayjs(date).format('YYYYMMDD'),
          executeType: this.excuteType,
          device: this.macValue,
        }
        // console.log(params, 'params');
        listDaily(params).then(res => {
          if (res.success) {
            // console.log(res, '每日执行列表');
            let datas = res.data.map(v => ({ ...v, time: v.executeTime, aa: v.executeTime }))
            let newData = processsData(datas)
            let filteData = filtereveryData(newData)
            let moreLen = filteData.filter(v => v.length > 1)
            let oneLen = filterFunc(filteData)
            let allDatas = []
            if (moreLen.length > 0) {
              let onesArr = allArrFunc(newData)
              allDatas = lengthBubFuc(onesArr)
              allDatas.forEach(v => {
                v = attributeBubFuc(v)
              })
              // console.log(allDatas, 'allDatas');
              for (let i = 0; i < allDatas.length; i++) {
                for (let j = 0; j < allDatas[i].length; j++) {
                  allDatas[i] = mLandMrFuc(allDatas[i])
                }
              }
              this.excuteLists = allDatas
            } else {
              for (let i = 0; i < oneLen.length; i++) {
                for (let j = 0; j < oneLen[i].length; j++) {
                  oneLen[i] = mLandMrFuc(oneLen[i])
                }
              }
              this.excuteLists = oneLen
            }
            // console.log(this.excuteLists, 'allDatas', 'filteData')
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      gotoOtherPage(val) {
        checkValidConfigId({
          executeType: val.executeType,
          executeConfigId: val.executeConfigId,
        }).then(res => {
          if (res.success) {
            let isPush = res.data
            if (isPush) {
              if (val.executeType === 1) {
                this.$router.push({ name: 'multiManage-sceneControl', params: { executeConfigId: val.executeConfigId, model: val.model } })
              } else if (val.executeType === 2) {
                this.$router.push({ name: 'multiManage-builtInTimer', params: { executeConfigId: val.executeConfigId, model: val.model } })
              } else if (val.executeType === 3) {
                this.$router.push({ name: 'multiManage-latlongTimer', params: { executeConfigId: val.executeConfigId, model: val.model } })
              } else if (val.executeType === 4) {
                this.$router.push({ name: 'multiManage-linkageScene', params: { executeConfigId: val.executeConfigId, model: val.model } })
              } else if (val.executeType === 5) {
                this.$router.push({ name: 'multiManage-threShold', params: { executeConfigId: val.executeConfigId, model: val.model } })
              } else if (val.executeType === 6) {
                this.$router.push({ name: 'multiManage-runningTense', params: { executeConfigId: val.executeConfigId, model: val.model } })
              }
            } else {
              this.$Message.error({
                content: this.$t('thisConfigDeletedTip'),
              })
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      queryInit() {
        this.init()
      },
      resetFrom() {
        this.macValue = ''
        this.excuteType = ''
      },
      getItemValue(item) {
        // console.log(item, 'ite,ms');
        if (item.time === this.curClick) return
        this.curClick = item.time
        this.init()
      },
      openPassword(val) {
        this.openInput = true
      },
      getValueMonth(val) {
        // console.log(val, '1313')
        if (val === this.isCurrent) return
        this.isCurrent = val
        if (val === 'nextMonth') {
          let ntMonth = new Date().getMonth() + 2 === 13 ? 1 : new Date().getMonth() + 2
          this.curClick = (ntMonth > 9 ? ntMonth : '0' + ntMonth) + '-01'
        } else if (val === 'lastMonth') {
          this.curClick = (new Date().getMonth() > 9 ? new Date().getMonth() : '0' + new Date().getMonth()) + '-01'
        } else if (val === 'curMonth') {
          this.curClick = dayjs(new Date()).format('MM-DD')
        }
        //  console.log(this.curClick, ' this.curClick');
        this.init()
        // let curmonth = new Date().getMonth() + 1 // 当前月
        // let lastmonth = new Date().getMonth() // 上月
        // let nextmonth = new Date().getMonth() + 2 // 下月
        // let monthNum = getCurrentMonth(nextmonth) + '-' + getCurrentMonth(curmonth) + '-' + getCurrentMonth(lastmonth)
        // console.log(monthNum, 'monthNum');
        // console.log(getMonthDay(getCurrentMonth(curmonth), curmonth), 'getCurrentMonth(curmonth)');
      },
      getAllMac() {
        let params = {
          projectCode: this.$store.state.projectCode,
          pageSize: 1000,
          equipmentTypes: '1,2,19',
          pageNo: 1,
        }
        pageQueryAddr(params).then(res => {
          if (res.success) {
            this.macList = res.datas.map(item => ({
              addrs: item.addrs,
              value: item.mac,
              label: item.name + '(' + item.mac + ')',
              disabled: !item.addrs || item.addrs.length === 0,
            }))
          }
        })
      },
    },
    created() {
      this.buttonMonth = 'curMonth'
      this.isCurrent = 'curMonth'
      this.curClick = dayjs(new Date()).format('MM-DD')
      this.getAllMac()
      this.init()
    },
    mounted() {
      // console.log(this.curClick, 'this.curClick');
      this.swiper = new Swiper('.swiper', {
        loop: false,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        // 如果需要前进后退按钮
        modules: [Navigation],
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // 如果需要滚动条
        scrollbar: '.swiper-scrollbar',
        slidesPerView: 10,
      })
    },
  }
</script>

<style lang="less" scoped>
  .radio-box {
    .ivu-radio-group-button .ivu-radio-wrapper:first-child {
      border-radius: 4px 0 0 4px;
      border-left: 1px solid #3d3d41;
    }
  }
  .border-mac {
    border: 1px solid #535b6c;
    border-radius: 4px;
    padding: 2px 5px;
  }
  .first-Rows {
    display: flex;
    justify-content: space-between;
    padding-right: 30px;
    margin-top: 10px;
  }
  .blue-texts {
    color: #007eff;
    margin: 10px 0;
  }
  .box-blue {
    color: #007eff;
    padding: 2px 5px;
    background: rgb(35, 54, 87);
    border-radius: 4px;
  }
  .day-heads {
    background: #1a202e;
    padding: 10px;
    margin: 10px;
    .type-select .ivu-select-dropdown {
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none !important;
      }
    }
  }
  .faileImg {
    width: 302px;
    height: 160px;
    background: url('../../../assets/images/faile-excute.png') no-repeat;
  }
  .someSucImg {
    width: 302px;
    height: 160px;
    background: url('../../../assets/images/excutesuccess-Some.png') no-repeat;
  }
  .waitImg {
    width: 302px;
    height: 160px;
    background: url('../../../assets/images/noexcute-wait.png') no-repeat;
  }
  .successImg {
    width: 302px;
    height: 160px;
    background: url('../../../assets/images/excute-Success.png') no-repeat;
  }
  .defaultImg {
    width: 302px;
    height: 160px;
    background: url('../../../assets/images/furtrue-excute.png') no-repeat;
  }
  .blue-box {
    width: 60px !important;
    height: 45px;
    margin: 0 10px;
    border-radius: 5px;
  }
  .gray-bg {
    background: rgba(153, 153, 153, 0.1);
  }
  .blue-bgs {
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007eff;
    color: #007eff;
  }
  .time-box {
    width: 60px !important;
    height: 35px;
    margin: 0 5px;
    padding: 0 10px;
    border-radius: 4px;
    padding: 2px 4px;
  }
  .mrg-left {
    margin-left: 14px;
    margin-top: -5px;
    font-size: 12px;
  }
  .grays-today {
    color: #999999;
  }
  .blues-today {
    color: #007eff;
  }
  .day-content-song {
    margin: 10px 10px 0 10px;
    border-radius: 5px;
    padding-bottom: 10px;
    height: 100%;
    min-width: 90%;
    background: #1a202e;
    overflow: auto;
    scrollbar-width: none;
    ::-webkit-scrollbar {
      width: 0 !important;
    }
  }
  .day-contents {
    margin: -10px 10px 0 10px;
    padding-bottom: 10px;
    height: 100%;
    min-width: 90%;
    background: #1a202e;
    overflow: auto;
  }
  .foward-hovers:hover {
    color: #007eff;
  }
  .head-title {
    height: 30px;
    background: url(../../../assets/images/timehead.png) no-repeat;
    background-size: 100% 100%;
  }
  .excute-Containt {
    height: 480px;
    overflow: auto;
  }
  .head-contants {
    min-height: 480px;
    background: url('../../../assets/images/bottomLine.png') no-repeat;
    background-size: 100% 100%;
  }
  .excute-Containt::-webkit-scrollbar {
    /*
                width height分别对应竖向滚动条和横向滚动条
            */
    width: 20px;
    // height: 5px;
    // background-color:red;
  }
  .swiper-container {
    --swiper-navigation-size: 0;
  }
  .swiper-button-next {
    position: absolute;
    top: 2px;
    right: 0;
    width: 40px;
    height: 30px;
    // margin-top: calc(0px - (var(--swiper-navigation-size)/ 2));
    z-index: 10;
    cursor: pointer;
    display: flex;
    //background: green;
    align-items: center;
    justify-content: center;
  }

  .swiper-button-prev {
    position: absolute;
    top: 2px;
    left: 0;
    width: 40px;
    height: 30px;
    // margin-top: calc(0px - (var(--swiper-navigation-size)/ 2));
    z-index: 10;
    cursor: pointer;
    display: flex;
    // background: red;
    align-items: center;
    justify-content: center;
    // color:
  }
</style>
