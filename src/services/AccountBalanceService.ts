import { useToast } from 'vuestic-ui/web-components'
import { HTTP, HTTP_NO_AUTH } from '../common/HTTP-common'
import { useI18n } from 'vue-i18n'
import { API } from './apis/apis'
import { QueryParamsListAccountBalance } from '../types/AccountBalanceDTO'

// CALL API SERVER
export default class AccountBalanceService {
  public async getListAccount(params: QueryParamsListAccountBalance): Promise<any> {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP.get(API.ACCOUNT_BALANCE.LIST, { params })
      .then((response) => {
        return response
      })
      .catch(() => {
        let message = ''
        message = useI18n().t('message_error.Unknown_error')
        useToast().init({ message: message, color: 'danger' })
      })
  }
}

// CALL API LOCAL
// export default class AccountBalanceService {
//   public async getListAccount(params: QueryParamsListAccountBalance): Promise<any> {
//     return HTTP.get(API.ACCOUNT_BALANCE.LIST, { params })
//       .then((response) => {
//         return response
//       })
//       .catch(() => {
//         let message = ''
//         message = useI18n().t('message_error.Unknown_error')
//         useToast().init({ message: message, color: 'danger' })
//       })
//   }
// }
