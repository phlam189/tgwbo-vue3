export interface BalanceClient {
  client_id: number
  represent_name: string
  number_trans_deposit: string
  number_trans_withdraw: string
  deposit_amount: string
  withdraw_amount: string
  account_usage_fee: string
  deposit_referral_fee: string
  withdraw_referral_fee: string
  adjustment_amount: string
  commision_bank_fee: string
  deposit_system_usage_fee: string
  withdraw_system_usage_fee: string
  settlement_fee: string
  charge_fee: string
  deposit_account_balance: string
  withdraw_account_balance: string
  total_balance: string
  actual_account_balance: string
  borrowing: string
}
