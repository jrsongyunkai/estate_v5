<template>
  <div class="tree-item" v-if="!isEditing">
    <div class="tree-item-text" :title="name">
      <Icon custom="icon-v5 icon-v5-jiedian-01" />
      {{ name }}
    </div>
    <div class="tree-item-actions">
      <div @click.stop="$emit('addChild')">
        <Icon custom="icon-v5 icon-v5-tianjiaxiaji" />
        {{ $t('addSub') }}
      </div>
      <div @click.stop="startEdit" v-if="!readOnly">
        <Icon custom="icon-v5 icon-v5-xiugai" />
        {{ $t('edit') }}
      </div>
      <div @click.stop="$emit('delete')" v-if="!readOnly" style="color: #d70720">
        <Icon custom="icon-v5 icon-v5-lajitong" />
        {{ $t('deleteNode') }}
      </div>
    </div>
  </div>
  <div class="edit-input" v-else @click.stop>
    <Input v-model="text" :placeholder="$t('enterNodeName')" />
    <div class="actions">
      <span class="save" @click="$emit('saveEdit', text)">{{ $t('save') }}</span>
      <span class="cancel" @click="$emit('cancelEdit')">{{ $t('cancel') }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      readOnly: Boolean,
      isEditing: Boolean,
      name: String,
    },
    data() {
      return {
        text: '',
      }
    },
    methods: {
      startEdit() {
        this.text = this.name
        this.$emit('edit')
      },
    },
  }
</script>

<style lang="less" scoped>
  .tree-item {
    flex-grow: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    .tree-item-text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .ivu-icon {
        vertical-align: baseline;
      }
    }
    .tree-item-actions {
      flex-shrink: 0;
      margin-left: auto;
      display: flex;
      align-items: center;
      padding-left: 20px;
      color: #0076ff;
      > div:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
  .edit-input {
    flex-grow: 1;
    position: relative;
    .actions {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      display: flex;
      align-items: center;
      span {
        color: #0076ff;
        margin: 0 8px;
        &:last-child {
          color: #d70720;
        }
      }
    }
  }
</style>
