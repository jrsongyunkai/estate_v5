<template>
  <div class="topoDetails">
    <div class="BtnList">
      <Button class="Button" v-if="state !== 1" @click="macClick">{{ $t('viewDetails') }}</Button>
      <Upload ref="upload" :action="uploadUrl" :name="imgData.name" :data="imgData" :on-success="handleSuccess" :before-upload="beforeUpload" @mouseover.native="flag = true" :show-upload-list="false" :format="['jpg', 'jpeg', 'png']" :max-size="2048" multiple>
        <Button class="Button">{{ $t('uploadImg') }}</Button>
      </Upload>
    </div>
    <div class="content">
      <div class="header">
        <div class="title">
          {{ $t('topologyDetailTitle', { title }) }}
        </div>
        <div class="state">
          <template v-if="state === 2">
            <div class="online" :style="detaildata.boxDetailVo.online === 1 ? onlineStyle : detaildata.boxDetailVo.online === 0 ? offlineStyle : outLIneStyle">
              {{ detaildata.boxDetailVo.online === 1 ? this.$t('online') : detaildata.boxDetailVo.online === 0 ? this.$t('offline') : this.$t('disconnected') }}
            </div>
            <div :style="halfclosing">
              <i class="icon-v5 icon-v5-banhezha" style="font-size: 38px"></i>
              {{ $t('onOffRatio', { closeCount: detaildata.boxDetailVo.closeChnlCount, openCount: detaildata.boxDetailVo.openChnlCount }) }}
            </div>
          </template>
          <template v-if="state === 3">
            <div :style="detaildata.addrDetailVo.oc === true ? redBtnStyle : greenBtnStyle">
              <i :class="detaildata.addrDetailVo.oc ? 'icon-v5 icon-v5-yihezha' : 'icon-v5 icon-v5-yifenzha'" style="font-size: 38px"></i>
              {{ detaildata.addrDetailVo.oc === true ? this.$t('closed') : this.$t('opened') }}
            </div>
          </template>
          <template v-if="state === 4">
            <div :style="detaildata.value === 0 ? offlineStyle : onlineStyle">
              {{ detaildata.value === 0 ? 'OFF' : 'ON' }}
            </div>
          </template>
        </div>
        <div class="state"></div>
        <div class="closingRatio"></div>
      </div>
      <div class="details">
        <div class="img">
          <el-image style="width: 100px; height: 100px" :src="url" :preview-src-list="srcList"></el-image>
        </div>
        <Information :state="state" :detailData="detaildata" />
      </div>
      <template v-if="state === 2">
        <Trend :boxorlineAlarm="boxorlineAlarm" :unhandTotal="unhandTotal" :todayTotal="todayTotal" :boxorlineTotal="boxorlineTotal" @page="handlepage" @processStatus="handleprocessStatus" :details="details" :detailData="detaildata" />
      </template>
      <template v-if="state === 3">
        <Trend :boxorlineAlarm="boxorlineAlarm" :unhandTotal="unhandTotal" :todayTotal="todayTotal" :boxorlineTotal="boxorlineTotal" @page="handlepage" @processStatus="handleprocessStatus" :details="details" :detailData="detaildata" />
      </template>
      <template v-if="state === 4">
        <template v-if="detailData.digitalIn || detailData.digitalOut">
          <switch-outpu :options="options" />
          <div style="margin-top: -30px; margin-left: 20px">
            <div>{{ $t('topologyPortStatsTitle', digital) }}</div>
            <Row style="margin-left: 15px">
              <i18n path="topologyPortStats" tag="Col" :span="6">
                <span style="color: #f24e4c">OFF</span>
                <span style="margin-left: 5px">{{ digital.offCount }}</span>
              </i18n>
              <Col :span="16">
                <!-- 总时长{h}小时{m}分 -->
                <span>{{ $t('topologyPortDuration', { h: parseInt(digital.offDuration / 60), m: parseInt(digital.offDuration % 60) }) }}</span>
              </Col>
            </Row>
            <Row style="margin-left: 15px">
              <i18n path="topologyPortStats" tag="Col" :span="6">
                <span style="color: #f24e4c">ON</span>
                <span style="margin-left: 5px">{{ digital.onCount }}</span>
              </i18n>
              <Col :span="16">
                <!-- 总时长{h}小时{m}分 -->
                <span>{{ $t('topologyPortDuration', { h: parseInt(digital.onDuration / 60), m: parseInt(digital.onDuration % 60) }) }}</span>
              </Col>
            </Row>
          </div>
        </template>
        <template v-if="detailData.analogIn">
          <div style="margin-top: 50px">
            <TcequipmentLine :options="analogInoptions.options" :title="analogInoptions.org.name" ref="residuals"></TcequipmentLine>
          </div>
          <div style="margin-left: 40px">
            <div>{{ $t('topologyPortStatsTitle', analogInoptions.org) }}</div>
            <div>
              <Row style="margin-left: 10px">
                <Col :span="14">
                  {{ $t('acquisition') + $t('stay') }}{{ analogInoptions.org.max === 0 && analogInoptions.org.min === 0 ? maxTime[0].substr(10) : analogInoptions.org.maxOfTime }}{{ $t('maximumReached') }}
                  <span style="color: #f24e4c; margin-left: 5px">{{ analogInoptions.org.max + analogInoptions.org.unit }}</span>
                </Col>
                <Col :span="10">
                  {{ $t('stay') }}{{ analogInoptions.org.max === 0 && analogInoptions.org.min === 0 ? maxTime[1].substr(10) : analogInoptions.org.minOfTime }}{{ $t('minimumReached') }}
                  <span style="color: #0dd667">
                    {{ analogInoptions.org.min + analogInoptions.org.unit }}
                  </span>
                </Col>
              </Row>
              <Row style="margin-left: 10px">
                <Col :span="14">
                  {{ $t('displayValue') + $t('stay') }}{{ analogInoptions.ext.max === 0 && analogInoptions.ext.min === 0 ? maxTime[0].substr(10) : analogInoptions.ext.maxOfTime ? analogInoptions.ext.maxOfTime : maxTime[0].substr(10) }}{{ $t('maximumReached') }}
                  <span style="color: #f24e4c; margin-left: 1px">{{ analogInoptions.ext.max + analogInoptions.ext.convertUnit }}</span>
                </Col>
                <Col :span="10">
                  {{ $t('stay') }}{{ analogInoptions.ext.max === 0 && analogInoptions.ext.min === 0 ? maxTime[1].substr(10) : analogInoptions.ext.minOfTime }}{{ $t('minimumReached') }}
                  <span style="color: #0dd667">{{ analogInoptions.ext.min + analogInoptions.ext.convertUnit }}</span>
                </Col>
              </Row>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
  import Information from '@/components/topology/information.vue'
  import Trend from '@/components/topology/trend.vue'
  import SwitchOutpu from '../../../components/topology/switchOutpu.vue'
  import { boxOrAddrDetail4Alarm, updateFloorProperty, queryBoxDetails } from '@/api/public'
  import TcequipmentLine from '../../Common/TcequipmentLine.vue'
  import { onlineStyle, offlineStyle, halfclosing, redBtnStyle, greenBtnStyle, outLIneStyle } from '../../../pages/console/topology/statusColors'
  import store from '@/store'
  export default {
    components: { Information, Trend, SwitchOutpu, TcequipmentLine },
    props: {
      title: String,
      details: Object,
      state: Number,
      detailData: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        detaildata: {},
        uploadUrl: '/box/icon/upload.as?v=' + new Date().getTime(),
        imgData: { name: 'imgFile', mac: '' },
        url: require('../../../assets/images/noimg.jpg'),
        boxorlineAlarm: [],
        options: {},
        analogInoptions: [],
        maclineData: { version: '', online: '' },
        outLIneStyle: outLIneStyle,
        onlineStyle: onlineStyle,
        offlineStyle: offlineStyle,
        halfclosing: halfclosing,
        redBtnStyle: redBtnStyle,
        greenBtnStyle: greenBtnStyle,
        detailsFlag: false,
        IoMac: '',
        IoAddr: '',
        boxorlineTotal: 1,
        todayTotal: 0,
        unhandTotal: 0,
      }
    },
    computed: {
      srcList() {
        return [this.url]
      },
    },
    mounted() {
      this.handleBoxOrAddrDetailAlarm()
      this.handleUnhandledalarmTotal()
      this.handletodayalarmTotal()
    },
    methods: {
      beforeUpload(file) {
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
          const isLt1M = file.size / 1024 / 1024 < 1
          if (!isLt1M) {
            this.$Message.error(this.$t('imgLarger1M'))
          }
          return isLt1M
        } else {
          this.$Message.error(this.$t('uploadImgFormatError'))
        }
      },
      handleSuccess(res, file) {
        if (res.success) {
          this.url = res.data
          this.$Message.success({
            content: this.$t('uploadSuccess'),
          })
          this.updateFloorProperty(this.detaildata, this.url)
        } else if (res.code === '-1') {
        } else {
          this.$Message.error(res.message)
        }
      },
      handleprocessStatus(val) {
        this.processstatus = val
        this.handleBoxOrAddrDetailAlarm()
      },
      handlepage(val) {
        this.handleBoxOrAddrDetailAlarm(val)
      },
      handleUnhandledalarmTotal(val) {
        if (this.details.mac) {
          let params = {
            mac: this.details.mac,
            addr: this.details.addr,
            startTime: this.$Date().format('YYYY-MM-DD'),
            endTime: this.$Date().format('YYYY-MM-DD'),
            processStatus: 0,
            pageNo: val,
            pageSize: '10',
          }
          boxOrAddrDetail4Alarm(params).then(res => {
            this.unhandTotal = res.total
          })
        }
      },
      handletodayalarmTotal(val) {
        if (this.details.mac) {
          let params = {
            mac: this.details.mac,
            addr: this.details.addr,
            startTime: this.$Date().format('YYYY-MM-DD'),
            endTime: this.$Date().format('YYYY-MM-DD'),
            processStatus: '',
            pageNo: val,
            pageSize: '10',
          }
          boxOrAddrDetail4Alarm(params).then(res => {
            this.todayTotal = res.total
          })
        }
      },
      handleBoxOrAddrDetailAlarm(val) {
        if (this.details.mac) {
          let params = {
            mac: this.details.mac,
            addr: this.details.addr,
            startTime: this.$Date().format('YYYY-MM-DD'),
            endTime: this.$Date().format('YYYY-MM-DD'),
            processStatus: this.processstatus,
            pageNo: val,
            pageSize: '10',
          }
          boxOrAddrDetail4Alarm(params).then(res => {
            this.boxorlineAlarm = []
            if (res.success) {
              this.boxorlineAlarm = res.datas
              this.boxorlineTotal = res.total
            } else {
              this.$Message.error(res.message)
            }
          })
        }
      },
      async macClick() {
        if (!this.maclineData.mac) {
          this.maclineData.mac = this.details.mac
        }
        this.maclineData.equipmentType = 1
        this.maclineData.projectCode = this.$store.state.projectCode
        const res = await queryBoxDetails({ mac: this.details.mac })
        if (res.success) {
          store.commit('maintenanceObj', this.maclineData)
          store.commit('equipmentFlag', false)
          store.commit('detailsFlagMore', true)
          this.$emit('lookDeviceDetails', res.data)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      updateFloorProperty(item, img) {
        this.url = img
        let params = {
          projectCode: this.$store.state.projectCode,
          build: item.build,
          unit: item.unit || '',
          room: item.room || '',
          imgUrl: img,
        }
        if (item.build && !item.unit && !item.room) {
          params.floorType = '1'
        } else if (item.build && item.unit && !item.room) {
          params.floorType = '2'
        } else {
          params.floorType = '3'
        }
        updateFloorProperty(params).then(res => {})
      },
    },
    watch: {
      detailData: {
        handler(newVal, oldVal) {
          this.detaildata = newVal
          // 楼栋图片信息
          if (newVal.build || newVal.unit || newVal.room) {
            this.url = newVal.imgUrl === '' ? require('../../../assets/images/noimg.jpg') : newVal.imgUrl
            this.uploadUrl = '/common/file/upload.as?fileType=1'
            this.imgData = {
              name: 'imgFile',
            }
          }
          // 设备详情图片信息
          if (newVal.boxDetailVo) {
            this.url = newVal.boxDetailVo.imgUrl === '' ? require('../../../assets/images/noimg.jpg') : newVal.boxDetailVo.imgUrl
            this.uploadUrl = '/box/icon/upload.as?v=' + new Date().getTime()
            this.imgData = {
              name: 'imgFile',
              mac: newVal.boxDetailVo.mac,
            }
          }

          // 线路详情图片信息
          if (newVal.addrDetailVo) {
            this.url = newVal.addrDetailVo.imgUrl === '' ? require('../../../assets/images/noimg.jpg') : newVal.addrDetailVo.imgUrl
            this.IoMac = newVal.addrDetailVo.mac
            this.IoAddr = newVal.addrDetailVo.addr
            this.uploadUrl = '/channel/img/upload.as?v=' + new Date().getTime()
            this.imgData = {
              name: 'imgFile',
              mac: newVal.addrDetailVo.mac,
              uploadType: 1,
              addr: newVal.addrDetailVo.addr,
            }
          }
          // 808详情页面信息
          if (newVal.digitalIn || newVal.digitalOut || newVal.analogIn) {
            this.url = newVal.imgUrl === '' ? require('../../../assets/images/noimg.jpg') : newVal.imgUrl
            this.uploadUrl = '/channel/img/upload.as?v=' + new Date().getTime()
            this.imgData = {
              name: 'imgFile',
              mac: this.IoMac,
              addr: this.IoAddr,
              uploadType: 2,
              digitalType: newVal.digitalIn ? 1 : newVal.digitalOut ? 2 : 3,
              port: this.digitalOut ? this.digitalOut : this.details.digitalOut,
            }
          }
          this.digital = newVal.digitalIn ? newVal.digitalIn : newVal.digitalOut ? newVal.digitalOut : ''
          this.maclineData = newVal.boxDetailVo ? newVal.boxDetailVo : newVal.addrDetailVo
          this.options = {
            data: newVal.digitalIn ? newVal.digitalIn.list : newVal.digitalOut ? newVal.digitalOut.list : '',
            time: newVal.xAxis,
          }
          this.analogInoptions = {
            ext: newVal.analogIn.ext,
            org: newVal.analogIn.org,
            options: {
              xAxis: newVal.xAxis,
              series: [
                { name: `${this.$t('analogInput')}${this.$t('acquisition')}`, type: 'line', data: newVal.analogIn.org.list, smooth: true, color: '#007EFF', showAllSymbol: true, symbolSize: 2 },
                { name: `${this.$t('analogInput')}${this.$t('displayValue')}`, type: 'line', data: newVal.analogIn.ext.list, smooth: true, color: '#0DD667', showAllSymbol: true, symbolSize: 2 },
              ],
              title: { show: true, text: '' },
              grid: 40,
              legendDisplay: false,
              splitLine: true,
              time: true,
              height: '213px',
            },
          }
        },
      },

      details: {
        handler(newVal, oldVal) {
          this.handleUnhandledalarmTotal()
          this.handletodayalarmTotal()
          if (newVal.digitalOut) {
            this.digitalOut = newVal.digitalOut
          }
          if (newVal.mac === undefined && newVal.addr === undefined && newVal.digitalOut === undefined) {
            // this.handleDetaliMap()
          }
          if (newVal.mac !== undefined && newVal.addr === undefined) {
            this.handleBoxOrAddrDetailAlarm()
          }
          if (newVal.mac !== undefined && newVal.addr !== undefined) {
            this.handleBoxOrAddrDetailAlarm()
          }
        },
      },
    },
  }
</script>
<style lang="less">
  .topoDetails {
    position: relative;
    .BtnList {
      display: flex;
      position: absolute;
      right: 10px;
      top: 10px;
      .Button {
        height: 36px;
        color: #007eff;
        border: 1px solid #007eff;
        background-color: #1a202e;
        margin-right: 10px;
      }
    }
    .content {
      padding: 30px;
      .header {
        display: flex;
        .state {
          display: flex;
          .online {
            margin-right: 10px;
          }
        }
        .title {
        }
      }
      .details {
        width: 100%;
        display: flex;
        margin-top: 40px;
        .img {
          width: 100px;
          img {
            width: 100%;
          }
        }
      }
      #container {
        width: 100%;
        height: 300px;
        margin-top: 30px;
      }
    }
    .digital {
      font-size: 24px;
      .totalTime {
        margin-left: 30px;
        span {
          font-size: 20px;
        }
        .common {
          margin-right: 50px;
        }
      }
    }
  }
</style>
