<template>
  <div class="profile-dropdown-wrapper">
    <va-dropdown v-model="isShown" class="profile-dropdown" stick-to-edges placement="bottom" :offset="[13, 0]">
      <template #anchor>
        <span class="profile-dropdown__anchor">
          <slot />
          <va-icon class="px-2" :name="isShown ? 'angle_up' : 'angle_down'" :color="colors.info" />
        </span>
      </template>
      <va-dropdown-content class="profile-dropdown__content">
        <va-list-item v-for="option in dropdownItems" :key="option.name" class="pa-2">
          <router-link v-if="option.redirectTo" :to="{ name: option.redirectTo }" class="profile-dropdown__item">
            {{ t(`user.${option.name}`) }}
          </router-link>
          <div v-else class="profile-dropdown__item" @click="option.action">{{ t(`user.${option.name}`) }}</div>
        </va-list-item>
      </va-dropdown-content>
    </va-dropdown>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useColors } from 'vuestic-ui'
  import { useRouter } from 'vue-router'
  import { useGlobalStore } from '../../../../stores/global-store'

  interface ProfileDropdownItem {
    name: string
    redirectTo?: string
    action?: () => void
  }

  interface ProfileDropdownProps {
    options?: ProfileDropdownItem[]
  }

  const props = withDefaults(defineProps<ProfileDropdownProps>(), {
    options: () => [],
  })

  const { t } = useI18n()
  const { colors } = useColors()
  const globalStore = useGlobalStore()
  const router = useRouter()

  const dropdownItems = ref<ProfileDropdownItem[]>([
    {
      name: 'profile',
      redirectTo: '',
    },
    {
      name: 'logout',
      action: () => {
        globalStore.logout()
        router.replace({ name: 'login-button' })
      },
    },
  ])

  watch(
    () => props.options,
    (newValue: ProfileDropdownItem[]) => {
      dropdownItems.value = newValue
    },
  )

  const isShown = ref(false)
</script>

<style lang="scss" scoped>
  .profile-dropdown {
    cursor: pointer;

    &__anchor {
      display: inline-block;
    }

    &__item {
      display: block;
      color: var(--va-gray);
      cursor: pointer;

      &:hover,
      &:active {
        color: var(--va-primary);
      }
    }
  }
</style>
