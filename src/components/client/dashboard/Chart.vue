<template>
  <div class="row flex">
    <div class="md6 xs12 flex">
      <va-card>
        <va-card-content>
          <h3 class="section-title pb-3">{{ t('dashboard.payment') }}</h3>
          <div class="sub-title">
            <div>{{ t('account_usage_fee.amount') }}</div>
            <div>{{ t('account_usage_fee.number') }}</div>
          </div>
          <div style="height: 235px">
            <canvas id="myPayment"></canvas>
          </div>
          <div class="sub-title-bottom">
            <div>
              {{ t(`${subTitle === DATE_PICKER_TYPES.YEAR ? DATE_PICKER_TYPES.MONTH : DATE_PICKER_TYPES.DAY}`) }}
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>
    <div class="md6 xs12 flex">
      <va-card>
        <va-card-content>
          <h3 class="section-title pb-3">{{ t('dashboard.withdrawal') }}</h3>
          <div class="sub-title">
            <div>{{ t('account_usage_fee.amount') }}</div>
            <div>{{ t('account_usage_fee.number') }}</div>
          </div>
          <div style="height: 235px">
            <canvas id="myWithdrawal"></canvas>
          </div>
          <div class="sub-title-bottom">
            <div>
              {{ t(`${subTitle === DATE_PICKER_TYPES.YEAR ? DATE_PICKER_TYPES.MONTH : DATE_PICKER_TYPES.DAY}`) }}
            </div>
          </div>
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { watch, onMounted, reactive } from 'vue'
  import Chart, { ChartItem } from 'chart.js/auto'
  import { DATE_PICKER_TYPES } from '../../../common/constants'
  const { t, locale } = useI18n()
  let chart1 = undefined as any
  let chart2 = undefined as any

  const props = defineProps<{
    deposit: {
      label: string[]
      dataAmount: number[]
      dataTrans: number[]
    }
    withdrawals: {
      label: string[]
      dataAmount: number[]
      dataTrans: number[]
    }
    subTitle: string
  }>()

  const optionsChart = reactive({
    plugins: {
      legend: { display: false },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        position: 'left',
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  })

  const renderChart = () => {
    const ctxPayment = document.getElementById('myPayment') as ChartItem
    const ctxWithdrawal = document.getElementById('myWithdrawal') as ChartItem

    chart1 = new Chart(ctxPayment, {
      data: {
        datasets: [
          {
            type: 'line',
            label: t('account_usage_fee.amount'),
            data: props.deposit?.dataAmount,
            borderColor: '#004AFF',
            yAxisID: 'y',
            borderWidth: 1.5,
            pointRadius: 3,
            pointHoverRadius: 3,
          },
          {
            type: 'bar',
            label: t('account_usage_fee.number'),
            data: props.deposit?.dataTrans,
            backgroundColor: ' #79DAFF',
            yAxisID: 'y1',
          },
        ],
        labels: props.deposit?.label,
      },
      options: optionsChart,
    })

    chart2 = new Chart(ctxWithdrawal, {
      data: {
        datasets: [
          {
            type: 'line',
            label: t('account_usage_fee.amount'),
            data: props.withdrawals?.dataAmount,
            borderColor: '#004AFF',
            yAxisID: 'y',
            borderWidth: 1.5,
            pointRadius: 3,
            pointHoverRadius: 3,
          },
          {
            type: 'bar',
            label: t('account_usage_fee.number'),
            data: props.withdrawals?.dataTrans,
            backgroundColor: ' #79DAFF',
            yAxisID: 'y1',
          },
        ],
        labels: props.withdrawals?.label,
      },
      options: optionsChart,
    })
  }

  onMounted(() => {
    renderChart()
  })

  watch(props, () => {
    chart1.clear()
    chart1.destroy()
    chart2.clear()
    chart2.destroy()
    renderChart()
  })

  watch(locale, () => {
    chart1.clear()
    chart1.destroy()
    chart2.clear()
    chart2.destroy()
    renderChart()
  })
</script>

<style lang="scss" scoped>
  .sub-title {
    display: flex;
    font-size: 12px;
    color: #9b9b9b;
    margin-bottom: 5px;
    justify-content: space-between;
  }

  .sub-title-bottom {
    display: flex;
    font-size: 12px;
    color: #9b9b9b;
    justify-content: center;
  }
</style>
