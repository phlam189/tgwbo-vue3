<template>
  <Loading />
  <router-view />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import Loading from './components/Loading/index.vue'
  import useLocalStorage from './composables/useLocalStorage'
  import { LANGUAGES, LOCAL_STORAGE_KEYS } from './common/constants'

  const { getItem } = useLocalStorage()
  const { locale } = useI18n()

  const language = getItem(LOCAL_STORAGE_KEYS.LANGUAGE, LANGUAGES.JAPANESE)
  if (language) {
    locale.value = language
  }
</script>

<style lang="scss">
  @import 'scss/main.scss';
  @font-face {
    font-family: 'Noto Sans JP';
    src: local('Noto Sans JP'), url('./assets/fonts/notosanjp.ttf') format('truetype');
  }
  #app {
    font-family: 'Noto Sans JP', 'Source Sans Pro', Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  body {
    margin: 0;
  }
</style>
