<template>
  <div class="cus-tabel-wrapper">
    <table>
      <thead>
        <tr>
          <th>{{ t('account_balance.input_date') }}</th>
          <th>{{ t('account_balance.banks') }}</th>
          <th>{{ t('account_balance.branch_office') }}</th>
          <th>{{ t('account_balance.account_number') }}</th>
          <th>{{ t('account_balance.client_used') }}</th>
          <th>{{ t('account_balance.account_holder') }}</th>
          <th>{{ t('account_balance.amount_of_money') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="isLoading">
          <td colspan="7">
            <div class="d-flex justify-center">
              <va-progress-circle size="small" indeterminate />
            </div>
          </td>
        </tr>
        <template v-else-if="props.historyDetail && props.historyDetail.length > 0">
          <tr
            v-for="(history, index) in props.historyDetail"
            :key="index"
            :class="{ 'select-row': selected.includes(index) }"
          >
            <td>
              <div class="d-flex align-center">
                <va-checkbox v-model="selected" class="mr-2" :array-value="index" @click="handleSaveSelected" />{{
                  convertDateToString(history.date_history)
                }}
              </div>
            </td>
            <td>{{ history.bank_name }}</td>
            <td>{{ history.branch_name }}</td>
            <td class="text-right">{{ history.account_number }}</td>
            <td>{{ history.represent_name }}</td>
            <td>{{ history.account_holder }}</td>
            <td class="text-right">{{ formatCurrency.func(history.balance) }}</td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="7" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
        </tr>
      </tbody>
    </table>
    <ActionButton
      :is-disabled="!(selected && selected.length > 0)"
      @create="openModalAdd()"
      @edit="openModalEdit()"
    />
    <ModalAdd ref="modalAdd" @submit="onSubmit" />
    <ModalNotification ref="modalNotification" :message="message" />
  </div>
  <div v-if="props.historyDetailOriginal.length > 10">
    <Pagination v-model="pagination" :totals="props.historyDetailOriginal.length" :page-size="props.pageSize" />
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, defineProps, defineAsyncComponent, watch } from 'vue'
  import { AccountBalanceDTO, AccountBalanceHistory } from '../../types/AccountBalanceDTO'
  import { convertDateToString, formatCurrency } from '../../common/utils'
  import { API } from '../../services/apis/apis'
  import { CommonService } from '../../services/CommonService'
  import moment from 'moment/moment'

  const ActionButton = defineAsyncComponent(() => import('./ActionButton.vue'))
  const ModalAdd = defineAsyncComponent(() => import('./ModalAdd.vue'))
  const ModalNotification = defineAsyncComponent(() => import('../modal/ModalNotification.vue'))
  const Pagination = defineAsyncComponent(() => import('../pagination/Pagination.vue'))

  const modalAdd = ref<InstanceType<typeof ModalAdd>>()
  const isLoading = ref(false)
  const props = defineProps({
    historyDetail: {
      type: Array as () => AccountBalanceDTO[],
      default: () => [],
    },
    historyDetailOriginal: {
      type: Array as () => AccountBalanceDTO[],
      default: () => [],
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  })

  const { t } = useI18n()

  const selected = ref<number[]>([])
  const service = new CommonService()
  const emit = defineEmits<{
    (e: 'refreshBalanceHistory', data: boolean): void
    (e: 'changePagination', pagination: number): void
  }>()
  const modalNotification = ref<InstanceType<typeof ModalNotification>>()
  const message = ref('')
  const pagination = ref(1)
  const selectedTmp = ref<number[]>([])
  const paginationTmp = ref(1)

  const openModalAdd = () => {
    modalAdd.value?.openModal()
    modalAdd.value?.resetValidateForm()
  }

  const openModalEdit = () => {
    modalAdd.value?.openModal(props.historyDetail?.[selected.value[0]])
  }

  watch(props.historyDetail, () => {
    selected.value = []
  })

  watch(selected, () => {
    if (selected.value.length > 1) {
      selected.value = selected.value.slice(-1)
    }
  })

  const addNewBalanceHistory = (params: AccountBalanceHistory) => {
    return service.create(API.ACCOUNT_BALANCE.ADD_BALANCE_HISTORY, params)
  }

  const editBalanceHistory = (id: string, params: AccountBalanceHistory) => {
    return service.create(API.ACCOUNT_BALANCE.ADD_BALANCE_HISTORY, params)
  }

  const openModalNotification = () => {
    modalNotification.value?.openModal()
  }

  const onSubmit = async (value) => {
    const params: AccountBalanceHistory = {
      client_id: value.data._value.client_id || '',
      account_number: value.data._value.account_number || '',
      date_history: moment(value.data._value.date_history).format('YYYY-MM-DD') || '',
      balance: value.data._value.balance,
    }

    const response = value.edit
      ? await editBalanceHistory(params.client_id, params)
      : await addNewBalanceHistory(params)

    if (response.status) {
      message.value = value.edit ? t('edit_success') : t('add_new_success')
      emit('refreshBalanceHistory', true)
      selected.value = []
    }
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
<style lang="scss" scoped></style>
