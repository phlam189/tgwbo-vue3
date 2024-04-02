<template>
  <div :key="renderedTable" class="markup-tables flex">
    <div>
      <h1 class="page-title">{{ t('contractor.account_contractor_list_title') }}</h1>
    </div>
    <va-card class="flex c-mt-30">
      <va-card-content>
        <div class="c-mb-20 d-flex-between">
          <h3 class="section-title">{{ t('contractor.account_contractor_list_title') }}</h3>
          <div class="c-mr-10">
            <router-link class="cus-link-primary fw-500" :to="{ name: 'account-contractor_add' }">
              <va-button class="button-create">{{ t('create') }}</va-button>
            </router-link>
          </div>
        </div>
        <div class="cus-tabel-wrapper">
          <table>
            <thead>
              <tr>
                <th class="c-w-150" style="min-width: 150px">{{ t('contractor.company_type') }}</th>
                <th class="c-w-200" style="min-width: 150px">{{ t('contractor.company_name') }}</th>
                <th class="c-w-200" style="min-width: 150px">{{ t('contractor.representative_name') }}</th>
                <th class="c-w-200" style="min-width: 180px">{{ t('contractor.date_of_birth') }}</th>
                <th class="c-w-250" style="min-width: 150px">{{ t('contractor.email') }}</th>
                <th class="c-w-250" style="min-width: 150px">{{ t('contractor.address') }}</th>
                <th class="c-w-200" style="min-width: 180px">{{ t('contractor.contract_date') }}</th>
                <th class="c-w-200" style="min-width: 150px">{{ t('contractor.contractor') }}</th>
                <th class="c-w-250" style="min-width: 150px">{{ t('contractor.presence') }}</th>
                <th class="c-w-250" style="min-width: 150px">{{ t('contractor.existence_secondment_contract') }}</th>
                <th class="c-w-250" style="min-width: 150px">{{ t('contractor.invoice_prefix') }}</th>
                <th class="c-w-150" style="min-width: 180px">{{ t('created_at') }}</th>
                <th class="c-w-100 va-text-center"></th>
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
                <tr v-for="item in data" v-if="data.length > 0">
                  <td class="va-text-left c-w-150">{{ convertCompanyType(item.company_type) }}</td>
                  <td class="va-text-left c-w-200" style="max-width: 200px !important">
                    <va-popover placement="top">
                      <div class="content-dot" style="width: 100% !important">
                        {{ item.company_name }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ item.company_name }}</p>
                      </template>
                    </va-popover>
                  </td>
                  <td class="va-text-left c-w-200">{{ item.representative_name }}</td>
                  <td class="va-text-left c-w-200">{{ convertDateToString(item.date_of_birth) }}</td>
                  <td class="va-text-left c-w-200">{{ item.email }}</td>
                  <td class="va-text-left c-w-200" style="max-width: 250px !important">
                    <va-popover placement="top">
                      <div class="content-dot" style="width: 100% !important">
                        {{ item.address }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ item.address }}</p>
                      </template>
                    </va-popover>
                  </td>
                  <td class="va-text-left c-w-200">{{ convertDateToString(item.contract_date) }}</td>
                  <td class="va-text-left c-w-200" style="max-width: 200px !important">
                    <va-popover placement="top">
                      <div class="content-dot" style="width: 100% !important">
                        {{ convertTextDisplayContractor(item.parent) }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">
                          {{ convertTextDisplayContractor(item.parent) }}
                        </p>
                      </template>
                    </va-popover>
                  </td>
                  <td class="va-text-left c-w-150">{{ convertPresence(item.presence) }}</td>
                  <td class="va-text-left c-w-150">{{ convertExistence(item.existence) }}</td>
                  <td class="va-text-left c-w-150">{{ item.invoice_prefix }}</td>
                  <td class="va-text-left c-w-150">{{ convertDateToString(item.created_at) }}</td>
                  <td class="c-w-100 va-text-center" style="min-width: 100px">
                    <router-link
                      class="cus-link-primary fw-500 c-mr-10"
                      :to="{ name: 'account-contractor_edit', params: { id: item.id } }"
                    >
                      {{ t('edit') }}
                    </router-link>
                    <a href="#" class="cus-link-danger fw-500" @click="onDeleteItemClick(item.id)">
                      {{ t('delete') }}
                    </a>
                  </td>
                </tr>
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
  import { AccountContractor } from '../../../types/Contractor'
  import { ref, onMounted, onUpdated, computed, watch } from 'vue'
  import { HTTP } from '../../../common/HTTP-common'
  import type { Ref } from 'vue'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { convertDateToString } from '../../../common/utils'
  import Pagination from '../../../components/pagination/Pagination.vue'
  import { CommonService } from '../../../services/CommonService'
  import { PRESENSE_TYPE, COMPANY_TYPE } from '../../../common/constants'
  import { API } from '../../../services/apis/apis'

  const { t } = useI18n()
  const { init, close, closeAll } = useToast()
  const service = new CommonService()
  const GlobalStore = useGlobalStore()
  const isLoading = ref(false)

  const currentPage: Ref<number> = ref(1)
  const lastPage = ref(0)
  const totalRecords: Ref<number> = ref(0)
  const visiblePages: Ref<number> = ref(5)
  const data = ref([]) as Ref<AccountContractor[]>
  const renderedTable = ref(0)

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

  watch(lastPage, () => {
    if (lastPage.value >= 1 && data.value.length == 0) {
      --currentPage.value
    }
  })

  const convertPresence = (value: any) => {
    return value == PRESENSE_TYPE.HAVE ? t('contractor.option_have') : t('contractor.option_none')
  }

  const convertExistence = (value: any) => {
    return value == PRESENSE_TYPE.HAVE ? t('contractor.option_have') : t('contractor.option_none')
  }

  const convertTextDisplayContractor = (value: any) => {
    if (value) {
      let result =
        (value.company_name ?? '_') +
        '/' +
        (value.address ?? '_') +
        '/' +
        (value.email ?? '_') +
        '/' +
        (value.manager ?? '_')
      return result
    }
    return
  }

  const convertCompanyType = (value: any) => {
    switch (value) {
      case COMPANY_TYPE.FORMER_STOCK:
        return t('contractor.former_stock')
      case COMPANY_TYPE.BACK_STOCK:
        return t('contractor.back_stock')
      case COMPANY_TYPE.FRONT:
        return t('contractor.front')
      case COMPANY_TYPE.BACK:
        return t('contractor.back')
      case COMPANY_TYPE.PREEXISTING:
        return t('contractor.preexisting')
      case COMPANY_TYPE.LATER:
        return t('contractor.later')
      default:
        return t('contractor.none')
    }
  }

  const getListContractor = async () => {
    renderedTable.value = renderedTable.value + 1
    isLoading.value = true
    await service
      .getListShow(`${API.MANAGEMENT_COMMON.ACCOUNT_CONTRACTOR.LIST_WITH_PAGINATE(currentPage.value)}`)
      .then((res) => {
        data.value = res.data.data
        totalRecords.value = res.data.total
        currentPage.value = res.data.current_page
        lastPage.value = res.data.last_page
        isLoading.value = false
      })
      .catch((error) => {
        var message = ''
        message = t('message_error.Unknown_error')
        init({ message: message, color: 'danger' })
      })
  }

  const deleteContractor = async (id: number) => {
    const resultDelete = await service.delete(`${API.MANAGEMENT_COMMON.CONTRACTOR.DELETE(id)}`)
    if (resultDelete.status) {
      init({
        message: t('contractor.message_delete_success', { field: t('contractor.account_contractor_list_title') }),
        color: 'success',
      })
      getListContractor()
    } else {
      init({ message: resultDelete.message, color: 'danger' })
    }
  }

  const checkCreated = () => {
    if (GlobalStore.$state.isCreated) {
      init({
        message: t('message_success.add', { field: t('contractor.account_contractor_list_title') }),
        color: 'success',
      })
      GlobalStore.$state.isCreated = false
    }
  }

  const checkUpdated = () => {
    if (GlobalStore.$state.isUpdated) {
      init({
        message: t('message_success.edit', { field: t('contractor.account_contractor_list_title') }),
        color: 'success',
      })
      GlobalStore.setIsUpdated()
    }
  }

  const { confirm } = useModal()

  const onDeleteItemClick = async (id: number) => {
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
    overflow: scroll;
    max-height: 650px;

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
        td {
          .va-popover {
            height: 20px;
          }
        }

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
