export interface TransactionListParams {
  from_date: string
  to_date: string
  group_by_month?: 0 | 1
  group_by_date?: 0 | 1
  group_by_year?: 0 | 1
  is_sum?: number
  client_id?: number
}

export interface Transaction<Type> {
  client_id: number
  type: Type
  date: string
  month: string
  amount: string
  number_trans: string
  settlement_amount: string
  settlement_fee: string
  number_refunds: string
  refund_amount: string
  refund_fee: string
  charge_amount: string
  charge_fee: string
  transfer_amount: string
  system_usage_fee: string
  account_balance: number
}

export interface TransactionListResponseData {
  deposit: {
    [clientId: number]: Transaction<1>[]
  }
  deposit_aggregation_by_client: {
    balance: number
    number_trans: number
    amount: number
    system_usage_fee: number
    account_fee: number
  }
  withdrawals: {
    [clientId: number]: Transaction<2>[]
  }
  withdrawals_aggregation_by_client: {
    balance: number
    number_trans: number
    amount: number
    system_usage_fee: number
    account_fee: number
  }
}

export interface CSVListParams {
  from_date: string
  to_date: string
  csv: 1
  filter_type: string
  filter_date: string
  client_id: string
  language: string
  group_by_month?: 0 | 1
  group_by_date?: 0 | 1
  group_by_year?: 0 | 1
}
