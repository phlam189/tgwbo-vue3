<template>
  <va-card class="flex c-mt-20" stripe-color="info">
    <va-card-content>
      <div class="d-flex-between">
        <div class="title">{{ t('account_usage_fee.account_subscriber_name') }}</div>
        <div class="d-flex">
          <va-select
            v-model="contractor"
            class="c-mr-10"
            bordered
            :placeholder="t('account_usage_fee.account_subscriber_name')"
            :no-options-text="`${t('list_no_data')}`"
            :options="selectListContractor.options"
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
              <th style="width: 120px">{{ t('account_usage_fee.account_holder') }}</th>
              <th style="width: 140px">{{ t('account_usage_fee.client_name') }}</th>
              <th style="width: 140px">{{ t('account_usage_fee.date') }}</th>
              <th style="width: 140px">{{ t('account_usage_fee.bank_name') }}</th>
              <th style="width: 78px">{{ t('account_usage_fee.account_number') }}</th>
              <th style="width: 78px">{{ t('account_usage_fee.kinds') }}</th>
              <th style="width: 62px">{{ t('account_usage_fee.number') }}</th>
              <th style="width: 130px">{{ t('account_usage_fee.amount_of_money') }}</th>
              <th style="width: 86px">{{ t('account_usage_fee.usage_rate') }}</th>
              <th style="width: 130px">{{ t('account_usage_fee.account_usage_fee') }}</th>
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
            <template v-else-if="accountUsageFee.length > 0">
              <tr v-for="(item, index) in accountUsageFeePagination" :key="index">
                <td>{{ item.company_name }}</td>
                <td>{{ getClientName(item.client_id) }}</td>
                <td>{{ convertDateToString(item.date) }}</td>
                <td>{{ item.bank_name }}</td>
                <td>{{ item.account_number }}</td>
                <td>{{ getTypeTransaction(item.type) }}</td>
                <td class="text-right">
                  {{ formatNumber(item.number_trans) }}
                </td>
                <td class="text-right">
                  {{ formatCurrency.func(item.amount) }}
                </td>
                <td class="text-right">{{ Number(item.account_usage_rate) }}%</td>
                <td class="text-right">{{ formatCurrency.func(item.account_usage_fee, true) }}</td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="10" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7">{{ t('account_usage_fee.total') }}</td>
              <td class="text-right">
                {{ formatCurrency.func(totalAmount) }}
              </td>
              <td></td>
              <td class="text-right">
                {{ formatCurrency.func(totalAccountFee, true) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div v-if="accountUsageFee.length > 10">
        <Pagination v-model="page" :totals="accountUsageFee.length" :page-size="pageSize" />
      </div>
      <div class="d-flex gap-2 d-flex-end c-mt-20 c-mb-25">
        <va-button
          :disabled="!contractor || accountUsageFee.length === 0"
          class="button-create"
          @click="showModalEdit2"
        >
          {{ t('issue') }}
        </va-button>
        <va-button
          :disabled="!contractor || invoiceContractor.id === null || accountUsageFee.length === 0"
          class="button-create"
          @click="showModalEdit"
        >
          {{ t('edit') }}
        </va-button>
        <a id="download-pdf" :href="urlPdfAccount" download="download"></a>
      </div>
    </va-card-content>
    <ModalEditAccountUsageFee1
      ref="modalEditAccountUsageFee1"
      :url-pdf="urlPdfAccount"
      :invoice-contractor="invoiceContractorOnModal"
      :account-usage-fee="accountUsageFee"
      @submit="showModalEdit"
      @export-pdf="exportPdfAccount"
    />
    <ModalEditAccountUsageFee
      ref="modalEditAccountUsageFee"
      :invoice-contractor="invoiceContractor"
      @submit="keepDataModal"
    />
  </va-card>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { onMounted, reactive, Ref, ref, watch, defineAsyncComponent } from 'vue'
  import SelectDatePicker from '../select-date-picker/index.vue'
  import ModalEditAccountUsageFee from '../account-usage-fee/ModalEdit.vue'
  import ModalEditAccountUsageFee1 from '../account-usage-fee/ModalEdit1.vue'
  import AccountUsageFeeService from '../../services/AccountUsageFeeService'
  import ClientAggregation from '../../types/ClientAggregation'
  import momentFormatDate from 'moment'
  import { convertDateToString, formatCurrency, formatNumber, roundDown } from '../../common/utils'
  import ContractorService from '../../services/ContractorService'
  import ClientService from '../../services/ClientService'
  import InvoiceService from '../../services/InvoiceService'
  import { InvoiceContractor } from '../../types/Invoice'
  import moment from 'moment/moment'

  const { t, locale } = useI18n()
  const modalEditAccountUsageFee = ref<InstanceType<typeof ModalEditAccountUsageFee>>()
  const modalEditAccountUsageFee1 = ref<InstanceType<typeof ModalEditAccountUsageFee1>>()
  const date = ref(new Date())

  const selectListContractor = reactive({
    value: [],
    options: [] as Record<string, string | number>[],
  })
  const contractor = ref()

  const selectListClient = reactive({
    value: [],
    options: [] as Record<string, string | number>[],
  })

  const accountUsageFee: Ref<ClientAggregation[]> = ref([])
  const accountUsageFeePagination: Ref<ClientAggregation[]> = ref([])
  const totalAmount: any = ref(0)
  const totalAccountFee: any = ref(0)
  const isLoading = ref(false)
  const fromDt = ref('')
  const toDt = ref('')
  const urlPdfAccount = ref('')
  const invoiceContractor = ref({} as InvoiceContractor)
  const invoiceContractorOnModal = ref({} as InvoiceContractor)
  const page = ref(1)
  const pageSize = ref(10)
  const Pagination = defineAsyncComponent(() => import('../pagination/Pagination.vue'))

  const getDataAccountFee = async (params: any) => {
    page.value = 1
    isLoading.value = true
    resetData()
    try {
      const { data } = await AccountUsageFeeService.getAccountUsageFee(params)
      const keysDeposit = data.deposit && (Object.keys(data.deposit) as (keyof typeof data.deposit)[])
      const keysWithdrawal = data.withdrawals && (Object.keys(data.withdrawals) as (keyof typeof data.withdrawals)[])
      const dataTable = [] as ClientAggregation[]
      keysDeposit.forEach((key: any) => {
        data.deposit[key]?.forEach((value: ClientAggregation) => {
          dataTable.push(value)
        })
      })
      keysWithdrawal.forEach((key: any) => {
        data.withdrawals[key]?.forEach((value: ClientAggregation) => {
          dataTable.push(value)
        })
      })
      accountUsageFee.value = dataTable

      totalAmount.value =
        Number(data.deposit_aggregation_by_client?.amount || 0) +
        Number(data.withdrawals_aggregation_by_client?.amount || 0)
      sumAccountUsageFee()
      page.value = 1
      pageSize.value = 10
      setPagination()
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

      fromDt.value = fromDate
      toDt.value = momentFormatDate(fromDt.value).endOf('month').format('YYYY-MM-DD HH:mm:ss')

      if (contractor.value) {
        getDataAccountFee({ from_date: fromDate, to_date: toDate, contractor_id: contractor.value })
      } else {
        getDataAccountFee({ from_date: fromDate, to_date: toDate })
      }
    },
    { immediate: true },
  )

  watch(contractor, () => {
    setPagination()
    const fromDate = momentFormatDate(date.value).startOf('month').format('YYYY-MM-DD HH:mm:ss')
    const toDate = momentFormatDate(date.value).endOf('month').format('YYYY-MM-DD HH:mm:ss')
    if (contractor.value) {
      getDataAccountFee({ from_date: fromDate, to_date: toDate, contractor_id: contractor.value })
      getInvoiceContractor(contractor.value)
    } else {
      getDataAccountFee({ from_date: fromDate, to_date: toDate })
    }
  })

  const sumAccountUsageFee = () => {
    return accountUsageFee.value.forEach((item) => {
      totalAccountFee.value += roundDown(+item.account_usage_fee)
    })
  }

  const getTypeTransaction = (value: number) => {
    if (value === 1) {
      return t('account_usage_fee.payment')
    }
    return t('account_usage_fee.withdrawal')
  }

  const getClientName = (value: number) => {
    var clientName = ''
    selectListClient.options.forEach((client) => {
      if (client.id == value) {
        clientName = client.text as string
      }
    })
    return clientName
  }

  const getContractorList = async () => {
    try {
      const { data } = await ContractorService.getAllListContractor()
      const listContractor: Record<string, string | number>[] = []
      data.forEach((value: { id: number; company_name: string }) => {
        listContractor.push({ text: value.company_name, id: value.id })
      })
      selectListContractor.options = listContractor
    } catch (error) {
      console.log(error)
    }
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

  const updateInvoiceContractor = async () => {
    try {
      await InvoiceService.updateInvoiceContractor(+invoiceContractor.value.id, {
        invoice_date: moment(invoiceContractorOnModal.value.invoice_date).format('YYYY-MM-DD'),
        note: invoiceContractorOnModal.value.note,
        number: invoiceContractorOnModal.value.number,
        contructor_id: contractor.value,
      })
    } catch (e) {
      console.log(e)
    }
  }

  const exportPdfAccount = async () => {
    try {
      await updateInvoiceContractor()
      const response = await AccountUsageFeeService.exportPdfAccount({
        from_date: fromDt.value,
        to_date: toDt.value,
        contractor_id: contractor.value,
        number: invoiceContractorOnModal.value.number,
        note: invoiceContractorOnModal.value.note,
        lang: locale.value === 'gb' ? 'en' : locale.value
      })
      urlPdfAccount.value = response.data.download_link
      setTimeout(() => {
        document.getElementById('download-pdf')?.click()
      }, 0)
      await getInvoiceContractor(contractor.value)
    } catch (error) {
      console.log(error)
    }
  }

  onMounted(() => {
    fromDt.value = momentFormatDate(date.value).startOf('month').format('YYYY-MM-DD HH:mm:ss')
    toDt.value = momentFormatDate(fromDt.value).endOf('month').format('YYYY-MM-DD HH:mm:ss')

    getContractorList()
    getCLientList()
  })

  const showModalEdit2 = async () => {
    if (invoiceContractor.value.id) {
      invoiceContractorOnModal.value = await getInvoiceContractor(contractor.value)
    } else {
      invoiceContractorOnModal.value = await getInvoiceContractor(contractor.value, 1)
      invoiceContractorOnModal.value.invoice_date = moment().format('YYYY-MM-DD')
    }

    modalEditAccountUsageFee1.value?.openModal(accountUsageFee.value, invoiceContractor.value)
  }

  const showModalEdit = async () => {
    await getInvoiceContractor(contractor.value, 1)
    modalEditAccountUsageFee.value?.openModal(invoiceContractor.value, contractor.value)
  }

  const getInvoiceContractor = async (contractorId: string, generateNumber?: number) => {
    try {
      const response = await InvoiceService.getInvoiceContractor(contractorId, generateNumber)
      invoiceContractor.value = response.data
      return response.data
    } catch (e) {
      console.log(e)
    }
  }

  const keepDataModal = async (data: any) => {
    invoiceContractorOnModal.value.invoice_date = moment(data.date).format('YYYY-MM-DD')
    invoiceContractorOnModal.value.number = data.number
    invoiceContractorOnModal.value.note = data.note
    modalEditAccountUsageFee1.value?.openModal(accountUsageFee.value, invoiceContractorOnModal.value)
  }

  const setPagination = () => {
    accountUsageFeePagination.value = []
    accountUsageFeePagination.value = accountUsageFee.value
    accountUsageFeePagination.value = accountUsageFeePagination.value.slice(
      page.value - 1,
      page.value + pageSize.value - 1,
    )
  }

  watch(page, setPagination)
</script>
<style lang="scss" scoped>
  .title {
    font-weight: 700;
  }
  .cus-tabel-wrapper {
    overflow: scroll;
    max-height: 540px;
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
