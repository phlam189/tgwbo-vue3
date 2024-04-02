<template>
  <div class="setting-dropdown-wrapper">
    <va-dropdown
      fixed
      stick-to-edges
      placement="bottom"
      class="setting-dropdown"
      :offset="[10, -70]"
      :close-on-content-click="false"
    >
      <template #anchor>
        <span class="setting-dropdown__anchor">
          <slot name="content"></slot>
        </span>
      </template>
      <va-dropdown-content class="setting-dropdown__content">
        <div class="title">{{ t('columns_setting') }}</div>
        <va-divider class="pb-1" />
        <div v-for="(option, id) in options" :key="id" class="setting-dropdown__item">
          <va-checkbox v-model="selected" :array-value="option" :label="t(`dashboard.${option}`)" />
        </div>
      </va-dropdown-content>
    </va-dropdown>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, withDefaults, defineProps } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { TYPE_SETTING_COLUMNS } from '../../../../common/constants'

  const emit = defineEmits<{
    (e: 'selectedRow', row: string[]): void
  }>()

  withDefaults(
    defineProps<{
      options?: string[]
    }>(),
    {
      options: () => [
        TYPE_SETTING_COLUMNS.ACCOUNT_TRANSFER,
        TYPE_SETTING_COLUMNS.OTHER_CHARGE,
        TYPE_SETTING_COLUMNS.SETTLEMENT,
      ],
    },
  )

  const { t } = useI18n()
  const selected = ref<string[]>([])

  watch(
    () => selected.value,
    () => {
      emit('selectedRow', selected.value)
    },
    { immediate: true },
  )
</script>

<style lang="scss" scoped>
  .setting-dropdown {
    cursor: pointer;

    &__content {
      z-index: 9999;
      width: 180px;
      font-size: 14px;
      color: #435564;
      border-radius: 10px;
      box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.25);
      .title {
        padding: 5px;
        font-size: 14px;
        font-weight: 500;
        color: #1c78dd;
      }
    }

    &__anchor {
      display: inline-block;
    }

    &__item {
      gap: 10px;
      display: flex;
      cursor: pointer;
      padding: 5px;
      margin: 10px 0;
      align-items: center;

      :deep(.va-checkbox__square) {
        width: 19px;
        height: 19px;
        outline: none;
        min-width: 19px;
        border-radius: 3px;
        border: 1px solid #435564;
      }

      &:hover,
      &:active {
        color: var(--va-primary);
      }

      :deep(.va-checkbox__label) {
        cursor: var(--va-checkbox-input-cursor);
      }
    }
  }
</style>
