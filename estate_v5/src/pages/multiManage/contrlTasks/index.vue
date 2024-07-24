<template>
  <div id="contick">
    <div class="top">
      <Input v-model="params.taskName" :placeholder="$t('pleaseEnterTaskName')" class="inp" style="margin-left: 20px; width: 200px" @on-enter="serach(params.taskName)" />

      <DatePicker type="date" :placeholder="$t('pleaseSelectTime')" class="inp" @on-change="changedate" v-model="date" :editable="false" style="width: 200px" :clearable="false"></DatePicker>

      <Select v-model="model1" :clearable="true" style="width: 200px" class="inp" @on-change="changetype" :placeholder="$t('pleaseChooseTaskType')">
        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button class="button" @click="getworkList">{{ $t('query') }}</Button>
      <Button class="button1" @click="result">{{ $t('reset') }}</Button>
    </div>
    <!-- <br> -->
    <div style="background: #1a202e; margin-top: 10px; padding: 20px; height: 685px">
      <div class="h2">
        <h3>
          {{ $t('contrlTaskList') }}
        </h3>
      </div>
      <div class="table">
        <Table ref="currentRowTable" :columns="columns3" :data="data1" :disabled-hover="true" :height="520">
          <template slot="active" slot-scope="{ row }">
            <span style="color: #007eff; cursor: pointer" @click="check(row)">
              {{ $t('view') }}
            </span>
          </template>
          <template slot="action" slot-scope="{ row }">
            <span v-if="row.action === $t('closing')" style="color: #21f27f">
              {{ row.action }}
            </span>
            <span v-else-if="row.action === $t('opening')" style="color: #f24e4c">
              {{ row.action }}
            </span>
            <span v-else>
              {{ row.action }}
            </span>
          </template>
        </Table>
        <div style="float: right; margin-top: 10px">
          <Page show-total :current="page" @on-change="changePage" @on-page-size-change="changesize" :total="total" show-elevator />
        </div>
      </div>
    </div>
    <linkageScene :id="id" ref="linkageStatus"></linkageScene>
    <builtInTimer :id="id1" ref="builtInTimer"></builtInTimer>
    <sceneControl :id="id2" ref="sceneControl"></sceneControl>
    <latlongTimer :id="id3" ref="latlongTimer"></latlongTimer>
  </div>
</template>
<script>
  import { typeList, workList } from '@/api/multiManage/contrlTasks.js'
  import linkageScene from './linkageScene.vue'
  import sceneControl from './sceneControl.vue'
  import builtInTimer from './builtInTimer.vue'
  import latlongTimer from './latlongTimer.vue'
  export default {
    name: 'multiManage-contrlTasks',
    data() {
      return {
        cityList: [
          {
            value: '',
            label: this.$t('all'),
          },
        ],
        model1: '',
        columns3: [
          { key: 'number', width: 100, title: this.$t('index'), align: 'center' },
          { title: this.$t('taskName'), key: 'taskName', align: 'center' },
          { title: this.$t('taskType'), key: 'taskTypeDesc', align: 'center' },
          { title: this.$t('action'), key: 'action', align: 'center', slot: 'action' },
          { title: this.$t('executionTime'), key: 'execTime', align: 'center' },
          { title: this.$t('operation'), align: 'center', slot: 'active' },
        ],
        data1: [],
        params: {
          projectCode: this.$store.state.projectCode,
          taskType: '', // 任务类型，从控制任务列表接口返回的type取值
          taskName: '', // 任务名称（搜索）
          execTime: '', // 执行时间（条件筛选）
          pageNo: '1', // 页码，默认=1
          pageSize: '10', // 每页记录数，默认=20
        },
        value: '',
        date: '',
        total: 0,
        page: 1,
        id: null,
        id1: null,
        id2: null,
        id3: null,
      }
    },
    methods: {
      init() {
        this.gettypeList()
        this.getworkList()
      },
      change(e) {},
      gettypeList() {
        // 获取类型的列表
        typeList().then(res => {
          res.data.forEach(item => {
            let obj = {
              value: item.taskType,
              label: item.taskTypeDesc,
            }
            this.cityList.push(obj)
          })
        })
      },
      getworkList() {
        workList(this.params).then(res => {
          this.total = res.total
          this.page = res.page
          this.data1 = res.datas
          for (let i = 0; i < this.data1.length; i++) {
            this.data1[i].number = i + 1 + (this.params.pageNo - 1) * this.params.pageSize
          }
        })
      },
      serach(e) {
        this.params.taskName = e
      },
      changedate(e) {
        this.params.execTime = e
      },
      changetype(e) {
        this.params.taskType = e
      },
      changePage(e) {
        this.params.pageNo = e
        this.getworkList()
      },
      changesize(e) {
        this.params.pageSize = e
        this.getworkList()
      },
      result() {
        this.params = {
          projectCode: this.$store.state.projectCode,
          taskType: '', // 任务类型，从控制任务列表接口返回的type取值
          taskName: '', // 任务名称（搜索）
          execTime: '', // 执行时间（条件筛选）
          pageNo: '1', // 页码，默认=1
          pageSize: '10', // 每页记录数，默认=20
        }
        this.value = ''
        this.date = ''
        this.model1 = ''
        this.getworkList()
      },
      check(row) {
        if (row.taskType === 10) {
          this.id2 = '100' + row.id
          this.$refs.sceneControl.handleViewScene()
        } else if (row.taskType === 1) {
          this.id1 = row.id
          this.$refs.builtInTimer.handleEdit()
        } else if (row.taskType === 20) {
          this.id = row.id
          this.$refs.linkageStatus.handleViewScene()
        } else {
          this.id3 = row.id
          this.$refs.latlongTimer.handleEdit()
        }
      },
    },
    created() {
      this.init()
    },
    components: {
      linkageScene,
      builtInTimer,
      sceneControl,
      latlongTimer,
    },
  }
</script>
<style lang="less" scoped>
  #contick {
    .top {
      margin-top: 70px;
      overflow: hidden;
      background: #1a202e;
      height: 52px;
      line-height: 52px;
      .inp {
        width: 260px;
        height: 32px;
        margin-left: 10px;
      }
      span {
        margin-left: 30px;
        margin-right: 10px;
      }
      .button {
        border-radius: 5px;
        min-width: 60px;
        height: 32px;
        color: #fff;
        // line-height: 20px;
        margin-left: 10px;
        // margin-top: 10px;
        // float: left;
        border: none;
        background-color: #007eff;
      }
      .button1 {
        min-width: 60px;
        height: 32px;
        margin-left: 10px;
      }
    }
    .h2 {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      justify-content: space-between;
      span {
        font-size: 16px;
      }
    }
  }
  /deep/::-webkit-scrollbar {
    width: 6px; //竖轴宽度
    height: 6px; //横轴宽度
    // background-color: rgba(99, 110, 246, 0.5);
  }

  /* 滚动槽 */
  /deep/::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  /deep/::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }
</style>
