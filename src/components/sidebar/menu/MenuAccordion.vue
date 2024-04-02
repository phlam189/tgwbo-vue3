<template>
  <va-accordion v-model="accordionValue" class="sidebar-accordion va-sidebar__menu__inner" multiple color="#fff">
    <va-collapse v-for="(route, idx) in renderedItems" :key="idx" color="#fff">
      <template #header>
        <div class="va-sidebar sidebar-header" v-if="route.name == SCREEN_COMMON.MENU_NAME.ACTION_LOG">
           {{ t('menu.system_management') }}
        </div>
        <va-sidebar-item :active="isRouteActive(route)" :to="route.children ? undefined : { name: route.name }">
          <va-sidebar-item-content>
            <span class="my-sidebar-icon-wapper">
              <va-icon :name="route.meta.icon" class="va-sidebar-item__icon" />
            </span>

            <va-sidebar-item-title>
              {{ t(route.displayName) }}
            </va-sidebar-item-title>

            <va-icon v-if="route.children" :name="accordionValue[idx] ? 'expand_less' : 'expand_more'" />
          </va-sidebar-item-content>
        </va-sidebar-item>
      </template>
      <template v-for="(child, index) in route.children" :key="index">
        <va-sidebar-item :active="isRouteActive(child)" :to="{ name: child.name }">
          <va-sidebar-item-content>
            <div class="va-sidebar-item__icon" />
            <div class="my-sidebar-item-title-child">
              <va-sidebar-item-title>
                {{ t(child.displayName) }}
              </va-sidebar-item-title>
            </div>
          </va-sidebar-item-content>
        </va-sidebar-item>
      </template>
    </va-collapse>
  </va-accordion>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { INavigationRoute } from '../NavigationRoutes'
  import { useGlobalStore } from '../../../stores/global-store'
  import { SCREEN_COMMON } from '../../../router/router'

  const { t } = useI18n()

  const props = withDefaults(
    defineProps<{
      items?: INavigationRoute[]
    }>(),
    {
      items: () => [],
    },
  )

  const globalStore = useGlobalStore()

  const accordionValue = ref<boolean[]>([])

  const renderedItems = computed(() => {
    const result: INavigationRoute[] = []

    props.items.forEach((item) => {
      if (!isAccessibleRoute(item)) {
        return
      }

      if (!item.children) {
        result.push(item)
        return
      }

      const children: INavigationRoute[] = []
      item.children.forEach((child) => {
        if (isAccessibleRoute(child)) {
          children.push(child)
        }
      })

      if (!children.length) {
        return
      }

      const newItem: INavigationRoute = {
        ...item,
        children,
      }

      result.push(newItem)
    })

    return result
  })

  onMounted(() => {
    accordionValue.value = props.items.map((item) => isItemExpanded(item))
  })

  // function isGroup(item: INavigationRoute) {
  //   return !!item.children
  // }

  function isRouteActive(item: INavigationRoute) {
    const findRex = String(useRoute().name)?.split('_')[0]
    if (item.children) {
      return (
        item.name === SCREEN_COMMON.MENU_NAME.SETTINGS && Boolean(item.children.find((child) => child.name === findRex))
      )
    }
    return item.name === (findRex ? findRex : useRoute().name)
  }

  function isItemExpanded(item: INavigationRoute): boolean {
    if (!item.children) {
      return false
    }

    const isCurrentItemActive = isRouteActive(item)
    const isChildActive = !!item.children.find((child) =>
      child.children ? isItemExpanded(child) : isRouteActive(child),
    )

    return isCurrentItemActive || isChildActive
  }

  function isAccessibleRoute(route: INavigationRoute) {
    const accessibleRoles = route.meta.accessibleRoles

    if (!accessibleRoles) {
      return true
    }

    return accessibleRoles.includes(globalStore.role)
  }
</script>
<style lang="scss" scoped>
  .va-sidebar__title {
    white-space: unset;
  }
</style>
