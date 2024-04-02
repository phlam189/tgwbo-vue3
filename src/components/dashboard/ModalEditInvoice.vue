<template>
  <va-modal :key="refresh" v-model="open" size="large" no-outside-dismiss hide-default-actions no-esc-dismiss>
    <div class="c-mx-30 modal-edit-invoice">
      <div class="c-mt-8 d-flex-between">
        <div>
          <div class="title-modal">REPORT</div>
          <div class="title-modal-2">{{ contractorInfo?.company_name }}</div>
        </div>
        <div class="text-content-right">
          <p>{{ contractorInfo?.address }}</p>
          <p>{{ contractorInfo?.email }}</p>
          <p>{{ contractorInfo?.manager }}</p>
        </div>
      </div>

      <div class="c-mt-28 hr-custom c-mb-15"></div>
      <div class="d-flex-between">
        <div>
          <div class="text-title">BILL TO:</div>
          <div class="text-sub-title c-mt-7">{{ clientInfo?.company_name }}</div>
          <div class="text-address c-w-340 c-mt-5">{{ clientInfo?.address }}</div>
          <div class="text-address">{{ clientInfo?.email }}</div>
        </div>
        <div>
          <div class="d-flex gap-5 c-mt-20" style="align-items: center">
            <div class="text-label c-w-90">Invoice Date:</div>
            <va-input :model-value="currentInvoiceDate" disabled class="cus-input" placeholder="2023.02.01" />
          </div>
          <div class="d-flex gap-5 c-mt-5" style="align-items: center">
            <div class="text-label c-w-90">Due Date:</div>
            <SelectDatePicker
              v-model="currentInvoiceDueDate"
              class="cus-input w-full"
              placeholder="YYYY/MM/DD"
              :is-input="true"
              placement="left"
              :disabled-cus="currentInvoiceDate"
            />
          </div>
          <div class="d-flex gap-5 c-mt-5" style="align-items: center">
            <div class="text-label c-w-90">Invoice No:</div>
            <va-input :model-value="currentInvoiceNo" disabled class="cus-input" placeholder="US20230201" />
          </div>
        </div>
      </div>
      <div class="hr c-mt-24 c-mb-8"></div>
      <!-- table -->
      <div class="d-flex-end">
        <div class="d-flex gap-2">
          <div class="text-label">Period：</div>
          <div style="color: #435564">{{ invoicePeriod }}</div>
        </div>
      </div>

      <div class="cus-tabel-wrapper">
        <table>
          <colgroup>
            <col width="145px" />
            <col width="90px" />
            <col width="90px" />
            <col width="130px" />
            <col />
          </colgroup>
          <!-- Header table -->
          <thead>
            <tr>
              <th class="text-center">DESCRIPTION</th>
              <th class="text-center">RATE</th>
              <th class="text-center">QTY</th>
              <th class="text-center">UNIT PRICE</th>
              <th class="text-center">TOTAL</th>
            </tr>
          </thead>
          <!-- Body table -->
          <tbody>
            <tr
              v-if="
                depositContractsSorted.length === 1 ||
                (depositAggregation.contracts.length === 1 &&
                  withdrawalAggregation.contracts[0]?.rate == depositAggregation.contracts[0]?.rate) ||
                depositAggregation.amount == 0
              "
            >
              <td>【Deposit】</td>
              <td class="text-right">{{ Number(depositContractsSorted[0]?.contract_rate || 0) }}%</td>
              <td class="text-right">{{ formatNumber(depositAggregation.numberTransfers) }}</td>
              <td class="text-right">{{ formatCurrency.func(depositAggregation.amount) }}</td>
              <td class="text-right">
                {{
                  formatCurrency.func(
                    (depositAggregation.amount * Number(depositContractsSorted[0]?.contract_rate) || 0) / 100,
                  )
                }}
              </td>
            </tr>
            <template v-else>
              <tr>
                <td>【Deposit】</td>
                <td class="text-right">-</td>
                <td class="text-right">{{ formatNumber(depositAggregation.numberTransfers) }}</td>
                <td class="text-right">{{ formatCurrency.func(depositAggregation.amount) }}</td>
                <td class="text-right">-</td>
              </tr>
              <tr v-for="contract in depositAggregation.contracts" :key="contract.id">
                <td>
                  <va-input
                    v-model="contract.description"
                    :placeholder="t('placeholder_input_text')"
                    class="cus-input"
                    maxlength="20"
                  />
                </td>
                <td class="text-right">{{ Number(contract.rate) }}%</td>
                <td class="text-right"></td>
                <td class="text-right">{{ formatCurrency.func(contract.amount) }}</td>
                <td class="text-right">{{ formatCurrency.func(contract.system_usage_fee) }}</td>
              </tr>
            </template>

            <tr
              v-if="
                withdrawalContractsSorted.length === 1 ||
                (withdrawalAggregation.contracts.length === 1 &&
                  withdrawalAggregation.contracts[0].rate == depositAggregation.contracts[0].rate) ||
                withdrawalAggregation.amount == 0
              "
            >
              <td>【Withdrawal】</td>
              <td class="text-right">{{ Number(withdrawalContractsSorted[0]?.contract_rate || 0) }}%</td>
              <td class="text-right">{{ formatNumber(withdrawalAggregation.numberTransfers) }}</td>
              <td class="text-right">{{ formatCurrency.func(withdrawalAggregation.amount) }}</td>
              <td class="text-right">
                {{
                  formatCurrency.func(
                    (withdrawalAggregation.amount * Number(withdrawalContractsSorted[0]?.contract_rate || 0)) / 100,
                  )
                }}
              </td>
            </tr>
            <template v-else>
              <tr>
                <td>【Withdrawal】</td>
                <td class="text-right">-</td>
                <td class="text-right">{{ formatNumber(withdrawalAggregation.numberTransfers) }}</td>
                <td class="text-right">{{ formatCurrency.func(withdrawalAggregation.amount) }}</td>
                <td class="text-right">-</td>
              </tr>
              <tr v-for="contract in withdrawalAggregation.contracts" :key="contract.id">
                <td>
                  <va-input
                    v-model="contract.description"
                    :placeholder="t('placeholder_input_text')"
                    class="cus-input"
                    maxlength="20"
                  />
                </td>
                <td class="text-right">{{ Number(contract.rate) }}%</td>
                <td class="text-right"></td>
                <td class="text-right">{{ formatCurrency.func(contract.amount) }}</td>
                <td class="text-right">{{ formatCurrency.func(contract.system_usage_fee) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div v-for="(customExpense, index) in customExpenses" :key="index" class="custom-expenses">
        <div class="custom-expenses-description">
          <va-input
            v-model="customExpense.description"
            maxlength="20"
            :placeholder="t('placeholder_input_text')"
            class="cus-input"
          />
        </div>
        <div class="custom-expenses-rate">
          <va-input
            v-model="customExpense.rate"
            type="number"
            step="0.1"
            min="0"
            placeholder="Rate"
            class="cus-input-small"
            input-class="va-text-right"
            @keydown="preventInvalidKeys($event, ['e'])"
          />
        </div>
        <div class="custom-expenses-number-transaction">
          <va-input
            v-model="customExpense.number_transaction"
            type="number"
            min="0"
            placeholder="QTY"
            class="cus-input-small"
            input-class="va-text-right"
            @keydown="preventInvalidKeys($event, ['e'])"
          />
        </div>
        <div class="custom-expenses-amount">
          <va-input
            v-model="customExpense.amount"
            type="number"
            min="0"
            placeholder="Unit Price"
            class="cus-input"
            input-class="va-text-right"
            @keydown="preventInvalidKeys($event, ['e'])"
          />
        </div>
        <div class="custom-expenses-total-amount">
          {{ formatCurrency.func((Number(customExpense.amount) * Number(customExpense.rate)) / 100) }}
        </div>
        <div v-if="!customExpense.id" class="custom-expenses-delete" @click="deleteExpense(index)">
          <va-icon name="fa-solid fa-circle-minus" class="icon" />
        </div>
      </div>
      <p v-if="isError" style="font-size: small; padding-left: 7px">
        <span class="error-msg" style="color: red">{{ t('message_error.please_enter_all') }}</span>
      </p>
      <div class="custom-expenses-button" @click="addCustomExpense">
        <va-icon name="fa-solid fa-circle-plus" class="icon" />
        他項目を追加
      </div>

      <!-- input -->
      <div class="d-flex-end">
        <div>
          <div class="d-flex gap-5 c-mt-20" style="align-items: center">
            <div class="c-w-224 text-right" style="font-weight: 700">SUBTOTAL :</div>
            <va-input :model-value="formatNumber(invoiceSubtotal)" class="cus-input" input-class="va-text-right">
              <template #prependInner>
                <span style="color: #788b9a">¥</span>
              </template>
            </va-input>
          </div>
          <div class="d-flex gap-5 c-mt-5" style="align-items: center">
            <div class="c-w-224 text-right" style="font-weight: 700">DISCOUNT :</div>
            <va-input v-model="invoiceDiscount" mask="numeral" class="cus-input" input-class="va-text-right">
              <template #prependInner>
                <span style="color: #788b9a">¥</span>
              </template>
            </va-input>
          </div>
          <p v-for="error of v$.invoiceDiscount.$errors" :key="error.$uid" style="text-align: right; font-size: small">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
          <div class="d-flex gap-5 c-mt-5" style="align-items: center">
            <div class="c-w-224 text-right" style="font-weight: 700">SUBTOTAL LESS DISCOUNT :</div>
            <va-input
              :model-value="formatNumber(invoiceSubtotalLessDiscount)"
              class="cus-input"
              input-class="va-text-right"
              disabled
            >
              <template #prependInner>
                <span style="color: #788b9a">¥</span>
              </template>
            </va-input>
          </div>
          <div class="d-flex gap-5 c-mt-5" style="align-items: center">
            <div class="c-w-224 text-right" style="font-weight: 700">TAX RATE :</div>
            <va-input v-model="invoiceTaxRate" mask="numeral" class="cus-input" input-class="va-text-right">
              <template #prependInner>
                <span style="color: #788b9a">%</span>
              </template>
            </va-input>
          </div>
          <div class="d-flex gap-5 c-mt-5" style="align-items: center">
            <div class="c-w-224 text-right" style="font-weight: 700">TOTAL TAX :</div>
            <va-input
              :model-value="formatNumber(invoiceTotalTax)"
              class="cus-input"
              input-class="va-text-right"
              disabled
            >
              <template #prependInner>
                <span style="color: #788b9a">¥</span>
              </template>
            </va-input>
          </div>
        </div>
      </div>
      <!-- total -->
      <div class="d-flex-end c-mt-10 c-mb-5">
        <div class="d-flex gap-6" style="align-items: end">
          <div class="c-mb-4" style="font-weight: 700; color: #1c78dd">Balance Due :</div>
          <div>
            <span class="text-total">¥</span>
            <span class="text-total">{{ formatNumber(invoiceBalanceDue) }}</span>
          </div>
        </div>
      </div>

      <div style="font-weight: 500">Thank you for your business!</div>
      <div class="c-mt-5 c-mb-5" style="font-weight: 500">Terms & Instructions:</div>
      <va-input v-model="invoiceNote" type="textarea" />
      <div class="d-flex-between c-mt-20 c-mb-10">
        <div class="d-flex gap-3">
          <va-button class="button-cancel c-w-120" @click="closeModal">{{ t('modal.cancel') }}</va-button>
          <va-button
            v-if="!currentInvoice || currentInvoice.status == 0"
            preset="secondary"
            color="#1C78DD"
            border-color="#1C78DD"
            class="c-w-120"
            :disabled="isDisabledButton"
            @click="createInvoice(true)"
          >
            {{ t('save') }}
          </va-button>
        </div>
        <va-button :disabled="isDisabledButton" class="button-create c-w-92" @click="createInvoice(false)">{{
          t('confirm')
        }}</va-button>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, computed, watch, defineAsyncComponent } from 'vue'
  import { useI18n } from 'vue-i18n'
  import moment from 'moment'
  import {
    InvoiceAggregation,
    InvoiceDetailCreateParams,
    InvoiceTableItem,
    MissingInvoiceTableItem,
  } from '../../types/Invoice'
  import {
    DEPOSIT_AND_WITHDRAWAL_CODE,
    MM_DD_SLASH,
    YYYY_MM_DD_HH_MM_SS,
    YYYY_MM_DD_SLASH,
    YYYY_MM_DD,
    YYYYMMDD,
    ERROR_CODE,
  } from '../../common/constants'
  import ClientService from '../../services/ClientService'
  import TransactionService from '../../services/TransactionService'
  import { TransactionListParams, Transaction } from '../../types/Transaction'
  import { ClientDetailItem, Client } from '../../types/Client'
  import { formatCurrency, formatNumber, roundUp } from '../../common/utils'
  import ContractorService from '../../services/ContractorService'
  import { Contractor } from '../../types/Contractor'
  import InvoiceService from '../../services/InvoiceService'
  import { InvoiceCustomExpense } from '../../types/Invoice'
  import { useModal, useToast } from 'vuestic-ui'
  import { helpers } from '@vuelidate/validators'
  import useValidate from '@vuelidate/core'
  import { useGlobalStore } from '../../stores/global-store'

  const SelectDatePicker = defineAsyncComponent(() => import('../../components/select-date-picker/index.vue'))

  const emit = defineEmits<{
    (e: 'success'): void
  }>()

  const { t } = useI18n()
  const { init } = useToast()
  const { confirm } = useModal()

  const open = ref<boolean>(false)
  const refresh = ref(0)
  const isError = ref(false)
  const clientInfo = ref<Client | null>(null)
  const contractorInfo = ref<Contractor | null>(null)
  const currentInvoice = ref<InvoiceTableItem | MissingInvoiceTableItem | null>(null)
  const depositContractsSorted = ref<ClientDetailItem[]>([])
  const withdrawalContractsSorted = ref<ClientDetailItem[]>([])
  const depositTransactions = ref<Transaction<1>[]>([])
  const withdrawalTransactions = ref<Transaction<2>[]>([])

  const invoiceClientId = ref<number | null>()

  const currentInvoiceNo = ref('')
  const globalStore = useGlobalStore()
  const currentInvoiceDueDate = ref<string | null>()
  const invoiceDiscount = ref('')
  const invoiceTaxRate = ref('')
  const invoiceNote = ref('')
  const customExpenses = ref([] as InvoiceCustomExpense[])
  const linkPDF = ref('')
  // const invoiceSubtotal = ref(0)
  // const invoiceTotalTax = ref(0)
  // const invoiceBalanceDue = ref(0)
  // const invoiceSubtotalLessDiscount = ref(0)

  const depositAggregation = ref<InvoiceAggregation>({
    amount: 0,
    amountWithRate: 0,
    numberTransfers: 0,
    contracts: [],
  })

  const withdrawalAggregation = ref<InvoiceAggregation>({
    amount: 0,
    amountWithRate: 0,
    numberTransfers: 0,
    contracts: [],
  })

  const rules = computed(() => {
    const Message = (i18nOptions: any, message: string) => t(`${message}`, i18nOptions)
    return {
      invoiceDiscount: {
        custom: helpers.withMessage(
          () => Message(null, 'message_error.discount_subtotal'),
          (value) => {
            if (Number(value) <= Number(invoiceSubtotal.value)) {
              return true
            } else {
              return false
            }
          },
        ),
      },
    }
  })
  var v$ = useValidate(rules, { invoiceDiscount })

  watch(
    () => invoiceDiscount,
    () => {
      v$.value.$validate()
    },
    { deep: true },
  )

  watch(
    () => customExpenses.value,
    () => {
      customExpenses.value?.forEach((item) => {
        isError.value = item.amount === '' || item.number_transaction === '' || item.rate === '' ? true : false
      })
    },
    { deep: true },
  )

  const isDisabledButton = computed(() => {
    if (
      !invoiceClientId.value ||
      !contractorInfo.value ||
      !currentInvoice.value ||
      !currentInvoiceDueDate.value ||
      !invoiceDiscount.value ||
      !invoiceTaxRate.value ||
      isError.value ||
      v$.value.$error
    ) {
      return true
    }
    return false
  })

  const invoicePeriod = computed(() => {
    const startDate = moment(currentInvoice.value?.period_from).format(YYYY_MM_DD_SLASH)
    const endDate = moment(currentInvoice.value?.period_to).endOf('month').format(MM_DD_SLASH)

    return `${startDate}～${endDate}`
  })

  // const calDataResponse = () => {
  //   const depositTotal = depositAggregation.value.amountWithRate || 0
  //   const withdrawalTotal = withdrawalAggregation.value.amountWithRate || 0
  //   const customExpensesTotal = customExpenses.value.reduce((total, item) => {
  //     return total + (Number(item.amount) * Number(item.rate)) / 100
  //   }, 0)
  //   invoiceSubtotal.value = depositTotal + withdrawalTotal + customExpensesTotal
  //   invoiceSubtotalLessDiscount.value = Number(invoiceSubtotal.value) - Number(invoiceDiscount.value)
  //   invoiceTotalTax.value = (invoiceSubtotalLessDiscount.value * Number(invoiceTaxRate.value)) / 100
  //   invoiceBalanceDue.value = invoiceSubtotalLessDiscount.value + invoiceTotalTax.value
  // }

  const invoiceSubtotal = computed(() => {
    const depositTotal = roundUp(depositAggregation.value.amountWithRate) || 0
    const withdrawalTotal = roundUp(withdrawalAggregation.value.amountWithRate) || 0
    const customExpensesTotal = customExpenses.value.reduce((total, item) => {
      return total + (Number(item.amount) * Number(item.rate)) / 100
    }, 0)

    return depositTotal + withdrawalTotal + roundUp(customExpensesTotal)
  })

  const invoiceSubtotalLessDiscount = computed(() => {
    return roundUp(invoiceSubtotal.value) - roundUp(invoiceDiscount.value)
  })

  const invoiceTotalTax = computed(() => {
    return (invoiceSubtotalLessDiscount.value * Number(invoiceTaxRate.value)) / 100
  })

  const invoiceBalanceDue = computed(() => {
    return invoiceSubtotalLessDiscount.value + roundUp(invoiceTotalTax.value)
  })

  const currentInvoiceDate = computed(() => {
    return moment(currentInvoice.value?.date).add(1, 'M').format(YYYY_MM_DD)
  })

  const addCustomExpense = () => {
    customExpenses.value.push({
      type: '',
      description: '',
      rate: '',
      number_transaction: '',
      amount: '',
    })
  }

  const deleteExpense = (index: number) => {
    customExpenses.value = customExpenses.value.filter((_, idx) => idx !== index)
    if (customExpenses.value.length === 0) return (isError.value = false)
  }

  const generateTransactionAggregation = function <T>(
    transactions: Transaction<T>[],
    contracts: ClientDetailItem[],
    type: number,
  ) {
    const result: InvoiceAggregation = {
      amount: 0,
      numberTransfers: 0,
      contracts: [],
      amountWithRate: 0,
    }

    if (transactions) {
      transactions.forEach((transaction) => {
        result.amount += Number(transaction.amount)
        result.numberTransfers += Number(transaction.number_trans)
      })
    }

    let amount = result.amount
    const contractLength = contracts.length
    if (currentInvoice.value && currentInvoice.value.id && currentInvoice.value.invoice_details) {
      const data = currentInvoice.value.invoice_details
      const newArr = data
        .filter((item) => Number(item.type) === type)
        .map((x) => {
          return {
            id: x.id,
            rate: Number(x.rate),
            amount: Number(x.total_amount),
            description: x.description,
            system_usage_fee: Number(x.system_usage_fee),
          }
        })
      result.contracts.push(...newArr)
    } else {
      for (let i = 0; i < contractLength; i++) {
        const previousContract = contracts[i - 1]
        const contract = contracts[i]
        if (contract.max_amount >= amount) {
          result.contracts.push({
            id: contract.id,
            rate: Number(contract.contract_rate),
            amount,
            description: contract.description,
            system_usage_fee: 0,
          })
          break
        } else {
          let contractAmount = 0

          if (contract.max_amount === 0) {
            // last contract
            contractAmount = amount
          } else if (!previousContract) {
            // first contract
            contractAmount = contract.max_amount
          } else {
            // rest contracts
            contractAmount = contract.max_amount - (previousContract?.max_amount || 0)
          }

          amount -= contractAmount

          result.contracts.push({
            id: contract.id,
            rate: Number(contract.contract_rate),
            amount: contractAmount,
            description: contract.description,
            system_usage_fee: (Number(contract.contract_rate) / 100) * contractAmount,
          })
        }
      }
    }

    const aggregationContractLength = result.contracts.length
    if (aggregationContractLength === 1) {
      result.amountWithRate = (result.amount * result.contracts[0].rate) / 100
    } else {
      for (let i = 0; i < aggregationContractLength; i++) {
        const contract = result.contracts[i]
        result.amountWithRate += (contract.amount * contract.rate) / 100
      }
    }

    return result
  }

  const openModal = async (invoice: InvoiceTableItem, clientId: number) => {
    invoiceClientId.value = clientId
    currentInvoice.value = invoice
    invoiceDiscount.value = invoice.discount_amount ? `${Number(invoice.discount_amount)}` : '0'
    invoiceTaxRate.value = invoice.tax_rate ? Number(invoice.tax_rate).toString() : '0'
    invoiceNote.value = invoice.memo || ''
    currentInvoiceDueDate.value = invoice.id ? getDueDate(invoice) : (null as any)

    currentInvoice.value?.invoice_details?.forEach((item) => {
      if (item && Number(item.type) === 3) {
        customExpenses.value = [
          ...customExpenses.value,
          {
            id: item.id,
            type: item.type,
            description: item.description,
            rate: Number(item.rate).toString(),
            number_transaction: `${item.number_transaction}`,
            amount: roundUp(item.total_amount).toString(),
          },
        ]
      }
    })

    if ((invoice as InvoiceTableItem).invoice_no) {
      currentInvoiceNo.value = (invoice as InvoiceTableItem).invoice_no
    }

    await Promise.allSettled([getClient(clientId), getClientTransactionsInMonth(clientId, invoice.date)])

    if (clientInfo.value) {
      await getClientDetail(clientId)
      await getContractorById(clientInfo.value.contractor_id)
    }

    // calDataResponse()
    open.value = true
  }

  const resetForm = () => {
    currentInvoiceNo.value = ''
    currentInvoiceDueDate.value = ''
    invoiceDiscount.value = ''
    invoiceTaxRate.value = ''
    invoiceNote.value = ''
    customExpenses.value = []
  }

  const closeModal = async () => {
    if (isDisabledButton.value) {
      resetForm()
      open.value = false
    } else {
      const result = await confirm({
        message: `${t('toast.cancel_action')}`,
        okText: t('modal.confirm'),
        cancelText: t('cancel'),
        noDismiss: true,
        noOutsideDismiss: true,
      })
      if (result) {
        resetForm()
        open.value = false
      }
    }
  }

  const getDueDate = (invoice: InvoiceTableItem | MissingInvoiceTableItem) => {
    let date = moment(invoice.date)
    date = date.endOf('month')

    const now = moment()

    if (now.isAfter(date, 'month')) {
      return new Date((invoice as any).due_date)
    }

    return ''
  }

  // get contractor
  const getContractorById = async (contractorId: string) => {
    try {
      const response = await ContractorService.getContractorById(contractorId).then((response) => {
        return response.data
      })

      contractorInfo.value = response
    } catch (err) {
      console.log({ err })
    }
  }

  const getLinkDownloadPDF = async () => {
    if (!currentInvoice.value?.id) {
      return
    }
    try {
      const response = await InvoiceService.downloadPDF(currentInvoice.value?.id)
      linkPDF.value = response.data.url
    } catch (err) {
      console.log({ err })
    }
  }

  // get client
  const getClient = async (clientId: number) => {
    try {
      const response = await ClientService.getClientByClientId(clientId)
      const matchedClient = response.data.find((client) => client.client_id === clientId)

      if (matchedClient) {
        clientInfo.value = matchedClient
      }
    } catch (err) {
      console.log({ err })
    }
  }

  // get contract
  const getClientDetail = async (clientId: number) => {
    try {
      const response = await ClientService.getClientDetail(clientId)
      const isOnlyContract = clientInfo.value?.contract_method === 0
      const depositContractTypes = [DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT, DEPOSIT_AND_WITHDRAWAL_CODE.ALL]
      const withdrawalContractTypes = [DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL, DEPOSIT_AND_WITHDRAWAL_CODE.ALL]

      let depositContractsTmp: ClientDetailItem[] = []
      let withdrawalContractsTmp: ClientDetailItem[] = []

      response.data.forEach((contract) => {
        if (depositContractTypes.includes(contract.service_type)) {
          depositContractsTmp.push(contract)
        }

        if (withdrawalContractTypes.includes(contract.service_type)) {
          withdrawalContractsTmp.push(contract)
        }
      })

      if (isOnlyContract) {
        const now = moment()

        let latestDepositContract = depositContractsTmp[0]
        depositContractsTmp.forEach((contract) => {
          const contractDate = moment(contract.contract_date)
          const isOldContract = contractDate.isBefore(now, 'month')
          const isCurrentMonthContract = contractDate.isSame(now, 'month')

          if (isOldContract || isCurrentMonthContract) {
            const latestContractDate = moment(latestDepositContract.contract_date)
            if (contractDate.isAfter(latestContractDate)) {
              latestDepositContract = contract
            }
          }
        })

        if (latestDepositContract) {
          depositContractsSorted.value = [latestDepositContract]
        }

        let latestWithdrawalContract = withdrawalContractsTmp[0]
        withdrawalContractsTmp.forEach((contract) => {
          const contractDate = moment(contract.contract_date)
          const isOldContract = contractDate.isBefore(now, 'month')
          const isCurrentMonthContract = contractDate.isSame(now, 'month')

          if (isOldContract || isCurrentMonthContract) {
            const latestContractDate = moment(latestWithdrawalContract.contract_date)
            if (contractDate.isAfter(latestContractDate)) {
              latestWithdrawalContract = contract
            }
          }
        })

        if (latestWithdrawalContract) {
          withdrawalContractsSorted.value = [latestWithdrawalContract]
        }
      } else {
        depositContractsTmp = depositContractsTmp.sort((contractA, contractB) => {
          return contractA.max_amount - contractB.max_amount
        })

        if ((depositContractsTmp[0]?.max_amount || 0) === 0) {
          // move the contract has max_amount = 0 to end of array
          depositContractsSorted.value = [...depositContractsTmp.slice(1), depositContractsTmp[0]]
        } else {
          depositContractsSorted.value = depositContractsTmp
        }

        withdrawalContractsTmp = withdrawalContractsTmp.sort((contractA, contractB) => {
          return contractA.max_amount - contractB.max_amount
        })

        if ((withdrawalContractsTmp[0]?.max_amount || 0) === 0) {
          withdrawalContractsSorted.value = [...withdrawalContractsTmp.slice(1), withdrawalContractsTmp[0]]
        } else {
          withdrawalContractsSorted.value = withdrawalContractsTmp
        }
      }
    } catch (err) {
      console.log({ err })
    }
  }

  // get all transactions of client
  const getClientTransactionsInMonth = async (clientId: number, date: string) => {
    const momentDate = moment(date)
    const transactionListParams: TransactionListParams = {
      from_date: momentDate.format(YYYY_MM_DD_HH_MM_SS),
      to_date: momentDate.format(YYYY_MM_DD_HH_MM_SS),
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

  const preventInvalidKeys = (event: KeyboardEvent, keys: string[]) => {
    if (keys.includes(event.key)) {
      event.preventDefault()
    }
  }

  const createInvoice = async (isTemporary: boolean) => {
    if (isDisabledButton.value) {
      return
    }

    if (customExpenses.value) {
      customExpenses.value.find((expense) => {
        if (!expense.amount || !expense.rate || !expense.number_transaction) {
          isError.value = true
          return
        }
      })
    }

    const invoiceDetails: InvoiceDetailCreateParams[] = []

    if (depositContractsSorted.value.length == 1) {
      const detail: InvoiceDetailCreateParams = {
        id: depositContractsSorted.value[0].id,
        type: `${DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT}`,
        description: depositAggregation.value.contracts[0].description,
        rate: `${depositAggregation.value.contracts[0].rate}`,
        number_transaction: depositAggregation.value.numberTransfers,
        system_usage_fee: roundUp(
          (roundUp(depositAggregation.value.amount) * Number(depositAggregation.value.contracts[0].rate)) / 100,
        ).toString(),
        total_amount: `${roundUp(depositAggregation.value.amount)}`,
      }

      invoiceDetails.push(detail)
    } else {
      depositAggregation.value.contracts.forEach((contract) => {
        const detail: InvoiceDetailCreateParams = {
          id: contract.id,
          type: `${DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT}`,
          description: contract.description,
          rate: `${contract.rate}`,
          number_transaction: depositAggregation.value.numberTransfers,
          system_usage_fee: `${roundUp(contract.system_usage_fee)}`,
          total_amount: contract.amount ? `${roundUp(contract.amount)}` : '0',
        }

        invoiceDetails.push(detail)
      })
    }

    if (withdrawalContractsSorted.value.length == 1) {
      const detail: InvoiceDetailCreateParams = {
        id: withdrawalAggregation.value.contracts[0].id,
        type: `${DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL}`,
        description: withdrawalAggregation.value.contracts[0].description,
        rate: `${withdrawalAggregation.value.contracts[0].rate}`,
        number_transaction: withdrawalAggregation.value.numberTransfers,
        system_usage_fee: roundUp(
          (roundUp(withdrawalAggregation.value.amount) * Number(withdrawalAggregation.value.contracts[0].rate)) / 100,
        ).toString(),
        total_amount: roundUp(withdrawalAggregation.value.amount).toString(),
      }
      invoiceDetails.push(detail)
    } else {
      withdrawalAggregation.value.contracts.forEach((contract) => {
        const detail: InvoiceDetailCreateParams = {
          id: contract.id,
          type: `${DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL}`,
          description: contract.description,
          rate: `${contract.rate}`,
          number_transaction: withdrawalAggregation.value.numberTransfers,
          system_usage_fee: `${roundUp(contract.system_usage_fee)}`,
          total_amount: contract.amount ? `${roundUp(contract.amount)}` : '0',
        }

        invoiceDetails.push(detail)
      })
    }

    customExpenses.value.forEach((customExpense) => {
      const detail: InvoiceDetailCreateParams | any = {
        id: Number(customExpense.id),
        type: '3',
        description: customExpense.description,
        rate: customExpense.rate,
        number_transaction: Number(customExpense.number_transaction),
        system_usage_fee: `${roundUp(customExpense.amount) * (Number(customExpense.rate) / 100)}`,
        total_amount: roundUp(customExpense.amount),
      }

      invoiceDetails.push(detail)
    })

    const invoiceParams: any = {
      client_id: invoiceClientId.value ? invoiceClientId.value : null,
      contractor_id: contractorInfo.value?.id ? contractorInfo.value.id : null,
      invoice_no: currentInvoiceNo.value,
      invoice_date: currentInvoiceDate.value,
      period_from: moment(currentInvoice.value?.period_from).format(YYYY_MM_DD_SLASH),
      period_to: moment(currentInvoice.value?.period_to).endOf('month').format(YYYY_MM_DD_SLASH),
      due_date: moment(currentInvoiceDueDate.value).format(YYYY_MM_DD),
      sub_total: `${invoiceSubtotal.value}`,
      discount_amount: invoiceDiscount.value,
      tax_rate: invoiceTaxRate.value,
      total_tax: invoiceTotalTax.value ? `${invoiceTotalTax.value}` : '0',
      balance: invoiceBalanceDue.value ? `${invoiceBalanceDue.value}` : '0',
      memo: invoiceNote.value,
      status: isTemporary ? 0 : currentInvoice.value?.status === 0 ? 1 : 2,
      invoice_details: invoiceDetails,
      count: currentInvoice.value?.id ? currentInvoice.value?.count + 1 : 1,
    }

    let res = '' as any
    if (!currentInvoice.value?.id) {
      res = await InvoiceService.createInvoice(invoiceParams)
    } else {
      invoiceParams.id = currentInvoice.value.id
      res = await InvoiceService.updateInvoice(invoiceParams)
    }

    emit('success')

    if (res && !res.code) {
      if (isTemporary) {
        init({ message: t('toast.success'), color: 'success' })
      } else {
        globalStore.setLoading(true)
        await getLinkDownloadPDF().finally(() => {
          globalStore.setLoading(false)
          linkPDF.value ? (document.location.href = linkPDF.value) : ''
          init({ message: t('toast.confirm_success'), color: 'success' })
        })
      }
      resetForm()
      open.value = false
    } else {
      if (res.code == ERROR_CODE.NONE_CONTRACTOR_ID) {
        init({ message: t('message_error.none_contractor_id'), color: 'danger' })
      } else {
        init({ message: res.message, color: 'danger' })
      }
    }
  }

  watch(contractorInfo, (newValue) => {
    if (!newValue) {
      return
    }

    const dateFormatted = moment(currentInvoiceDate.value).format(YYYYMMDD)
    currentInvoiceNo.value = `${
      newValue.invoice_prefix
        ? `${newValue.invoice_prefix}${dateFormatted}`
        : newValue.id
        ? `${newValue.id}${dateFormatted}`
        : dateFormatted
    }${currentInvoice.value?.count || 0 > 0 ? `-${String(currentInvoice.value?.count).padStart(2, '0')}` : ''}`
  })

  watch([depositTransactions, depositContractsSorted], ([transactions, contracts]) => {
    depositAggregation.value = generateTransactionAggregation(transactions, contracts, 1)
  })

  watch([withdrawalTransactions, withdrawalContractsSorted], ([transactions, contracts]) => {
    withdrawalAggregation.value = generateTransactionAggregation(transactions, contracts, 2)
  })

  defineExpose({
    openModal,
    closeModal,
  })
</script>

<style scoped lang="scss">
  :deep(.va-button) {
    .va-button__content {
      font-weight: 400;
    }
  }

  :deep(.va-input-wrapper__text) {
    textarea {
      min-height: 76px;
    }
  }
  :deep(.cus-input) {
    .va-input-wrapper__field {
      width: 130px;
    }
  }

  :deep(.cus-input-small) {
    .va-input-wrapper__field {
      width: 73px;
    }
  }

  table {
    thead {
      th {
        background-color: #1c78dd;
        height: 50px;
        color: #ffffff;
        border-right: none !important;
      }
    }
    tbody {
      td {
        border-right: none !important;
      }
    }
  }

  .modal-edit-invoice {
    font-size: 14px;
    line-height: 20px;
    color: #06152b;
    .title-modal {
      font-weight: 700;
      font-size: 32px;
      line-height: 46px;
      color: #1c78dd;
    }
    .title-modal-2 {
      font-weight: 700;
      font-size: 20px;
      line-height: 29px;
      color: #1c78dd;
    }
    .text-content-right {
      text-align: right;
      color: #1c78dd;
    }
    .hr-custom {
      width: 100%;
      height: 10px;
      background-color: #1c78dd;
    }
    .hr {
      width: 100%;
      height: 2px;
      background-color: #1c78dd;
    }
    .text-title {
      font-weight: 700;
      font-size: 22px;
      line-height: 32px;
      color: #1c78dd;
    }
    .text-sub-title {
      font-weight: 700;
      font-size: 18px;
      line-height: 26px;
    }
    .text-address {
      font-weight: 400;
    }
    .text-label {
      font-weight: 700;
      text-align: right;
    }
    .text-total {
      font-weight: 700;
      font-size: 26px;
      line-height: 38px;
      color: #1c78dd;
    }
  }

  .custom-expenses {
    display: flex;
    position: relative;

    > div {
      padding: 12px 8px;
    }

    .custom-expenses-description {
      width: 145px;
    }

    .custom-expenses-rate {
      width: 90px;
    }

    .custom-expenses-number-transaction {
      width: 90px;
    }

    .custom-expenses-amount {
      width: 130px;
    }

    .custom-expenses-total-amount {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .custom-expenses-delete {
      position: absolute;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }

  .custom-expenses-button {
    margin: 12px 8px;
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    .icon {
      margin-right: 4px;
    }
  }
</style>
