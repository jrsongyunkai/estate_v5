<template>
  <Button type="text" icon="ios-volume-up" class="operation-btn c-primary" @click="onClick">{{ currentPlaying === identifier ? $t('stop') : $t('trialListening') }}</Button>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    props: {
      id: [Number, String],
      type: String,
      srcOrText: [String, Function],
    },
    computed: {
      ...mapState('alarmSound', ['currentPlaying']),
      identifier() {
        return `${this.id}-${this.type}`
      },
    },
    methods: {
      ...mapActions('alarmSound', ['playSound', 'stopSound']),
      onClick() {
        if (this.currentPlaying === this.identifier) {
          this.stopSound()
        } else {
          this.playSound({
            id: this.id,
            type: this.type,
            srcOrText: typeof this.srcOrText === 'string' ? this.srcOrText : this.srcOrText(),
          })
        }
      },
    },
  }
</script>

<style lang="less" scoped></style>
