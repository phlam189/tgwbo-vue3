<template>
  <div class="dashboard">
    <TitleHeader class="c-mb-8" :title="`${t('cs_dashboard.dashboard_title')}`">
      <template #selectDate>
        <SelectDatePicker v-if="typeSearch !== DATE_PICKER_TYPES.PERIOD" v-model="date" :type="typeSelectDate" />
        <SelectPeriodPicker v-else v-model="dateRange" />
      </template>
      <template #groupButton>
        <p class="time-text">{{ t('last_updated_time') }}: {{ convertTime(timeToday) }}</p>
        <GroupDateButton :type-search="typeSearch" @changed="handleChangeTypeSearch" @refresh="refreshData" />
      </template>
    </TitleHeader>
    <div :key="refresh">
      <Widget
        v-if="selectedRow.length > 0"
        :aggregation-month="aggregationMonth"
        :aggregation-today="aggregationToday"
        :type-select-date="typeSelectDate"
        :date="date"
      />
      <Chart
        v-if="selectedRow.length > 0"
        :deposit="dataDeposit"
        :withdrawals="dataWithdraw"
        :sub-title="typeSelectDate"
      />
      <CardTableAdmin
        v-model:type-search="depositAndWithDrawalTypeSearch"
        :deposit="depositList"
        :withdrawals="withdrawalList"
        :type-select-date="typeSelectDate"
        @selected-row="handleSelectRow"
      />
      <CardTableAdminDetail
        v-if="selectedRow.length > 0"
        v-model:type-search="depositAndWithDrawalTypeSearch"
        :deposit-list="depositDetailTable"
        :withdrawal-list="withdrawalDetailTable"
        :client_id="selectedRow[0]"
        :date="date"
        :date-range="dateRange"
        :total="aggregationMonth"
        :type-select-date="typeSelectDate"
        :list-client="listClient"
        @add-charge-history-success="fetchData"
        @on-delete-charge-history="fetchData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, Ref, reactive, onMounted, defineAsyncComponent } from 'vue'
  import { useI18n } from 'vue-i18n'
  import moment from 'moment'
  import Widget, { aggregationTodayProps, aggregationMonthProps } from '../../../components/client/dashboard/Widget.vue'
  import Chart from '../../../components/client/dashboard/Chart.vue'
  import CardTableAdmin from '../../../components/dashboard/CardTableAdmin.vue'
  import CardTableAdminDetail from '../../../components/dashboard/CardTableAdminDetail.vue'
  import TransactionService from '../../../services/TransactionService'
  import ClientAggregation from '../../../types/ClientAggregation'
  import ClientService from '../../../services/ClientService'
  import { OptionClient } from '../../../types/Client'
  import { useGlobalStore } from '../../../stores/global-store'
  import { DATE_PICKER_TYPES, DEPOSIT_AND_WITHDRAWAL_TEXT } from '../../../common/constants'
  import { roundUp, convertTime } from '../../../common/utils'
  const globalStore = useGlobalStore()
  const { t } = useI18n()

  const TitleHeader = defineAsyncComponent(() => import('../../../components/header/Header.vue'))
  const GroupDateButton = defineAsyncComponent(
    () => import('../../../components/header/GroupDateButton/GroupDateButton.vue'),
  )
  const SelectDatePicker = defineAsyncComponent(() => import('../../../components/select-date-picker/index.vue'))
  const SelectPeriodPicker = defineAsyncComponent(
    () => import('../../../components/select-date-picker/rangePicker.vue'),
  )

  const typeSearch = ref(DATE_PICKER_TYPES.MONTH)
  const typeSelectDate = ref(DATE_PICKER_TYPES.MONTH)
  const date = ref(new Date())
  const timeToday = ref(new Date())
  const dateRange = ref({ start: new Date(), end: new Date() })
  const selectedRow = ref<number[]>([])
  const listClient = ref<OptionClient[]>([])
  const refresh = ref(0)

  const depositAndWithDrawalTypeSearch = ref(DEPOSIT_AND_WITHDRAWAL_TEXT.ALL)

  // Data of chart deposit
  const dataDeposit = reactive({
    label: [] as string[],
    dataAmount: [] as number[],
    dataTrans: [] as number[],
  })

  // Data of chart withdraw
  const dataWithdraw = reactive({
    label: [] as string[],
    dataAmount: [] as number[],
    dataTrans: [] as number[],
  })

  const depositDetailTable: Ref<ClientAggregation[]> = ref([])
  const withdrawalDetailTable: Ref<ClientAggregation[]> = ref([])

  // Handle change typeSearch ('day, month', year)
  const handleChangeTypeSearch = (type: string) => {
    typeSearch.value = type
    if (type === DATE_PICKER_TYPES.PERIOD) {
      dateRange.value = { start: new Date(), end: new Date() }
      typeSelectDate.value = type
    } else if (type === DATE_PICKER_TYPES.TODAY) {
      typeSelectDate.value = DATE_PICKER_TYPES.DAY
      date.value = new Date()
    } else {
      typeSelectDate.value = type
    }
  }

  // get params for call api
  const getParams = () => {
    const fromDate =
      typeSelectDate.value !== DATE_PICKER_TYPES.PERIOD
        ? moment(date.value).format('YYYY-MM-DD HH:mm:ss')
        : moment(dateRange.value?.start).format('YYYY-MM-DD HH:mm:ss')
    const toDate =
      typeSelectDate.value !== DATE_PICKER_TYPES.PERIOD
        ? moment(date.value).format('YYYY-MM-DD HH:mm:ss')
        : moment(dateRange.value?.end).format('YYYY-MM-DD HH:mm:ss')
    const params = {
      from_date: fromDate,
      to_date: toDate,
      group_by_date: undefined as undefined | number,
      group_by_month: undefined as undefined | number,
      group_by_year: undefined as undefined | number,
      include_today: 1,
    }

    if (
      typeSearch.value === DATE_PICKER_TYPES.TODAY ||
      typeSelectDate.value == DATE_PICKER_TYPES.DAY ||
      typeSelectDate.value == DATE_PICKER_TYPES.PERIOD
    ) {
      params.group_by_date = 1
    } else if (typeSelectDate.value == DATE_PICKER_TYPES.MONTH) {
      params.group_by_month = 1
    } else {
      params.group_by_year = 1
    }
    return params
  }

  // get params for call api
  const getParamsDetail = () => {
    const fromDate =
      typeSelectDate.value !== DATE_PICKER_TYPES.PERIOD
        ? moment(date.value).format('YYYY-MM-DD HH:mm:ss')
        : moment(dateRange.value?.start).format('YYYY-MM-DD HH:mm:ss')
    const toDate =
      typeSelectDate.value !== DATE_PICKER_TYPES.PERIOD
        ? moment(date.value).format('YYYY-MM-DD HH:mm:ss')
        : moment(dateRange.value?.end).format('YYYY-MM-DD HH:mm:ss')
    const params = {
      from_date: fromDate,
      to_date: toDate,
      group_by_date: undefined as undefined | number,
      group_by_month: undefined as undefined | number,
      group_by_year: undefined as undefined | number,
    }
    if (typeSearch.value === DATE_PICKER_TYPES.PERIOD) {
      params.group_by_date = 1
    } else if (typeSearch.value === DATE_PICKER_TYPES.TODAY) {
      params.group_by_month = 1
    } else if (typeSelectDate.value == DATE_PICKER_TYPES.MONTH || typeSelectDate.value == DATE_PICKER_TYPES.DAY) {
      params.group_by_month = 1
    } else {
      params.group_by_year = 1
    }
    return params
  }

  const resetTodayData = () => {
    aggregationToday.balance = ''
    aggregationToday.today_total_deposit_balance = '0'
    aggregationToday.today_number_deposit = 0
    aggregationToday.today_deposit_amount = '0'
    aggregationToday.today_number_scheduled_scrappers = 0
    aggregationToday.today_total_withdrawal_amount = '0'
    aggregationToday.today_number_withdrawal = 0
    aggregationToday.today_withdrawal_amount = '0'
    aggregationToday.today_scheduled_scrappers_amount = '0'
    selectedRow.value = []
    refresh.value += 1
  }

  const resetData = () => {
    aggregationMonth.deposit_account_balance = '0'
    aggregationMonth.number_of_deposits = 0
    aggregationMonth.total_deposit_amount = '0'
    aggregationMonth.withdrawal_account_balance = '0'
    aggregationMonth.number_of_withdrawals = 0
    aggregationMonth.total_withdrawal_amount = '0'
    dataDeposit.label = []
    dataDeposit.dataAmount = []
    dataDeposit.dataTrans = []
    dataWithdraw.label = []
    dataWithdraw.dataAmount = []
    dataWithdraw.dataTrans = []
  }

  // Handle select row table 1
  const handleSelectRow = async (rows: number[]) => {
    selectedRow.value = rows
    if (rows.length > 0) {
      const client_id = rows[0]
      const params = getParamsDetail()
      await getClientAggregation({ ...params, client_id: client_id, include_today: 1 })
    } else {
      resetData()
    }
  }

  // fetch data when change params search
  const fetchData = () => {
    resetData()
    const params = getParams()

    //  get data table 1
    getClientAggregation({ ...params, is_sum: 1 })

    // get data summary và chart
    if (selectedRow.value.length > 0) {
      const client_id = selectedRow.value[0]
      getClientAggregation({ ...params, client_id: client_id })
    }
  }

  // Watch change typeSearch
  watch(typeSearch, () => {
    resetTodayData()
    fetchData()
  })

  // Watch change date
  watch(date, function () {
    resetTodayData()
    fetchData()
  })

  // Watch change dateRange
  watch(dateRange, (value) => {
    if (value.start && value.end) {
      resetTodayData()
      fetchData()
    }
  })

  // Convert data for chart
  const mappingDataChart = (deposits: ClientAggregation[], withdrawals: ClientAggregation[]) => {
    if (typeSearch.value === DATE_PICKER_TYPES.YEAR) {
      const indexDeposit = deposits.findIndex((x) => moment(x.date).format('M') === moment().format('M'))
      const indexWithdrawal = withdrawals.findIndex((x) => moment(x.date).format('M') === moment().format('M'))

      deposits = deposits.filter((item) => {
        if (item.month == deposits[indexDeposit]?.month) {
          item.number_trans = Number(item.number_trans) + Number(deposits[indexDeposit].number_trans)
          item.amount = Number(item.amount) + Number(deposits[indexDeposit].amount)
        }
        return moment((item as any).date).format('D') !== moment().format('D')
      })
      withdrawals = withdrawals.filter((item) => {
        if (item.month == withdrawals[indexWithdrawal]?.month) {
          item.number_trans = Number(item.number_trans) + Number(withdrawals[indexWithdrawal].number_trans)
          item.amount = Number(item.amount) + Number(withdrawals[indexWithdrawal].amount)
        }
        return moment((item as any).date).format('D') !== moment().format('D')
      })
    }

    if (typeSelectDate.value === DATE_PICKER_TYPES.PERIOD) {
      deposits = deposits.sort((a: ClientAggregation, b: ClientAggregation) => {
        return moment(a.date).isBefore(moment(b.date)) ? -1 : 1
      })
      withdrawals = withdrawals.sort((a: ClientAggregation, b: ClientAggregation) => {
        return moment(a.date).isBefore(moment(b.date)) ? -1 : 1
      })
      dataDeposit.label = deposits.map((item) => {
        return typeSelectDate.value === DATE_PICKER_TYPES.YEAR
          ? `${moment((item as any).date).format('M')}`
          : `${moment((item as any).date).format('D')}`
      })
      dataDeposit.dataAmount = deposits.map((item) => roundUp((item as any).amount))
      dataDeposit.dataTrans = deposits.map((item) => roundUp((item as any).number_trans))

      dataWithdraw.label = withdrawals.map((item) => {
        return typeSelectDate.value === DATE_PICKER_TYPES.YEAR
          ? `${moment((item as any).date).format('M')}`
          : `${moment((item as any).date).format('D')}`
      })
      dataWithdraw.dataAmount = withdrawals.map((item) => roundUp((item as any).amount))
      dataWithdraw.dataTrans = withdrawals.map((item) => roundUp((item as any).number_trans))
    } else {
      dataDeposit.label = deposits.map((item) => {
        return typeSelectDate.value === DATE_PICKER_TYPES.YEAR
          ? `${moment((item as any).date).format('M')}`
          : `${moment((item as any).date).format('D')}`
      })
      dataDeposit.dataAmount = deposits.map((item) => roundUp((item as any).amount))
      dataDeposit.dataTrans = deposits.map((item) => roundUp((item as any).number_trans))

      dataWithdraw.label = withdrawals.map((item) => {
        return typeSelectDate.value === DATE_PICKER_TYPES.YEAR
          ? `${moment((item as any).date).format('M')}`
          : `${moment((item as any).date).format('D')}`
      })
      dataWithdraw.dataAmount = withdrawals.map((item) => roundUp((item as any).amount))
      dataWithdraw.dataTrans = withdrawals.map((item) => roundUp((item as any).number_trans))
    }
  }

  // const pushDataToday = (deposits: ClientAggregation[], withdrawals: ClientAggregation[]) => {
  //   const todayDeposit = {} as ClientAggregation
  //   todayDeposit.date = today
  //   todayDeposit.amount = roundUp(aggregationToday.today_deposit_amount)
  //   todayDeposit.number_trans = aggregationToday.today_number_deposit
  //   todayDeposit.type = DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT
  //   todayDeposit.account_balance = roundUp(aggregationToday.today_total_deposit_balance)
  //   todayDeposit.actual_balance = `${
  //     roundUp(depositDetailTable.value[0]?.actual_balance) + roundUp(todayDeposit.amount)
  //   }`
  //   todayDeposit.system_usage_fee = 0
  //   depositDetailTable.value = [todayDeposit, ...depositDetailTable.value]

  //   const todayWithdrawal = {} as ClientAggregation
  //   todayWithdrawal.date = today
  //   todayWithdrawal.amount = roundUp(+aggregationToday.today_withdrawal_amount)
  //   todayWithdrawal.number_trans = aggregationToday.today_number_withdrawal
  //   todayWithdrawal.type = DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL
  //   todayWithdrawal.account_balance = roundUp(+aggregationToday.today_total_withdrawal_amount)
  //   todayWithdrawal.actual_balance = `${
  //     roundUp(withdrawalDetailTable.value[0]?.actual_balance) - roundUp(todayWithdrawal.amount)
  //   }`
  //   todayWithdrawal.system_usage_fee = 0
  //   withdrawalDetailTable.value = [todayWithdrawal, ...withdrawalDetailTable.value]

  //   if (typeSelectDate.value !== DATE_PICKER_TYPES.YEAR) {
  //     mappingDataChart(depositDetailTable.value.reverse(), withdrawalDetailTable.value.reverse())
  //   } else {
  //     mappingDataChart(deposits.reverse(), withdrawals.reverse())
  //   }
  // }

  const aggregationMonth = reactive<aggregationMonthProps>({
    deposit_account_balance: '0',
    number_of_deposits: 0,
    total_deposit_amount: '0',
    withdrawal_account_balance: '0',
    number_of_withdrawals: 0,
    total_withdrawal_amount: '0',
  })
  const depositList: Ref<ClientAggregation[]> = ref([])
  const withdrawalList: Ref<ClientAggregation[]> = ref([])
  const getClientAggregation = async (params: any) => {
    globalStore.setLoading(true)
    try {
      const { data } = await TransactionService.getTransaction(params)
      // data box summary by today
      if (data.today && data.today['deposit'] && data.today['withdrawls'] && data.today['unknow']) {
        aggregationToday.balance = data.today['deposit'][0]?.amount || ''
        aggregationToday.today_total_deposit_balance = data.today?.deposit_balance || '0'
        aggregationToday.today_number_deposit = data.today['deposit'][0]?.number_of_deposit || 0
        aggregationToday.today_deposit_amount = data.today['deposit'][0]?.amount || '0'
        aggregationToday.today_number_scheduled_scrappers = data.today['unknow'][0]?.number_of_scheduled_scrappers || 0
        aggregationToday.today_total_withdrawal_amount = data.today?.withdrawals_balance || 0
        aggregationToday.today_number_withdrawal = data.today['withdrawls'][0]?.number_of_withdrawal || '0'
        aggregationToday.today_withdrawal_amount = data.today['withdrawls'][0]?.amount || '0'
        aggregationToday.today_scheduled_scrappers_amount = data.today['unknow'][0]?.amount || '0'
      }

      // data box summary by month
      if (params.client_id) {
        aggregationMonth.deposit_account_balance = data.deposit_aggregation_by_client?.balance || '0'
        aggregationMonth.number_of_deposits = data.deposit_aggregation_by_client?.number_trans
        aggregationMonth.total_deposit_amount = data.deposit_aggregation_by_client?.amount.toString() || '0'
        aggregationMonth.withdrawal_account_balance = data.withdrawals_aggregation_by_client?.balance || '0'
        aggregationMonth.number_of_withdrawals = data.withdrawals_aggregation_by_client?.number_trans
        aggregationMonth.total_withdrawal_amount = data.withdrawals_aggregation_by_client?.amount.toString() || '0'
      }

      const keysDeposit = Object.keys(data.deposit) as (keyof typeof data.deposit)[]
      const keysWithdrawal = Object.keys(data.withdrawals) as (keyof typeof data.withdrawals)[]
      const deposits = [] as ClientAggregation[]
      const withdrawals = [] as ClientAggregation[]
      keysDeposit.forEach((key) => {
        data.deposit[key].forEach((value: ClientAggregation) => {
          deposits.push(value)
        })
      })
      keysWithdrawal.forEach((key) => {
        data.withdrawals[key].forEach((value: ClientAggregation) => {
          withdrawals.push(value)
        })
      })

      const keysDeposits = Object.keys(data.deposit_for_each_date) as (keyof typeof data.deposit_for_each_date)[]
      const keysWithdrawals = Object.keys(
        data.withdrawals_for_each_date,
      ) as (keyof typeof data.withdrawals_for_each_date)[]
      const depositsYear = [] as ClientAggregation[]
      const withdrawalsYear = [] as ClientAggregation[]
      keysDeposits.forEach((key) => {
        data.deposit_for_each_date[key].forEach((value: ClientAggregation) => {
          depositsYear.push(value)
        })
      })
      keysWithdrawals.forEach((key) => {
        data.withdrawals_for_each_date[key].forEach((value: ClientAggregation) => {
          withdrawalsYear.push(value)
        })
      })

      if (params.is_sum === 1) {
        depositList.value = deposits
        withdrawalList.value = withdrawals
      } else {
        // set data detail table
        withdrawalDetailTable.value = withdrawalsYear && withdrawalsYear.length > 0 ? withdrawalsYear : withdrawals
        depositDetailTable.value = depositsYear && depositsYear.length > 0 ? depositsYear : deposits
        if (typeSelectDate.value !== DATE_PICKER_TYPES.YEAR) {
          mappingDataChart(depositDetailTable.value.reverse(), withdrawalDetailTable.value.reverse())
        } else {
          mappingDataChart(deposits.reverse(), withdrawals.reverse())
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      // time call API today
      timeToday.value = new Date()

      globalStore.setLoading(false)
    }
  }

  // const checkSameDate = computed(() => {
  //   return (
  //     moment(dateRange.value?.end).format(YYYY_MM_DD) === moment().format(YYYY_MM_DD) ||
  //     moment(dateRange.value?.start).format(YYYY_MM_DD) === moment().format(YYYY_MM_DD)
  //   )
  // })

  // const checkPushDataToday = computed(() => {
  //   if (
  //     typeSelectDate.value !== DATE_PICKER_TYPES.PERIOD &&
  //     moment(date.value).format('M') === moment().format('M') &&
  //     moment(date.value).format('YYYY') === moment().format('YYYY')
  //   ) {
  //     return true
  //   } else if (typeSelectDate.value === DATE_PICKER_TYPES.PERIOD && checkSameDate.value) {
  //     return true
  //   }
  //   return false
  // })

  const aggregationToday = reactive<aggregationTodayProps>({
    balance: '0',
    today_total_deposit_balance: '0',
    today_number_deposit: 0,
    today_deposit_amount: '0',
    today_number_scheduled_scrappers: 0,
    today_total_withdrawal_amount: '0',
    today_number_withdrawal: 0,
    today_withdrawal_amount: '0',
    today_scheduled_scrappers_amount: '0',
  })

  // fetch data today of client aggregation
  //   const getTodayClientAggregation = async (params: any) => {
  //   isLoading.value = true
  //   try {
  //     const { data } = await TransactionService.retrieveTodayClientAggregation(params)
  //     aggregationToday.balance = data.today['deposit'][0]?.amount || ''
  //     aggregationToday.today_total_deposit_balance = data.today?.deposit_balance || '0'
  //     aggregationToday.today_number_deposit = data.today['deposit'][0]?.number_of_deposit || 0
  //     aggregationToday.today_deposit_amount = data.today['deposit'][0]?.amount || '0'
  //     aggregationToday.today_number_scheduled_scrappers = data.today['unknow'][0]?.number_of_scheduled_scrappers || 0
  //     aggregationToday.today_total_withdrawal_amount = data.today?.withdrawals_balance || 0
  //     aggregationToday.today_number_withdrawal = data.today['withdrawls'][0]?.number_of_withdrawal || '0'
  //     aggregationToday.today_withdrawal_amount = data.today['withdrawls'][0]?.amount || '0'
  //     aggregationToday.today_scheduled_scrappers_amount = data.today['unknow'][0]?.amount || '0'
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     isLoading.value = false
  //   }
  // }

  // fetch data list clients
  const getClientAll = async () => {
    try {
      const { data } = await ClientService.getClientAll()
      listClient.value = data.filter((item: OptionClient) => item.client_id)
    } catch (error) {
      console.log(error)
    }
  }

  const onInit = () => {
    getClientAll()
    fetchData()
  }

  const refreshData = () => {
    resetTodayData()
    onInit()
  }

  onMounted(() => {
    onInit()
  })
</script>

<style lang="scss" scoped>
  :deep(.group-button) {
    .va-button__content {
      font-weight: 500;
    }
  }
  .time-text {
    font-weight: 400;
    color: #435564;
    align-self: center;
    padding-right: 12px;
  }
</style>
