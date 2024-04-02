<template>
  <va-popover v-model="open" :placement="props.placement" :auto-placement="false" trigger="click" :stateful="false">
    <va-button
      v-if="!props.isInput"
      color="#1C78DD"
      class="btn-select-date"
      :hover-opacity="0"
      :style="{ 'min-width': widthButton }"
      preset="secondary"
    >
      <span v-if="props.type === DATE_PICKER_TYPES.DAY" class="text_button_select_date" @click="handleOpenPopover">
        {{ convertDateToString(props.modelValue) }}
      </span>
      <span
        v-else-if="props.type === DATE_PICKER_TYPES.MONTH"
        class="text_button_select_date"
        @click="handleOpenPopover"
      >
        {{ convertDateString(props.modelValue) }}
      </span>
      <span v-else class="text_button_select_date" @click="handleOpenPopover">
        {{ convertYearString(props.modelValue) }}
      </span>
    </va-button>
    <va-input
      v-else
      :model-value="`${convertDateInput(model)}`"
      class="input-date-picker"
      :placeholder="t('placeholder_date')"
      style="width: 100%"
      readonly
      @click="handleOpenPopover"
    >
      <template #appendInner>
        <va-icon
          v-if="isClear"
          name="cancel"
          style="cursor: pointer; color: var(--va-secondary); font-size: 14px; height: 14px; line-height: 14px"
          @click="handleClearData"
        />
        <va-icon v-else name="calendar_today" @click="handleOpenPopover" />
      </template>
    </va-input>
    <template #body>
      <div v-click-outside="handleClosePopover">
        <template v-if="!disabledCus">
          <va-date-picker
            v-if="isCheckType"
            v-model="model"
            :month-names="MONTHS"
            :weekday-names="WEEKDAYS"
            :type="props.type"
            :allowed-days="disabledFutureDate"
            show-other-months
          >
            <template #day="{ date }"> {{ date.getDate() }}</template>
            <template #year="{ year }">
              {{ year }}
              <span v-if="locale == LANGUAGES.JAPANESE">{{ t(DATE_PICKER_TYPES.YEAR) }}</span>
            </template>
          </va-date-picker>
          <va-date-picker
            v-else-if="props.type === DATE_PICKER_TYPES.MONTH"
            v-model="model"
            :month-names="MONTHS"
            :weekday-names="WEEKDAYS"
            :type="props.type"
            :allowed-months="disabledFutureMonth"
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
            v-model="model"
            :month-names="MONTHS"
            :weekday-names="WEEKDAYS"
            :type="props.type"
            :allowed-years="disabledFutureYear"
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
          v-model="model"
          :month-names="MONTHS"
          :weekday-names="WEEKDAYS"
          :type="props.type"
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
          v-model="model"
          :month-names="MONTHS"
          :weekday-names="WEEKDAYS"
          :type="props.type"
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
  import { convertDateString, convertDateToString, convertYearString, convertDateInput } from '../../common/utils'

  const { t, locale } = useI18n()

  const open = ref(false)
  const isClear = ref(false)

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
    type: {
      type: String,
      default: DATE_PICKER_TYPES.DAY,
    },
    isInput: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Date,
      default: null,
    },
    disabledCus: {
      type: String,
      required: false,
      default: null,
    },
  })

  const widthButton = computed(() => {
    if (props.type === DATE_PICKER_TYPES.DAY) {
      return '140px'
    } else if (props.type === DATE_PICKER_TYPES.MONTH) {
      return '112px'
    } else {
      return '74px'
    }
  })

  const isCheckType = computed(() => {
    return [DATE_PICKER_TYPES.DAY, DATE_PICKER_TYPES.TODAY].includes(props.type)
  })

  const disabledFutureDate = (date: any) => {
    return date && date <= moment().endOf('day')
  }

  const disabledFutureMonth = (date: any) => {
    return date && date <= moment().endOf('day') && date.getFullYear() <= moment().endOf('year').year()
  }

  const disabledFutureYear = (date: any) => {
    return date && date.getFullYear() <= moment().endOf('year').year()
  }

  const disabledPeriodDate = (date: any) => {
    return date && moment(date).isSameOrAfter(moment(props.disabledCus).startOf('day'))
  }

  const emit = defineEmits(['update:modelValue'])

  const model = ref()

  const handleOpenPopover = async () => {
    setTimeout(() => {
      open.value = !open.value
    }, 100)
  }

  const handleClearData = () => {
    model.value = null
    isClear.value = false
  }

  const handleClosePopover = (e: any) => {
    if (
      open.value &&
      e.target.className !== 'va-icon material-icons va-button__left-icon' &&
      e.target.className !== 'text_button_select_date'
    ) {
      open.value = false
    }
  }

  watch(
    () => model.value,
    () => {
      isClear.value = model.value ? true : false
    },
  )

  watch(
    () => props.modelValue,
    () => {
      model.value = props.modelValue
    },
    { immediate: true },
  )

  watch(model, () => {
    emit('update:modelValue', model.value)
    open.value = false
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
