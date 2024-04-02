import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { API } from './apis/apis'

// CALL API SERVER
class ClienDetailService {
  async getClientDetailById(param: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.MANAGEMENT_COMMON.CLIENT_DETAILS.UPDATE(param))
  }

  async checkContractExist(data: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.post(API.MANAGEMENT_COMMON.CLIENT_DETAILS.CHECK_CONTRACT_EXIST, data).then((response) => {
      return response.data.data
    })
  }
}

// CALL API LOCAL
// class ClienDetailService {
//   getClientDetailById(param: any) {
//     return HTTP.get(API.MANAGEMENT_COMMON.CLIENT_DETAILS.UPDATE(param))
//   }

//   async checkContractExist(data: any) {
//     return HTTP.post(API.MANAGEMENT_COMMON.CLIENT_DETAILS.CHECK_CONTRACT_EXIST, data).then((response) => {
//       return response.data.data
//     })
//   }
// }
export default new ClienDetailService()
