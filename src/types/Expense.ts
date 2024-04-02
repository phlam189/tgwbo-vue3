export interface Expense {
  id: Number
  account_id?: number
  client_id?: number
  expense_name: string
  interest_rate?: any
  memo?: String
  client_represent_name?: string
  account_number?: number
  created_at?: any
  account_bank_name: string
  client_company_name: string
  account_account_number: string
  client: any
}
export interface FormUpdateExpense {
  account_id?: any
  client_id?: any
  expense_name: string
  interest_rate?: any
  memo?: string
  client_represent_name?: string
  account_number?: any
  user_edit_id: Number
  client: any
}
