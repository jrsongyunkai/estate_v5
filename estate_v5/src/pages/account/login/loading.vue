<template>
  <div class="loading">
    <div class="load">
      <Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="50" />
      <div class="load-text">{{ $t('loadingTxt') }}</div>
    </div>
  </div>
</template>
<script>
  import { getGblinfo, getProject, loginRedirect, getindividual } from '@/api/account'
  import { switchToProject } from '@/api/console/project.js'
  import { felist, hasSetSecondPwd, findStaffInfo } from '@/api/public'
  import { projectIndexDB, diagramIndexedDB, diagramPreviewIndexDB } from '@/plugins/indexDB/index'
  import store from '@/store'
  export default {
    data() {
      return {
        dataList: [],
      }
    },
    methods: {
      handleVersion() {
        felist({}).then(res => {
          if (res.datas.length > 0) {
            store.commit('versionStatus', true)
          } else {
            store.commit('versionStatus', false)
          }
        })
      },
      handleVersionNum() {
        let params = { alwaysShow: '1' }
        felist(params).then(res => {
          if (res.success) {
            store.commit('versionNum', res.datas[0].version)
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleindividual() {
        let params = { edition: 'ESTATE_V5_SPECIAL' }
        let server = window.location.host.toLowerCase()
        if (server.indexOf('snd01.com') !== -1 || server.indexOf('snd02.com') !== -1 || server.indexOf('dunsys.com') !== -1 || server.indexOf('sndtest.com') !== -1) {
          let splitItems = server.split('.')
          if (splitItems.length === 3 && splitItems[0].length >= 6) {
            params.IDENTITY = splitItems[0]
            params.edition = 'ESTATE_V5_SPECIAL'
            this.edition = 'ESTATE_V5_SPECIAL'
            this.extend = 'special'
          } else {
            params.edition = 'ESTATE_V5'
            this.edition = 'ESTATE_V5'
            this.extend = 'Notspecial'
          }
          store.commit('extend', this.extend)
        }
        getindividual(params).then(r => {
          if (r.success) {
            store.commit('individual', r.data)
          } else {
            this.$Message.error({ content: r.message })
          }
        })
      },
      handlePassword() {
        findStaffInfo()
          .then(res => {
            if (res.success) {
              store.commit('mobile', res.data.mobile)
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({ content: this.$t('unknown') })
            }
          })
      },
      handlelinfo() {
        getGblinfo().then(r => {
          //   往sessionStorage中添加全局参数
          var res = r.data
          var storage = window.sessionStorage
          store.commit('localdeplyoy', res.LOCALDEPLOY)
          storage.setItem('PROJECT_GROUP', res.PROJECT_GROUP)
          storage.setItem('baiduOfflinemapMaxzoom', res.baiduOfflinemapMaxzoom)
          storage.setItem('gblEdition', res.gblEdition)
          storage.setItem('googleKey', res.googleKey)
          storage.setItem('isLogin', res.isLogin)
          storage.setItem('isMaster', res.isMaster)
          storage.setItem('realName', res.realName)
          storage.setItem('staffName', res.staffName)
          storage.setItem('useMap', res.useMap)
          storage.setItem('isFuTian', res.isFuTian || '')
          storage.setItem('isUnlockAndOpen', res.isUnlockAndOpen || '')
          storage.setItem('isInstantPowerPriority', res.isInstantPowerPriority || '')
          store.commit('staffName', res.staffName)
          store.commit('realName', res.info.name)
          store.commit('baiduKey', res.baiduKey)
          store.commit('googleKey', res.googleKey)
          store.commit('baiduStyleId', res.baiduStyleId === undefined ? '' : res.baiduStyleId)
          store.commit('personalBaiduOfflineMapLevel', res.personalBaiduOfflineMapLevel || 10)
          store.commit('isOpenPrjGrpHourPowerStat', res.isOpenPrjGrpHourPowerStat) // 获取是否开启项目、分组小时电量统计
          if (res.baiduKey) {
            let script2 = document.createElement('script')
            script2.type = 'text/javascript'
            script2.src = document.location.protocol + '//api.map.baidu.com/api?v=3.0&ak=' + res.baiduKey + '&callback=bMapInit2'
            document.head.appendChild(script2)
          }
          //  接口请求刷新时间
          function storageObj(obj) {
            var checkedIdStr = JSON.stringify(obj) // 转为字符串存入sessionStorage
            storage.setItem('checkedIdStr', checkedIdStr)
          }
          storage.setItem('uuid', res.uuid)
          storage.setItem('token', res.wsPushToken)
          var Interval = res.pollingInterval
          storageObj(Interval)
          this.handlePassword()
        })
      },
      // 获取所有项目
      async handleProject() {
        let params = { projectName: '', provinceId: '', cityId: '', countyId: '', statsAlarm: '2' }
        let r = await getProject(params)
        await projectIndexDB.clear()
        await projectIndexDB.setItem('checkedProjectStr', JSON.stringify(r.data))
        store.commit('devHis', true)
        this.loginRedirect()
      },
      handleLodin() {
        diagramIndexedDB.clear()
        diagramPreviewIndexDB.clear()
        this.handlelinfo()
        this.handleProject()
      },
      loginRedirect() {
        loginRedirect().then(res => {
          if (res.code === '0') {
            if (res.data.targetProjectCode === '') {
              this.$router.replace(this.$route.query.redirect || '/visualScreen')
            } else {
              store.commit('projectCode', res.data.targetProjectCode)
              switchToProject({
                projectCode: res.data.targetProjectCode,
              }).then(res => {
                if (res.success) {
                  store.commit('prjTitle', res.data.prjTitle)
                  store.commit('prjName', res.data.prjName)
                  store.commit('projects', res.data.prjCode)
                  store.commit('switchData', res.data)
                  this.$router.replace({ path: '/console/project' })
                }
              })
            }
          } else {
            this.$Message.error({
              duration: 3,
              render: h => {
                return h('span', { style: { fontSize: '20px' } }, [this.$t('youNotHaveAccess')])
              },
            })
            this.$router.replace({ path: '/login' })
          }
        })
      },
      checkIsSetSecondPwd() {
        hasSetSecondPwd().then(res => {
          if (res.success) {
            if (res.data === 0) {
              store.commit('setSecondPwds', false)
            } else if (res.data === 1) {
              store.commit('setSecondPwds', true)
            }
          }
        })
      },
    },

    mounted() {
      store.dispatch('pageAuth/getPageAuth')
      this.handleindividual()
      this.handleLodin()
      this.handleVersion()
      this.handleVersionNum()
      this.checkIsSetSecondPwd()
      if (!this.$store.state.baiduKey && !this.$store.state.googleKey) {
        console.log('请在后管配置地图')
      }
    },
  }
</script>

<style lang="less" scoped>
  .loading {
    background: url('../../../assets/images/loading.png') no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .load {
      text-align: center;
      .load-text {
        margin-top: 20px;
        width: 100%;
        font-size: 20px;
      }
    }
  }
</style>
