import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { GetTokenParams, LoginParams, GetTokenResponseData, UserInfoResponseData } from '../types/Auth'
import { API } from './apis/apis'

// CALL API SERVER
class AuthService {
  async getToken(params: GetTokenParams): Promise<GetTokenResponseData> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.post(API.AUTH.GET_TOKEN, params).then((response) => {
      return response.data
    })
  }

  async login(loginParams: LoginParams) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.post(API.AUTH.LOGIN, loginParams).then((response) => {
      return response.data
    })
  }

  async getUserInfo(): Promise<UserInfoResponseData> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.AUTH.USER_INFO).then((response) => {
      return response.data
    })
  }
}

// CALL API LOCAL
// class AuthService {
//   async getToken(params: GetTokenParams): Promise<GetTokenResponseData> {
//     return HTTP_NO_AUTH.post(API.AUTH.GET_TOKEN, params).then((response) => {
//       return response.data
//     })
//   }

//   async login(loginParams: LoginParams) {
//     return HTTP_NO_AUTH.post(API.AUTH.LOGIN, loginParams).then((response) => {
//       return response.data
//     })
//   }

//   async getUserInfo(): Promise<UserInfoResponseData> {
//     return HTTP_NO_AUTH.get(API.AUTH.USER_INFO).then((response) => {
//       return response.data
//     })
//   }
// }

export default new AuthService()
