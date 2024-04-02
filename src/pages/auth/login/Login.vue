<template>
  <div class="full-screen"></div>
  <h1>login automatic redirect...</h1>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { HTTP_NO_AUTH } from '../../../common/HTTP-common'
  import { HttpStatusCode } from '../../../enum/HttpStatusCode'
  import useCookie from '../../../composables/useCookie'
  import { LoginParams } from '../../../types/Auth'
  import AuthService from '../../../services/AuthService'

  const globalStore = useGlobalStore()

  const { init } = useToast()

  const route = useRoute()
  const router = useRouter()
  const { setCookie } = useCookie()

  onMounted((): void => {
    autoLogin()
  })

  const autoLogin = async () => {
    const queryEmail = route.query.email
    const queryToken = route.query.token
    const queryPrivateKey = route.query.private_key
    let isError = false
    const { t } = useI18n()

    await HTTP_NO_AUTH.get(`sanctum/csrf-cookie`).catch((error) => {
      let message = ''
      switch (error.response.status) {
        case HttpStatusCode.UNKNOWN_STATUS:
          message = t('message_error.419')
          isError = true
          break
      }

      init({ message: message, color: 'danger' })
    })

    const loginParams: LoginParams = {
      email: String(queryEmail),
      password: String(queryToken),
      private_key: String(queryPrivateKey),
    }

    await AuthService.login(loginParams).catch((error) => {
      let message = ''
      switch (error.response.status) {
        case HttpStatusCode.UNAUTHORIZED:
          message = t('message_error.401')
          isError = true
          break
        case HttpStatusCode.UNPROCESSABLE_CONTENT:
          message = t('message_error.422')
          isError = true
          break
      }

      if (message) init({ message: message, color: 'danger' })

      throw error
    })

    const userInfoRequest = await AuthService.getUserInfo().catch((error) => {
      let message = ''
      switch (error.response.status) {
        case HttpStatusCode.UNAUTHORIZED:
          message = t('message_error.419')
          isError = true
          break
      }
      if (message) init({ message: message, color: 'danger' })

      throw error
    })

    const userInfo = userInfoRequest.data
    setCookie('token', String(queryToken))
    globalStore.setToken(String(queryToken))

    if (!userInfo.client_id) {
      setCookie('role', 'admin')
      globalStore.setRole('admin')
    } else {
      setCookie('role', 'client')
      globalStore.setRole('client')
    }

    if (userInfo.client_id) {
      setCookie('clientId', String(userInfo.client_id))
      globalStore.setClientId(userInfo.client_id)
    }

    setCookie('userName', userInfo.name)
    setCookie('userId', String(userInfo.id))
    globalStore.changeUserName(userInfo.name)
    globalStore.changeUserId(userInfo.id)

    router.push({ name: 'dashboard' })
  }
</script>
