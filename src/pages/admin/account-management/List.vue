<template>
  <div :key="renderedTable" class="markup-tables flex">
    <div>
      <h1 class="page-title">{{ t('account.account_list_title') }}</h1>
    </div>
    <va-card class="flex c-mt-30">
      <va-card-content>
        <div class="c-mb-20 d-flex-between">
          <h3 class="section-title">{{ t('account.account_list_title') }}</h3>
          <div class="c-mr-10">
            <router-link class="cus-link-primary fw-500" :to="{ name: 'account_add' }">
              <va-button class="button-create">{{ t('create') }}</va-button>
            </router-link>
          </div>
        </div>
        <div class="cus-tabel-wrapper">
          <table>
            <thead>
              <tr>
                <th class="c-w-150" style="min-width: 110px">{{ t('account.service_type') }}</th>
                <th class="c-w-200" style="min-width: 150px">{{ t('account.category_name') }}</th>
                <th class="c-w-200" style="min-width: 150px">{{ t('account.bank_name') }}</th>
                <th class="c-w-200" style="min-width: 150px">{{ t('account.bank_code') }}</th>
                <th class="c-w-150" style="min-width: 150px">{{ t('account.branch_name') }}</th>
                <th class="c-w-150" style="min-width: 150px">{{ t('account.branch_code') }}</th>
                <th class="c-w-150" style="min-width: 150px">{{ t('account.client_represent_name') }}</th>
                <!-- <th class="c-w-150" style="min-width: 150px;">{{ t('account.contractor_company_name') }}</th> -->
                <th class="c-w-150" style="min-width: 150px">{{ t('account.representative_account') }}</th>
                <th class="c-w-150" style="min-width: 150px">{{ t('account.account_number') }}</th>
                <th class="c-w-150" style="min-width: 150px">{{ t('account.acount_holder') }}</th>
                <th class="c-w-150" style="min-width: 110px">{{ t('account.commission_rate') }}</th>
                <th class="c-w-150" style="min-width: 150px">{{ t('account.balance') }}</th>
                <th class="c-w-180" style="min-width: 180px">{{ t('created_at') }}</th>
                <th class="c-w-100 va-text-center"></th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="isLoading">
                <td colspan="10" style="border-left: none;">
                  <div class="d-flex justify-center">
                    <va-progress-circle size="small" indeterminate />
                  </div>
                </td>
              </tr>
              <template v-else>
                <tr v-if="data.length > 0" v-for="item in data">
                  <td class="va-text-left c-w-150">{{ convertServiceType(item.service_type) }}</td>
                  <td class="va-text-left c-w-200">
                    {{ item.category_name }}
                  </td>
                  <td class="va-text-left c-w-200">
                    <va-popover placement="top">
                      <div class="c-w-200 content-dot">
                        {{ item.bank_name }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ item.bank_name }}</p>
                      </template>
                    </va-popover>
                  </td>
                  <td class="va-text-left c-w-150">
                    {{ item.bank_code }}
                  </td>
                  <td class="va-text-right c-w-150">
                    <va-popover placement="top">
                      <div class="c-w-200 content-dot">
                        {{ item.branch_name }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ item.branch_name }}</p>
                      </template>
                    </va-popover>
                  </td>
                  <td class="va-text-right c-w-150">{{ item.branch_code }}</td>
                  <td class="va-text-left c-w-150">{{ item.client_represent_name }}</td>
                  <!-- <td class="va-text-left c-w-150">{{ item.contructor_company_name }}</td> -->
                  <td class="va-text-left c-w-150">{{ item.representative_account }}</td>
                  <td class="va-text-right c-w-150">{{ item.account_number }}</td>
                  <td class="va-text-right c-w-150">{{ item.account_holder }}</td>
                  <td class="va-text-right c-w-150">{{ item.commission_rate ?? 0 }}%</td>
                  <td class="va-text-right c-w-150">
                    <!-- ¥{{Number(item.balance).toLocaleString("ja-JP")}} -->
                    {{ formatCurrency.func(item.balance) }}
                  </td>
                  <td class="va-text-left c-w-180">{{ convertDateToString(item.created_at) }}</td>
                  <td class="c-w-100 va-text-center" style="min-width: 100px">
                    <router-link
                      :to="{ name: 'account_edit', params: { id: item.id } }"
                      class="cus-link-primary fw-500 c-mr-10"
                    >
                      {{ t('edit') }}
                    </router-link>
                    <a href="#" @click="onDeleteItemClick(item.id)" class="cus-link-danger fw-500">
                      {{ t('delete') }}
                    </a>
                  </td>
                </tr>
                <tr v-else>
                  <td colspan="10" class="va-text-center va-text-danger" style="border-left: none;">{{ t('list_no_data') }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="va-text-center mt-3 flex align-center" v-if="checkPaginate">
          <Pagination v-model="currentPage" :last-page="lastPage" :visible-page="visiblePages" />
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { useModal } from 'vuestic-ui'
  import { useI18n } from 'vue-i18n'
  import { ref, computed, onMounted, watch } from 'vue'
  import { useToast } from 'vuestic-ui'
  import { HTTP } from '../../../common/HTTP-common'
  import { HttpService } from '../../../common/HTTP-service'
  import type { Ref } from 'vue'
  import { convertDateToString, formatCurrency } from '../../../common/utils'
  import Pagination from '../../../components/pagination/Pagination.vue'
  import { Account } from '../../../types/Account'
  import { CommonService } from '../../../services/CommonService'
  import { useGlobalStore } from '../../../stores/global-store'
  import { API } from '../../../services/apis/apis'
  import { SCREEN_COMMON } from '../../../router/router'
  import { CATEGORY_NAME, SERVICE_TYPE } from "../../../common/constants";

  const { t } = useI18n()
  const { init, close, closeAll } = useToast()
  const service = new CommonService()
  const isLoading = ref(false)

  const data = ref([]) as Ref<Account[]>
  const currentPage: Ref<number> = ref(1)
  const lastPage = ref(0)
  const totalRecords: Ref<number> = ref(0)
  const visiblePages: Ref<number> = ref(5)
  const GlobalStore = useGlobalStore()
  const renderedTable = ref(0)

  const checkPaginate = computed(() => {
    return lastPage.value > 1 ? true : false
  })

  const convertTextDisplayCategory = (value: any) => {
    if(value == SERVICE_TYPE.DEPOSIT) {
      return t('account.deposit')
    }
    if(value == SERVICE_TYPE.WITHDROW) {
      return t('account.withdrow')
    }
    return t('account.other')
  }

  onMounted((): void => {
    checkUpdated()
    checkCreated()
    getListAccount().finally(() => {
      isLoading.value = false
    })
  })

  watch(lastPage, () => {
    if(lastPage.value >= 1 && data.value.length == 0) {
      --currentPage.value
    }
  })

  const getListAccount = async () => {
    renderedTable.value = renderedTable.value + 1
    isLoading.value = true
    await service
      .getListShow(`${API.MANAGEMENT_COMMON.ACCOUNT.LIST(currentPage.value)}`)
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

  const deleteAccount = async (id: Number) => {
    const resultDelete = await service.delete(`${API.MANAGEMENT_COMMON.ACCOUNT.DELETE(id)}`)
    if (resultDelete.status) {
      init({ message: t('message_success.delete', { field: t('account.account_list_title') }), color: 'success' })
      getListAccount()
    } else {
      init({ message: resultDelete.message, color: 'danger' })
    }
  }

  const convertServiceType = (value: any) => {
    switch (value) {
      case SERVICE_TYPE.DEPOSIT:
        return t('account.deposit')
      case SERVICE_TYPE.WITHDROW:
        return t('account.withdrow')
      default:
        return ''
    }
  }

  const checkCreated = () => {
    if (GlobalStore.$state.isCreated) {
      init({ message: t('message_success.add', { field: t('account.account_list_title') }), color: 'success' })
      GlobalStore.$state.isCreated = false
    }
  }

  const checkUpdated = () => {
    if (GlobalStore.$state.isUpdated) {
      init({ message: t('message_success.edit', { field: t('account.account_list_title') }), color: 'success' })
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
      deleteAccount(id)
    } else {
      //click cancel, do something else
    }
  }

  watch(currentPage, getListAccount)
</script>

<style lang="scss" scoped>
  .markup-tables {
    .table-wrapper {
      overflow: auto;
    }

    .va-table {
      width: 100%;
    }

    .mw-5 {
      min-width: 5rem;
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
