<template>
  <div class="d-flex">
    <va-button-group preset="secondary" border-color="primary" class="c-mr-10">
      <va-button
        :class="{ 'btn-active': isShowDeposit }"
        color="#1C78DD"
        border-color="#1C78DD"
        size="medium"
        @click="handleChangeTypeSearch(DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT)"
      >
        {{ t('cs_dashboard.payment') }}
      </va-button>
      <va-button
        :class="{ 'btn-active': isShowWithdrawal }"
        class="btn-border"
        color="#1C78DD"
        border-color="#1C78DD"
        size="medium"
        @click="handleChangeTypeSearch(DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL)"
      >
        {{ t('dashboard.withdrawal') }}
      </va-button>
      <va-button
        :class="{ 'btn-active': isShowAll }"
        color="#1C78DD"
        border-color="#1C78DD"
        size="medium"
        @click="handleChangeTypeSearch(DEPOSIT_AND_WITHDRAWAL_TEXT.ALL)"
      >
        {{ t('cs_dashboard.deposits_and_withdrawals') }}
      </va-button>
    </va-button-group>
    <template v-if="!props.disableZoomAndCSV">
      <va-button color="secondary" size="medium" class="c-mr-10" @click="onDownload">CSV</va-button>
      <SetTableDropdown @selected-row="handleSelectRow">
        <template #content>
          <va-button color="#1C78DD" preset="secondary" border-color="#1C78DD" size="medium" class="btn-zoom c-mr-10">
            <va-icon name="vuestic-iconset-tables" size="medium" />
          </va-button>
        </template>
      </SetTableDropdown>
      <va-button v-if="props.showZoomOut" color="secondary" size="medium" class="btn-zoom" @click="handleZoomOut">
        <va-icon class="material-icons" size="medium"> zoom_out_map </va-icon>
      </va-button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent, defineProps, defineEmits } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { DEPOSIT_AND_WITHDRAWAL_TEXT } from '../../common/constants'
  const { t } = useI18n()

  const SetTableDropdown = defineAsyncComponent(() => import('../navbar/components/dropdowns/SetTableDropdown.vue'))

  const props = defineProps<{
    typeSearch: string
    disableZoomAndCSV?: boolean
    showZoomOut?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'changeTypeSearch', type: string): void
    (e: 'zoomOut'): void
    (e: 'onDownload'): void
    (e: 'selectedColumn', value: string[]): void
  }>()

  const isShowDeposit = computed(() => {
    return DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT === props.typeSearch
  })

  const isShowWithdrawal = computed(() => {
    return DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL === props.typeSearch
  })

  const isShowAll = computed(() => {
    return DEPOSIT_AND_WITHDRAWAL_TEXT.ALL === props.typeSearch
  })

  const handleChangeTypeSearch = (type: string) => {
    emit('changeTypeSearch', type)
  }

  const handleZoomOut = () => {
    emit('zoomOut')
  }

  const onDownload = () => {
    emit('onDownload')
  }

  const handleSelectRow = (value: string[]) => {
    emit('selectedColumn', value)
  }
</script>

<style lang="scss" scoped>
  :deep(.btn-zoom) {
    .va-button__content {
      padding: 8px;
    }
  }
  :deep(.va-button__content) {
    font-weight: 500;
  }
</style>
