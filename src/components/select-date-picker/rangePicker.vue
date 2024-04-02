<template>
  <va-popover
    v-model="open"
    :placement="props.placement"
    :auto-hide="false"
    :auto-placement="false"
    :close-on-content-click="false"
    trigger="click"
    :stateful="false"
  >
    <va-button
      color="#1C78DD"
      class="btn-select-date"
      :hover-opacity="0"
      :style="{ 'min-width': widthButton }"
      preset="secondary"
    >
      <span @click="handleOpenPopover">
        {{ convertDateToString(props.modelValue.start) }} ~ {{ convertDateToString(props.modelValue.end) }}
      </span>
    </va-button>
    <template #body>
      <div>
        <template v-if="!disabledCus">
          <va-date-picker
            v-model="modelRange"
            mode="range"
            :month-names="MONTHS"
            :weekday-names="WEEKDAYS"
            :type="DATE_PICKER_TYPES.DAY"
            :allowed-days="disabledFutureDate"
            show-other-months
          >
            <template #day="{ date }"> {{ date.getDate() }}</template>
            <template #year="{ year }">
              {{ year }}
              <span v-if="locale == LANGUAGES.JAPANESE">{{ t(DATE_PICKER_TYPES.YEAR) }}</span>
            </template>
          </va-date-picker>
        </template>
        <va-date-picker
          v-else-if="disabledCus === 'none'"
          v-model="modelRange"
          mode="range"
          :month-names="MONTHS"
          :weekday-names="WEEKDAYS"
          :type="DATE_PICKER_TYPES.DAY"
          show-other-months
        >
          <template #day="{ date }"> {{ date.getDate() }}</template>
          <template #year="{ year }">
            {{ year }}
            <span v-if="locale == LANGUAGES.JAPANESE">{{ t(DATE_PICKER_TYPES.YEAR) }}</span>
          </template>
        </va-date-picker>
        <va-date-picker
          v-else
          v-model="modelRange"
          mode="range"
          :month-names="MONTHS"
          :weekday-names="WEEKDAYS"
          :type="DATE_PICKER_TYPES.DAY"
          :allowed-days="disabledPeriodDate"
          show-other-months
        >
          <template #day="{ date }"> {{ date.getDate() }}</template>
          <template #year="{ year }">
            {{ year }}
            <span v-if="locale == LANGUAGES.JAPANESE">{{ t(DATE_PICKER_TYPES.YEAR) }}</span>
          </template>
        </va-date-picker>
      </div>
    </template>
  </va-popover>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref } from 'vue'
  import { watch } from 'vue'
  import { computed } from 'vue'
  import { DATE_PICKER_TYPES, LANGUAGES, MONTH_NAMES } from '../../common/constants'
  import { WEEKDAY_NAMES } from '../../common/constants'
  import moment from 'moment'
  import { convertDateToString } from '../../common/utils'

  const { t, locale } = useI18n()

  const open = ref(false)

  const WEEKDAYS = computed(() => {
    return WEEKDAY_NAMES.map((item) => t(item))
  })

  const MONTHS = computed(() => {
    return MONTH_NAMES.map((item) => t(item))
  })

  const props = defineProps({
    placement: {
      type: String,
      default: 'bottom',
    },
    isInput: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
      default: () => {
        return { start: new Date(), end: new Date() }
      },
    },
    disabledCus: {
      type: String,
      required: false,
      default: null,
    },
  })

  const widthButton = computed(() => {
    return '250px'
  })

  const disabledFutureDate = (date: any) => {
    return date && date <= moment().endOf('day')
  }

  const disabledPeriodDate = (date: any) => {
    return date && moment(date).isSameOrAfter(moment(props.disabledCus).startOf('day'))
  }

  const emit = defineEmits(['update:modelValue'])

  const modelRange = ref()

  const handleOpenPopover = async () => {
    setTimeout(() => {
      open.value = !open.value
    }, 100)
  }

  watch(
    () => props.modelValue,
    () => {
      modelRange.value = props.modelValue
    },
    { immediate: true },
  )

  watch(modelRange, () => {
    emit('update:modelValue', modelRange.value)
    if (!modelRange.value.start && !modelRange.value.end) {
      modelRange.value = { start: new Date(), end: new Date() }
    }
    if (modelRange.value.start && modelRange.value.end) {
      open.value = false
    }
  })
</script>
<style lang="scss">
  .btn-select-date {
    .va-button__content {
      padding-top: 0px;
      span {
        font-size: 22px;
      }
    }
  }

  .va-button__content {
    .va-button__left-icon {
      font-size: 25px !important;
    }
  }
</style>
