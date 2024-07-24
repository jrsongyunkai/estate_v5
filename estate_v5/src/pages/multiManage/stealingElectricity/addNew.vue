<template>
  <div class="stealingElectricityNew">
    <div class="back" @click="back">
      <Icon custom="icon-v5 icon-v5-xiangzuo" />
      {{ $t('back') }}
    </div>
    <Row :gutter="16" style="margin-top: 10px">
      <Col :span="4">
        <Anchor show-ink container=".newAddcontent">
          <div class="bgcolor br10">
            <h3 style="margin-bottom: 10px">{{ tpyeState === 'edit' ? $t('editConfigPage') : $t('addConfigPage') }}</h3>
            <AnchorLink href="#information" :title="$t('baseInfo')" />
            <AnchorLink href="#configuration" :title="$t('configurationObject')" />
            <AnchorLink href="#timeperiods" :title="$t('configureTimePeriods')" />
          </div>
        </Anchor>
      </Col>
      <Col :span="20">
        <div class="newAddcontent">
          <template>
            <div class="inform bgcolor br10" id="information">
              <a href="#information"></a>
              <h3 style="margin-bottom: 20px">{{ $t('baseInfo') }}</h3>
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <FormItem :label="`${$t('configName')}:`" prop="name">
                  <Input v-model="formValidate.name" :placeholder="$t('pleaseEnter')" style="width: 400px"></Input>
                </FormItem>
                <FormItem :label="`${$t('configDescription')}:`" prop="describe">
                  <Input v-model="formValidate.describe" :placeholder="$t('pleaseEnter')" type="textarea" style="width: 400px"></Input>
                </FormItem>
                <FormItem :label="`${$t('configState')}:`" prop="status">
                  <Switch v-model="formValidate.status" />
                </FormItem>
              </Form>
            </div>
          </template>
          <template>
            <div class="list bgcolor br10 mt-10" id="configuration">
              <Row style="justify-content: space-between">
                <div>{{ $t('configurationObject') }}</div>
                <Button type="primary" @click="handlePageQueryAddr">{{ $t('deviceCircuit') }}</Button>
              </Row>
              <Table :columns="macLineColumns" :data="macLineData" class="mt-10">
                <template slot-scope="{ row }" slot="addr">
                  <Tag v-for="(item, index) in row.addrTitleList" :key="index" :name="item.addr" closable @on-close="handleClose(row, item.addr)">{{ item.title }}</Tag>
                </template>
                <template slot-scope="{ row }" slot="action">
                  <Button size="small" type="text" class="danger-pra" @click="handleEditDevice(row)">{{ $t('edit') }}</Button>
                  <Button size="small" type="text" class="danger-text" @click="handleDeviceAddrDel(row)">{{ $t('delete') }}</Button>
                </template>
              </Table>
              <Page show-total :current="currentPage" @on-change="changePage" :total="maclineTotal" show-elevator />
            </div>
          </template>
          <template id="timeperiods">
            <div class="bgcolor mt-10 br10">
              <Periods ref="periods" :confId="tpyeState === 'edit' ? confId : newConfId" :tpyeState="tpyeState" @formDynamicData="handleformDynamicData" @defaultTimeDynamic="handledefaultTimeDynamic" />
            </div>
          </template>
        </div>
      </Col>
    </Row>
    <Row class="flotBottom">
      <Button type="primary" @click="save">{{ $t('save') }}</Button>
      <Button class="ml-20" @click="cancel">{{ $t('cancel') }}</Button>
    </Row>
    <Modal :title="editMacLine === false ? $t('addCircuit') : $t('editcircuit')" v-model="addDevice" width="1200" class="addDevice">
      <AddDeviceAddr ref="device" @handleDeviceList="handleDeviceList" :eldermacLineData="macLineData" :confId="newConfId" :tpyeState="tpyeState" :editline="editline" :editlineRow="editlineRow" />
      <div slot="footer">
        <Button type="primary" @click="handleDeviceAdd">{{ $t('save') }}</Button>
        <Button @click="handleDeviceCancel">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Periods from './periods.vue'
  import AddDeviceAddr from './addDeviceAddr'
  import { snapshotbaseInfosave, snapshotbaseInfodetail, snapshotCreate, snapshotsave, snapshotcancel, snapshotdevicedel, snapshotaddrdel, snapshotdevicelist } from '@/api/public'
  export default {
    components: {
      Periods,
      AddDeviceAddr,
    },
    props: {
      tpyeState: String,
      confId: [Number, String],
    },
    data() {
      return {
        maclineTotal: 0,
        currentPage: 1,
        total: 0,
        formDynamicItem: {},
        defaultTimeDynamicItem: {},
        editline: false,
        editMacLine: false,
        addDevice: false,
        propsconfId: this.confId,
        newConfId: '',
        editlineRow: {},
        formValidate: {
          name: '',
          describe: '',
          status: true,
        },
        ruleValidate: {
          name: [{ required: true, message: this.$t('pleaseEnterConfigName'), trigger: 'blur' }],
        },
        macLineData: [],
        macLineColumns: [
          {
            title: this.$t('configDevice'),
            key: 'name',
          },
          {
            title: this.$t('equipmentNo'),
            key: 'mac',
          },
          {
            title: this.$t('line'),
            slot: 'addr',
          },
          {
            title: this.$t('operation'),
            slot: 'action',
            width: 200,
            align: 'center',
          },
        ],
        ruleName: true,
      }
    },
    mounted() {
      document.getElementsByClassName('ivu-anchor-ink-ball')[0].style.top = '63px'

      if (this.tpyeState === 'edit') {
        this.handleEditinit()
      }
    },
    methods: {
      changePage(e) {
        this.currentPage = e
        this.handleDeviceList()
      },
      handledefaultTimeDynamic(val) {
        this.defaultTimeDynamicItem = val
      },
      handleformDynamicData(val) {
        this.formDynamicItem = val
      },
      handleEditinit() {
        this.handlesnapshotCreate()
        this.handlesnapshotbaseInfodetail()
        this.handleDeviceList()
      },
      handlesnapshotbaseInfosave() {
        let params = {
          confId: this.tpyeState === 'add' ? 0 : this.propsconfId,
          projectCode: this.$store.state.projectCode,
          name: this.formValidate.name,
          remark: this.formValidate.describe,
          status: this.formValidate.status ? 1 : 0,
        }
        snapshotbaseInfosave(params).then(res => {
          if (res.success) {
            this.ruleName = true
            this.newConfId = res.data.confId
          } else {
            this.ruleName = false
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleDeviceList() {
        let params = {
          confId: this.tpyeState === 'edit' ? this.propsconfId : this.newConfId,
          projectCode: this.$store.state.projectCode,
          pageNo: this.currentPage,
          pageSize: '10',
        }
        snapshotdevicelist(params).then(res => {
          if (res.success) {
            this.macLineData = res.datas
            this.maclineTotal = res.total
            this.addDevice = false
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleClose(row, addr) {
        let params = {
          confId: this.tpyeState === 'edit' ? this.propsconfId : this.newConfId,
          mac: row.mac,
          addr: addr,
        }
        snapshotaddrdel(params).then(res => {
          if (res.success) {
            const index = row.addrTitleList.indexOf(addr)
            row.addrTitleList.splice(index, 1)
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleDeviceAddrDel(row) {
        let params = {
          confId: this.tpyeState === 'edit' ? this.propsconfId : this.newConfId,
          mac: row.mac,
        }
        snapshotdevicedel(params).then(res => {
          if (res.success) {
            this.$Message.success({
              content: this.$t('deleteLineSuccess'),
            })
            this.handleDeviceList()
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleEditDevice(row) {
        this.addDevice = true
        this.editMacLine = true
        this.editline = true
        this.editlineRow = row
        this.$refs.device.handlequeryChannels()
      },
      handlesnapshotbaseInfodetail() {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: this.propsconfId,
        }
        snapshotbaseInfodetail(params).then(res => {
          if (res.success) {
            this.propsconfId = res.data.confId
            this.formValidate = {
              name: res.data.name,
              describe: res.data.remark,
              status: res.data.status === 1,
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      save() {
        let length = this.formDynamicItem.items.length

        if (this.formValidate.name === '') {
          return this.$Message.error({
            content: this.$t('pleaseEnterConfigName'),
          })
        } else if (this.macLineData.length <= 0) {
          return this.$Message.error({
            content: this.$t('pleaseSelectDeviceLine'),
          })
        } else {
          if (this.tpyeState === 'edit') {
            this.handlesnapshotbaseInfosave()
          }
          if (length > 0) {
            setTimeout(() => {
              let newname
              for (let i = 0; i < length; i++) {
                newname = 'formDynamic' + i
              }
              this.$refs['periods'].$refs[newname][0].validate(valid => {
                if (valid) {
                  this.handlesnapshotsave()
                  this.$refs.periods.handlesnapshottimeconfig()
                  this.$emit('back', 'index')
                } else {
                  this.$Message.error({
                    content: this.$t('pleaseEnterRequirement'),
                  })
                }
              })
            }, 400)
          } else {
            this.handlesnapshotsave()
            this.$refs.periods.handlesnapshottimeconfig()
            this.$emit('back', 'index')
          }
        }
      },

      handleDeviceAdd() {
        if (this.editline) {
          this.$refs.device.handlesnapshotdevicemodify()
          this.handleDeviceList()
        } else {
          this.$refs.device.handleDeviceAdd()
        }
      },
      handleDeviceCancel() {
        this.addDevice = false
      },
      handlesnapshotCreate() {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: this.propsconfId,
        }
        snapshotCreate(params).then(res => {})
      },
      handlesnapshotsave() {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: this.tpyeState === 'edit' ? this.propsconfId : this.newConfId,
        }
        snapshotsave(params).then(res => {
          if (res.success) {
            this.$parent.handleElecStealingconfiglist()
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handlesnapshotcancel() {
        snapshotcancel({ confId: this.tpyeState === 'edit' ? this.propsconfId : this.newConfId }).then(res => {})
      },
      handlePageQueryAddr() {
        this.editline = false

        if (this.formValidate.name === '') {
          return this.$Message.error({
            content: this.$t('pleaseEnterConfigName'),
          })
        } else {
          this.editMacLine = false
          this.handlesnapshotbaseInfosave()
        }

        setTimeout(() => {
          if (this.ruleName) {
            this.addDevice = true
            setTimeout(() => {
              this.$refs.device.handlePageQueryAddr()
            }, 500)
          }
        }, 500)
      },
      cancel() {
        if (this.tpyeState === 'edit') {
          this.handlesnapshotcancel()
        }
        this.$emit('back', 'index')
      },
      back() {
        this.$emit('back', 'index')
      },
    },
    watch: {
      macLineData: {
        handler(newVal) {
          this.macLineData = newVal
        },
      },
    },
  }
</script>
<style lang="less">
  .ivu-anchor-ink {
    position: absolute;
    height: 100%;
    left: 20px;
    top: 0;
    padding: 50px 0px 40px 0px;
  }
  .ivu-affix {
    top: 130px !important;
  }
  .ivu-anchor-link {
    font-size: 16px;
    padding: 8px 0 18px 16px;
  }
  .stealingElectricityNew {
    position: relative;
    .br10 {
      border-radius: 10px;
    }
    .back {
      cursor: pointer;
      color: #999999;
    }
    .newAddcontent {
      overflow: auto;
      margin-bottom: 20px;
    }
    .flotBottom {
      display: flex;
      justify-content: end;
      background: #1a202e;
      padding: 20px;
      width: 100%;
    }
  }
</style>
