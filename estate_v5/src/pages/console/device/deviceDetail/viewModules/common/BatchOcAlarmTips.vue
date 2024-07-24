<template>
  <Modal width="500" :close-on-click-modal="false" v-model="batchOcAlarmTip">
    <div style="margin-top: 10px">
      <Icon type="md-alert" />
      {{ isScene ? $t('alarmStatusSenceTip') : ocType ? $t('alarmStatusClosingTip') : $t('alarmStatusOpeningTip') }}
    </div>
    <div style="margin-top: 10px">
      <Table :data="list" :columns="columns">
        <template #deviceInfo="{ row }">{{ `${row.macName}(${row.mac})` }}</template>
        <template #addrInfo="{ row }">{{ `${row.addrTitle}(${row.mac}-${row.addr.toString().padStart(2, '0')})` }}</template>
      </Table>
    </div>
    <div slot="footer">
      <Row type="flex" justify="end" :gutter="5">
        <Col>
          <Button type="primary" size="small" @click="commitOK">{{ $t('confirm') }}</Button>
        </Col>
        <Col>
          <Button type="default" size="small" @click="batchOcAlarmTip = false">{{ $t('cancel') }}</Button>
        </Col>
      </Row>
    </div>
  </Modal>
</template>

<script>
  export default {
    props: {
      isScene: { type: Boolean, default: false },
    },
    data() {
      return {
        batchOcAlarmTip: false,
        ocType: false,
        list: [],
        params: null,
        columns: [
          { title: this.$t('deviceMessage'), slot: 'deviceInfo' },
          { title: this.$t('lineInfo'), slot: 'addrInfo' },
        ],
      }
    },
    methods: {
      commitOK() {
        this.batchOcAlarmTip = false
        this.list = []
        this.$emit('commitOK', this.params)
      },
      openModal(list, type, params) {
        this.list = [...list]
        this.ocType = type
        this.params = params
        this.batchOcAlarmTip = true
      },
    },
  }
</script>
