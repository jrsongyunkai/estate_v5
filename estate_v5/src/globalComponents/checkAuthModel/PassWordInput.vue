<template>
  <div @click="toFocus" class="card">
    <div class="group">
      <!-- <input type="password" style="display:none"> -->
      <div class="ipu-item" style="display: flex">
        <div style="margin-right: 15px; text-align: right; padding-top: 5px" :style="write === 'write' ? '' : 'width:130px;'">{{ textPwd }}</div>
        <InputVue class="my-put" name="123" autocomplete="new-password" v-model="value1" :ref="'input' + 1" @input="handleChange($event, 1, value1)" @on-keyup="handleDelete($event, 1)" maxlength="1" :disabled="isDisabled" :type="inputType" />
        <InputVue class="my-put" auto-complete="new-password" autocomplete="new-password" v-model="value2" :ref="'input' + 2" @input="handleChange($event, 2, value2)" @on-keyup="handleDelete($event, 2)" maxlength="1" :disabled="isDisabled" :type="inputType" />
        <InputVue class="my-put" auto-complete="new-password" autocomplete="new-password" v-model="value3" :ref="'input' + 3" @input="handleChange($event, 3, value3)" @on-keyup="handleDelete($event, 3)" maxlength="1" :disabled="isDisabled" :type="inputType" />
        <InputVue class="my-put" auto-complete="new-password" autocomplete="new-password" v-model="value4" :ref="'input' + 4" @input="handleChange($event, 4, value4)" @on-keyup="handleDelete($event, 4)" maxlength="1" :disabled="isDisabled" :type="inputType" />
        <InputVue class="my-put" auto-complete="new-password" autocomplete="new-password" v-model="value5" :ref="'input' + 5" @input="handleChange($event, 5, value5)" @on-keyup="handleDelete($event, 5)" maxlength="1" :disabled="isDisabled" :type="inputType" />
        <InputVue class="my-put" auto-complete="new-password" autocomplete="new-password" v-model="value6" :ref="'input' + 6" @input="handleChange($event, 6, value6)" @on-keyup="handleDelete($event, 6)" maxlength="1" :disabled="isDisabled" :type="inputType" />
        <!-- <input  type="password" name="password"  autocomplete="off" class="hiddenPass" readonly/> -->
      </div>
    </div>
  </div>
</template>

<script>
  import InputVue from './PwdsIview.vue'
  export default {
    components: {
      InputVue,
    },
    props: {
      write: {
        type: String,
        default: '',
      },
      value: {
        type: String,
        default: '',
      },
      textPwd: {
        type: String,
        default: '',
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
      isFoucs: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        disNone: false,
        disVal: '',
        inputType: 'passwords',
        value1: '',
        value2: '',
        value3: '',
        value4: '',
        value5: '',
        value6: '',
        readonlyValue1: true,
        readonlyValue2: true,
        readonlyValue3: true,
        readonlyValue4: true,
        readonlyValue5: true,
        readonlyValue6: true,
      }
    },
    watch: {
      value1(curVal) {
        if (/[^\d]/g.test(curVal)) {
          this.$nextTick(() => {
            this.value1 = ''
          })
        }
      },
      value2(curVal) {
        if (/[^\d]/g.test(curVal)) {
          this.$nextTick(() => {
            this.value2 = ''
          })
        }
      },
      value3(curVal) {
        if (/[^\d]/g.test(curVal)) {
          this.$nextTick(() => {
            this.value3 = ''
          })
        }
      },
      value4(curVal) {
        if (/[^\d]/g.test(curVal)) {
          this.$nextTick(() => {
            this.value4 = ''
          })
        }
      },
      value5(curVal) {
        if (/[^\d]/g.test(curVal)) {
          this.$nextTick(() => {
            this.value5 = ''
          })
        }
      },
      value6(curVal) {
        if (/[^\d]/g.test(curVal)) {
          this.$nextTick(() => {
            this.value6 = ''
          })
        }
      },
    },
    created() {
      // this.password = String(this.value)
      // !!this.password && this.password.split('').length > 0 && this.password.split('').forEach((ipu-item, index) => {
      //     this[`input${index}`] = ipu-item
      // })
      this.value1 = ''
      this.value2 = ''
      this.value3 = ''
      this.value4 = ''
      this.value5 = ''
      this.value6 = ''
    },
    mounted() {
      // this.inputType = 'text'
      if (this.isFoucs) {
        this.$refs['input1'].focus()
      }
      // setTimeout(() => { this.inputType = 'passwords' }, 500)
    },
    methods: {
      getFoucs() {},
      getClick(val) {
        this.$refs[val].blur()
        this.$refs[val].focus()
      },
      getBlur(val) {
        if (val === 1) {
          this.readonlyValue1 = true
        } else if (val === 2) {
          this.readonlyValue2 = true
        } else if (val === 3) {
          this.readonlyValue3 = true
        } else if (val === 4) {
          this.readonlyValue4 = true
        } else if (val === 5) {
          this.readonlyValue5 = true
        } else if (val === 6) {
          this.readonlyValue6 = true
        }
      },
      passFoucs(val) {
        let that = this
        setTimeout(() => {
          if (val === 1) {
            that.readonlyValue1 = false
          } else if (val === 2) {
            that.readonlyValue2 = false
          } else if (val === 3) {
            that.readonlyValue3 = false
          } else if (val === 4) {
            that.readonlyValue4 = false
          } else if (val === 5) {
            that.readonlyValue5 = false
          } else if (val === 6) {
            that.readonlyValue6 = false
          }
        })
      },
      toFocus() {
        if (this.inputRefGroup[this.result.length]) {
          // this.inputRefGroup[this.result.length].focus()
        }
      },
      handleChange(e, num, val) {
        // this.inputType = 'passwords'
        if (/[^\d]/g.test(val) || !val || e.keyCode === 8) return
        if (this.$refs[`input${num + 1}`]) {
          if (num === 1) {
            this.readonlyValue2 = false
          } else if (num === 2) {
            this.readonlyValue3 = false
          } else if (num === 3) {
            this.readonlyValue4 = false
          } else if (num === 4) {
            this.readonlyValue5 = false
          } else if (num === 5) {
            this.readonlyValue6 = false
          }

          this.$refs[`input${num + 1}`].focus()
        } else {
          // alert('当前输入的密码是：' + this.result)
        }
        this.$emit('getPwd', this.result)
      },
      handleDelete(e, num) {
        if (e.keyCode === 8 || e.key === 'Backspace') {
          if (this.$refs[`input${num - 1}`]) {
            if (num === 1) {
              this.readonlyValue1 = true
            } else if (num === 2) {
              this.readonlyValue2 = true
            } else if (num === 3) {
              this.readonlyValue3 = true
            } else if (num === 4) {
              this.readonlyValue4 = true
            } else if (num === 5) {
              this.readonlyValue5 = true
            } else if (num === 6) {
              this.readonlyValue6 = true
            }
            this.$refs[`input${num - 1}`].focus()
          }
        }

        this.$emit('getPwd', this.result)
      },
    },
    computed: {
      result() {
        return this.value + this.value1 + this.value2 + this.value3 + this.value4 + this.value5 + this.value6
      },
    },
  }
</script>

<style lang="less">
  .group {
  }
  .hiddenPass {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    padding: 0;
    border: none;
  }
  .ipu-item {
    width: 100%;
    display: flex;
    .ivu-input-wrapper {
      width: 35px !important;
      margin-right: 10px !important;
    }
    Input {
      text-align: center;
      font-size: 25px;
      width: 35px;

      -webkit-text-security: disc;
    }
  }
</style>
