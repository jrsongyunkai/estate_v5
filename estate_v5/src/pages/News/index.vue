<template>
  <div style="display: flex">
    <div class="allNews">
      <div>
        <h3>{{ $t('message') }}</h3>
        <p @click="handelSelected(0)" :class="params.msgType === '' ? 'blue' : 'white'">
          {{ $t('allMessage') }}
        </p>
        <p @click="handelSelected(1)" :class="params.msgType === 1 ? 'blue' : 'white'">
          {{ $t('systemAnnouncement') }}
        </p>
      </div>
    </div>
    <div style="width: 100%">
      <div class="search">
        <span style="font-size: 14px; cursor: pointer; margin-left: 20px" @click="$router.push(pathUrl)">{{ $t('back') }}</span>
        <span style="font-size: 14px; margin-left: 3px">>&nbsp;{{ $t('message') }}</span>
        <Button @click="reset" style="color: #fff; margin-left: 10px; float: right; margin-right: 20px; margin-top: 13px">{{ $t('reset') }}</Button>
        <Button type="primary" @click="changestate(model1)" style="background: #007eff; border: none; margin-left: 10px; float: right; margin-top: 13px">{{ $t('query') }}</Button>
        <Select v-model="model1" style="width: 260px; margin-left: 10px; float: right; margin-top: 13px">
          <Option v-for="item in cityList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <main>
        <List v-for="(item, index) in tableData" :key="item.id" :border="tableData.length !== 0 ? true : false" class="list">
          <div @click.stop="handleClick(item)" class="light" v-if="tableData.length !== 0">
            <p v-show="!item.isRead"></p>
            <ListItem>
              <ListItemMeta :title="item.title" :description="item.content" />
              <template slot="action">
                <li>
                  <span>{{ item.createTime }}</span>
                  <Button type="text" @click="deletes(item, index)" style="color: #f24e4c">
                    {{ $t('delete') }}
                  </Button>
                </li>
              </template>
            </ListItem>
          </div>
        </List>
        <div class="nodata" v-if="tableData.length === 0">{{ $t('noData') }}</div>
        <div class="btn">
          <Select style="width: 100px" @on-change="changepagenum" :placeholder="$t('tenpage')">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          &nbsp;
          <Button @click="handlecurrentPage('home')">{{ $t('home') }}</Button>
          &nbsp;
          <Button :disabled="currentPage === 1" @click="handlecurrentPage('prev')">{{ $t('prev') }}</Button>
          &nbsp;
          <Button @click="handlecurrentPage('next')" :disabled="tableData.length !== params.pageSize">{{ $t('next') }}</Button>
          &nbsp;
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import { pageInfoById, delNewsStatus, updateReadStatus } from '@/api/public'
  export default {
    data() {
      return {
        tableData: [],
        lastId: '',
        currentPage: 1,
        params: {
          msgId: '',
          isRead: '',
          msgType: '',
          pageSize: 10,
        },
        cityList: [
          { value: 10, label: this.$t('tenpage') },
          { value: 20, label: this.$t('twenpage') },
          { value: 50, label: this.$t('fwenpage') },
        ],
        cityList1: [
          { value: '', label: this.$t('all') },
          { value: 0, label: this.$t('unread') },
          { value: 1, label: this.$t('read') },
        ],
        model1: '',
        pageData: [],
        pathUrl: '',
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.fullPath === '/') {
          vm.pathUrl = 'visualScreen'
        } else if (from.fullPath === '/news') {
          vm.pathUrl = 'visualScreen'
        } else {
          vm.pathUrl = from.fullPath
        }
      })
    },
    methods: {
      init() {
        this.getlistData()
      },
      getlistData() {
        pageInfoById(this.params).then(res => {
          if (res.success) {
            this.tableData = res.data
            this.lastId = res.lastId
          } else if (res.code === '-1') {
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      deletes(item, index) {
        let parmas = { careId: item.careId }
        delNewsStatus(parmas).then(res => {
          if (res.success) {
            this.$Message.success(res.message)
            this.tableData.splice(index, 1)
          } else if (res.code === '-1') {
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      handleClick(row) {
        if (row.isRead === 1) {
          return false
        }
        updateReadStatus({ careId: row.careId }).then(res => {
          if (res.success) {
            this.$Message.success(res.message)
            row.isRead = 1
          } else if (res.code === '-1') {
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      changepagenum(e) {
        this.params.pageSize = e
        this.getlistData()
      },
      handlecurrentPage(e) {
        if (e === 'home') {
          this.currentPage = 1
          this.pageData = []
          this.params.msgId = ''
        } else if (e === 'prev') {
          if (this.currentPage !== 1) {
            this.currentPage -= 1
            this.pageData.pop()
            this.params.msgId = this.pageData[this.pageData.length - 1]
          } else {
            return false
          }
        } else if (e === 'next') {
          this.currentPage += 1
          this.pageData.push(this.lastId)
          this.params.msgId = this.lastId
        }
        this.getlistData()
      },
      changestate(e) {
        this.params.isRead = e
        this.getlistData()
      },
      handelSelected(index) {
        this.params.msgType = index === 0 ? '' : 1
        this.handlecurrentPage('home')
      },
      // back () {
      //     this.$router.push('/console/project')
      // },
      reset() {
        this.model1 = ''
        this.params = {
          msgId: '',
          isRead: '',
          msgType: '',
          pageSize: 10,
        }
        this.currentPage = 1
        this.lastId = ''
        this.getlistData()
      },
    },
    mounted() {
      this.init()
    },
  }
</script>

<style lang="less" scoped>
  .ivu-theme-dark .ivu-list-item-action > li,
  .ivu-theme-dark .ivu-list-item-meta-description {
    color: #999 !important;
  }
  .allNews {
    margin-right: 10px;
    margin-left: 20px;
    span {
      color: #fff;
    }
    div {
      width: 244px;
      height: 220px;
      margin-top: 10px;
      background-color: #1a202e;
      h3 {
        height: 58px;
        line-height: 58px;
        font-weight: Regular;
        font-family: PingFangSC-Regular;
        padding-left: 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
    p {
      cursor: pointer;
      font-size: 14px;
      height: 56px;
      padding-left: 20px;
      line-height: 56px;
      font-weight: Regular;
      font-family: PingFangSC-Regular;
    }
    .blue {
      color: #007eff;
      background-color: rgba(88, 94, 110, 0.2);
    }
    .white {
      color: #585e6e;
    }
  }
  .search {
    background-color: #1a202e;
    height: 58px;
    line-height: 58px;
    margin-top: 10px;
    margin-right: 10px;
    span {
      margin-left: 70px;
    }
  }
  main {
    margin-right: 10px;

    margin-bottom: 100px;
    .list:hover {
      background-color: rgba(88, 94, 110, 0.5);
    }
    p {
      // float: left;
      position: relative;
      left: 12px;
      top: 27px;
      width: 6px;
      height: 6px;
      background-color: #409eff;
      border-radius: 50%;
      // margin: 20px;
      // margin-left: 50px;
    }
    .btn {
      text-align: right;
      margin-top: 20px;
      margin-bottom: 100px;
    }
    .nodata {
      height: 40px;
      font-size: 12px;
      text-align: center;
      line-height: 40px;
    }
    .list {
      background-color: #1a202e;
      margin-top: 10px;
      border: none;
      border-radius: 0;
    }
  }
</style>
