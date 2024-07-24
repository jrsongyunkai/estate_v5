<template>
  <div>
    <div v-for="(item, index) in categoryList" :key="index">
      <div class="category-item" :class="currentClickCategory === item.id ? 'category-click' : 'category-item-bg'" @mouseenter="editCategoryItem(item)">
        <div>{{ item.categoryName }}</div>
        <div v-show="currentClickCategory === item.id">
          <i class="icon-v5 icon-v5-bianji ivu-mr-8" @click.stop="editCategoryName"></i>
          <i class="icon-v5 icon-v5-changyonggoupiaorenshanchu ivu-mr-8 red-color-category" @click.stop="deleteCategory(item)"></i>
        </div>
      </div>
      <div v-if="currentClickCategory === item.id && isEdit" class="add-category">
        <Input v-model="item.categoryName" :placeholder="$t('enterCategoryName')" class="category-name"></Input>
        <Button type="text" @click="emitEditCategory(item)" class="blue-color-category">{{ $t('confirm2') }}</Button>
        <Button type="text" @click="cancelEdit" class="red-color-category">{{ $t('cancel') }}</Button>
      </div>
    </div>
    <div v-if="isAddCategory" class="add-category">
      <Input v-model="categoryName" :placeholder="$t('enterCategoryName')" class="category-name"></Input>
      <Button type="text" @click="emitAddCategory" class="blue-color-category">{{ $t('confirm2') }}</Button>
      <Button type="text" @click="cancelAdd" class="red-color-category">{{ $t('cancel') }}</Button>
    </div>
    <Button type="primary" ghost class="w100" @click="openAddCategory">{{ $t('addCategory') }}</Button>
  </div>
</template>

<script>
  export default {
    props: {
      typeList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        categoryList: [],
        isAddCategory: false,
        categoryName: '',
        currentClickCategory: null,
        isEdit: false,
      }
    },
    watch: {
      typeList: {
        handler(newVal) {
          this.categoryList = newVal
        },
        deep: true,
      },
    },
    methods: {
      openAddCategory() {
        this.categoryName = ''
        this.isAddCategory = true
      },
      cancelAdd() {
        this.isAddCategory = false
      },
      editCategoryItem(item) {
        this.currentClickCategory = item.id
      },
      editCategoryName() {
        this.isEdit = true
      },
      cancelEdit() {
        this.isEdit = false
      },
      emitEditCategory(item) {
        this.$emit('editCategory', item)
        this.cancelEdit()
      },

      deleteCategory(item) {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('sureDeleteCurrentCategory'),
          onOk: () => this.$emit('deleteEmitCategory', item),
        })
      },
      emitAddCategory() {
        if (!this.categoryName) {
          return this.$Message.error(this.$t('enterCategoryName'))
        }
        this.$emit('addCategory', this.categoryName)
        this.cancelAdd()
      },
    },
  }
</script>

<style lang="less" scoped>
  .w100 {
    width: 100%;
  }
  .category-name {
    width: 355px;
  }
  .add-category {
    margin: 10px 10px 10px 0;
  }
  .category-item {
    width: 100%;
    height: 45px;
    padding: 10px 0 10px 15px;
    margin: 10px 20px 10px 0;
    display: flex;
    justify-content: space-between;
  }
  .category-item-bg {
    background: #272d39;
  }
  .category-click {
    background: #172e41;
    color: #02a7f0;
  }
  .blue-color-category {
    color: #007eff;
  }
  .red-color-category {
    color: #f56c6c;
  }
</style>
