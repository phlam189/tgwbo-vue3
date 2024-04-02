import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import {
  InvoiceContractorUpdateParams,
  InvoiceCreateParams,
  InvoiceListGetParams,
  InvoiceListResponseData,
} from '../types/Invoice'
import { API } from './apis/apis'

// CALL API SERVER
class InvoiceService {
  async getInvoiceList(params: InvoiceListGetParams): Promise<InvoiceListResponseData> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.INVOICE.GET_LIST, { params }).then((response) => {
      return response.data
    })
  }

  async createInvoice(invoiceParams: InvoiceCreateParams) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.post(API.INVOICE.CREATE, invoiceParams)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error.response.data
      })
  }

  async updateInvoice(invoiceParams: InvoiceCreateParams) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.put(API.INVOICE.UPDATE(invoiceParams.id), invoiceParams)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error.response.data
      })
  }

  async downloadPDF(id: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.INVOICE.DOWNLOAD_PDF, { params: { id } })
  }

  async getInvoiceContractor(contractorId: string, generateNumber?: number) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.INVOICE.CONTRUCTOR, {
      params: {
        contractor_id: contractorId,
        generate_number: generateNumber || '',
      },
    })
  }

  async updateInvoiceContractor(contractorId: number, params: InvoiceContractorUpdateParams) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.put(API.INVOICE.CONTRUCTOR_UPDATE(contractorId), params)
  }

  async insertInvoiceContractor(params: InvoiceContractorUpdateParams) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.post(API.INVOICE.CONTRUCTOR, params)
  }

  checkInvoiceContractorNumber(idContractor: number, number: string) {
    return HTTP.get(API.INVOICE.CHECK_INVOICE_NUMBER(idContractor, number))
  }
}

// CALL API LOCAL
// class InvoiceService {
//   async getInvoiceList(params: InvoiceListGetParams): Promise<InvoiceListResponseData> {
//     return HTTP.get(API.INVOICE.GET_LIST, { params }).then((response) => {
//       return response.data
//     })
//   }

//   async createInvoice(invoiceParams: InvoiceCreateParams) {
//     return HTTP.post(API.INVOICE.CREATE, invoiceParams)
//       .then((response) => {
//         return response.data
//       })
//       .catch((error) => {
//         return error.response.data
//       })
//   }

//   async updateInvoice(invoiceParams: InvoiceCreateParams) {
//     return HTTP.put(API.INVOICE.UPDATE(invoiceParams.id), invoiceParams)
//       .then((response) => {
//         return response.data
//       })
//       .catch((error) => {
//         return error.response.data
//       })
//   }

//   async downloadPDF(id: any) {
//     return HTTP.get(API.INVOICE.DOWNLOAD_PDF, { params: { id } })
//   }

//   async getInvoiceContractor(contractorId: string) {
//     return HTTP.get(API.INVOICE.CONTRUCTOR, {
//       params: {
//         contractor_id: contractorId,
//       },
//     })
//   }

//   async updateInvoiceContractor(contractorId: number, params: InvoiceContractorUpdateParams) {
//     return HTTP.put(API.INVOICE.CONTRUCTOR_UPDATE(contractorId), params)
//   }

//   async insertInvoiceContractor(params: InvoiceContractorUpdateParams) {
//     return HTTP.post(API.INVOICE.CONTRUCTOR, params)
//   }
// }

export default new InvoiceService()
