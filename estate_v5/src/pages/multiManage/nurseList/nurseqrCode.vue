<template>
  <div id="nurseCode">
    <!-- <div > <img src="../../../assets/images/userDetail.png" alt="" style="width:100%;height:100%"></div> -->
    <div>
      <h3 class="center-Texts" style="padding: 10px 0">{{ $t('objectDetail') }}</h3>
    </div>
    <div class="mg-Ts">
      <div class="ds-Codeptop">
        <div class="black-Texts">{{ $t('device') }}</div>
        <div class="gray-texts">{{ mac || '' }}</div>
      </div>
      <div class="ds-CodeLine">
        <div class="black-Texts">{{ $t('line') }}</div>
        <div class="gray-texts">{{ lines || '' }}</div>
      </div>
    </div>
    <div class="mg-Ts">
      <div class="ds-Codeptop">
        <div class="black-Texts">{{ $t('fullName') }}</div>
        <div class="gray-texts">{{ name }}</div>
      </div>
      <div class="ds-Code">
        <div class="black-Texts">{{ $t('gender') }}</div>
        <div class="gray-texts">{{ gender }}</div>
      </div>
      <div class="ds-Code">
        <div class="black-Texts">{{ $t('contactMethod') }}</div>
        <div class="gray-texts">{{ telephone }}</div>
      </div>
      <div class="ds-Code">
        <div class="black-Texts">{{ $t('age') }}</div>
        <div class="gray-texts">{{ age }}</div>
      </div>
      <div class="ds-Codepbottom">
        <div class="black-Texts" style="padding-top: 15px">{{ $t('photo') }}</div>
        <div class="gray-texts">
          <!-- <img :src="imgUrl" alt="" style="width:40px;height:40px"> -->
          <el-image style="width: 40px; height: 40px" :src="imgUrl" :preview-src-list="[imgUrl]"></el-image>
        </div>
      </div>
    </div>
    <div class="mg-Ts">
      <div class="ds-Codeptop">
        <div class="black-Texts">{{ $t('liveAddress2') }}</div>
        <div class="gray-texts">{{ address }}</div>
      </div>
      <div class="ds-Code">
        <div class="black-Texts">{{ $t('addrDetail') }}</div>
        <div class="gray-texts">{{ addressDtails }}</div>
      </div>
      <div class="ds-Codepbottom">
        <div class="black-Texts">{{ $t('position') }}</div>
        <div class="gray-texts">{{ location }}</div>
      </div>
    </div>
    <div class="mg-Ts">
      <div class="ds-Codeptop">
        <div class="black-Texts">{{ $t('isLiveAlone') }}</div>
        <div class="gray-texts">{{ isAlone }}</div>
      </div>
      <div class="ds-Code">
        <div class="black-Texts">{{ $t('isHaveDisease') }}</div>
        <div class="gray-texts">{{ isIll }}</div>
      </div>
      <div class="ds-Code">
        <div class="black-Texts">{{ $t('isHandicap') }}</div>
        <div class="gray-texts">{{ isDisability }}</div>
      </div>
      <div class="ds-Codepbottom">
        <div class="black-Texts">{{ $t('isLiveSelf') }}</div>
        <div class="gray-texts">{{ isCareself }}</div>
      </div>
    </div>
    <div class="gray-texts" style="padding: 10px 1px 5px 20px; background: #f3f4f6">{{ $t('relativeOne') }}</div>
    <div class="mg-Tses">
      <div class="ds-Codeptop">
        <div class="black-Texts">{{ $t('kinship') }}</div>
        <div class="gray-texts">{{ kin1Relation }}</div>
      </div>
      <div class="ds-Code">
        <div class="black-Texts">{{ $t('fullName') }}</div>
        <div class="gray-texts">{{ kin1Name }}</div>
      </div>
      <div class="ds-Codepbottom">
        <div class="black-Texts">{{ $t('contactNumber') }}</div>
        <div class="gray-texts">{{ kin1Contact }}</div>
      </div>
    </div>
    <div v-if="kin2Relation || kin2Name || kin2Contact">
      <div class="gray-texts" style="padding: 10px 0 5px 20px; background: #f3f4f6">{{ $t('relativeTwo') }}</div>
      <div class="mg-Tses">
        <div class="ds-Codeptop">
          <div class="black-Texts">{{ $t('kinship') }}</div>
          <div class="gray-texts">{{ kin2Relation }}</div>
        </div>
        <div class="ds-Code">
          <div class="black-Texts">{{ $t('fullName') }}</div>
          <div class="gray-texts">{{ kin2Name }}</div>
        </div>
        <div class="ds-Codepbottom">
          <div class="black-Texts">{{ $t('contactNumber') }}</div>
          <div class="gray-texts">{{ kin2Contact }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { personInfoEcNurse } from '@/api/public'
  export default {
    data() {
      return {
        personId: '',
        mac: '',
        lines: '',
        name: '',
        gender: '',
        age: '',
        telephone: '',
        imgUrl: '',
        address: '',
        addressDtails: '',
        location: '',
        isAlone: '',
        isIll: '',
        isCareself: '',
        isDisability: '',
        kin1Relation: '',
        kin1Name: '',
        kin1Contact: '',
        kin2Relation: '',
        kin2Contact: '',
        kin2Name: '',
        channelId: '',
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.personId = this.$route.query.p
        this.channelId = this.$route.query.c
        let param = { personId: this.personId, channelId: this.channelId }
        personInfoEcNurse(param).then(res => {
          if (res.success) {
            this.age = res.data.age
            this.name = res.data.name
            this.gender = res.data.sex === 1 ? this.$t('male') : res.data.sex === 2 ? this.$t('female') : this.$t('unknown2')
            this.lines = res.data.addrTitle
            this.mac = res.data.mac
            this.telephone = res.data.telephone
            this.imgUrl = res.data.photo
            this.address = res.data.province + res.data.city + res.data.county
            this.addressDtails = res.data.street
            this.location = res.data.build + res.data.unit + res.data.room
            this.isAlone = res.data.isAlone === 1 ? this.$t('yes') : this.$t('no')
            this.isIll = res.data.isIll === 1 ? this.$t('yes') : this.$t('no')
            this.isDisability = res.data.isDisability === 1 ? this.$t('yes') : this.$t('no')
            this.isCareself = res.data.isCareself === 1 ? this.$t('yes2') : this.$t('no2')
            this.kin1Relation = res.data.kin1Relation
            this.kin1Name = res.data.kin1Name
            this.kin1Contact = res.data.kin1Contact
            this.kin2Relation = res.data.kin2Relation || ''
            this.kin2Name = res.data.kin2Name || ''
            this.kin2Contact = res.data.kin2Contact || ''
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  #nurseCode {
    background: #f3f4f6;
    height: 110%;
    /deep/ .ivu-theme-dark {
      background: #fff !important;
    }
    .center-Texts {
      text-align: center;
      color: #343434;
      background: #ffffff;
      padding: 10px;
    }
    .mg-Ts {
      margin-top: 10px;
      background: #ffffff;
      padding: 10px 20px;
      font-size: 16px;
    }
    .mg-Tses {
      background: #ffffff;
      padding: 10px 20px;
      font-size: 16px;
    }
    .gray-texts {
      color: #6e6e6e;
    }
    .ds-Code {
      display: flex;
      justify-content: space-between;
      margin: 30px 0;
    }
    .ds-Codeptop {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    .ds-CodeLine {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }
    .ds-Codepbottom {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .black-Texts {
      color: #070707;
      font-weight: 600;
    }
  }
</style>
