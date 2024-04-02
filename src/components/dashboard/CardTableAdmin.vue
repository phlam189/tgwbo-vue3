<template>
  <va-card class="mt-3">
    <va-card-content>
      <div class="d-flex-between">
        <div v-if="props.typeSearch == DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT" class="table-title">
          {{ t('dashboard.payment') }}
        </div>
        <div v-else-if="props.typeSearch == DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL" class="table-title">
          {{ t('dashboard.withdrawal') }}
        </div>
        <div v-else class="table-title">{{ t('dashboard.list_deposits_withdrawals') }}</div>
        <GroupButton
          :disable-zoom-and-c-s-v="true"
          :type-search="props.typeSearch"
          @change-type-search="handleChangeTypeSearch"
        />
      </div>
      <div class="gap-16 d-flex c-mb-10">
        <div v-if="isShowDeposit" class="d-flex">
          <div class="text-label c-mr-12">{{ t('dashboard.deposit_account_balance') }} :</div>
          <div class="text-value">
            <span>{{ formatNumberCurrency(depositBalance) }}</span>
          </div>
        </div>
        <div v-if="isShowWithdrawal" class="d-flex">
          <div class="text-label c-mr-12">{{ t('dashboard.withdrawal_account_balance') }} :</div>
          <div class="text-value">
            <span>{{ formatNumberCurrency(withdrawalBalance) }}</span>
          </div>
        </div>
      </div>
      <TableAdmin
        :type-select-date="typeSelectDate"
        :type-search="props.typeSearch"
        :list="dataTable"
        @selected-row="handleSelectRow"
      />
    </va-card-content>
  </va-card>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import GroupButton from './GroupButton.vue'
  import TableAdmin from './TableAdmin.vue'
  import ClientAggregation from '../../types/ClientAggregation'
  import { computed } from 'vue'
  import { formatNumberCurrency } from '../../common/utils'
  import { DEPOSIT_AND_WITHDRAWAL_TEXT } from '../../common/constants'

  const { t } = useI18n()
  const emit = defineEmits<{
    (e: 'selectedRow', row: number[]): void
    (e: 'update:typeSearch', newValue: string): void
  }>()

  const props = defineProps<{
    deposit: ClientAggregation[]
    withdrawals: ClientAggregation[]
    typeSearch: string
    typeSelectDate: string
  }>()

  const depositBalance = ref(0)
  const withdrawalBalance = ref(0)
  const rowsSelected = ref([] as number[])

  const isShowDeposit = computed(() => {
    return [DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT, DEPOSIT_AND_WITHDRAWAL_TEXT.ALL].includes(props.typeSearch)
  })

  const isShowWithdrawal = computed(() => {
    return [DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL, DEPOSIT_AND_WITHDRAWAL_TEXT.ALL].includes(props.typeSearch)
  })

  const dataTable = computed(() => {
    const data = [] as any[]
    if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.ALL) {
      for (let i = 0; i < props.deposit.length; i++) {
        data.push(props.deposit[i])
        data.push(props.withdrawals[i])
      }
    }
    if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL) {
      props.withdrawals.forEach((value: ClientAggregation) => {
        data.push(value)
      })
    }
    if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT) {
      props.deposit.forEach((value: ClientAggregation) => {
        data.push(value)
      })
    }
    return data
  })

  const handleChangeTypeSearch = (type: string) => {
    emit('update:typeSearch', type)
  }

  const handleSelectRow = (rows: number[]) => {
    rowsSelected.value = rows
    const indexDeposit = props.deposit.findIndex((value: ClientAggregation) => {
      return value.client_id === rows[0]
    })
    const indexWithdrawal = props.withdrawals.findIndex((value: ClientAggregation) => {
      return value.client_id === rows[0]
    })
    depositBalance.value = props.deposit[indexDeposit]?.account_balance || 0
    withdrawalBalance.value = props.withdrawals[indexWithdrawal]?.account_balance || 0
    emit('selectedRow', rows)
  }

  watch(
    () => props.deposit,
    () => {
      const indexDeposit = props.deposit.findIndex((value: ClientAggregation) => {
        return value.client_id === rowsSelected.value[0]
      })
      depositBalance.value = props.deposit[indexDeposit]?.account_balance || 0
    },
    { deep: true },
  )

  watch(
    () => props.withdrawals,
    () => {
      const indexWithdrawal = props.withdrawals.findIndex((value: ClientAggregation) => {
        return value.client_id === rowsSelected.value[0]
      })
      withdrawalBalance.value = props.withdrawals[indexWithdrawal]?.account_balance || 0
    },
    { deep: true },
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
</style>
