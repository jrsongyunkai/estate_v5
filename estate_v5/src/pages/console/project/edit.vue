<template>
  <div class="editCount">
    <h2>{{ $t('shortcuts') }}</h2>
    <div class="edit" @click="hanleedit">
      <Icon type="ios-create-outline" />
      {{ editText }}
    </div>
    <div class="functions_content">
      <ul style="display: flex">
        <li v-for="(item, index) in Querylist" :key="index">
          {{ item.name }}
        </li>
      </ul>
      <div class="add" v-show="edit" @click="handleAddEdit">
        <Icon type="md-add" />
        <span>{{ $t('add') }}</span>
      </div>
    </div>
    <!-- 新增常用功能弹框 -->
    <Modal :title="$t('addShortcut')" v-model="AddEdit" @on-ok="handleOk">
      <Tree :data="AddEditData" show-checkbox ref="tree" @on-check-change="choice"></Tree>
    </Modal>
  </div>
</template>
<script>
  import { getQueryFastMenus, getSaveFastMenus } from '@/api/console/project'
  export default {
    data() {
      return {
        subdata: [], // 用户半选和$t('system.Indeterminate')的数据
        power: [], // 用户$t('system.Indeterminate')的数据
        fastMenus: [
          // { name: '大屏首页',
          //   url: 'http://www.sndtest.com/screan',
          //   icon: 'i1'
          // }
        ],
      }
    },
    methods: {
      handleSaveFast() {
        let params = {
          fastMenus: JSON.stringify(this.fastMenus),
        }
        getSaveFastMenus(params).then(res => {})
        this.handleQueryFast()
      },
      handleQueryFast() {
        let params = {}
        getQueryFastMenus(params).then(res => {
          this.Querylist = res.data
        })
      },
      hanleedit() {
        this.edit = !this.edit
        if (this.edit === false) {
          this.editText = this.$t('edit')
        } else {
          this.editText = this.$t('save')
        }
      },
      handleAddEdit() {
        this.AddEdit = !this.AddEdit
      },
      choice() {
        this.choices = this.handleAddContent(this.$refs.tree.data)
        this.subdata = this.$refs.tree.getCheckedAndIndeterminateNodes()
        this.power = this.subdata.filter(item => {
          return !item.children // 因为filter只会返回true的布尔值，所以这里把没有子集的，也就是单个的权限返回出去，用this.power接收
        })
        for (let i = 0; i < this.choices[0].children.length; i++) {
          var arr = this.choices[0].children[i]
          for (var j = 0; j < arr.children.length; j++) {
            var arrs = arr.children[j]
            delete arrs.children
            delete arrs.expand
            this.fastMenus.push(arrs)
          }
        }
      },
      handleAddContent(data) {
        let s = []
        if (data.children !== undefined) {
          for (let j = 0; j < data.children.length; j++) {
            if (data.children[j].checked === true || data.children[j].indeterminate === false) {
              // 用到了递归，checked ,indeterminate这两个属性是组件上提供的，
              // 在浏览器上调试时可见，这是所选控件有子集的时候，比如说方法下有望闻问切四个子集，这里是把半选的控件展示上去
              s.push({
                name: data.children[j].title,
                url: data.children[j].value,
                icon: data.children[j].selected,
                expand: true,
                children: this.handleAddContent(data.children[j]),
              })
            }
          }
        } else {
          for (let i = 0; i < data.length; i++) {
            if (data[i].checked || data[i].indeterminate) {
              s.push({
                name: data[i].title,
                expand: true,
                children: this.handleAddContent(data[i]),
              })
            }
          }
        }
        return s
      },
      handleOk() {
        this.handleSaveFast()
        this.handleQueryFast()
      },
    },
  }
</script>
<style lang="less" scoped>
  .functions_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h2 {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #fff;
    }
    .edit {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #f3f4f6;
      line-height: 40px;
    }
  }
  .functions_content {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    li,
    .add {
      width: 253px;
      height: 52px;
      margin: 10px 10px;
      background: #28313f;
      display: flex;
      align-items: center;
      border-radius: 4px;
      color: #fff;
      justify-content: center;
      cursor: pointer;
      &:hover {
        background: #007eff;
      }
      .ivu-icon {
        margin: 0 20px;
      }
    }
  }
</style>
