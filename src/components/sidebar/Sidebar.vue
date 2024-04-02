<template>
  <va-sidebar
    :width="width"
    :minimized="minimized"
    :minimized-width="minimizedWidth"
    :animated="animated"
    color="#fff"
    active-color="#fff"
    v-if="!minimized"
  >
    <div class="my-logo">
      <router-link to="/">
        <img src="/logo_white.png" height="32" />
      </router-link>
    </div>
    <div class="sidebar-header">LGW BO</div>
    <menu-accordion :items="items" />
  </va-sidebar>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import NavigationRoutes from './NavigationRoutes'
  import MenuAccordion from './menu/MenuAccordion.vue'

  withDefaults(
    defineProps<{
      width?: string
      color?: string
      animated?: boolean
      minimized?: boolean
      minimizedWidth?: string
    }>(),
    {
      width: '16rem',
      color: 'secondary',
      animated: true,
      minimized: true,
      minimizedWidth: undefined,
    },
  )

  const items = ref(NavigationRoutes.routes)
</script>

<style lang="scss">
  .va-sidebar {
    .sidebar-header {
      padding: var(--va-sidebar-item-content-padding);
      font-weight: bold;
      color: #0573ee !important;
    }
    .my-logo {
      margin: 0 auto 2rem auto;
      img {
        width: 143px;
        height: 57px;
      }
    }

    &__menu {
      padding: 2rem 0;
    }
    .va-sidebar__item__content {
      min-height: 30px !important;
      padding: 0;
    }
    &-item {
      //color: red !important;
      --va-sidebar-item-content-padding: 0;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      &__icon {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .my-sidebar-icon-wapper {
        width: 46px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &__content {
        padding: 0;
      }
      .my-sidebar-item-title-child {
        padding: 0 0 0 46px;
      }
    }
    &-item--active {
      color: #0573ee !important;

      .my-sidebar-icon-wapper {
        background: rgba(120, 139, 154, 0.2);
        border-radius: 0px 10px 10px 0px;

        &__icon {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
    &-item:hover {
      color: #0573ee !important;
    }
  }
</style>
