import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { TransactionListResponseData, TransactionListParams, CSVListParams } from '../types/Transaction'
import { API } from './apis/apis'

// CALL API SERVER
class TransactionService {
  async getTransaction(data: any): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH({
      url: API.TRANSACTIONS.LIST,
      method: 'get',
      params: data,
    })
  }

  async getTransactions(params: TransactionListParams): Promise<TransactionListResponseData> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.TRANSACTIONS.LIST, { params }).then((response) => {
      return response.data
    })
  }

  async retrieveTodayClientAggregation(data: any): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH({
      url: API.MANAGEMENT_COMMON.CLIENT.AGGREGATION_TODAY,
      method: 'get',
      params: data,
    })
  }

  async downloadCSV(params: CSVListParams): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.TRANSACTIONS.DOWNLOAD_CSV, { params }).then((response) => {
      return response.data
    })
  }
}

// CALL API LOCAL
// class TransactionService {
//   async getTransaction(data: any): Promise<any> {
//     return HTTP({
//       url: API.TRANSACTIONS.LIST,
//       method: 'get',
//       params: data,
//     })
//   }

//   async getTransactions(params: TransactionListParams): Promise<TransactionListResponseData> {
//     return HTTP.get(API.TRANSACTIONS.LIST, { params }).then((response) => {
//       return response.data
//     })
//   }

//   async retrieveTodayClientAggregation(data: any): Promise<any> {
//     return HTTP({
//       url: API.MANAGEMENT_COMMON.CLIENT.AGGREGATION_TODAY,
//       method: 'get',
//       params: data,
//     })
//   }

//   async downloadCSV(params: CSVListParams): Promise<any> {
//     return HTTP.get(API.TRANSACTIONS.DOWNLOAD_CSV, { params }).then((response) => {
//       return response.data
//     })
//   }
// }

export default new TransactionService()
