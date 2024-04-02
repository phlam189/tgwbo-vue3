<template>
  <div class="client-charge-history">
    <div>
      <h1 class="page-title">{{ t('cs_charge_history.charge_history') }}</h1>
      <SelectDatePicker v-model="date" :type="typeSelectDate" />
    </div>
    <va-card class="c-mt-30">
      <va-card-content>
        <span class="page-title-card">{{ t('cs_charge_history.charge_history') }}</span>

        <div class="cus-tabel-wrapper">
          <table>
            <colgroup>
              <col width="165" />
              <col width="100" />
              <col width="290" />
              <col width="290" />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th class="va-text-center">{{ t('cs_charge_history.date') }}</th>
                <th class="va-text-center">{{ t('cs_charge_history.kinds') }}</th>
                <th class="va-text-center">{{ t('cs_charge_history.amount_of_money') }}</th>
                <th class="va-text-center">{{ t('cs_charge_history.commission') }}</th>
                <th class="va-text-center">{{ t('cs_charge_history.memo') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="5">
                  <div class="d-flex justify-center">
                    <va-progress-circle size="small" indeterminate />
                  </div>
                </td>
              </tr>
              <template v-else>
                <template v-for="group in chargeHistoryListGroup" :key="group.key">
                  <tr v-for="record in group.items" :key="record.id">
                    <td class="va-text-left">
                      {{ convertDateToString(record.create_date) }}
                    </td>
                    <td class="va-text-left">{{ getChargeHistoryType(record.type) }}</td>
                    <td class="va-text-right">{{ formatCurrency.func(record.payment_amount) }}</td>
                    <td class="va-text-right">{{ formatCurrency.func(record.charge_fee) }}</td>
                    <td :class="`${record.memo ? 'hover-text' : ''}`">
                      <template v-if="record.memo">
                        <div v-if="record.memo?.length > 90">
                          -
                          {{ `${record.memo?.length > 90 ? record.memo.slice(0, 90) + '...' : record.memo || ''}` }}
                          <div id="fade" class="tooltip-text">- {{ record.memo }}</div>
                        </div>
                        <div v-else>
                          <p style="color: #788b9a">- {{ record.memo }}</p>
                        </div>
                      </template>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5" class="col-sum-month bg-primary text-white va-text-center">
                      <span>
                        {{ getMonth(group.key, locale) }} {{ t('cs_charge_history.total') }}：
                        {{ t('cs_charge_history.deposit') }}
                        {{ formatNumber(getChargeHistoryDepositTotal) }}円
                      </span>
                      <span v-for="n in 10" :key="n">&nbsp;</span>
                      <span>
                        {{ t('cs_charge_history.settlement') }}
                        {{ formatNumber(getChargeHistorySettementTotal) }}円
                      </span>
                    </td>
                  </tr>
                </template>

                <tr v-if="!chargeHistoryListGroup.length">
                  <td colspan="5" class="va-text-center">{{ t('list_no_data') }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div v-if="checkPaginate" class="va-text-center mt-3 flex align-center">
          <Pagination v-model="currentPage" :totals="chargeHistoryList.length" :page-size="pageSizes" />
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed, watch, defineAsyncComponent, Ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import moment from 'moment'

  import { useGlobalStore } from '../../../stores/global-store'
  import ChargeHistoryService from '../../../services/ChargeHistoryService'
  import { ChargeHistoryItem, ChargeHistoryGroup } from '../../../types/ChargeHistory'
  import { convertDateToString, formatCurrency, formatNumber, getMonth, roundUp } from '../../../common/utils'
  import { CHARGE_HISTORY_TYPE, DATE_PICKER_TYPES, YYYY_MM_DD } from '../../../common/constants'
  import SelectDatePicker from '../../../components/select-date-picker/index.vue'
  import { ChargeHistoryGetParams } from '../../../types/ChargeHistory'

  const Pagination = defineAsyncComponent(() => import('../../../components/pagination/Pagination.vue'))

  const { t, locale } = useI18n()

  const GlobalStore = useGlobalStore()
  const chargeHistoryList = ref<ChargeHistoryItem[]>([])
  const isLoading = ref(false)
  const typeSelectDate = ref(DATE_PICKER_TYPES.MONTH)
  const date = ref(new Date())
  const currentPage: Ref<number> = ref(1)
  const pageSizes: Ref<number> = ref(15)
  const dataChargeHistory = ref<any[]>([])

  const checkPaginate = computed(() => {
    return chargeHistoryList.value.length > 10 ? true : false
  })

  const chargeHistoryListGroup = computed(() => {
    let result: ChargeHistoryGroup[] = []
    dataChargeHistory.value?.forEach((record) => {
      const index = result.findIndex((item) => moment(item.key).isSame(record.create_date, 'month'))

      if (index !== -1) {
        result[index].items.push(record)
      } else {
        result = [...result, { key: record.create_date, items: [record] }]
      }
    })
    return result
  })

  const setDataChargeHistory = () => {
    dataChargeHistory.value = chargeHistoryList.value
    dataChargeHistory.value = dataChargeHistory.value?.slice(
      currentPage.value - 1,
      currentPage.value + pageSizes.value - 1,
    )
  }

  const getChargeHistoryList = async (dateTime: Date) => {
    isLoading.value = true

    const date = moment(dateTime).format(YYYY_MM_DD)
    const clientId = GlobalStore.clientId
    const chargeHistoryGetParams: ChargeHistoryGetParams = {
      client_id: clientId,
      from_date: date,
      to_date: date,
      all_type: 1,
    }

    const data = await ChargeHistoryService.getChargeHistoryList(chargeHistoryGetParams)

    chargeHistoryList.value = data.filter(
      (item: any) => item.type === CHARGE_HISTORY_TYPE.SETTLEMENT || item.type === CHARGE_HISTORY_TYPE.CHARGE,
    )
    setDataChargeHistory()

    isLoading.value = true
  }

  const getChargeHistoryType = (type: number) => {
    switch (type) {
      case CHARGE_HISTORY_TYPE.SETTLEMENT:
        return t('cs_charge_history.settlement')
      case CHARGE_HISTORY_TYPE.CHARGE:
        return t('cs_charge_history.deposit')
      default:
        return ''
    }
  }

  const getChargeHistoryDepositTotal = computed(() => {
    return chargeHistoryList.value.reduce((total, record) => {
      if (record.type === CHARGE_HISTORY_TYPE.CHARGE) {
        return roundUp(total) + roundUp(record.payment_amount)
      }

      return total
    }, 0)
  })

  const getChargeHistorySettementTotal = computed(() => {
    return chargeHistoryList.value.reduce((total, record) => {
      if (record.type === CHARGE_HISTORY_TYPE.SETTLEMENT) {
        return roundUp(total) + roundUp(record.payment_amount)
      }

      return total
    }, 0)
  })

  watch(date, (newValue) => {
    getChargeHistoryList(newValue).finally(() => {
      isLoading.value = false
    })
  })

  watch(currentPage, setDataChargeHistory)

  onMounted(() => {
    getChargeHistoryList(date.value).finally(() => {
      isLoading.value = false
    })
  })
</script>

<style lang="scss" scoped>
  .ellipsis-multiline {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .cus-tabel-wrapper table {
    table-layout: fixed;
  }

  .page-title {
    display: inline-block;
  }

  .page-title-card {
    display: inline-block;
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 23px;
    color: #06152b;
    padding-bottom: 17px;
  }
</style>
