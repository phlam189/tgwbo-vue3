<template>
  <div class="cus-tabel-wrapper">
    <table>
      <!-- Header table -->
      <thead>
        <tr>
          <th class="border-bottom-2 va-text-center" rowspan="2" colspan="3" style="min-width: 260px">
            {{ t('dashboard.client') }}
          </th>
          <th class="border-bottom" colspan="3">{{ showTextColumn }}</th>
          <th class="border-bottom">{{ t('dashboard.account_transfer') }}</th>
          <th class="border-bottom" colspan="2">{{ t('dashboard.other_charge') }}</th>
          <th class="border-bottom" colspan="2">{{ t('dashboard.settlement') }}</th>
          <th class="border-bottom" colspan="3">{{ t('dashboard.refund') }}</th>
          <th class="border-bottom">{{ t('dashboard.system_fee') }}</th>
          <th class="border-bottom-2" rowspan="2" style="min-width: 150px">{{ t('dashboard.account_balance') }}</th>
          <th class="border-bottom-2" rowspan="2" style="width: 150px">{{ t('dashboard.memo') }}</th>
          <th class="border-bottom" colspan="3">{{ t('dashboard.others') }}</th>
          <th class="border-bottom-2" rowspan="2" style="min-width: 150px">{{ t('dashboard.actual_balance') }}</th>
          <th class="border-bottom-2" rowspan="2" style="width: 150px">{{ t('dashboard.admin_note') }}</th>
        </tr>
        <tr>
          <th style="min-width: 74px">{{ t('dashboard.number') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.commission') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.commission') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.commission') }}</th>
          <th style="min-width: 74px">{{ t('dashboard.number') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.commission') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.subject') }}</th>
          <th style="min-width: 110px">{{ t('dashboard.amount_of_money') }}</th>
          <th style="min-width: 110px" class="border-right">{{ t('dashboard.commission') }}</th>
        </tr>
      </thead>

      <!-- Body table -->
      <tbody>
        <template v-if="props.list?.length > 0">
          <template v-for="(item, index) in props.list" :key="index">
            <tr
              v-if="
                props.typeSearch !== 'deposits_and_withdrawals' ||
                (props.typeSearch === 'deposits_and_withdrawals' && index % 2 === 0)
              "
              :class="{ 'select-row': selected.includes(item?.client_id) }"
            >
              <td :rowspan="props.typeSearch === 'deposits_and_withdrawals' ? 2 : 1" class="row-select fixed-column1">
                <va-checkbox v-model="selected" :array-value="item?.client_id" />
              </td>
              <td class="first-column fixed-column2" :rowspan="props.typeSearch === 'deposits_and_withdrawals' ? 2 : 1">
                <div>{{ item.represent_name }}</div>
              </td>
              <td class="border-right-flex fixed-column3">
                <div>
                  {{ props.typeSearch === 'withdrawal' ? t('cs_dashboard.withdrawal') : t('cs_dashboard.payment') }}
                </div>
              </td>
              <td class="text-right">
                <div>{{ formatNumber(item.number_trans) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.commission_bank_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.transfer_amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.charge_amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.charge_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.settlement_amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.settlement_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatNumber(item.number_refunds) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.refund_amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.refund_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.system_usage_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.account_balance) }}</div>
              </td>
              <td
                v-if="
                  item.charge_history &&
                  item.charge_history.length > 0 &&
                  (props.typeSelectDate === DATE_PICKER_TYPES.DAY || props.typeSelectDate === DATE_PICKER_TYPES.TODAY)
                "
                :class="`${item.charge_history ? 'hover-text' : ''}`"
              >
                <div class="row-note">
                  <div v-for="(note, number) in item.charge_history" :key="number">
                    <template v-if="note.memo">
                      <div v-if="note.memo?.length > 15">
                        -
                        {{ `${note.memo?.length > 15 ? note.memo.slice(0, 15) + '...' : note.memo || ''}` }}
                      </div>
                      <div v-else>
                        <p style="color: #788b9a">- {{ note.memo }}</p>
                      </div>
                      <div id="fade" class="tooltip-text">
                        <template v-for="(notes, num) in item.charge_history" :key="num">
                          <div v-if="notes.memo">- {{ notes.memo }}</div>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </td>
              <td v-else></td>
              <td class="text-right"></td>
              <td class="text-right"></td>
              <td class="text-right"></td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.actual_balance) }}</div>
              </td>
              <td
                v-if="
                  item.charge_history &&
                  item.charge_history.length > 0 &&
                  (props.typeSelectDate === DATE_PICKER_TYPES.DAY || props.typeSelectDate === DATE_PICKER_TYPES.TODAY)
                "
                :class="`${item.charge_history ? 'hover-text' : ''}`"
              >
                <div class="row-note">
                  <div v-for="(note, number) in item.charge_history" :key="number">
                    <template v-if="note.memo_internal">
                      <div v-if="note.memo_internal?.length > 15">
                        -
                        {{
                          `${
                            note.memo_internal?.length > 15
                              ? note.memo_internal.slice(0, 15) + '...'
                              : note.memo_internal || ''
                          }`
                        }}
                      </div>
                      <div v-else>
                        <p style="color: #788b9a">- {{ note.memo_internal }}</p>
                      </div>
                      <div id="fade" class="tooltip-text">
                        <template v-for="(notes, num) in item.charge_history" :key="num">
                          <div v-if="notes.memo_internal">- {{ notes.memo_internal }}</div>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </td>
              <td v-else></td>
            </tr>
            <tr
              v-if="props.typeSearch === 'deposits_and_withdrawals' && index % 2 === 1"
              class="row-second"
              :class="{ 'select-row': selected.includes(item.client_id) }"
            >
              <td class="border-right-flex fixed-column4">{{ t('cs_dashboard.withdrawal') }}</td>
              <td class="text-right">
                <div>{{ formatNumber(item.number_trans) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.commission_bank_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.transfer_amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.charge_amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.charge_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.settlement_amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.settlement_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatNumber(item.number_refunds) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.refund_amount) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.refund_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.system_usage_fee) }}</div>
              </td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.account_balance) }}</div>
              </td>
              <td
                v-if="
                  item.charge_history &&
                  item.charge_history.length > 0 &&
                  (props.typeSelectDate === DATE_PICKER_TYPES.DAY || props.typeSelectDate === DATE_PICKER_TYPES.TODAY)
                "
                :class="`${item.charge_history ? 'hover-text' : ''}`"
              >
                <div class="row-note">
                  <div v-for="(note, number) in item.charge_history" :key="number">
                    <template v-if="note.memo">
                      <div v-if="note.memo?.length > 15">
                        -
                        {{ `${note.memo?.length > 15 ? note.memo.slice(0, 15) + '...' : note.memo || ''}` }}
                      </div>
                      <div v-else>
                        <p style="color: #788b9a">- {{ note.memo }}</p>
                      </div>
                      <div id="fade" class="tooltip-text">
                        <template v-for="(notes, num) in item.charge_history" :key="num">
                          <div v-if="notes.memo">- {{ notes.memo }}</div>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </td>
              <td v-else></td>
              <td class="text-right"></td>
              <td class="text-right"></td>
              <td class="text-right"></td>
              <td class="text-right">
                <div>{{ formatCurrency.func(item.actual_balance) }}</div>
              </td>
              <td
                v-if="
                  item.charge_history &&
                  item.charge_history.length > 0 &&
                  (props.typeSelectDate === DATE_PICKER_TYPES.DAY || props.typeSelectDate === DATE_PICKER_TYPES.TODAY)
                "
                :class="`${item.charge_history ? 'hover-text' : ''}`"
              >
                <div class="row-note">
                  <div v-for="(note, number) in item.charge_history" :key="number">
                    <template v-if="note.memo_internal">
                      <div v-if="note.memo_internal?.length > 15">
                        -
                        {{
                          `${
                            note.memo_internal?.length > 15
                              ? note.memo_internal.slice(0, 15) + '...'
                              : note.memo_internal || ''
                          }`
                        }}
                      </div>
                      <div v-else>
                        <p style="color: #788b9a">- {{ note.memo_internal }}</p>
                      </div>
                      <div id="fade" class="tooltip-text">
                        <template v-for="(notes, num) in item.charge_history" :key="num">
                          <div v-if="notes.memo_internal">- {{ notes.memo_internal }}</div>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </td>
              <td v-else></td>
            </tr>
          </template>
        </template>
        <tr v-else>
          <td colspan="23" class="va-text-center va-text-danger">{{ t('list_no_data') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { watch, ref, computed, defineProps, defineEmits } from 'vue'
  import ClientAggregation from '../../types/ClientAggregation'
  import { formatCurrency, formatNumber } from '../../common/utils'
  import { DATE_PICKER_TYPES, DEPOSIT_AND_WITHDRAWAL_TEXT } from '../../common/constants'
  const selected = ref<number[]>([])
  const { t } = useI18n()

  const props = defineProps<{
    typeSearch: string
    typeSelectDate: string
    list: ClientAggregation[]
  }>()

  // watch(
  //   () => props.list,
  //   () => {
  //     selected.value = []
  //   },
  //   { deep: true },
  // )

  const emit = defineEmits<{
    (e: 'selectedRow', row: number[]): void
  }>()

  const showTextColumn = computed(() => {
    if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT) {
      return t('dashboard.payment')
    } else if (props.typeSearch === DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL) {
      return t('dashboard.withdrawal')
    } else {
      return t('dashboard.deposits_and_withdrawals')
    }
  })

  watch(selected, () => {
    if (selected.value.length > 1) {
      selected.value = selected.value.slice(-1)
      emit('selectedRow', selected.value.slice(-1))
    } else {
      emit('selectedRow', selected.value)
    }
  })
</script>
<style lang="scss" scoped>
  .fixed-column1 {
    position: sticky;
    left: 0px;
    background-color: #ffffff;
    z-index: 100;
  }
  .fixed-column2 {
    position: sticky;
    left: 24px;
    background-color: #ffffff;
    z-index: 100;
  }
  .fixed-column3 {
    position: sticky;
    left: 204px;
    background-color: #ffffff;
    z-index: 100;
  }
  .fixed-column4 {
    position: sticky;
    left: 204px;
    background-color: #f5f8f9;
    z-index: 100;
  }
  .row-select {
    border-right: none !important;
    padding-left: 4px;
    padding-right: 0px;
    padding-top: 14px;
    width: 24px;
  }
  :deep(.va-checkbox__square) {
    scale: 0.8;
  }
  :deep(.va-checkbox) {
    position: relative;
    top: calc(50% - 10px);
  }
  .cus-tabel-wrapper {
    overflow: scroll;
    max-height: 540px;
    table {
      width: max-content;
      min-width: 100%;
      .first-column {
        width: 180px;
        vertical-align: middle;
        z-index: 100;
      }
      thead {
        position: sticky;
        top: 0px;
        background-color: #ffffff;
        z-index: 999;
        tr:first-child {
          th {
            border-top: 1px solid #06152b !important;
          }
          th:first-child {
            border-right: 1px solid #06152b;
            position: sticky;
            left: 0px;
            background-color: #ffffff;
          }
        }
        tr:last-child {
          th {
            padding-top: 3px;
            padding-bottom: 3px;
          }
        }
      }

      tbody {
        td {
          border-bottom: 1px solid #cccccc;
          div {
            overflow: unset !important;
          }
        }
      }
    }

    .border-bottom {
      border-bottom: 1px solid #cccccc;
    }
    .border-bottom-2 {
      border-bottom: 1px solid #06152b;
    }
    .border-right {
      border-right: 1px solid #cccccc;
    }
    .border-right-flex {
      border-right: 1px solid #06152b;
    }
    .row-second {
      td {
        border-bottom: 1px solid #cccccc;
      }
    }
    .row-note {
      height: 17px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .hover-text {
      .tooltip-text {
        top: -70px;
        left: -23%;
        z-index: 999;
      }
    }
  }
</style>
