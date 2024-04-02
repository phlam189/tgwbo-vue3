<template>
  <div class="client-charge-history">
    <div>
      <h1 class="page-title">{{ t('menu.client_balance_invoce') }}</h1>
    </div>
    <va-card class="c-mt-30">
      <va-card-content>
        <div class="c-mb-20">
          <h3 class="section-title balance-title">{{ t('cs_balance_invoice.invoice') }}</h3>
          <SelectDatePicker v-model="dateInvoice" :type="DATE_PICKER_TYPES.YEAR" />
        </div>
        <div class="cus-tabel-wrapper">
          <table>
            <thead>
              <tr>
                <th class="c-w-130">{{ t('cs_balance_invoice.date') }}</th>
                <th>{{ t('cs_balance_invoice.number_of_deposits') }}</th>
                <th>{{ t('cs_balance_invoice.deposit_amount') }}</th>
                <th>{{ t('cs_balance_invoice.number_of_withdrawals') }}</th>
                <th>{{ t('cs_balance_invoice.withdrawal_amount') }}</th>
                <th>{{ t('cs_balance_invoice.deposit_system_usage_fee') }}</th>
                <th>{{ t('cs_balance_invoice.withdrawal_system_usage_fee') }}</th>
                <th>{{ t('cs_balance_invoice.total_bill') }}</th>
                <th class="c-w-135">{{ t('cs_balance_invoice.invoice') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoadingInvoice">
                <td colspan="9">
                  <div class="d-flex justify-center">
                    <va-progress-circle size="small" indeterminate />
                  </div>
                </td>
              </tr>
              <template v-else>
                <tr v-if="!renderedInvoices || renderedInvoices.length == 0">
                  <td colspan="9" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
                </tr>
                <template v-else>
                  <tr v-for="(item, index) in renderedInvoices" :key="index">
                    <td class="c-w-140 va-text-left">{{ convertDateString(item.date) }}</td>
                    <td class="va-text-right">{{ formatNumber(item.number_of_deposits) }}</td>
                    <td class="va-text-right">{{ formatCurrency.func(item.deposit_amount) }}</td>
                    <td class="va-text-right">{{ formatNumber(item.number_of_withdrawals) }}</td>
                    <td class="va-text-right">{{ formatCurrency.func(item.withdrawal_amount) }}</td>
                    <td class="va-text-right">{{ formatCurrency.func(item.deposit_system_usage_fee) }}</td>
                    <td class="va-text-right">{{ formatCurrency.func(item.withdrawal_system_usage_fee) }}</td>
                    <td class="va-text-right">
                      {{ formatCurrency.func(item.total_bill) }}
                    </td>
                    <td class="va-text-center">
                      <span v-if="!isAbleToPublish(item.date)" class="fw-500">{{
                        t('cs_balance_invoice.unpublished')
                      }}</span>
                      <template v-else>
                        <span v-if="item.status == 2" class="cus-link-danger fw-500 c-mr-10">
                          {{ t('cs_balance_invoice.corrected') }}
                        </span>
                        <span
                          v-if="item.status >= 1"
                          class="cus-link-primary fw-500 cursor-pointer"
                          @click="openInvoiceDetail(item.id)"
                        >
                          {{ t('cs_balance_invoice.display') }}
                        </span>
                        <span v-if="item.status == 0" class="fw-500">{{ t('cs_balance_invoice.unpublished') }}</span>
                      </template>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </va-card-content>
    </va-card>
    <va-card class="c-mt-30">
      <va-card-content>
        <div class="c-mb-20">
          <h3 class="section-title balance-title">{{ t('cs_balance_invoice.balance_of_payments') }}</h3>
          <SelectDatePicker v-model="date" :type="typeSelectDate" />
        </div>
        <div class="cus-tabel-wrapper">
          <table class="my-table-thead-3-rows">
            <colgroup>
              <col class="c-w-165" />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col class="c-w-120" />
            </colgroup>
            <thead id="cus-thead-3-rows" class="cus-thead-3-rows">
              <tr>
                <th rowspan="3">{{ t('cs_balance_invoice.date') }}</th>
                <th colspan="7">
                  {{ t('cs_balance_invoice.income_and_expenditure_breakdown') }}
                </th>
                <th rowspan="3">{{ t('cs_balance_invoice.balance_of_payments') }}</th>
                <th rowspan="3">{{ t('cs_dashboard.other_charge') }}</th>
                <th rowspan="3">
                  {{ t('cs_balance_invoice.settlement') }} ( {{ t('cs_balance_invoice.withdrawal') }} )
                </th>
                <th rowspan="3">{{ t('cs_balance_invoice.total_account_balance') }}</th>
                <th rowspan="3">{{ t('cs_balance_invoice.memo') }}</th>
              </tr>
              <tr>
                <th colspan="2">{{ t('cs_balance_invoice.payment') }}</th>
                <th colspan="2">{{ t('cs_balance_invoice.withdrawal') }}</th>
                <th>{{ t('cs_balance_invoice.expenses') }}</th>
                <th colspan="2">{{ t('cs_balance_invoice.system_fee') }}</th>
              </tr>
              <tr>
                <th>{{ t('cs_balance_invoice.number_of_deposits') }}</th>
                <th>{{ t('cs_balance_invoice.deposit_amount') }}</th>
                <th>{{ t('cs_balance_invoice.number_of_withdrawals') }}</th>
                <th>{{ t('cs_balance_invoice.withdrawal_amount') }}</th>
                <th>{{ t('cs_balance_invoice.fee_refund_reversal') }}</th>
                <th>{{ t('cs_balance_invoice.payment') }}</th>
                <th>{{ t('cs_balance_invoice.withdrawal') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoadingBalance">
                <td colspan="13">
                  <div class="d-flex justify-center">
                    <va-progress-circle size="small" indeterminate />
                  </div>
                </td>
              </tr>
              <template v-else-if="dataBalance.length > 0">
                <tr v-for="(value, key) in dataBalance" :key="key">
                  <td class="va-text-left">{{ convertDateToString(value.date) }}</td>
                  <td class="va-text-right">{{ formatNumber(value.number_of_deposits) }}</td>
                  <td class="va-text-right">{{ formatCurrency.func(value.deposit_amount) }}</td>
                  <td class="va-text-right">{{ formatNumber(value.number_of_withdrawals) }}</td>
                  <td class="va-text-right">{{ formatCurrency.func(value.withdrawal_amount) }}</td>
                  <td class="va-text-right">{{ formatCurrency.func(value.fee_refund_reversal) }}</td>
                  <td class="va-text-right">{{ formatCurrency.func(value.payment) }}</td>
                  <td class="va-text-right">{{ formatCurrency.func(value.withdrawal) }}</td>
                  <td class="va-text-right">{{ formatCurrency.func(value.balance_of_payments) }}</td>
                  <td class="va-text-right">{{ formatCurrency.func(value.transfer) }}</td>
                  <td class="va-text-right">{{ formatCurrency.func(value.settlement) }}</td>
                  <td class="va-text-right">{{ formatCurrency.func(value.total_account_balance) }}</td>
                  <td
                    v-if="value.memo && value.memo.length > 0"
                    :class="`va-text-left ${value.memo ? 'hover-text__custom' : ''}`"
                  >
                    <div class="row-note">
                      <template v-for="(note, number) in value.memo" :key="number">
                        <div>
                          {{
                            `${
                              note.memo?.length > 15
                                ? `-&nbsp;${note.memo.slice(0, 15)}...`
                                : value.memo.length <= 1
                                ? `${note.memo ? `-${note.memo}` : ''}`
                                : `${note.memo ? `-${note.memo}...` : ''}`
                            }`
                          }}
                        </div>
                      </template>
                    </div>
                    <div
                      v-if="convertMemoText(value.memo)"
                      id="fade"
                      class="tooltip-text"
                      style="word-break: break-word"
                    >
                      <div v-html="convertMemoText(value.memo)"></div>
                    </div>
                  </td>
                  <td v-else></td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="13" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </va-card-content>
    </va-card>

    <InvoiceDetailModal ref="invoiceDetailModalRef" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { HTTP_NO_AUTH } from '../../../common/HTTP-common'
  import { useGlobalStore } from '../../../stores/global-store'
  import momentFormatDate from 'moment/moment'
  import moment from 'moment/moment'
  import SelectDatePicker from '../../../components/select-date-picker/index.vue'
  import InvoiceDetailModal from '../../../components/balance-invoice/InvoiceDetailModal.vue'
  import { convertDateString, convertDateToString, formatCurrency, formatNumber, roundUp } from '../../../common/utils'
  import { DATE_PICKER_TYPES, MONTH_INDEXES, YYYY_MM_01 } from '../../../common/constants'
  import { Invoice, MissingInvoiceTableItem } from '../../../types/Invoice'
  import InvoiceService from '../../../services/InvoiceService'
  import { Transaction, TransactionListParams } from '../../../types/Transaction'
  import TransactionService from '../../../services/TransactionService'
  import { API } from '../../../services/apis/apis'

  const { t } = useI18n()
  const GlobalStore = useGlobalStore()
  const typeSelectDate = ref(DATE_PICKER_TYPES.MONTH)
  const date = ref(new Date())
  const dateInvoice = ref(new Date())
  const invoiceDetailModalRef = ref<InstanceType<typeof InvoiceDetailModal>>()

  const invoices = ref<Invoice[]>([])
  const dataInvoices = ref<any[]>([])
  const dataBalance = ref<any[]>([])
  const depositTransactions = ref<Transaction<1>[]>([])
  const withdrawalTransactions = ref<Transaction<2>[]>([])

  const isLoadingInvoice = ref(false)
  const isLoadingBalance = ref(false)

  onMounted(async () => {
    await getClientTransactionsInMonth(GlobalStore.$state.clientId)
    getInvoiceList().finally(() => {
      isLoadingInvoice.value = false
    })
    getBalanceList().finally(() => {
      isLoadingBalance.value = false
    })
  })

  const openInvoiceDetail = (invoiceId: number) => {
    const invoice = invoices.value.find((invoice) => invoice.id === invoiceId)

    if (invoice) {
      invoiceDetailModalRef.value?.openModal(invoice, Number(GlobalStore.clientId))
    }
  }

  const isAbleToPublish = (date: any) => {
    // 7:00 AM in the first day of next month
    const publishDate = moment(date).add(1, 'month').date(1).hour(7)
    const now = moment()

    return now.isAfter(publishDate)
  }

  watch(
    () => date.value,
    () => {
      getBalanceList()
    },
  )

  watch(
    () => dateInvoice.value,
    async () => {
      dataInvoices.value = []
      depositTransactions.value = []
      withdrawalTransactions.value = []
      isLoadingInvoice.value = true
      await getClientTransactionsInMonth(GlobalStore.$state.clientId)
      getInvoiceList().finally(() => {
        isLoadingInvoice.value = false
      })
    },
  )

  const getBalanceList = async () => {
    isLoadingBalance.value = true
    dataBalance.value = []

    const clientId = GlobalStore.$state.clientId
    const fromDate = momentFormatDate(date.value).startOf('month').format('YYYY-MM-DD HH:mm:ss')
    const toDate = momentFormatDate(date.value).endOf('month').format('YYYY-MM-DD HH:mm:ss')
    const urlTransaction = `/transactions?group_by_month=1&client_id=${clientId}&from_date=${fromDate}&to_date=${toDate}`
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    await HTTP_NO_AUTH.get(urlTransaction)
      .then((res) => {
        const deposit = res.data.deposit
        const withdrawals = res.data.withdrawals
        const tmpDeposit = deposit[clientId]
        const tmpWithdrawals = withdrawals[clientId]
        const tmpObj = {} as any
        if (tmpDeposit && tmpDeposit.length > 0) {
          for (let i = 0; i < tmpDeposit.length; i++) {
            tmpObj[tmpDeposit[i].date] = {
              date: tmpDeposit[i].date,
              number_of_deposits: tmpDeposit[i].number_trans,
              deposit_amount: tmpDeposit[i].amount,
              number_of_withdrawals: '0',
              withdrawal_amount: '0',
              fee_refund_reversal:
                roundUp(+tmpDeposit[i].refund_fee || 0) +
                roundUp(+tmpDeposit[i].settlement_fee || 0) +
                roundUp(+tmpDeposit[i].transfer_fee || 0),
              payment: tmpDeposit[i].system_usage_fee,
              withdrawal: '0',
              balance_of_payments: '0',
              transfer: 0,
              settlement: '0',
              total_account_balance: +tmpDeposit[i].account_balance,
              memo: tmpDeposit[i].charge_history,
            }
          }
        }
        const keys = Object.keys(tmpObj)
        const newData = [] as any[]
        keys.forEach((key) => {
          newData.push(tmpObj[key])
        })
        if (tmpWithdrawals && tmpWithdrawals.length > 0) {
          for (let i = 0; i < tmpWithdrawals.length; i++) {
            const index = newData.findIndex((item) => item.date === tmpWithdrawals[i].date)
            if (index !== -1) {
              newData[index].number_of_withdrawals = tmpWithdrawals[i].number_trans
              newData[index].withdrawal_amount = tmpWithdrawals[i].amount
              newData[index].withdrawal = tmpWithdrawals[i].system_usage_fee
              newData[index].settlement = tmpWithdrawals[i].settlement_amount
              newData[index].total_account_balance += roundUp(+tmpWithdrawals[i].account_balance)
              newData[index].fee_refund_reversal +=
                roundUp(+tmpWithdrawals[i].refund_fee || 0) +
                roundUp(+tmpWithdrawals[i].settlement_fee || 0) +
                roundUp(+tmpWithdrawals[i].charge_fee || 0) +
                roundUp(+tmpWithdrawals[i].dewi_fee || 0)
              newData[index].memo = [...tmpWithdrawals[i].charge_history, ...newData[index].memo]
              newData[index].transfer = tmpWithdrawals[i].charge_amount
            } else {
              newData.push({
                date: tmpWithdrawals[i].date,
                number_of_deposits: '0',
                deposit_amount: '0',
                number_of_withdrawals: tmpWithdrawals[i].number_trans,
                withdrawal_amount: tmpWithdrawals[i].amount,
                fee_refund_reversal:
                  roundUp(+tmpWithdrawals[i].refund_fee || 0) +
                  roundUp(+tmpWithdrawals[i].settlement_fee || 0) +
                  roundUp(+tmpWithdrawals[i].charge_fee || 0) +
                  roundUp(+tmpWithdrawals[i].dewi_fee || 0),
                payment: '0',
                withdrawal: tmpWithdrawals[i].system_usage_fee,
                balance_of_payments: '0',
                transfer: tmpWithdrawals[i].charge_amount,
                settlement: tmpWithdrawals[i].settlement_amount,
                total_account_balance: +tmpWithdrawals[i].account_balance,
                memo: tmpWithdrawals[i].charge_history,
              })
            }
          }
        }
        dataBalance.value = newData.sort((a, b) => {
          return new Date(b.date).getDate() - new Date(a.date).getDate()
        })
        dataBalance.value.forEach(
          (item) =>
            (item.balance_of_payments =
              roundUp(+item.deposit_amount) -
              roundUp(+item.withdrawal_amount) -
              roundUp(+item.fee_refund_reversal) -
              roundUp(+item.payment) -
              roundUp(+item.withdrawal)),
        )
      })
      .finally(() => {
        isLoadingBalance.value = false
      })
  }

  const getInvoiceList = async () => {
    isLoadingInvoice.value = true
    const clientId = GlobalStore.clientId
    await InvoiceService.getInvoiceList({ client_id: clientId }).then((response) => {
      invoices.value = response ? response : []
      if (Array.isArray(response) && response.length > 0) {
        const tmpResponse = response
        const tmpObjFilterResult = []
        for (let i = 0; i < tmpResponse.length; i++) {
          const tmpObj = {
            id: tmpResponse[i].id,
            date: tmpResponse[i].period_from,
            total_bill: 0,
            deposit_system_usage_fee: 0,
            withdrawal_system_usage_fee: 0,
            number_of_deposits: 0,
            deposit_amount: 0,
            number_of_withdrawals: 0,
            withdrawal_amount: 0,
            status: tmpResponse[i].status,
            invoice_url: '',
            invoice_no: tmpResponse[i].invoice_no,
            period_from: tmpResponse[i].period_from,
            period_to: tmpResponse[i].period_to,
            sub_total: Number(tmpResponse[i].sub_total),
            total_tax: Number(tmpResponse[i].total_tax),
            discount_amount: Number(tmpResponse[i].discount_amount),
          }
          let clientDetails = tmpResponse[i].invoice_details
          if (Array.isArray(clientDetails) && clientDetails.length > 0) {
            for (let j = 0; j < clientDetails.length; j++) {
              let numberTransaction = clientDetails[j].number_transaction
              let depositAmount = Number(clientDetails[j].total_amount)
              let systemUsageFee = Number(clientDetails[j].system_usage_fee)
              if (Number(clientDetails[j].type) == 1) {
                //deposits: Number of deposits,Deposit amount
                tmpObj.number_of_deposits = Number(numberTransaction)
                tmpObj.deposit_amount = roundUp(tmpObj.deposit_amount) + roundUp(depositAmount)
                tmpObj.deposit_system_usage_fee = roundUp(tmpObj.deposit_system_usage_fee) + roundUp(systemUsageFee)
              } else if (Number(clientDetails[j].type) == 2) {
                // withdrawals: Number of withdrawals,Withdrawal amount
                tmpObj.number_of_withdrawals = Number(numberTransaction)
                tmpObj.withdrawal_amount = roundUp(tmpObj.withdrawal_amount) + roundUp(depositAmount)
                tmpObj.withdrawal_system_usage_fee =
                  roundUp(tmpObj.withdrawal_system_usage_fee) + roundUp(systemUsageFee)
              }
            }
          }
          tmpObjFilterResult.push(tmpObj)
        }
        dataInvoices.value = tmpObjFilterResult
        dataInvoices.value.forEach(
          (item) =>
            (item.total_bill = roundUp(item.sub_total) - roundUp(item.discount_amount) + roundUp(item.total_tax)),
        )
        dataInvoices.value = dataInvoices.value.filter((invoiceItem) => {
          const invoiceItemDate = moment(invoiceItem.date)
          const currentSelectedDate = moment(dateInvoice.value)

          return invoiceItemDate.isSame(currentSelectedDate, 'year')
        })
      }
    })
  }

  // get all transactions of client
  const getClientTransactionsInMonth = async (clientId: any) => {
    const fromDate = momentFormatDate(dateInvoice.value).startOf('year').format('YYYY-MM-DD HH:mm:ss')
    const toDate = momentFormatDate(dateInvoice.value).endOf('year').format('YYYY-MM-DD HH:mm:ss')
    const transactionListParams: TransactionListParams = {
      from_date: fromDate,
      to_date: toDate,
      client_id: clientId,
      group_by_month: 1,
      is_sum: 1,
    }

    try {
      const response = await TransactionService.getTransactions(transactionListParams)
      depositTransactions.value = response.deposit[clientId]
      withdrawalTransactions.value = response.withdrawals[clientId]
    } catch (err) {
      console.log({ err })
    }
  }

  const missingInvoiceByTransactions = computed(() => {
    const now = moment()

    const existMonths = dataInvoices.value.map((invoice) => moment(invoice.date))

    const missingMonths = MONTH_INDEXES.filter((monthIndex) => {
      const isFound = existMonths.find((existMonth) => existMonth.month() === monthIndex)

      const date = moment(dateInvoice.value).month(monthIndex)

      const isInFuture = now.isBefore(date, 'month')
      return !isFound && !isInFuture
    })

    const result: MissingInvoiceTableItem[] = []

    missingMonths.forEach((monthIndex) => {
      const date = moment(dateInvoice.value).month(monthIndex)
      const item: MissingInvoiceTableItem = {
        date: date.format(YYYY_MM_01),
        total_bill: '-',
        invoice_no: '',
        due_date: null,
        period_from: date.format(YYYY_MM_01),
        period_to: date.format(YYYY_MM_01),
        status: 0,
        number_of_deposits: 0,
        deposit_amount: '0',
        deposit_system_usage_fee: '0',
        number_of_withdrawals: 0,
        withdrawal_amount: '0',
        withdrawal_system_usage_fee: '0',
      }

      depositTransactions.value?.forEach((deposit) => {
        const depositMonthIndex = moment(deposit?.date).month()
        if (date.month() === depositMonthIndex) {
          item.number_of_deposits = Number(item.number_of_deposits) + Number(deposit.number_trans)
          item.deposit_amount = `${Number(item.deposit_amount) + Number(deposit.amount)}`
        }
      })

      withdrawalTransactions.value?.forEach((withdrawal) => {
        const withdrawalMonthIndex = moment(withdrawal?.date).month()
        if (date.month() === withdrawalMonthIndex) {
          item.number_of_withdrawals = Number(item.number_of_withdrawals) + Number(withdrawal.number_trans)
          item.withdrawal_amount = `${Number(item.withdrawal_amount) + Number(withdrawal.amount)}`
        }
      })
      result.push(item)
    })

    return result
  })

  const renderedInvoices = computed(() => {
    const result = [...dataInvoices.value, ...missingInvoiceByTransactions.value].sort((invoiceA, invoiceB) => {
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

    return result
  })

  const convertMemoText = (value: Array<any>) => {
    return value
      .filter((item) => item.memo)
      .map((item) => `<div>-&nbsp;${item.memo}</div>`)
      .join('')
  }
</script>

<style lang="scss" scoped>
  .va-card {
    .va-card__content {
      table.my-table-thead-3-rows {
        border-collapse: collapse;
        tr {
          position: relative;
        }
        thead {
          tr:last-child {
            th {
              //border-bottom: 1px solid #06152b;
              border-bottom: none;
            }
          }
          th {
            border-right: 1px solid #cccccc;
            vertical-align: middle;
          }

          tr:nth-child(2),
          tr:nth-child(1) {
            border-bottom: 1px solid #ccc;
          }
          tr:nth-child(2) td:last-child {
            border-right: 1px solid #ccc;
          }
          tr:first-child th:last-child {
            border-right: none;
          }
          border-bottom: 1px solid #06152b;
        }
      }

      tbody {
        td {
          vertical-align: middle;
        }
        .row-note {
          height: 17px;
        }
      }

      .balance-title {
        display: inline-block;
      }
    }
  }

  .hover-text__custom {
    &:hover #fade {
      display: block;
    }
    .tooltip-text {
      z-index: 2;
      right: 25px;
      bottom: 40px;
      color: #788b9a;
      font-size: 12px;
      overflow-y: auto;
      max-width: 240px;
      max-height: 500px;
      position: absolute;
      border-radius: 10px;
      background-color: #ffffff;
      padding: 10px 15px 10px 15px;
      box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
    }

    #fade {
      display: none;
    }
  }
</style>
