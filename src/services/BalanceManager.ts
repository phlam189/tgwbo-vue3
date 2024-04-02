import { API } from './apis/apis'
import { HTTP_NO_AUTH } from '../common/HTTP-common'
import { QueryParamsGetBalanceManager } from '../types/BalanceManager'

class BalanceManagerService {
  async getBalanceManager(params: QueryParamsGetBalanceManager) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.BALANCE_MANAGER.INCOME, { params })
  }

  async getIncomeExpenditure(params: QueryParamsGetBalanceManager) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.BALANCE_MANAGER.EXPENDITURE, { params })
  }

  async updateIncomeExpenditure(data: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.put(API.BALANCE_MANAGER.CRUD_EXPENDITURE(data.id), data)
  }

  async deleteRowIncomeExpenditure(id: number) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.delete(API.BALANCE_MANAGER.CRUD_EXPENDITURE(id))
  }

  async downloadIncome(id: number, lang: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.BALANCE_MANAGER.DOWNLOAD_INCOME(id), { params: { lang } })
  }
}

export default new BalanceManagerService()
