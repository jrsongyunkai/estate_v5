<template>
  <div>
    <Modal :title="$t('groupingAttributeManagement')" v-model="isShow" width="800" @on-cancel="$emit('close')">
      <div style="max-height: 60vh; overflow-y: auto">
        <Form :label-width="100">
          <h3 style="margin-bottom: 20px">{{ $t('basicInformation') }}</h3>
          <FormItem :label="$t('builtUpArea')">
            <Input v-model.number="attributes.area" :maxlength="6" style="width: 200px; margin-top: 5px" :placeholder="$t('pleaseEnter')" show-word-limit @on-change="getNumberValue(attributes.area)"></Input>
            {{ $t('square1') }}
          </FormItem>
          <FormItem :label="$t('numberOfPeople')">
            <Input v-model.number="attributes.people" :maxlength="6" show-word-limit @on-change="getNumberValue(attributes.people)" style="width: 200px" :placeholder="$t('pleaseEnter')"></Input>
            ({{ $t('ns_iconGroups.people') }})
          </FormItem>
          <FormItem :label="$t('latLng')">
            <Input v-model="attributes.longitude" style="width: 200px" :placeholder="$t('pleaseEnter') + $t('longitude')"></Input>
            <Input v-model="attributes.latitude" class="ml-10" style="width: 200px" :placeholder="$t('pleaseEnter') + $t('latitude')"></Input>
            <Button type="primary" class="ml-10" @click="changemapFlag">{{ $t('mapPoint') }}</Button>
          </FormItem>
          <FormItem :label="$t('locationName')">
            <Input v-model="attributes.localtionName" style="width: 300px" :placeholder="$t('pleaseEnter') + $t('locationName')"></Input>
          </FormItem>
          <div v-if="mapFlag" style="width: 100%">
            <echartsMap @getLongitudes="getLongitudes" @getLocaltion="getLocaltion"></echartsMap>
          </div>
          <h3 style="margin-top: 20px; margin-bottom: 20px">{{ $t('groupLeader') }}</h3>
          <FormItem :label="$t('name')">
            <Input v-model="attributes.peopleName" style="width: 300px" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('duties')">
            <Input v-model="attributes.dutyJob" style="width: 300px" :placeholder="$t('pleaseEnter')"></Input>
          </FormItem>
          <FormItem :label="$t('contactNumber')">
            <Input v-model.number="attributes.telephoneNum" :maxlength="11" show-word-limit style="width: 300px" :placeholder="$t('pleaseEnter')" @on-blur="getTelValue(attributes.telephoneNum)"></Input>
          </FormItem>
          <h3 style="margin-top: 20px; margin-bottom: 20px">{{ $t('electricitySettings') }}</h3>
          <FormItem :label="$t('maxPower')">
            <Input v-model.number="attributes.maxPower" @on-change="getNumberValue(attributes.maxPower)" style="width: 300px" :placeholder="$t('pleaseEnter')" :maxlength="6" show-word-limit></Input>
            (KW)
          </FormItem>
          <FormItem :label="$t('maxPowerConsumption')">
            <Input v-model.number="attributes.maxElectri" :maxlength="6" show-word-limit @on-change="getNumberValue(attributes.maxElectri)" style="width: 300px" :placeholder="$t('pleaseEnter')"></Input>
            (kW·h)
          </FormItem>
          <FormItem :label="$t('electricityConsumptionPeriod')">
            <div v-for="index in timeList" :key="index" style="margin-top: 3px">
              <TimePicker transfer v-model="timeValue[index]" :editable="false" format="HH:mm" type="timerange" placement="bottom-end" :placeholder="$t('pleaseSelectTime')" style="width: 168px"></TimePicker>
              <span style="margin-left: 5px; background: rgba(224, 60, 58, 0.1); padding: 4px; border: 1px solid #e03c3a; border-radius: 3px"><Icon type="ios-trash-outline" size="22" color="#E03C3A" @click.stop="minusList(index)" /></span>
            </div>
            <Button style="margin-top: 5px; width: 168px; border: 1px dashed #007eff; background-color: rgba(0, 126, 255, 0.1)" type="primary" ghost @click="minusList('add')">+{{ $t('addTimePeriod') }}</Button>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="default" @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
        <Button type="primary" @click.stop="saveGroupAttributes">{{ $t('save') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import echartsMap from '../latitudeMap.vue'
  import { queryBoxGroupAttributes, saveBoxGroupAttributes } from '@/api/public'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    components: { echartsMap },
    data() {
      return {
        timeValue: [],
        isShow: false,
        timeList: 1,
        mapFlag: false,
        attributes: { area: '', people: '', longitude: '', latitude: '', localtionName: '', peopleName: '', dutyJob: '', telephoneNum: '', maxPower: '', maxElectri: '' },
      }
    },
    methods: {
      changemapFlag() {
        this.mapFlag = !this.mapFlag
      },
      getLongitudes(val) {
        this.attributes.longitude = val[0]
        this.attributes.latitude = val[1]
      },
      getLocaltion(val) {
        if (!val) {
          this.$Message.error(this.$t('pleaseClickMapAgainGetLocation'))
        } else {
          this.attributes.localtionName = val.province + val.city + val.district + val.street + val.streetNumber
        }
      },
      getTelValue(val) {
        let telReg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (telReg.test(val) === false) {
          this.$Message.error({ content: this.$t('pleaseEnterCorrectPhoneNumber') })
        }
      },
      minusList(val) {
        if (val === 'add') {
          if (this.timeList >= 5) return this.$Message.error({ content: this.$t('cantAdd') })
          if (typeof this.timeList === 'undefined') {
            this.timeList = 1
          } else {
            this.timeList += 1
          }
        } else {
          this.timeList -= 1
          this.timeValue.splice(val, 1)
          if (this.timeList <= 0) {
            this.timeList = 0
            this.timeValue = []
          }
        }
      },
      getNumberValue(val) {
        let reg = /^[0-9]+(.[0-9]{2})?$/
        if (reg.test(val) === false) {
          this.$Message.error({ content: this.$t('pleaseEnterTheCorrectNumber') })
        }
      },
      newTimeFunction(str) {
        if (str) {
          let arr = str.split(',')
          this.timeList = arr.length > 0 ? arr.length : 1
          let secondList = arr.map(item => item.split('-'))
          return secondList
        }
      },
      async openAttributeFlag() {
        const res = await queryBoxGroupAttributes({ nodeId: this.record.id })
        if (res.success) {
          let arr = Object.keys(res.data)
          if (arr.length > 0) {
            this.attributeFlag = true
            this.attributes.area = res.data.area
            this.attributes.people = res.data.people
            this.attributes.longitude = res.data.longitude
            this.attributes.latitude = res.data.latitude
            this.attributes.localtionName = res.data.localtionName
            this.attributes.peopleName = res.data.peopleName
            this.attributes.dutyJob = res.data.dutyJob
            this.attributes.telephoneNum = res.data.telephoneNum
            this.attributes.maxPower = res.data.maxPower
            this.attributes.maxElectri = res.data.maxElectri
            if (res.data.time.length > 0) {
              this.timeValue = this.newTimeFunction(res.data.time)
              this.timeList = this.timeValue && this.timeValue.length
            } else {
              this.timeValue = [[]]
              this.timeList = 1
            }
          } else {
            this.attributes = { area: '', people: '', longitude: '', latitude: '', localtionName: '', peopleName: '', dutyJob: '', telephoneNum: '', maxPower: '', maxElectri: '' }
            this.timeValue = [[]]
            this.timeList = 1
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      timeFunction(arr) {
        return arr.length > 0 ? arr.map(([one, two]) => one + '-' + two) : []
      },
      async saveGroupAttributes() {
        let attributes = {
          ...this.attributes,
          time: this.timeFunction(this.timeValue).join(','),
        }
        let params = { id: this.record.id, attributes }
        const res = await saveBoxGroupAttributes(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.$emit('close')
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    created() {
      this.openAttributeFlag()
    },
    mounted() {
      this.isShow = true
    },
  }
</script>

<style></style>
