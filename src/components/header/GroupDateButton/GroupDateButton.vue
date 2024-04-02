<template>
  <div class="d-flex">
    <va-button class="c-mr-14" preset="secondary" color="#1C78DD" border-color="#1C78DD" @click="refresh">
      <va-icon name="fa-regular fa-arrows-rotate" class="va-sidebar-item__icon mr-3" />
      {{ t('refresh') }}
    </va-button>
    <template v-if="isToday">
      <va-button
        :class="{ 'btn-active': props.typeSearch === DATE_PICKER_TYPES.TODAY }"
        style="width: 120px"
        preset="secondary"
        color="#1C78DD"
        border-color="#1C78DD"
        @click="handleChangeTypeSearch(DATE_PICKER_TYPES.TODAY)"
        >{{ t('dashboard.today') }}
      </va-button>
    </template>
    <va-button-group preset="secondary" border-color="primary" class="c-ml-14">
      <va-button
        :class="{ 'btn-active': props.typeSearch === DATE_PICKER_TYPES.YEAR }"
        color="#1C78DD"
        border-color="#1C78DD"
        size="medium"
        @click="handleChangeTypeSearch(DATE_PICKER_TYPES.YEAR)"
        >{{ t(DATE_PICKER_TYPES.YEAR) }}
      </va-button>
      <va-button
        :class="{ 'btn-active': props.typeSearch === DATE_PICKER_TYPES.MONTH }"
        class="btn-border"
        color="#1C78DD"
        border-color="#1C78DD"
        size="medium"
        @click="handleChangeTypeSearch(DATE_PICKER_TYPES.MONTH)"
        >{{ t(DATE_PICKER_TYPES.MONTH) }}
      </va-button>
      <va-button
        :class="{ 'btn-active': props.typeSearch === DATE_PICKER_TYPES.DAY }"
        color="#1C78DD"
        border-color="#1C78DD"
        size="medium"
        @click="handleChangeTypeSearch(DATE_PICKER_TYPES.DAY)"
        >{{ t(DATE_PICKER_TYPES.DAY) }}
      </va-button>
      <va-button
        :class="{ 'btn-active': props.typeSearch === DATE_PICKER_TYPES.PERIOD }"
        class="btn-border"
        color="#1C78DD"
        border-color="#1C78DD"
        size="medium"
        @click="handleChangeTypeSearch(DATE_PICKER_TYPES.PERIOD)"
        >{{ t(DATE_PICKER_TYPES.PERIOD) }}
      </va-button>
    </va-button-group>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { DATE_PICKER_TYPES } from '../../../common/constants'
  import { defineProps, defineEmits } from 'vue'

  const { t } = useI18n()

  const props = defineProps({
    typeSearch: {
      type: String,
      required: true,
    },
    isToday: {
      type: Boolean,
      required: false,
      default: true,
    },
  })

  const emit = defineEmits<{
    (e: 'changed', type: string): void
    (e: 'refresh'): void
  }>()

  const handleChangeTypeSearch = (type: string) => {
    emit('changed', type)
  }

  const refresh = () => {
    emit('refresh')
  }
</script>

<style lang="scss" scoped>
  :deep(.va-button__content) {
    font-weight: 500;
  }
</style>
