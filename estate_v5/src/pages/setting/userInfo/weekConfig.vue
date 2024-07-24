<template>
  <div class="systemBody">
    <Col :span="24">
      <div class="title-tip">
        <Icon type="md-text" class="mesg-tip" style="margin-top: 5px" />
        <span>{{ $t('weekConfigTips') }}</span>
      </div>
    </Col>
    <div>
      <h3 style="padding: 20px 0">{{ $t('weeklyStart') }}</h3>
    </div>
    <div>
      <h5 style="padding: 20px 0; color: #dddddd">{{ $t('plsEweeklyStartDay') }}</h5>
    </div>
    <div style="display: flex">
      <div class="Calendar" :style="{ borderColor: firstColor ? '#007EFF' : '#3d3d41' }">
        <Calendar hide-type :first-day-of-week="weekFirstDay">
          <template slot-scope="" slot="header">
            <div style="display: flex">
              <div style="width: 180px">{{ $t('startingMonday') }}</div>
              <div>
                <Checkbox v-model="mondaySelect" @on-change="getWeekChange"></Checkbox>
              </div>
            </div>
          </template>
          <template slot-scope="" slot="month"></template>
        </Calendar>
      </div>
      <div class="Calendar mt" :style="{ borderColor: canerColor ? '#007EFF' : '#3d3d41' }">
        <Calendar hide-type :first-day-of-week="weekSecondDay">
          <template slot-scope="" slot="header">
            <div style="display: flex">
              <div style="width: 180px">{{ $t('fromSunday') }}</div>
              <div>
                <Checkbox v-model="singleSelect" @on-change="getColorChange"></Checkbox>
              </div>
            </div>
          </template>
          <template slot-scope="" slot="month"></template>
        </Calendar>
      </div>
    </div>
    <div style="margin-top: 20px">
      <Button type="primary" @click="saveConfig">{{ $t('save') }}</Button>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import { queryDateConfig, saveDateConfig } from '@/api/public'
  export default {
    data() {
      return {
        weekFirstDay: 1,
        weekSecondDay: 7,
        singleSelect: false,
        firstColor: false,
        canerColor: false,
        mondaySelect: false,
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        let parmars = { projectCode: this.$store.state.projectCode }
        queryDateConfig(parmars)
          .then(res => {
            if (res.success) {
              const weekday = res.data.weekFirstDay === `${this.weekFirstDay}`
              this.firstColor = !!weekday
              this.mondaySelect = !!weekday
              this.canerColor = !weekday
              this.singleSelect = !weekday
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      getColorChange(val) {
        this.canerColor = !!val
        if (val) {
          this.mondaySelect = false
          this.firstColor = false
        }
      },
      getWeekChange(val) {
        this.firstColor = !!val
        if (val) {
          this.singleSelect = false
          this.canerColor = false
        }
      },
      saveConfig() {
        store.commit('mondaySelect', this.mondaySelect)
        let parmars = {
          projectCode: this.$store.state.projectCode,
          weekFirstDay: this.mondaySelect ? 1 : 7,
        }

        saveDateConfig(parmars)
          .then(res => {
            if (res.success) {
              this.$Message.success({
                content: this.$t('savedSuccessfully'),
              })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  .title-tip {
    display: flex;

    background: rgba(153, 153, 153, 0.05);
    color: #999999;
    border: 1px solid #888b92;
    padding: 10px 10px;
  }
  .Calendar {
    width: 220px;
    height: 285px;
    border-radius: 4px;
    border: 1px solid #3d3d41;
  }
  .mt {
    margin-left: 50px;
  }
  /deep/.ivu-calendar-table-day {
    height: 10%;
  }
  /deep/.ivu-calendar-table thead th {
    padding-top: 5px;
  }
  /deep/.ivu-calendar-table thead th:first-child {
    background-color: #007eff;
  }
</style>
