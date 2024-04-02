import { USER_ROLE } from '../../common/constants'
import { SCREEN_COMMON } from '../../router/router'

export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon?: string; accessibleRoles?: string[] }
  children?: INavigationRoute[]
}

const routes: INavigationRoute[] = [
  {
    name: SCREEN_COMMON.MENU_NAME.DASHBOARD,
    displayName: 'menu.dashboard',
    meta: {
      icon: 'vuestic-iconset-ui-elements',
      accessibleRoles: [USER_ROLE.ADMIN],
    },
  },
  {
    name: SCREEN_COMMON.MENU_NAME.ACCOUNT_USAGE_FEE,
    displayName: 'menu.account_usage_fee',
    meta: {
      icon: 'fa-thin fa-hand-holding-dollar',
      accessibleRoles: [USER_ROLE.ADMIN],
    },
  },
  {
    name: SCREEN_COMMON.MENU_NAME.ACCOUNT_BALANCE,
    displayName: 'menu.account_balance',
    meta: {
      icon: 'fa-regular fa-money-bill-wave',
      accessibleRoles: [USER_ROLE.ADMIN],
    },
  },
  {
    name: SCREEN_COMMON.MENU_NAME.BALANCE_MANAGER,
    displayName: 'menu.balance_manager',
    meta: {
      icon: 'account_balance_wallet',
      accessibleRoles: [USER_ROLE.ADMIN],
    },
  },
  {
    name: SCREEN_COMMON.MENU_NAME.SETTINGS,
    displayName: 'menu.settings',
    meta: {
      icon: 'fa-solid fa-gear',
      accessibleRoles: [USER_ROLE.ADMIN],
    },
    children: [
      {
        name: SCREEN_COMMON.MENU_NAME.CONTRACTOR_LIST,
        displayName: 'menu.contractor_list',
        meta: {
          accessibleRoles: [USER_ROLE.ADMIN],
        },
      },
      {
        name: SCREEN_COMMON.MENU_NAME.CLIENT_LIST,
        displayName: 'menu.client_list',
        meta: {
          accessibleRoles: [USER_ROLE.ADMIN],
        },
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACCOUNT_CONTRACTOR_LIST,
        displayName: 'menu.account_contractor_list',
        meta: {
          accessibleRoles: [USER_ROLE.ADMIN],
        },
      },
      {
        name: SCREEN_COMMON.MENU_NAME.ACCOUNT_LIST,
        displayName: 'menu.account_list',
        meta: {
          accessibleRoles: [USER_ROLE.ADMIN],
        },
      },
      {
        name: SCREEN_COMMON.MENU_NAME.BANK_LIST,
        displayName: 'menu.bank_list',
        meta: {
          accessibleRoles: [USER_ROLE.ADMIN],
        },
      },
      {
        name: SCREEN_COMMON.MENU_NAME.EXPENSE_LIST,
        displayName: 'menu.expense_list',
        meta: {
          accessibleRoles: [USER_ROLE.ADMIN],
        },
      },
      {
        name: SCREEN_COMMON.MENU_NAME.INTRODUCER_LIST,
        displayName: 'menu.introducer_list',
        meta: {
          accessibleRoles: [USER_ROLE.ADMIN],
        },
      },
    ],
  },
  {
    name: SCREEN_COMMON.MENU_NAME.ACTION_LOG,
    displayName: 'menu.action_log',
    meta: {
      icon: 'va-loading',
      accessibleRoles: [USER_ROLE.ADMIN],
    },
  },
  {
    name: SCREEN_COMMON.MENU_NAME.LOG_TASK,
    displayName: 'menu.log_task',
    meta: {
      icon: 'va-clear',
      accessibleRoles: [USER_ROLE.ADMIN],
    },
  },
  {
    name: SCREEN_COMMON.MENU_NAME.CLIENT_DASHBOARD,
    displayName: 'menu.client_dashboard',
    meta: {
      icon: 'vuestic-iconset-ui-elements',
      accessibleRoles: [USER_ROLE.CLIENT],
    },
  },
  {
    name: SCREEN_COMMON.MENU_NAME.CLIENT_BALANCE_INVOICE,
    displayName: 'menu.client_balance_invoce',
    meta: {
      icon: 'vuestic-iconset-files',
      accessibleRoles: [USER_ROLE.CLIENT],
    },
  },
  {
    name: SCREEN_COMMON.MENU_NAME.CLIENT_CHARGE_HISTORY,
    displayName: 'menu.client_charge_history',
    meta: {
      icon: 'paid',
      accessibleRoles: [USER_ROLE.CLIENT],
    },
  },
]

export default { routes }
