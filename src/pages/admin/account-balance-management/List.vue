<template>
  <div class="dashboard">
    <TitleHeader :title="`${t('account_balance.list_account_balances_title')}`"></TitleHeader>
    <va-card class="c-mt-20">
      <va-card-content>
        <div class="d-flex-between">
          <div class="section-title c-mb-30">{{ t('account_balance.list_account_balances') }}</div>
          <div class="d-flex">
            <SelectDatePicker v-model="dateListAccount" type="month" placement="bottom-right" />
          </div>
        </div>
        <TableAccountBalance
          :key="accountBalanceKey"
          :account-balance="resData.listAccountPagination"
          :account-balance-original="resData.listAccount"
          :page-size="pageSizeAccountBalance"
          @change-pagination="setAccountBalancePagination"
        />
      </va-card-content>
    </va-card>
    <!--    <va-card class="c-mt-20">-->
    <!--      <va-card-content>-->
    <!--        <div class="d-flex-between">-->
    <!--          <div class="section-title c-mb-30">{{ t('account_balance.balance_entry_history') }}</div>-->
    <!--          <div class="d-flex">-->
    <!--            <SelectDatePicker v-model="dateBalanceHistory" type="month" placement="bottom-right" />-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <TableEntryHistory-->
    <!--          ref="tableEntryHistory"-->
    <!--          :key="balanceHistoryKey"-->
    <!--          :history-detail="resData.historyDetailPagination"-->
    <!--          :history-detail-original="resData.historyDetail"-->
    <!--          :page-size="pageSizeHistoryDetail"-->
    <!--          @refresh-balance-history="refreshAccountBalance"-->
    <!--          @change-pagination="setHistoryDetailPagination"-->
    <!--        />-->
    <!--      </va-card-content>-->
    <!--    </va-card>-->
    <va-card class="c-mt-20">
      <va-card-content>
        <div class="d-flex-between">
          <div class="section-title c-mb-30">{{ t('account_balance.loan_history') }}</div>
          <div class="d-flex">
            <SelectDatePicker v-model="date" type="month" placement="bottom-right" />
          </div>
        </div>
        <TableLoanHistory
          ref="tableLoanHistory"
          :key="loanHistoryKey"
          :charge-history="resData.chargeHistoryPagination"
          :charge-history-original="resData.chargeHistory"
          :kinds="kinds"
          :page-size="pageSizeChargeHistory"
          @refresh-loan-history="refreshLoanHistory"
          @change-pagination="setChargeHistoryPagination"
        />
      </va-card-content>
    </va-card>
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import TitleHeader from '../../../components/header/Header.vue'
  import { defineAsyncComponent, onMounted, reactive, ref, watch } from 'vue'
  import { AccountBalanceDTO, QueryParamsListAccountBalance } from '../../../types/AccountBalanceDTO'
  import AccountBalanceService from '../../../services/AccountBalanceService'
  import chargeHistoryService from '../../../services/ChargeHistoryService'
  import { ChargeHistoryGetParams, ChargeHistoryItem } from '../../../types/ChargeHistory'
  import SelectDatePicker from '../../../components/select-date-picker/index.vue'
  import moment from 'moment/moment'
  import { CHARGE_HISTORY_TYPE, DEPOSIT_AND_WITHDRAWAL_CODE, KINDS_TYPE } from '../../../common/constants'

  const TableAccountBalance = defineAsyncComponent(
    () => import('../../../components/account-balance-management/TableAccountBalance.vue'),
  )
  // const TableEntryHistory = defineAsyncComponent(
  //   () => import('../../../components/account-balance-management/TableEntryHistory.vue'),
  // )
  const TableLoanHistory = defineAsyncComponent(
    () => import('../../../components/account-balance-management/TableLoanHistory.vue'),
  )

  const svAccountBalance = new AccountBalanceService()

  const { t } = useI18n()

  const resData = reactive({
    listAccount: [] as AccountBalanceDTO[],
    listAccountPagination: [] as AccountBalanceDTO[],
    historyDetail: [] as AccountBalanceDTO[],
    historyDetailPagination: [] as AccountBalanceDTO[],
    chargeHistory: [] as ChargeHistoryItem[],
    chargeHistoryPagination: [] as ChargeHistoryItem[],
  })
  // const tableEntryHistory = ref<InstanceType<typeof TableEntryHistory>>()
  const tableLoanHistory = ref<InstanceType<typeof TableLoanHistory>>()
  const date = ref(new Date())
  const dateBalanceHistory = ref()
  const dateListAccount = ref()
  const kinds = ref([
    {
      id: KINDS_TYPE.BORROWING_DEPOSIT_ACCOUNT,
      text: t('account_balance.borrowing_deposit_account'),
    },
    {
      id: KINDS_TYPE.BORROWING_WITHDRAWAL_ACCOUNT,
      text: t('account_balance.borrowing_withdrawal_account'),
    },
    {
      id: KINDS_TYPE.REPAYMENT_DEPOSIT_ACCOUNT,
      text: t('account_balance.repayment_deposit_account'),
    },
    {
      id: KINDS_TYPE.REPAYMENT_WITHDRAWAL_ACCOUNT,
      text: t('account_balance.repayment_withdrawal_account'),
    },
    {
      id: KINDS_TYPE.WITHDRAWAL,
      text: t('account_balance.withdrawal'),
    },
  ])
  const startDate = ref('')
  const endDate = ref('')
  const currentPageHistoryDetail = ref(1)
  const pageSizeHistoryDetail = ref(10)
  const currentPageChargeHistory = ref(1)
  const pageSizeChargeHistory = ref(10)
  const currentPageAccountBalance = ref(1)
  const pageSizeAccountBalance = ref(10)
  const balanceHistoryKey = ref(0)
  const accountBalanceKey = ref(0)
  const loanHistoryKey = ref(0)

  const getAccountBalance = async (params: QueryParamsListAccountBalance, listAccount = true, historyDetail = true) => {
    await svAccountBalance.getListAccount(params).then((res) => {
      if (!res) {
        resData.listAccount = []
        resData.historyDetail = []
        return
      }
      if (listAccount) {
        resData.listAccount = res.data.data_list_account
      }
      if (historyDetail) {
        resData.historyDetail = res.data.data_history_detail
      }

      setHistoryDetailPagination()
      setAccountBalancePagination()
    })
  }

  // const refreshAccountBalance = async () => {
  //   await getAccountBalance({
  //     from_date: startDate.value,
  //     to_date: endDate.value,
  //   })
  //   tableEntryHistory.value?.openModalNotification()
  // }

  const refreshLoanHistory = async () => {
    await getChargeHistoryList({
      from_date: startDate.value,
      to_date: endDate.value,
      loan: 1,
    })
    tableLoanHistory.value?.openModalNotification()
  }

  watch(date, () => {
    startDate.value = moment(date.value).startOf('month').format('YYYY-MM-DD')
    endDate.value = moment(startDate.value).endOf('month').format('YYYY-MM-DD')
    getChargeHistoryList({
      from_date: startDate.value,
      to_date: endDate.value,
      loan: 1,
    })
    loanHistoryKey.value += 1
  })

  watch(dateBalanceHistory, () => {
    startDate.value = moment(dateBalanceHistory.value).startOf('month').format('YYYY-MM-DD')
    endDate.value = moment(startDate.value).endOf('month').format('YYYY-MM-DD')
    getAccountBalance(
      {
        from_date: startDate.value,
        to_date: endDate.value,
      },
      false,
      true,
    )
    balanceHistoryKey.value += 1
  })

  watch(dateListAccount, () => {
    startDate.value = moment(dateListAccount.value).startOf('month').format('YYYY-MM-DD')
    endDate.value = moment(startDate.value).endOf('month').format('YYYY-MM-DD')
    getAccountBalance(
      {
        from_date: startDate.value,
        to_date: endDate.value,
      },
      true,
      false,
    )
    accountBalanceKey.value += 1
  })

  const getChargeHistoryList = async (params: ChargeHistoryGetParams) => {
    try {
      let response = (await chargeHistoryService.getChargeHistoryList(params)) as unknown as any[]
      resData.chargeHistory = response.map((item) => {
        if (
          item.type_client_aggregation === DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT &&
          item.type === CHARGE_HISTORY_TYPE.BORROWING
        ) {
          item.kinds = t('account_balance.borrowing_deposit_account')
        } else if (
          item.type_client_aggregation === DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL &&
          item.type === CHARGE_HISTORY_TYPE.BORROWING
        ) {
          item.kinds = t('account_balance.borrowing_withdrawal_account')
        } else if (
          item.type_client_aggregation === DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT &&
          item.type === CHARGE_HISTORY_TYPE.REPAYMENT
        ) {
          item.kinds = t('account_balance.repayment_deposit_account')
        } else if (
          item.type_client_aggregation === DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL &&
          item.type === CHARGE_HISTORY_TYPE.REPAYMENT
        ) {
          item.kinds = t('account_balance.repayment_withdrawal_account')
        } else if (
          item.type_client_aggregation === DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL &&
          item.type === CHARGE_HISTORY_TYPE.DEPOSITS_AND_WITHDRAWALS
        ) {
          item.kinds = t('account_balance.withdrawal')
        }
        return item
      })
      resData.chargeHistory = [...response]
      setChargeHistoryPagination()
    } catch (e) {
      console.log(e)
    }
  }

  const setHistoryDetailPagination = (pagination = null) => {
    resData.historyDetailPagination = []
    resData.historyDetailPagination = resData.historyDetail

    if (pagination === null) {
      resData.historyDetailPagination = resData.historyDetail.slice(
        currentPageHistoryDetail.value - 1,
        currentPageHistoryDetail.value + pageSizeHistoryDetail.value - 1,
      )
    } else {
      resData.historyDetailPagination = resData.historyDetail.slice(
        pagination - 1,
        pagination + pageSizeHistoryDetail.value - 1,
      )
    }
  }

  const setChargeHistoryPagination = (pagination = null) => {
    resData.chargeHistoryPagination = []
    resData.chargeHistoryPagination = resData.chargeHistory

    if (pagination === null) {
      resData.chargeHistoryPagination = resData.chargeHistory.slice(
        currentPageChargeHistory.value - 1,
        currentPageChargeHistory.value + pageSizeChargeHistory.value - 1,
      )
    } else {
      resData.chargeHistoryPagination = resData.chargeHistory.slice(
        pagination - 1,
        pagination + pageSizeHistoryDetail.value - 1,
      )
    }
  }

  const setAccountBalancePagination = (pagination = null) => {
    resData.listAccountPagination = []
    resData.listAccountPagination = resData.listAccount

    if (pagination === null) {
      resData.listAccountPagination = resData.listAccount.slice(
        currentPageAccountBalance.value - 1,
        currentPageAccountBalance.value + pageSizeAccountBalance.value - 1,
      )
    } else {
      resData.listAccountPagination = resData.listAccount.slice(
        pagination - 1,
        pagination + pageSizeHistoryDetail.value - 1,
      )
    }
  }

  onMounted(async () => {
    startDate.value = moment().startOf('month').format('YYYY-MM-DD')
    endDate.value = moment(startDate.value).endOf('month').format('YYYY-MM-DD')

    await getAccountBalance({
      from_date: startDate.value,
      to_date: endDate.value,
    })
    await getChargeHistoryList({
      from_date: startDate.value,
      to_date: endDate.value,
      loan: 1,
    })
  })
</script>
<style lang="scss" scoped></style>
