<template>
  <div class="cus-tabel-wrapper">
    <table>
      <thead>
        <tr>
          <th class="text-center" style="max-width: 50px">
            <div>{{ t('balance_manager.items') }}</div>
          </th>
          <th>{{ t('balance_manager.classification') }}</th>
          <th>{{ t('dashboard.number') }}</th>
          <th>{{ t('balance_manager.unit_price') }}</th>
          <th>{{ t('balance_manager.contract_rate') }}</th>
          <th>{{ t('cs_charge_history.amount_of_money') }}</th>
          <th>{{ t('balance_manager.previous_month') }}</th>
          <th>{{ t('dashboard.memo') }}</th>
        </tr>
      </thead>

      <tbody>
        <template v-if="dataExpenditure && dataExpenditure.length > 0">
          <template v-for="(item, index) in transformData(dataExpenditure)" :key="index">
            <tr v-for="(x, y) in item" :key="y">
              <td v-if="y === 0" class="border-bottom bg-white" :rowspan="item.length">
                {{ setItemName(item[0].type_fee) }}
              </td>
              <td class="text-left">
                {{ setClassName(x.type_fee, x.classification) }}
              </td>
              <td class="text-right">-</td>
              <td class="text-right">-</td>
              <td class="text-right">-</td>
              <td class="text-right">
                {{ formatCurrency.func(x.profit) }}
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(+x.previous_month, true) }}</div>
              </td>
              <td
                v-if="x.memo && x.memo.length > 0"
                style="width: 280px"
                class="border-bottom"
                :class="`${x.memo ? 'hover-text' : ''}`"
              >
                <div v-for="(note, number) in x.memo" :key="number">
                  <template v-if="note">
                    <div v-if="note?.length > 30">
                      -
                      {{ `${note?.length > 30 ? note.slice(0, 30) + '...' : note || ''}` }}
                    </div>
                    <div v-else>
                      <p style="color: #788b9a">- {{ note }}</p>
                    </div>
                    <div
                      v-if="convertMemoText(x.memo ?? []) && note?.length > 30"
                      id="fade"
                      class="tooltip-text"
                      style="word-break: break-word"
                    >
                      <div v-html="convertMemoText(x.memo ?? [])"></div>
                    </div>
                  </template>
                </div>
              </td>
              <td v-else></td>
            </tr>
          </template>
        </template>
        <tr v-else>
          <td colspan="10" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="row-total">
          <td colspan="5">{{ t('balance_manager.total') }}</td>
          <td class="text-right">{{ totalProfit }}</td>
          <td class="text-right">{{ totalPrevious }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed, defineProps, withDefaults } from 'vue'
  import { formatCurrency, roundUp } from '../../common/utils'
  import { CLASS_LIST_TEXT, ITEM_TYPE_LIST, ITEM_TYPE_LIST_TEXT, TYPE_LIST_TEXT } from '../../common/constants'
  const { t } = useI18n()

  const props = withDefaults(
    defineProps<{
      type: boolean
      dataBreakdown: any[]
    }>(),
    {
      type: false,
      dataBreakdown: [] as any,
    },
  )

  const dataExpenditure = computed(() => {
    let newData = []
    let newDataClient: any[] = []
    let newDataAccount: any[] = []

    const dataClient = props.dataBreakdown
      .filter(
        (item: any) =>
          item.item_name === 'クライアント紹介手数料' &&
          (Number(item.type_fee) === ITEM_TYPE_LIST.REFERRAL_FEE_CLIENT ||
            Number(item.type_fee) === ITEM_TYPE_LIST.REFERRAL_FEE_ACCOUNT),
      )
      .sort((a: any, b: any) => Number(a.type_fee) - Number(b.type_fee))
    if (dataClient && dataClient.length > 0) {
      dataClient.reduce((acc: any, cur: any) => {
        if (!acc[cur.item_name]) {
          acc[cur.item_name] = {
            amount: cur.amount,
            client_id: cur.client_id,
            created_at: cur.created_at,
            id: cur.id,
            income_expenditure_id: cur.income_expenditure_id,
            is_manual: cur.is_manual,
            item_name: cur.item_name,
            classification: cur.classification,
            memo: [],
            number_transaction: cur.number_transaction,
            previous_month: 0,
            profit: 0,
            rate: cur.rate,
            type: cur.type,
            type_fee: '4',
            type_arrange: 4,
            updated_at: cur.updated_at,
          }
          newDataClient.push(acc[cur.item_name])
        }
        acc[cur.item_name].profit = acc[cur.item_name].profit + cur.profit
        acc[cur.item_name].previous_month = acc[cur.item_name].previous_month + cur.previous_month
        return acc
      }, {})
    }
    const dataAccount = props.dataBreakdown
      .filter(
        (item: any) =>
          item.item_name === '口座紹介手数料' &&
          (Number(item.type_fee) === ITEM_TYPE_LIST.REFERRAL_FEE_CLIENT ||
            Number(item.type_fee) === ITEM_TYPE_LIST.REFERRAL_FEE_ACCOUNT),
      )
      .sort((a: any, b: any) => Number(a.type_fee) - Number(b.type_fee))
    if (dataAccount && dataAccount.length > 0) {
      dataAccount.reduce((acc: any, cur: any) => {
        if (!acc[cur.item_name]) {
          acc[cur.item_name] = {
            amount: cur.amount,
            client_id: cur.client_id,
            created_at: cur.created_at,
            id: cur.id,
            income_expenditure_id: cur.income_expenditure_id,
            is_manual: cur.is_manual,
            item_name: cur.item_name,
            classification: cur.classification,
            memo: [],
            number_transaction: cur.number_transaction,
            previous_month: 0,
            profit: 0,
            rate: cur.rate,
            type: cur.type,
            type_fee: '5',
            type_arrange: 4,
            updated_at: cur.updated_at,
          }
          newDataAccount.push(acc[cur.item_name])
        }
        acc[cur.item_name].profit = acc[cur.item_name].profit + cur.profit
        acc[cur.item_name].previous_month = acc[cur.item_name].previous_month + cur.previous_month
        return acc
      }, {})
    }
    const dataUsageFee = props.dataBreakdown
      .filter(
        (item: any) =>
          Number(item.type_fee) === ITEM_TYPE_LIST.ACCOUNT_FEE_DEPOSIT ||
          Number(item.type_fee) === ITEM_TYPE_LIST.ACCOUNT_FEE_WITHDRAWAL,
      )
      .sort((a: any, b: any) => Number(a.type_fee) - Number(b.type_fee))
    if (dataUsageFee && dataUsageFee.length > 0) {
      dataUsageFee.forEach((item: any) => {
        item.type_arrange = 1
      })
    }
    const dataOther = props.dataBreakdown.filter((item: any) => Number(item.type_fee) === ITEM_TYPE_LIST.OTHER_EXPENSES)
    if (dataOther && dataOther.length > 0) {
      dataOther.forEach((item: any) => {
        item.type_arrange = 6
      })
    }
    const dataOutsource = props.dataBreakdown.filter(
      (item: any) => Number(item.type_fee) === ITEM_TYPE_LIST.OUTSOURCING_FEE,
    )
    if (dataOutsource && dataOutsource.length > 0) {
      dataOutsource.forEach((item: any) => {
        item.type_arrange = 3
      })
    }
    const dataMonthly = props.dataBreakdown
      .filter(
        (item: any) =>
          Number(item.type_fee) === ITEM_TYPE_LIST.MONTHLY_FEE_DEPOSIT ||
          Number(item.type_fee) === ITEM_TYPE_LIST.MONTHLY_FEE_WITHDRAWAL,
      )
      .sort((a: any, b: any) => Number(a.type_fee) - Number(b.type_fee))
    if (dataMonthly && dataMonthly.length > 0) {
      dataMonthly.forEach((item: any) => {
        item.type_arrange = 7
      })
    }
    newData = [...dataUsageFee, ...dataMonthly, ...newDataClient, ...newDataAccount, ...dataOutsource, ...dataOther]
    return newData
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

  const setItemName = (type: string) => {
    if (Number(type) === ITEM_TYPE_LIST.ACCOUNT_FEE_DEPOSIT || Number(type) === ITEM_TYPE_LIST.ACCOUNT_FEE_WITHDRAWAL) {
      return t(ITEM_TYPE_LIST_TEXT.ACCOUNT_USAGE_FEE)
    } else if (Number(type) === ITEM_TYPE_LIST.OUTSOURCING_FEE) {
      return t(ITEM_TYPE_LIST_TEXT.OUTSOURCING_FEE)
    } else if (
      Number(type) === ITEM_TYPE_LIST.REFERRAL_FEE_ACCOUNT ||
      Number(type) === ITEM_TYPE_LIST.REFERRAL_FEE_CLIENT
    ) {
      return t(ITEM_TYPE_LIST_TEXT.REFERRAL_FEE)
    } else if (Number(type) === ITEM_TYPE_LIST.OTHER_EXPENSES) {
      return t(ITEM_TYPE_LIST_TEXT.OTHER_EXPENSES)
    } else if (
      Number(type) === ITEM_TYPE_LIST.MONTHLY_FEE_DEPOSIT ||
      Number(type) === ITEM_TYPE_LIST.MONTHLY_FEE_WITHDRAWAL
    ) {
      return t(ITEM_TYPE_LIST_TEXT.MONTHLY_USAGE_FEE)
    }
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
      return t(CLASS_LIST_TEXT.CLIENT)
    } else if (Number(type) === ITEM_TYPE_LIST.REFERRAL_FEE_ACCOUNT) {
      return t(CLASS_LIST_TEXT.ACCOUNT)
    } else {
      return classification
    }
  }

  // const setRowSpan = (index: number) => {
  //   if (dataExpenditure.value[index + 1]) {
  //     if (
  //       (dataExpenditure.value[index].type_fee === '1' && dataExpenditure.value[index + 1].type_fee === '2') ||
  //       (dataExpenditure.value[index].type_fee === '4' && dataExpenditure.value[index + 1].type_fee === '5') ||
  //       (dataExpenditure.value[index].type_fee === '7' && dataExpenditure.value[index + 1].type_fee === '8')
  //     ) {
  //       return 2
  //     } else {
  //       return 1
  //     }
  //   } else {
  //     return 1
  //   }
  // }

  const convertMemoText = (value: Array<any>) => {
    return value
      .filter((item) => item)
      .map((item) => `<div>&nbsp;${item}</div>`)
      .join('')
  }

  const transformData = (value: any[]) => {
    const newData: { [key: string]: any[] } = {}
    for (let index = 0; index < value.length; index++) {
      if (newData?.[value[index]?.type_arrange]) {
        newData?.[value[index]?.type_arrange]?.push(value[index])
      } else {
        newData[value[index].type_arrange] = [value[index]]
      }
    }
    return newData
  }
</script>
<style lang="scss" scoped>
  .cus-tabel-wrapper {
    overflow: scroll;
    max-height: 540px;

    td {
      border-bottom: 1px solid #cccccc;
    }
    .border-bottom {
      vertical-align: middle;
      border-bottom: 1px solid #cccccc;
      border-right: 1px solid #06152b;

      &:last-child {
        border-right: none;
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
        font-weight: 700;
        line-height: 23px;
        position: sticky;
        bottom: -1px;
        background-color: #fff;
      }
      tr {
        &.row-adjust {
          height: 50px;
          td {
            font-size: 14px;
            line-height: 20px;
            color: #06152b;
            font-weight: 400;
            vertical-align: middle;
            border-right: 1px solid #cccccc;
            background-color: rgba(28, 120, 221, 0.3);

            &:first-child {
              font-weight: 700;
            }

            &:last-child {
              border-right: none;
            }
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
          }
        }
      }
    }

    .action-add {
      display: flex;
      align-items: center;
      padding-top: 13px;
      padding-bottom: 13px;
      cursor: pointer;
    }
    .tooltip-text {
      z-index: 999;
    }
  }
</style>
