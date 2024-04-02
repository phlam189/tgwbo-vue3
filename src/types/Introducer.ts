export interface Introducer {
  id: number
  company_name: string
  representative_name: string
  email: string
  address: string
  contract_date: any
  contractor_id: number
  presence: boolean
  referral_classification: number
  referral_name: string
  referral_fee: any
  created_at: any
  contructor: any
  client_represent_name?: string
  contructor_representative_name?: string
}

export interface FormUpdateIntroducer {
  company_name: string
  representative_name: string
  email: string
  address?: string
  contract_date?: any | string
  contractor_id?: any
  presence?: any
  referral_classification: any
  referral_name: string
  referral_fee: any
  user_edit_id: Number
  contractor_company_name: String
  client_represent_name?: string
  contructor_representative_name?: string
  client_id: number
  account_contractor_id: number
}
