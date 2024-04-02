<template>
  <div :key="renderedTable" class="markup-tables flex">
    <div>
      <h1 class="page-title">{{ t('expense.expense_list_title') }}</h1>
    </div>
    <va-card class="flex c-mt-30">
      <va-card-content>
        <div class="c-mb-20 d-flex-between">
          <h3 class="section-title">{{ t('expense.expense_list_title') }}</h3>
          <div class="c-mr-10">
            <router-link class="cus-link-primary fw-500" :to="{ name: 'expense_add', }">
              <va-button class="button-create">{{ t('create') }}</va-button>
            </router-link>
          </div>
        </div>
        <div class="cus-tabel-wrapper">
          <table>
            <thead>
              <tr>
                <th class="c-w-200" style="min-width: 150px;">{{ t('expense.expense_name') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('expense.client_id') }}</th>
                <th class="c-w-200" style="min-width: 100px;">{{ t('expense.account_id') }}</th>
                <th class="c-w-150" style="min-width: 100px;">{{ t('expense.interest_rate') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('expense.memo') }}</th>
                <th class="c-w-150" style="min-width: 180px;">{{ t('created_at') }}</th>
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
                <td class="va-text-left c-w-200" >{{ item.expense_name }}</td>
                <td class="va-text-left c-w-200" >{{ convertTextDisplayClient(item.client) }}</td>
                <td class="va-text-left c-w-200" style="max-width: 250px !important;">
                <va-popover placement="top">
                      <div class="content-dot" style="width: 100% !important;">
                        <p>
                          {{
                        convertTextDisplayAccountNumber(
                        item.client
                        )
                        }}
                        </p>
                        <div class="content-dot" v-if="item.client && item.client.account.length > 0">
                          <!-- <va-list-item-label class="content-dot" v-for="account in item.client[0].account" style="color: #788b9a">
                            {{ convertAccountNumber(account.bank_name, account.account_number) }}
                          </va-list-item-label> -->
                        </div>
                      </div>
                      <template #body>
                        <p style="color: #788b9a">
                          {{
                          convertTextDisplayAccountNumber(
                          item.client
                          )
                          }}
                        </p>
                        <div v-if="item.client && item.client.account.length > 0">
                          <p v-for="account in item.client.account" style="color: #788b9a">
                            {{ convertAccountNumber(account.bank_name, account.account_number) }}
                          </p>
                        </div>
                      </template>
                    </va-popover>
                </td>
                <td class="va-text-right c-w-150">{{ item.interest_rate ?? 0 }}%</td>
                <td class="va-text-left c-w-200" style="max-width: 200px !important;">
                  <va-popover placement="top">
                      <div class="content-dot" style="width: 100% !important;">
                        {{ item.memo }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ item.memo }}</p>
                      </template>
                    </va-popover>
                </td>
                <td class="va-text-left c-w-150" >{{ convertDateToString(item.created_at) }}</td>
                <td class="c-w-100 va-text-center" style="min-width: 100px;">
                  <router-link class="cus-link-primary fw-500 c-mr-10" :to="{ name: 'expense_edit', params: { id: item.id } }">
                    {{ t('edit') }}
                  </router-link>
                  <a href="#" class="cus-link-danger fw-500" @click="onDeleteItemClick(item.id)">
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
          <Pagination
            v-model="currentPage"
            :last-page="lastPage"
            :visible-page="visiblePages"
          />
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { useModal } from 'vuestic-ui'
  import { useI18n } from 'vue-i18n'
  import { Expense } from '../../../types/Expense'
  import { ref, onMounted, onUpdated, computed, watch } from 'vue'
  import { HTTP } from '../../../common/HTTP-common'
  import type { Ref } from 'vue'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { convertDateToString } from '../../../common/utils'
  import Pagination from '../../../components/pagination/Pagination.vue'
  import { CommonService } from '../../../services/CommonService'
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
  const data = ref([]) as Ref<Expense[]>
  const renderedTable = ref(0)

  const checkPaginate = computed(() => {
    return lastPage.value > 1 ? true : false
  })

  const convertTextDisplayAccountNumber = (client: any) => {
    if(client){
      let result = `${t('expense.company_name')}: ${(client.company_name ?? '_')}`
      return result
    }
    return
  }

  const convertAccountNumber = (bank: string, number: string) => {
    let result = `
      ${t('expense.bank_name')}: ${(bank ?? '_')} -
      ${t('expense.account_number')}: ${(number ?? '_')}`
    return result
  }

  const convertTextDisplayClient = (client: any) => {
    if(client) {
      return client.company_name
    }
    return
  }

  onMounted((): void => {
    checkCreated()
    checkUpdated()
    getListExpense().finally(() => {
      isLoading.value = false
    })
  })

  watch(lastPage, () => {
    if(lastPage.value >= 1 && data.value.length == 0) {
      --currentPage.value
    }
  })

  const getListExpense = async () => {
    renderedTable.value = renderedTable.value + 1
    isLoading.value = true
    await service.getListShow(`${API.MANAGEMENT_COMMON.EXPENSE.LIST_WITH_PAGINATE(currentPage.value)}`)
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

  const deleteExpense = async (id: Number) => {
    const resultDelete = await service.delete(`${API.MANAGEMENT_COMMON.EXPENSE.DELETE(id)}`)
    if (resultDelete.status) {
      init({ message: t('message_success.delete', {field: t('expense.expense_list_title')}), color: 'success' })
      getListExpense()
    } else {
      init({ message: resultDelete.message, color: 'danger' })
    }
  }

  const checkCreated = () => {
    if (GlobalStore.$state.isCreated) {
      init({ message: t('message_success.add', {field: t('expense.expense_list_title')}), color: 'success' })
      GlobalStore.setIsCreated()
    }
  }

  const checkUpdated = () => {
    if (GlobalStore.$state.isUpdated) {
      init({ message: t('message_success.edit', {field: t('expense.expense_list_title')}), color: 'success' })
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
      deleteExpense(id)
    } else {
      //click cancel, do something else
    }
  }

  watch(currentPage, getListExpense)
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
