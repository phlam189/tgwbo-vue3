<template>
  <div class="auth-layout row align-content-center">
    <h1>Login test</h1>
    <router-view />
  </div>
</template>

<script>
  // import VuesticLogo from '../components/VuesticLogo.vue'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'AuthLayout',
    setup() {
      const { t } = useI18n()
      return { t }
    },
  }
</script>

<style lang="scss">
  .auth-layout {
    min-height: 100vh;
    background-image: linear-gradient(to right, var(--va-background-primary), var(--va-white));

    &__card {
      width: 100%;
      max-width: 600px;
    }
  }
</style>
