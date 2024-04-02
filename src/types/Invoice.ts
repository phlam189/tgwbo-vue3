export interface InvoiceDetail {
  id: number
  invoice_id: number
  type: string
  description: string
  rate: string
  number_transaction: number
  system_usage_fee: string
  total_amount: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  client_id: number
  contractor_id: number
  invoice_no: string
  invoice_date: string
  due_date: string
  period_from: string
  period_to: string
  sub_total: string
  discount_amount: string
  tax_rate: string
  total_tax: string
  balance: string
  status: number
  memo: string
  created_at: string
  updated_at: string
  invoice_details: InvoiceDetail[]
  count?: number
}

export interface InvoiceTableItem {
  id: number
  date: string
  due_date: string | null
  period_from: string
  period_to: string
  discount_amount: string
  memo: string
  tax_rate: string
  total_tax: string
  total_bill: string
  status: number
  invoice_no: string
  invoice_details?: InvoiceDetail[]
  number_of_deposits: string | number
  deposit_amount: string
  deposit_system_usage_fee: string
  number_of_withdrawals: string | number
  withdrawal_amount: string
  withdrawal_system_usage_fee: string
  count?: number
}

export interface MissingInvoiceTableItem {
  id?: number
  date: string
  due_date: string | null
  invoice_no: string
  period_from: string
  period_to: string
  total_bill: string
  status: number
  invoice_details?: InvoiceDetail[]
  number_of_deposits: string | number
  deposit_amount: string
  deposit_system_usage_fee: string
  number_of_withdrawals: string | number
  withdrawal_amount: string
  withdrawal_system_usage_fee: string
  count?: number
}

export interface InvoiceDetailCreateParams {
  id?: number
  type: string
  description: string
  rate: string
  number_transaction: number
  system_usage_fee: string
  total_amount: string
  count?: number
}

export interface InvoiceCreateParams {
  id?: number
  client_id: number
  contractor_id: number
  invoice_no: string
  invoice_date: string
  due_date: string
  sub_total: string
  discount_amount: string
  tax_rate: string
  total_tax: string
  balance: string
  memo: string
  status: number
  invoice_details: InvoiceDetailCreateParams[]
}

export interface InvoiceAggregation {
  amount: number
  amountWithRate: number
  numberTransfers: number
  contracts: {
    id: number
    rate: number
    amount: number
    description: string
    system_usage_fee: number
  }[]
}

export interface InvoiceCustomExpense {
  id?: number
  type: string
  description: string
  rate: string
  number_transaction: string
  amount: string
}

export interface InvoiceListGetParams {
  client_id: number | string
  from_date?: string
  to_date?: string
}

export type InvoiceListResponseData = Invoice[]

export interface InvoiceContractor {
  id: number
  client_id: number
  contructor_id: number
  invoice_date: string
  note: string
  created_at: string
  updated_at: string
  invoice_prefix: string
  number: string
  email: string
  representative_name: string
  company_name: string
  address: string
}

export interface InvoiceContractorUpdateParams {
  number: string
  note: string
  invoice_date: string
  contructor_id: number
}
