<template>
  <div class="dashboard">
    <TitleHeader class="c-mb-8" :title="`${t('cs_dashboard.dashboard_title')}`">
      <template #selectDate>
        <SelectDatePicker v-if="typeSearch !== DATE_PICKER_TYPES.PERIOD" v-model="date" :type="typeSelectDate" />
        <SelectPeriodPicker v-else v-model="dateRange" />
      </template>
      <template #groupButton>
        <p class="time-text">{{ t('last_updated_time') }}: {{ convertTime(timeToday) }}</p>
        <GroupDateButton :type-search="typeSearch" @changed="handleChangeTypeSearch" @refresh="refresh" />
      </template>
    </TitleHeader>
    <Widget
      :aggregation-month="aggregationMonth"
      :aggregation-today="aggregationToday"
      :type-select-date="typeSelectDate"
      :date="date"
      :is-loading="isLoading"
    />
    <Chart :deposit="dataDeposit" :withdrawals="dataWithdraw" :sub-title="typeSelectDate" />
    <TableData
      :date="date"
      :date-range="dateRange"
      :type-search="typeSearch"
      :type-select-date="typeSelectDate"
      :deposit="depositTableDetail"
      :withdrawals="withdrawalTableDetail"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, Ref, watch, onMounted, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { aggregationMonthProps, aggregationTodayProps } from '../../../components/client/dashboard/Widget.vue'
  import Chart from '../../../components/client/dashboard/Chart.vue'
  import TableData from '../../../components/client/dashboard/TableData.vue'
  import TransactionService from '../../../services/TransactionService'
  import ClientAggregation from '../../../types/ClientAggregation'
  import moment from 'moment'
  import { useGlobalStore } from '../../../stores/global-store'
  import { defineAsyncComponent } from 'vue'
  import { DATE_PICKER_TYPES, YYYY_MM_DD } from '../../../common/constants'
  import { roundUp, convertTime } from '../../../common/utils'
  const globalStore = useGlobalStore()

  const Widget = defineAsyncComponent(() => import('../../../components/client/dashboard/Widget.vue'))
  const TitleHeader = defineAsyncComponent(() => import('../../../components/header/Header.vue'))
  const GroupDateButton = defineAsyncComponent(
    () => import('../../../components/header/GroupDateButton/GroupDateButton.vue'),
  )
  const SelectDatePicker = defineAsyncComponent(() => import('../../../components/select-date-picker/index.vue'))
  const SelectPeriodPicker = defineAsyncComponent(
    () => import('../../../components/select-date-picker/rangePicker.vue'),
  )

  const { t } = useI18n()

  const typeSearch = ref(DATE_PICKER_TYPES.MONTH)
  const typeSelectDate = ref(DATE_PICKER_TYPES.MONTH)
  const date = ref(new Date())
  const timeToday = ref(new Date())
  const dateRange = ref({ start: new Date(), end: new Date() })
  const isLoading = ref(true)
  const dataDeposit = reactive({
    label: [] as string[],
    dataAmount: [] as number[],
    dataTrans: [] as number[],
  })

  const dataWithdraw = reactive({
    label: [] as string[],
    dataAmount: [] as number[],
    dataTrans: [] as number[],
  })

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

  const onWatchGetData = () => {
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
      client_id: globalStore.getClientId(),
      include_today: 1,
      group_by_date: undefined as undefined | number,
      group_by_month: undefined as undefined | number,
      group_by_year: undefined as undefined | number,
    }

    if (typeSearch.value === DATE_PICKER_TYPES.PERIOD) {
      params.group_by_date = 1
    } else if (
      typeSearch.value === DATE_PICKER_TYPES.TODAY ||
      typeSelectDate.value == DATE_PICKER_TYPES.DAY ||
      typeSelectDate.value == DATE_PICKER_TYPES.MONTH
    ) {
      params.group_by_month = 1
    } else {
      params.group_by_year = 1
    }
    getClientAggregation(params)
  }

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

  const depositTableDetail: Ref<ClientAggregation[]> = ref([])
  const withdrawalTableDetail: Ref<ClientAggregation[]> = ref([])

  const getClientAggregation = async (params: any) => {
    resetData()
    globalStore.setLoading(true)
    try {
      const { data } = await TransactionService.getTransaction(params)
      // data box summary today
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

      // data box summary month
      aggregationMonth.deposit_account_balance = data.deposit_aggregation_by_client?.balance || '0'
      aggregationMonth.number_of_deposits = data.deposit_aggregation_by_client?.number_trans
      aggregationMonth.total_deposit_amount = data.deposit_aggregation_by_client?.amount.toString() || '0'
      aggregationMonth.withdrawal_account_balance = data.withdrawals_aggregation_by_client?.balance || '0'
      aggregationMonth.number_of_withdrawals = data.withdrawals_aggregation_by_client?.number_trans
      aggregationMonth.total_withdrawal_amount = data.withdrawals_aggregation_by_client?.amount.toString() || '0'

      // set data follow filter date, month
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
      depositList.value = deposits && deposits.length > 0 ? [...depositList.value, ...deposits] : []
      withdrawalList.value = withdrawals && withdrawals.length > 0 ? [...withdrawalList.value, ...withdrawals] : []

      // set data follow filter year
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

      // set data table detail
      depositTableDetail.value =
        depositsYear && depositsYear.length > 0 ? [...depositTableDetail.value, ...depositsYear] : depositList.value
      withdrawalTableDetail.value =
        withdrawalsYear && withdrawalsYear.length > 0
          ? [...withdrawalTableDetail.value, ...withdrawalsYear]
          : withdrawalList.value

      // if (checkPushDataToday.value) {
      //   pushDataToday(depositList.value, withdrawalList.value)
      // } else {
      //   // set data chart
      //   mappingDataChart(depositList.value.reverse(), withdrawalList.value.reverse())
      // }

      if (typeSelectDate.value !== DATE_PICKER_TYPES.YEAR) {
        mappingDataChart(depositTableDetail.value.reverse(), withdrawalTableDetail.value.reverse())
      } else {
        mappingDataChart(deposits.reverse(), withdrawals.reverse())
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
  // const getTodayClientAggregation = async (params: any) => {
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

  const mappingDataChart = (deposits: ClientAggregation[], withdrawals: ClientAggregation[]) => {
    if (typeSearch.value === DATE_PICKER_TYPES.YEAR) {
      const indexDeposit = deposits.findIndex((x) => moment(x.date).format('M') === moment().format('M'))
      const indexWithdrawal = withdrawals.findIndex((x) => moment(x.date).format('M') === moment().format('M'))

      deposits = deposits.filter((item) => {
        if (item.month == deposits[indexDeposit]?.month) {
          item.number_trans = Number(item.number_trans) + Number(deposits[indexDeposit].number_trans)
          item.amount = roundUp(+item.amount) + roundUp(+deposits[indexDeposit].amount)
        }
        return moment((item as any).date).format('D') !== moment().format('D')
      })
      withdrawals = withdrawals.filter((item) => {
        if (item.month == withdrawals[indexWithdrawal]?.month) {
          item.number_trans = Number(item.number_trans) + Number(withdrawals[indexWithdrawal].number_trans)
          item.amount = roundUp(+item.amount) + roundUp(+withdrawals[indexWithdrawal].amount)
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
  //   todayDeposit.amount = roundUp(+aggregationToday.today_deposit_amount)
  //   todayDeposit.number_trans = aggregationToday.today_number_deposit
  //   todayDeposit.type = DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT
  //   todayDeposit.account_balance = roundUp(+aggregationToday.today_total_deposit_balance)
  //   depositTableDetail.value = [todayDeposit, ...depositTableDetail.value]

  //   const todayWithdrawal = {} as ClientAggregation
  //   todayWithdrawal.date = today
  //   todayWithdrawal.amount = roundUp(+aggregationToday.today_withdrawal_amount)
  //   todayWithdrawal.number_trans = aggregationToday.today_number_withdrawal
  //   todayWithdrawal.type = DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL
  //   todayWithdrawal.account_balance = roundUp(+aggregationToday.today_total_withdrawal_amount)
  //   withdrawalTableDetail.value = [todayWithdrawal, ...withdrawalTableDetail.value]

  //   if (typeSelectDate.value !== DATE_PICKER_TYPES.YEAR) {
  //     mappingDataChart(depositTableDetail.value.reverse(), withdrawalTableDetail.value.reverse())
  //   } else {
  //     mappingDataChart(deposits.reverse(), withdrawals.reverse())
  //   }
  // }

  const resetData = () => {
    depositList.value = []
    withdrawalList.value = []
    depositTableDetail.value = []
    withdrawalTableDetail.value = []
  }

  const onInit = async () => {
    // const fromDate = today
    // await getTodayClientAggregation({ from_date: fromDate, to_date: fromDate, client_id: globalStore.getClientId() })
    onWatchGetData()
  }

  const refresh = () => {
    onInit()
  }

  watch(typeSearch, () => {
    if (typeSearch.value === DATE_PICKER_TYPES.TODAY && typeSelectDate.value === DATE_PICKER_TYPES.DAY) {
      return
    } else {
      onWatchGetData()
    }
  })

  watch(date, () => {
    onWatchGetData()
  })

  // Watch change dateRange
  watch(dateRange, (value) => {
    if (value.start && value.end) {
      onWatchGetData()
    }
  })

  onMounted(() => {
    onInit()
  })
</script>

<style lang="scss" scoped>
  .va-inner-loading {
    width: 100%;
    min-width: auto;
  }
  .time-text {
    font-weight: 400;
    color: #435564;
    align-self: center;
    padding-right: 12px;
  }
</style>
