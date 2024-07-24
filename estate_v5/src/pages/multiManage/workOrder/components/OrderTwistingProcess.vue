<template>
  <div>
    <h3 class="title-info">
      <span class="blue-box"></span>
      {{ $t('workOrderTwistProcess') }}
    </h3>
    <div class="content-timeline">
      <Timeline>
        <TimelineItem v-for="(item, index) in orderData" :key="item.id">
          <div v-if="index === 0">{{ $t('InitiateWorkOrder') }}</div>
          <div v-else-if="index !== 0 && index + 1 === orderData.length">
            <Button class="addNode" @click="addNode('', 'add')">{{ $t('addNode') }}</Button>
          </div>
          <div v-else class="node-style">
            <div class="dis-flex">
              <Dropdown @on-click="selectTwisting($event, index)">
                <a href="javascript:void(0)">
                  {{ item.name }}
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem v-for="twist in twistList" :key="`twist${twist.value}`" :name="twist.value">{{ twist.label }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <TooltipVue :tooltipText="item.tooltipText" v-if="item.tooltipText"></TooltipVue>
            </div>
            <div>
              <span>{{ item.name }}:</span>
              <span>
                <Select v-model="item.value" class="w-280-ml" :max-tag-count="1" multiple filterable filter-by-label :placeholder="$t('selectedPersonChecked', { name: item.name })">
                  <Option v-for="item in staffList" :value="item.value" :key="item.value" :label="`${item.label}(${item.tel})`">{{ `${item.label}(${item.tel})` }}</Option>
                </Select>
              </span>
            </div>
            <div>
              <Icon custom="icon-v5 icon-v5-lajitong" class="delete-style" color="#b30a22" @click="deleteNode(index)"></Icon>
            </div>
          </div>
        </TimelineItem>
      </Timeline>
    </div>
  </div>
</template>

<script>
  import { getPrjStaffList } from '@/api/multiManage/workOrder'
  const toolTextConfig = {
    2: window.$t('checkedTip'),
    3: window.$t('processedTip'),
    4: window.$t('completeTip'),
    5: window.$t('checkAcceptanceTip'),
    6: window.$t('copyForTip'),
  }
  export default {
    data() {
      return {
        tooltipText: '3123131',
        orderData: [
          { name: '', tooltipText: '' },
          { name: this.$t('examine'), value: null, tooltipText: toolTextConfig[2], type: 2 },
          { name: '', tooltipText: '' },
        ],
        twistList: [
          { value: 2, label: this.$t('examine') },
          { value: 3, label: this.$t('handle') },
          { value: 4, label: this.$t('complete') },
          { value: 5, label: this.$t('checkAcceptance') },
          { value: 6, label: this.$t('copyFor') },
        ],
        staffList: [],
      }
    },
    mounted() {
      this.getStaffList()
    },
    methods: {
      selectTwisting(value, index) {
        this.orderData[index].name = this.twistList.find(item => item.value === value).label || ''
        this.orderData[index].tooltipText = toolTextConfig[value]
        this.orderData[index].type = value
      },
      async getStaffList() {
        const res = await getPrjStaffList({ projectCode: this.$store.state.projectCode })
        if (!res.success) return this.$Message.error(res.message)
        this.staffList = res.data.map(v => ({ ...v, value: v.staffId, label: v.realName, tel: v.tel }))
      },
      addNode() {
        this.orderData.splice(this.orderData.length - 1, 0, { name: '', value: null, type: '', tooltipText: '' })
      },
      deleteNode(index) {
        this.orderData.splice(index, 1)
      },
    },
  }
</script>

<style lang="less" scoped>
  .dis-flex {
    display: flex;
  }
  .w-280-ml {
    width: 280px;
    margin-left: 8px;
  }
  .title-info {
    margin: 20px;
    display: flex;
    color: #0372e5;
  }
  .delete-style {
    border: 1px solid #b30a22;
    padding: 2px;
    border-radius: 2px;
  }
  .blue-box {
    display: inline-block;
    width: 2px;
    height: 18px;
    margin-right: 8px;
    margin-top: 3px;
    background: #0372e5;
  }
  .addNode {
    width: 100%;
    background: rgba(2, 167, 240, 0.1);
    border: 1px dotted #02a7f0;
    color: #02a7f0;
  }
  .content-timeline {
    margin: 20px auto;
    width: 90%;
    /deep/ .ivu-timeline-item-tail {
      border-color: #2d8cf0;
    }
  }
  .node-style {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-top: -5px;
    background: #28303e;
    padding: 2px 10px;
  }
</style>
