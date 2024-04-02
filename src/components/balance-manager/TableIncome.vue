<template>
  <div id="scrollIncome" class="cus-tabel-wrapper">
    <table>
      <thead>
        <tr>
          <th class="text-center">
            <div>{{ t('account_balance.client_name') }}</div>
          </th>
          <th>{{ t('balance_manager.classification') }}</th>
          <th>{{ t('cs_dashboard.number') }}</th>
          <th>{{ t('cs_dashboard.amount_of_money') }}</th>
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
        <template v-else-if="dataIncome && dataIncome.length > 0">
          <template v-if="!props.type">
            <template v-for="(item, index) in transformData(dataIncome)" :key="index">
              <tr v-for="(x, y) in item" :key="y">
                <td v-if="y === 0" :rowspan="item.length" class="border-bottom bg-white">
                  {{ getClientName(x.client_id) }}
                </td>
                <td>
                  {{ setName(x.item_name, x.type) }}
                </td>
                <td class="text-right">
                  {{ formatNumber(x.number_transaction) }}
                </td>
                <td class="text-right">
                  {{ formatCurrency.func(+x.amount, true) }}
                </td>
                <td class="text-right">
                  {{ x.item_name === 'INTEREST' && Number(x.rate) === 0 ? '' : x.rate && `${parseFloat(x.rate)}%` }}
                </td>
                <td class="text-right">
                  {{ formatCurrency.func(+x.profit) }}
                </td>
                <td class="text-right">
                  <div>{{ formatCurrency.func(+x.previous_month, true) }}</div>
                </td>
                <td style="width: 280px" class="border-bottom" :class="`${x.memo ? 'hover-text' : ''}`">
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
              </tr>
            </template>
          </template>
          <template v-else>
            <template v-for="(item, index) in transformDataNonEdit(dataIncome)" :key="index">
              <tr v-for="(x, y) in item" :key="y">
                <td v-if="y === 0" :rowspan="item.length" class="border-bottom bg-white">
                  {{ getClientName(x.client_id) }}
                </td>
                <td>
                  {{ setName(x.item_name, x.type) }}
                </td>
                <td class="text-right">
                  {{ formatNumber(+x.number_transaction) }}
                </td>
                <td class="text-right">
                  {{ formatCurrency.func(x.amount, true) }}
                </td>
                <td class="text-right">
                  {{ x.item_name === 'INTEREST' && Number(x.rate) === 0 ? '' : x.rate && `${parseFloat(x.rate)}%` }}
                </td>
                <td class="text-right">
                  {{ formatCurrency.func(+x.profit, true) }}
                </td>
                <td class="text-right">
                  <div>{{ formatCurrency.func(+x.previous_month, true) }}</div>
                </td>
                <td class="border-bottom">
                  <div><va-input v-model="x.memo" v-slice-memo></va-input></div>
                </td>
              </tr>
            </template>
            <template v-if="dataIncome && dataIncome.length > 0">
              <template v-for="(val, num) in dataIncome" :key="num">
                <tr v-if="val.is_manual === 1">
                  <td class="border-right">
                    <va-select
                      v-model="val.client_id"
                      :placeholder="t('placeholder.select')"
                      :no-options-text="`${t('list_no_data')}`"
                      bordered
                      clearable
                      :options="selectListClient.options"
                      :value-by="(option: any) => option.id"
                    />
                  </td>
                  <td>
                    <va-input v-model.trim="val.item_name" v-slice-name></va-input>
                  </td>
                  <td>
                    <va-input
                      v-model.trim="val.number_transaction"
                      v-replace-num-trans
                      :disabled="!val.client_id"
                      mask="numeral"
                      input-class="va-text-right"
                    ></va-input>
                  </td>
                  <td>
                    <va-input
                      v-model="val.amount"
                      v-replace-num-trans
                      :disabled="!val.client_id"
                      input-class="va-text-right"
                      mask="numeral"
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
                      :disabled="!val.client_id"
                      input-class="va-text-right"
                      mask="numeral"
                    ></va-input>
                  </td>
                  <td>
                    <va-input
                      :model-value="formatNumber(val.profit)"
                      input-class="va-text-right"
                      disabled
                      mask="numeral"
                    >
                      <template #prependInner>
                        <span style="color: #788b9a">¥</span>
                      </template>
                    </va-input>
                  </td>
                  <td>
                    <va-input v-model="val.previous_month" input-class="va-text-right" mask="numeral">
                      <template #prependInner>
                        <span style="color: #788b9a">¥</span>
                      </template>
                    </va-input>
                  </td>
                  <td class="border-bottom">
                    <div class="d-flex align-center">
                      <va-input v-model="val.memo" class="mr-2"></va-input>
                      <va-icon
                        color="warning"
                        name="fa-regular fa-circle-minus"
                        @click="minusExpenseBreakdown(num, val)"
                      />
                    </div>
                  </td>
                </tr>
              </template>
            </template>
          </template>
        </template>
        <tr v-else>
          <td colspan="10" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
        </tr>
        <template v-if="data && data.length > 0">
          <tr v-for="(value, index) in data" :key="index">
            <td class="border-right">
              <va-select
                v-model="value.client_id"
                :placeholder="t('placeholder.select')"
                :no-options-text="`${t('list_no_data')}`"
                bordered
                :error="isError"
                clearable
                :options="selectListClient.options"
                :value-by="(option: any) => option.id"
              />
            </td>
            <td>
              <va-input
                v-model.trim="value.item_name"
                v-slice-name
                :disabled="!value.client_id"
                :error="isError"
              ></va-input>
            </td>
            <td>
              <va-input
                v-model.trim="value.number_transaction"
                v-replace-num-trans
                :disabled="!value.client_id"
                mask="numeral"
                input-class="va-text-right"
                :error="isError"
              ></va-input>
            </td>
            <td>
              <va-input
                v-model="value.amount"
                v-replace-num-trans
                :disabled="!value.client_id"
                :error="isError"
                input-class="va-text-right"
                mask="numeral"
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
                :disabled="!value.client_id"
                :error="isError"
                input-class="va-text-right"
                mask="numeral"
              ></va-input>
            </td>
            <td>
              <va-input
                :model-value="formatNumber(value.profit)"
                :error="isError"
                input-class="va-text-right"
                disabled
                mask="numeral"
              >
                <template #prependInner>
                  <span style="color: #788b9a">¥</span>
                </template>
              </va-input>
            </td>
            <td>
              <va-input v-model="value.previous_month" input-class="va-text-right" mask="numeral">
                <template #prependInner>
                  <span style="color: #788b9a">¥</span>
                </template>
              </va-input>
            </td>
            <td class="border-bottom">
              <div class="d-flex align-center">
                <va-input v-model="value.memo" class="mr-2"></va-input>
                <va-icon color="warning" name="fa-regular fa-circle-minus" @click="minusExpenseBreakdown(index)" />
              </div>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr v-if="props.type && dataIncome && dataIncome.length > 0">
          <td>
            <p v-if="isError" style="font-size: small; padding-left: 7px; font-weight: 600">
              <span class="error-msg" style="color: red">{{ t('message_error.required_field') }}</span>
            </p>
            <div class="action-add" @click="addExpenseBreakdown()">
              <va-icon name="fa-regular fa-circle-plus" />
              <span class="pl-1">{{ t('balance_manager.add_miscellaneous_income') }}</span>
            </div>
          </td>
          <td colspan="7"></td>
        </tr>
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
  import { reactive, ref, computed, defineExpose, defineProps, watch, nextTick } from 'vue'
  import { formatCurrency, formatNumber, roundUp } from '../../common/utils'
  import { LIST_LOWER_CASE } from '../../common/constants'
  const { t } = useI18n()

  const isLoading = ref(false)
  const data = reactive([] as any)
  const isError = ref(false)

  const props = withDefaults(
    defineProps<{
      positions: boolean
      type: boolean
      dataIncome: any[]
      selectListClient: any
    }>(),
    {
      type: false,
      positions: false,
      dataIncome: [] as any,
      selectListClient: {
        options: [] as Record<string, string | number>[],
      },
    },
  )

  const emit = defineEmits<{
    (e: 'error', error: boolean): void
    (e: 'deleteRow', data: any): void
  }>()

  const totalNumber = computed(() => {
    return formatNumber(props.dataIncome.reduce((acc: any, cur: any) => +acc + +cur.number_transaction, 0))
  })

  const totalAmount = computed(() => {
    return formatCurrency.func(props.dataIncome.reduce((acc: any, cur: any) => roundUp(acc) + roundUp(cur.amount), 0))
  })

  const totalProfit = computed(() => {
    return formatCurrency.func(props.dataIncome.reduce((acc: any, cur: any) => roundUp(acc) + roundUp(cur.profit), 0))
  })

  const totalPrevious = computed(() => {
    return formatCurrency.func(
      props.dataIncome.reduce((acc: any, cur: any) => roundUp(acc) + roundUp(cur.previous_month), 0),
    )
  })

  const addExpenseBreakdown = () => {
    const value = {
      client_id: '',
      item_name: '',
      number_transaction: '',
      amount: '',
      rate: '',
      profit: '',
      previous_month: '',
      memo: '',
    }

    nextTick(() => {
      const dataWidth = document.getElementById('scrollIncome')
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

  const getClientName = (value: number) => {
    let clientName = ''
    props.selectListClient.options.forEach((client: any) => {
      if (client.id == value) {
        clientName = client.text as string
      }
    })
    return clientName
  }

  const setName = (name: string, type: string) => {
    if (type === '3' || type === '4') {
      const lowerCaseName = name.toLowerCase().split(' ').join('_')
      const dataName = 'dashboard.' + lowerCaseName
      if (LIST_LOWER_CASE.includes(dataName)) {
        return t(dataName)
      } else {
        return name
      }
    } else {
      return name
    }
  }

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
        emit('error', isError.value)
      })
    },
    { deep: true },
  )

  watch(
    () => props.dataIncome,
    () => {
      props.dataIncome.forEach((value: any) => {
        value.client_id = Number(value.client_id)
        if (value.is_manual === 1) {
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
          value.previous_month = +value.previous_month
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
          emit('error', isError.value)
        }
      })
    },
    { immediate: true, deep: true },
  )

  const transformDataNonEdit = (value: any[]) => {
    const nonEditData = value.filter((item: any) => item.is_manual === 0)
    const newData: { [key: string]: any[] } = {}
    for (let index = 0; index < nonEditData.length; index++) {
      if (newData?.[nonEditData[index]?.client_id ?? 'default']) {
        newData?.[nonEditData[index]?.client_id]?.push(nonEditData[index])
      } else {
        newData[nonEditData[index].client_id ?? 'default'] = [nonEditData[index]]
      }
    }
    return newData
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
    return newData
  }

  const getDataSubmit = () => {
    if (!data || data.length === 0) {
      return
    } else {
      const dataSubmit = data.map((value: any) => {
        return {
          income_expenditure_id: props.dataIncome[0].income_expenditure_id,
          type: props.dataIncome[0].type,
          client_id: value.client_id,
          item_name: value.item_name.slice(0, 20),
          number_transaction: value.number_transaction,
          amount: value.amount,
          rate: parseFloat(value.rate).toFixed(1),
          profit: value.profit,
          previous_month: value.previous_month,
          memo: value.memo.slice(0, 150),
          is_manual: 1,
        }
      })
      return dataSubmit
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
    }
    .border-right {
      border-right: 1px solid #06152b;
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
      cursor: pointer;
      font-weight: 500;
    }
  }
</style>
