<template>
  <div class="cus-tabel-wrapper">
    <table>
      <thead>
        <tr>
          <th>{{ t('account_balance.banks') }}</th>
          <th>{{ t('account_balance.branch_office') }}</th>
          <th>{{ t('account_balance.account_number') }}</th>
          <th>{{ t('account_balance.client_used') }}</th>
          <th>{{ t('account_balance.account_holder') }}</th>
          <th>{{ t('account_balance.amount_of_money') }}</th>
          <th>{{ t('account_balance.last_confirmed_date') }}</th>
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
        <template v-else-if="props.accountBalance && props.accountBalance.length > 0">
          <tr v-for="(account, index) in props.accountBalance" :key="index">
            <td>{{ account.bank_name }}</td>
            <td>{{ account.branch_name }}</td>
            <td class="text-right">{{ account.account_number }}</td>
            <td>{{ account.represent_name }}</td>
            <td>{{ account.account_holder }}</td>
            <td class="text-right">{{ formatCurrency.func(account.balance) }}</td>
            <td>{{ convertDateToString(account.date_history) }}</td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="7" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="props.accountBalanceOriginal.length > 10">
    <Pagination v-model="pagination" :totals="props.accountBalanceOriginal.length" :page-size="props.pageSize" />
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { defineAsyncComponent, defineProps, ref, watch } from 'vue'
  import { AccountBalanceDTO } from '../../types/AccountBalanceDTO'
  import { convertDateToString, formatCurrency } from '../../common/utils'

  const { t } = useI18n()
  const isLoading = ref(false)
  const props = defineProps({
    accountBalance: {
      type: Array as () => AccountBalanceDTO[],
      default: () => [],
    },
    accountBalanceOriginal: {
      type: Array as () => AccountBalanceDTO[],
      default: () => [],
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  })
  const pagination = ref(1)
  const emit = defineEmits<{
    (e: 'changePagination', pagination: number): void
  }>()
  const Pagination = defineAsyncComponent(() => import('../pagination/Pagination.vue'))

  watch(pagination, () => {
    emit('changePagination', pagination.value)
  })
</script>
<style lang="scss" scoped></style>
