import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { API } from '../services/apis/apis'

// CALL API SERVER
class AccountService {
  async getAccountById(param: any) {
    await HTTP_NO_AUTH.get(`${API.AUTH.COOKIE}`)
    return HTTP_NO_AUTH.get(`${API.MANAGEMENT_COMMON.ACCOUNT.DETAIL(param)}`)
  }

  async checkUniqueAccountNumber(param: any, id?: any) {
    await HTTP_NO_AUTH.get(`${API.AUTH.COOKIE}`)
    return HTTP_NO_AUTH.post(`${API.MANAGEMENT_COMMON.ACCOUNT.CHECK_UNIQUE_ACCOUNT_NUMBER}`, {
      account_number: param,
      id: id,
    })
  }
}

// CALL API LOCAL
// class AccountService {
//   getAccountById(param: any) {
//     return HTTP.get(`${API.MANAGEMENT_COMMON.ACCOUNT.DETAIL(param)}`)
//   }

//   async checkUniqueAccountNumber(param: any, id?: any) {
//     return HTTP.post(`${API.MANAGEMENT_COMMON.ACCOUNT.CHECK_UNIQUE_ACCOUNT_NUMBER}`, { account_number: param, id: id })
//   }
// }

export default new AccountService()
