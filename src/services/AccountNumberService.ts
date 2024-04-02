import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { API } from './apis/apis'

// CALL API SERVER
class AccountNumberService {
  async getAccountNumberByClientId(id: number): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH({
      url: API.ACCOUNT_NUMBER.LIST_BY_ID,
      method: 'get',
      params: { client_id: id },
    })
  }
}

// CALL API LOCAL
// class AccountNumberService {
//   async getAccountNumberByClientId(id: number): Promise<any> {
//     return HTTP({
//       url: API.ACCOUNT_NUMBER.LIST_BY_ID,
//       method: 'get',
//       params: { client_id: id },
//     })
//   }
// }

export default new AccountNumberService()
