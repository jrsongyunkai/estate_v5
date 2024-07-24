<!-- eslint-disable vue/valid-v-on -->
<template>
  <div class="event-props">
    <Button @click="addEventConfig" type="primary" class="add-event">{{ $t('addEvent') }}</Button>
    <Collapse simple>
      <Panel :name="item.name + index" v-for="(item, index) in eventPool" :key="index">
        <div class="collapse-title">
          <span>{{ `${$t('event')}${index + 1}` }}</span>
          <Icon custom="icon-v5 icon-v5-lajitong" @click="() => removeEventConfig(index)" />
        </div>
        <template #content>
          <Form label-position="left" :label-width="80">
            <FormItem :label="$t('eventType')">
              <Select v-model="item.name" :placeholder="$t('pleaseSelectEventType')">
                <Option v-for="e in eventType" :key="e.event" :label="e.name" :value="e.event"></Option>
              </Select>
            </FormItem>
            <!--行为类型-->
            <FormItem :label="$t('behaviorType')">
              <Select v-model="item.action" :placeholder="$t('selectBehaviorType')" @on-change="actionChange(item)">
                <Option v-for="i in eventBehavior" :key="i.behavior" :label="i.name" :value="i.behavior"></Option>
              </Select>
            </FormItem>
            <!--事件类型依赖表单-->
            <FormItem :label="dep.name" v-for="(dep, i) in eventBehaviorMap[item.action]" :key="i">
              <Input v-model="item[dep.bindProp]" v-if="dep.type === 'input'" :placeholder="(dep.option && dep.option.placeholder) || $t('pleaseEnter')" :type="(dep.option && dep.option.type) || 'text'" />
              <Select v-else-if="dep.type === 'select'" v-model="item[dep.bindProp]" :placeholder="dep.option.placeholder">
                <Option v-for="item in dep.option.list" :key="item.value" :label="item.name" :value="item.value" :disabled="item.disabled"></Option>
              </Select>
            </FormItem>
          </Form>
        </template>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
  import { EventAction } from '@meta2d/core'
  export default {
    props: { activePen: { type: Object, default: () => {} } },
    data() {
      return {
        eventPool: [],
        eventType: [
          { name: this.$t('ns_eventType.enter'), event: 'enter' },
          { name: this.$t('ns_eventType.leave'), event: 'leave' },
          { name: this.$t('ns_eventType.active'), event: 'active' },
          { name: this.$t('ns_eventType.inactive'), event: 'inactive' },
          { name: this.$t('ns_eventType.click'), event: 'click' },
          { name: this.$t('ns_eventType.dbclick'), event: 'dbclick' },
        ],
        eventBehavior: [
          {
            name: this.$t('openLink'),
            behavior: EventAction.Link,
            depend: [
              { name: this.$t('linkUrl'), type: 'input', bindProp: 'value', option: { placeholder: 'URL' } },
              {
                name: this.$t('openFunciton'),
                type: 'select',
                bindProp: 'params',
                option: {
                  list: [
                    { name: this.$t('newWindow'), value: '_blank' },
                    { name: this.$t('overwriteCurrentPage'), value: 'self' },
                  ],
                },
              },
            ],
          },
          {
            name: this.$t('ns_eventBehavior.startAnimate'),
            behavior: EventAction.StartAnimate,
            depend: [{ name: this.$t('target_IDAndRag'), type: 'input', bindProp: 'value', option: { placeholder: 'id/tag' } }],
          },
          {
            name: this.$t('pauseAnimation'),
            behavior: EventAction.PauseAnimate,
            depend: [{ name: this.$t('target_IDAndRag'), type: 'input', bindProp: 'value', option: { placeholder: 'id/tag' } }],
          },
          {
            name: this.$t('stopAnimation'),
            behavior: EventAction.StopAnimate,
            depend: [{ name: this.$t('target_IDAndRag'), type: 'input', bindProp: 'value', option: { placeholder: 'id/tag' } }],
          },
          {
            name: this.$t('ns_eventBehavior.startVideo'),
            behavior: EventAction.StartVideo,
            depend: [{ name: this.$t('target_IDAndRag'), type: 'input', bindProp: 'value', option: { placeholder: 'id/tag' } }],
          },
          {
            name: this.$t('ns_eventBehavior.pauseVideo'),
            behavior: EventAction.PauseVideo,
            depend: [{ name: this.$t('target_IDAndRag'), type: 'input', bindProp: 'value', option: { placeholder: 'id/tag' } }],
          },
          {
            name: this.$t('ns_eventBehavior.stopVideo'),
            behavior: EventAction.StopVideo,
            depend: [{ name: this.$t('target_IDAndRag'), type: 'input', bindProp: 'value', option: { placeholder: 'id/tag' } }],
          },
          {
            name: '执行全局函数',
            behavior: EventAction.GlobalFn,
            depend: [
              { name: '全局函数名', type: 'input', bindProp: 'value', option: { placeholder: '全局函数名' } },
              { name: '函数参数', type: 'input', bindProp: 'params', option: { placeholder: '' } },
            ],
          },
        ],
      }
    },
    computed: {
      eventBehaviorMap() {
        return this.eventBehavior.reduce((pre, cur) => {
          pre[cur.behavior] = cur.depend
          return pre
        }, {})
      },
    },
    methods: {
      actionChange(item) {
        item.value = ''
        item.params = ''
      },
      addEventConfig() {
        this.eventPool = [...this.eventPool, { name: '', action: '', value: '', params: '' }]
      },
      removeEventConfig(i) {
        this.eventPool.splice(i, 1)
      },
      syncEvent() {
        window.meta2d.setValue({ id: this.activePen.id, events: this.eventPool }, { render: true })
      },
    },
    watch: {
      eventPool: {
        handler(newVal, oldVal) {
          if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.syncEvent()
          }
        },
        deep: true,
      },
    },
    mounted() {
      if (this.activePen && this.activePen.events && Array.isArray(this.activePen.events)) {
        this.eventPool = this.activePen.events.map(v => {
          return { name: v.name || '', action: v.action || '', value: v.value || '', params: v.params || '' }
        })
      } else {
        this.eventPool = []
      }
    },
  }
</script>

<style lang="less" scoped>
  .event-props {
    .add-event {
      width: calc(~'100% - 32px');
      margin: 16px;
    }
    /deep/.ivu-collapse {
      background: none;
      border: none;
      .ivu-collapse-item {
        border: none;
        &.ivu-collapse-item-active > .ivu-collapse-header {
          border: none;
        }
      }
      .collapse-title {
        flex: 1;
      }
    }
    /deep/.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header .collapse-title {
      display: flex;
      justify-content: space-between;
      flex: 1;
      align-items: center;
      padding-right: 16px;
      .ivu-icon {
        color: rgb(247, 63, 63);
      }
    }
  }
</style>
