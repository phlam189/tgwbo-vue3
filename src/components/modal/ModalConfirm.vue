<template>
  <va-modal v-model="open" class="modal_confirm" hide-default-actions no-esc-dismiss>
    <div style="width: 616px">
      <div class="c-mt-50 c-mb-60 c-mx-30">{{ props.message }}</div>
      <div class="hr-line"></div>
      <div class="d-flex gap-4 d-flex-end c-mt-15 c-mr-26">
        <va-button class="button-cancel" @click="closeModal">{{ t('modal.cancel') }}</va-button>
        <va-button class="button-create" @click="submit">{{
          !props.textConfirm ? t('modal.create') : t('confirm')
        }}</va-button>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const open = ref<boolean>(false)
  const emit = defineEmits<{
    (e: 'submit'): void
  }>()
  const props = defineProps<{
    message: string
    textConfirm: boolean
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

<style scoped lang="scss"></style>
