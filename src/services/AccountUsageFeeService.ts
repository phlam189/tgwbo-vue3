import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { API } from './apis/apis'

// CALL API SERVER
class AccountUsageFeeService {
  async getAccountUsageFee(data: any): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH({
      url: API.ACCOUNT_FEE.LIST,
      method: 'get',
      params: data,
    })
  }

  async exportPdfAccount(params: {
    from_date: string
    to_date: string
    contractor_id: string
    number: string
    note: string
  }) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.ACCOUNT_FEE.EXPORT_PDF_ACCOUNT, { params })
  }
}

// CALL API LOCAL
// class AccountUsageFeeService {
//   async getAccountUsageFee(data: any): Promise<any> {
//     return HTTP({
//       url: API.ACCOUNT_FEE.LIST,
//       method: 'get',
//       params: data,
//     })
//   }

//   async exportPdfAccount(params: {
//     from_date: string
//     to_date: string
//     contractor_id: string
//     number: string
//     note: string
//   }) {
//     return HTTP.get(API.ACCOUNT_FEE.EXPORT_PDF_ACCOUNT, { params })
//   }
// }

export default new AccountUsageFeeService()
