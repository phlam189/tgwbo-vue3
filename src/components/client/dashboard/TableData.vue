<template>
  <va-card class="mt-3">
    <va-card-content>
      <div class="d-flex-between">
        <div v-if="typeSearch == DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT" class="table-title">
          {{ t('dashboard.payment') }}
        </div>
        <div v-else-if="typeSearch == DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL" class="table-title">
          {{ t('dashboard.withdrawal') }}
        </div>
        <div v-else class="table-title">{{ t('dashboard.list_deposits_withdrawals') }}</div>
        <GroupButton
          show-zoom-out
          :type-search="typeSearch"
          @change-type-search="handleChangeTypeSearch"
          @zoom-out="handleZoomOut"
          @on-download="handleDownloadCSV"
          @selected-column="handleSettingColumn"
        />
      </div>
      <div class="gap-16 d-flex c-mb-10">
        <div v-if="isShowDeposit" class="d-flex">
          <div class="text-label c-mr-12">{{ t('dashboard.deposit_account_balance') }} :</div>
          <div class="text-value">
            <span>{{ formatNumberCurrency(state.deposit_account_balance) }}</span>
          </div>
        </div>
        <div v-if="isShowWithdrawal" class="d-flex">
          <div class="text-label c-mr-12">{{ t('dashboard.withdrawal_account_balance') }} :</div>
          <div class="text-value">
            <span>{{ formatNumberCurrency(state.withdrawal_account_balance) }}</span>
          </div>
        </div>
      </div>
      <Table :column-setting="columnSetting" :type-search="typeSearch" :list="dataTable" />
    </va-card-content>
  </va-card>

  <va-modal v-model="isZoomOut" hide-default-actions no-dismiss fullscreen max-width="100%" max-height="100%">
    <div class="modalZoomOut">
      <div class="d-flex-between">
        <div v-if="typeSearch == DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT" class="table-title">
          {{ t('dashboard.payment') }}
        </div>
        <div v-else-if="typeSearch == DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL" class="table-title">
          {{ t('dashboard.withdrawal') }}
        </div>
        <div v-else class="table-title">{{ t('dashboard.list_deposits_withdrawals') }}</div>
        <GroupButton
          :type-search="typeSearch"
          @change-type-search="handleChangeTypeSearch"
          @on-download="handleDownloadCSV"
          @selected-column="handleSettingColumn"
        />
      </div>
      <div class="gap-16 d-flex c-mb-10">
        <div v-if="isShowDeposit" class="d-flex">
          <div class="text-label c-mr-12">{{ t('dashboard.deposit_account_balance') }} :</div>
          <div class="text-value">
            <span>{{ formatNumberCurrency(state.deposit_account_balance) }}</span>
          </div>
        </div>
        <div v-if="isShowWithdrawal" class="d-flex">
          <div class="text-label c-mr-12">{{ t('dashboard.withdrawal_account_balance') }} :</div>
          <div class="text-value">
            <span>{{ formatNumberCurrency(state.withdrawal_account_balance) }}</span>
          </div>
        </div>
      </div>
      <Table :column-setting="columnSetting" :type-search="typeSearch" :list="dataTable" is-on-modal />
      <div class="d-flex gap-4 d-flex-end c-mt-25">
        <va-button class="button-cancel" @click="() => (isZoomOut = false)">{{ t('modal.cancel') }}</va-button>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, defineProps, computed, reactive, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import GroupButton from '../../dashboard/GroupButton.vue'
  import Table from './Table.vue'
  import ClientAggregation from '../../../types/ClientAggregation'
  import { formatNumberCurrency } from '../../../common/utils'
  import moment from 'moment'
  import { DATE_PICKER_TYPES, DEPOSIT_AND_WITHDRAWAL_TEXT } from '../../../common/constants'
  import { CSVListParams } from '../../../types/Transaction'
  import TransactionService from '../../../services/TransactionService'
  import { useGlobalStore } from '../../../stores/global-store'
  const { t, locale } = useI18n()

  const typeSearch = ref('deposits_and_withdrawals')
  const isZoomOut = ref(false)
  const columnSetting = ref([] as string[])

  const props = defineProps<{
    deposit: any[]
    withdrawals: any[]
    typeSelectDate: string
    date: any
    dateRange: {
      start: Date
      end: Date
    }
    typeSearch: string
  }>()

  const state = reactive({
    deposit_account_balance: 0,
    withdrawal_account_balance: 0,
  })

  const isShowDeposit = computed(() => {
    return [DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT, DEPOSIT_AND_WITHDRAWAL_TEXT.ALL].includes(typeSearch.value)
  })

  const isShowWithdrawal = computed(() => {
    return [DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL, DEPOSIT_AND_WITHDRAWAL_TEXT.ALL].includes(typeSearch.value)
  })

  const initData = (dataArr: any[], type: number) => {
    let newWithdrawalArr = [] as any[]
    type == 2 ? newWithdrawalArr.push(...props.withdrawals) : newWithdrawalArr.push(...props.deposit)
    dataArr.forEach((value: ClientAggregation) => {
      if (!newWithdrawalArr.find((item: ClientAggregation) => item.date === value.date)) {
        newWithdrawalArr.push({
          client_id: value.client_id,
          type: type,
          date: value.date,
          month: value.month,
          number_trans: '0',
          amount: '0',
          charge_fee: '0',
          settlement_amount: '0',
          charge_amount: '0',
          number_refunds: '0',
          refund_amount: '0',
          refund_fee: '0',
          settlement_fee: '0',
          system_usage_fee: '0',
          transfer_amount: '0',
          account_balance: '0',
        })
      }
    })
    if (newWithdrawalArr.length !== dataArr.length) {
      newWithdrawalArr.forEach((val) => {
        if (!dataArr.find((item: ClientAggregation) => item.date == val.date)) {
          dataArr.push({
            client_id: val.client_id,
            type: type == 2 ? 1 : 2,
            date: val.date,
            month: val.month,
            number_trans: '0',
            amount: '0',
            charge_fee: '0',
            settlement_amount: '0',
            charge_amount: '0',
            number_refunds: '0',
            refund_amount: '0',
            refund_fee: '0',
            settlement_fee: '0',
            system_usage_fee: '0',
            transfer_amount: '0',
            account_balance: '0',
          })
        }
      })
    }
    return newWithdrawalArr.sort((a: ClientAggregation, b: ClientAggregation) =>
      moment(a.date).isBefore(moment(b.date)) ? -1 : 1,
    )
  }

  const dataTable = computed(() => {
    const data = [] as ClientAggregation[]
    if (typeSearch.value === 'deposits_and_withdrawals') {
      if (props.deposit.length > props.withdrawals.length) {
        let newData = initData(props.deposit, 2)
        let arrN = props.deposit
        arrN.sort((a: ClientAggregation, b: ClientAggregation) => (moment(a.date).isBefore(moment(b.date)) ? -1 : 1))
        for (let i = 0; i < props.deposit.length; i++) {
          data.push(props.deposit[i])
          data.push(newData[i])
        }
      } else if (props.deposit.length < props.withdrawals.length) {
        let newData = initData(props.withdrawals, 1)
        let arrN = props.withdrawals
        arrN.sort((a: ClientAggregation, b: ClientAggregation) => (moment(a.date).isBefore(moment(b.date)) ? -1 : 1))
        for (let i = 0; i < props.withdrawals.length; i++) {
          data.push(newData[i])
          data.push(props.withdrawals[i])
        }
      } else {
        for (let i = 0; i < props.withdrawals.length; i++) {
          data.push(props.deposit[i])
          data.push(props.withdrawals[i])
        }
      }
    }
    if (typeSearch.value === 'withdrawal') {
      props.withdrawals.forEach((value: ClientAggregation) => {
        data.push(value)
      })
    }
    if (typeSearch.value === 'payment') {
      props.deposit.forEach((value: ClientAggregation) => {
        data.push(value)
      })
    }
    return data.sort((a: ClientAggregation, b: ClientAggregation) => {
      return moment(b.date).isBefore(moment(a.date)) ? -1 : 1
    })
  })

  const handleChangeTypeSearch = (type: string) => {
    typeSearch.value = type
  }

  const handleZoomOut = () => {
    isZoomOut.value = true
  }

  const handleDownloadCSV = async () => {
    const params: CSVListParams = {
      csv: 1,
      from_date: moment(props.date).format('YYYY-MM-DD HH:mm:ss'),
      to_date: moment(props.date).format('YYYY-MM-DD HH:mm:ss'),
      filter_type: props.typeSelectDate,
      filter_date: moment(props.date).format('YYYY-MM-DD'),
      client_id: `${useGlobalStore().clientId}`,
      language: locale.value === 'gb' ? 'en' : locale.value,
    }

    if (props.typeSelectDate === DATE_PICKER_TYPES.PERIOD) {
      params.from_date = props.dateRange.start && moment(props.dateRange.start).format('YYYY-MM-DD HH:mm:ss')
      params.to_date = props.dateRange.end && moment(props.dateRange.end).format('YYYY-MM-DD HH:mm:ss')
      params.group_by_date = 1
    } else if (
      props.typeSearch === DATE_PICKER_TYPES.TODAY ||
      props.typeSelectDate == DATE_PICKER_TYPES.DAY ||
      props.typeSelectDate == DATE_PICKER_TYPES.MONTH
    ) {
      params.group_by_month = 1
    } else {
      params.group_by_year = 1
    }

    useGlobalStore().setLoading(true)
    try {
      const response = await TransactionService.downloadCSV(params)
      response.url ? (document.location.href = response.url) : ''
    } catch (err) {
      console.log({ err })
    } finally {
      useGlobalStore().setLoading(false)
    }
  }

  const handleSettingColumn = (value: string[]) => {
    columnSetting.value = value
  }

  watch(
    () => props.deposit,
    (newValue) => {
      state.deposit_account_balance =
        props.typeSelectDate == DATE_PICKER_TYPES.YEAR
          ? newValue.reverse()[props.deposit.length - 1]?.account_balance
          : newValue[props.deposit.length - 1]?.account_balance
    },
    { immediate: true },
  )

  watch(
    () => props.withdrawals,
    (newValue) => {
      state.withdrawal_account_balance =
        props.typeSelectDate == DATE_PICKER_TYPES.YEAR
          ? newValue.reverse()[props.withdrawals.length - 1]?.account_balance
          : newValue[props.withdrawals.length - 1]?.account_balance
    },
    { immediate: true },
  )
</script>

<style lang="scss" scoped>
  .table-title {
    font-weight: 700;
    font-size: 18px;
    line-height: 26px;
    color: #06152b;
  }
  .text-label {
    padding-top: 13px;
    font-size: 14px;
    line-height: 20px;
    color: #788b9a;
  }
  .text-value {
    font-weight: 700;
    font-size: 26px;
    line-height: 38px;
    color: #1c78dd;
  }

  // .modalZoomOut {
  //   // default margin and .va-modal__inner padding
  //   height: calc(100vh - var(--va-modal-dialog-margin) * 2 - 20px * 2);
  // }
</style>
