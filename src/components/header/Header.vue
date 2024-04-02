<template>
  <div class="title-header">
    <div class="title-header__title">
      <div class="page-title c-mr-20">{{ props.title }}</div>
      <slot name="selectDate"></slot>
    </div>
    <div class="title-header__button">
      <slot name="groupButton"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
  const props = defineProps<{
    title: string
  }>()
</script>
<style scoped lang="scss">
  .title-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    &__title {
      display: flex;
    }

    &__button {
      display: flex;
      :deep {
        .va-button__content {
          font-weight: 500;
        }
      }
    }
  }
</style>
