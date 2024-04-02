<template>
  <TitleHeader :title="`${t('balance_manager.title')}`">
    <template #selectDate>
      <SelectDatePicker v-model="date" :type="typeSelectDate" />
    </template>
    <template #groupButton>
      <va-button-group preset="secondary" border-color="primary" class="c-ml-14">
        <va-button
          :class="{ 'btn-active': typeSearch === DATE_PICKER_TYPES.DAY }"
          color="#1C78DD"
          border-color="#1C78DD"
          size="medium"
          @click="handleChangeTypeSearch(DATE_PICKER_TYPES.DAY)"
          >{{ t(DATE_PICKER_TYPES.DAY) }}
        </va-button>
        <va-button
          :class="{ 'btn-active': typeSearch === DATE_PICKER_TYPES.MONTH }"
          class="btn-border"
          color="#1C78DD"
          border-color="#1C78DD"
          size="medium"
          @click="handleChangeTypeSearch(DATE_PICKER_TYPES.MONTH)"
          >{{ t(DATE_PICKER_TYPES.MONTH) }}
        </va-button>
        <va-button
          :class="{ 'btn-active': typeSearch === DATE_PICKER_TYPES.YEAR }"
          color="#1C78DD"
          border-color="#1C78DD"
          size="medium"
          @click="handleChangeTypeSearch(DATE_PICKER_TYPES.YEAR)"
          >{{ t(DATE_PICKER_TYPES.YEAR) }}
        </va-button>
      </va-button-group>
    </template>
  </TitleHeader>
</template>

<script setup lang="ts">
  import TitleHeader from '../../components/header/Header.vue'
  import SelectDatePicker from '../../components/select-date-picker/index.vue'
  import { DATE_PICKER_TYPES } from '../../common/constants'
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const emit = defineEmits<{
    (e: 'onChangeDate', value: any): void
    (e: 'chargeTypeSearch', value: string): void
  }>()
  const typeSearch = ref(DATE_PICKER_TYPES.MONTH)
  const typeSelectDate = ref(DATE_PICKER_TYPES.MONTH)
  const date = ref(new Date())
  const { t } = useI18n()

  const handleChangeTypeSearch = (type: string) => {
    typeSearch.value = type
    if (type === DATE_PICKER_TYPES.TODAY) {
      typeSelectDate.value = DATE_PICKER_TYPES.DAY
    } else {
      typeSelectDate.value = type
    }
  }

  watch(
    () => date.value,
    (value) => {
      emit('onChangeDate', value)
    },
  )

  watch(
    () => typeSelectDate.value,
    (value) => {
      emit('chargeTypeSearch', value)
    },
  )
</script>

<style lang="scss" scoped></style>
