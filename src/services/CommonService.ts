import { HttpStatusCode } from '../enum/HttpStatusCode'
import { useI18n } from 'vue-i18n'
import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { API } from '../services/apis/apis'
import { ERROR_CODE } from '../common/constants'

// CALL API SERVER
export class CommonService {
  private translator: any

  constructor() {
    this.translator = useI18n()
  }

  async delete(url: string) {
    let message = ''
    let status = false
    await HTTP_NO_AUTH.get(`${API.AUTH.COOKIE}`)
    await HTTP_NO_AUTH.delete(`${url}`, { withCredentials: true })
      .then((res) => {
        status = true
        message = res.data.message
      })
      .catch((error) => {
        switch (error.response.status) {
          case HttpStatusCode.BAD_REQUEST:
            message = this.translator.t('message_error.400')
            break
          case HttpStatusCode.UNAUTHORIZED:
            message = this.translator.t('message_error.401')
            break
          case HttpStatusCode.NOT_FOUND:
            message = this.translator.t('message_error.404')
            break
          case HttpStatusCode.UNKNOWN_STATUS:
            message = this.translator.t('message_error.419')
            break
          case HttpStatusCode.UNPROCESSABLE_CONTENT:
            message = this.translator.t('message_error.422')
            break
          case HttpStatusCode.INTERNAL_SERVER_ERROR:
            message = this.translator.t('message_error.500')
            break
          default:
            message = this.translator.t('message_error.Unknown_error')
        }
      })
    return {
      message,
      status,
    }
  }

  async create(url: string, params: any) {
    let message = ''
    let status = false
    await HTTP_NO_AUTH.get(`${API.AUTH.COOKIE}`)
    await HTTP_NO_AUTH.post(`${url}`, params, { withCredentials: true })
      .then((res) => {
        status = true
        message = res.data.message
      })
      .catch((error) => {
        switch (error.response.status) {
          case HttpStatusCode.BAD_REQUEST:
            message = this.translator.t('message_error.400')
            break
          case HttpStatusCode.UNAUTHORIZED:
            message = this.translator.t('message_error.401')
            break
          case HttpStatusCode.NOT_FOUND:
            message = this.translator.t('message_error.404')
            break
          case HttpStatusCode.UNKNOWN_STATUS:
            message = this.translator.t('message_error.419')
            break
          case HttpStatusCode.UNPROCESSABLE_CONTENT:
            message = this.translator.t('message_error.422')
            break
          case HttpStatusCode.INTERNAL_SERVER_ERROR:
            message = this.translator.t('message_error.500')
            break
          default:
            message = this.translator.t('message_error.Unknown_error')
        }
        ERROR_CODE.ADM_005.forEach((element: any) => {
          if (element.MESSAGE == error.response.data.code) {
            message = this.translator.t(`message_error.${element.KEY}`)
          }
        })
      })

    return {
      message,
      status,
    }
  }

  async update(url: string, params: any) {
    let message = ''
    let status = false
    await HTTP_NO_AUTH.get(`${API.AUTH.COOKIE}`)
    await HTTP_NO_AUTH.put(`${url}`, params, { withCredentials: true })
      .then((res) => {
        status = true
        message = res.data.message
      })
      .catch((error) => {
        switch (error.response.status) {
          case HttpStatusCode.BAD_REQUEST:
            message = this.translator.t('message_error.400')
            break
          case HttpStatusCode.UNAUTHORIZED:
            message = this.translator.t('message_error.401')
            break
          case HttpStatusCode.NOT_FOUND:
            message = this.translator.t('message_error.404')
            break
          case HttpStatusCode.UNKNOWN_STATUS:
            message = this.translator.t('message_error.419')
            break
          case HttpStatusCode.UNPROCESSABLE_CONTENT:
            message = this.translator.t('message_error.422')
            break
          case HttpStatusCode.INTERNAL_SERVER_ERROR:
            message = this.translator.t('message_error.500')
            break
          default:
            message = this.translator.t('message_error.Unknown_error')
        }
        ERROR_CODE.ADM_005.forEach((element: any) => {
          if (element.MESSAGE == error.response.data.code) {
            message = this.translator.t(`message_error.${element.KEY}`)
          }
        })
      })

    return {
      message,
      status,
    }
  }

  async getListContractor(data: any): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH({
      url: API.MANAGEMENT_COMMON.CONTRACTOR.SELECT_CONTRACTOR_ID,
      method: 'get',
      params: data,
    })
  }

  // async getListContractor() {
  //   return HTTP.get(`/api/list_contractor_id/`)
  // }

  async getListClient(): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(`/get_clients/`)
  }

  async getListAcount(param: any): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(`/search_account_number?account_number=${param}`)
  }

  async getListShow(url: string): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(`${url}`)
  }

  async getListSelectBank(): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(`${API.MANAGEMENT_COMMON.BANK.LIST_SELECT_BANK}`)
  }
}

// CALL API LOCAL
// export class CommonService {
//   private translator: any

//   constructor() {
//     this.translator = useI18n()
//   }

//   async delete(url: string) {
//     let message = ''
//     let status = false
//     await HTTP.delete(`${url}`, { withCredentials: true })
//       .then((res) => {
//         status = true
//         message = res.data.message
//       })
//       .catch((error) => {
//         switch (error.response.status) {
//           case HttpStatusCode.BAD_REQUEST:
//             message = this.translator.t('message_error.400')
//             break
//           case HttpStatusCode.UNAUTHORIZED:
//             message = this.translator.t('message_error.401')
//             break
//           case HttpStatusCode.NOT_FOUND:
//             message = this.translator.t('message_error.404')
//             break
//           case HttpStatusCode.UNKNOWN_STATUS:
//             message = this.translator.t('message_error.419')
//             break
//           case HttpStatusCode.UNPROCESSABLE_CONTENT:
//             message = this.translator.t('message_error.422')
//             break
//           case HttpStatusCode.INTERNAL_SERVER_ERROR:
//             message = this.translator.t('message_error.500')
//             break
//           default:
//             message = this.translator.t('message_error.Unknown_error')
//         }
//       })
//     return {
//       message,
//       status,
//     }
//   }

//   async create(url: string, params: any) {
//     let message = ''
//     let status = false
//     await HTTP.post(`${url}`, params, { withCredentials: true })
//       .then((res) => {
//         status = true
//         message = res.data.message
//       })
//       .catch((error) => {
//         switch (error.response.status) {
//           case HttpStatusCode.BAD_REQUEST:
//             message = this.translator.t('message_error.400')
//             break
//           case HttpStatusCode.UNAUTHORIZED:
//             message = this.translator.t('message_error.401')
//             break
//           case HttpStatusCode.NOT_FOUND:
//             message = this.translator.t('message_error.404')
//             break
//           case HttpStatusCode.UNKNOWN_STATUS:
//             message = this.translator.t('message_error.419')
//             break
//           case HttpStatusCode.UNPROCESSABLE_CONTENT:
//             message = this.translator.t('message_error.422')
//             break
//           case HttpStatusCode.INTERNAL_SERVER_ERROR:
//             message = this.translator.t('message_error.500')
//             break
//           default:
//             message = this.translator.t('message_error.Unknown_error')
//         }
//       })

//     return {
//       message,
//       status,
//     }
//   }

//   async update(url: string, params: any) {
//     let message = ''
//     let status = false
//     await HTTP.put(`${url}`, params, { withCredentials: true })
//       .then((res) => {
//         status = true
//         message = res.data.message
//       })
//       .catch((error) => {
//         switch (error.response.status) {
//           case HttpStatusCode.BAD_REQUEST:
//             message = this.translator.t('message_error.400')
//             break
//           case HttpStatusCode.UNAUTHORIZED:
//             message = this.translator.t('message_error.401')
//             break
//           case HttpStatusCode.NOT_FOUND:
//             message = this.translator.t('message_error.404')
//             break
//           case HttpStatusCode.UNKNOWN_STATUS:
//             message = this.translator.t('message_error.419')
//             break
//           case HttpStatusCode.UNPROCESSABLE_CONTENT:
//             message = this.translator.t('message_error.422')
//             break
//           case HttpStatusCode.INTERNAL_SERVER_ERROR:
//             message = this.translator.t('message_error.500')
//             break
//           default:
//             message = this.translator.t('message_error.Unknown_error')
//         }
//       })

//     return {
//       message,
//       status,
//     }
//   }

//   async getListContractor(data: any): Promise<any> {
//     return HTTP({
//       url: API.MANAGEMENT_COMMON.CONTRACTOR.SELECT_CONTRACTOR_ID,
//       method: 'get',
//       params: data,
//     })
//   }

//   // async getListContractor() {
//   //   return HTTP.get(`/list_contractor_id/`)
//   // }

//   getListClient() {
//     return HTTP.get(`/get_clients/`)
//   }

//   getListAcount(param: any) {
//     return HTTP.get(`/search_account_number?account_number=${param}`)
//   }

//   getListShow(url: string) {
//     return HTTP.get(`${url}`)
//   }

//   getListSelectBank() {
//     return HTTP.get(`${API.MANAGEMENT_COMMON.BANK.LIST_SELECT_BANK}`)
//   }
// }
