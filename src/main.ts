import { createApp } from 'vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'
import {
  clickOutside,
  sliceName,
  replaceNumTrans,
  replaceRate,
  sliceMemo,
  replaceProfit,
  replaceWM,
} from './directives/index'
import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import App from './App.vue'
import moment from 'moment-timezone'
import momentFormatDate from 'moment'
momentFormatDate.suppressDeprecationWarnings = true
moment.tz.setDefault('Asia/Tokyo')
moment.locale('ja')

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))
app.directive('click-outside', clickOutside)
app.directive('slice-name', sliceName)
app.directive('slice-memo', sliceMemo)
app.directive('replace-num-trans', replaceNumTrans)
app.directive('replace-rate', replaceRate)
app.directive('replace-profit', replaceProfit)
app.directive('replace-wm', replaceWM)

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
