<template>
  <div class="row section-second-wrapper row-equal">
    <!-- Widget 1 -->
    <div class="flex flex-row sm12 lg2">
      <div class="widget h-full bg-white">
        <template v-if="aggregationTodayBalance && formatNumberCurrency(aggregationTodayBalance).length > 15">
          <va-popover placement="top">
            <h4 class="money-title d-block text-primary content-dot">
              {{ formatNumberCurrency(aggregationTodayBalance) }}
            </h4>
            <template #body>
              <p style="color: #788b9a">{{ formatNumberCurrency(aggregationTodayBalance) }}</p>
            </template>
          </va-popover>
        </template>
        <h4 v-else class="money-title text-primary">
          {{ formatNumberCurrency(aggregationTodayBalance) }}
        </h4>
        <div>
          <p class="va-text-uppercase" :style="{ opacity: 0.5, 'font-size': '18px', 'line-height': '26px' }">
            {{ t('cs_dashboard.total_balance') }}
          </p>
          <p style="color: #06152b; line-height: 23px">{{ today }}</p>
        </div>
      </div>
    </div>

    <!-- Widget 2 -->
    <div class="flex flex-row sm12 lg5">
      <div class="widget widget-second bg-white">
        <div class="widget-title c-mb-12">{{ t('dashboard.today') }}</div>
        <div class="flex item-wrapper">
          <div class="item">
            <div class="item-row item-first">
              <div class="item-row-label">
                <span>{{ t('dashboard.deposit_account_balance') }} :</span>
              </div>
              <div class="item-row-value">
                <span>
                  {{ formatNumberCurrency(aggregationToday.today_total_deposit_balance) }}
                </span>
              </div>
            </div>
            <div class="item-row item-first">
              <div class="item-row-label">
                <span>{{ t('dashboard.number_of_deposits') }} :</span>
              </div>
              <div class="item-row-value">
                <span>{{ formatNumber(aggregationToday.today_number_deposit) }}</span>
              </div>
            </div>
            <div class="item-row item-first">
              <div class="item-row-label">
                <span>{{ t('dashboard.total_deposit_amount') }} :</span>
              </div>
              <div class="item-row-value">
                <span> {{ formatNumberCurrency(aggregationToday.today_deposit_amount) }} </span>
              </div>
            </div>
            <div class="item-row" style="padding-right: 20px">
              <span class="item-row-label">{{ t('cs_dashboard.unknown_deposits') }} :</span>
              <span class="item-row-value" style="color: #eb09b9; justify-self: right">
                {{ formatNumber(aggregationToday.today_number_scheduled_scrappers) }}
                {{ locale == LANGUAGES.JAPANESE ? '件' : '' }}/{{
                  formatNumberCurrency(aggregationToday.today_scheduled_scrappers_amount)
                }}
              </span>
            </div>
          </div>

          <div class="item">
            <div class="item-row">
              <div class="item-row-label">
                <span>{{ t('dashboard.withdrawal_account_balance') }} :</span>
              </div>
              <div class="item-row-value">
                <span>
                  {{ formatNumberCurrency(aggregationToday.today_total_withdrawal_amount) }}
                </span>
              </div>
            </div>
            <div class="item-row">
              <div class="item-row-label">
                <span>{{ t('dashboard.number_of_withdrawals') }} :</span>
              </div>
              <div class="item-row-value">
                <span>{{ formatNumber(aggregationToday.today_number_withdrawal) }}</span>
              </div>
            </div>
            <div class="item-row">
              <div class="item-row-label">
                <span>{{ t('dashboard.total_withdrawal_amount') }} :</span>
              </div>
              <div class="item-row-value">
                <span>
                  {{ formatNumberCurrency(aggregationToday.today_withdrawal_amount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Widget 3 -->
    <div class="flex flex-row sm12 lg5">
      <div class="widget h-full widget-third bg-white">
        <div class="widget-title c-mb-12">{{ textMonth }}</div>
        <div class="flex item-wrapper">
          <div class="item item-first">
            <div class="item-row">
              <div class="item-row-label">
                <span>{{ t('dashboard.deposit_account_balance') }} :</span>
              </div>
              <div class="item-row-value">
                <span>
                  {{ formatNumberCurrency(aggregationMonth.deposit_account_balance) }}
                </span>
              </div>
            </div>
            <div class="item-row">
              <div class="item-row-label">
                <span>{{ t('dashboard.number_of_deposits') }} :</span>
              </div>
              <div class="item-row-value">
                <span>{{ formatNumber(aggregationMonth.number_of_deposits) }}</span>
              </div>
            </div>
            <div class="item-row">
              <div class="item-row-label">
                <span>{{ t('dashboard.total_deposit_amount') }} :</span>
              </div>
              <div class="item-row-value">
                <span> {{ formatNumberCurrency(aggregationMonth.total_deposit_amount) }} </span>
              </div>
            </div>
          </div>

          <div class="item item-second">
            <div class="item-row">
              <div class="item-row-label">
                <span>{{ t('dashboard.withdrawal_account_balance') }} :</span>
              </div>
              <div class="item-row-value">
                <span>
                  {{ formatNumberCurrency(aggregationMonth.withdrawal_account_balance) }}
                </span>
              </div>
            </div>
            <div class="item-row">
              <div class="item-row-label">
                <span>{{ t('dashboard.number_of_withdrawals') }} :</span>
              </div>
              <div class="item-row-value">
                <span>{{ formatNumber(aggregationMonth.number_of_withdrawals) }}</span>
              </div>
            </div>
            <div class="item-row">
              <div class="item-row-label">
                <span>{{ t('dashboard.total_withdrawal_amount') }} :</span>
              </div>
              <div class="item-row-value">
                <span>
                  {{ formatNumberCurrency(aggregationMonth.total_withdrawal_amount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineProps } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    convertDateString,
    convertDateToString,
    convertYearString,
    formatNumber,
    formatNumberCurrency,
    roundUp,
  } from '../../../common/utils'
  import { DATE_PICKER_TYPES, LANGUAGES } from '../../../common/constants'

  const { t, locale } = useI18n()

  export type aggregationTodayProps = {
    balance: string
    today_total_deposit_balance: string
    today_number_deposit: number
    today_deposit_amount: string
    today_number_scheduled_scrappers: number
    today_total_withdrawal_amount: string
    today_number_withdrawal: number
    today_withdrawal_amount: string
    today_scheduled_scrappers_amount: string
  }

  export type aggregationMonthProps = {
    deposit_account_balance: string
    number_of_deposits: number
    total_deposit_amount: string
    withdrawal_account_balance: string
    number_of_withdrawals: number
    total_withdrawal_amount: string
  }

  const props = defineProps<{
    aggregationToday: aggregationTodayProps
    aggregationMonth: aggregationMonthProps
    typeSelectDate: string
    date: any
  }>()

  const aggregationToday = computed(() => {
    return props.aggregationToday
  })

  const aggregationMonth = computed(() => {
    return props.aggregationMonth
  })

  const aggregationTodayBalance = computed(() => {
    const depositBalance = aggregationToday.value.today_total_deposit_balance
    const withdrawalBalance = aggregationToday.value.today_total_withdrawal_amount
    return `${roundUp(Number(depositBalance) + Number(withdrawalBalance))}`
  })

  const today = computed(() => {
    return convertDateToString(new Date())
  })

  const textMonth = computed(() => {
    const dateMonth = props.date ? new Date(props.date) : new Date()
    if (props.typeSelectDate === DATE_PICKER_TYPES.YEAR) {
      return convertYearString(dateMonth)
    }
    return convertDateString(dateMonth)
  })
</script>

<style lang="scss" scoped>
  .row-equal .flex {
    .va-card {
      height: 100%;
    }
  }
  .section-second-wrapper {
    .widget {
      min-height: 120px;
      color: #435564;
      border-radius: 10px;
      padding: 17px 12px 12px 12px;

      .money-title {
        font-weight: 700;
        font-size: 23px;
        line-height: 43px;
      }
    }

    .widget-second,
    .widget-third {
      font-size: 14px;
      padding: 12px;
      .widget-title {
        font-weight: 700;
        color: #06152b;
      }
      .item-wrapper {
        padding: 0px !important;
        justify-content: space-between;
        display: flex;
        .item {
          text-align: left;
          font-size: 14px;
          .item-row-label,
          .item-row-value {
            display: inline-block;
          }
          .item-row {
            justify-content: space-between;
            display: flex;
            line-height: 22px;
            .item-row-value {
              font-weight: 700;
              width: max-content;
              text-align: right;
              color: #1c78dd;
            }
            .item-row-label {
              font-size: 13px;
              color: #435564;
            }
          }
          .item-row-bottom {
            line-height: 22px;
            .item-row-value {
              font-weight: 700;
              width: max-content;
              text-align: right;
              color: #1c78dd;
            }
            .item-row-label {
              font-size: 13px;
              color: #435564;
            }
          }
        }
        .item-first {
          padding-right: 10px;
          margin-right: 10px;
          border-right: 1px solid rgba(224, 224, 224, 0.5);
        }
      }
      .item-wrapper:first-child {
        padding: 30px;
      }
    }
  }
</style>
