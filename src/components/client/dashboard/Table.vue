<template>
  <div class="cus-tabel-wrapper" :class="{ isOnModal: props.isOnModal }">
    <table>
      <!-- Header table -->
      <thead>
        <tr>
          <th class="border-bottom-2" rowspan="2" colspan="2" style="min-width: 236px">
            <span style="position: relative">{{ t('cs_dashboard.date') }}</span>
          </th>
          <th class="border-bottom" colspan="3">{{ showTextColumn }}</th>
          <th v-show="!isDisabledAccountTransfer" class="border-bottom">{{ t('cs_dashboard.account_transfer') }}</th>
          <th v-show="!isDisabledOtherCharge" class="border-bottom" colspan="2">
            {{ t('cs_dashboard.other_charge') }}
          </th>
          <th v-show="!isDisabledSettlement" class="border-bottom" colspan="2">{{ t('cs_dashboard.settlement') }}</th>
          <th class="border-bottom" colspan="3">{{ t('cs_dashboard.refund') }}</th>
          <th class="border-bottom">{{ t('cs_dashboard.system_fee') }}</th>
          <th class="border-bottom-2" rowspan="2" style="min-width: 150px">
            <span style="position: relative">{{ t('cs_dashboard.account_balance') }}</span>
          </th>
          <th class="border-bottom-2" rowspan="2" style="min-width: 150px">
            <span style="position: relative">{{ t('cs_dashboard.memo') }}</span>
          </th>
        </tr>
        <tr>
          <th style="min-width: 74px">{{ t('cs_dashboard.number') }}</th>
          <th style="min-width: 110px">{{ t('cs_dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px">{{ t('cs_dashboard.commission') }}</th>
          <th v-show="!isDisabledAccountTransfer" style="min-width: 110px">{{ t('cs_dashboard.amount_of_money') }}</th>
          <th v-show="!isDisabledOtherCharge" style="min-width: 110px">{{ t('cs_dashboard.amount_of_money') }}</th>
          <th v-show="!isDisabledOtherCharge" style="min-width: 110px">{{ t('cs_dashboard.commission') }}</th>
          <th v-show="!isDisabledSettlement" style="min-width: 110px">{{ t('cs_dashboard.amount_of_money') }}</th>
          <th v-show="!isDisabledSettlement" style="min-width: 110px">{{ t('cs_dashboard.commission') }}</th>
          <th style="min-width: 74px">{{ t('cs_dashboard.number') }}</th>
          <th style="min-width: 110px">{{ t('cs_dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px">{{ t('cs_dashboard.commission') }}</th>
          <th style="min-width: 110px" class="border-right">{{ t('cs_dashboard.amount_of_money') }}</th>
        </tr>
      </thead>

      <!-- Body table -->
      <tbody>
        <template v-if="props.list.length > 0">
          <template v-for="(item, index) in props.list" :key="index">
            <tr
              v-if="
                props.typeSearch !== 'deposits_and_withdrawals' ||
                (props.typeSearch === 'deposits_and_withdrawals' && index % 2 === 0)
              "
            >
              <td class="first-column fixed-column2" :rowspan="props.typeSearch === 'deposits_and_withdrawals' ? 2 : 1">
                <div>{{ item.date ? convertDateToString(item.date) : convertMonth(item.month || '') }}</div>
              </td>
              <td class="border-right-flex fixed-column3">
                <div>
                  {{ props.typeSearch === 'withdrawal' ? t('cs_dashboard.withdrawal') : t('cs_dashboard.payment') }}
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
                  <div v-for="(note, number) in item.charge_history" :key="number">
                    <template v-if="note.memo">
                      <div v-if="note.memo?.length > 15">
                        -
                        {{ `${note.memo?.length > 15 ? note.memo.slice(0, 15) + '...' : note.memo || ''}` }}
                      </div>
                      <div v-else>
                        <p style="color: #788b9a">- {{ note.memo }}</p>
                      </div>
                      <div
                        v-if="convertMemoText(item.charge_history ?? [])"
                        id="fade"
                        class="tooltip-text"
                        style="word-break: break-word"
                      >
                        <div v-html="convertMemoText(item.charge_history ?? [])"></div>
                      </div>
                    </template>
                  </div>
                </div>
              </td>
              <td v-else></td>
            </tr>
            <tr v-if="props.typeSearch === 'deposits_and_withdrawals' && index % 2 === 1" class="row-second">
              <td class="border-right-flex fixed-column4">{{ t('cs_dashboard.withdrawal') }}</td>
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
                  <div v-for="(note, number) in item.charge_history" :key="number">
                    <template v-if="note.memo">
                      <div v-if="note.memo?.length > 15">
                        -
                        {{ `${note.memo?.length > 15 ? note.memo.slice(0, 15) + '...' : note.memo || ''}` }}
                      </div>
                      <div v-else>
                        <p style="color: #788b9a">- {{ note.memo }}</p>
                      </div>
                      <div
                        v-if="convertMemoText(item.charge_history ?? [])"
                        id="fade"
                        class="tooltip-text"
                        style="word-break: break-word"
                      >
                        <div v-html="convertMemoText(item.charge_history ?? [])"></div>
                      </div>
                    </template>
                  </div>
                </div>
              </td>
              <td v-else></td>
            </tr>
          </template>
        </template>
        <tr v-else>
          <td colspan="16" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
  import { computed, defineProps } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ClientAggregation from '../../../types/ClientAggregation'
  import { convertDateToString, formatCurrency, formatNumber } from '../../../common/utils'
  import {
    DATE_PICKER_TYPES,
    DEPOSIT_AND_WITHDRAWAL_TEXT,
    LANGUAGES,
    MONTH_ENGLISH,
    TYPE_SETTING_COLUMNS,
  } from '../../../common/constants'
  const { t } = useI18n()
  const props = defineProps<{
    typeSearch: string
    list: ClientAggregation[]
    isOnModal?: boolean
    columnSetting?: string[]
  }>()

  const showTextColumn = computed(() => {
    if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT) {
      return t('dashboard.payment')
    } else if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL) {
      return t('dashboard.withdrawal')
    } else {
      return t('dashboard.deposits_and_withdrawals')
    }
  })

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

  const convertMemoText = (value: Array<any>) => {
    return value
      .filter((item) => item.memo)
      .map((item) => `<div>-&nbsp;${item.memo}</div>`)
      .join('')
  }
</script>
<style lang="scss" scoped>
  .fixed-column2 {
    position: sticky;
    left: 0px;
    background-color: #ffffff;
    z-index: 100;
  }
  .fixed-column3 {
    position: sticky;
    left: 180px;
    background-color: #ffffff;
    z-index: 100;
  }
  .fixed-column4 {
    position: sticky;
    left: 180px;
    background-color: #f5f8f9;
    z-index: 100;
  }
  .row-select {
    border-right: none !important;
    padding-left: 0px;
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
    max-height: 540px;

    &.isOnModal {
      max-height: calc(100vh - 220px);
    }

    table {
      width: max-content;
      min-width: 100%;
      .first-column {
        width: 180px;
        vertical-align: middle;
        z-index: 100;
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
          vertical-align: middle;
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
