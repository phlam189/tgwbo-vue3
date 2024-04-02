import { ref, watch } from 'vue'

const useCookie = () => {
  const cookiesObject = ref<Record<string, string>>({})

  const getCookie = (key: string): string | undefined => {
    return cookiesObject.value[key]
  }

  const setCookie = (key: string, value: string) => {
    cookiesObject.value[key] = value
  }

  const clearCookies = () => {
    const newValues: Record<string, string> = {}
    Object.keys(cookiesObject.value).forEach((key) => {
      newValues[key] = ''
    })

    cookiesObject.value = newValues
  }

  const initCookies = () => {
    const cookieItems = document.cookie.split(';').filter((item) => item)
    const cookieKeyValuePairs = cookieItems.map((item) => {
      return item.split('=').map((item) => item.trim())
    })

    cookieKeyValuePairs.forEach(([key, value]) => {
      cookiesObject.value[key] = value
    })
  }

  initCookies()

  watch(
    cookiesObject,
    (newValue: Record<string, string>) => {
      Object.entries(newValue).forEach(([key, value]) => {
        const data = `${key}=${value}`
        const path = 'path=/'
        const domain = `domain=${import.meta.env.VITE_APP_API_DOMAIN}`
        let maxAge = 'max-age=3600'

        if (!value) {
          maxAge = 'max-age=0'
        }

        document.cookie = [data, path, domain, maxAge].join(';')
      })
    },
    { deep: true },
  )

  return { getCookie, setCookie, clearCookies }
}

export default useCookie
