<template>
  <div class="addDeviceAddr">
    <div class="content">
      <Row :gutter="10" style="width: 100%">
        <Form style="width: 100%; display: flex">
          <FormItem class="w180">
            <Input v-model="addDeviceItem.name" :placeholder="$t('EnterDevice')"></Input>
          </FormItem>
          <FormItem :label-width="20">
            <Select v-model="addDeviceItem.type" @on-change="handleTypes" class="w180" :placeholder="$t('selectGroupingType')">
              <Option v-for="item in packetList" :value="item.id" :key="item.id">
                {{ item.type }}
              </Option>
            </Select>
          </FormItem>
          <FormItem :label-width="20">
            <TreeSelect :placeholder="$t('selectGroup')" multiple show-checkbox v-model="addDeviceItem.typeName" transfer :data="packetFilterList" class="w180" />
          </FormItem>
          <FormItem :label-width="20" class="w180">
            <Input v-model="addDeviceItem.position" :placeholder="$t('enterPosition')"></Input>
          </FormItem>
          <FormItem :label-width="20" class="w180">
            <Select v-model="onlinStatus" :placeholder="$t('plsEmacStatus')">
              <Option v-for="item in stateList" class="w180" :value="item.value" :key="item.value">
                {{ item.label }}
              </Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" class="ml-10" @click="handlePageQueryAddr">{{ $t('query') }}</Button>
            <Button class="ml-10" @click="reset">{{ $t('reset') }}</Button>
          </FormItem>
        </Form>
      </Row>
      <Row style="margin-top: 20px">
        <Col :span="12" class="border">
          <div style="padding: 10px; background: #283140">
            <Checkbox :value="airSwitch" :indeterminate="indeterMac" @click.prevent.native="getAllDeviceValue(deviceLIstOne)">
              {{ $t('selectDevice') }}
            </Checkbox>
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <Checkbox class="checkboxlist" v-for="item in deviceLIstOne" :label="item.mac" :key="item.mac" :value="item.ischeck" :indeterminate="item.indeter" :disabled="item.disable" ref="macRef" @on-change="checkSelectQuery(item.mac, item)">
              <span style="width: calc(100% - 24px); margin-left: 10px" @click.stop.prevent="clickLable(item.mac)">
                <span :style="{ color: item.mac === curClickedNode ? '#0c70dd' : '#fff' }">{{ item.name + '(' + item.mac + ')' }}</span>
              </span>
            </Checkbox>
          </div>
        </Col>
        <Col :span="12" class="borderLeft">
          <div style="padding: 10px; background: #283140">
            <Checkbox
              v-if="curLines.length"
              :value="checkAllList"
              @click.prevent.native="
                () => {
                  lineCheckAll(curLines)
                }
              "
              :indeterminate="indeterList">
              {{ $t('selectLine') }}
            </Checkbox>
            <span v-else>{{ $t('selectLine') }}</span>
          </div>
          <div style="padding: 10px; height: 500px; overflow: auto">
            <div>
              <Input :placeholder="$t('linenameTosearch')" v-model="lineKeyword" />
            </div>
            <CheckboxGroup v-model="curSelectedLines" @on-change="linesChange">
              <Checkbox style="padding: 5px; display: block" v-for="item in curLines" :key="item.title" :label="item.addr" :disabled="item.canSelect === 0" v-show="item.title.includes(lineKeyword)" ref="lineRef">
                <span @click.stop="handleMessage(item.disabled)">{{ item.title }}</span>
              </Checkbox>
            </CheckboxGroup>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
  import { getGroupType, getGroupTree, snapshotdeviceselect, snapshotdeviceadd, snapshotdevicemodify } from '@/api/public'
  export default {
    props: {
      confId: [Number, String],
      tpyeState: String,
      editline: Boolean,
      editlineRow: Object,
      eldermacLineData: Array,
    },
    data() {
      return {
        checkAllList: false,
        airSwitch: false,
        indeterMac: true,
        deviceLIstOne: [],
        curClickedNode: '',
        stateList: [
          {
            value: '-1',
            label: this.$t('disconnected'),
          },
          {
            value: '0',
            label: this.$t('offline'),
          },
          {
            value: '1',
            label: this.$t('online'),
          },
        ],
        onlinStatus: '',
        packetList: [],
        packetFilterList: [],
        addDeviceItem: {
          type: '',
          name: '',
          typeName: '',
          position: '',
        },
        curSelectedLines: [],
        curLines: [],
        submitNode: {},
        checkAllGroups: [],
        macLineData: [],
        checkMacData: [],
        lineKeyword: '',
        indeterList: true,
        macLineList: '',
      }
    },
    mounted() {
      this.getGroupTypes()
      this.handleDeviceList()
    },

    methods: {
      handlePageQueryAddr() {
        let params = {
          confId: this.confId,
          projectCode: this.$store.state.projectCode,
          mac: this.addDeviceItem.name,
          location: this.addDeviceItem.position,
          onlineStatus: this.onlinStatus,
          nodeIds: this.addDeviceItem.typeName ? this.addDeviceItem.typeName.join() : this.addDeviceItem.typeName,
        }

        snapshotdeviceselect(params).then(res => {
          let arrMac = []
          if (res.success) {
            this.addDevice = true
            let key = 'ischeck'
            let indeter = 'indeter'
            this.deviceLIstOne = Array.from(new Set(res.datas))

            this.deviceLIstOne.map(val => {
              val[key] = false
              val[indeter] = false
              val['disable'] = false
              val.addrs.find(item => {
                if (item.canSelect === 0) {
                  val.lineType = 'IO'
                } else {
                  val.lineType = 'unIO'
                }
              })
            })
            this.submitNode = {}

            setTimeout(() => {
              this.$refs.macRef.map(val => {
                if (this.macLineData.length === 0) {
                  val.currentValue = false
                }
                this.checkAllGroups.map(item => {
                  if (val.label === item) {
                    arrMac.push(item)
                    this.clickLable(arrMac[0], 'Addr')
                    if (this.macLineData.length !== 0) {
                      val.currentValue = true
                    }
                  }
                })
              })
            }, 500)
          }
        })
      },
      handlesnapshotdevicemodify() {
        let params = {
          confId: this.confId,
          mac: this.editlineRow.mac,
          addrs: `${this.curSelectedLines}`,
        }
        snapshotdevicemodify(params).then(res => {})
      },
      handlequeryChannels() {
        setTimeout(() => {
          this.deviceLIstOne = []
          let arr = []
          this.editlineRow.addrTitleList.map(val => {
            arr.push({
              addr: val.addr,
              title: val.title,
            })
          })
          let obj = {
            addrs: arr,
            mac: this.editlineRow.mac,
            name: this.editlineRow.name,
          }

          this.deviceLIstOne.push(obj)

          this.curSelectedLines = []
          this.deviceLIstOne.map(item => {
            this.curLines = item.addrs.map(vals => ({
              addr: vals.addr,
              title: vals.title,
            }))
          })
          this.editlineRow.addrTitleList.map(item => {
            this.curSelectedLines.push(item.addr)
          })
          this.$refs.macRef.forEach(val => {
            if (val.label === this.editlineRow.mac) {
              setTimeout(() => {
                val.currentValue = true
                this.curSelectedLines = []
                this.curLines.map(vals => {
                  this.curSelectedLines.push(vals.addr)
                })
                this.submitNode[this.editlineRow.mac] = [...this.curSelectedLines]
                this.checkAllGroups.push(this.editlineRow.mac)

                if (this.curClickedNode) this.submitNode[this.curClickedNode] = this.curSelectedLines
              }, 500)
            }
          })
        }, 1000)
      },
      handleDeviceAdd() {
        const selectedNodes = [...new Set([...this.checkAllGroups])]
        let devices = selectedNodes.map(v => ({
          addrs: this.submitNode[v] ? [...new Set([...this.submitNode[v].map(item => Number(item))])].toString() : '',
          mac: v,
        }))
        let params = {
          confId: this.confId,
          macAddrsList: JSON.stringify(devices),
        }
        if (!devices.length) {
          return this.$Message.error(this.$t('pleaseSelectADevice'))
        }
        snapshotdeviceadd(params).then(res => {
          if (res.success) {
            this.$emit('handleDeviceList')
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },

      handleDeviceList() {
        let arr = this.eldermacLineData
        arr.map(val => {
          val.addrs = val.addrs ? val.addrs.split(',') : []
        })
        this.macLineData = arr

        this.checkAllGroups = this.macLineData.map(item => item.mac)
        this.curSelectedLines = []
      },
      checkSelectQuery(mac, item) {
        this.checkMacData = mac
        this.clickLable(mac)
      },
      handleMessage(val) {
        if (val) {
          this.$Message.warning({
            content: this.$t('notSupportTheftMonitor'),
          })
        }
      },
      linesChange(checked) {
        this.curSelectedLines = checked

        this.deviceLIstOne.map(val => {
          if (val.mac === this.checkMacData) {
            if (checked.length === this.curLines.length) {
              val.indeter = false
              val.ischeck = true
            }
            if (this.curSelectedLines.length < this.curLines.length) {
              val.indeter = true
              val.ischeck = false
            }

            if (this.curSelectedLines.length === 0) {
              val.indeter = false
              val.ischeck = false
            }
          }
        })
        this.checkAllGroups.push(this.checkMacData)
        if (checked.length === this.curLines.length) {
          this.indeterList = false
          this.checkAllList = true
          this.indeterMacLs = false
        }
        if (this.curSelectedLines.length < this.curLines.length) {
          this.indeterList = true
          this.checkAllList = false
          this.indeterMacLs = true
        }

        if (this.curSelectedLines.length === 0) {
          this.indeterList = false
          this.checkAllList = false
          this.indeterMacLs = false
        }

        if (this.curClickedNode) this.submitNode[this.curClickedNode] = checked
      },
      lineCheckAll(val) {
        // 线路编号
        let LineAddrs = []
        val.map(v => {
          if (v.canSelect !== 0) {
            LineAddrs.push(v.addr)
          }
        })

        this.curSelectedLines = LineAddrs
        this.curSelectedLength = val.length
        if (this.indeterList) {
          this.checkAllList = false
        } else {
          this.checkAllList = !this.checkAllList
        }
        this.indeterList = false

        if (this.checkAllList) {
          this.curSelectedLines = this.curSelectedLines
        } else {
          this.curSelectedLines = []
        }
      },
      clickLable(mac, type) {
        this.checkMacData = mac
        this.curClickedNode = mac
        this.deviceLIstOne.map(item => {
          if (item.mac === mac) {
            this.curLines = item.addrs.map(vals => ({
              addr: vals.addr,
              title: vals.title,
              disabled: false,
              canSelect: vals.canSelect,
            }))
          }
        })
        this.$refs.macRef.map(val => {
          if (val.label === mac) {
            setTimeout(() => {
              if (val.currentValue) {
                this.curSelectedLines = []
                this.curLines.map(val => {
                  if (val.canSelect === 1) {
                    this.curSelectedLines.push(val.addr)
                  }
                })
                this.checkAllGroups.push(mac)
              } else {
                this.curSelectedLines = []
                for (var i = 0; i < this.checkAllGroups.length; i++) {
                  if (this.checkAllGroups[i] === mac) {
                    this.checkAllGroups.splice(i, 1)
                  }
                }
              }
              if (this.curClickedNode) this.submitNode[this.curClickedNode] = this.curSelectedLines
            }, 500)
          }
        })
      },

      getAllDeviceValue(list) {
        setTimeout(() => {
          this.$refs.macRef.map(val => {
            if (this.checkMacData === val.label) {
              if (val.currentValue) {
                this.curSelectedLines = this.curLines.map(val => val.addr)
                this.submitNode[this.curClickedNode] = this.curSelectedLines
              }
            }
          })
        }, 500)

        if (this.indeterMac) {
          this.airSwitch = false
        } else {
          this.airSwitch = !this.airSwitch
        }
        this.indeterMac = false
        if (this.airSwitch) {
          this.checkAllGroups = list.map(item => item.mac)
          this.$refs.macRef.map(val => {
            val.currentValue = true
          })
        } else {
          this.checkAllGroups = []
          this.$refs.macRef.map(val => {
            val.currentValue = false
          })
        }
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      reset() {
        this.addDeviceItem = {
          type: '',
          name: '',
          typeName: '',
          position: '',
        }
        this.onlinStatus = ''
      },
      getGroupTypes() {
        let params = {
          projectCode: this.$store.state.projectCode, // 'P00000000012'
        }
        getGroupType(params)
          .then(res => {
            if (res.success) {
              this.packetList = res && res.data
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      getGroupTrees() {
        getGroupTree({ groupId: this.packetTypes })
          .then(res => {
            if (res.code === '0') {
              this.packNewlist = res.data
              let resData = this.getTree(res.data)
              this.packetFilterList = this.cloneTree(resData)
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            // 递归寻找
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })

        return tree
      },
      // 递归遍历数组为树状结构
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.value = item.id
            obj.parentId = item.parentId
            obj.title = item.name
            // 其他你想要添加的属性
            obj.expand = true
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
    },
  }
</script>
<style lang="less">
  .addDeviceAddr {
    .checkboxlist {
      display: block;
      margin: 0 0 20px 0;
    }
    .w180 {
      width: 180px;
    }
    .borderLeft {
      border-left: 0;
      border-top: 1px solid #353948;
      border-bottom: 1px solid #353948;
      border-right: 1px solid #353948;
    }
  }
</style>
