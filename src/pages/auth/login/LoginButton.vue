<template>
  <div class="login-page">
    <form v-if="checkQuery" class="login-form" @submit="onLogin">
      <va-input v-model="email" label="Email" class="form-item" />
      <va-button type="submit">Login</va-button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import AuthService from '../../../services/AuthService'
  import { useI18n } from 'vue-i18n'
  import { useModal, useToast } from 'vuestic-ui'
  import { EMAIL_LOGIN } from '../../../common/constants'
  import { USER_ROLE } from '../../../common/constants'
  import process from 'process'

  const { t } = useI18n()
  const { confirm } = useModal()
  const { init } = useToast()

  const secretKey = import.meta.env.VITE_APP_SECRET_KEY
  const privateKey = import.meta.env.VITE_APP_PRIVATE_KEY

  const router = useRouter()

  const email = ref('')
  const token = ref('')

  const checkRoleMail = () => {
    if (EMAIL_LOGIN.ADMIN === email.value) {
      return USER_ROLE.ADMIN
    } else {
      return USER_ROLE.MERCHANT
    }
  }

  const onLogin = async (event: Event) => {
    event.preventDefault()

    const data = await AuthService.getToken({ email: email.value, secret_key: secretKey, role: checkRoleMail() })

    if (data.data && data.data.length > 0) {
      const responseToken = data.data.split('|')[1]
      if (responseToken) {
        token.value = responseToken
      }
      router.replace({ name: 'login', query: { email: email.value, private_key: privateKey, token: token.value } })
    } else {
      init({ message: t('message_error.not_active'), color: 'danger' })
    }
  }

  const confirmLogin = async () => {
    await confirm({
      title: `${t('modal.warning')}`,
      message: `${t('modal.login_system')}`,
      size: 'large',
      blur: true,
      noDismiss: true,
      hideDefaultActions: true,
      noOutsideDismiss: true,
    })
  }

  const checkQuery = computed(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      router.currentRoute.value.query &&
      router.currentRoute.value.query.dev
    ) {
      return true
    }
    return false
  })

  watch(
    () => checkQuery.value,
    async () => {
      if (!checkQuery.value) {
        await confirmLogin()
      }
    },
    { immediate: true, deep: true },
  )
</script>

<style scoped lang="scss">
  .login-page {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-form {
      display: flex;
      flex-direction: column;
      background-color: #fff;
      padding: 20px;

      .form-item {
        margin-bottom: 12px;
      }
    }
  }
</style>
