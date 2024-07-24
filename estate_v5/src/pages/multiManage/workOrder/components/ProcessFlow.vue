<template>
  <div class="right-info">
    <h3 class="title-info">
      <span class="blue-box"></span>
      {{ $t('handleFlow') }}
    </h3>
    <div class="content-flow">
      <div class="custom-time-line">
        <Timeline>
          <TimelineItem v-for="(item, ids) in handleLogList" :key="ids" :color="statusConfig[item.status]" :class="`custom-${statusConfig[item.status]}`">
            <div v-if="item.type === 1">
              <div>{{ $t('workOrderInitiation') }}</div>
              <div>{{ $t('initiationTime') }}：{{ item.createTime }}</div>
            </div>
            <div v-if="item.type === 2">
              <!-- 审核 -->
              <div>
                {{ $t('examine') }}：{{ (item.otherData && auditingConfig[item.otherData.status]) || '' }}
                <!-- 显示是否逾期 -->
                <span v-if="[1, 2].includes(item.status)" class="default-box ml-8" :class="item.status === 2 ? 'r-color' : 'g-color'">{{ processConfig[item.status] }}</span>
              </div>
              <div>{{ $t('examineTime') }}：{{ item.createTime }}</div>
              <div>
                {{ $t('operator') }}：
                <span v-for="(itm, idx) in item.staffInfoList" :key="`staffId${idx}`" class="ml-8">{{ showTelAndUser(itm) }}</span>
              </div>
              <div>{{ $t('examineInfo') }}：{{ item.content }}</div>
            </div>
            <div v-if="item.type === 3">
              <!-- 处理 -->
              <div>
                {{ $t('handle') }}
                <!-- 显示是否逾期 -->
                <span v-if="[1, 2].includes(item.status)" class="default-box ml-8" :class="item.status === 2 ? 'r-color' : 'g-color'">{{ processConfig[item.status] }}</span>
              </div>
              <div>{{ $t('handleTime') }}：{{ item.createTime }}</div>
              <div>
                {{ $t('operator') }}：
                <span v-for="(itm, idx) in item.staffInfoList" :key="idx" class="ml-8">{{ showTelAndUser(itm) }}</span>
              </div>
              <div>{{ $t('handleContent') }}：{{ item.content }}</div>
              <div class="mt-10">
                <span>{{ $t('processingBeforeImg') }}：</span>
                <el-image
                  v-for="(itm, index) in imgSplit(item.otherData && item.otherData.beforeImgs ? item.otherData.beforeImgs : '')"
                  :key="index"
                  :src="itm"
                  class="ml-8 process-img"
                  :preview-src-list="imgSplit(item.otherData && item.otherData.beforeImgs ? item.otherData.beforeImgs : '')"></el-image>
              </div>
              <div class="mt-10">
                <span>{{ $t('processingAfterImg') }}：</span>
                <el-image v-for="(itm, index) in imgSplit(item.otherData && item.otherData.afterImgs ? item.otherData.afterImgs : '')" :key="index" :src="itm" class="ml-8 process-img" :preview-src-list="imgSplit(item.otherData && item.otherData.afterImgs ? item.otherData.afterImgs : '')"></el-image>
              </div>
              <div class="dis-flex">
                <span class="text-label">{{ $t('enclosure') }}：</span>
                <div class="file-box" v-if="item.otherData && item.otherData.files">
                  <div>
                    <img :src="fileType(item.otherData.files)" alt="" class="img-style" />
                  </div>
                  <div class="center-box">
                    <div class="mt--20 ellipsis-box" :title="item.otherData.fileNames">{{ item.otherData.fileNames }}</div>
                    <div class="text-height">{{ item.otherData.fileSizes || '' }}</div>
                  </div>
                  <div class="load-icon">
                    <a :href="item.otherData.files" download><Icon custom="icon-v5 icon-v5-xiazai" size="22" color="#E03C3A" /></a>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.type === 4">
              <!-- 完成 -->
              <div>
                {{ $t('complete') }}：{{ (item.otherData && completeConfig[item.otherData.status]) || '' }}
                <!-- 显示是否逾期 -->
                <span v-if="[1, 2].includes(item.status)" class="default-box ml-8" :class="item.status === 2 ? 'r-color' : 'g-color'">{{ processConfig[item.status] }}</span>
              </div>
              <div>{{ $t('completeTime') }}：{{ item.createTime }}</div>
              <div>
                {{ $t('operator') }}：
                <span v-for="(itm, index) in item.staffInfoList" :key="index" class="ml-8">{{ showTelAndUser(itm) }}</span>
              </div>
              <div>{{ $t('completeDetail') }}：{{ item.content }}</div>
            </div>
            <div v-if="item.type === 5">
              <!-- $t('checkAcceptance') -->
              <div>
                {{ $t('checkAcceptance') }}：{{ (item.otherData && auditingConfig[item.otherData.status]) || '' }}
                <!-- 显示是否逾期 -->
                <span v-if="[1, 2].includes(item.status)" class="default-box ml-8" :class="item.status === 2 ? 'r-color' : 'g-color'">{{ processConfig[item.status] }}</span>
              </div>
              <div>{{ $t('checkAcceptanceTime') }}：{{ item.createTime }}</div>
              <div>
                {{ $t('operator') }}：
                <span v-for="(itm, index) in item.staffInfoList" :key="index" class="ml-8">{{ showTelAndUser(itm) }}</span>
              </div>
              <div>{{ $t('examineInfo') }}：{{ item.content }}</div>
            </div>
            <div v-if="item.type === 6">
              <!--抄送 -->
              <div>
                {{ $t('copyFor') }}
                <!-- 显示是否逾期 -->
                <span v-if="[1, 2].includes(item.status)" class="default-box ml-8" :class="item.status === 2 ? 'r-color' : 'g-color'">{{ processConfig[item.status] }}</span>
              </div>
              <div>{{ $t('copyForTime') }}：{{ item.createTime }}</div>
              <div>
                {{ $t('copyForPerson') }}：
                <span v-for="(itm, index) in item.staffInfoList" :key="index" class="ml-8 box-people">{{ showTelAndUser(itm) }}</span>
              </div>
            </div>
            <div v-if="item.type === 7">
              <div>{{ $t('revoke') }}</div>
              <div>{{ $t('revokeTime') }}:{{ item.createTime }}</div>
              <div>
                {{ $t('operator') }}：
                <span v-for="(itm, index) in item.staffInfoList" :key="index" class="ml-8 box-people">{{ showTelAndUser(itm) }}</span>
              </div>
            </div>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script>
  import { fileTypeList } from '../maintenanceOrder'
  const auditingConfig = {
    1: window.$t('adopt'),
    2: window.$t('reject'),
  }
  const completeConfig = {
    1: window.$t('rectified'),
    2: window.$t('ignore'),
    3: window.$t('wrongAlarm'),
    4: window.$t('repeat'),
    5: window.$t('delayHandle'),
  }
  const processConfig = {
    1: window.$t('notOverdue'),
    2: window.$t('overdue1'),
    3: window.$t('notProcessed'),
  }
  export default {
    props: {
      logList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        processConfig,
        auditingConfig,
        completeConfig,
        statusConfig: {
          0: 'blue',
          1: 'green',
          2: 'red',
          3: 'gray',
        },
        handleLogList: [
          { flowStatus: '0', type: null },
          { flowStatus: '1', type: 2 },
          { flowStatus: '2', type: 3 },
          { flowStatus: '2', type: 4 },
          { flowStatus: '3', type: 5 },
          { flowStatus: '3', type: 6 },
        ],
      }
    },
    mounted() {
      this.$nextTick(() => {
        document.getElementsByClassName('custom-time-line')[0].scrollIntoView({ behavior: 'instant', block: 'end', inline: 'end' })
      })
    },
    watch: {
      logList: {
        handler(val) {
          this.handleLogList = val
        },
      },
    },
    methods: {
      showTelAndUser(item) {
        const staffAccount = item.staffAccount ? `(${item.staffAccount})` : ''
        const staffTel = item.staffTel ? `(${item.staffTel})` : ''
        return `${item.staffName || ''}${item.platformType === 2 ? staffTel : staffAccount}`
      },
      fileType(type) {
        const findType = fileTypeList.find(v => type.includes(v.type))
        return findType ? findType.img : ''
      },
      imgSplit(val) {
        if (!val) return []
        return val.split(',')
      },
    },
  }
</script>

<style lang="less" scoped>
  .ellipsis-box {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .center-box {
    width: 82%;
  }
  .text-label {
    flex-shrink: 0;
  }
  .mt-10 {
    margin-top: 10px;
  }
  .process-img {
    display: inline-block;
    width: 60px;
    height: 60px;
    vertical-align: top;
  }
  .head-flex {
    display: flex;
    justify-content: space-between;
  }
  .content-flow {
    height: ~'calc(100vh - 270px)';
    overflow: auto;
  }
  .right-info {
    height: 100%;
  }
  .g-color {
    color: #21f27f;
    background: rgba(33, 242, 127, 0.1);
  }
  .r-color {
    color: #f56c6c;
    background: rgba(255, 79, 79, 0.15);
  }
  .warn-color {
    background: #443630;
    color: #e6a23c;
  }
  .default-box {
    padding: 3px 5px;
  }
  .box-people {
    border: 1px solid #797979;
    padding: 1px 4px;
  }
  .file-box {
    display: flex;
    height: 80px;
    background: #28303e;
    width: 100%;
    align-items: center;
  }
  .text-height {
    line-height: 16px;
    height: 16px;
    color: #999;
  }
  .img-style {
    width: 25px;
    height: 25px;
    margin: 0 15px;
  }
  .title-info {
    padding: 20px;
    display: flex;
    color: #0372e5;
  }
  .dis-flex {
    display: flex;
  }
  .ml-8 {
    margin-left: 8px;
  }
  .blue-box {
    display: inline-block;
    width: 2px;
    height: 18px;
    margin-right: 8px;
    margin-top: 3px;
    background: #0372e5;
  }
  .custom-time-line {
    width: 80%;
    margin: 10px auto;
  }
  .custom-blue /deep/ .ivu-timeline-item-tail {
    border-color: #2d8cf0 !important; /* 蓝色节点的连线颜色 */
  }

  .custom-green/deep/ .ivu-timeline-item-tail {
    border-color: #19be6b !important; /* 绿色节点的连线颜色 */
  }

  .custom-red /deep/ .ivu-timeline-item-tail {
    border-color: #ed4014 !important; /* 红色节点的连线颜色 */
  }
</style>
