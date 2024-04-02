import { ResponseData } from './Api'

export interface ChargeHistoryItem {
  id: number
  client_aggregation_id: number
  client_id: number
  type: number
  payment_amount: string
  transfer_amount: string
  bank_name: string
  branch_name: string
  represent_name: string
  account_holder: string
  charge_fee: string
  memo: string
  create_date: string
  created_at: string
  updated_at: string
  type_client_aggregation?: number
  kinds?: string
  memo_internal: string
  account_number: string | undefined
  actual_balance: string
}

export interface ChargeHistoryCreationParams {
  id?: number
  client_id: number
  client_aggregation_id: number
  type: number
  type_client_aggregation: number
  payment_amount: string
  transfer_amount: string
  charge_fee: number | string
  memo: string
  memo_internal: string
  create_date: string
  account_number: string | undefined
}

export interface ChargeHistoryGetParams {
  client_id?: string | number
  from_date: string
  to_date: string
  loan?: number
  page?: number
  all_type?: number
}

export interface ChargeHistoryGroup {
  key: string
  items: ChargeHistoryItem[]
}

export type ChargeHistoryListResponseData = ResponseData<ChargeHistoryItem[]>
