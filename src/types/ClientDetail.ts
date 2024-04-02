import { Client } from './Client';
export interface FormUpdateClientDetail {
    id: number
    client_id: number
    service_type: any
    is_minimun_charge: any
    is_transfer_fee: any
    charge_fee_rate: string
    charge_fee_memo?: string
    settlement_fee_rate?: string
    settlement_fee_memo?: string
    contract_rate?: string
    user_edit_id: number
    usage_fee_amount?: number | string
    max_amount: number | string
    contract_date?: any
    description: string
}