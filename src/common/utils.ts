import momentFormatDate from 'moment'
import { useI18n } from 'vue-i18n'
import {
  YYYY_M_D_JP,
  M_JP,
  LANGUAGES,
  MMM,
  MONTH_ENGLISH,
  YYYY_M_JP,
  MMM_YYYY,
  D_MMM_YYYY,
  DATE_PICKER_TYPES,
  CHARGE_HISTORY_TYPE,
  CHARGE_HISTORY_TYPE_TEXT,
  WEEKDAY_NAMES,
  ERROR_DATE,
  ERROR_DATE_STRING,
} from './constants'

const formatCurrency = {
  title: 'formatCurrency',
  func: (value: number | string, isDown?: boolean) => {
    if (!value) {
      return '¥0'
    }
    if (value == '-' || value == 0 || value == '0') {
      return '¥0'
    }
    const data = !isDown
      ? '¥' + new Intl.NumberFormat('ja-JP').format(roundUp(Number(`${value}`)))
      : '¥' + new Intl.NumberFormat('ja-JP').format(roundDown(Number(`${value}`)))
    return data
  },
}

const formatNumber = (value: number | string, isDown?: boolean) => {
  if (!value) {
    return '0'
  }
  if (value == '-' || value == 0 || value == '0') {
    return value
  }
  const data = !isDown
    ? new Intl.NumberFormat('ja-JP').format(roundUp(Number(`${value}`)))
    : new Intl.NumberFormat('ja-JP').format(roundDown(Number(`${value}`)))
  return data
}

const formatNumberCurrency = (value: number | string, isDown?: boolean) => {
  const { locale } = useI18n()
  const valNumber = !isDown ? formatNumber(roundUp(value)) : formatNumber(roundDown(value))
  if (locale.value === LANGUAGES.JAPANESE) {
    return valNumber + ' 円'
  }
  return '¥' + valNumber
}

const convertDateString = (value: any) => {
  if (!value || value === ERROR_DATE || value === ERROR_DATE_STRING) {
    return
  }
  const { t, locale } = useI18n()
  const date = momentFormatDate(new Date(value))
  if (locale.value === LANGUAGES.JAPANESE) {
    return (
      date.year() +
      ` ${t(DATE_PICKER_TYPES.YEAR)} ` +
      (Number(date.month()) + 1).toString() +
      ` ${t(DATE_PICKER_TYPES.MONTH)} `
    )
  }
  return MONTH_ENGLISH[Number(date.month())] + ' ' + date.year()
}

const convertYearString = (value: any) => {
  const { t, locale } = useI18n()
  const date = momentFormatDate(new Date(value))
  if (locale.value === LANGUAGES.JAPANESE) {
    return date.year() + ` ${t(DATE_PICKER_TYPES.YEAR)}`
  }
  return date.year()
}

const convertDateTimeToString = (value: any) => {
  if (!value || value === ERROR_DATE || value === ERROR_DATE_STRING) {
    return
  }
  const { t, locale } = useI18n()
  const date = momentFormatDate(new Date(value))
  if (locale.value === LANGUAGES.JAPANESE) {
    return (
      date.year() +
      ` ${t(DATE_PICKER_TYPES.YEAR)} ` +
      (Number(date.month()) + 1).toString() +
      ` ${t(DATE_PICKER_TYPES.MONTH)} ` +
      date.date() +
      ` ${t(DATE_PICKER_TYPES.DAY)} ` +
      `(${t(textDay(date))})` +
      ' ' +
      momentFormatDate(date.hour(), 'H').format('HH') +
      ` ${t('hour')} ` +
      momentFormatDate(date.minute(), 'm').format('mm') +
      ` ${t('minute')} `
    )
  }

  return (
    date.toString().slice(0, 3) +
    ' ' +
    date.date() +
    ' ' +
    MONTH_ENGLISH[Number(date.month())] +
    ' ' +
    date.year() +
    '  ' +
    momentFormatDate(date.hour(), 'H').format('HH') +
    ':' +
    momentFormatDate(date.minute(), 'm').format('mm')
  )
}

const convertDateToString = (value: any) => {
  if (!value || value === ERROR_DATE || value === ERROR_DATE_STRING) {
    return
  }
  const { t, locale } = useI18n()
  const date = momentFormatDate(new Date(value))
  if (locale.value === LANGUAGES.JAPANESE) {
    return (
      date.year() +
      ` ${t(DATE_PICKER_TYPES.YEAR)} ` +
      (Number(date.month()) + 1).toString() +
      ` ${t(DATE_PICKER_TYPES.MONTH)} ` +
      date.date() +
      ` ${t(DATE_PICKER_TYPES.DAY)} ` +
      `(${t(textDay(date))})`
    )
  }

  return date.toString().slice(0, 3) + ' ' + date.date() + ' ' + MONTH_ENGLISH[Number(date.month())] + ' ' + date.year()
}

const convertMonthToString = (value: any) => {
  if (!value) return
  const { locale } = useI18n()
  if (locale.value === LANGUAGES.JAPANESE) {
    return `${parseInt(value.split('-')[1])} 年 ${parseInt(value.split('-')[0])} 月`
  }
  return `${MONTH_ENGLISH[parseInt(value.split('-')[0]) - 1]} ${parseInt(value.split('-')[1])}`
}

const textDay = (date: any) => {
  return WEEKDAY_NAMES[date.weekday()]
}

const convertDateInput = (value: any) => {
  if (!value || value === ERROR_DATE || value === ERROR_DATE_STRING) {
    return ''
  }
  const date = new Date(value)
  return `${date.getFullYear()}/${momentFormatDate(date).format('MM')}/${date.getDate()}`
}

const convertDate = (value: any) => {
  if (!value || value === ERROR_DATE || value === ERROR_DATE_STRING) {
    return
  }
  const date = new Date(value)
  return date.toISOString().substr(0, 10)
}

const roundUp = (value: any) => {
  if (Number(value) === 0) {
    return 0
  }
  return Math.ceil(value)
}

const roundDown = (value: any) => {
  if (Number(value) === 0) {
    return 0
  }
  return Math.floor(value)
}

const convertTime = (value: any) => {
  if (!value) return
  const { t, locale } = useI18n()
  const hours = value.getHours().toString().length === 1 ? `0${value.getHours()}` : value.getHours()
  const minutes = value.getMinutes().toString().length === 1 ? `0${value.getMinutes()}` : value.getMinutes()
  if (locale.value === LANGUAGES.JAPANESE) {
    return `${hours}${t('hour')}${minutes}${t('minute')}`
  }
  return `${hours}:${minutes}`
}

export {
  roundUp,
  roundDown,
  formatCurrency,
  convertDateString,
  convertDate,
  convertDateToString,
  formatNumber,
  convertYearString,
  formatNumberCurrency,
  convertDateInput,
  convertMonthToString,
  convertDateTimeToString,
  convertTime,
}

export const getFormattedDate = (date: string, mode = LANGUAGES.JAPANESE) => {
  if (mode === LANGUAGES.JAPANESE) {
    return momentFormatDate(date).format(YYYY_M_D_JP)
  }

  return momentFormatDate(date).format(D_MMM_YYYY)
}

export const getMonth = (date: string, mode = LANGUAGES.JAPANESE) => {
  if (mode === LANGUAGES.JAPANESE) {
    return momentFormatDate(date).format(M_JP)
  }

  return momentFormatDate(date).format(MMM)
}

export const getMonthAndYear = (date: string, mode = LANGUAGES.JAPANESE) => {
  if (mode === LANGUAGES.JAPANESE) {
    return momentFormatDate(date).format(YYYY_M_JP)
  }

  return momentFormatDate(date).format(MMM_YYYY)
}

export const numberWithComma = (num: number) => {
  if (num !== parseInt(`${num}`)) {
    return `${num}`.replace(/(\d)(?=(\d{3})+(?!\d)\.)/g, '$1,')
  }

  return `${num}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const convertCurrency = (currentValue: any) => {
  return currentValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const isCurrency = (currentValue: any) => {
  return /^[0-9,]+$/.test(currentValue)
}

export const isTypingNumber = (currentValue: any) => {
  return /^\d+$/.test(currentValue)
}

export const validateRomaji = (value: any) => {
  // return /^[a-zA-Z]+[a-zA-Z0-9_]*$/u.test(value)
  return /^[a-zA-Z0-9\s.,]+$/.test(value)
}

export const validateDecimal = (value: any) => {
  return /^\d{0,2}(?:\.\d)?$/.test(value)
}

export const validateNumber = (value: any) => {
  return /^[0-9]*$/.test(value)
}

export const getChargeHistoryKeyText = (type: number): string | undefined => {
  const key = Object.keys(CHARGE_HISTORY_TYPE).find((key) => (CHARGE_HISTORY_TYPE as any)[key] === type)

  if (key) {
    return (CHARGE_HISTORY_TYPE_TEXT as any)[key]
  }
}

export const parseParamsToQueryStringV3 = (params: any) => {
  const q = new URLSearchParams()
  const exceptValues = ['', null, undefined, false, NaN]
  Object.keys(params).forEach((key) => {
    if (Array.isArray(params[key])) params[key].forEach((value: any) => q.append(key, value))
    else if (!exceptValues.includes(params[key])) q.append(key, params[key])
  })
  return q
}
