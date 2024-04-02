<template>
  <div class="pagination-container">
    <va-pagination
      v-if="props.pageSize && props.totals"
      v-model="page"
      rounded
      gapped
      :visible-pages="props.visiblePage"
      :total="props.totals"
      :page-size="props.pageSize"
      buttons-preset="secondary"
      boundary-icon-left="keyboard_double_arrow_left"
      boundary-icon-right="keyboard_double_arrow_right"
      border-color="rgba(120, 139, 154, 0.1)"
      active-page-color="#1C78DD"
      color="#788B9A"
    />
    <va-pagination
      v-else
      v-model="page"
      rounded
      gapped
      :visible-pages="props.visiblePage"
      :pages="props.lastPage"
      buttons-preset="secondary"
      boundary-icon-left="keyboard_double_arrow_left"
      boundary-icon-right="keyboard_double_arrow_right"
      border-color="rgba(120, 139, 154, 0.1)"
      active-page-color="#1C78DD"
      color="#788B9A"
    />
  </div>
</template>
<script setup lang="ts">
  import { defineProps, defineEmits, ref, watch, onMounted } from 'vue'

  const emit = defineEmits(['update:modelValue'])

  const page = ref(0)

  const props = defineProps({
    lastPage: {
      type: Number,
      default: 0,
    },
    visiblePage: {
      type: Number,
      required: false,
      default: 5,
    },
    modelValue: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: false,
      default: 0,
    },
    totals: {
      type: Number,
      required: false,
      default: 0,
    },
  })

  watch(page, () => {
    emit('update:modelValue', page.value)
  })

  watch(() => props.modelValue, () => {
    page.value = props.modelValue
  })

  onMounted(() => {
    page.value = props.modelValue
  })
</script>
<style lang="scss" scoped>
  .pagination-container {
    width: fit-content;
    margin-top: 15px;
  }
</style>
