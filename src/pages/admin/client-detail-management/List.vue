<template>
  <!-- <div class="markup-tables flex">
    <div>
      <h1 class="page-title">{{ t('client_detail.client_detail_list_title') }}</h1>
    </div>
    <va-card class="flex c-mt-30"> -->
      <!-- <va-card-content> -->
        <!-- <div class="c-mb-20">
          <div class="title c-mb-36">{{ t('client_detail.client_detail_list_title') }}</div>
        </div> -->
        <div class="c-mb-20 d-flex c-mt-20 gap-3" :key="renderedTable">
          <div class="title text-center" style="display: flex; align-items: center;">{{ t('client_detail.client_detail_list_title') }}</div>
          <div class="c-mr-10">
            <router-link
            class="cus-link-primary fw-500"
            :to="{ name: 'client-list_contract_detail_add',
                  query: {
                    contract_detail: props['id'],
                    id: props['client_id'] ?? '',
                    method: props['contract_method']}
                  }
            ">
              <va-button class="button-create">{{ t('create') }}</va-button>
            </router-link>
          </div>
        </div>
        <div class="c-mb-10">
        </div>
          <div class="cus-tabel-wrapper">
            <table>
              <thead>
                <tr>
                  <th class="c-w-200" style="min-width: 150px;">{{ t('client_detail.service_type') }}</th>
                  <th class="c-w-200" style="min-width: 150px;">{{ t('client_detail.is_minimun_charge') }}</th>
                  <th class="c-w-200" style="min-width: 150px;">{{ t('client_detail.usage_fee_amount') }}</th>
                  <th class="c-w-200" style="min-width: 150px;">{{ t('client_detail.max_amount') }}</th>
                  <th class="c-w-150" style="min-width: 18  0px;">{{ t('client_detail.contract_date') }}</th>
                  <th class="c-w-150" style="min-width: 110px;">{{ t('client_detail.contract_rate') }}</th>
                  <!-- <th class="c-w-250" style="min-width: 150px;">{{ t('client_detail.is_transfer_fee') }}</th> -->
                  <!-- <th class="c-w-250" style="min-width: 110px;">{{ t('client_detail.charge_fee_rate') }}</th> -->
                  <!-- <th class="c-w-250" style="min-width: 150px;">{{ t('client_detail.charge_fee_memo') }}</th> -->
                  <!-- <th class="c-w-150" style="min-width: 110px;">{{ t('client_detail.settlement_fee_rate') }}</th> -->
                  <!-- <th class="c-w-150" style="min-width: 150px;">{{ t('client_detail.settlement_fee_memo') }}</th> -->
                  <th class="c-w-180" style="min-width: 180px;">{{ t('created_at') }}</th>
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
                  <td class="va-text-left c-w-200" >{{ convertServiceType(item.service_type) }}</td>
                  <td class="va-text-left c-w-200" >{{ convertMinimunCharge(item.is_minimun_charge) }}</td>
                  <td class="va-text-right c-w-200" >¥{{ convertUsageFee(item.usage_fee_amount) }}</td>
                  <td class="va-text-right c-w-200" >¥{{ convertUsageFee(item.max_amount) }}</td>
                  <td class="va-text-left c-w-150">{{ convertDateToString(item.contract_date) }}</td>
                  <td class="va-text-right c-w-150" >{{ item.contract_rate ?? 0 }}%</td>
                  <!-- <td class="va-text-left c-w-250" >{{ convertTranferFee(item.is_transfer_fee) }}</td> -->
                  <!-- <td class="va-text-right c-w-250">{{ item.charge_fee_rate ?? 0 }}%</td> -->
                  <!-- <td class="va-text-left c-w-250" >{{ item.charge_fee_memo }}</td> -->
                  <!-- <td class="va-text-right c-w-150" >{{ item.settlement_fee_rate ?? 0 }}%</td> -->
                  <!-- <td class="va-text-left c-w-150" >{{ item.settlement_fee_memo }}</td> -->
                  <td class="va-text-right c-w-150">{{ convertDateToString(item.created_at) }}</td>
                  <td class="c-w-100 va-text-center" style="min-width: 100px;">
                    <router-link
                    :to="{
                      name: 'client-list_contract_detail_edit',
                      params: { id: item.id },
                      query: { contract_detail: props['id'], method: props['contract_method'] } }"
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
          <Pagination
            v-model="currentPage"
            :last-page="lastPage"
            :visible-page="visiblePages"
          />
        </div>
        <div class="d-flex gap-4 d-flex-end c-mt-25">
          <!-- <router-link class="cus-link-primary fw-500" :to="{ name: 'contract_detail_add', params: { id: route.params.id } }">
            <va-button class="button-create">{{ t('create') }}</va-button>
          </router-link> -->
        </div>
      <!-- </va-card-content> -->
    <!-- </va-card>
  </div> -->
</template>

<script setup lang="ts">
  import { useModal } from 'vuestic-ui'
  import { useI18n } from 'vue-i18n'
  import { ref, computed, onMounted, defineProps, watch } from 'vue'
  import { useToast } from 'vuestic-ui'
  import { HTTP } from '../../../common/HTTP-common'
  import { HttpService } from '../../../common/HTTP-service'
  import type { Ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useGlobalStore } from '../../../stores/global-store'
  import { convertDateToString } from '../../../common/utils'
  import { PRESENSE_TYPE, SERVICE_TYPE, MIMIMUM_TYPE, TRANSFER_FEE_TYPE, REFERRAL_CLASSIFICATION_TYPE, CONTRACT_METHOD_TYPE } from '../../../common/constants'
  import Pagination from '../../../components/pagination/Pagination.vue'
  import { CommonService } from '../../../services/CommonService'
  import { API } from '../../../services/apis/apis'

  const props = defineProps(['client_id', 'id', 'contract_method']);

  const { t } = useI18n()
  const { init, close, closeAll } = useToast()
  const service = new CommonService()
  const route = useRoute()
  const GlobalStore = useGlobalStore()
  const isLoading = ref(false)

  const data = ref([])
  const currentPage: Ref<number> = ref(1)
  const lastPage = ref(0)
  const totalRecords: Ref<number> = ref(0)
  const visiblePages: Ref<number> = ref(5)
  const clientID = ref()
  const renderedTable = ref(0)

  const checkPaginate = computed(() => {
    return lastPage.value > 1 ? true : false
  })

  const convertMinimunCharge = (value: any) => {
    if(value == MIMIMUM_TYPE.CAN_BE) {
      return t("client_detail.can_be")
    }
    return t("client_detail.none")
  }

  const convertUsageFee = (value: any) => {
    if(value) {
      return Number(value).toLocaleString("ja-JP")
    }
    return 0
  }

  const convertServiceType = (value: any) => {
    return value == SERVICE_TYPE.DEPOSIT ? t("client_detail.deposit") : t("client_detail.withdrow")
  }

  watch(() => props['client_id'], (currentValue) => {
    if(props.client_id) {
      clientID.value = props['client_id']
      getListContracDetail(clientID.value).finally(() => {
      isLoading.value = false
    })
    }
  })

  onMounted(() => {
    checkCreated()
    checkUpdated()
  })

  watch(lastPage, () => {
    if(lastPage.value >= 1 && data.value.length == 0) {
      --currentPage.value
    }
  })

  const getListContracDetail = async (id: Number) => {
    renderedTable.value = renderedTable.value + 1
    isLoading.value = true
    await service.getListShow(`${API.MANAGEMENT_COMMON.CLIENT_DETAILS.LIST_WITH_PAGINATE(currentPage.value, id)}`)
      .then((res) => {
        data.value = res.data.data
        totalRecords.value = res.data.total
        currentPage.value = res.data.current_page
        lastPage.value = res.data.last_page
        isLoading.value = false
        data.value = data.value.sort((a: any, b: any) => a.service_type - b.service_type )
      })
      .catch((error) => {
        var message = ''
        message = t('message_error.Unknown_error')
        init({ message: message, color: 'danger' })
      })
  }

  const deleteContracDetail = async (id: Number) => {
    const resultDelete = await service.delete(`${API.MANAGEMENT_COMMON.CLIENT_DETAILS.DELETE(id)}`)
    if (resultDelete.status) {
      init({ message: t('message_success.delete', {field: t('client_detail.client_detail_list_title')}), color: 'success' })
      getListContracDetail(clientID.value)
    } else {
      init({ message: resultDelete.message, color: 'danger' })
    }
  }

  const checkCreated = () => {
    if (GlobalStore.$state.isCreated) {
      init({ message: t('message_success.add', {field: t('client_detail.client_detail_list_title')}), color: 'success' })
      GlobalStore.setIsCreated()
    }
  }

  const checkUpdated = () => {
    if (GlobalStore.$state.isUpdated) {
      init({ message: t('message_success.edit', {field: t('client_detail.client_detail_list_title')}), color: 'success' })
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
      deleteContracDetail(id)
    } else {
      //click cancel, do something else
    }
  }

  watch(currentPage, () => getListContracDetail(clientID.value))
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
