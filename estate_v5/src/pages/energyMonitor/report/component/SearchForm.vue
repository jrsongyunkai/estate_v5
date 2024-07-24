<template>
  <div>
    <Row class="section">
      <div class="sectionType">
        <Col class="type">
          <Input class="short-input" :placeholder="$t('powerPagePlaceholder1')" clearable style="width: 200px" v-model="inputVal"></Input>
        </Col>
        <Col class="type">
          <Select v-model="packetTypes" @on-change="handleTypes" style="width: 200px" :placeholder="$t('selectGroupingType')" :clearable="true">
            <Option v-for="item in packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
          </Select>
        </Col>
        <Col class="type">
          <TreeSelect :placeholder="$t('selectGroup')" multiple show-checkbox :max-tag-count="2" style="width: 240px" v-model="packetFilter" transfer :data="packetFilterList" />
        </Col>
        <Row class="dateGroup" v-width="110">
          <div class="dateBtn" v-for="(item, index) in dateTypesMaps" :key="index" :class="{ active: active === index }" @click="SelectDateType(index)">{{ item.name }}</div>
        </Row>
        <Col class="type" :class="{ monthDate: active }">
          <template v-if="active === 0">
            <DatePicker type="daterange" placement="bottom-end" format="yyyy-MM-dd" :placeholder="$t('selectStartTime')" v-width="200" :value="[startTime, endTime]" @on-change="handelDataPicker"></DatePicker>
          </template>
          <template v-else>
            <DatePicker :type="dateTypesMaps[active].value" :format="dateTypesMaps[active].format" :placeholder="dateTypesMaps[active].placeStart" v-width="100" @on-change="dateStartPicker" :value="startTime"></DatePicker>
            -
            <DatePicker :type="dateTypesMaps[active].value" :format="dateTypesMaps[active].format" :placeholder="dateTypesMaps[active].placeEnd" v-width="100" @on-change="dateEndPicker" :value="endTime"></DatePicker>
          </template>
        </Col>
        <Button type="primary" @click="handleOnSubmit" style="margin-left: 10px; background: #007eff">{{ $t('query') }}</Button>
        <Button @click="reset" style="margin: 0 10px">{{ $t('reset') }}</Button>
        <Dropdown trigger="click" @on-click="handleCommand">
          <Button>
            {{ $t('export') }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="current">{{ $t('exportCurrent') }}</DropdownItem>
            <DropdownItem name="currentSelect" v-if="selectList.length > 0">{{ $t('exportCurrentSelected') }}</DropdownItem>
            <DropdownItem name="currentAll">{{ $t('exportAll') }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div>
        <Button class="b-blue" @click="$refs.smoothModal.openModel()">{{ $t('hourlyPowerSmoothing') }}</Button>
        <Button class="b-blue" @click="$emit('correction')" style="margin-left: 10px">{{ $t('electricityCorrection') }}</Button>
      </div>
    </Row>
    <SmoothModal ref="smoothModal" />
  </div>
</template>

<script>
  import { getGroupType, getGroupTree } from '@/api/public'
  import SmoothModal from './SmoothModal.vue'
  export default {
    props: {
      selectList: { type: Array, default: () => [] },
    },
    components: {
      SmoothModal,
    },
    data() {
      return {
        inputVal: '',
        packetTypes: '',
        packetList: [],
        packetFilter: [],
        active: 0,
        packetFilterList: [],
        dateTypesMaps: [
          { name: this.$t('day'), value: 'day' },
          { name: this.$t('month'), value: 'month', format: 'yyyy-MM', placeStart: this.$t('startMonth'), placeEnd: this.$t('endMonth') },
          { name: this.$t('year'), value: 'year', format: 'yyyy', placeStart: this.$t('startYear'), placeEnd: this.$t('endYear') },
        ],
        startTime: this.$Date().add(-29, 'day').format('YYYY-MM-DD'),
        endTime: this.$Date().format('YYYY-MM-DD'),
        statsType: '2',
      }
    },
    computed: {
      queryParams() {
        return { projectCode: this.$store.state.projectCode, startTime: this.startTime, endTime: this.endTime, nodeId: this.packetFilter ? this.packetFilter.join() : this.packetFilter, mac: this.inputVal, name: this.inputVal, statsType: this.statsType }
      },
    },
    created() {
      this.getGroupTypes()
    },
    methods: {
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      dateStartPicker(v) {
        if (this.statsType === '3') {
          this.startTime = `${v}-01`
        } else {
          this.startTime = `${v}-01-01`
        }
      },
      dateEndPicker(v) {
        if (this.statsType === '3') {
          this.endTime = `${v}-01`
        } else {
          this.endTime = `${v}-01-01`
        }
      },
      handleOnSubmit() {
        this.$emit('querySubmit', this.queryParams)
      },
      reset() {
        this.inputVal = ''
        this.packetTypes = ''
        this.packetFilter = []
        this.active = 0
        this.startTime = this.$Date().add(-29, 'day').format('YYYY-MM-DD')
        this.endTime = this.$Date().format('YYYY-MM-DD')
        this.statsType = '2'
      },
      handleCommand(command) {
        this.$emit('handleCommand', command)
      },
      handelDataPicker(val) {
        this.startTime = val[0]
        this.endTime = val[1]
      },
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })
        return tree
      },
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = { id: item.id, value: item.id, parentId: item.parentId, title: item.name, expand: true, selected: false, checked: false }
            obj.children = this.getTree(item.children)
            arr.push(obj)
          })
        }
        return arr
      },
      SelectDateType(v) {
        this.active = v
        switch (v) {
          case 0:
            this.statsType = '2'
            this.startTime = this.$Date().add(-30, 'day').format('YYYY-MM-DD')
            this.endTime = this.$Date().format('YYYY-MM-DD')
            break
          case 1:
            this.statsType = '3'
            this.startTime = this.$Date().startOf('year').format('YYYY-MM-DD')
            this.endTime = this.$Date().format('YYYY-MM-DD')
            break
          default:
            this.statsType = '4'
            this.startTime = this.$Date().add(-2, 'year').startOf('year').format('YYYY-MM-DD')
            this.endTime = this.$Date().format('YYYY-MM-DD')
            break
        }
      },
      async getGroupTypes() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await getGroupType(params)
        if (res.success) {
          this.packetList = res && res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getGroupTrees() {
        if (!this.packetTypes) return
        const res = await getGroupTree({ groupId: this.packetTypes })
        if (res.success) {
          let resData = this.getTree(res.data)
          this.packetFilterList = this.cloneTree(resData)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      if (this.$route.params.mac) {
        this.inputVal = this.$route.params.mac
      } else if (this.$route.params.groupId) {
        this.packetTypes = +this.$route.params.groupId
        this.packetFilter = [Number(this.$route.params.nodeId)]
        this.getGroupTrees()
      }
      this.startTime = this.$route.params.timer ? this.$route.params.timer : this.$Date().add(-29, 'day').format('YYYY-MM-DD')
      this.endTime = this.$route.params.timer ? this.$route.params.timer : this.$Date().format('YYYY-MM-DD')
      this.$nextTick(() => {
        this.$emit('querySubmit', this.queryParams)
      })
    },
  }
</script>

<style lang="less" scoped>
  .section {
    background: #1a202e;
    padding: 20px;
    justify-content: space-between;
    .sectionType {
      display: flex;
      flex-wrap: wrap;
    }
    .type {
      margin-right: 10px;
    }
    .dateGroup {
      align-items: center;
      .dateBtn {
        padding: 0 8px;
        height: 30px;
        background: #1a202e;
        border: 1px solid #535b6c;
        border-radius: 5px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: #666666;
        cursor: pointer;
        margin-right: 5px;
      }
      .active {
        background: rgba(0, 126, 255, 0.2);
        border: 1px solid #007eff;
        color: #007eff;
      }
    }
    .monthDate {
      background: #1a202e;
      border: 1px solid #535b6c;
      border-radius: 5px;
      height: 32px;
      min-width: 220px;
      /deep/ input {
        height: 28px;
      }
      /deep/ .ivu-icon-ios-calendar-outline:before {
        content: '';
      }
      /deep/ .ivu-input {
        border-color: transparent;
        padding: 0;
        text-align: center;
      }
      /deep/ .ivu-input-suffix {
        width: 0;
        right: 20px;
      }
    }
  }
</style>
