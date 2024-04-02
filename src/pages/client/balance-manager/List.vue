<template>
  <div class="dashboard">
    <h1 class="page-title">{{ t('cs_balance_manager.balance_by_client') }}</h1>
    <va-card class="mt-3">
      <va-card-content>
        <div class="my-table-wrapper mt-3">
          <table class="my-table">
            <thead>
              <tr>
                <th rowspan="3">{{ t('cs_balance_manager.date') }}</th>
                <th colspan="4">{{ t('cs_balance_manager.earnings') }}</th>
                <th colspan="4">{{ t('cs_balance_manager.spending') }}</th>
                <th colspan="6">{{ t('cs_balance_manager.income') }}</th>
                <th rowspan="3">{{ t('cs_balance_manager.gross_profit') }}</th>
                <th rowspan="3">{{ t('cs_balance_manager.operating_income') }}</th>
                <th rowspan="3">
                  {{ t('cs_balance_manager.liabilities') }} ({{ t('cs_balance_manager.client_balance') }})
                </th>
                <th rowspan="3">{{ t('cs_balance_manager.actual_account_balance') }}</th>
                <th rowspan="3">{{ t('cs_balance_manager.borrowing') }}</th>
              </tr>
              <tr>
                <th colspan="2">{{ t('cs_balance_manager.payment') }}</th>
                <th colspan="2">{{ t('cs_balance_manager.withdrawal') }}</th>
                <th colspan="2">{{ t('cs_balance_manager.expenses') }}</th>
                <th colspan="2">{{ t('cs_balance_manager.system_fee') }}</th>
                <th colspan="4">{{ t('cs_balance_manager.various_fee') }}</th>
              </tr>
              <tr>
                <th>{{ t('cs_balance_manager.number_of_deposits') }}</th>
                <th>{{ t('cs_balance_manager.deposit_amount') }}</th>
                <th>{{ t('cs_balance_manager.number_of_withdrawals') }}</th>
                <th>{{ t('cs_balance_manager.withdrawal_amount') }}</th>
                <th>{{ t('cs_balance_manager.account_usage_fee') }}</th>
                <th>{{ t('cs_balance_manager.referral_fee') }}</th>
                <th>{{ t('cs_balance_manager.other_expenses') }}</th>
                <th>{{ t('cs_balance_manager.payment') }}</th>
                <th>{{ t('cs_balance_manager.withdrawal') }}</th>
                <th>{{ t('cs_balance_manager.settlement_fee') }}</th>
                <th>{{ t('cs_balance_manager.charge_fee') }}</th>
                <th>{{ t('cs_balance_manager.transfer_fee_difference') }}</th>
                <th>{{ t('cs_balance_manager.miscellaneous_income') }}</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </va-card-content>
    </va-card>
    <va-card class="mt-3">
      <va-card-content>
        <h3 class="section-title">{{ t('cs_balance_manager.income_statement') }}</h3>
        <div class="my-table-wrapper mt-3">
          <table class="my-table">
            <thead>
              <tr>
                <th rowspan="3">{{ t('cs_balance_manager.date') }}</th>
                <th colspan="4">{{ t('cs_balance_manager.earnings') }}</th>
                <th colspan="4">{{ t('cs_balance_manager.spending') }}</th>
                <th colspan="6">{{ t('cs_balance_manager.income') }}</th>
                <th rowspan="3">{{ t('cs_balance_manager.gross_profit') }}</th>
                <th rowspan="3">{{ t('cs_balance_manager.operating_income') }}</th>
                <th rowspan="3">
                  {{ t('cs_balance_manager.liabilities') }} ({{ t('cs_balance_manager.client_balance') }})
                </th>
                <th rowspan="3">{{ t('cs_balance_manager.actual_account_balance') }}</th>
                <th rowspan="3">{{ t('cs_balance_manager.borrowing') }}</th>
              </tr>
              <tr>
                <th colspan="2">{{ t('cs_balance_manager.payment') }}</th>
                <th colspan="2">{{ t('cs_balance_manager.withdrawal') }}</th>
                <th colspan="2">{{ t('cs_balance_manager.expenses') }}</th>
                <th colspan="2">{{ t('cs_balance_manager.system_fee') }}</th>
                <th colspan="4">{{ t('cs_balance_manager.various_fee') }}</th>
              </tr>
              <tr>
                <th>{{ t('cs_balance_manager.number_of_deposits') }}</th>
                <th>{{ t('cs_balance_manager.deposit_amount') }}</th>
                <th>{{ t('cs_balance_manager.number_of_withdrawals') }}</th>
                <th>{{ t('cs_balance_manager.withdrawal_amount') }}</th>
                <th>{{ t('cs_balance_manager.account_usage_fee') }}</th>
                <th>{{ t('cs_balance_manager.referral_fee') }}</th>
                <th>{{ t('cs_balance_manager.other_expenses') }}</th>
                <th>{{ t('cs_balance_manager.payment') }}</th>
                <th>{{ t('cs_balance_manager.withdrawal') }}</th>
                <th>{{ t('cs_balance_manager.settlement_fee') }}</th>
                <th>{{ t('cs_balance_manager.charge_fee') }}</th>
                <th>{{ t('cs_balance_manager.transfer_fee_difference') }}</th>
                <th>{{ t('cs_balance_manager.miscellaneous_income') }}</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const state = reactive({ showModalPdfPreview: false })
</script>

<style lang="scss" scoped>
  table,
  th,
  td {
    border: 1px solid;
  }
</style>
