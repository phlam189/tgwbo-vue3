export interface ResponseData<T> {
  status: string
  message: string | null
  data: T
}

export interface GetTokenParams {
  role: string
  email: string
  secret_key: string
}

export interface LoginParams {
  email: string
  password: string
  private_key: string
}

export interface UserInfo {
  id: number
  client_id: number | null
  email: string
  email_verified_at: string
  name: string
  two_factor_confirmed_at: null
  two_factor_recovery_codes: null
  two_factor_secret: null
  created_at: string
  updated_at: string
}

export type GetTokenResponseData = ResponseData<string>

export type UserInfoResponseData = ResponseData<UserInfo>
