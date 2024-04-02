export const API = {
  AUTH: {
    COOKIE: '/sanctum/csrf-cookie',
    GET_TOKEN: '/api/get-token',
    LOGIN: '/login',
    USER_INFO: '/user/info',
  },
  ACCOUNT_FEE: {
    LIST: '/account-fee',
    EXPORT_PDF_ACCOUNT: '/export_pdf_account',
  },
  ACCOUNT_BALANCE: {
    LIST: '/api/get_list_account_balance',
    ADD_BALANCE_HISTORY: '/account_balance_history',
    EDIT_BALANCE_HISTORY: (id: string) => `/account_balance_history/${id}`,
  },
  EXPENSES: {
    LIST_BY_ID: (id: any) => `/expenses/${id}`,
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    DOWNLOAD_CSV: '/transactions',
  },
  ACCOUNT_NUMBER: {
    LIST_BY_ID: '/get_account_number_by_client',
  },
  MANAGEMENT_COMMON: {
    ACCOUNT: {
      LIST: (page: number) => `/accounts?page=${page}`,
      CREATE: '/accounts',
      UPDATE: (id: any) => `/accounts/${id}`,
      DETAIL: (id: any) => `/accounts/${id}`,
      DELETE: (id: any) => `/accounts/${id}`,
      CHECK_UNIQUE_ACCOUNT_NUMBER: '/check_unique_account_number',
    },
    BANK: {
      LIST_BY_ID: (param: any) => `/banks/${param}`,
      LIST_SELECT_BANK: '/get_list_bank_name',
      UPDATE: (id: any) => `/banks/${id}`,
      LIST_WITH_PAGINATE: (page: number) => `/banks?page=${page}`,
      DELETE: (id: any) => `/banks/${id}`,
    },
    CLIENT_DETAILS: {
      UPDATE: (id: any) => `/client_details/${id}`,
      CREATE: '/client_details',
      CHECK_CONTRACT_EXIST: '/check_contract_detail/',
      LIST_WITH_PAGINATE: (page: number, client: any) => `/client_details?client_id=${client}&page=${page}`,
      DELETE: (id: any) => `/client_details/${id}`,
    },
    CLIENT: {
      ALL: '/get_clients',
      LIST: '/clients',
      DETAILS: '/client_details',
      LIST_BY_CONTRACTOR: (id: any) => `/api/get_client_with_contractor/${id}`,
      LIST_BY_ID: (id: any) => `/clients/${id}`,
      CHECK_EMAIL_UNIQUE: '/check_unique_email_client',
      AGGREGATION_TODAY: '/get-client-aggregation-today',
      UPDATE: (id: any) => `/clients/${id}`,
      CHECK_UNIQUE_CLIENT_ID: '/check_unique_client_id',
    },
    CONTRACTOR: {
      LIST: '/contractors',
      ALL_LIST: '/list_contractors',
      DETAIL: (id: any) => `/contractors/${id}`,
      CHECK_EMAIL_UNIQUE: '/check_unique_email',
      UPDATE: (id: any) => `/contractors/${id}`,
      CREATE: '/contractors',
      LIST_WITH_PAGINATE: (page: number) => `/contractors?page=${page}&is_honsha=1`,
      DELETE: (id: any) => `/contractors/${id}`,
      SELECT_CONTRACTOR_ID: '/list_contractor_id/',
    },
    INTRODUCER: {
      CREATE: '/introducer',
      UPDATE: (id: any) => `/introducer/${id}`,
      CHECK_UNIQUE_EMAIL: '/check_unique_email_introducer',
      LIST_CONTRACTOR_BY_ID: (id: any) => `/api/get_introducer_with_contractor/${id}`,
    },
    EXPENSE: {
      UPDATE: (id: any) => `/expenses/${id}`,
      CREATE: '/expenses',
      LIST_WITH_PAGINATE: (page: any) => `/expenses?page=${page}`,
      DELETE: (id: any) => `/expenses/${id}`,
    },
    ACCOUNT_CONTRACTOR: {
      LIST_WITH_PAGINATE: (param: any) => `/contractors?page=${param}`,
    },
  },
  INVOICE: {
    GET_LIST: '/invoices',
    CREATE: '/invoices',
    UPDATE: (id: any) => `/invoices/${id}`,
    DOWNLOAD_PDF: '/export-pdf',
    CONTRUCTOR: '/invoice_contructor',
    CONTRUCTOR_UPDATE: (contractorId: number) => `/invoice_contructor/${contractorId}`,
    CHECK_INVOICE_NUMBER: (idContractor: number, number: string) =>
      `/api/check_invoice_contractor_number/${idContractor}/${number}`,
  },
  CHARGE_HISTORY: {
    GET_LIST: '/charge_history',
    CREATE: '/charge_history',
    UPDATE: (id: number) => `/charge_history/${id}`,
    DELETE: (id: number) => `/charge_history/${id}`,
  },
  BALANCE_MANAGER: {
    INCOME: '/income',
    EXPENDITURE: '/income-expenditure',
    CRUD_EXPENDITURE: (id: number) => `/income_expenditure/${id}`,
    DOWNLOAD_INCOME: (id: number) => `/export_income?id=${id}`,
  },
  ACTION_LOG: {
    GET_LIST_WITH_PAGINATE: (page: any) => `/task_management?page=${page}`,
    UPDATE: (id: number) => `/task_management/${id}`,
    UPDATE_STATUS: '/update_task_management',
  },
  LOG_TASK: {
    GET_LIST_WITH_PAGINATE: (page: any) => `/log_task?page=${page}`,
  },
}
