<template>
  <div id="scrollBreakdown" class="cus-tabel-wrapper">
    <table>
      <thead>
        <tr>
          <th style="min-width: 180px">
            <div class="align-center">
              <div>{{ t('balance_manager.items') }}</div>
            </div>
          </th>
          <th>{{ t('balance_manager.classification') }}</th>
          <th>{{ t('dashboard.number') }}</th>
          <th>{{ t('balance_manager.unit_price') }}</th>
          <th>{{ t('balance_manager.contract_rate') }}</th>
          <th>{{ t('balance_manager.payment_fees') }}</th>
          <th>{{ t('balance_manager.previous_month') }}</th>
          <th>{{ t('balance_manager.payee_note') }}</th>
          <th>{{ t('balance_manager.payment_status') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="isLoading">
          <td colspan="10">
            <div class="d-flex justify-center">
              <va-progress-circle size="small" indeterminate />
            </div>
          </td>
        </tr>
        <template v-else-if="dataBreakdown && dataBreakdown.length > 0">
          <template v-if="!props.type">
            <tr v-for="(item, index) in dataBreakdown" :key="index">
              <td>
                {{ setItemName(item.type_fee, item.client_id, item.item_name) }}
              </td>
              <td class="text-left">
                {{ setClassName(item.type_fee, item.classification) }}
              </td>
              <td class="text-right">
                {{ formatNumber(item.number_transaction) }}
              </td>
              <td class="text-right">
                {{ formatCurrency.func(+item.amount, true) }}
              </td>
              <td class="text-right">
                {{
                  Number(item.type_fee) === ITEM_TYPE_LIST.REFERRAL_FEE_ACCOUNT && item.item_name === '口座紹介手数料'
                    ? '-'
                    : `${item.rate && parseFloat(item.rate)}%`
                }}
              </td>
              <td class="text-right">
                {{ formatCurrency.func(+item.profit, true) }}
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(+item.previous_month, true) }}</div>
              </td>
              <td style="width: 250px" class="text-left" :class="`${item.memo ? 'hover-text' : ''}`">
                <div>
                  {{
                    `${
                      item.memo?.length > 30
                        ? `&nbsp;${item.memo.slice(0, 30)}...`
                        : `${item.memo ? `${item.memo}` : ''}`
                    }`
                  }}
                </div>
                <div
                  v-if="item.memo && item.memo?.length > 30"
                  id="fade"
                  class="tooltip-text"
                  style="word-break: break-word"
                >
                  &nbsp;{{ item.memo }}
                </div>
              </td>
              <td class="border-bottom">
                <div class="text-right">{{ convertDateToString(item.payment_status) }}</div>
              </td>
            </tr>
          </template>
          <template v-else>
            <template v-for="(val, key) in dataBreakdown" :key="key">
              <tr v-if="val.is_manual === 0">
                <td>
                  {{ setItemName(val.type_fee, val.client_id, val.item_name) }}
                </td>
                <td class="text-left">
                  {{ setClassName(val.type_fee, val.classification) }}
                </td>
                <td class="text-right">
                  {{ formatNumber(val.number_transaction) }}
                </td>
                <td class="text-right">
                  {{ formatCurrency.func(+val.amount, true) }}
                </td>
                <td class="text-right">
                  {{
                    Number(val.type_fee) === ITEM_TYPE_LIST.REFERRAL_FEE_ACCOUNT && val.item_name === '口座紹介手数料'
                      ? '-'
                      : `${val.rate && parseFloat(val.rate)}%`
                  }}
                </td>
                <td class="text-right">
                  {{ formatCurrency.func(+val.profit, true) }}
                </td>
                <td class="text-right">
                  <div>{{ formatCurrency.func(+val.previous_month, true) }}</div>
                </td>
                <td>
                  <div><va-input v-model.trim="val.memo" v-slice-memo></va-input></div>
                </td>
                <td class="border-bottom">
                  <div>
                    <SelectDatePicker
                      v-model="val.payment_status"
                      clearable
                      class="mr-2"
                      placement="top"
                      :is-input="true"
                      :disabled-cus="'none'"
                    />
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td class="border-right">
                  <va-select
                    v-model="val.item_name"
                    :placeholder="t('placeholder.select')"
                    :no-options-text="`${t('list_no_data')}`"
                    bordered
                    clearable
                    :options="listItem"
                    :track-by="(item: any) => t(item)"
                  />
                </td>
                <td>
                  <va-select
                    v-if="val.item_name === listItem[0] || val.item_name === listItem[1]"
                    v-model="val.classification"
                    :disabled="!val.item_name"
                    :placeholder="t('placeholder.select')"
                    :no-options-text="`${t('list_no_data')}`"
                    bordered
                    clearable
                    :options="listTypeAccount"
                  />
                  <va-select
                    v-else-if="val.item_name === listItem[2]"
                    v-model="val.classification"
                    :disabled="!val.item_name"
                    :placeholder="t('placeholder.select')"
                    :no-options-text="`${t('list_no_data')}`"
                    bordered
                    clearable
                    :options="listClass"
                  />
                  <va-input v-else v-model.trim="val.classification" v-slice-name :disabled="!val.item_name"></va-input>
                </td>
                <td>
                  <va-input
                    v-model.trim="val.number_transaction"
                    v-replace-num-trans
                    :disabled="!val.item_name"
                    mask="numeral"
                    input-class="va-text-right"
                  ></va-input>
                </td>
                <td>
                  <va-input
                    v-model="val.amount"
                    v-replace-num-trans
                    :disabled="!val.item_name"
                    mask="numeral"
                    input-class="va-text-right"
                  >
                    <template #prependInner>
                      <span style="color: #788b9a">¥</span>
                    </template>
                  </va-input>
                </td>
                <td>
                  <va-input
                    v-model.trim="val.rate"
                    v-replace-rate
                    :disabled="val.item_name === listItem[3] || val.item_name === listItem[4] || !val.item_name"
                    mask="numeral"
                    input-class="va-text-right"
                  ></va-input>
                </td>
                <td>
                  <va-input
                    v-if="listItem.slice(0, 3).includes(val.item_name)"
                    :model-value="formatNumber(val.profit)"
                    input-class="va-text-right"
                    disabled
                    mask="numeral"
                  >
                    <template #prependInner>
                      <span style="color: #788b9a">¥</span>
                    </template>
                  </va-input>
                  <va-input
                    v-else
                    v-model="val.profit"
                    v-replace-num-trans
                    :disabled="!val.item_name"
                    mask="numeral"
                    input-class="va-text-right"
                  >
                    <template #prependInner>
                      <span style="color: #788b9a">¥</span>
                    </template>
                  </va-input>
                </td>
                <td>
                  <va-input v-model="val.previous_month" v-replace-num-trans mask="numeral" input-class="va-text-right">
                    <template #prependInner>
                      <span style="color: #788b9a">¥</span>
                    </template>
                  </va-input>
                </td>
                <td style="width: 200px">
                  <va-input v-model="val.memo" v-slice-memo></va-input>
                </td>
                <td class="border-bottom">
                  <div class="d-flex align-center">
                    <SelectDatePicker
                      v-model="val.payment_status"
                      clearable
                      class="mr-2"
                      placement="top"
                      :is-input="true"
                      :disabled-cus="'none'"
                    />
                    <va-icon
                      color="warning"
                      name="fa-regular fa-circle-minus"
                      @click="minusExpenseBreakdown(key, val)"
                    />
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </template>
        <tr v-else>
          <td colspan="10" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
        </tr>
        <template v-for="(value, index) in data" :key="index">
          <tr v-if="data && data.length > 0">
            <td class="border-right">
              <va-select
                v-model="value.items"
                :placeholder="t('placeholder.select')"
                :no-options-text="`${t('list_no_data')}`"
                bordered
                clearable
                :error="isError"
                :options="listItem"
              />
            </td>
            <td>
              <va-select
                v-if="value.items === listItem[0] || value.items === listItem[1]"
                v-model="value.classification"
                :disabled="!value.items"
                :placeholder="t('placeholder.select')"
                :no-options-text="`${t('list_no_data')}`"
                bordered
                clearable
                :error="isError"
                :options="listTypeAccount"
              />
              <va-select
                v-else-if="value.items === listItem[2]"
                v-model="value.classification"
                :disabled="!value.items"
                :placeholder="t('placeholder.select')"
                :no-options-text="`${t('list_no_data')}`"
                bordered
                clearable
                :error="isError"
                :options="listClass"
              />
              <va-input
                v-else
                v-model.trim="value.classification"
                v-slice-name
                :disabled="!value.items"
                :error="isError"
              ></va-input>
            </td>
            <td>
              <va-input
                v-model.trim="value.number_transaction"
                v-replace-num-trans
                :disabled="!value.items"
                mask="numeral"
                :error="isError"
                input-class="va-text-right"
              ></va-input>
            </td>
            <td>
              <va-input
                v-model="value.amount"
                v-replace-num-trans
                :disabled="!value.items"
                :error="isError"
                mask="numeral"
                input-class="va-text-right"
              >
                <template #prependInner>
                  <span style="color: #788b9a">¥</span>
                </template>
              </va-input>
            </td>
            <td>
              <va-input
                v-model.trim="value.rate"
                v-replace-rate
                :disabled="value.items === listItem[3] || value.items === listItem[4] || !value.items"
                mask="numeral"
                :error="value.items === listItem[3] || value.items === listItem[4] ? false : isError"
                input-class="va-text-right"
              ></va-input>
            </td>
            <td>
              <va-input
                v-if="listItem.slice(0, 3).includes(value.items)"
                :model-value="formatNumber(value.profit)"
                input-class="va-text-right"
                disabled
                :error="isError"
                mask="numeral"
              >
                <template #prependInner>
                  <span style="color: #788b9a">¥</span>
                </template>
              </va-input>
              <va-input
                v-else
                v-model="value.profit"
                v-replace-num-trans
                :disabled="!value.items"
                :error="isError"
                mask="numeral"
                input-class="va-text-right"
              >
                <template #prependInner>
                  <span style="color: #788b9a">¥</span>
                </template>
              </va-input>
            </td>
            <td>
              <va-input v-model="value.previous_month" v-replace-num-trans mask="numeral" input-class="va-text-right">
                <template #prependInner>
                  <span style="color: #788b9a">¥</span>
                </template>
              </va-input>
            </td>
            <td>
              <va-input v-model="value.memo" v-slice-memo></va-input>
            </td>
            <td class="border-bottom">
              <div class="d-flex align-center">
                <SelectDatePicker
                  v-model="value.payment_status"
                  clearable
                  class="mr-2"
                  placement="top"
                  :is-input="true"
                  :disabled-cus="'none'"
                />
                <va-icon color="warning" name="fa-regular fa-circle-minus" @click="minusExpenseBreakdown(index)" />
              </div>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr v-if="props.type && dataBreakdown && dataBreakdown.length > 0">
          <td colspan="2">
            <p v-if="isError" style="font-size: small; padding-left: 7px; font-weight: 600">
              <span class="error-msg" style="color: red">{{ t('message_error.required_field') }}</span>
            </p>
            <div class="action-add" @click="addExpenseBreakdown()">
              <va-icon name="fa-regular fa-circle-plus" />
              <span class="pl-1">{{ t('balance_manager.add_expense_breakdown') }}</span>
            </div>
          </td>
          <td colspan="7"></td>
        </tr>
        <tr class="row-total">
          <td colspan="5">{{ t('balance_manager.total') }}</td>
          <td class="text-right">{{ totalProfit }}</td>
          <td class="text-right">{{ totalPrevious }}</td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import {
    reactive,
    ref,
    computed,
    watch,
    defineExpose,
    withDefaults,
    defineProps,
    defineAsyncComponent,
    nextTick,
  } from 'vue'
  import { convertDateToString, formatCurrency, formatNumber, roundUp } from '../../common/utils'
  import {
    ITEM_TYPE_LIST_TEXT,
    ITEM_TYPE_LIST_TEXT_EN,
    ITEM_TYPE_LIST_TEXT_JP,
    CLASS_LIST_TEXT_EN,
    TYPE_LIST_TEXT_EN,
    CLASS_LIST_TEXT,
    ERROR_DATE_STRING,
    ITEM_TYPE_LIST,
    TYPE_LIST_TEXT,
  } from '../../common/constants'
  const { t } = useI18n()

  const SelectDatePicker = defineAsyncComponent(() => import('../../components/select-date-picker/index.vue'))

  const data = reactive([] as any)
  const isLoading = ref(false)
  const isError = ref(false)

  const emit = defineEmits<{
    (e: 'error', error: boolean): void
    (e: 'deleteRow', data: any): void
  }>()

  const props = withDefaults(
    defineProps<{
      type: boolean
      dataBreakdown: any
      selectListClient: any
    }>(),
    {
      dataBreakdown: [] as any[],
      type: false,
    },
  )

  const listItem = computed(() => {
    return [
      t(ITEM_TYPE_LIST_TEXT.ACCOUNT_USAGE_FEE),
      t(ITEM_TYPE_LIST_TEXT.MONTHLY_USAGE_FEE),
      t(ITEM_TYPE_LIST_TEXT.REFERRAL_FEE),
      t(ITEM_TYPE_LIST_TEXT.OUTSOURCING_FEE),
      t(ITEM_TYPE_LIST_TEXT.OTHER_EXPENSES),
    ]
  })

  const listTypeAccount = computed(() => {
    return [t(TYPE_LIST_TEXT.DEPOSIT_ACCOUNT), t(TYPE_LIST_TEXT.WITHDRAWAL_ACCOUNT)]
  })

  const listClass = computed(() => {
    return [t(CLASS_LIST_TEXT.CLIENT), t(CLASS_LIST_TEXT.ACCOUNT)]
  })

  const totalProfit = computed(() => {
    return formatCurrency.func(
      props.dataBreakdown.reduce((acc: any, cur: any) => roundUp(acc) + roundUp(cur.profit), 0),
    )
  })

  const totalPrevious = computed(() => {
    return formatCurrency.func(
      props.dataBreakdown.reduce((acc: any, cur: any) => roundUp(acc) + roundUp(cur.previous_month), 0),
    )
  })

  const setItemName = (type: string, client_id: number, item_name: string) => {
    if (Number(type) === ITEM_TYPE_LIST.REFERRAL_FEE_ACCOUNT || Number(type) === ITEM_TYPE_LIST.REFERRAL_FEE_CLIENT) {
      const name =
        item_name === 'クライアント紹介手数料'
          ? 'balance_manager.client_referral_fee'
          : item_name === '口座紹介手数料'
          ? 'balance_manager.account_referral_fee'
          : item_name
      const client_name = client_id ? ` (${getClientName(client_id)})` : ''
      return item_name ? t(name) + client_name : item_name
    } else {
      if (item_name === ITEM_TYPE_LIST_TEXT_EN.ACCOUNT_USAGE_FEE) {
        return t('balance_manager.account_usage_fee')
      } else if (item_name === ITEM_TYPE_LIST_TEXT.MONTHLY_USAGE_FEE) {
        return t('balance_manager.monthly_usage_fee')
      } else if (item_name === ITEM_TYPE_LIST_TEXT.REFERRAL_FEE) {
        return t('balance_manager.referral_fee')
      } else if (item_name === ITEM_TYPE_LIST_TEXT.OUTSOURCING_FEE) {
        return t('balance_manager.outsourcing_fee')
      } else if (item_name === ITEM_TYPE_LIST_TEXT.OTHER_EXPENSES) {
        return t('balance_manager.other_expenses')
      } else {
        return item_name
      }
    }
  }

  const getClientName = (value: number) => {
    let clientName = ''
    props.selectListClient.options.forEach((client: any) => {
      if (client.id == value) {
        clientName = client.text as string
      }
    })
    return clientName
  }

  const setClassName = (type: string, classification: string) => {
    if (Number(type) === ITEM_TYPE_LIST.ACCOUNT_FEE_DEPOSIT || Number(type) === ITEM_TYPE_LIST.MONTHLY_FEE_DEPOSIT) {
      return t(TYPE_LIST_TEXT.DEPOSIT_ACCOUNT)
    } else if (
      Number(type) === ITEM_TYPE_LIST.ACCOUNT_FEE_WITHDRAWAL ||
      Number(type) === ITEM_TYPE_LIST.MONTHLY_FEE_WITHDRAWAL
    ) {
      return t(TYPE_LIST_TEXT.WITHDRAWAL_ACCOUNT)
    } else if (Number(type) === ITEM_TYPE_LIST.REFERRAL_FEE_CLIENT) {
      return t('balance_manager.payment')
    } else if (Number(type) === ITEM_TYPE_LIST.REFERRAL_FEE_ACCOUNT) {
      return t('balance_manager.withdrawal')
    } else {
      return classification
    }
  }

  const addExpenseBreakdown = () => {
    const value = {
      items: '',
      classification: '',
      number_transaction: '',
      amount: '',
      rate: '',
      profit: '',
      previous_month: '',
      memo: '',
      payment_status: new Date(),
    }

    nextTick(() => {
      const dataWidth = document.getElementById('scrollBreakdown')
      dataWidth?.scrollTo({ top: dataWidth.scrollHeight, behavior: 'smooth' })
    })

    return data.push(value)
  }

  const minusExpenseBreakdown = (index: number, value?: any) => {
    if (value) {
      emit('deleteRow', value)
    }
    data.splice(index, 1)
    if (data.length === 0) {
      return (isError.value = false)
    }
  }

  const transformItemName = (item: string) => {
    if (item === ITEM_TYPE_LIST_TEXT_EN.ACCOUNT_USAGE_FEE || item === ITEM_TYPE_LIST_TEXT_JP.ACCOUNT_USAGE_FEE) {
      return listItem.value[0]
    } else if (item === ITEM_TYPE_LIST_TEXT_EN.MONTHLY_USAGE_FEE || item === ITEM_TYPE_LIST_TEXT_JP.MONTHLY_USAGE_FEE) {
      return listItem.value[1]
    } else if (item === ITEM_TYPE_LIST_TEXT_EN.REFERRAL_FEE || item === ITEM_TYPE_LIST_TEXT_JP.REFERRAL_FEE) {
      return listItem.value[2]
    } else if (item === ITEM_TYPE_LIST_TEXT_EN.OUTSOURCING_FEE || item === ITEM_TYPE_LIST_TEXT_JP.OUTSOURCING_FEE) {
      return listItem.value[3]
    } else if (item === ITEM_TYPE_LIST_TEXT_EN.OTHER_EXPENSES || item === ITEM_TYPE_LIST_TEXT_JP.OTHER_EXPENSES) {
      return listItem.value[4]
    } else {
      return item
    }
  }

  // const transformClassName = (type_fee: number) => {
  //   if (type_fee === ITEM_TYPE_LIST.ACCOUNT_FEE_DEPOSIT || type_fee === ITEM_TYPE_LIST.MONTHLY_FEE_DEPOSIT) {
  //     return listTypeAccount.value[0]
  //   } else if (
  //     type_fee === ITEM_TYPE_LIST.ACCOUNT_FEE_WITHDRAWAL ||
  //     type_fee === ITEM_TYPE_LIST.MONTHLY_FEE_WITHDRAWAL
  //   ) {
  //     return listTypeAccount.value[1]
  //   } else if (type_fee === ITEM_TYPE_LIST.REFERRAL_FEE_CLIENT) {
  //     return listClass.value[0]
  //   } else if (type_fee === ITEM_TYPE_LIST.REFERRAL_FEE_ACCOUNT) {
  //     return listClass.value[1]
  //   } else {
  //     return ''
  //   }
  // }

  watch(
    () => data,
    () => {
      data.forEach((value: any) => {
        value.number_transaction = value.number_transaction
          ? roundUp(+value.number_transaction)
              .toString()
              .replace(/[.-]/g, '')
          : ''
        value.amount = value.amount
          ? roundUp(+value.amount)
              .toString()
              .replace(/[.-]/g, '')
          : ''
        value.rate =
          String(value.rate).indexOf('.') === 0
            ? parseFloat(value.rate?.replace(/[-]/g, '')).toFixed(1)
            : value.rate?.replace(/[-]/g, '')
        if (value.items !== listItem.value[3] && value.items !== listItem.value[4]) {
          value.profit = (roundUp(value?.amount || 0) * value?.rate || 0) / 100
          isError.value =
            value.client_id === '' ||
            value.item_name === '' ||
            value.number_transaction === '' ||
            value.amount === '' ||
            value.rate === '' ||
            value.profit === ''
              ? true
              : false
        } else {
          value.profit =
            roundUp(+value.profit) === 0
              ? ''
              : roundUp(+value.profit)
                  .toString()
                  .replace(/[.]/g, '')
          isError.value =
            value.client_id === '' ||
            value.item_name === '' ||
            value.number_transaction === '' ||
            value.amount === '' ||
            value.profit === ''
              ? true
              : false
        }
        value.previous_month = value.previous_month
          ? roundUp(+value.previous_month)
              .toString()
              .replace(/[.-]/g, '')
          : ''

        emit('error', isError.value)
      })
    },
    { deep: true },
  )

  watch(
    () => props.dataBreakdown,
    () => {
      if (props.dataBreakdown && props.dataBreakdown.length > 0) {
        props.dataBreakdown.forEach((value: any) => {
          if (value.is_manual === 1) {
            value.item_name = transformItemName(value.item_name)
            value.number_transaction = value.number_transaction
              ? roundUp(+value.number_transaction)
                  .toString()
                  .replace(/[.-]/g, '')
              : ''
            value.amount = value.amount
              ? roundUp(+value.amount)
                  .toString()
                  .replace(/[.-]/g, '')
              : ''
            value.rate =
              String(value.rate).indexOf('.') === 0
                ? parseFloat(value.rate?.replace(/[-]/g, '')).toFixed(1)
                : value.rate?.replace(/[-]/g, '')
            if (value.item_name !== listItem.value[3] && value.item_name !== listItem.value[4]) {
              value.profit = (roundUp(value?.amount || 0) * value?.rate || 0) / 100
            } else {
              value.profit =
                roundUp(+value.profit) === 0
                  ? ''
                  : roundUp(+value.profit)
                      .toString()
                      .replace(/[.]/g, '')
            }
            value.previous_month = value.previous_month
              ? roundUp(+value.previous_month)
                  .toString()
                  .replace(/[.-]/g, '')
              : ''

            isError.value =
              value.client_id === '' ||
              value.item_name === '' ||
              value.number_transaction === '' ||
              value.amount === '' ||
              value.rate === '' ||
              value.profit === ''
                ? true
                : false
            emit('error', isError.value)
          }
        })
      }
    },
    { immediate: true, deep: true },
  )

  watch(
    () => props.dataBreakdown,
    () => {
      if (props.dataBreakdown && props.dataBreakdown.length > 0) {
        props.dataBreakdown.forEach((value: any) => {
          value.payment_status = value.payment_status === ERROR_DATE_STRING ? null : new Date(value.payment_status)
        })
      }
    },
  )

  const getDataSubmit = () => {
    if (!data || data.length === 0) {
      return
    } else {
      const dataSubmit = data.map((item: any) => {
        return {
          item_name: setName(item.items),
          classification: setClassification(item.type_fee, item.classification),
          income_expenditure_id: props.dataBreakdown[0].income_expenditure_id,
          type: props.dataBreakdown[0].type,
          number_transaction: item.number_transaction,
          amount: item.amount,
          rate: item.rate,
          profit: item.profit,
          previous_month: item.previous_month,
          memo: item.memo,
          payment_status: item.payment_status,
          is_manual: 1,
          type_fee: setTypeFee(item.items, item.classification),
        }
      })
      return dataSubmit
    }
  }

  const setTypeFee = (item: string, classification: string) => {
    if (item === listItem.value[0]) {
      return classification === listTypeAccount.value[0]
        ? ITEM_TYPE_LIST.ACCOUNT_FEE_DEPOSIT
        : ITEM_TYPE_LIST.ACCOUNT_FEE_WITHDRAWAL
    } else if (item === listItem.value[1]) {
      return classification === listTypeAccount.value[0]
        ? ITEM_TYPE_LIST.MONTHLY_FEE_DEPOSIT
        : ITEM_TYPE_LIST.MONTHLY_FEE_WITHDRAWAL
    } else if (item === listItem.value[2]) {
      return classification === listClass.value[0]
        ? ITEM_TYPE_LIST.REFERRAL_FEE_CLIENT
        : ITEM_TYPE_LIST.REFERRAL_FEE_ACCOUNT
    } else if (item === listItem.value[3]) {
      return ITEM_TYPE_LIST.OUTSOURCING_FEE
    } else if (item === listItem.value[4]) {
      return ITEM_TYPE_LIST.OTHER_EXPENSES
    }
  }

  const setName = (item: string) => {
    if (item === listItem.value[0]) {
      return ITEM_TYPE_LIST_TEXT_EN.ACCOUNT_USAGE_FEE
    } else if (item === listItem.value[1]) {
      return ITEM_TYPE_LIST_TEXT_EN.MONTHLY_USAGE_FEE
    } else if (item === listItem.value[2]) {
      return ITEM_TYPE_LIST_TEXT_EN.REFERRAL_FEE
    } else if (item === listItem.value[3]) {
      return ITEM_TYPE_LIST_TEXT_EN.OUTSOURCING_FEE
    } else if (item === listItem.value[4]) {
      return ITEM_TYPE_LIST_TEXT_EN.OTHER_EXPENSES
    }
  }

  const setClassification = (classification: string, item: string) => {
    if (classification === listTypeAccount.value[0]) {
      return TYPE_LIST_TEXT_EN.DEPOSIT_ACCOUNT
    } else if (classification === listTypeAccount.value[1]) {
      return TYPE_LIST_TEXT_EN.WITHDRAWAL_ACCOUNT
    } else if (classification === listClass.value[0]) {
      return CLASS_LIST_TEXT_EN.CLIENT
    } else if (classification === listClass.value[1]) {
      return CLASS_LIST_TEXT_EN.ACCOUNT
    } else {
      return item
    }
  }

  defineExpose({
    getDataSubmit,
  })
</script>
<style lang="scss" scoped>
  .cus-tabel-wrapper {
    overflow: scroll;
    max-height: 540px;
    td {
      border-bottom: 1px solid #cccccc;

      &.border-right {
        border-right: 1px solid #06152b;
      }
      &.border-bottom {
        border-bottom: 1px solid #cccccc;
      }
    }
    table {
      thead {
        position: sticky;
        top: 0px;
        background-color: #ffffff;
        z-index: 1;

        th:first-child {
          border-right: 1px solid #06152b;
        }
      }
      tfoot {
        background-color: #fff;
        line-height: 23px;
        position: sticky;
        bottom: -1px;

        tr {
          td:first-child {
            border-right: none;
          }
        }
      }
      tr {
        td {
          &:first-child {
            border-right: 1px solid #06152b;
          }
        }
        &.row-total {
          height: 50px;
          background-color: #1c78dd;
          font-weight: 700;
          font-size: 18px;
          line-height: 26px;
          color: #fff;

          td {
            vertical-align: middle;
            border-right: none;
          }
        }
      }
    }

    .action-add {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: 500;
    }
  }
</style>
