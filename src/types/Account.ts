export interface Account {
    id: number
    user_edit_id: number
    service_type: number
    category_name: any
    bank_name: string
    branch_name: string
    representative_account: string
    account_number: string
    account_holder: string
    commission_rate: number
    balance: number | string
    contractor_id: number
    client_id: number
    bank_id: number
    client_represent_name: string
    contructor_company_name: string
    created_at?: string
    branch_code: number
    bank_code: number
}

export interface FormCreateAccount {
    user_edit_id: number
    service_type: any
    category_name: any
    branch_name: string
    representative_account: string
    account_number: string
    account_holder: string
    commission_rate: number
    balance: number | string
    contractor_id: any
    client_id: any
    bank_id: any
    bank_name: string
    branch_code: number
}

export interface FormUpdateAccount {
    user_edit_id: number
    service_type: any
    category_name: any
    branch_name: string
    representative_account: string
    account_number: string
    account_holder: string
    commission_rate: number
    balance: any
    contractor_id: any
    client_id: any
    bank_id: any
    bank_name: string
    client_represent_name: string
    contructor_company_name: string
    branch_code: number
    client: any
    contractor: any
    bank: any
}

