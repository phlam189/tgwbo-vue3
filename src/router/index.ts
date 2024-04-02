import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import Page404Layout from '../layouts/Page404Layout.vue'
import { useGlobalStore } from '../stores/global-store'
import { USER_ROLE } from '../common/constants'
import { SCREEN_COMMON } from './router'

const routes: Array<RouteRecordRaw> = [
  {
    path: SCREEN_COMMON.MENU.CATCH_ALL,
    redirect: { name: SCREEN_COMMON.MENU_NAME.DASHBOARD },
  },
  {
    name: SCREEN_COMMON.MENU_NAME.ADMIN,
    path: SCREEN_COMMON.MENU.ADMIN,
    component: AppLayout,
    meta: {
      accessibleRoles: [USER_ROLE.ADMIN],
    },
    children: [
      {
        name: SCREEN_COMMON.MENU_NAME.DASHBOARD,
        path: SCREEN_COMMON.MENU.DASHBOARD,
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACCOUNT_BALANCE,
        path: SCREEN_COMMON.MENU.ACCOUNT_BALANCE,
        component: () => import('../pages/admin/account-balance-management/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACCOUNT_USAGE_FEE,
        path: SCREEN_COMMON.MENU.ACCOUNT_USAGE_FEE,
        component: () => import('../pages/admin/account-usage-fee/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.BANK_LIST,
        path: SCREEN_COMMON.MENU.BANK_LIST,
        component: () => import('../pages/admin/bank-management/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.BANK_ADD,
        path: SCREEN_COMMON.MENU.BANK_ADD,
        component: () => import('../pages/admin/bank-management/Add.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.BANK_EDIT,
        path: SCREEN_COMMON.MENU.BANK_EDIT,
        component: () => import('../pages/admin/bank-management/Edit.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACCOUNT_LIST,
        path: SCREEN_COMMON.MENU.ACCOUNT_LIST,
        component: () => import('../pages/admin/account-management/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACCOUNT_ADD,
        path: SCREEN_COMMON.MENU.ACCOUNT_ADD,
        component: () => import('../pages/admin/account-management/Add.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACCOUNT_EDIT,
        path: SCREEN_COMMON.MENU.ACCOUNT_EDIT,
        component: () => import('../pages/admin/account-management/Edit.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.INTRODUCER_LIST,
        path: SCREEN_COMMON.MENU.INTRODUCER_LIST,
        component: () => import('../pages/admin/introducer-management/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.INTRODUCER_ADD,
        path: SCREEN_COMMON.MENU.INTRODUCER_ADD,
        component: () => import('../pages/admin/introducer-management/Add.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.INTRODUCER_EDIT,
        path: SCREEN_COMMON.MENU.INTRODUCER_EDIT,
        component: () => import('../pages/admin/introducer-management/Edit.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CLIENT_LIST,
        path: SCREEN_COMMON.MENU.CLIENT_LIST,
        component: () => import('../pages/admin/client-management/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CLIENT_ADD,
        path: SCREEN_COMMON.MENU.CLIENT_ADD,
        component: () => import('../pages/admin/client-management/Add.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CLIENT_EDIT,
        path: SCREEN_COMMON.MENU.CLIENT_EDIT,
        component: () => import('../pages/admin/client-management/Edit.vue'),
        props: true,
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CONTRACTOR_LIST,
        path: SCREEN_COMMON.MENU.CONTRACTOR_LIST,
        component: () => import('../pages/admin/contractor-management/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CONTRACTOR_ADD,
        path: SCREEN_COMMON.MENU.CONTRACTOR_ADD,
        component: () => import('../pages/admin/contractor-management/Add.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CONTRACTOR_EDIT,
        path: SCREEN_COMMON.MENU.CONTRACTOR_EDIT,
        component: () => import('../pages/admin/contractor-management/Edit.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACCOUNT_CONTRACTOR_LIST,
        path: SCREEN_COMMON.MENU.ACCOUNT_CONTRACTOR_LIST,
        component: () => import('../pages/admin/account_contractor_management/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACCOUNT_CONTRACTOR_ADD,
        path: SCREEN_COMMON.MENU.ACCOUNT_CONTRACTOR_ADD,
        component: () => import('../pages/admin/account_contractor_management/Add.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACCOUNT_CONTRACTOR_EDIT,
        path: SCREEN_COMMON.MENU.ACCOUNT_CONTRACTOR_EDIT,
        component: () => import('../pages/admin/account_contractor_management/Edit.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.EXPENSE_LIST,
        path: SCREEN_COMMON.MENU.EXPENSE_LIST,
        component: () => import('../pages/admin/expense-management/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.EXPENSE_ADD,
        path: SCREEN_COMMON.MENU.EXPENSE_ADD,
        component: () => import('../pages/admin/expense-management/Add.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.EXPENSE_EDIT,
        path: SCREEN_COMMON.MENU.EXPENSE_EDIT,
        component: () => import('../pages/admin/expense-management/Edit.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CONTRACT_DETAIL_LIST,
        path: SCREEN_COMMON.MENU.CONTRACT_DETAIL_LIST,
        component: () => import('../pages/admin/client-detail-management/List.vue'),
        props: true,
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CONTRACT_DETAIL_ADD,
        path: SCREEN_COMMON.MENU.CONTRACT_DETAIL_ADD,
        component: () => import('../pages/admin/client-detail-management/Add.vue'),
        props: true,
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CONTRACT_DETAIL_EDIT,
        path: SCREEN_COMMON.MENU.CONTRACT_DETAIL_EDIT,
        component: () => import('../pages/admin/client-detail-management/Edit.vue'),
        props: true,
      },
      {
        name: SCREEN_COMMON.MENU_NAME.BALANCE_MANAGER,
        path: SCREEN_COMMON.MENU.BALANCE_MANAGER,
        component: () => import('../pages/admin/balance-manager/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.BLANK,
        path: SCREEN_COMMON.MENU.BLANK,
        component: () => import('../pages/Blankpage.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CHART,
        path: SCREEN_COMMON.MENU.CHART,
        component: () => import('../pages/admin/Chart.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.DEMO,
        path: SCREEN_COMMON.MENU.DEMO,
        component: () => import('../pages/Demo.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACTION_LOG,
        path: SCREEN_COMMON.MENU.ACTION_LOG,
        component: () => import('../pages/admin/action-log-management/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.LOG_TASK,
        path: SCREEN_COMMON.MENU.LOG_TASK,
        component: () => import('../pages/admin/log-task/List.vue'),
      },
    ],
  },
  {
    name: SCREEN_COMMON.MENU_NAME.CLIENT,
    path: SCREEN_COMMON.MENU.CLIENT,
    component: AppLayout,
    meta: {
      accessibleRoles: [USER_ROLE.CLIENT],
    },
    children: [
      {
        name: SCREEN_COMMON.MENU_NAME.CLIENT_DASHBOARD,
        path: SCREEN_COMMON.MENU.DASHBOARD,
        component: () => import('../pages/client/dashboard/Dashboard.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CLIENT_BALANCE_INVOICE,
        path: SCREEN_COMMON.MENU.BALANCE_INVOICE,
        component: () => import('../pages/client/balance-invoce/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CLIENT_BALANCE_MANAGER,
        path: SCREEN_COMMON.MENU.BALANCE_MANAGER,
        component: () => import('../pages/client/balance-manager/List.vue'),
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CLIENT_CHARGE_HISTORY,
        path: SCREEN_COMMON.MENU.CHARGE_HISTORY,
        component: () => import('../pages/client/charge-history/List.vue'),
      },
    ],
  },
  {
    path: SCREEN_COMMON.MENU.AUTH,
    component: AuthLayout,
    children: [
      {
        name: SCREEN_COMMON.MENU.LOGIN,
        path: SCREEN_COMMON.MENU.LOGIN,
        component: () => import('../pages/auth/login/Login.vue'),
      },
      {
        path: '',
        redirect: { name: SCREEN_COMMON.MENU.LOGIN },
      },
    ],
  },
  {
    path: SCREEN_COMMON.MENU.LOGIN_BUTTON,
    name: SCREEN_COMMON.MENU_NAME.LOGIN_BUTTON,
    component: () => import('../pages/auth/login/LoginButton.vue'),
  },
  {
    path: SCREEN_COMMON.MENU._404,
    component: Page404Layout,
    children: [
      {
        name: SCREEN_COMMON.MENU.NOT_FOUND_SIMPLE,
        path: SCREEN_COMMON.MENU.NOT_FOUND_SIMPLE,
        component: () => import('../pages/404-pages/VaPageNotFoundSimple.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //  mode: process.env.VUE_APP_ROUTER_MODE_HISTORY === 'true' ? 'history' : 'hash',
  routes,
})

router.beforeEach((to, from, next) => {
  const meta = to.meta
  const accessibleRoles = meta.accessibleRoles as string[]

  if (!accessibleRoles || !accessibleRoles.length) {
    return next()
  }

  const globalStore = useGlobalStore()

  const userRole = globalStore.role

  if (!userRole) {
    return next({ name: SCREEN_COMMON.MENU_NAME.LOGIN_BUTTON })
  }

  if (accessibleRoles.includes(userRole)) {
    return next()
  }

  if (userRole === USER_ROLE.ADMIN) {
    return next({ name: SCREEN_COMMON.MENU_NAME.DASHBOARD })
  }

  if (userRole === USER_ROLE.CLIENT) {
    return next({ name: SCREEN_COMMON.MENU_NAME.CLIENT_DASHBOARD })
  }

  next()
})

export default router
