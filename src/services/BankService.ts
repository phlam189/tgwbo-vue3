import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { API } from './apis/apis'

// CALL API SERVER
class BankService {
  async getBankById(param: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.MANAGEMENT_COMMON.BANK.LIST_BY_ID(param))
  }
}

// CALL API LOCAL
// class BankService {
//   getBankById(param: any) {
//     return HTTP.get(API.MANAGEMENT_COMMON.BANK.LIST_BY_ID(param))
//   }
// }

export default new BankService()
