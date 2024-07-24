<template>
  <div>
    <Col :span="24">
      <Tabs :animated="false" v-model="systemActive" id="system-tab" @on-click="handleClick">
        <TabPane :label="$t('firstChoice')" name="first">
          <FirstChoice v-if="systemActive === 'first'"></FirstChoice>
        </TabPane>
        <TabPane :label="$t('popupNotice')" name="second">
          <PopupNotification v-if="systemActive === 'second'"></PopupNotification>
        </TabPane>
        <TabPane :label="$t('alarmSound')" name="third">
          <AlarmSound></AlarmSound>
        </TabPane>
        <TabPane :label="$t('userNotice')" name="userNotice">
          <userNotice v-if="systemActive === 'userNotice'" :resKeys="resKeys"></userNotice>
        </TabPane>
        <TabPane :label="$t('AppNotice')" name="sixth">
          <APPtication :category="1" v-if="systemActive === 'sixth'"></APPtication>
        </TabPane>
        <TabPane :label="$t('interfaceNotice')" name="seventh">
          <Notication :category="2" v-if="systemActive === 'seventh'"></Notication>
        </TabPane>
        <!-- 待更改 <el-col v-if="selected === $t('system.associatedAccount')" :span="20">
        <AssociatedAccount></AssociatedAccount>
      </el-col>
      <el-col v-if="selected === $t('system.underlay')" :span="20">
        <Underlay></Underlay>
      </el-col> -->
      </Tabs>
    </Col>
  </div>
</template>

<script>
  import FirstChoice from './FirstChoice.vue'
  import PopupNotification from './PopupNotification.vue'
  import AlarmSound from './AlarmSound.vue'
  import Notication from './Notication.vue'
  import APPtication from './Apptication.vue'
  import { queryPageAuth } from '@/api/public'
  import userNotice from './userNotice.vue'
  export default {
    name: 'safety',
    components: { APPtication, FirstChoice, PopupNotification, AlarmSound, Notication, userNotice },
    data() {
      return {
        systemActive: 'first',
        resKeys: false,
      }
    },
    mounted() {
      this.handlePageAuth()
    },
    methods: {
      handleClick() {},
      handlePageAuth() {
        let params = {
          resKeys: 'V5_PROJECT_USE',
          operKeys: 'RECHARGE_PROHIBITION',
        }
        queryPageAuth(params).then(res => {
          this.resKeys = res.data[0].result
        })
      },
    },
  }
</script>

<style></style>
