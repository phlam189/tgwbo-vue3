export interface Contractor {
  id: number
  user_edit_id: number
  company_name: string
  manager: string
  email: string
  address: string
  invoice_prefix: string
  created_at: string
  updated_at: string
}

export interface FormUpdateContractor {
  id: number
  user_edit_id: number
  company_name: string
  manager: string
  email: string
  address?: string
  invoice_prefix?: string
}

export interface FormCreateContractor {
  id: number
  user_edit_id: number
  company_name: string
  manager: string
  email: string
  address: string
  invoice_prefix: string
  company_type: any
  date_of_birth: any
  contract_date: any
  presence: any
  existence: any
  is_honsha: number
  parent_id: any
  parent: any
}

export interface FormCreateAccountContractor {
  user_edit_id: number
  company_name: string
  representative_name: string
  email: string
  address: string
  company_type: any
  date_of_birth: any
  contract_date: any
  presence: any
  existence: any
  is_honsha: number
  parent_id: any
  invoice_prefix: string
}

export interface FormUpdateAccountContractor {
  user_edit_id: number
  company_name: string
  representative_name: string
  email: string
  address: string
  company_type: any
  date_of_birth: any
  contract_date: any
  presence: any
  existence: any
  is_honsha: number
  parent_id: any
  parent: any
  invoice_prefix: string
}

export interface AccountContractor {
  id: number
  user_edit_id: number
  company_name: string
  representative_name: string
  email: string
  address: string
  company_type: any
  date_of_birth: any
  contract_date: any
  presence: any
  existence: any
  created_at: Date
  is_honsha: number
  parent: any
  invoice_prefix: string
}
