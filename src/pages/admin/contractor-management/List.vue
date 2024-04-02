<template>
  <div class="markup-tables flex">
    <div>
      <h1 class="page-title">{{ t('contractor.contractor_list_title') }}</h1>
    </div>
    <va-card class="flex c-mt-30">
      <va-card-content>
        <div class="c-mb-20 d-flex-between">
          <h3 class="section-title">{{ t('contractor.contractor_list_title') }}</h3>
          <div class="c-mr-10">
            <router-link class="cus-link-primary fw-500" :to="{ name: 'contractor_add' }">
              <va-button class="button-create">{{ t('create') }}</va-button>
            </router-link>
          </div>
        </div>
        <div class="cus-tabel-wrapper">
          <table>
            <thead>
              <tr>
                <th class="c-w-200" style="min-width: 150px">{{ t('contractor.company_name') }}</th>
                <th class="c-w-200" style="min-width: 150px">{{ t('contractor.manager') }}</th>
                <th class="c-w-200" style="min-width: 150px">{{ t('contractor.email') }}</th>
                <th class="c-w-250" style="min-width: 150px">{{ t('contractor.address') }}</th>
                <th class="c-w-150" style="min-width: 150px">{{ t('contractor.invoice_prefix') }}</th>
                <th class="c-w-150" style="min-width: 180px">{{ t('created_at') }}</th>
                <th class="c-w-60 va-text-center"></th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="isLoading">
                <td colspan="10" style="border-left: none">
                  <div class="d-flex justify-center">
                    <va-progress-circle size="small" indeterminate />
                  </div>
                </td>
              </tr>
              <template v-else>
                <template v-if="data.length > 0">
                  <tr v-for="(item, index) in data" :key="index">
                    <td class="va-text-left c-w-200" style="max-width: 200px !important">
                      <va-popover v-if="item.company_name.length >= 20" placement="top">
                        <div class="content-dot" style="width: 100% !important">
                          {{ item.company_name }}
                        </div>
                        <template #body>
                          <p style="color: #788b9a; max-width: 250px !important">{{ item.company_name }}</p>
                        </template>
                      </va-popover>
                      <div v-else class="content-dot" style="width: 100% !important">
                        {{ item.company_name }}
                      </div>
                    </td>
                    <td class="va-text-left c-w-200">{{ item.manager }}</td>
                    <td class="va-text-left c-w-200">
                      {{ item.email }}
                    </td>
                    <td class="va-text-left c-w-250" style="max-width: 250px !important">
                      <va-popover v-if="item.address.length >= 20" placement="top">
                        <div class="content-dot" style="width: 100% !important">
                          {{ item.address }}
                        </div>
                        <template #body>
                          <p style="color: #788b9a">{{ item.address }}</p>
                        </template>
                      </va-popover>
                      <div v-else class="content-dot" style="width: 100% !important">
                        {{ item.address }}
                      </div>
                    </td>
                    <td class="va-text-left c-w-150">{{ item.invoice_prefix }}</td>
                    <td class="va-text-left c-w-150">{{ convertDateToString(item.created_at) }}</td>
                    <td class="c-w-60 va-text-center" style="min-width: 100px">
                      <router-link
                        class="cus-link-primary fw-500 c-mr-10"
                        :to="{ name: 'contractor_edit', params: { id: item.id } }"
                      >
                        {{ t('edit') }}
                      </router-link>
                      <a href="#" class="cus-link-danger fw-500" @click="onDeleteItemClick(item.id)">
                        {{ t('delete') }}
                      </a>
                    </td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="10" class="va-text-center va-text-danger" style="border-left: none">
                    {{ t('list_no_data') }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div v-if="checkPaginate" class="va-text-center mt-3 flex align-center">
          <Pagination v-model="currentPage" :last-page="lastPage" :visible-page="visiblePages" />
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { useModal } from 'vuestic-ui'
  import { useI18n } from 'vue-i18n'
  import { Contractor } from '../../../types/Contractor'
  import { ref, onMounted, computed, watch } from 'vue'
  import type { Ref } from 'vue'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { convertDateToString } from '../../../common/utils'
  import Pagination from '../../../components/pagination/Pagination.vue'
  import { CommonService } from '../../../services/CommonService'
  import { API } from '../../../services/apis/apis'

  const { t } = useI18n()
  const { init } = useToast()
  const service = new CommonService()
  const GlobalStore = useGlobalStore()
  const isLoading = ref(false)

  const currentPage: Ref<number> = ref(1)
  const lastPage = ref(0)
  const totalRecords: Ref<number> = ref(0)
  const visiblePages: Ref<number> = ref(5)
  const data = ref([]) as Ref<Contractor[]>

  const checkPaginate = computed(() => {
    return lastPage.value > 1 ? true : false
  })

  onMounted((): void => {
    checkCreated()
    checkUpdated()
    getListContractor().finally(() => {
      isLoading.value = false
    })
  })

  const getListContractor = async () => {
    isLoading.value = true
    await service
      .getListShow(`${API.MANAGEMENT_COMMON.CONTRACTOR.LIST_WITH_PAGINATE(currentPage.value)}`)
      .then((res) => {
        data.value = res.data.data
        totalRecords.value = res.data.total
        currentPage.value = res.data.current_page
        lastPage.value = res.data.last_page
        isLoading.value = false
      })
      .catch(() => {
        var message = ''
        message = t('message_error.Unknown_error')
        init({ message: message, color: 'danger' })
      })
  }

  const deleteContractor = async (id: number) => {
    const resultDelete = await service.delete(`/contractors/${id}`)
    if (resultDelete.status) {
      init({
        message: t('contractor.message_delete_success', { field: t('contractor.contractor_list_title') }),
        color: 'success',
      })
      getListContractor()
    } else {
      init({ message: resultDelete.message, color: 'danger' })
    }
  }

  const checkCreated = () => {
    if (GlobalStore.$state.isCreated) {
      init({ message: t('message_success.add', { field: t('contractor.contractor_list_title') }), color: 'success' })
      GlobalStore.$state.isCreated = false
    }
  }

  const checkUpdated = () => {
    if (GlobalStore.$state.isUpdated) {
      init({ message: t('message_success.edit', { field: t('contractor.contractor_list_title') }), color: 'success' })
      GlobalStore.setIsUpdated()
    }
  }

  const { confirm } = useModal()

  const onDeleteItemClick = async (id) => {
    const result = await confirm({
      message: t('delete_confirm'),
      okText: t('delete'),
      cancelText: t('cancel'),
    })

    if (result) {
      //click ok, remove
      deleteContractor(id)
    } else {
      //click cancel, do something else
    }
  }

  watch(currentPage, getListContractor)
</script>

<style lang="scss" scoped>
  .markup-tables {
    .table-wrapper {
      overflow: auto;
    }

    .va-table {
      width: 100%;
    }
  }
  .cus-tabel-wrapper {
    table {
      thead {
        position: sticky;
        top: 0px;
        background-color: #ffffff;
        z-index: 1;
        tr:last-child {
          th:last-child {
            border-left: 1px solid #cccccc;
            position: sticky;
            right: 0px;
            background-color: #ffffff;
          }
        }
      }
      tbody {
        td:last-child {
          border-left: 1px solid #cccccc;
          position: sticky;
          right: 0px;
          background-color: #ffffff;
        }
        .boder-line {
          td {
            border-bottom: 1px solid #cccccc !important;
          }
        }
      }
    }
  }
</style>
