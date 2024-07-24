/**
 * 注册、登录、注销
 * */
import util from '@/libs/util'
import Setting from '@/setting'
import { AccountLogin, AccountLogout } from '@api/account'
import { clearCache } from '@/untils/cache'
import { Modal } from 'view-design'
import { projectIndexDB, diagramIndexedDB, diagramPreviewIndexDB } from '@/plugins/indexDB/index'
export default {
  namespaced: true,
  actions: {
    /**
     * @description 登录
     * @param {Object} param context
     * @param {Object} param username {String} 用户账号
     * @param {Object} param password {String} 密码
     * @param {Object} param route {Object} 登录成功后定向的路由对象 任何 vue-router 支持的格式
     */
    login({ dispatch }, { edition = '', loginName = '', password = '', checkCode = '', authLoginFlag = '' } = {}) {
      return new Promise((resolve, reject) => {
        // 开始请求登录接口
        AccountLogin({
          edition,
          loginName,
          password,
          checkCode,
          authLoginFlag,
        })
          .then(async res => {
            // 设置 cookie 一定要存 uuid 和 token 两个 cookie
            // 整个系统依赖这两个数据进行校验和存储
            // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
            // token 代表用户当前登录状态 建议在网络请求中携带 token
            // 如有必要 token 需要定时更新，默认保存一天，可在 setting.js 中修改
            // 如果你的 token 不是通过 cookie 携带，而是普通字段，也可视情况存储在 localStorage
            // var storage = window.sessionStorage; //已经迁移到loading组件进行保存token
            // storage.setItem('uuid', res.data.uuid);
            // storage.setItem('token', res.data.token);
            // util.cookies.set('uuid', res.data.uuid);
            // util.cookies.set('token', res.data.token);
            // 设置 vuex 用户信息
            await dispatch('admin/user/set', res.data.info, { root: true })
            // 用户登录后从持久化数据加载一系列的设置
            await dispatch('load', { loadOpenedTabs: Setting.page.loadOpenedTabs })
            // 结束
            resolve(res)
          })
          .catch(err => {
            //
            reject(err)
          })
      })
    },
    /**
     * @description 退出登录
     * */
    logout({ commit, dispatch }, { confirm = false, vm } = {}) {
      if (confirm) {
        Modal.confirm({
          // title: vm.$t('basicLayout.logout.confirmTitle'),
          // content: vm.$t('basicLayout.logout.confirmContent'),
          title: window.$t('logoutConfirm'),
          content: window.$t('logoutTips'),
          onOk() {
            AccountLogout({}).then(res => {
              if (res.code === '0') {
                util.cookies.remove('token')
                util.cookies.remove('uuid')
                // 清空自动登录信息
                window.localStorage.removeItem('autoLogin')
                // 清空 vuex 用户信息
                dispatch('admin/user/set', {}, { root: true })
                clearCache()
                // 清空indexDB
                projectIndexDB.clear()
                diagramIndexedDB.clear()
                diagramPreviewIndexDB.clear()
                // 跳转路由
                if (res.data.backurl) {
                  window.location.href = res.data.backurl
                  return
                }
                window.location.href = '/login'
              }
            })
          },
        })
      }
    },
    /**
    //  * @description 注册
    //  * @param {Object} param context
    //  * @param {Object} param mail {String} 邮箱
    //  * @param {Object} param password {String} 密码
    //  * @param {Object} param mobile {String} 手机号码
    //  * @param {Object} param captcha {String} 验证码
    //  */
    // register ({ dispatch }, {
    //     mail = '',
    //     password = '',
    //     mobile = '',
    //     captcha = ''
    // } = {}) {
    //     return new Promise((resolve, reject) => {
    //         // 开始请求登录接口
    //         AccountRegister({
    //             mail,
    //             password,
    //             mobile,
    //             captcha
    //         })
    //             .then(async res => {
    //                 // 注册成功后，完成与登录一致的操作
    //                 // 注册也可视情况不返还 uuid、token 等数据，在注册完成后，由前端自动执行一次登录逻辑
    //                 util.cookies.set('uuid', res.uuid);
    //                 util.cookies.set('token', res.token);
    //                 // 设置 vuex 用户信息
    //                 await dispatch('admin/user/set', res.info, { root: true });
    //                 // 用户登录后从持久化数据加载一系列的设置
    //                 await dispatch('load');
    //                 // 结束
    //                 resolve();
    //             })
    //             .catch(err => {
    //                 //
    //                 reject(err);
    //             })
    //     })
    // },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} state vuex state
     * @param {Object} dispatch vuex dispatch
     * @param {Object} loadOpenedTabs 是否加载页签信息
     */
    load({ state, dispatch }, { loadOpenedTabs = true } = {}) {
      return new Promise(async resolve => {
        // 加载用户登录信息
        await dispatch('admin/user/load', null, { root: true })
        // 持久化数据加载上次退出时的多页列表
        await dispatch('admin/page/openedLoad', { loadOpenedTabs }, { root: true })
        // end
        resolve()
      })
    },
  },
}
