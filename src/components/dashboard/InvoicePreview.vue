<template>
  <va-modal v-model="open" hide-default-actions no-esc-dismiss>
    <div style="width: 360px">
      <div class="c-mt-5">{{ t('dashboard.preview_invoice') }}</div>
      <div class="d-flex-center c-mt-32">
        <IconFilePDF />
      </div>
      <div class="d-flex-center c-mt-18">
        <div class="file-name">2023 年1月.pdf</div>
      </div>
      <div class="gap-2 d-flex-center c-mt-27 c-mb-8">
        <va-button class="button-create c-w-96" @click="submit">{{ t('dashboard.view_PDF') }}</va-button>
        <va-button class="button-create c-w-96" @click="submit">{{ t('confirm') }}</va-button>
        <va-button preset="secondary" color="#1C78DD" border-color="#1C78DD" class="c-w-96" @click="emit('edit')">{{
          t('edit')
        }}</va-button>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import IconFilePDF from '../icons/IconFilePDF.vue'
  const { t } = useI18n()
  const open = ref<boolean>(false)
  const emit = defineEmits<{
    (e: 'submit'): void
    (e: 'edit'): void
  }>()

  const openModal = () => {
    open.value = true
  }

  const closeModal = () => {
    open.value = false
  }

  const submit = () => {
    emit('submit')
  }

  defineExpose({
    openModal,
    closeModal,
  })
</script>

<style scoped lang="scss">
  .file-name {
    font-size: 16px;
    line-height: 23px;
    color: #435564;
  }
  :deep(.va-button__content) {
    padding: 8px;
  }
</style>
