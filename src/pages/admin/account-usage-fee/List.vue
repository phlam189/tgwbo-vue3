<template>
  <div class="account-usage-fee c-mb-140">
    <div class="page-title">{{ t('account_usage_fee.account_usage_fee') }}</div>
    <Table1 />
    <Table2 />
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import Table1 from '../../../components/account-usage-fee/Table1.vue'
  import Table2 from '../../../components/account-usage-fee/Table2.vue'
  const { t } = useI18n()
</script>
<style lang="scss" scoped></style>
