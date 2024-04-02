import { ChargeHistoryItem } from './ChargeHistory'

export default interface ClientAggregation {
  client_id: number
  type: number
  represent_name: string
  amount: number
  number_trans: number
  bank_name: string
  company_name: string
  settlement_amount: number
  settlement_fee: number
  number_refunds: number
  refund_amount: number
  refund_fee: number
  charge_amount: number
  charge_fee: number
  commission_rate: number
  commission_bank_fee: number
  system_usage_fee: number
  account_number: string
  account_holder: string
  account_fee: number
  account: any
  date: any
  month?: string
  actual_balance: string
  transfer_amount: string
  account_balance: number
  charge_history?: ChargeHistoryItem[]
  account_usage_fee: string
  account_usage_rate: string
}
