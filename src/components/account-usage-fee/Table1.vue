<template>
  <va-card class="flex c-mt-20" stripe-color="info">
    <va-card-content>
      <div class="d-flex-between">
        <div class="title">{{ t('account_usage_fee.account_usage_fee') }}</div>
        <div class="d-flex">
          <va-select
            v-model="client"
            class="c-mr-10"
            bordered
            :placeholder="t('account_usage_fee.client_selection_list')"
            :no-options-text="`${t('list_no_data')}`"
            :options="selectListClient.options"
            :value-by="(option: any) => option.id"
            clearable
            clearable-icon="cancel"
          />
          <SelectDatePicker v-model="date" type="month" placement="bottom-right" />
        </div>
      </div>
      <div class="cus-tabel-wrapper c-mt-24">
        <table>
          <!-- Header table -->
          <thead>
            <tr>
              <th style="width: 140px">{{ t('account_usage_fee.client_name') }}</th>
              <th style="width: 140px">{{ t('account_usage_fee.date') }}</th>
              <th style="width: 140px">{{ t('account_usage_fee.bank_name') }}</th>
              <th style="width: 78px">{{ t('account_usage_fee.account_number') }}</th>
              <th style="width: 78px">{{ t('account_usage_fee.kinds') }}</th>
              <th style="width: 62px">{{ t('account_usage_fee.number') }}</th>
              <th style="width: 130px">{{ t('account_usage_fee.amount_of_money') }}</th>
              <th style="width: 86px">{{ t('account_usage_fee.usage_rate') }}</th>
              <th style="width: 130px">{{ t('account_usage_fee.account_usage_fee') }}</th>
              <th style="width: 120px">{{ t('account_usage_fee.account_holder') }}</th>
            </tr>
          </thead>
          <!-- Body table -->
          <tbody>
            <tr v-if="isLoading">
              <td colspan="10">
                <div class="d-flex justify-center">
                  <va-progress-circle size="small" indeterminate />
                </div>
              </td>
            </tr>
            <template v-else-if="dataAccount.length > 0">
              <tr v-for="(item, index) in dataAccount" :key="index">
                <td>{{ getClientName(item.client_id) }}</td>
                <td>{{ convertDateToString(item.date) }}</td>
                <td>{{ item.bank_name }}</td>
                <td class="text-right">{{ item.account_number }}</td>
                <td>{{ getTypeTransaction(item.type) }}</td>
                <td class="text-right">
                  {{ formatNumber(item.number_trans) }}
                </td>
                <td class="text-right">
                  {{ formatCurrency.func(item.amount) }}
                </td>
                <td class="text-right">{{ Number(item.account_usage_rate) }}%</td>
                <td class="text-right">{{ formatCurrency.func(item.account_usage_fee, true) }}</td>
                <td>{{ item.company_name }}</td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="10" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6">{{ t('account_usage_fee.total') }}</td>
              <td class="text-right">
                {{ formatCurrency.func(totalAmount) }}
              </td>
              <td></td>
              <td class="text-right">
                {{ formatCurrency.func(totalAccountFee, true) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div v-if="accountUsageFee.length > 10">
        <Pagination v-model="currentPage" :totals="accountUsageFee.length" :page-size="pageSize" />
      </div>
    </va-card-content>
  </va-card>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, onMounted, Ref, watch, defineAsyncComponent } from 'vue'
  import SelectDatePicker from '../select-date-picker/index.vue'
  import AccountUsageFeeService from '../../services/AccountUsageFeeService'
  import ClientService from '../../services/ClientService'
  import ClientAggregation from '../../types/ClientAggregation'
  import momentFormatDate from 'moment'
  import { reactive } from 'vue'
  import { convertDateToString, formatCurrency, formatNumber, roundDown } from '../../common/utils'

  const Pagination = defineAsyncComponent(() => import('../pagination/Pagination.vue'))

  const { t } = useI18n()

  const date = ref(new Date())
  const selectListClient = reactive({
    value: [],
    options: [] as Record<string, string | number>[],
  })
  const client = ref()

  const accountUsageFee: Ref<ClientAggregation[]> = ref([])
  const dataAccount: Ref<ClientAggregation[]> = ref([])
  const totalAmount: any = ref(0)
  const totalAccountFee: any = ref(0)
  const isLoading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(10)

  const getDataAccountFee = async (params: any) => {
    currentPage.value = 1
    isLoading.value = true
    resetData()
    try {
      const { data } = await AccountUsageFeeService.getAccountUsageFee(params)
      const keys = Object.keys(data.deposit) as (keyof typeof data.deposit)[]
      const dataTable = [] as ClientAggregation[]
      keys.forEach((key) => {
        data.deposit[key]?.forEach((value: ClientAggregation) => {
          dataTable.push(value)
        })
        data.withdrawals[key]?.forEach((value: ClientAggregation) => {
          dataTable.push(value)
        })
      })
      accountUsageFee.value = dataTable

      // totalAmount.value =
      //   Number(data.deposit_aggregation_by_client?.amount || 0) +
      //   Number(data.withdrawals_aggregation_by_client?.amount || 0)
      sumAccountUsageFee()
      currentPage.value = 1
      pageSize.value = 10
      setDataAccount()
    } catch (error) {
      console.log(error)
    }
    isLoading.value = false
  }

  const resetData = () => {
    totalAccountFee.value = 0
    totalAmount.value = 0
    accountUsageFee.value = []
  }

  watch(
    date,
    () => {
      const fromDate = momentFormatDate(date.value).startOf('month').format('YYYY-MM-DD HH:mm:ss')
      const toDate = momentFormatDate(date.value).endOf('month').format('YYYY-MM-DD HH:mm:ss')
      if (client.value) {
        getDataAccountFee({ from_date: fromDate, to_date: toDate, client_id: client.value })
      } else {
        getDataAccountFee({ from_date: fromDate, to_date: toDate })
      }
    },
    { immediate: true },
  )

  watch(client, () => {
    const fromDate = momentFormatDate(date.value).startOf('month').format('YYYY-MM-DD HH:mm:ss')
    const toDate = momentFormatDate(date.value).endOf('month').format('YYYY-MM-DD HH:mm:ss')
    if (client.value) {
      getDataAccountFee({ from_date: fromDate, to_date: toDate, client_id: client.value })
    } else {
      getDataAccountFee({ from_date: fromDate, to_date: toDate })
    }
  })

  const sumAccountUsageFee = () => {
    return accountUsageFee.value.forEach((item) => {
      totalAccountFee.value += roundDown(+item.account_usage_fee)
      totalAmount.value += Number(item.amount)
    })
  }

  const setDataAccount = () => {
    dataAccount.value = []
    dataAccount.value = accountUsageFee.value
    // sumAccountUsageFee()
    dataAccount.value = dataAccount.value.slice(currentPage.value - 1, currentPage.value + pageSize.value - 1)
  }

  const getTypeTransaction = (value: number) => {
    if (value === 1) {
      return t('account_usage_fee.payment')
    }
    return t('account_usage_fee.withdrawal')
  }

  const getClientName = (value: number) => {
    let clientName = ''
    selectListClient.options.forEach((client) => {
      if (client.id == value) {
        clientName = client.text as string
      }
    })
    return clientName
  }

  const getCLientList = async () => {
    try {
      const { data } = await ClientService.getClientAll()
      const listClient: Record<string, string | number>[] = []
      data.forEach((value: { client_id: number; represent_name: string }) => {
        listClient.push({ text: value.represent_name, id: value.client_id })
      })
      selectListClient.options = listClient
    } catch (error) {
      console.log(error)
    }
  }

  onMounted(() => {
    getCLientList()
  })

  watch(currentPage, setDataAccount)
</script>
<style lang="scss" scoped>
  .title {
    font-weight: 700;
  }
  .cus-tabel-wrapper {
    overflow: scroll;
    max-height: 600px;
    table {
      thead {
        position: sticky;
        top: 0px;
        background-color: #ffffff;
      }
      tfoot {
        background-color: #1c78dd;
        color: #ffffff;
        font-weight: 700;
        line-height: 23px;
        position: sticky;
        bottom: 0px;
      }
    }
  }
</style>
