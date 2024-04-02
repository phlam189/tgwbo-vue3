<template>
  <va-card class="c-mt-30">
    <va-card-content>
      <div class="d-flex-between">
        <div class="table-title">{{ state.client.represent_name }}</div>
        <GroupButton
          show-zoom-out
          :type-search="props.typeSearch"
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
      <TableAdminDetail
        :column-setting="columnSetting"
        :type-search="typeSearch"
        :list="dataTable"
        @selected-row="handleSelectRow"
      />
      <div class="d-flex-between">
        <div>
          <va-button class="button-create c-w-92" @click="showModalProfile">{{ t('info') }}</va-button>
        </div>
        <div class="d-flex gap-2 d-flex-end c-mt-20 c-mb-30">
          <va-button :disabled="isDisabledAdd()" class="button-create c-w-92" @click="openModalAdd">{{
            t('new')
          }}</va-button>
          <va-button
            :disabled="selectedChargeHistory ? false : true"
            class="button-create c-w-92"
            @click="openModalEdit"
          >
            {{ t('edit') }}
          </va-button>
          <va-button
            :disabled="selectedChargeHistory ? false : true"
            class="button-delete c-w-92"
            @click="onClickDelete"
          >
            {{ t('delete') }}
          </va-button>
        </div>
      </div>

      <!-- Table -->
      <div class="cus-tabel-wrapper table-detail-second">
        <table>
          <!-- Header table -->
          <thead>
            <tr>
              <th style="width: 139px">{{ t('dashboard.date') }}</th>
              <th style="width: 84px">{{ t('dashboard.number_of_deposits_2') }}</th>
              <th style="width: 110px">{{ t('dashboard.deposit_amount') }}</th>
              <th style="width: 72px">{{ t('dashboard.number_of_withdrawals_2') }}</th>
              <th style="width: 116px">{{ t('dashboard.withdrawal_amount') }}</th>
              <th style="width: 160px">{{ t('dashboard.deposit_system_usage_fee') }}</th>
              <th style="width: 160px">{{ t('dashboard.withdrawal_system_usage_fee') }}</th>
              <th style="width: 136px">{{ t('dashboard.total_bill') }}</th>
              <th style="width: 172px">{{ t('dashboard.invoice') }}</th>
            </tr>
          </thead>

          <!-- Body table -->
          <tbody>
            <template v-if="renderedInvoices.length > 0">
              <tr v-for="(invoice, index) in renderedInvoices" :key="index">
                <td>{{ convertDateString(invoice.date) }}</td>
                <td class="text-right">{{ formatNumber(invoice.number_of_deposits) }}</td>
                <td class="text-right">{{ formatCurrency.func(invoice.deposit_amount) }}</td>
                <td class="text-right">{{ formatNumber(invoice.number_of_withdrawals) }}</td>
                <td class="text-right">{{ formatCurrency.func(invoice.withdrawal_amount) }}</td>
                <td class="text-right">{{ formatCurrency.func(invoice.deposit_system_usage_fee) }}</td>
                <td class="text-right">{{ formatCurrency.func(invoice.withdrawal_system_usage_fee) }}</td>
                <td class="text-right">{{ formatCurrency.func(invoice.total_bill) }}</td>
                <td>
                  <div class="d-flex-end gap-4 c-pr-30">
                    <div v-if="invoice.status === 2" style="color: #bc0909">{{ t('dashboard.corrected') }}</div>
                    <div
                      v-if="isAbleToPublish(invoice.date)"
                      class="cursor-pointer"
                      style="color: #1c78dd"
                      @click="showModalEditInvoice(invoice)"
                    >
                      {{ t('dashboard.display') }}
                    </div>
                    <div v-if="!isAbleToPublish(invoice.date)" style="font-weight: 500">
                      {{ t('dashboard.unpublished') }}
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="23" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </va-card-content>
  </va-card>

  <va-modal v-model="isZoomOut" hide-default-actions no-dismiss fullscreen max-width="100%" style="z-index: 1000">
    <div class="modalZoomOut">
      <div class="d-flex-between">
        <div class="table-title">{{ state.client.represent_name }}</div>
        <GroupButton
          :type-search="typeSearch"
          @change-type-search="handleChangeTypeSearch"
          @on-download="handleDownloadCSV"
          @selected-column="handleSettingColumn"
        />
      </div>
      <div class="gap-16 d-flex c-mb-10">
        <div v-if="typeSearch === 'payment' || typeSearch === 'deposits_and_withdrawals'" class="d-flex">
          <div class="text-label c-mr-12">{{ t('dashboard.deposit_account_balance') }} :</div>
          <div class="text-value">
            <span>{{ formatNumberCurrency(state.deposit_account_balance) }}</span>
          </div>
        </div>
        <div v-if="typeSearch === 'withdrawal' || typeSearch === 'deposits_and_withdrawals'" class="d-flex">
          <div class="text-label c-mr-12">{{ t('dashboard.withdrawal_account_balance') }} :</div>
          <div class="text-value">
            <span>{{ formatNumberCurrency(state.withdrawal_account_balance) }}</span>
          </div>
        </div>
      </div>
      <TableAdminDetail
        :is-zoom-out="isZoomOut"
        :type-search="typeSearch"
        :list="dataTable"
        :column-setting="columnSetting"
        @selected-row="handleSelectRow"
      />
      <div class="d-flex-between">
        <div>
          <va-button class="button-cancel" @click="() => (isZoomOut = false)">{{ t('modal.cancel') }}</va-button>
        </div>
        <div class="d-flex gap-2 d-flex-end c-mt-20 c-mb-30">
          <va-button :disabled="isDisabledAdd()" class="button-create c-w-92" @click="openModalAdd">{{
            t('new')
          }}</va-button>
          <va-button
            :disabled="selectedChargeHistory ? false : true"
            class="button-create c-w-92"
            @click="openModalEdit"
          >
            {{ t('edit') }}
          </va-button>
          <va-button
            :disabled="selectedChargeHistory ? false : true"
            class="button-delete c-w-92"
            @click="onClickDelete"
          >
            {{ t('delete') }}
          </va-button>
        </div>
      </div>
    </div>
  </va-modal>

  <ModalViewProfile ref="modalViewProfile" :client="state.client" />
  <ModalAddData
    ref="modalAddData"
    :deposit-account-balance="state.deposit_account_balance"
    @success="emit('addChargeHistorySuccess')"
  />
  <ModalEditInvoice ref="modalEditInvoice" @success="fetchData" />
</template>

<script setup lang="ts">
  import { computed, watch, ref, reactive, defineProps, defineEmits } from 'vue'
  import { useI18n } from 'vue-i18n'
  import moment from 'moment'
  import GroupButton from './GroupButton.vue'
  import TableAdminDetail from './TableAdminDetail.vue'
  import ModalViewProfile from './ModalViewProfile.vue'
  import ModalAddData from './ModalAddData.vue'
  import ModalEditInvoice from './ModalEditInvoice.vue'
  import ClientService from '../../services/ClientService'
  import TransactionService from '../../services/TransactionService'
  import ClientAggregation from '../../types/ClientAggregation'
  import { Client, OptionClient } from '../../types/Client'
  import InvoiceService from '../../services/InvoiceService'
  import { convertDateString, formatCurrency, formatNumber, formatNumberCurrency, roundUp } from '../../common/utils'
  import { InvoiceListGetParams, InvoiceTableItem, MissingInvoiceTableItem } from '../../types/Invoice'
  import {
    DATE_PICKER_TYPES,
    YYYY_MM_01,
    MONTH_INDEXES,
    DEPOSIT_AND_WITHDRAWAL_TEXT,
    ERROR_DATE,
  } from '../../common/constants'
  import { ChargeHistoryItem } from '../../types/ChargeHistory'
  import { useModal, useToast } from 'vuestic-ui'
  import ChargeHistoryService from '../../services/ChargeHistoryService'
  import { aggregationMonthProps } from '../client/dashboard/Widget.vue'
  import { CSVListParams } from '../../types/Transaction'
  import { useGlobalStore } from '../../stores/global-store'

  const { t, locale } = useI18n()
  const { confirm } = useModal()
  const { init } = useToast()

  const emit = defineEmits<{
    (e: 'addChargeHistorySuccess'): void
    (e: 'onDeleteChargeHistory'): void
    (e: 'update:typeSearch', newValue: string): void
  }>()

  const props = defineProps<{
    client_id: number
    date: Date
    dateRange: {
      start: Date
      end: Date
    }
    typeSelectDate: string
    listClient: OptionClient[]
    depositList: ClientAggregation[]
    withdrawalList: ClientAggregation[]
    typeSearch: string
    total: aggregationMonthProps
  }>()

  const selectedRow = ref<string[]>([])
  const selectedChargeHistory = ref<ChargeHistoryItem | null>()
  const modalViewProfile = ref<InstanceType<typeof ModalViewProfile>>()
  const modalAddData = ref<InstanceType<typeof ModalAddData>>()
  const modalEditInvoice = ref<InstanceType<typeof ModalEditInvoice>>()
  const isZoomOut = ref(false)
  const columnSetting = ref([] as string[])

  const handleSettingColumn = (value: string[]) => {
    columnSetting.value = value
  }

  const state = reactive({
    deposit_account_balance: 0,
    withdrawal_account_balance: 0,
    client: {} as Client,
    invoices: [] as InvoiceTableItem[],
  })

  const isShowDeposit = computed(() => {
    return [DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT, DEPOSIT_AND_WITHDRAWAL_TEXT.ALL].includes(props.typeSearch)
  })

  const isShowWithdrawal = computed(() => {
    return [DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL, DEPOSIT_AND_WITHDRAWAL_TEXT.ALL].includes(props.typeSearch)
  })

  const initData = (dataArr: any[], type: number) => {
    let newWithdrawalArr = [] as any[]
    type == 2 ? newWithdrawalArr.push(...props.withdrawalList) : newWithdrawalArr.push(...props.depositList)
    dataArr.forEach((value: ClientAggregation) => {
      if (!newWithdrawalArr.find((item: ClientAggregation) => item.date == value.date)) {
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
    if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.ALL) {
      if (props.depositList.length > props.withdrawalList.length) {
        let newData = initData(props.depositList, 2)
        let arrN = props.depositList
        arrN.sort((a: ClientAggregation, b: ClientAggregation) => (moment(a.date).isBefore(moment(b.date)) ? -1 : 1))
        for (let i = 0; i < props.depositList.length; i++) {
          data.push(arrN[i])
          data.push(newData[i])
        }
      } else if (props.depositList.length < props.withdrawalList.length) {
        let newData = initData(props.withdrawalList, 1)
        let arrN = props.withdrawalList
        arrN.sort((a: ClientAggregation, b: ClientAggregation) => (moment(a.date).isBefore(moment(b.date)) ? -1 : 1))
        for (let i = 0; i < props.withdrawalList.length; i++) {
          data.push(newData[i])
          data.push(props.withdrawalList[i])
        }
      } else {
        for (let i = 0; i < props.depositList.length; i++) {
          data.push(props.depositList[i])
          data.push(props.withdrawalList[i])
        }
      }
    }
    if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL) {
      props.withdrawalList?.forEach((value: ClientAggregation) => {
        data.push(value)
      })
    }
    if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT) {
      props.depositList?.forEach((value: ClientAggregation) => {
        data.push(value)
      })
    }
    return data.sort((a: ClientAggregation, b: ClientAggregation) => {
      return moment(b.date).isBefore(moment(a.date)) ? -1 : 1
    })
  })

  const isOnlyMonthRecords = computed(() => {
    return [DATE_PICKER_TYPES.DAY, DATE_PICKER_TYPES.MONTH].includes(String(props.typeSelectDate))
  })

  const missingInvoiceByTransactions = computed(() => {
    const now = moment()
    const date = moment(props.date)

    if (isOnlyMonthRecords.value) {
      const currentMonthInvoice = state.invoices.find((invoice) => {
        return moment(invoice.date).isSame(date, 'month')
      })

      if (currentMonthInvoice) {
        return []
      }

      const item: MissingInvoiceTableItem = {
        date: date.format(YYYY_MM_01),
        total_bill: '-',
        due_date: null,
        period_from: date.format(YYYY_MM_01),
        period_to: date.format(YYYY_MM_01),
        invoice_no: '',
        status: 0,
        number_of_deposits: 0,
        deposit_amount: '0',
        deposit_system_usage_fee: '0',
        number_of_withdrawals: 0,
        withdrawal_amount: '0',
        withdrawal_system_usage_fee: '0',
      }

      props.depositList?.forEach((deposit) => {
        item.number_of_deposits = Number(item.number_of_deposits) + Number(deposit.number_trans)
        item.deposit_amount = `${roundUp(+item.deposit_amount) + roundUp(+deposit.amount)}`
      })

      props.withdrawalList?.forEach((withdrawal) => {
        item.number_of_withdrawals = Number(item.number_of_withdrawals) + Number(withdrawal.number_trans)
        item.withdrawal_amount = `${roundUp(+item.withdrawal_amount) + roundUp(+withdrawal.amount)}`
      })

      return [item]
    }

    const existMonths = state.invoices.map((invoice) => moment(invoice.date))

    const missingMonths = MONTH_INDEXES.filter((monthIndex) => {
      const isFound = existMonths.find((existMonth) => existMonth.month() === monthIndex)

      const date = moment(props.date).month(monthIndex)

      const isInFuture = now.isBefore(date, 'month')
      return !isFound && !isInFuture
    })

    const result: MissingInvoiceTableItem[] = []

    missingMonths.forEach((monthIndex) => {
      const date = moment(props.date).month(monthIndex)
      const item: MissingInvoiceTableItem = {
        date: date.format(YYYY_MM_01),
        total_bill: '-',
        invoice_no: '',
        period_from: date.format(YYYY_MM_01),
        period_to: date.format(YYYY_MM_01),
        due_date: null,
        status: 0,
        number_of_deposits: 0,
        deposit_amount: '0',
        deposit_system_usage_fee: '0',
        number_of_withdrawals: 0,
        withdrawal_amount: '0',
        withdrawal_system_usage_fee: '0',
      }

      props.depositList?.forEach((deposit) => {
        const depositMonthIndex = moment(deposit?.date).month()
        if (date.month() === depositMonthIndex) {
          item.number_of_deposits = Number(item.number_of_deposits) + Number(deposit.number_trans)
          item.deposit_amount = `${roundUp(+item.deposit_amount) + roundUp(+deposit.amount)}`
        }
      })

      props.withdrawalList?.forEach((withdrawal) => {
        const withdrawalMonthIndex = moment(withdrawal?.date).month()
        if (date.month() === withdrawalMonthIndex) {
          item.number_of_withdrawals = Number(item.number_of_withdrawals) + Number(withdrawal.number_trans)
          item.withdrawal_amount = `${roundUp(+item.withdrawal_amount) + roundUp(+withdrawal.amount)}`
        }
      })
      result.push(item)
    })

    return result
  })

  const renderedInvoices = computed(() => {
    const result = [...state.invoices, ...missingInvoiceByTransactions.value].sort((invoiceA, invoiceB) => {
      const invoiceADate = moment(invoiceA.date)
      const invoiceBDate = moment(invoiceB.date)
      if (invoiceADate.isBefore(invoiceBDate)) {
        return 1
      }

      if (invoiceADate.isAfter(invoiceBDate)) {
        return -1
      }

      return 0
    })

    if (props.typeSelectDate === DATE_PICKER_TYPES.PERIOD) {
      const startDate = props.dateRange.start ? moment(props.dateRange.start) : moment()
      const endDate = props.dateRange.end ? moment(props.dateRange.end) : moment()
      return result.filter((invoice) => {
        const invoiceDate = moment(invoice.date)
        return invoiceDate.isBetween(startDate, endDate, 'month', '[]')
      })
    }

    return result
  })

  const isAbleToPublish = (date: any) => {
    // 7:00 AM in the first day of next month
    const publishDate = moment(date).add(1, 'month').date(1).hour(7)
    const now = moment()

    return now.isAfter(publishDate)
  }

  const getClientById = async (id: number) => {
    try {
      const { data } = id && (await ClientService.getClientByID(id))
      state.client = data
      state.client.termination_date = data.termination_date === ERROR_DATE ? null : data.termination_date
    } catch (error) {
      console.log(error)
    }
  }

  const getInvoiceByClient = async (params: InvoiceListGetParams) => {
    try {
      const response = await InvoiceService.getInvoiceList(params)
      const invoiceTableItems: InvoiceTableItem[] = []
      response.forEach((invoice) => {
        const deposits = invoice.invoice_details.find((invoiceDetail) => invoiceDetail.type == '1')
        const withdrawal = invoice.invoice_details.find((invoiceDetail) => invoiceDetail.type == '2')

        const invoiceTableItem: InvoiceTableItem = {
          id: invoice.id,
          discount_amount: invoice.discount_amount,
          memo: invoice.memo,
          due_date: invoice.due_date,
          tax_rate: invoice.tax_rate,
          total_tax: invoice.total_tax,
          invoice_no: invoice.invoice_no,
          date: invoice.period_from,
          period_from: invoice.period_from,
          period_to: invoice.period_to,
          total_bill: `${
            roundUp(+invoice.sub_total) - roundUp(+invoice.discount_amount) + roundUp(+invoice.total_tax)
          }`,
          status: invoice.status,
          invoice_details: invoice.invoice_details,
          number_of_deposits: deposits?.number_transaction || '',
          number_of_withdrawals: withdrawal?.number_transaction || '',
          deposit_amount: '0',
          deposit_system_usage_fee: '0',
          withdrawal_amount: '0',
          withdrawal_system_usage_fee: '0',
          count: invoice.count || 0,
        }

        invoice.invoice_details.forEach((detail) => {
          if (detail.type == '1') {
            invoiceTableItem.deposit_amount = `${
              roundUp(invoiceTableItem.deposit_amount) + roundUp(detail.total_amount)
            }`
            invoiceTableItem.deposit_system_usage_fee = detail.system_usage_fee
              ? `${roundUp(+invoiceTableItem.deposit_system_usage_fee) + roundUp(+detail.system_usage_fee)}`
              : '0'
          } else if (detail.type == '2') {
            invoiceTableItem.withdrawal_amount = `${
              roundUp(+invoiceTableItem.withdrawal_amount) + roundUp(+detail.total_amount)
            }`
            invoiceTableItem.withdrawal_system_usage_fee = detail.system_usage_fee
              ? `${roundUp(+invoiceTableItem.withdrawal_system_usage_fee) + roundUp(+detail.system_usage_fee)}`
              : '0'
          }
        })

        invoiceTableItems.push(invoiceTableItem)
      })

      if (isOnlyMonthRecords.value) {
        state.invoices = invoiceTableItems.filter((invoiceItem) => {
          const invoiceItemDate = moment(invoiceItem.date)
          const currentSelectedDate = moment(props.date)

          return invoiceItemDate.isSame(currentSelectedDate, 'month')
        })
      } else {
        state.invoices = invoiceTableItems.filter((invoiceItem) => {
          const invoiceItemDate = moment(invoiceItem.date)
          const currentSelectedDate = moment(props.date)

          return invoiceItemDate.isSame(currentSelectedDate, 'year')
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchData = () => {
    const fromDate = moment(props.date, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss')
    const params = {
      from_date: fromDate,
      to_date: fromDate,
      client_id: props.client_id,
      group_by_date: undefined as undefined | number,
      group_by_month: undefined as undefined | number,
      group_by_year: undefined as undefined | number,
    }

    if (props.typeSelectDate === DATE_PICKER_TYPES.DAY) {
      params.group_by_date = 1
    } else if (props.typeSelectDate === DATE_PICKER_TYPES.MONTH) {
      params.group_by_month = 1
    } else {
      params.group_by_year = 1
    }
    getInvoiceByClient({ ...params, ...{ client_id: props.client_id } })
  }

  watch(
    () => props.client_id,
    () => {
      fetchData()
      const find = props.listClient.find((x: OptionClient) => x.client_id === props.client_id)
      if (find) {
        getClientById(find.id)
      }
    },
    { deep: true, immediate: true },
  )

  watch(
    () => props.date,
    () => {
      fetchData()
    },
    { deep: true },
  )

  watch(
    () => props.typeSelectDate,
    () => {
      fetchData()
    },
  )

  watch(
    () => props.depositList,
    (newValue) => {
      state.deposit_account_balance =
        props.typeSelectDate == DATE_PICKER_TYPES.YEAR
          ? newValue.reverse()[props.depositList.length - 1]?.account_balance
          : newValue[props.depositList.length - 1]?.account_balance
    },
    { immediate: true },
  )

  watch(
    () => props.withdrawalList,
    (newValue) => {
      state.withdrawal_account_balance =
        props.typeSelectDate == DATE_PICKER_TYPES.YEAR
          ? newValue.reverse()[props.withdrawalList.length - 1]?.account_balance
          : newValue[props.withdrawalList.length - 1]?.account_balance
    },
    { immediate: true },
  )

  const handleChangeTypeSearch = (type: string) => {
    emit('update:typeSearch', type)
  }

  const handleSelectRow = (rows: string[], chargeHistory: ChargeHistoryItem) => {
    selectedRow.value = rows
    if (Object.keys(chargeHistory).length > 0) {
      selectedChargeHistory.value = chargeHistory
    } else {
      selectedChargeHistory.value = null
    }
  }

  // const isNow = computed(() => {
  //   if (!selectedRow.value.length) return false
  //   return moment(selectedRow.value[0]).isSame(moment(), 'day') && moment(selectedRow.value[0]).isSame(moment(), 'year')
  // })

  const isDisabledAdd = () => {
    if (selectedChargeHistory.value) {
      return true
    } else {
      return false
    }
  }

  const showModalEditInvoice = (invoice: InvoiceTableItem | MissingInvoiceTableItem) => {
    modalEditInvoice.value?.openModal(invoice, Number(props.client_id))
  }

  const showModalProfile = () => {
    modalViewProfile.value?.openModal()
  }

  const openModalAdd = () => {
    modalAddData.value?.openModal({
      clientData: state.client,
      createDate: selectedRow.value.length ? selectedRow.value[0] : '',
      typeClientAggregation: props.typeSearch,
    })
  }

  const openModalEdit = () => {
    modalAddData.value?.openModal({
      clientData: state.client,
      isEdit: true,
      chargeHistoryItem: selectedChargeHistory.value as any,
    })
  }

  const onClickDelete = async () => {
    const result = await confirm({
      message: `${t('delete_confirm')}`,
      okText: t('delete'),
      cancelText: t('cancel'),
      noDismiss: true,
      noOutsideDismiss: true,
    })

    if (result) {
      deleteChargeHistory(selectedChargeHistory.value?.id as number)
    } else {
      //click cancel, do something else
    }
  }
  const deleteChargeHistory = async (id: number) => {
    try {
      const result = await ChargeHistoryService.deleteChargeHistory(id)
      if (result.status === 200) {
        selectedRow.value = []
        fetchData()
        emit('onDeleteChargeHistory')
        init({ message: t('toast.delete_success'), color: 'success' })
      } else {
        init({ message: (result as any).message, color: 'danger' })
      }
    } catch (error) {
      console.log(error)
    }
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
      client_id: `${props.client_id}`,
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
</script>

<style lang="scss" scoped>
  .table-detail-second {
    overflow: scroll;
    max-height: 450px;
    thead {
      position: sticky;
      top: 0px;
      background-color: #ffffff;
    }
  }
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
