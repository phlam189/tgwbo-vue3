<template>
  <div class="dashboard">
    <TitleHeader @on-change-date="onChangeDate" @charge-type-search="onChangeType"></TitleHeader>
    <va-card class="mt-3">
      <va-card-content>
        <span class="section-title">{{ t('balance_manager.balance_by_client') }}</span>
        <div class="cus-tabel-wrapper mt-3">
          <table>
            <thead>
              <tr>
                <th class="border-bottom-2 first-column" style="min-width: 120px" rowspan="3">
                  <span style="position: relative">{{ t('balance_manager.client_name') }}</span>
                </th>
                <th class="border-bottom" colspan="4">{{ t('balance_manager.earnings') }}</th>
                <th class="border-bottom" colspan="3">{{ t('balance_manager.spending') }}</th>
                <th class="border-bottom" colspan="6">{{ t('balance_manager.income') }}</th>
                <th class="border-bottom-2" style="min-width: 120px" rowspan="3">
                  {{ t('balance_manager.gross_profit') }}
                </th>
                <th class="border-bottom-2" style="min-width: 120px" rowspan="3">
                  {{ t('balance_manager.operating_income') }}
                </th>
                <th class="border-bottom" rowspan="2" colspan="3">
                  {{ t('balance_manager.client_account_balance') }}
                </th>
                <th class="border-bottom-2" style="min-width: 120px" rowspan="3">
                  {{ t('balance_manager.actual_account_balance') }}
                </th>
                <th class="border-bottom-2" style="min-width: 120px" rowspan="3">
                  {{ t('balance_manager.borrowing') }}
                </th>
              </tr>
              <tr>
                <th class="border-bottom" colspan="2">{{ t('balance_manager.payment') }}</th>
                <th class="border-bottom" colspan="2">{{ t('balance_manager.withdrawal') }}</th>
                <th class="border-bottom" colspan="3">{{ t('balance_manager.expenses') }}</th>
                <th class="border-bottom" colspan="2">{{ t('balance_manager.system_fee') }}</th>
                <th class="border-bottom border-right" colspan="4">{{ t('balance_manager.various_fee') }}</th>
              </tr>
              <tr>
                <th style="min-width: 90px">{{ t('balance_manager.number_of_deposits') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.deposit_amount') }}</th>
                <th style="min-width: 90px">{{ t('balance_manager.number_of_withdrawals') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.withdrawal_amount') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.account_usage_fee') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.referral_fee') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.adjustment_costs') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.payment') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.withdrawal') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.settlement_fee') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.charge_fee') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.transfer_fee_difference') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.miscellaneous_income') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.deposit_account') }}</th>
                <th style="min-width: 120px">{{ t('balance_manager.withdrawal_account') }}</th>
                <th class="border-right" style="min-width: 120px">{{ t('balance_manager.total') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="12">
                  <div class="d-flex justify-center">
                    <va-progress-circle size="small" indeterminate />
                  </div>
                </td>
              </tr>
              <template v-else-if="deposit.length > 0 && withdrawal.length > 0">
                <tr v-for="(item, index) in deposit" :key="index">
                  <td class="fixed-column1 border-right-flex">
                    <div>{{ item.represent_name }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ item.number_trans }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+item.amount) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatNumber(+withdrawal[index]?.number_trans) || 0 }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+withdrawal[index]?.amount || 0) }}</div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.account_fee) + roundDown(+withdrawal[index]?.account_fee) || 0,
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.referal_fee) + roundDown(+withdrawal[index]?.referal_fee),
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+item.adjustment, true) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+item.system_usage_fee, true) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+withdrawal[index]?.system_usage_fee || 0, true) }}</div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.settlement_fee) + roundDown(+withdrawal[index]?.settlement_fee) || 0,
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{ formatCurrency.func(+withdrawal[index]?.charge_fee || 0, true) }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{ formatCurrency.func(+withdrawal[index]?.transfer_fee_different) }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.interest_fee) + roundDown(withdrawal[index].interest_fee) || 0,
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.system_usage_fee) +
                            roundDown(+withdrawal[index]?.system_usage_fee) +
                            roundDown(+item.interest_fee) +
                            roundDown(+withdrawal[index].interest_fee),
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.system_usage_fee) +
                            roundDown(+withdrawal[index]?.system_usage_fee) +
                            roundDown(+item.interest_fee) +
                            roundDown(+withdrawal[index].interest_fee) -
                            (roundDown(+item.total_expenses) + roundDown(+withdrawal[index].total_expenses)),
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+item.account_balance) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+withdrawal[index]?.account_balance || 0) }}</div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundUp(item.account_balance) + roundUp(withdrawal[index]?.account_balance) || 0,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.actual_balance) + roundDown(+withdrawal[index]?.actual_balance) || 0,
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{ formatCurrency.func(roundUp(+item.borrowing) + roundUp(+withdrawal[index]?.borrowing) || 0) }}
                    </div>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="22" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </va-card-content>
    </va-card>
    <ChildTable
      :is-loading="isLoading"
      :deposit-month="depositMonth"
      :withdrawal-month="withdrawalMonth"
      @on-close="getData"
    />
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import TitleHeader from '../../../components/balance-manager/Header.vue'
  import ChildTable from './childTable.vue'
  import balanceManagerService from '../../../services/BalanceManager'
  import { onMounted, ref } from 'vue'
  import { QueryParamsGetBalanceManager } from '../../../types/BalanceManager'
  import moment from 'moment'
  import { formatCurrency, formatNumber, roundDown, roundUp } from '../../../common/utils'
  import { DATE_PICKER_TYPES, YYYY_MM_DD_HH_MM_SS } from '../../../common/constants'
  import { BalanceClient } from '../../../types/BalanceClient'

  const { t } = useI18n()
  const deposit = ref([] as any[])
  const depositMonth = ref({})
  const withdrawal = ref([] as any[])
  const withdrawalMonth = ref({})
  const isLoading = ref(false)
  const dates = ref(new Date())
  const typeSearch = ref(DATE_PICKER_TYPES.MONTH)

  const balanceManager = async (params: QueryParamsGetBalanceManager) => {
    isLoading.value = true
    try {
      const response = await balanceManagerService.getBalanceManager(params)
      deposit.value = response.data.deposit || []
      depositMonth.value = response.data.deposit_month || []
      withdrawal.value = response.data.withdrawal || {}
      withdrawalMonth.value = response.data.withdrawal_month || {}

      deposit.value.sort((a: BalanceClient, b: BalanceClient) => a.client_id - b.client_id)
      withdrawal.value.sort((a: BalanceClient, b: BalanceClient) => a.client_id - b.client_id)
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const onChangeDate = async (date: any) => {
    dates.value = date
    const params = getParams(date)
    await balanceManager(params)
  }

  const onChangeType = async (type: string) => {
    typeSearch.value = type
    const params = typeSearch.value === DATE_PICKER_TYPES.DAY ? getParams(dates.value) : getParams()
    await balanceManager(params)
  }

  const getParams = (date?: any) => {
    let dateReq = ''
    if (!date) {
      dateReq =
        typeSearch.value === DATE_PICKER_TYPES.YEAR
          ? moment().startOf('year').format('YYYY-MM-DD 00:00:01')
          : moment().startOf('month').format('YYYY-MM-DD 00:00:01')
    } else {
      dateReq = moment(date).format(YYYY_MM_DD_HH_MM_SS)
    }
    const params: QueryParamsGetBalanceManager = {
      from_date: dateReq,
      to_date: dateReq,
      is_sum: 1,
      group_by_date: undefined as undefined | number,
      group_by_month: undefined as undefined | number,
      group_by_year: undefined as undefined | number,
    }

    if (typeSearch.value == DATE_PICKER_TYPES.DAY) {
      params.group_by_date = 1
    } else if (typeSearch.value == DATE_PICKER_TYPES.MONTH) {
      params.group_by_month = 1
    } else {
      params.group_by_year = 1
    }
    return params
  }

  const getData = async () => {
    const params = getParams(dates.value)
    await balanceManager(params)
  }

  onMounted(async () => {
    const params = getParams()
    await balanceManager(params)
  })
</script>

<style lang="scss" scoped>
  .fixed-column1 {
    position: sticky;
    left: 0px;
    background-color: #ffffff;
  }
  .cus-tabel-wrapper {
    overflow-x: scroll;
    max-height: 650px;

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
        z-index: 1;
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
  }
</style>
