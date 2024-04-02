<template>
  <div class="cus-tabel-wrapper">
    <table>
      <thead>
        <tr>
          <th class="text-center" style="max-width: 80px">
            <div>{{ t('account_balance.client_name') }}</div>
          </th>
          <th>{{ t('balance_manager.classification') }}</th>
          <th>{{ t('balance_manager.number_of_withdrawals') }}</th>
          <th>{{ t('balance_manager.withdrawal_amount') }}</th>
          <th>{{ t('balance_manager.contract_rate') }}</th>
          <th>{{ t('balance_manager.earnings') }}</th>
          <th>{{ t('balance_manager.previous_month') }}</th>
          <th>{{ t('dashboard.memo') }}</th>
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
        <template v-else-if="dataWithdraw && dataWithdraw.length > 0">
          <template v-for="(item, index) in transformData(dataWithdraw)" :key="index">
            <template v-if="item[0]?.is_manual === 0 && item[0]?.client_id">
              <tr v-for="(x, y) in item" :key="y">
                <td v-if="y === 0" :rowspan="item.length" class="border-bottom bg-white">
                  {{ getClientName(item[0]?.client_id) }}
                </td>
                <td>
                  {{ x.item_name }}
                </td>
                <td class="text-right">
                  {{ x.item_name === 'TOTAL' || item.length === 1 ? formatNumber(x.number_transaction) : '' }}
                </td>
                <td class="text-right">
                  {{
                    +x.amount !== 0
                      ? formatCurrency.func(+x.amount, true)
                      : x.item_name === 'TOTAL'
                      ? formatCurrency.func(+x.amount, true)
                      : ''
                  }}
                </td>
                <td class="text-right">{{ x.item_name === 'TOTAL' ? '-' : `${parseFloat(x.rate || 0)}%` }}</td>
                <td class="text-right">
                  {{ x.item_name === 'TOTAL' ? '-' : formatCurrency.func(+x.profit, true) }}
                </td>
                <td class="text-right">
                  <div>{{ x.item_name === 'TOTAL' ? '-' : formatCurrency.func(+x.previous_month, true) }}</div>
                </td>
                <td v-if="!props.type" class="border-bottom" :class="`${x.memo ? 'hover-text' : ''}`">
                  <div>
                    {{ `${x.memo?.length > 30 ? `&nbsp;${x.memo.slice(0, 30)}...` : `${x.memo ? `${x.memo}` : ''}`}` }}
                  </div>
                  <div
                    v-if="x.memo && x.memo?.length > 30"
                    id="fade"
                    class="tooltip-text"
                    style="word-break: break-word"
                  >
                    &nbsp;{{ x.memo }}
                  </div>
                </td>
                <td v-else class="border-bottom">
                  <div><va-input v-model.trim="x.memo" v-slice-memo></va-input></div>
                </td>
              </tr>
            </template>
          </template>
        </template>
        <tr v-else>
          <td colspan="10" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
        </tr>
        <slot name="action"></slot>
      </tbody>
      <tfoot>
        <template v-if="dataWithdraw && dataWithdraw.length > 0">
          <template v-if="!checkAdjustment">
            <tr v-if="props.positions" class="row-adjust">
              <td>{{ t('balance_manager.adjustment') }}</td>
              <td></td>
              <td class="text-right">-</td>
              <td class="text-right">-</td>
              <td class="text-right">-</td>
              <td class="text-right">
                <div v-if="!props.type"><div></div></div>
                <div v-else>
                  <va-input v-model="profit" v-replace-profit input-class="va-text-right" mask="numeral">
                    <template #prependInner>
                      <span style="color: #788b9a">¥</span>
                    </template>
                  </va-input>
                </div>
              </td>
              <td class="text-right"><div>-</div></td>
              <td style="width: 280px">
                <div v-if="!props.type"><div></div></div>
                <div v-else><va-input v-model.trim="memo" v-slice-memo></va-input></div>
              </td>
            </tr>
          </template>
          <template v-for="(item, index) in dataWithdraw" v-else :key="index">
            <tr v-if="props.positions && item.is_manual === 1 && !item.client_id" class="row-adjust">
              <td>{{ t('balance_manager.adjustment') }}</td>
              <td></td>
              <td class="text-right">-</td>
              <td class="text-right">-</td>
              <td class="text-right">-</td>
              <td class="text-right">
                <div v-if="!props.type">
                  <div>{{ +item.profit !== 0 ? formatCurrency.func(+item.profit, true) : '-' }}</div>
                </div>
                <div v-else>
                  <va-input v-model="item.profit" v-replace-profit input-class="va-text-right" mask="numeral">
                    <template #prependInner>
                      <span style="color: #788b9a">¥</span>
                    </template>
                  </va-input>
                </div>
              </td>
              <td class="text-right"><div>-</div></td>
              <td v-if="!props.type" style="width: 280px" :class="`${item.memo ? 'hover-text' : ''}`">
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
              <td v-else style="width: 280px">
                <div><va-input v-model.trim="item.memo" v-slice-memo></va-input></div>
              </td>
            </tr>
          </template>
        </template>
        <tr class="row-total">
          <td colspan="2">{{ t('balance_manager.total') }}</td>
          <td class="text-right">{{ totalNumber }}</td>
          <td class="text-right">{{ totalAmount }}</td>
          <td class="text-right"><div></div></td>
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
  import { ref, computed, defineExpose, defineProps, withDefaults, watch } from 'vue'
  import { formatCurrency, formatNumber, roundUp } from '../../common/utils'
  const { t } = useI18n()

  const isLoading = ref(false)
  const profit = ref(0)
  const memo = ref('')

  const props = withDefaults(
    defineProps<{
      positions: boolean
      type: boolean
      dataWithdraw: any[]
      selectListClient: any
    }>(),
    {
      type: false,
      positions: false,
      dataWithdraw: [] as any,
    },
  )

  const totalNumber = computed(() => {
    const dataSum = transformData(props.dataWithdraw)
    let total = 0
    for (const key in dataSum) {
      if (Object.prototype.hasOwnProperty.call(dataSum, key)) {
        const element = dataSum[key]
        total += element[0].number_transaction
      }
    }
    return formatNumber(total)
  })

  const totalAmount = computed(() => {
    const dataSum = transformData(props.dataWithdraw)
    let total = 0
    for (const key in dataSum) {
      if (Object.prototype.hasOwnProperty.call(dataSum, key)) {
        const element = dataSum[key]
        total += +element[0].amount || 0
      }
    }
    return formatCurrency.func(total)
  })

  const totalProfit = computed(() => {
    return formatCurrency.func(props.dataWithdraw.reduce((acc: any, cur: any) => roundUp(acc) + roundUp(cur.profit), 0))
  })

  const totalPrevious = computed(() => {
    return formatCurrency.func(
      props.dataWithdraw.reduce((acc: any, cur: any) => roundUp(acc) + roundUp(cur.previous_month), 0),
    )
  })

  const getClientName = (value: number) => {
    let clientName = ''
    props.selectListClient.options.forEach((client: any) => {
      if (client.id == value) {
        clientName = client.text as string
      }
    })
    return clientName
  }

  watch(
    () => props.dataWithdraw,
    () => {
      props.dataWithdraw.forEach((item) => {
        if (item.is_manual === 1 && !item.client_id) {
          item.profit =
            roundUp(+item.profit) === 0
              ? ''
              : roundUp(+item.profit)
                  .toString()
                  .replace(/[.]/g, '')
        }
      })
    },
    { immediate: true },
  )

  const checkAdjustment = computed(() => {
    const findIndex = props.dataWithdraw.findIndex((item) => item.is_manual === 1 && !item.client_id)
    if (findIndex !== -1) {
      return true
    }
    return false
  })

  const getDataSubmit = () => {
    if (checkAdjustment.value || !props.dataWithdraw || props.dataWithdraw.length === 0) {
      return
    } else {
      const dataSubmit = {
        profit: profit.value,
        memo: memo.value,
        income_expenditure_id: props.dataWithdraw[0].income_expenditure_id,
        type: props.dataWithdraw[0].type,
        is_manual: 1,
      }
      return dataSubmit
    }
  }

  const transformData = (value: any[]) => {
    const newData: { [key: string]: any[] } = {}
    for (let index = 0; index < value.length; index++) {
      if (newData?.[value[index]?.client_id ?? 'default']) {
        newData?.[value[index]?.client_id]?.push(value[index])
      } else {
        newData[value[index].client_id ?? 'default'] = [value[index]]
      }
    }

    const keysData = Object.keys(newData) as (keyof typeof newData)[]
    keysData.forEach((key) => {
      if (newData[key].length === 1) return
      const sliceData = newData[key][newData[key].length - 1]
      newData[key].pop()
      newData[key].unshift(sliceData)
    })
    return newData
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
  }
</style>
