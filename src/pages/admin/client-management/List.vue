<template>
  <div :key="renderedTable" class="markup-tables flex">
    <div>
      <h1 class="page-title">{{ t('client.client_list_title') }}</h1>
    </div>
    <va-card class="flex c-mt-30">
      <va-card-content>
        <div class="c-mb-20 d-flex-between">
          <h3 class="section-title">{{ t('client.client_list_title') }}</h3>
          <div class="c-mr-10">
            <router-link class="cus-link-primary fw-500" :to="{ name: 'client-list_add' }">
              <va-button class="button-create">{{ t('create') }}</va-button>
            </router-link>
          </div>
        </div>
        <div class="cus-tabel-wrapper">
          <table>
            <thead>
              <tr>
                <th class="c-w-200" style="min-width: 150px;">{{ t('client.company_name') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('client.represent_name') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('client.email') }}</th>
                <th class="c-w-150" style="min-width: 150px;">{{ t('client.service_name') }}</th>
                <th class="c-w-250" style="min-width: 150px;">{{ t('client.address') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('client.contract_method') }}</th>
                <th class="c-w-150" style="min-width: 180px;">{{ t('client.termination_date') }}</th>
                <th class="c-w-150" style="min-width: 150px;">{{ t('client.contractor_id') }}</th>
                <th class="c-w-150" style="min-width: 110px;">{{ t('client.presence') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('client.license_number') }}</th>
                <th class="c-w-180" style="min-width: 110px;">{{ t('client.total_year') }}</th>
                <th class="c-w-180" style="min-width: 110px;">{{ t('client.contract_use_service') }}</th>
                <th class="c-w-180" style="min-width: 150px;">{{ t('client.is_transfer_fee') }}</th>
                <th class="c-w-180" style="min-width: 110px;">{{ t('client.charge_fee_rate') }}</th>
                <th class="c-w-180" style="min-width: 150px;">{{ t('client.charge_fee_memo') }}</th>
                <th class="c-w-150" style="min-width: 110px;">{{ t('client.settlement_fee_rate') }}</th>
                <th class="c-w-150" style="min-width: 150px;">{{ t('client.settlement_fee_memo') }}</th>
                <th class="c-w-150" style="min-width: 150px;">{{ t('client.sales_representative') }}</th>
                <th class="c-w-200" style="min-width: 180px;">{{ t('created_at') }}</th>
                <th class="va-text-center c-w-100" ></th>
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
                  <td class="va-text-left c-w-200" style="max-width: 200px !important;">
                    <va-popover placement="top">
                      <div class="c-w-200 content-dot" style="width: 100% !important;">
                        {{ item.company_name }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a; max-width: 200px !important;">{{ item.company_name }}</p>
                      </template>
                    </va-popover>
                  </td>
                  <td class="va-text-left c-w-200" >{{ item.represent_name }}</td>
                  <td class="va-text-left c-w-200" >
                    <va-popover placement="top">
                      <div class="c-w-200 content-dot">
                        {{ item.email }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ item.email }}</p>
                      </template>
                    </va-popover>
                  </td>
                  <td class="va-text-left c-w-150" >{{ item.service_name }}</td>
                  <td class="va-text-left c-w-250" >
                    <va-popover placement="top">
                      <div class="c-w-200 content-dot">
                        {{ item.address }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ item.address }}</p>
                      </template>
                    </va-popover>
                  </td>
                  <td class="va-text-left c-w-200" >{{ convertContracMethod(item.contract_method) }}</td>
                  <td class="va-text-left c-w-150" >{{ convertDateToString(item.termination_date) }}</td>
                  <td class="va-text-left c-w-150" >
                    <va-popover placement="top">
                      <div class="c-w-200 content-dot">
                        {{ convertTextDisplayContractor(item.contractor) }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ convertTextDisplayContractor(item.contractor) }}</p>
                      </template>
                    </va-popover>
                  </td>
                  <td class="va-text-left c-w-150">{{ convertPresence(item.presence) }}</td>
                  <td class="va-text-right c-w-200" >{{ item.license_number }}</td>
                  <td class="va-text-right c-w-180">{{ item.total_year }}</td>
                  <td class="va-text-right c-w-180">{{ item.contract_use_service }}</td>
                  <td class="va-text-left c-w-250" >{{ convertTranferFee(item.is_transfer_fee) }}</td>
                  <td class="va-text-right c-w-250">{{ item.charge_fee_rate ?? 0 }}%</td>
                  <td class="va-text-left c-w-250" >{{ item.charge_fee_memo }}</td>
                  <td class="va-text-right c-w-150" >{{ item.settlement_fee_rate ?? 0 }}%</td>
                  <td class="va-text-left c-w-150" >{{ item.settlement_fee_memo }}</td>
                  <td class="va-text-left c-w-150" >{{ item.sales_representative }}</td>
                  <td class="va-text-left c-w-200" >{{ convertDateToString(item.created_at) }}</td>
                  <td class="va-text-center c-w-100" style="min-width: 100px;">
                    <router-link :to="{ name: 'client-list_edit', params: { id: item.id } }" class="cus-link-primary fw-500 c-mr-10">
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
  import { ref, computed, onMounted, watch } from 'vue'
  import { useToast } from 'vuestic-ui'
  import { HTTP } from '../../../common/HTTP-common'
  import { HttpService } from '../../../common/HTTP-service'
  import type { Ref } from 'vue'
  import { useGlobalStore } from '../../../stores/global-store'
  import { Client } from '../../../types/Client'
  import { convertDateToString } from '../../../common/utils'
  import Pagination from '../../../components/pagination/Pagination.vue'
  import { CommonService } from '../../../services/CommonService'
  import { CONTRACT_METHOD_TYPE, TRANSFER_FEE_TYPE } from '../../../common/constants'

  const { t } = useI18n()
  const { init, close, closeAll } = useToast()
  const service = new CommonService()
  const GlobalStore = useGlobalStore()
  const isLoading = ref(false)

  const data = ref([]) as Ref<Client[]>
  const currentPage: Ref<number> = ref(1)
  const lastPage = ref(0)
  const totalRecords: Ref<number> = ref(0)
  const visiblePages: Ref<number> = ref(5)
  const renderedTable = ref(0)

  const checkPaginate = computed(() => {
    return lastPage.value > 1 ? true : false
  })

  onMounted((): void => {
    checkCreated()
    checkUpdated()
    getListClient().finally(() => {
      isLoading.value = false
    })
  })

  watch(lastPage, () => {
    if(lastPage.value >= 1 && data.value.length == 0) {
      --currentPage.value
    }
  })

  const convertTextDisplayContractor = (value: any) => {
    if(value){
      let result = (value.company_name ?? '_') + '/'
            + (value.address ?? '_') + '/'
            + (value.email ?? '_') + '/'
            + (value.manager ?? '_')
      return result
    }
    return
  }

  const convertContracMethod = (value: any) => {
    if(value == CONTRACT_METHOD_TYPE.FLAT) {
      return t("client.flat")
    }
    return t("client.slide")
  }

  const convertTranferFee = (value: any) => {
    if(value == TRANSFER_FEE_TYPE.CAN_BE) {
      return t("client.can_be")
    }
    return t("client.none")
  }

  const getListClient = async () => {
    renderedTable.value = renderedTable.value + 1
    isLoading.value = true
    await service.getListShow(`/clients?page=${currentPage.value}`)
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

  const deleteClient = async (id: Number) => {
    const resultDelete = await service.delete(`/clients/${id}`)
    if (resultDelete.status) {
      init({ message: t('message_success.delete', {field: t('client.client_list_title')}), color: 'success' })
      getListClient()
    } else {
      init({ message: resultDelete.message, color: 'danger' })
    }
  }

  const convertPresence = (value: any) => {
    return value == 1 ? t("client.option_have") : t("client.option_none")
  }

  const checkCreated = () => {
    if (GlobalStore.$state.isCreated) {
      init({ message: t('message_success.add', {field: t('client.client_list_title')}), color: 'success' })
      GlobalStore.setIsCreated()
    }
  }

  const checkUpdated = () => {
    if (GlobalStore.$state.isUpdated) {
      init({ message: t('message_success.edit', {field: t('client.client_list_title')}), color: 'success' })
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
      deleteClient(id)
    } else {
      //click cancel, do something else
    }
  }

  watch(currentPage, getListClient)
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
