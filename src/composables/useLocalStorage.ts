const useLocalStorage = () => {
  const getItem = <T = any>(key: string, fallback?: T, converter?: (value: string) => T) => {
    const localStorageValue = localStorage.getItem(key)

    if (!localStorageValue) {
      return fallback
    }

    try {
      return JSON.parse(localStorageValue) as T
    } catch {
      return converter ? converter(localStorageValue) : localStorageValue
    }
  }

  const setItem = <T>(key: string, value: T) => {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, `${value}`)
    }
  }

  return { getItem, setItem }
}

export default useLocalStorage
