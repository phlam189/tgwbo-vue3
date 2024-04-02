import { HTTP_NO_AUTH, HTTP } from '../common/HTTP-common'
import { API } from './apis/apis'

// CALL API SERVER
class ContractorService {
  async getListContractor() {
    await HTTP_NO_AUTH.get(`${API.AUTH.COOKIE}`)
    return HTTP_NO_AUTH.get(`${API.MANAGEMENT_COMMON.CONTRACTOR.LIST}`)
  }

  async getAllListContractor() {
    await HTTP_NO_AUTH.get(`${API.AUTH.COOKIE}`)
    return HTTP_NO_AUTH.get(`${API.MANAGEMENT_COMMON.CONTRACTOR.ALL_LIST}`)
  }

  async getContractorById(constructorId: any) {
    return HTTP_NO_AUTH.get(`${API.MANAGEMENT_COMMON.CONTRACTOR.DETAIL(constructorId)}`)
  }

  async checkUniqueEmail(param: any, id?: any) {
    await HTTP_NO_AUTH.get(`${API.AUTH.COOKIE}`)
    return HTTP_NO_AUTH.post(`${API.MANAGEMENT_COMMON.CONTRACTOR.CHECK_EMAIL_UNIQUE}`, { email: param, id: id })
  }
}

// CALL API LOCAL
// class ContractorService {
//   getListContractor() {
//     return HTTP.get(`${API.MANAGEMENT_COMMON.CONTRACTOR.LIST}`)
//   }

//   async getAllListContractor() {
//     return HTTP.get(`${API.MANAGEMENT_COMMON.CONTRACTOR.ALL_LIST}`)
//   }

//   getContractorById(constructorId: any) {
//     return HTTP.get(`${API.MANAGEMENT_COMMON.CONTRACTOR.DETAIL(constructorId)}`)
//   }

//   checkUniqueEmail(param: any, id?: any) {
//     return HTTP.post(`${API.MANAGEMENT_COMMON.CONTRACTOR.CHECK_EMAIL_UNIQUE}`, { email: param, id: id })
//   }
// }

export default new ContractorService()
