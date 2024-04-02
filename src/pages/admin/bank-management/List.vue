<template>
  <div :key="renderedTable" class="markup-tables flex">
    <div>
      <h1 class="page-title">{{ t('bank.bank_list_title') }}</h1>
    </div>
    <va-card class="flex c-mt-30">
      <va-card-content>
        <div class="c-mb-20 d-flex-between">
          <h3 class="section-title">{{ t('bank.bank_list_title') }}</h3>
          <div class="c-mr-10">
            <router-link class="cus-link-primary fw-500" :to="{ name: 'bank_add', }">
              <va-button class="button-create">{{ t('create') }}</va-button>
            </router-link>
          </div>
        </div>
        <div class="cus-tabel-wrapper">
          <table>
            <thead>
              <tr>
                <th class="c-w-200" style="min-width: 150px;">{{ t('bank.bank_name') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('bank.client_withdrawal_fee_1') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('bank.client_withdrawal_fee_2') }}</th>
                <!-- <th class="c-w-150" style="min-width: 150px;">{{ t('bank.client_condition_number') }}</th> -->
                <th class="c-w-150" style="min-width: 150px;">{{ t('bank.contract_withdrawal_fee_1') }}</th>
                <th class="c-w-150" style="min-width: 150px;">{{ t('bank.contract_withdrawal_fee_2') }}</th>
                <!-- <th class="c-w-150" style="min-width: 150px;">{{ t('bank.contract_condition_number') }}</th> -->
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
                  <td class="va-text-left" style="max-width: 200px !important;">
                    <va-popover placement="top">
                      <div class="c-w-200 content-dot" style="width: 100% !important;">
                        {{ item.bank_name }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a; max-width: 240px !important;">{{ item.bank_name }}</p>
                      </template>
                    </va-popover>
                  </td>
                  <td class="va-text-right c-w-200">
                    ¥{{ Number(item.client_withdrawal_fee_2).toLocaleString('ja-JP') }}
                  </td>
                  <td class="va-text-right c-w-200">
                    ¥{{ Number(item.client_withdrawal_fee_1).toLocaleString('ja-JP') }}
                  </td>
                  <!-- <td class="va-text-right c-w-150">{{ item.client_condition_number }}</td> -->
                  <td class="va-text-right c-w-150">
                    ¥{{ Number(item.contract_withdrawal_fee_2).toLocaleString('ja-JP') }}
                  </td>
                  <td class="va-text-right c-w-150">
                    ¥{{ Number(item.contract_withdrawal_fee_1).toLocaleString('ja-JP') }}
                  </td>
                  <!-- <td class="va-text-right c-w-150">{{ item.contract_condition_number }}</td> -->
                  <td class="va-text-left c-w-150">{{ convertDateToString(item.created_at) }}</td>
                  <td class="c-w-100 va-text-center" style="min-width: 100px;">
                    <router-link
                      :to="{ name: 'bank_edit', params: { id: item.id } }"
                      class="cus-link-primary fw-500 c-mr-10"
                    >
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
        <!-- </div>
        </div> -->
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
  import { Bank } from '../../../types/Bank'
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

  const currentPage: Ref<number> = ref(0)
  const lastPage = ref(0)
  const totalRecords: Ref<number> = ref(0)
  const visiblePages: Ref<number> = ref(5)

  const data: Ref<Bank[]> = ref([])
  const renderedTable = ref(0)

  const checkPaginate = computed(() => {
    return lastPage.value > 1 ? true : false
  })

  onMounted((): void => {
    checkUpdated()
    checkCreated()
    getListBank().finally(() => {
      isLoading.value = false
    })
  })

  watch(lastPage, () => {
    if(lastPage.value >= 1 && data.value.length == 0) {
      --currentPage.value
    }
  })

  const getListBank = async () => {
    renderedTable.value = renderedTable.value + 1
    isLoading.value = true
    await service.getListShow(`${API.MANAGEMENT_COMMON.BANK.LIST_WITH_PAGINATE(currentPage.value)}`)
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

  const deleteBank = async (id: number) => {
    const resultDelete = await service.delete(`${API.MANAGEMENT_COMMON.BANK.DELETE(id)}`)
    if (resultDelete.status) {
      init({ message: t('message_success.delete', {field: t('bank.bank_list_title')}), color: 'success' })
      getListBank()
    } else {
      init({ message: resultDelete.message, color: 'danger' })
    }
  }

  const checkCreated = () => {
    if (GlobalStore.$state.isCreated) {
      init({ message: t('message_success.add', {field: t('bank.bank_list_title')}), color: 'success' })
      GlobalStore.$state.isCreated = false
    }
  }

  const checkUpdated = () => {
    if (GlobalStore.$state.isUpdated) {
      init({ message: t('message_success.edit', {field: t('bank.bank_list_title')}), color: 'success' })
      GlobalStore.setIsUpdated()
    }
  }

  const { confirm } = useModal()

  const onDeleteItemClick = async (id: any) => {
    const result = await confirm({
      message: t('delete_confirm'),
      okText: t('delete'),
      cancelText: t('cancel'),
    })

    if (result) {
      deleteBank(id)
    } else {
      //click cancel, do something else
    }
  }

  watch(currentPage, getListBank)
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
