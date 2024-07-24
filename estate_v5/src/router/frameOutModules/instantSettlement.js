export default [
  {
    path: '/instantSettlement/user-page',
    name: 'instant_settlement_user_page',
    meta: { title: '$t:userList', closable: true, isFrame: true },
    component: () => import('@/pages/billingSystem/instantSettlement/iframe/userPage.vue'),
  },
  {
    path: '/instantSettlement/obj-list',
    name: 'instant_settlement_obj_list',
    meta: { title: '$t:listOfInstantSettlementObjects', closable: true, isFrame: true },
    component: () => import('@/pages/billingSystem/instantSettlement/iframe/objList.vue'),
  },
  {
    path: '/instantSettlement/user-list',
    name: 'instant_settlement_user_list',
    meta: { title: '$t:userList', closable: true, isFrame: true },
    component: () => import('@/pages/billingSystem/instantSettlement/iframe/userList.vue'),
  },
  {
    path: '/instantSettlement/consume-list',
    name: 'instant_settlement_consume_list',
    meta: { title: '$t:overviewOfConsumptionRecords', closable: true, isFrame: true },
    component: () => import('@/pages/billingSystem/instantSettlement/iframe/consumeList.vue'),
  },
  {
    path: '/instantSettlement/recharge-list',
    name: 'instant_settlement_recharge_list',
    meta: { title: '$t:overviewOfRechargeRecords', closable: true, isFrame: true },
    component: () => import('@/pages/billingSystem/instantSettlement/iframe/rechargeList.vue'),
  },
  {
    path: '/instantSettlement/refund-list',
    name: 'instant_settlement_refund_list',
    meta: { title: '$t:overviewOfRefundRecords', closable: true, isFrame: true },
    component: () => import('@/pages/billingSystem/instantSettlement/iframe/refundList.vue'),
  },

  {
    path: '/instantSettlement/user-consume-list',
    name: 'instant_settlement_user_consume_list',
    meta: { title: '$t:userConsumptionRecords', closable: true, isFrame: true },
    component: () => import('@/pages/billingSystem/instantSettlement/iframe/userConsumeList.vue'),
  },
  {
    path: '/instantSettlement/user-recharge-list',
    name: 'instant_settlement_user_recharge_list',
    meta: { title: '$t:userRechargeRecords', closable: true, isFrame: true },
    component: () => import('@/pages/billingSystem/instantSettlement/iframe/userRechargeList.vue'),
  },
  {
    path: '/instantSettlement/user-refund-list',
    name: 'instant_settlement_user_refund_list',
    meta: { title: '$t:userRefundRecords', closable: true, isFrame: true },
    component: () => import('@/pages/billingSystem/instantSettlement/iframe/userRefundList.vue'),
  },
]
