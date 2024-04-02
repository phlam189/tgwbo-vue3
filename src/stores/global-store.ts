import { defineStore } from 'pinia'
import useCookie from '../composables/useCookie'

export const useGlobalStore = defineStore('global', {
  state: () => {
    const { getCookie } = useCookie()

    return {
      isSidebarMinimized: false,
      userName: getCookie('userName') ?? '',
      userId: getCookie('userId') ?? -1,
      token: getCookie('token') ?? '',
      role: getCookie('role') ?? '',
      clientId: getCookie('clientId') ?? 0,
      isCreated: false,
      isUpdated: false,
      loading: false,
    }
  },

  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized
    },

    changeUserName(userName: string) {
      this.userName = userName
    },

    changeUserId(userId: number) {
      this.userId = userId
    },

    setClientId(clientId: number) {
      this.clientId = clientId
    },

    getClientId() {
      return this.clientId
    },

    setRole(role: string) {
      this.role = role
    },

    getRole() {
      return this.role
    },

    setIsCreated() {
      return (this.isCreated = !this.isCreated)
    },

    setIsUpdated() {
      return (this.isUpdated = !this.isUpdated)
    },

    setToken(token: string) {
      this.token = token
    },
    logout() {
      const { clearCookies } = useCookie()

      this.userName = ''
      this.userId = -1
      this.token = ''
      this.role = ''
      this.clientId = 0
      this.isCreated = false
      clearCookies()
    },
    /**
     * set loading
     */
    setLoading(data: boolean) {
      this.loading = data
    },
  },
})
