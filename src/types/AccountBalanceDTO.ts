export interface AccountBalanceDTO {
  bank_name: string | null
  client_id: number
  represent_name: string | null
  account_number: string
  account_holder: string | null
  branch_name: string | null
  representative_account: string | null
  balance: string
  date_history: string | null
}

export interface AccountBalanceHistory {
  account_number: string
  date_history: string
  balance: string
  client_id: string
}

export interface QueryParamsListAccountBalance {
  from_date: string
  to_date: string
}
