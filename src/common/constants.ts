// import { useI18n } from 'vue-i18n'
// export const { t } =  useI18n()

export const YYYY_MM_DD_HH_MM_SS = 'YYYY-MM-DD HH:mm:ss'

export const ERROR_DATE = '0000-00-00 00:00:00'

export const ERROR_DATE_STRING = '0000-00-00'

export const YYYY_MM_DD = 'YYYY/MM/DD'

export const YYYYMMDD = 'YYYYMMDD'

export const D_MMM_YYYY = 'D MMM YYYY'

export const YYYY_MM_01 = 'YYYY-MM-01'

export const YYYY_MM_DD_SLASH = 'YYYY/MM/DD'

export const YYYY_M_D_JP = 'YYYY年M月D日'

export const MMM_YYYY = 'MMM YYYY'

export const YYYY_M_JP = 'YYYY年M月'

export const MMM = 'MMM'

export const M_JP = 'M月'

export const MM_DD_SLASH = 'MM/DD'

export const MONTH_ENGLISH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const MONTH_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export const WEEKDAY_NAMES = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa']

export const CHARGE_HISTORY_TYPE = {
  SETTLEMENT: 0,
  REFUND: 1,
  TRANSFER: 2,
  CHARGE: 3,

  INTEREST: 4,
  MISC: 5,
  BORROWING: 6,
  REPAYMENT: 7,
  DEPOSITS_AND_WITHDRAWALS: 8,
}

export const CHARGE_HISTORY_TYPE_TEXT = {
  SETTLEMENT: 'dashboard.settlement',
  REFUND: 'dashboard.refund',
  TRANSFER: 'dashboard.transfer_of_funds',
  CHARGE: 'dashboard.deposit_charge',

  INTEREST: 'dashboard.interest',
  MISC: 'dashboard.misc',
  BORROWING: 'dashboard.borrowing',
  REPAYMENT: 'dashboard.repayment',
  DEPOSITS_AND_WITHDRAWALS: 'dashboard.deposits_and_withdrawals',
}

export const LIST_LOWER_CASE = [
  'dashboard.settlement',
  'dashboard.refund',
  'dashboard.transfer_of_funds',
  'dashboard.deposit_charge',
  'dashboard.interest',
  'dashboard.misc',
  'dashboard.borrowing',
  'dashboard.repayment',
  'dashboard.deposits_and_withdrawals',
]

export const USER_ROLE = {
  ADMIN: 'admin',
  CLIENT: 'client',
  MERCHANT: 'merchant',
}

export const DEPOSIT_AND_WITHDRAWAL_CODE = {
  DEPOSIT: 1,
  WITHDRAWAL: 2,
  ALL: 0,
}

export const DEPOSIT_AND_WITHDRAWAL_TEXT = {
  DEPOSIT: 'payment',
  WITHDRAWAL: 'withdrawal',
  ALL: 'deposits_and_withdrawals',
}

export const DEPOSIT_AND_WITHDRAWALS = [
  {
    code: DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT,
    text: DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT,
  },
  {
    code: DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL,
    text: DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL,
  },
  {
    code: DEPOSIT_AND_WITHDRAWAL_CODE.ALL,
    text: DEPOSIT_AND_WITHDRAWAL_TEXT.ALL,
  },
]

export const LANGUAGES = {
  GLOBAL: 'gb',
  JAPANESE: 'jp',
}

export const PRESENSE_TYPE = {
  HAVE: 1,
  NONE: 0,
}

export const SERVICE_TYPE = {
  DEPOSIT: 1,
  WITHDROW: 2,
  OTHER: 3,
}

export const MIMIMUM_TYPE = {
  CAN_BE: 1,
  NONE: 2,
}

export const TRANSFER_FEE_TYPE = {
  CAN_BE: 1,
  NONE: 0,
}

export const REFERRAL_CLASSIFICATION_TYPE = {
  CLIENT: 1,
  ACCOUNT: 2,
}

export const CONTRACT_METHOD_TYPE = {
  FLAT: 0,
  SLIDE: 1,
}

export const LOCAL_STORAGE_KEYS = {
  LANGUAGE: 'language',
}

export const DATE_PICKER_TYPES = {
  YEAR: 'year',
  MONTH: 'month',
  DAY: 'day',
  TODAY: 'today',
  PERIOD: 'period',
}

export const COMPANY_TYPE = {
  NONE: 0,
  FORMER_STOCK: 1,
  BACK_STOCK: 2,
  FRONT: 3,
  BACK: 4,
  PREEXISTING: 5,
  LATER: 6,
}

export const CATEGORY_NAME = {
  DEPOSIT: 'Deposit',
  WITHDROW: 'Withdrawal',
  OTHER: 'Other',
}

export const STATUS_TASK_MANAGEMENT = {
  RUNNING: {
    VALUE: 1,
    COLOR: '#004AFF',
  },
  SUCCESS: {
    VALUE: 2,
    COLOR: '#08AF19',
  },
  FAIL: {
    VALUE: 3,
    COLOR: '#BC0909',
  },
}

export const MAX_AMOUNT_NULL = '残りの金額'

export const CHARGE_HISTORY_PAYMENT_AMOUNT_MAX_LENGTH = 9

export const CHARGE_HISTORY_CHARGE_FEE_MAX_LENGTH = 7

export const BALANCE_BALANCE_ENTRY_HISTORY = 9

export const INVOICE_NUMBER_MAX_LENGTH = 15
export const INVOICE_NOTE_MAX_LENGTH = 255

export const NUMBER_MAX_LENGTH = 9

export const STRING_MAX_LENGTH = 30

// export const SELECT_CONTRACT_METHOD = [
//   {
//     text: t('client_detail.flat'),
//     value: CONTRACT_METHOD_TYPE.FLAT
//   },
//   {
//     text: t('client_detail.slide'),
//     value: CONTRACT_METHOD_TYPE.SLIDE
//   },
// ]

// export const SELECT_MINIMUM = [
//   {
//     text: t('client_detail.can_be'),
//     value: MIMIMUM_TYPE.CAN_BE
//   },
//   {
//     text: t('client_detail.none'),
//     value: MIMIMUM_TYPE.NONE
//   },
// ]

// export const SELECT_SERVICE_TYPE = [
//   {
//     text: t('client_detail.deposit'),
//     value: SERVICE_TYPE.DEPOSIT
//   },
//   {
//     text: t('client_detail.withdrow'),
//     value: SERVICE_TYPE.WITHDROW
//   },
//   {
//     text: t('client_detail.both'),
//     value: SERVICE_TYPE.BOTH
//   },
// ]

// export const SELECT_TRANSFER_FEE = [
//   {
//     text: t('client_detail.can_be'),
//     value: TRANSFER_FEE_TYPE.CAN_BE
//   },
//   {
//     text: t('client_detail.none'),
//     value: TRANSFER_FEE_TYPE.NONE
//   },
// ]

export const EMAIL_LOGIN = {
  ADMIN: 'admin-bap@tiger-gateway.com',
  CLIENT_3: 'finance@kuma-gaming.com',
  CLIENT_20: 'finance@eldoah.com',
  CLIENT_44: 'vegawallet55@gmail.com',
  CLIENT_101: 'kazuhiro.aoyama@welltreasuretech.com',
}

export const KINDS_TYPE = {
  BORROWING_DEPOSIT_ACCOUNT: 'borrowing_deposit_account',
  BORROWING_WITHDRAWAL_ACCOUNT: 'borrowing_withdrawal_account',
  REPAYMENT_DEPOSIT_ACCOUNT: 'repayment_deposit_account',
  REPAYMENT_WITHDRAWAL_ACCOUNT: 'repayment_withdrawal_account',
  WITHDRAWAL: 'withdrawal',
}

export const TYPE_SETTING_COLUMNS = {
  ACCOUNT_TRANSFER: 'account_transfer',
  OTHER_CHARGE: 'other_charge',
  SETTLEMENT: 'settlement',
}

export const ERROR_CODE = {
  NONE_CONTRACTOR_ID: 'The contractor id field is required.',
  ADM_005: [
    {
      KEY: 'invalid_presense',
      MESSAGE: 'The presence field must be true or false.',
    },
  ],
}

export const ITEM_TYPE_LIST = {
  ACCOUNT_FEE_DEPOSIT: 1,
  ACCOUNT_FEE_WITHDRAWAL: 2,
  OUTSOURCING_FEE: 3,
  REFERRAL_FEE_CLIENT: 4,
  REFERRAL_FEE_ACCOUNT: 5,
  OTHER_EXPENSES: 6,
  MONTHLY_FEE_DEPOSIT: 7,
  MONTHLY_FEE_WITHDRAWAL: 8,
}

export const ITEM_TYPE_LIST_TEXT = {
  ACCOUNT_USAGE_FEE: 'balance_manager.account_usage_fee',
  OUTSOURCING_FEE: 'balance_manager.outsourcing_fee',
  REFERRAL_FEE: 'balance_manager.referal_fee',
  OTHER_EXPENSES: 'balance_manager.expense_other',
  MONTHLY_USAGE_FEE: 'balance_manager.monthly_usage_fee',
}

export const ITEM_TYPE_LIST_TEXT_EN = {
  ACCOUNT_USAGE_FEE: 'Account usage fee',
  OUTSOURCING_FEE: 'Outsourcing fee',
  REFERRAL_FEE: 'Referral fee',
  OTHER_EXPENSES: 'Other expenses',
  MONTHLY_USAGE_FEE: 'Monthly usage fee',
}

export const ITEM_TYPE_LIST_TEXT_JP = {
  ACCOUNT_USAGE_FEE: '口座利用料',
  OUTSOURCING_FEE: '業務委託料',
  REFERRAL_FEE: '紹介手数料',
  OTHER_EXPENSES: 'その他経費',
  MONTHLY_USAGE_FEE: '月額利用料',
}

export const CLASS_LIST_TEXT = {
  CLIENT: 'introducer.client',
  ACCOUNT: 'introducer.account',
}

export const CLASS_LIST_TEXT_EN = {
  CLIENT: 'Client',
  ACCOUNT: 'Account',
}

export const TYPE_LIST_TEXT = {
  DEPOSIT_ACCOUNT: 'balance_manager.deposit_account',
  WITHDRAWAL_ACCOUNT: 'balance_manager.withdrawal_account',
}

export const TYPE_LIST_TEXT_EN = {
  DEPOSIT_ACCOUNT: 'Deposit Account',
  WITHDRAWAL_ACCOUNT: 'Withdrawal Account',
}
