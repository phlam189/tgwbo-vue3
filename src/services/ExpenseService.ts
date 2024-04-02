import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { API } from './apis/apis'

// CALL API SERVER
class ExpenseService {
  async getExpenseById(param: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.EXPENSES.LIST_BY_ID(param))
  }
}

// CALL API LOCAL
// class ExpenseService {
//   getExpenseById(param: any) {
//     return HTTP.get(API.EXPENSES.LIST_BY_ID(param))
//   }
// }

export default new ExpenseService()
