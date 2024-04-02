<template>
  <va-modal v-model="isOpen" size="large" no-outside-dismiss hide-default-actions no-esc-dismiss>
    <div class="account-usage-fee-modal-edit">
      <div class="modal-header">
        <div class="modal-title">明細書</div>
        <div class="contact-info">
          <div class="modal-title">{{ props.invoiceContractor.company_name_honsha }}</div>
          <div>
            {{ props.invoiceContractor.company_address }}
          </div>
          <div>{{ props.invoiceContractor.company_email }}</div>
          <div>{{ props.invoiceContractor.contact_name }}</div>
        </div>
      </div>
      <div class="modal-body">
        <div class="top-section">
          <div class="contact-info" style="width: 300px">
            <div class="contact-label">BILL TO:</div>
            <div class="company-name">{{ props.invoiceContractor.company_name }}</div>
            <div>{{ props.invoiceContractor.address }}</div>
            <div>{{ props.invoiceContractor.email }}</div>
          </div>
          <div class="bill-info">
            <div class="info-item">
              <div class="info-title">Date:</div>
              <div class="info-detail">{{ convertDate(editInfo.date) }}</div>
            </div>
            <div class="info-item">
              <div class="info-title">Number:</div>
              <div class="info-detail">{{ editInfo.number }}</div>
            </div>
          </div>
        </div>

        <div class="middle-section">
          <table class="data-table va-table va-table--striped">
            <thead>
              <tr>
                <th>DESCRIPTION</th>
                <th>BANK NAME</th>
                <th>ACCOUNT NUMBER</th>
                <th>QTY</th>
                <th>AMOUNT</th>
                <th>RATE</th>
                <th>COMMISION</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="dataPDF.length > 0">
                <tr v-for="(item, index) in dataPDF" :key="index">
                  <td>{{ getTypeTransaction(item.type) }}</td>
                  <td>{{ item.bank_name }}</td>
                  <td>{{ item.account_number }}</td>
                  <td>{{ formatNumber(item.number_trans) }}</td>
                  <td>{{ formatCurrency.func(item.amount) }}</td>
                  <td>{{ item.commission_rate ? Number(item.commission_rate) : 0 }}%</td>
                  <td class="text-right">{{ formatCurrency.func(calUsageFee(item.amount, item.commission_rate)) }}</td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="10" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
              </tr>
            </tbody>
          </table>
          <div class="data-total">
            <div class="data-label">Total:</div>
            <div class="data-content">¥ {{ formatNumber(totals) }}</div>
          </div>
        </div>

        <div class="bottom-section">
          <div class="thank-you">Thank you for your business!</div>
          <div class="note">
            Note:&nbsp;<span class="content-note">{{ editInfo.note }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex d-flex-between c-mt-22 c-mb-7">
        <va-button class="button-cancel" @click="closeModal">{{ t('modal.cancel') }}</va-button>
        <div class="d-flex gap-4">
          <va-button
            class="button-create"
            :disabled="editInfo.number === ''"
            @click="exportPdf"
          >
            {{ t('modal.confirm') }}
          </va-button>
          <va-button
            class="button-create"
            preset="secondary"
            border-color="#1c78dd"
            style="color: #1c78dd !important"
            :disabled="accountUsageFee.length === 0"
            @click="showEditForm"
          >
            {{ t('modal.edit') }}
          </va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, defineEmits, defineExpose, reactive, defineProps } from 'vue'
  import { useI18n } from 'vue-i18n'
  import moment from 'moment'
  import { formatCurrency, formatNumber } from '../../common/utils'
  import { InvoiceContractor } from '../../types/Invoice'
  import ClientAggregation from '../../types/ClientAggregation'

  const props = defineProps<{
    urlPdf: string
    invoiceContractor: any
    accountUsageFee: Array<ClientAggregation>
  }>()

  const emit = defineEmits(['submit', 'exportPdf'])

  const { t } = useI18n()

  const isOpen = ref(false)
  const dataPDF = ref<any[]>([])
  let editInfo = reactive({
    note: '',
    date: '',
    number: '',
  })
  const totals = ref(0)

  const openModal = (accountUsageFee: any, invoiceContractor?: InvoiceContractor) => {
    totals.value = 0
    dataPDF.value = accountUsageFee
    isOpen.value = true

    if (invoiceContractor && Object.keys(invoiceContractor).length > 0) {
      editInfo.note = invoiceContractor.note || ''
      editInfo.date = invoiceContractor?.invoice_date
        ? moment(invoiceContractor?.invoice_date).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD')
      editInfo.number = invoiceContractor.number || ''
    }

    sumAccountUsageFee()
  }

  const closeModal = () => {
    isOpen.value = false
  }

  const convertDate = (value: any) => {
    const date = moment(new Date(value))
    return date.year() + '.' + (Number(date.month()) + 1).toString() + '.' + date.date()
  }

  const getTypeTransaction = (value: number) => {
    if (value === 1) {
      return t('account_usage_fee.payment')
    }
    return t('account_usage_fee.withdrawal')
  }

  const calUsageFee = (amount: number, rate: number) => {
    return amount * (rate / 100)
  }

  const sumAccountUsageFee = () => {
    return dataPDF.value.forEach((item) => {
      totals.value += calUsageFee(item.amount, item.commission_rate)
    })
  }

  const showEditForm = () => {
    emit('submit')
    closeModal()
  }

  const exportPdf = () => {
    closeModal()
    emit('exportPdf')
  }

  defineExpose({
    openModal,
  })
</script>

<style scoped lang="scss">
  .account-usage-fee-modal-edit {
    width: 950px;
    padding: 20px;

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      color: #1c78dd;
      padding-bottom: 23px;
      border-bottom: 10px solid currentcolor;

      .modal-title {
        font-weight: 700;
        font-size: 32px;
        line-height: 46px;
      }

      .contact-info {
        max-width: 305px;
        font-size: 14px;
        line-height: 20px;
        text-align: right;
      }
    }

    .modal-body {
      padding-top: 20px;

      .top-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 25px;
        border-bottom: 2px solid #1c78dd;
      }

      .contact-info {
        font-size: 14px;
        line-height: 20px;
        color: #06152b;

        .contact-label {
          font-weight: 700;
          font-size: 22px;
          line-height: 32px;
          color: #1c78dd;
        }

        .company-name {
          font-weight: 700;
          font-size: 18px;
          line-height: 26px;
          color: #06152b;
        }
      }

      .bill-info {
        .info-item {
          .info-title {
            font-weight: 700;
            font-size: 14px;
            line-height: 20px;
            text-align: right;
            color: #06152b;
          }

          .info-detail {
            font-weight: 350;
            font-size: 14px;
            line-height: 20px;
            text-align: right;
            color: #06152b;
          }
        }
      }

      .middle-section {
        padding-top: 20px;

        .data-table {
          width: 100%;

          thead {
            background-color: #1c78dd;
            color: #fff;

            th {
              padding: 15px 10px;
              font-weight: 700;
              font-size: 14px;
              line-height: 20px;
              text-transform: uppercase;
              vertical-align: middle;
            }
          }

          tbody {
            td {
              padding: 13px 10px;
              font-size: 14px;
              line-height: 20px;
              color: #788b9a;
            }
          }
        }

        .data-total {
          color: #1c78dd;
          padding: 10px 15px;
          display: flex;
          justify-content: flex-end;
          align-items: baseline;

          .data-label {
            font-weight: 700;
            font-size: 16px;
            line-height: 23px;
            margin-right: 18px;
          }

          .data-content {
            font-weight: 700;
            font-size: 26px;
            line-height: 38px;
          }
        }
      }

      .bottom-section {
        font-weight: 500;
        font-size: 16px;
        line-height: 23px;
        color: #06152b;
        .thank-you {
          margin-bottom: 16px;
        }

        .note {
          margin-bottom: 14px;
          .content-note {
            font-weight: 350;
          }
        }
      }
    }
  }
</style>
