<template>
  <div>
    <div>
      <Row class="pwds-tip" v-if="write !== 'write'">
        <Col :span="22">
          <span>
            <i class="icon-v5 icon-v5-xiaoxi"></i>
            {{ toolTips }}
          </span>
        </Col>
      </Row>
    </div>
    <input type="text" :placeholder="$t('pleaseEnterAccount1')" class="fake-input" />
    <PassWordInput :isFoucs="isfoucs" :textPwd="textPwd" @getPwd="getPwdsValue" :write="'write'"></PassWordInput>
    <div :class="write === 'write' ? 'pwds-Wforgetpwds' : 'pwds-forgetpwds'">
      <span class="pointer" @click="closeModify">{{ $t('forgetSubPassword') }}</span>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import PassWordInput from './PassWordInput.vue'
  export default {
    components: { PassWordInput },
    props: {
      write: {
        type: String,
        default: '',
      },
      // isfoucs: {
      //     type: Boolean,
      //     default: true
      // }
    },
    mounted() {},
    data() {
      return {
        isfoucs: true,
        isshowPut: false,
        passWordsSeconded: '',
        textPwd: this.$t('subPassword'),
        toolTips: this.$t('pleaseEnterCurrentAccountSubPassword'),
      }
    },
    methods: {
      closeModify() {
        this.$emit('close', false)
        this.$router.push('/settingConfig')
        if (this.write === 'write') {
          store.commit('detailsFlagMore', false)
        }
      },
      getPwdsValue(val) {
        this.passWordsSeconded = val
        this.$emit('getnewPwds', this.newPwds)
      },
    },
    computed: {
      newPwds() {
        return this.passWordsSeconded
      },
    },
  }
</script>

<style lang="less">
  .pwds-forgetpwds {
    color: #007eff;
    text-align: right;
    margin-right: 50px;
  }
  .pwds-Wforgetpwds {
    color: #007eff;
    text-align: right;
    width: 340px;
    margin-top: 10px;
  }
  .pwds-tip {
    font-size: 14px;
    padding: 5px;
    margin-bottom: 20px;
    border: 1px solid;
    background: #1a202e;
    color: #999999;
  }
  .fake-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    padding: 0;
    border: none;
  }
</style>
