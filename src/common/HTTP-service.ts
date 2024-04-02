import axios from 'axios'
import { HttpStatusCode } from '../enum/HttpStatusCode'
import { useI18n } from 'vue-i18n'
import { HTTP, HTTP_NO_AUTH } from './HTTP-common'
import { API } from '../services/apis/apis'

// CALL API SERVER
export class HttpService {
  private translator: any

  constructor() {
    this.translator = useI18n()
  }

  async delete(url: string) {
    let message = ''
    let status = false
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
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
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
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
      })

    return {
      message,
      status,
    }
  }

  async update(url: string, params: any) {
    let message = ''
    let status = false
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
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
      })

    return {
      message,
      status,
    }
  }

  async getListContractor() {
    return HTTP.get(`/list_contractor_id/`)
  }

  getListClient() {
    return HTTP.get(`/get_clients/`)
  }

  async getListAcount(param: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(`/search_account_number?account_number=${param}`)
  }
}

// CALL API LOCAL
// export class HttpService {
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

//   async getListContractor() {
//     return HTTP.get(`/list_contractor_id/`)
//   }

//   getListClient() {
//     return HTTP.get(`/get_clients/`)
//   }

//   getListAcount(param: any) {
//     return HTTP.get(`/search_account_number?account_number=${param}`)
//   }
// }
