<template>
  <div>
    <Modal :title="$t('select1') + $t('load')" v-model="isShow" @on-cancel="$emit('close')">
      <Collapse v-model="value1">
        <Panel name="1" style="background-color: #28313f">
          <span>{{ $t('load') + $t('load') }}</span>
          <div slot="content">
            <Row :guttter="16">
              <Col :span="6">
                <Select v-model="typeLoad" clearable>
                  <Option v-for="item in loadTypeList" :value="item.type" :key="item.name">{{ item.name }}</Option>
                </Select>
              </Col>
              <Col :span="10" style="margin-left: 10px"><Input v-model="searchLoad" :placeholder="$t('pleaseEnter') + $t('load') + $t('name')"></Input></Col>
              <Col :span="3">
                <Button type="primary" style="margin-left: 20px" @click.stop="handleCurrentChange(1)">{{ $t('query') }}</Button>
              </Col>
            </Row>
            <Checkbox v-model="getLoadValue" v-if="loadList.length > 0" @on-change="getAllLoadList(getLoadValue, loadList)">{{ $t('selectAll') }}</Checkbox>
            <CheckboxGroup v-model="checkLoad">
              <Checkbox style="padding: 5px; display: block" v-for="item in loadList" :key="Math.random() + item.id" :label="item.id + '-' + item.name">{{ item.name }}</Checkbox>
            </CheckboxGroup>
            <Page class="position-page" background show-elevator show-total @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="pageNo" :page-size-opts="[10, 20, 30]" :page-size="pageSize" :total="total"></Page>
          </div>
        </Panel>
      </Collapse>
      <div slot="footer">
        <Button type="default" @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
        <Button type="primary" @click.stop="saveAddLoadDevice">{{ $t('save') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { queryTypeList, queryList, saveBoxGroupLoads, listBoxGroupLoads } from '@/api/public'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        value1: '1',
        getLoadValue: false,
        isShow: false,
        loadTypeList: [],
        typeLoad: '',
        searchLoad: '',
        total: 0,
        loadList: [],
        pageSize: 10,
        pageNo: 1,
        checkLoad: [],
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val
        this.checkLoadList()
      },
      getAllLoadList(val, list) {
        this.checkLoad = val ? list.map(item => item.id + '-' + item.name) : []
        this.getLoadValue = !!val
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.checkLoadList()
      },
      async getLoadType() {
        const res = await queryTypeList()
        if (res.success) {
          this.loadTypeList = [{ name: this.$t('all'), type: 0 }, ...res.data]
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async checkLoadList() {
        let params = { projectCode: this.$store.state.projectCode, type: this.typeLoad ? this.typeLoad : 0, keyword: this.searchLoad, pageNo: this.pageNo, pageSize: this.pageSize }
        const res = await queryList(params)
        if (res.success) {
          this.loadList = res.datas
          this.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async saveAddLoadDevice() {
        let checkLoads = this.checkLoad && this.checkLoad.map(item => item.split('-'))
        let loads = checkLoads.map(([a, b]) => ({ loadId: a, name: b }))
        let params = { id: this.record.id, loads }
        const res = await saveBoxGroupLoads(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.$emit('close')
          this.callback && this.callback()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async addNodeLoad() {
        const res = await listBoxGroupLoads({ nodeId: this.record.id })
        if (res.success) {
          if (res.data.length > 0) {
            let newChecks = res.data.map(item => [item.loadId + '-' + item.name])
            this.checkLoad = newChecks.map(item => item.join('-'))
          } else {
            this.checkLoad = []
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    created() {
      this.getLoadType()
      this.checkLoadList()
    },
    mounted() {
      this.isShow = true
      this.addNodeLoad()
    },
  }
</script>

<style></style>
