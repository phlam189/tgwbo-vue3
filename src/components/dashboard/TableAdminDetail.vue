<template>
  <div class="cus-tabel-wrapper" :style="`max-height: ${props.isZoomOut ? 'calc(100vh - 214px)' : '540px'}`">
    <table>
      <!-- Header table -->
      <thead>
        <tr>
          <th class="border-bottom-2 va-text-center" rowspan="2" colspan="3" style="min-width: 260px">
            {{ t('dashboard.date') }}
          </th>
          <th class="border-bottom" colspan="3">{{ showTextColumn }}</th>
          <th v-show="!isDisabledAccountTransfer" class="border-bottom">{{ t('cs_dashboard.account_transfer') }}</th>
          <th v-show="!isDisabledOtherCharge" class="border-bottom" colspan="2">
            {{ t('cs_dashboard.other_charge') }}
          </th>
          <th v-show="!isDisabledSettlement" class="border-bottom" colspan="2">{{ t('cs_dashboard.settlement') }}</th>
          <th class="border-bottom" colspan="3">{{ t('dashboard.refund') }}</th>
          <th class="border-bottom">{{ t('dashboard.system_fee') }}</th>
          <th class="border-bottom-2" rowspan="2" style="min-width: 150px">{{ t('dashboard.account_balance') }}</th>
          <th class="border-bottom-2" rowspan="2" style="width: 150px">{{ t('dashboard.memo') }}</th>
          <th class="border-bottom" colspan="3">{{ t('dashboard.others') }}</th>
          <th class="border-bottom-2" rowspan="2" style="min-width: 150px">{{ t('dashboard.actual_balance') }}</th>
          <th class="border-bottom-2" rowspan="2" style="width: 150px">{{ t('dashboard.admin_note') }}</th>
        </tr>
        <tr>
          <th style="min-width: 74px">{{ t('dashboard.number') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.commission') }}</th>
          <th v-show="!isDisabledAccountTransfer" style="min-width: 110px">{{ t('cs_dashboard.amount_of_money') }}</th>
          <th v-show="!isDisabledOtherCharge" style="min-width: 110px">{{ t('cs_dashboard.amount_of_money') }}</th>
          <th v-show="!isDisabledOtherCharge" style="min-width: 110px">{{ t('cs_dashboard.commission') }}</th>
          <th v-show="!isDisabledSettlement" style="min-width: 110px">{{ t('cs_dashboard.amount_of_money') }}</th>
          <th v-show="!isDisabledSettlement" style="min-width: 110px">{{ t('cs_dashboard.commission') }}</th>
          <th style="min-width: 74px">{{ t('dashboard.number') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.commission') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>

          <th style="min-width: 110px">{{ t('dashboard.subject') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px" class="border-right">{{ t('dashboard.commission') }}</th>
        </tr>
      </thead>

      <!-- Body table -->
      <tbody>
        <template v-if="props.list?.length > 0">
          <template v-for="(item, index) in props.list" :key="`${item.date}__${item.type}`">
            <tr
              v-if="
                props.typeSearch !== 'deposits_and_withdrawals' ||
                (props.typeSearch === 'deposits_and_withdrawals' && index % 2 === 0)
              "
              :class="{
                'select-row': selected.includes(generateClientAggregationKey(item)),
                'row-first': props.typeSearch === 'deposits_and_withdrawals' && index % 2 === 0,
              }"
            >
              <td :rowspan="props.typeSearch === 'deposits_and_withdrawals' ? 2 : 1" class="row-select fixed-column1">
                <va-checkbox v-model="selected" :array-value="generateClientAggregationKey(item)" />
              </td>
              <td class="first-column fixed-column2" :rowspan="props.typeSearch === 'deposits_and_withdrawals' ? 2 : 1">
                <div>
                  {{ item.date ? convertDateToString(item.date) : convertMonth(item.month || '') }}
                </div>
              </td>
              <td class="border-right-flex fixed-column3">
                <div>
                  {{
                    item.type === DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL
                      ? t('cs_dashboard.withdrawal')
                      : t('cs_dashboard.payment')
                  }}
                </div>
              </td>
              <td class="text-right">
                <div>{{ formatNumber(item.number_trans) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.commission_bank_fee) }}</div>
              </td>
              <td v-show="!isDisabledAccountTransfer" class="text-right">
                <div>{{ formatCurrency.func(item.transfer_amount) }}</div>
              </td>
              <td v-show="!isDisabledOtherCharge" class="text-right">
                <div>{{ formatCurrency.func(item.charge_amount) }}</div>
              </td>
              <td v-show="!isDisabledOtherCharge" class="text-right">
                <div>{{ formatCurrency.func(item.charge_fee) }}</div>
              </td>
              <td v-show="!isDisabledSettlement" class="text-right">
                <div>{{ formatCurrency.func(item.settlement_amount) }}</div>
              </td>
              <td v-show="!isDisabledSettlement" class="text-right">
                <div>{{ formatCurrency.func(item.settlement_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatNumber(item.number_refunds) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.refund_amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.refund_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.system_usage_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.account_balance) }}</div>
              </td>
              <td
                v-if="item.charge_history && item.charge_history.length > 0"
                :class="`${item.charge_history ? 'hover-text' : ''}`"
              >
                <div class="row-note">
                  <div v-if="item.charge_history.length > 0">
                    <template v-for="(note, number) in item.charge_history" :key="number">
                      <div>
                        {{
                          `${
                            note.memo?.length > 15
                              ? `-&nbsp;${note.memo.slice(0, 15)}...`
                              : `${note.memo ? `-${note.memo}` : ''}`
                          }`
                        }}
                      </div>
                    </template>
                  </div>
                </div>
                <div v-if="convertMemoText(item.charge_history)" id="fade" class="tooltip-text" style="word-break: break-word">
                  <div v-html="convertMemoText(item.charge_history)"></div>
                </div>
              </td>
              <td v-else></td>
              <td class="text-right"><div></div></td>
              <td class="text-right"><div></div></td>
              <td class="text-right"><div></div></td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.actual_balance) }}</div>
              </td>
              <td
                v-if="item.charge_history && item.charge_history.length > 0"
                :class="`${item.charge_history ? 'hover-text' : ''}`"
              >
                <div class="row-note">
                  <div v-if="item.charge_history.length > 0">
                    <template v-for="(note, number) in item.charge_history" :key="number">
                      <div>
                        {{
                          `${
                            note.memo_internal?.length > 15
                              ? `-&nbsp;${note.memo_internal.slice(0, 15)}...`
                              : `${note.memo_internal ? `-${note.memo_internal}` : ''}`
                          }`
                        }}
                      </div>
                    </template>
                  </div>
                </div>
                <div
                  v-if="convertMemoText(item.charge_history, 'internal')"
                  id="fade"
                  class="tooltip-text"
                  style="word-break: break-word"
                >
                  <div v-html="convertMemoText(item.charge_history, 'internal')"></div>
                </div>
              </td>
              <td v-else><div></div></td>
            </tr>
            <tr
              v-if="props.typeSearch === 'deposits_and_withdrawals' && index % 2 === 1"
              class="row-second"
              :class="{ 'select-row': selected.includes(generateClientAggregationKey(item)) }"
            >
              <td class="border-right-flex fixed-column4">
                <div>{{ t('cs_dashboard.withdrawal') }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatNumber(item.number_trans) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.commission_bank_fee) }}</div>
              </td>
              <td v-show="!isDisabledAccountTransfer" class="text-right">
                <div>{{ formatCurrency.func(item.transfer_amount) }}</div>
              </td>
              <td v-show="!isDisabledOtherCharge" class="text-right">
                <div>{{ formatCurrency.func(item.charge_amount) }}</div>
              </td>
              <td v-show="!isDisabledOtherCharge" class="text-right">
                <div>{{ formatCurrency.func(item.charge_fee) }}</div>
              </td>
              <td v-show="!isDisabledSettlement" class="text-right">
                <div>{{ formatCurrency.func(item.settlement_amount) }}</div>
              </td>
              <td v-show="!isDisabledSettlement" class="text-right">
                <div>{{ formatCurrency.func(item.settlement_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatNumber(item.number_refunds) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.refund_amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.refund_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.system_usage_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.account_balance) }}</div>
              </td>
              <td
                v-if="item.charge_history && item.charge_history.length > 0"
                :class="`${item.charge_history ? 'hover-text' : ''}`"
              >
                <div class="row-note">
                  <div v-if="item.charge_history.length > 0">
                    <template v-for="(note, number) in item.charge_history" :key="number">
                      <div>
                        {{
                          `${
                            note.memo?.length > 15
                              ? `-&nbsp;${note.memo.slice(0, 15)}...`
                              : `${note.memo ? `-${note.memo}` : ''}`
                          }`
                        }}
                      </div>
                    </template>
                  </div>
                </div>
                <div v-if="convertMemoText(item.charge_history)" id="fade" class="tooltip-text" style="word-break: break-word">
                  <div v-html="convertMemoText(item.charge_history)"></div>
                </div>
              </td>
              <td v-else><div></div></td>
              <td class="text-right"><div></div></td>
              <td class="text-right"><div></div></td>
              <td class="text-right"><div></div></td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.actual_balance) }}</div>
              </td>
              <td
                v-if="item.charge_history && item.charge_history.length > 0"
                :class="`${item.charge_history ? 'hover-text' : ''}`"
              >
                <div class="row-note">
                  <div v-if="item.charge_history.length > 0">
                    <template v-for="(note, number) in item.charge_history" :key="number">
                      <div>
                        {{
                          `${
                            note.memo_internal?.length > 15
                              ? `-&nbsp;${note.memo_internal.slice(0, 15)}...`
                              : `${note.memo_internal ? `-${note.memo_internal}` : ''}`
                          }`
                        }}
                      </div>
                    </template>
                  </div>
                </div>
                <div
                  v-if="convertMemoText(item.charge_history, 'internal')"
                  id="fade"
                  class="tooltip-text"
                  style="word-break: break-word">
                  <div v-html="convertMemoText(item.charge_history, 'internal')"></div>
                </div>
              </td>
              <td v-else><div></div></td>
            </tr>
            <template
              v-if="
                props.typeSearch !== 'deposits_and_withdrawals' ||
                (props.typeSearch === 'deposits_and_withdrawals' && index % 2 === 1)
              "
            >
              <template
                v-for="(chargeHistory, number) in filterDataChargeHistory(getDataChargeHistory(item, index))"
                :key="number"
              >
                <tr class="charge-history-row" :class="{ 'select-row': selected.includes(`${chargeHistory.id}`) }">
                  <td class="row-select fixed-column1">
                    <va-checkbox v-model="selected" :array-value="`${chargeHistory.id}`" />
                  </td>
                  <td class="first-column fixed-column2">
                    <div>
                      {{ item.date ? convertDateToString(item.date) : convertMonth(item.month || '') }}
                    </div>
                  </td>
                  <td class="border-right-flex fixed-column3">
                    <div>
                      {{
                        chargeHistory.typeParent === DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL
                          ? t('cs_dashboard.withdrawal')
                          : t('cs_dashboard.payment')
                      }}
                    </div>
                  </td>
                  <td class="text-right"><div></div></td>
                  <td class="text-right"><div></div></td>
                  <td class="text-right"><div></div></td>
                  <td v-show="!isDisabledAccountTransfer" class="text-right"><div></div></td>
                  <td v-show="!isDisabledOtherCharge" class="text-right"><div></div></td>
                  <td v-show="!isDisabledOtherCharge" class="text-right"><div></div></td>
                  <td v-show="!isDisabledSettlement" class="text-right"><div></div></td>
                  <td v-show="!isDisabledSettlement" class="text-right"><div></div></td>
                  <td class="text-right"><div></div></td>
                  <td class="text-right"><div></div></td>
                  <td class="text-right"><div></div></td>
                  <td class="text-right"><div></div></td>
                  <td class="text-right"><div></div></td>
                  <td :class="`va-text-left ${chargeHistory.memo ? 'hover-text' : ''}`">
                    <div class="row-note">
                      <div>
                        {{
                          `${
                            chargeHistory.memo?.length > 15
                              ? `-&nbsp;${chargeHistory.memo.slice(0, 15)}...`
                              : `${chargeHistory.memo ? `-${chargeHistory.memo}` : ''}`
                          }`
                        }}
                      </div>
                    </div>
                    <div v-if="chargeHistory.memo" id="fade" class="tooltip-text" style="word-break: break-word">
                      -&nbsp;{{ chargeHistory.memo }}
                    </div>
                  </td>
                  <td class="va-text-left">
                    <div>
                      {{ t(`${getChargeHistoryKeyText(chargeHistory.type)}`) }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(chargeHistory.payment_amount) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(chargeHistory.charge_fee) }}</div>
                  </td>
                  <td class="text-right">{{ formatCurrency.func(chargeHistory.actual_balance) }}</td>
                  <td :class="`va-text-left ${chargeHistory.memo_internal ? 'hover-text' : ''}`">
                    <div class="row-note">
                      <div>
                        {{
                          `${
                            chargeHistory.memo_internal?.length > 15
                              ? `-&nbsp;${chargeHistory.memo_internal.slice(0, 15)}...`
                              : `${chargeHistory.memo_internal ? `-${chargeHistory.memo_internal}` : ''}`
                          }`
                        }}
                      </div>
                    </div>
                    <div
                      v-if="chargeHistory.memo_internal"
                      id="fade"
                      class="tooltip-text"
                      style="word-break: break-word"
                    >
                      -&nbsp;{{ chargeHistory.memo_internal }}
                    </div>
                  </td>
                </tr>
              </template>
            </template>
          </template>
        </template>
        <tr v-else>
          <td colspan="23" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, watch, computed, defineProps } from 'vue'
  import ClientAggregation from '../../types/ClientAggregation'
  import { convertDateToString, formatCurrency, formatNumber, getChargeHistoryKeyText } from '../../common/utils'
  import {
    DATE_PICKER_TYPES,
    DEPOSIT_AND_WITHDRAWAL_CODE,
    DEPOSIT_AND_WITHDRAWAL_TEXT,
    LANGUAGES,
    MONTH_ENGLISH,
    TYPE_SETTING_COLUMNS,
  } from '../../common/constants'
  import { ChargeHistoryItem } from '../../types/ChargeHistory'

  const props = defineProps({
    isZoomOut: {
      type: Boolean,
      required: false,
    },
    typeSearch: {
      type: String,
      required: true,
    },
    list: {
      type: Array as () => ClientAggregation[],
      required: true,
    },
    columnSetting: {
      type: Array as () => string[],
      required: false,
      default: () => [],
    },
  })

  const emit = defineEmits<{
    (e: 'selectedRow', row: string[], chargeHistory: ChargeHistoryItem): void
  }>()

  const { t } = useI18n()

  const selected = ref<string[]>([])

  const getDataChargeHistory = (item: ClientAggregation, index: number) => {
    if (props.typeSearch !== 'deposits_and_withdrawals') {
      return (item.charge_history || []).map((x) => ({ ...x, typeParent: item.type }))
    } else {
      const prevItem = props.list[index - 1]
      return [
        ...(prevItem.charge_history || []).map((x) => ({ ...x, typeParent: prevItem.type })),
        ...(item.charge_history || []).map((x) => ({ ...x, typeParent: item.type })),
      ]
    }
  }

  const filterDataChargeHistory = (data: any[]) => {
    return data.filter((x) => x.type !== 3 || x.typeParent !== DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT)
  }

  const findSelectedDate = (selectedKey: string, getData: boolean) => {
    let matched = ''
    let data = null

    props.list.forEach((clientAggregation) => {
      if (generateClientAggregationKey(clientAggregation) === selectedKey) {
        matched = clientAggregation.date
      }

      clientAggregation.charge_history?.forEach((chargeHistory) => {
        if (`${chargeHistory.id}` === selectedKey) {
          matched = chargeHistory.create_date
          data = chargeHistory
        }
      })
    })
    if (getData) {
      return data
    }

    return matched
  }
  const showTextColumn = computed(() => {
    if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT) {
      return t('dashboard.payment')
    } else if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL) {
      return t('dashboard.withdrawal')
    } else {
      return t('dashboard.deposits_and_withdrawals')
    }
  })

  watch(
    () => props.list,
    () => {
      selected.value = []
    },
    { deep: true },
  )

  watch(selected, () => {
    if (selected.value.length > 1) {
      selected.value = selected.value.slice(-1)
    }

    emit(
      'selectedRow',
      [findSelectedDate(selected.value[0], false) || ''],
      (findSelectedDate(selected.value[0], true) || {}) as ChargeHistoryItem,
    )
  })

  const generateClientAggregationKey = (clientAggregation: ClientAggregation) => {
    return `${clientAggregation.date}__${props.typeSearch}`
  }

  const convertMonth = (month: string) => {
    const arr = month.split(' ')

    const { t, locale } = useI18n()
    if (locale.value === LANGUAGES.JAPANESE) {
      return arr[1] + ` ${t(DATE_PICKER_TYPES.YEAR)} ` + arr[0] + ` ${t(DATE_PICKER_TYPES.MONTH)} `
    }
    return MONTH_ENGLISH[Number(arr[0]) - 1] + ' ' + arr[1]
  }

  const isDisabledAccountTransfer = computed(() => {
    return props.columnSetting?.includes(TYPE_SETTING_COLUMNS.ACCOUNT_TRANSFER)
  })

  const isDisabledOtherCharge = computed(() => {
    return props.columnSetting?.includes(TYPE_SETTING_COLUMNS.OTHER_CHARGE)
  })

  const isDisabledSettlement = computed(() => {
    return props.columnSetting?.includes(TYPE_SETTING_COLUMNS.SETTLEMENT)
  })

  const convertMemoText = (value: Array<any>, type = 'memo') => {
    return value
      .filter((item) => item.memo)
      .map((item) => `<div>-&nbsp;${type === 'memo' ? item.memo : item.memo_internal}</div>`)
      .join('')
  }
</script>
<style lang="scss" scoped>
  .fixed-column1 {
    position: sticky;
    left: 0px;
    background-color: #ffffff;
    z-index: 100;
  }
  .fixed-column2 {
    position: sticky;
    left: 24px;
    background-color: #ffffff;
    z-index: 100;
  }
  .fixed-column3 {
    position: sticky;
    left: 204px;
    background-color: #ffffff;
    z-index: 100;
  }
  .fixed-column4 {
    position: sticky;
    left: 204px;
    background-color: #f5f8f9;
    z-index: 100;
  }
  .row-select {
    border-right: none !important;
    padding-left: 4px;
    padding-right: 0px;
    padding-top: 14px;
    width: 24px;
  }
  :deep(.va-checkbox__square) {
    scale: 0.8;
  }
  :deep(.va-checkbox) {
    position: relative;
    top: calc(50% - 10px);
  }
  .cus-tabel-wrapper {
    overflow: scroll;
    table {
      width: max-content;
      min-width: 100%;
      .first-column {
        width: 180px;
        vertical-align: middle;
      }
      thead {
        position: sticky;
        top: 0px;
        background-color: #ffffff;
        z-index: 999;
        tr:first-child {
          th {
            border-top: 1px solid #06152b !important;
          }
          th:first-child {
            border-right: 1px solid #06152b;
            position: sticky;
            left: 0px;
            background-color: #ffffff;
          }
        }
        tr:last-child {
          th {
            padding-top: 3px;
            padding-bottom: 3px;
          }
        }
      }

      tbody {
        td {
          border-bottom: 1px solid #cccccc;
        }

        tr.charge-history-row {
          td {
            background-color: #d6ffdf;
          }
        }
        tr.row-second {
          td {
            background-color: #f5f8f9;
          }
        }
        tr.row-first {
          td {
            background-color: #ffffff;
          }
        }
      }
    }

    .border-bottom {
      border-bottom: 1px solid #cccccc;
    }
    .border-bottom-2 {
      border-bottom: 1px solid #06152b;
    }
    .border-right {
      border-right: 1px solid #cccccc;
    }
    .border-right-flex {
      border-right: 1px solid #06152b;
    }
    .row-second {
      td {
        border-bottom: 1px solid #cccccc;
      }
    }
    .row-note {
      height: 17px;
      //overflow-y: auto;
      //overflow-x: hidden;
    }
    .hover-text {
      .tooltip-text {
        top: -70px;
        left: -23%;
        z-index: 999;
      }
    }
  }
</style>
