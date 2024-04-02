import { HTTP_NO_AUTH, HTTP } from '../common/HTTP-common'
import { ClientDetailResponseData, ClientResponseData } from '../types/Client'
import { API } from './apis/apis'

// CALL API SERVER
class ClienService {
  async getListClient(): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH({
      url: API.MANAGEMENT_COMMON.CLIENT.LIST,
      method: 'get',
    })
  }

  async getClientByID(id: number | string): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH({
      url: API.MANAGEMENT_COMMON.CLIENT.LIST_BY_ID(id),
      method: 'get',
    })
  }

  async getClientAll(is_deleted?: string): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.MANAGEMENT_COMMON.CLIENT.ALL, { params: { is_deleted: is_deleted } })
  }

  async getClientById(param: any) {
    return HTTP.get(API.MANAGEMENT_COMMON.CLIENT.LIST_BY_CONTRACTOR(param))
  }

  async getClientByClientId(clientId: number): Promise<ClientResponseData> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.MANAGEMENT_COMMON.CLIENT.LIST, { params: { client_id: clientId } }).then((response) => {
      return response.data
    })
  }

  async getClientDetail(clientId: number): Promise<ClientDetailResponseData> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.MANAGEMENT_COMMON.CLIENT.DETAILS, { params: { client_id: clientId } }).then(
      (response) => {
        return response.data
      },
    )
  }

  async checkUniqueEmail(param: any, id?: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.post(`${API.MANAGEMENT_COMMON.CLIENT.CHECK_EMAIL_UNIQUE}`, { email: param, id: id })
  }

  async checkUniqueClientId(param: any, id?: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.post(`${API.MANAGEMENT_COMMON.CLIENT.CHECK_UNIQUE_CLIENT_ID}`, { client_id: param, id: id })
  }
}

// CALL API LOCAL
// class ClienService {
//   async getListClient(): Promise<any> {
//     return HTTP({
//       url: API.MANAGEMENT_COMMON.CLIENT.LIST,
//       method: 'get',
//     })
//   }

//   async getClientByID(id: number | string): Promise<any> {
//     return HTTP({
//       url: API.MANAGEMENT_COMMON.CLIENT.LIST_BY_ID(id),
//       method: 'get',
//     })
//   }

//   async getClientAll(): Promise<any> {
//     return HTTP({
//       url: API.MANAGEMENT_COMMON.CLIENT.ALL,
//     })
//   }

//   async getClientById(param: any) {
//     return HTTP.get(API.MANAGEMENT_COMMON.CLIENT.LIST_BY_CONTRACTOR(param))
//   }

//   async getClientByClientId(clientId: number): Promise<ClientResponseData> {
//     return HTTP.get(API.MANAGEMENT_COMMON.CLIENT.LIST, { params: { client_id: clientId } }).then((response) => {
//       return response.data
//     })
//   }

//   async getClientDetail(clientId: number): Promise<ClientDetailResponseData> {
//     return HTTP.get(API.MANAGEMENT_COMMON.CLIENT.DETAILS, { params: { client_id: clientId } }).then((response) => {
//       return response.data
//     })
//   }

//   checkUniqueEmail(param: any, id?: any) {
//     return HTTP.post(`${API.MANAGEMENT_COMMON.CLIENT.CHECK_EMAIL_UNIQUE}`, { email: param, id: id })
//   }

//   async checkUniqueClientId(param: any, id?: any) {
//     return HTTP.post(`${API.MANAGEMENT_COMMON.CLIENT.CHECK_UNIQUE_CLIENT_ID}`, { client_id: param, id: id })
//   }
// }

export default new ClienService()
