<template>
  <div>
    <va-card class="mt-3">
      <va-card-content>
        <h3 class="section-title">{{ t('balance_manager.income_statement') }}</h3>
        <div class="cus-tabel-wrapper mt-3">
          <table>
            <thead>
              <tr>
                <th class="border-bottom-2 first-column" style="min-width: 150px" rowspan="3">
                  <div>{{ t('balance_manager.income_statement') }}</div>
                </th>
                <th class="border-bottom" colspan="4">{{ t('balance_manager.earnings') }}</th>
                <th class="border-bottom" colspan="4">{{ t('balance_manager.spending') }}</th>
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
                <th class="border-bottom-2" style="min-width: 80px" rowspan="3"></th>
              </tr>
              <tr>
                <th class="border-bottom" colspan="2">{{ t('balance_manager.payment') }}</th>
                <th class="border-bottom" colspan="2">{{ t('balance_manager.withdrawal') }}</th>
                <th class="border-bottom" colspan="4">{{ t('balance_manager.expenses') }}</th>
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
                <th style="min-width: 120px">{{ t('balance_manager.other_expenses') }}</th>
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
              <tr v-if="props.isLoading">
                <td colspan="12">
                  <div class="d-flex justify-center">
                    <va-progress-circle size="small" indeterminate />
                  </div>
                </td>
              </tr>
              <template
                v-else-if="Object.keys(props.depositMonth).length > 0 && Object.keys(props.withdrawalMonth).length > 0"
              >
                <tr v-for="(item, index) in depositMonth" :key="index" style="height: 46px">
                  <td class="fixed-column1 border-right-flex">
                    <div>{{ convertMonthToString(item.month) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatNumber(item.number_trans) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+item.amount) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatNumber(withdrawalMonth[index]?.number_trans) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(withdrawalMonth[index]?.amount) }}</div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.account_fee) + roundDown(+withdrawalMonth[index]?.account_fee) || 0,
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.referal_fee) + roundDown(+withdrawalMonth[index]?.referal_fee),
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(item.adjustment, true) }}</div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{ formatCurrency.func(+withdrawalMonth[index]?.other_expense) }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+item.system_usage_fee, true) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+withdrawalMonth[index]?.system_usage_fee || 0, true) }}</div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.settlement_fee) + roundDown(+withdrawalMonth[index]?.settlement_fee) || 0,
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{ formatCurrency.func(+withdrawalMonth[index]?.charge_fee || 0, true) }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{ formatCurrency.func(+withdrawalMonth[index]?.transfer_fee_different) }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.interest_fee) + roundDown(withdrawalMonth[index].interest_fee) || 0,
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
                            roundDown(+withdrawalMonth[index]?.system_usage_fee) +
                            roundDown(+item.interest_fee) +
                            roundDown(+withdrawalMonth[index].interest_fee),
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
                            roundDown(+withdrawalMonth[index]?.system_usage_fee) +
                            roundDown(+item.interest_fee) +
                            roundDown(+withdrawalMonth[index].interest_fee) -
                            (roundDown(+item.total_expenses) + roundDown(+withdrawalMonth[index].total_expenses)),
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+item.account_balance) }}</div>
                  </td>
                  <td class="text-right">
                    <div>{{ formatCurrency.func(+withdrawalMonth[index]?.account_balance || 0) }}</div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundUp(item.account_balance) + roundUp(withdrawalMonth[index]?.account_balance) || 0,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(
                          roundDown(+item.actual_balance) + roundDown(+withdrawalMonth[index]?.actual_balance) || 0,
                          true,
                        )
                      }}
                    </div>
                  </td>
                  <td class="text-right">
                    <div>
                      {{
                        formatCurrency.func(roundUp(+item.borrowing) + roundUp(+withdrawalMonth[index]?.borrowing) || 0)
                      }}
                    </div>
                  </td>
                  <td class="fixed-column2">
                    <div>
                      <a href="#" style="color: #1c78dd" @click="showModalEditReport(item.month)">{{
                        t('dashboard.display')
                      }}</a>
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
    <ModalView
      ref="modalView"
      :data-income-expenditure="dataIncomeExpenditure"
      :select-list-client="selectListClient"
      :type="type"
      :data-header="dataHeader"
      @submit="confirmEdit()"
      @download-income="downloadIncome"
      @close="onClose"
    >
    </ModalView>
    <ModalEdit
      ref="modalEdit"
      :data-income-expenditure="dataIncomeExpenditure"
      :select-list-client="selectListClient"
      :type="type"
      :data-header="dataHeader"
      @close="confirmClose()"
      @submit="saveData"
      @delete-rows="deleteRows"
    >
    </ModalEdit>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, defineProps } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ModalView from '../../../components/balance-manager/ModalView.vue'
  import ModalEdit from '../../../components/balance-manager/ModalEdit.vue'
  import { formatCurrency, convertMonthToString, formatNumber, roundUp, roundDown } from '../../../common/utils'
  import { useGlobalStore } from '../../../stores/global-store'
  import BalanceManagerService from '../../../services/BalanceManager'
  import { useModal, useToast } from 'vuestic-ui'
  import ClientService from '../../../services/ClientService'

  const props = defineProps<{
    depositMonth: any
    withdrawalMonth: any
    isLoading: boolean
  }>()
  const emit = defineEmits<{
    (e: 'onClose'): void
  }>()
  const modalView = ref<InstanceType<typeof ModalView>>()
  const modalEdit = ref<InstanceType<typeof ModalEdit>>()
  const { confirm } = useModal()
  const { init } = useToast()

  const type = ref(false)
  const date = ref('')
  const linkDownload = ref('')
  const dataIncomeExpenditure = ref({} as any)
  const selectListClient = ref({
    options: [] as Record<string, string | number>[],
  })

  const showModalEditReport = async (month: string) => {
    modalView.value?.openModal()
    date.value = parseInt(month.split('-')[1]) + '-' + month.split('-')[0] + '-' + '01' + ' 00:00:01'
    dataHeader.date = month
    await getCLientList()
    await getIncomeExpenditure()
  }

  const confirmEdit = async () => {
    type.value = true
    modalView.value?.closeModal()
    modalEdit.value?.openModal()
  }

  const confirmClose = async () => {
    const result = await confirm({
      message: t('balance_manager.message_confirm'),
      okText: t('yes'),
      cancelText: t('no'),
      noDismiss: true,
      noOutsideDismiss: true,
    })

    if (result) {
      type.value = false
      closeModalEdit()
    }
  }

  const closeModalEdit = async () => {
    type.value = false
    modalEdit.value?.closeModal()
    modalView.value?.openModal()
    await getCLientList()
    await getIncomeExpenditure()
  }

  const { t, locale } = useI18n()

  const dataHeader = reactive({
    date: '',
    duration: '',
    profit: 0,
    profit_wm: 0,
    profit_include_wm: 0,
    totalBalance: 0,
    totalSpending: 0,
  })

  const getIncomeExpenditure = async () => {
    dataIncomeExpenditure.value = {}
    useGlobalStore().setLoading(true)
    const params = {
      from_date: date.value,
      to_date: date.value,
    }
    try {
      const { data } = await BalanceManagerService.getIncomeExpenditure(params)
      dataIncomeExpenditure.value = data.income_expenditure
      dataHeader.duration =
        dataIncomeExpenditure.value.from_date.split('-').join('/') +
        ' - ' +
        dataIncomeExpenditure.value.to_date.split('-').join('/')
      dataHeader.totalBalance = dataIncomeExpenditure.value.total_balance
      dataHeader.totalSpending = dataIncomeExpenditure.value.total_spending
      dataHeader.profit = dataIncomeExpenditure.value.profit
      dataHeader.profit_wm =
        Number(dataIncomeExpenditure.value.profit_wm) === 0 ? 0 : +dataIncomeExpenditure.value.profit_wm
      dataHeader.profit_include_wm =
        Number(dataIncomeExpenditure.value.profit_include_wm) === 0 ? 0 : +dataIncomeExpenditure.value.profit_include_wm
    } catch (error) {
      console.log(error)
    } finally {
      useGlobalStore().setLoading(false)
    }
  }

  const getCLientList = async () => {
    const is_deleted = 1 as any
    try {
      const { data } = await ClientService.getClientAll(is_deleted)
      const listClient: Record<string, string | number>[] = []
      data.forEach((value: { client_id: number; represent_name: string }) => {
        listClient.push({ text: value.represent_name, id: value.client_id })
      })
      selectListClient.value.options = listClient
    } catch (error) {
      console.log(error)
    }
  }

  const saveData = async (data: any) => {
    try {
      const req = data
      const response = await BalanceManagerService.updateIncomeExpenditure(req)

      if (response.data) {
        init({ message: t('toast.confirm_success'), color: 'success' })
        closeModalEdit()
        await getIncomeExpenditure()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getLinkDownloadIncome = async (id: number, lang: string) => {
    if (!id) {
      return
    }
    try {
      const response = await BalanceManagerService.downloadIncome(id, lang)
      linkDownload.value = response.data.download_link
      return response
    } catch (err) {
      console.log({ err })
    }
  }

  const downloadIncome = async (id: number) => {
    useGlobalStore().setLoading(true)
    const lang = locale.value === 'gb' ? 'en' : locale.value
    await getLinkDownloadIncome(id, lang)
      .then((rs) => {
        if (rs) {
          init({ message: t('toast.confirm_success'), color: 'success' })
          linkDownload.value ? (document.location.href = linkDownload.value) : ''
        }
      })
      .finally(() => {
        useGlobalStore().setLoading(false)
      })
  }

  const deleteRows = async (value: any) => {
    try {
      const response = await BalanceManagerService.deleteRowIncomeExpenditure(value.id)
      if (response.data) {
        init({ message: t('toast.confirm_success'), color: 'success' })
        await getIncomeExpenditure()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onClose = () => {
    emit('onClose')
  }
</script>
<style lang="scss" scoped>
  .fixed-column1 {
    position: sticky;
    left: 0px;
    background-color: #ffffff;
  }
  .fixed-column2 {
    right: 0px;
    position: sticky;
    text-align: center;
    background-color: #ffffff;
    border-left: 1px solid #06152b;
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
          th {
            &:first-child {
              left: 0px;
              position: sticky;
              background-color: #ffffff;
              border-right: 1px solid #06152b;
            }

            &:last-child {
              right: 0px;
              position: sticky;
              background-color: #ffffff;
              border-left: 1px solid #06152b;
            }
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
