<template>
  <div class="action-container">
<!--    <va-button class="button-create" @click="onCreate">{{ t('add_new') }}</va-button>-->
    <va-button :disabled="props.isDisabled" class="button-delete" @click="onEdit">{{ t('edit') }}</va-button>
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const emit = defineEmits<{
    (e: 'create'): void
    (e: 'edit'): void
  }>()

  const props = defineProps({
    isDisabled: {
      type: Boolean,
      default: true,
    },
  })

  const onCreate = () => {
    emit('create')
  }

  const onEdit = () => {
    emit('edit')
  }
</script>
<style lang="scss" scoped>
  .action-container {
    gap: 10px;
    display: flex;
    margin-top: 15px;
    justify-content: flex-end;
  }
</style>
