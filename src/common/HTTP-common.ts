import axios, { AxiosError } from 'axios'
import router from '../router'
import { useGlobalStore } from '../stores/global-store'
import { HttpStatusCode } from '../enum/HttpStatusCode'

const appName = import.meta.env.VITE_APP_URL

const HTTP = axios.create({
  baseURL: `${appName}`,
  headers: {
    Accept: 'application/json',
  },
})

HTTP.interceptors.request.use((config) => {
  const globalStore = useGlobalStore()

  if (globalStore.token) {
    config.headers.Authorization = 'Bearer ' + globalStore.token
  }

  return config
})

const HTTP_NO_AUTH = axios.create({
  baseURL: `${appName}`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

HTTP_NO_AUTH.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      console.log('Network Error')
      return
    }

    if (error.response?.status === HttpStatusCode.UNAUTHORIZED) {
      const globalStore = useGlobalStore()
      globalStore.logout()
      router.replace({ name: 'login-button' })
      return
    }

    // unhandled
    throw error
  },
)

export { HTTP, HTTP_NO_AUTH }

// export class HttpService {
//     delete(url: string) {
//         var message = "";
//         var status = false;
//         HTTP.delete(`url`)
//             .then((res) => {
//                 status = true;
//                 message = res.data.message;
//             })
//             .catch((error) => {
//                 switch (error.response.status) {
//                     case HttpStatusCode.BAD_REQUEST:
//                         message = t("message_error.400");
//                         break;
//                     case HttpStatusCode.UNAUTHORIZED:
//                         message = t("message_error.401");
//                         break;
//                     case HttpStatusCode.NOT_FOUND:
//                         message = t("message_error.404");
//                         break;
//                     //case token het han : thi goi lay token moi, goi lai api 1 lan nua. Tra ve result giong lan goi dau: HTTP.delete(`/api/banks/${id}`)
//                     case HttpStatusCode.INTERNAL_SERVER_ERROR:
//                         message = t("message_error.500");
//                         break;
//                 }
//             });
//         return {
//             message, status,
//         }
//     }
// }
