<template>
  <va-modal v-model="open" class="modal_confirm" hide-default-actions no-esc-dismiss>
    <div style="width: 400px">
      <div class="c-mt-50 c-mb-60 c-mx-30 text-center">{{ props.message }}</div>
      <div class="hr-line"></div>
      <div class="d-flex d-flex-center c-mt-15">
        <va-button class="button-create" @click="closeModal">{{ t('modal.confirm') }}</va-button>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const open = ref<boolean>(false)
  const props = defineProps<{
    message: string
  }>()

  const openModal = () => {
    open.value = true
  }

  const closeModal = () => {
    open.value = false
  }

  defineExpose({
    openModal,
    closeModal,
  })
</script>

<style scoped lang="scss"></style>
