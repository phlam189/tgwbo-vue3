import { HTTP_NO_AUTH } from '../common/HTTP-common'
import { API } from './apis/apis'

class LogTaskService {
  async getListLogTask(page: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.LOG_TASK.GET_LIST_WITH_PAGINATE(page))
  }
}

export default new LogTaskService()