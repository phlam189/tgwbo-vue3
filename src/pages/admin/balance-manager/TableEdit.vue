<template>
  <div class="content-container">
    <div>
      <div class="header">{{ t('balance_manager.department_income') }}</div>
      <div class="table-title">1.{{ t('balance_manager.payment') }}</div>
      <div class="table-content">
        <TableIncomeDeposit
          ref="deposit"
          :select-list-client="selectListClient"
          :data-deposit="dataDeposit"
          positions
          :type="props.type"
        />
      </div>
      <div class="table-title">2.{{ t('balance_manager.withdrawal') }}</div>
      <div class="table-content">
        <TableIncomeWithdraw
          ref="withdraw"
          :select-list-client="selectListClient"
          :data-withdraw="dataWithdraw"
          positions
          :type="props.type"
        />
      </div>
      <div class="table-title">3.{{ t('balance_manager.miscellaneous_income') }}</div>
      <div class="table-content">
        <TableIncome
          ref="miscellaneous"
          :select-list-client="selectListClient"
          :data-income="dataIncome"
          :positions="false"
          :type="props.type"
          @error="setErrorIncome"
          @delete-row="deleteRow"
        ></TableIncome>
      </div>
    </div>
    <div>
      <div class="header c-mt-40">{{ t('balance_manager.department_expenditure') }}</div>
      <div class="table-title">4.{{ t('balance_manager.expenses') }}</div>
      <div class="table-content">
        <TableExpenditure ref="expenditure" :data-breakdown="dataExpenditure" :type="props.type" />
      </div>
      <div class="table-title">5.{{ t('balance_manager.breakdown_expenses') }}</div>
      <div class="table-content">
        <TableBreakdown
          ref="breakdown"
          :select-list-client="selectListClient"
          :data-breakdown="dataBreakdown"
          :type="props.type"
          @error="setErrorBreakdown"
          @delete-row="deleteRow"
        />
      </div>
    </div>
    <div style="height: 15px"></div>
  </div>
</template>
<script setup lang="ts">
  import TableIncome from '../../../components/balance-manager/TableIncome.vue'
  import TableIncomeDeposit from '../../../components/balance-manager/TableIncomeDeposit.vue'
  import TableIncomeWithdraw from '../../../components/balance-manager/TableIncomeWithdraw.vue'
  import TableExpenditure from '../../../components/balance-manager/TableExpenditure.vue'
  import TableBreakdown from '../../../components/balance-manager/TableBreakdown.vue'
  import { useI18n } from 'vue-i18n'
  import { ref, watch, defineExpose, defineProps, withDefaults, defineEmits } from 'vue'
  import { roundDown } from '../../../common/utils'
  const { t } = useI18n()

  const miscellaneous = ref<InstanceType<typeof TableIncome>>()
  const deposit = ref<InstanceType<typeof TableIncomeDeposit>>()
  const withdraw = ref<InstanceType<typeof TableIncomeWithdraw>>()
  const expenditure = ref<InstanceType<typeof TableExpenditure>>()
  const breakdown = ref<InstanceType<typeof TableBreakdown>>()

  const props = withDefaults(
    defineProps<{
      type: boolean
      dataIncomeExpenditure: any
      selectListClient: any
    }>(),
    {
      type: false,
      dataIncomeExpenditure: {
        income_expenditure_details: [],
      },
      selectListClient: {
        options: [] as Record<string, string | number>[],
      },
    },
  )

  const emit = defineEmits<{
    (e: 'deleteRows', data: any): void
  }>()

  const dataBreakdown = ref<any[]>([])
  const dataIncome = ref<any[]>([])
  const dataDeposit = ref<any[]>([])
  const dataWithdraw = ref<any[]>([])
  const dataExpenditure = ref<any[]>([])

  const isErrorIncome = ref(false)
  const isErrorBreakdown = ref(false)

  const resetData = () => {
    dataBreakdown.value = []
    dataIncome.value = []
    dataDeposit.value = []
    dataWithdraw.value = []
    dataExpenditure.value = []
  }

  watch(
    () => props.dataIncomeExpenditure,
    () => {
      resetData()
      dataDeposit.value = props.dataIncomeExpenditure.income_expenditure_details?.filter(
        (item: any) => item.type === '1',
      )
      dataWithdraw.value = props.dataIncomeExpenditure.income_expenditure_details?.filter(
        (item: any) => item.type === '2',
      )
      dataIncome.value = props.dataIncomeExpenditure.income_expenditure_details?.filter(
        (item: any) => item.type === '3',
      )
      dataBreakdown.value = props.dataIncomeExpenditure.income_expenditure_details?.filter(
        (item: any) => item.type === '4',
      )
      const data = props.dataIncomeExpenditure.income_expenditure_details?.filter((item: any) => item.type === '4')
      data?.reduce((acc: any, item: any) => {
        if (!acc[item.type_fee]) {
          acc[item.type_fee] = {
            amount: item.amount,
            client_id: item.client_id,
            created_at: item.created_at,
            id: item.id,
            income_expenditure_id: item.income_expenditure_id,
            is_manual: item.is_manual,
            item_name: item.item_name,
            classification: item.classification,
            memo: [],
            number_transaction: item.number_transaction,
            previous_month: 0,
            profit: 0,
            rate: item.rate,
            type: item.type,
            type_fee: item.type_fee,
            updated_at: item.updated_at,
          }
          dataExpenditure.value.push(acc[item.type_fee])
        } else {
          if (item.item_name == '口座紹介手数料') {
            acc[item.type_fee] = {
              amount: item.amount,
              client_id: item.client_id,
              created_at: item.created_at,
              id: item.id,
              income_expenditure_id: item.income_expenditure_id,
              is_manual: item.is_manual,
              item_name: item.item_name,
              classification: item.classification,
              memo: [],
              number_transaction: item.number_transaction,
              previous_month: 0,
              profit: 0,
              rate: item.rate,
              type: item.type,
              type_fee: item.type_fee,
              updated_at: item.updated_at,
            }
            dataExpenditure.value.push(acc[item.type_fee])
          }
        }
        acc[item.type_fee].profit = roundDown(item.profit) + roundDown(acc[item.type_fee].profit)
        acc[item.type_fee].previous_month =
          roundDown(+item.previous_month) + roundDown(+acc[item.type_fee].previous_month)
        item.memo && acc[item.type_fee].memo.push(item.memo)
        return acc
      }, {})
    },
    { immediate: true },
  )

  const pushDataToSubmit = () => {
    if (!deposit.value || !withdraw.value || !miscellaneous.value || !breakdown.value) {
      return []
    } else {
      const data = []
      deposit.value?.getDataSubmit() && data.push(deposit.value.getDataSubmit())
      withdraw.value?.getDataSubmit() && data.push(withdraw.value.getDataSubmit())
      miscellaneous.value?.getDataSubmit() &&
        miscellaneous.value.getDataSubmit().length > 0 &&
        data.push(...miscellaneous.value.getDataSubmit())
      breakdown.value?.getDataSubmit() &&
        breakdown.value?.getDataSubmit().length &&
        data.push(...breakdown.value.getDataSubmit())
      return data
    }
  }

  const setErrorBreakdown = (err: boolean) => {
    return (isErrorBreakdown.value = err)
  }

  const setErrorIncome = (err: boolean) => {
    return (isErrorIncome.value = err)
  }

  const deleteRow = (val: any) => {
    emit('deleteRows', val)
  }

  defineExpose({
    pushDataToSubmit,
    isErrorIncome,
    isErrorBreakdown,
  })
</script>
<style lang="scss" scoped>
  .content-container {
    .header {
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 23px;
      margin-bottom: 10px;
    }
    .table-title {
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 23px;
      margin-bottom: 10px;
    }
    .table-content {
      margin-bottom: 25px;
    }
    .action-add {
      display: flex;
      align-items: center;
      padding-top: 13px;
      padding-bottom: 13px;
      cursor: pointer;
    }
  }
</style>
