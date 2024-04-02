<template>
  <div class="cus-tabel-wrapper">
    <table>
      <thead>
        <tr>
          <th>{{ t('account_balance.date') }}</th>
          <th>{{ t('account_balance.kinds') }}</th>
          <th>{{ t('account_balance.banks') }}</th>
          <th>{{ t('account_balance.branch_office') }}</th>
          <th>{{ t('account_balance.account_number') }}</th>
          <th>{{ t('account_balance.client_used') }}</th>
          <th>{{ t('account_balance.account_holder') }}</th>
          <th>{{ t('account_balance.amount_of_money') }}</th>
          <th>{{ t('account_balance.memo') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="isLoading">
          <td colspan="9">
            <div class="d-flex justify-center">
              <va-progress-circle size="small" indeterminate />
            </div>
          </td>
        </tr>
        <template v-else-if="props.chargeHistory && props.chargeHistory.length > 0">
          <tr
            v-for="(item, index) in props.chargeHistory"
            :key="index"
            :class="{ 'select-row': selected.includes(index) }"
          >
            <td>
              <div class="d-flex align-center">
                <va-checkbox v-model="selected" class="mr-2" :array-value="index" @click="handleSaveSelected" />
                {{ convertDateToString(item.create_date) }}
              </div>
            </td>
            <td class="text-left">{{ item.kinds }}</td>
            <td class="text-left">{{ item.bank_name }}</td>
            <td class="text-left">{{ item.branch_name }}</td>
            <td class="text-right">{{ item.account_number }}</td>
            <td class="text-left">{{ item.represent_name }}</td>
            <td class="text-left">{{ item.account_holder }}</td>
            <td class="text-right">{{ formatCurrency.func(item.payment_amount) }}</td>
            <td :class="`text-left ${item.memo ? 'hover-text' : ''}`" style="max-width: 200px !important">
              {{ `${item.memo?.length > 15 ? item.memo.slice(0, 15) + '...' : item.memo || ''}` }}
              <span v-if="item.memo" id="fade" class="tooltip-text">{{ item.memo }}</span>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="9" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
        </tr>
      </tbody>
    </table>
    <ActionButton :is-disabled="!(selected && selected.length > 0)" @create="openModalAdd()" @edit="openModalEdit()" />
    <ModalAddLoan ref="modalAddLoan" :kinds="props.kinds" @submit="onSubmit" />
    <ModalNotification ref="modalNotification" :message="message" />
  </div>
  <div v-if="props.chargeHistoryOriginal.length > 10">
    <Pagination v-model="pagination" :totals="props.chargeHistoryOriginal.length" :page-size="props.pageSize" />
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { defineAsyncComponent, defineProps, ref, watch } from 'vue'
  import ActionButton from './ActionButton.vue'
  import ModalAddLoan from './ModalAddLoan.vue'
  import { convertDateToString, formatCurrency } from '../../common/utils'
  import moment from 'moment'
  import { ChargeHistoryItem } from '../../types/ChargeHistory'
  import { KINDS_TYPE } from '../../common/constants'
  import { CommonService } from '../../services/CommonService'
  import { API } from '../../services/apis/apis'
  import chargeHistoryService from '../../services/ChargeHistoryService'

  const props = defineProps<{
    chargeHistory: Array<ChargeHistoryItem>
    chargeHistoryOriginal: Array<ChargeHistoryItem>
    kinds: Array<any>
    pageSize: number
  }>()

  const modalAddLoan = ref<InstanceType<typeof ModalAddLoan>>()
  const isLoading = ref(false)
  const selected = ref<number[]>([])
  const { t } = useI18n()
  const service = new CommonService()
  const message = ref('')
  const ModalNotification = defineAsyncComponent(() => import('../modal/ModalNotification.vue'))
  const modalNotification = ref<InstanceType<typeof ModalNotification>>()
  const emit = defineEmits<{
    (e: 'refreshLoanHistory', data: boolean): void
    (e: 'changePagination', pagination: number): void
  }>()
  const pagination = ref(1)
  const Pagination = defineAsyncComponent(() => import('../pagination/Pagination.vue'))
  const selectedTmp = ref<number[]>([])
  const paginationTmp = ref(1)

  const openModalAdd = () => {
    modalAddLoan.value?.openModal()
    modalAddLoan.value?.resetValidateForm()
  }

  const openModalEdit = () => {
    modalAddLoan.value?.openModal(props.chargeHistory?.[selected.value[0]])
    modalAddLoan.value?.resetValidateForm()
  }

  watch(
    props.chargeHistory,
    () => {
      selected.value = []
    },
    { deep: true },
  )

  watch(selected, () => {
    if (selected.value.length > 1) {
      selected.value = selected.value.slice(-1)
    }
  })

  const addNewChargeHistoryItem = (params: any) => {
    return service.create(API.CHARGE_HISTORY.CREATE, params)
  }

  const editChargeHistoryItem = (params: any) => {
    return chargeHistoryService.updateChargeHistory(params)
  }

  const onSubmit = async (value: any) => {
    let params = {
      type_client_aggregation: value.edit ? props.chargeHistory?.[selected.value[0]].type_client_aggregation : 0,
      type: value.edit ? props.chargeHistory?.[selected.value[0]].type : 0,
      client_id: value.data._value.client_id,
      payment_amount: value.data._value.payment_amount
        ? parseInt(value.data._value.payment_amount.replaceAll(',', ''))
        : 0,
      charge_fee: 0,
      memo: value.data._value.memo,
      create_date: moment(value.data._value.create_date).format('YYYY-MM-DD') || '',
      id: value.edit ? props.chargeHistory?.[selected.value[0]].id : 0,
      account_number: value.data._value.account_number,
    }

    switch (value.data._value.kinds) {
      case KINDS_TYPE.BORROWING_DEPOSIT_ACCOUNT:
        params.type_client_aggregation = 1
        params.type = 6
        break
      case KINDS_TYPE.BORROWING_WITHDRAWAL_ACCOUNT:
        params.type_client_aggregation = 2
        params.type = 6
        break
      case KINDS_TYPE.REPAYMENT_DEPOSIT_ACCOUNT:
        params.type_client_aggregation = 1
        params.type = 7
        break
      case KINDS_TYPE.REPAYMENT_WITHDRAWAL_ACCOUNT:
        params.type_client_aggregation = 2
        params.type = 7
        break
      case KINDS_TYPE.WITHDRAWAL:
        params.type_client_aggregation = 2
        params.type = 8
        break
      default:
        break
    }

    const response = value.edit ? await editChargeHistoryItem(params) : await addNewChargeHistoryItem(params)

    if (response.status || response?.data) {
      message.value = value.edit ? t('edit_success') : t('add_new_success')
      emit('refreshLoanHistory', true)
      selected.value = []
    }
  }

  const openModalNotification = () => {
    modalNotification.value?.openModal()
  }

  const handleSaveSelected = () => {
    selectedTmp.value = selected.value
    paginationTmp.value = pagination.value
  }

  watch(pagination, () => {
    if (pagination.value === paginationTmp.value) {
      selected.value = selectedTmp.value
    } else {
      selected.value = []
    }
    emit('changePagination', pagination.value)
  })

  defineExpose({
    openModalNotification,
  })
</script>
<style lang="scss" scoped>
  .hover-text:hover #fade {
    display: block;
  }

  .hover-text {
    position: relative;

    .tooltip-text {
      position: absolute;
      top: -33px;
      left: -23%;
      z-index: 2;
      max-width: 100%;
      overflow-y: auto;
      max-height: 500px;
      color: #788b9a;
      font-size: 12px;
      background-color: #ffffff;
      border-radius: 10px;
      padding: 10px 15px 10px 15px;
      box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
    }

    #fade {
      display: none;
    }
  }
</style>
