import { HTTP_NO_AUTH } from '../common/HTTP-common'
import { API } from './apis/apis'

class ActionLogService {
  async getListLog(page: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.get(API.ACTION_LOG.GET_LIST_WITH_PAGINATE(page))
  }

  async update(id: any) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.put(API.ACTION_LOG.UPDATE(id))
  }

  async updateStatus(id: number, status: number) {
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    return HTTP_NO_AUTH.put(API.ACTION_LOG.UPDATE_STATUS, 
      {
         'id': id, 
         'status': status
      }
    ).then((res) => {
      return res.data.data
    })
  }
}

export default new ActionLogService()