import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { ChargeHistoryCreationParams, ChargeHistoryGetParams } from '../types/ChargeHistory'
import { API } from './apis/apis'

// CALL API SERVER
class ChargeHistoryService {
  async getChargeHistoryList(params: ChargeHistoryGetParams): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.CHARGE_HISTORY.GET_LIST, { params }).then((response) => {
      return response.data
    })
  }

  async createChargeHistory(chargeHistoryParams: ChargeHistoryCreationParams) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.post(API.CHARGE_HISTORY.CREATE, chargeHistoryParams).then((response) => {
      return response.data
    })
  }

  async updateChargeHistory(chargeHistoryParams: ChargeHistoryCreationParams) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.put(API.CHARGE_HISTORY.UPDATE(chargeHistoryParams.id as number), chargeHistoryParams).then(
      (response) => {
        return response.data
      },
    )
  }
  async deleteChargeHistory(id: number) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.delete(API.CHARGE_HISTORY.DELETE(id as number)).then((response) => {
      return response
    })
  }
}

// CALL API LOCAL
// class ChargeHistoryService {
//   async getChargeHistoryList(params: ChargeHistoryGetParams): Promise<any> {
//     return HTTP.get(API.CHARGE_HISTORY.GET_LIST, { params }).then((response) => {
//       return response.data
//     })
//   }

//   async createChargeHistory(chargeHistoryParams: ChargeHistoryCreationParams) {
//     return HTTP.post(API.CHARGE_HISTORY.CREATE, chargeHistoryParams).then((response) => {
//       return response.data
//     })
//   }

//   async updateChargeHistory(chargeHistoryParams: ChargeHistoryCreationParams) {
//     return HTTP.put(API.CHARGE_HISTORY.UPDATE(chargeHistoryParams.id as number), chargeHistoryParams).then(
//       (response) => {
//         return response.data
//       },
//     )
//   }
//   async deleteChargeHistory(id: number) {
//     return HTTP.delete(API.CHARGE_HISTORY.DELETE(id as number)).then((response) => {
//       return response
//     })
//   }
// }

export default new ChargeHistoryService()
