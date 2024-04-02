import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { API } from './apis/apis'

// CALL API SERVER
class IntroducerService {
  async checkUniqueEmail(param: any, id?: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.post(API.MANAGEMENT_COMMON.INTRODUCER.CHECK_UNIQUE_EMAIL, { email: param, id: id })
  }

  async getIntroducerById(param: any) {
    return HTTP.get(API.MANAGEMENT_COMMON.INTRODUCER.LIST_CONTRACTOR_BY_ID(param))
  }
}

// CALL API LOCAL
// class IntroducerService {
//   checkUniqueEmail(param: any, id?: any) {
//     return HTTP.post(API.MANAGEMENT_COMMON.INTRODUCER.CHECK_UNIQUE_EMAIL, { email: param, id: id })
//   }

//   getIntroducerById(param: any) {
//     return HTTP.get(API.MANAGEMENT_COMMON.INTRODUCER.LIST_CONTRACTOR_BY_ID(param))
//   }
// }

export default new IntroducerService()
