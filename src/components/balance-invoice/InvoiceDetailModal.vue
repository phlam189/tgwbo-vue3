<template>
  <va-modal v-model="open" no-outside-dismiss hide-default-actions no-esc-dismiss>
    <div class="c-mx-30 modal-edit-invoice">
      <div class="c-mt-8 d-flex-between">
        <div class="">
          <div class="title-modal">REPORT</div>
          <div class="title-modal-2">{{ contractorInfo?.company_name }}</div>
        </div>
        <div class="text-right text-content-right">
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
          <div class="d-flex-between gap-5 c-mt-20" style="align-items: center">
            <div class="text-label c-w-90">Invoice Date:</div>
            <div>{{ currentInvoice?.invoice_date }}</div>
          </div>
          <div class="d-flex-between gap-5 c-mt-5" style="align-items: center">
            <div class="text-label c-w-90">Due Date:</div>
            <div>{{ currentInvoice?.due_date }}</div>
          </div>
          <div class="d-flex-between gap-5 c-mt-5" style="align-items: center">
            <div class="text-label c-w-90">Invoice No:</div>
            <div>
              {{
                `${currentInvoice?.invoice_no}${
                  (currentInvoice?.count || 0) - 1 > 0 ? `-${String(currentInvoice?.count - 1).padStart(2, '0')}` : ''
                }`
              }}
            </div>
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
            <col width="160px" />
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
            <tr v-if="depositAggregation.contracts.length === 1">
              <td>【Deposit】</td>
              <td class="text-right">{{ Number(depositAggregation.contracts[0].rate) }}%</td>
              <td class="text-right">{{ formatNumber(depositAggregation.numberTransfers) }}</td>
              <td class="text-right">{{ formatCurrency.func(depositAggregation.amount) }}</td>
              <td class="text-right">
                {{
                  formatCurrency.func((depositAggregation.amount * Number(depositAggregation.contracts[0].rate)) / 100)
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
                <td>{{ contract.description }}</td>
                <td class="text-right">{{ Number(contract.rate) }}%</td>
                <td class="text-right"></td>
                <td class="text-right">{{ formatCurrency.func(contract.amount) }}</td>
                <td class="text-right">{{ formatCurrency.func((contract.rate / 100) * contract.amount) }}</td>
              </tr>
            </template>

            <tr v-if="withdrawalAggregation.contracts.length === 1">
              <td>【Withdrawal】</td>
              <td class="text-right">{{ Number(withdrawalAggregation.contracts[0].rate) }}%</td>
              <td class="text-right">{{ formatNumber(withdrawalAggregation.numberTransfers) }}</td>
              <td class="text-right">{{ formatCurrency.func(withdrawalAggregation.amount) }}</td>
              <td class="text-right">
                {{
                  formatCurrency.func(
                    (withdrawalAggregation.amount * Number(withdrawalAggregation.contracts[0].rate)) / 100,
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
                <td>{{ contract.description }}</td>
                <td class="text-right">{{ Number(contract.rate) }}%</td>
                <td class="text-right"></td>
                <td class="text-right">{{ formatCurrency.func(contract.amount) }}</td>
                <td class="text-right">{{ formatCurrency.func((contract.rate / 100) * contract.amount) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div v-for="(customExpense, index) in customExpenses" :key="index" class="custom-expenses">
        <div class="custom-expenses-description">{{ customExpense.description }}</div>
        <div class="custom-expenses-rate text-right">{{ Number(customExpense.rate) }}%</div>
        <div class="custom-expenses-number-transaction text-right">{{ customExpense.number_transaction }}</div>
        <div class="custom-expenses-amount text-right">{{ formatCurrency.func(customExpense.amount) }}</div>
        <div class="custom-expenses-total-amount">
          {{ formatCurrency.func(Number(customExpense.amount) * (Number(customExpense.rate) / 100)) }}
        </div>
      </div>

      <!-- input -->
      <div class="d-flex-end">
        <div>
          <div class="d-flex-end gap-5 c-mt-20" style="align-items: center">
            <div class="text-right" style="font-weight: 700">SUBTOTAL :</div>
            <div class="c-w-125 text-right">
              {{ currentInvoice?.sub_total && formatCurrency.func(currentInvoice?.sub_total) }}
            </div>
          </div>
          <div class="d-flex-end gap-5 c-mt-5" style="align-items: center">
            <div class="text-right" style="font-weight: 700">DISCOUNT :</div>
            <div class="c-w-125 text-right">
              {{ currentInvoice?.discount_amount && formatCurrency.func(currentInvoice?.discount_amount) }}
            </div>
          </div>
          <div class="d-flex-end gap-5 c-mt-5" style="align-items: center">
            <div class="text-right" style="font-weight: 700">SUBTOTAL LESS DISCOUNT :</div>
            <div class="c-w-125 text-right">{{ formatCurrency.func(invoiceSubtotalLessDiscount) }}</div>
          </div>
          <div class="d-flex-end gap-5 c-mt-5" style="align-items: center">
            <div class="text-right" style="font-weight: 700">TAX RATE :</div>
            <div class="c-w-125 text-right">{{ Number(currentInvoice?.tax_rate) || 0 }}%</div>
          </div>
          <div class="d-flex-end gap-5 c-mt-5" style="align-items: center">
            <div class="text-right" style="font-weight: 700">TOTAL TAX :</div>
            <div class="c-w-125 text-right">
              {{ currentInvoice?.total_tax && formatCurrency.func(currentInvoice?.total_tax) }}
            </div>
          </div>
        </div>
      </div>
      <!-- total -->
      <div class="d-flex-end c-mt-10 c-mb-5">
        <div class="d-flex gap-6" style="align-items: end">
          <div class="c-mb-4" style="font-weight: 700; color: #1c78dd">Balance Due :</div>
          <div>
            <span class="text-total">{{
              currentInvoice?.balance && formatCurrency.func(currentInvoice?.balance)
            }}</span>
          </div>
        </div>
      </div>

      <div style="font-weight: 500">Thank you for your business!</div>
      <div class="c-mt-5 c-mb-4" style="font-weight: 500">Terms & Instructions:</div>
      <va-input
        class="border-none"
        input-class="mt-0"
        readonly
        :rows="5"
        :model-value="currentInvoice?.memo"
        type="textarea"
      />
      <div class="d-flex-end c-mt-5 c-mb-10">
        <div class="d-flex gap-3">
          <va-button class="button-cancel c-w-120" @click="closeModal">{{ t('modal.cancel') }}</va-button>
          <va-button class="button-create c-w-120" :href="linkPDF ? linkPDF : ''">{{ t('modal.download') }}</va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import moment from 'moment'
  import { Invoice, InvoiceAggregation } from '../../types/Invoice'
  import { MM_DD_SLASH, YYYYMMDD, YYYY_MM_DD_SLASH } from '../../common/constants'
  import ClientService from '../../services/ClientService'
  import { Client } from '../../types/Client'
  import { formatCurrency, formatNumber } from '../../common/utils'
  import ContractorService from '../../services/ContractorService'
  import { Contractor } from '../../types/Contractor'
  import { InvoiceCustomExpense } from '../../types/Invoice'
  import { InvoiceDetail } from '../../types/Invoice'
  import { useI18n } from 'vue-i18n'
  import InvoiceService from '../../services/InvoiceService'

  const { t } = useI18n()
  const open = ref<boolean>(false)
  const clientInfo = ref<Client | null>(null)
  const contractorInfo = ref<Contractor | null>(null)
  const currentInvoice = ref<Invoice | null>(null)

  const invoiceClientId = ref<number | null>(null)

  const customExpenses = ref<InvoiceCustomExpense[]>([])
  const linkPDF = ref<string>('')

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

  const invoicePeriod = computed(() => {
    const startDate = moment(currentInvoice.value?.period_from).format(YYYY_MM_DD_SLASH)
    const endDate = moment(currentInvoice.value?.period_to).format(MM_DD_SLASH)

    return `${startDate}～${endDate}`
  })

  const invoiceSubtotalLessDiscount = computed(() => {
    return Number(currentInvoice.value?.sub_total) - Number(currentInvoice.value?.discount_amount)
  })

  const openModal = async (invoice: Invoice, clientId: number) => {
    invoiceClientId.value = clientId
    currentInvoice.value = invoice

    await Promise.allSettled([getClient(clientId), getLinkDownloadPDF()])

    if (clientInfo.value) {
      await getContractorById(clientInfo.value.contractor_id)
    }

    open.value = true
  }

  const closeModal = () => {
    open.value = false
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

  const generateDepositAndWithdrawalInvoiceDetail = (invoice: Invoice) => {
    const invoiceDetailDeposit: InvoiceDetail[] = []
    const invoiceDetailWithdrawal: InvoiceDetail[] = []
    const invoiceDetailCustom: InvoiceDetail[] = []

    invoice.invoice_details.forEach((detail) => {
      if (detail.type === '1') {
        invoiceDetailDeposit.push(detail)
      }

      if (detail.type === '2') {
        invoiceDetailWithdrawal.push(detail)
      }

      if (detail.type === '3') {
        invoiceDetailCustom.push(detail)
      }
    })

    let depositAmount = 0
    let depositAmountWithRate = 0
    let depositContracts: any[] = []
    let depositNumberTransfers = 0

    let withdrawalAmount = 0
    let withdrawalAmountWithRate = 0
    let withdrawalContracts: any[] = []
    let withdrawalNumberTransfers = 0

    invoiceDetailDeposit.forEach((detail) => {
      depositContracts.push({
        id: detail.id,
        description: detail.description,
        rate: Number(detail.rate),
        amount: Number(detail.total_amount),
      })

      depositAmount = Number(detail.total_amount)
      depositAmountWithRate += Number(detail.total_amount) + Number(detail.rate)
      depositNumberTransfers = detail.number_transaction
    })

    invoiceDetailWithdrawal.forEach((detail) => {
      withdrawalContracts.push({
        id: detail.id,
        description: detail.description,
        rate: Number(detail.rate),
        amount: Number(detail.total_amount),
      })

      withdrawalAmount = Number(detail.total_amount)
      withdrawalAmountWithRate += Number(detail.total_amount) + Number(detail.rate)
      withdrawalNumberTransfers = detail.number_transaction
    })

    customExpenses.value = invoiceDetailCustom.map((detail) => ({
      type: detail.type,
      description: detail.description,
      rate: detail.rate,
      number_transaction: `${detail.number_transaction}`,
      amount: detail.total_amount,
    }))

    depositAggregation.value = {
      amount: depositAmount,
      amountWithRate: depositAmountWithRate,
      contracts: depositContracts,
      numberTransfers: depositNumberTransfers,
    }

    withdrawalAggregation.value = {
      amount: withdrawalAmount,
      amountWithRate: withdrawalAmountWithRate,
      contracts: withdrawalContracts,
      numberTransfers: withdrawalNumberTransfers,
    }
  }

  const getLinkDownloadPDF = async () => {
    try {
      const response = await InvoiceService.downloadPDF(currentInvoice.value?.id)
      linkPDF.value = response.data.url
    } catch (err) {
      console.log({ err })
    }
  }

  watch(currentInvoice, (newValue: Invoice | null) => {
    if (newValue) {
      generateDepositAndWithdrawalInvoiceDetail(newValue)
    }
  })

  watch(contractorInfo, (newValue) => {
    if (!newValue) {
      return
    }

    const dateFormatted = moment(currentInvoice.value?.invoice_date).format(YYYYMMDD)
    if (currentInvoice.value) {
      currentInvoice.value.invoice_no = newValue.invoice_prefix
        ? `${newValue.invoice_prefix}${dateFormatted}`
        : newValue.id
        ? `${newValue.id}${dateFormatted}`
        : dateFormatted
    }
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
    color: #788b9a;

    > div {
      padding: 12px 8px;
    }

    .custom-expenses-description {
      width: 160px;
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

  .border-none {
    border: none !important;
    :deep(.va-input-wrapper__field) {
      padding-left: 0;
    }
  }
</style>
