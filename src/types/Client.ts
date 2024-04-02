import { ResponseData } from './Api'

export type Client<T = ClientDetails[]> = {
  id: number
  user_edit_id: number
  company_name: string
  represent_name: string
  email: string
  address: string
  presence: number
  license_number: string
  total_year: number
  contractor_id: string
  created_at: string
  updated_at: string
  client_id: number
  service_name: string
  contract_method: number
  client_details: T
  charge_fee_rate: number
  charge_fee_memo: string
  settlement_fee_rate: number
  settlement_fee_memo: string
  is_transfer_fee: number
  termination_date: any
  sales_representative: string
  contractor: any
  contract_use_service: string
  interest_rate: number
  client_detail?: ClientDetails[]
}

export interface ClientDetails {
  id: number
  client_id: number
  service_type: number
  is_minimun_charge: string
  is_transfer_fee: string
  charge_fee_rate: string
  charge_fee_memo: string
  settlement_fee_rate: string
  settlement_fee_memo: string
  contract_date: string
  contract_rate: string
  max_amount: string | null
  usage_fee_amount: string | null
  created_at: string
  updated_at: string
}

export type OptionClient = {
  id: number
  client_id: number
  represent_name: string
}

export interface ClientDetailItem {
  id: number
  client_id: number
  description: string
  service_type: number
  is_minimun_charge: number
  is_transfer_fee: number
  charge_fee_rate: string
  charge_fee_memo: string
  settlement_fee_rate: string
  settlement_fee_memo: string
  contract_date: string
  contract_rate: string
  usage_fee_amount: number
  contract_method: number
  created_at: string
  updated_at: string
  max_amount: number
}

export type ClientResponseData = ResponseData<Client[]>

export type ClientDetailResponseData = ResponseData<ClientDetailItem[]>

export interface FormUpdateClient {
  company_name: string
  represent_name: string
  email: string
  address?: string
  presence?: any
  total_year?: any
  service_name?: string
  license_number?: string
  contractor_id?: any
  user_edit_id: number
  contractor_company_name: string
  contract_method: any
  client_id: number | string
  charge_fee_rate: number
  charge_fee_memo?: string
  settlement_fee_rate?: number
  settlement_fee_memo?: string
  is_transfer_fee: any
  termination_date: any
  sales_representative: string
  contract_use_service: string
}
