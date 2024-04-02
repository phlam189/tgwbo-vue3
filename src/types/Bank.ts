export interface Bank {
  id: Number
  bank_name: String
  client_withdrawal_fee_1: Number
  client_withdrawal_fee_2: Number
  contract_withdrawal_fee_1: Number
  contract_withdrawal_fee_2: Number
  // client_condition_number: Number
  // contract_condition_number: Number
  created_at: any
}

export interface FormUpdateBank {
  bank_name: string
  client_withdrawal_fee_1: number | string
  client_withdrawal_fee_2: number | string
  contract_withdrawal_fee_1: number | string
  contract_withdrawal_fee_2: number | string
  client_condition_number?: number
  contract_condition_number?: number
  user_edit_id: Number
  bank_list_name: string
  input_bank_list_name: string
  bank_code: number
  difference_fee: number | string
}

export interface AccountNumber {
  id: number
  account_number: string
  branch_name: string
  bank_name: string
}
