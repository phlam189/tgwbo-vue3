<template>
  <div :key="renderedTable" class="markup-tables flex">
    <div>
      <h1 class="page-title">{{ t('introducer.introducer_list_title') }}</h1>
    </div>
    <va-card class="flex c-mt-30">
      <va-card-content>
        <div class="c-mb-20 d-flex-between">
          <h3 class="section-title">{{ t('introducer.introducer_list_title') }}</h3>
          <div class="c-mr-10">
            <router-link class="cus-link-primary fw-500" :to="{ name: 'introducer_add', }">
              <va-button class="button-create">{{ t('create') }}</va-button>
            </router-link>
          </div>
        </div>
        <div class="cus-tabel-wrapper">
          <table>
            <thead>
              <tr>
                <th class="c-w-200" style="min-width: 150px;">{{ t('introducer.company_name') }}</th>
                <th class="c-w-200" style="min-width: 110px;">{{ t('introducer.representative_name') }}</th>
                <th class="c-w-200" style="min-width: 110px;">{{ t('introducer.email') }}</th>
                <th class="c-w-250" style="min-width: 150px;">{{ t('introducer.address') }}</th>
                <th class="c-w-200" style="min-width: 180px;">{{ t('introducer.contract_date') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('introducer.contractor_id') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('introducer.presence') }}</th>
                <th class="c-w-200" style="min-width: 150px;">{{ t('introducer.referral_classification') }}</th>
                <th class="c-w-150" style="min-width: 110px;">{{ t('introducer.referral_name') }}</th>
                <th class="c-w-150" style="min-width: 150px;">{{ t('introducer.referral_fee') }}</th>
                <th class="c-w-200" style="min-width: 180px;">{{ t('created_at') }}</th>
                <th class="c-w-150 va-text-center"></th>
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
                <td class="va-text-left c-w-200" >
                  <va-popover placement="top">
                      <div class="c-w-200 content-dot">
                        {{ item.representative_name }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ item.representative_name }}</p>
                      </template>
                    </va-popover>
                </td>
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
                <td class="va-text-left c-w-200" >{{ convertDateToString(item.contract_date) }}</td>
                <td class="va-text-left c-w-200" >
                  <va-popover placement="top">
                      <div class="c-w-200 content-dot">
                        {{ convertTextDisplayContractor(item.contructor) }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ convertTextDisplayContractor(item.contructor) }}</p>
                      </template>
                  </va-popover>
                </td>
                <td class="va-text-left c-w-200" >{{ convertPresence(item.presence) }}</td>
                <td class="va-text-right c-w-200">{{ convertReferralClassification(item.referral_classification) }}</td>
                <td class="va-text-left c-w-150" >
                  <va-popover placement="top">
                      <div class="c-w-150 content-dot">
                        {{ (item.referral_classification == REFERRAL_CLASSIFICATION_TYPE.CLIENT
                            ? item.client_represent_name
                            : item.contructor_representative_name)
                        }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">
                          {{ (item.referral_classification == REFERRAL_CLASSIFICATION_TYPE.CLIENT
                            ? item.client_represent_name
                            : item.contructor_representative_name)
                          }}
                        </p>
                      </template>
                    </va-popover>
                </td>
                <td class="va-text-right c-w-100">{{ item.referral_fee ?? 0 }}%</td>
                <td class="va-text-left c-w-200" >{{ convertDateToString(item.created_at) }}</td>
                <td class="c-w-150 va-text-center" style="min-width: 100px;">
                  <router-link :to="{ name: 'introducer_edit', params: { id: item.id } }" class="cus-link-primary fw-500 c-mr-10">
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
  import { Introducer } from '../../../types/Introducer'
  import { ref, onMounted, onUpdated, computed, watch } from 'vue'
  import { HTTP, HTTP_NO_AUTH } from '../../../common/HTTP-common'
  import { HttpService } from '../../../common/HTTP-service'
  import type { Ref } from 'vue'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { convertDateToString } from '../../../common/utils'
  import Pagination from '../../../components/pagination/Pagination.vue'
  import { API } from '../../../services/apis/apis'
  import { REFERRAL_CLASSIFICATION_TYPE, PRESENSE_TYPE } from '../../../common/constants'

  const { t } = useI18n()
  const { init, close, closeAll } = useToast()
  const service = new HttpService()
  const GlobalStore = useGlobalStore()
  const isLoading = ref(false)

  const currentPage: Ref<number> = ref(1)
  const lastPage = ref(0)
  const totalRecords: Ref<number> = ref(0)
  const visiblePages: Ref<number> = ref(5)
  const data = ref<Introducer[]>([])
  const renderedTable = ref(0)

  const checkPaginate = computed(() => {
    return lastPage.value > 1 ? true : false
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

  onMounted(async () => {
    checkCreated()
    checkUpdated()
    await getListIntroducer().finally(() => {
      isLoading.value = false
    })
  })

  watch(lastPage, () => {
    if(lastPage.value >= 1 && data.value.length == 0) {
      --currentPage.value
    }
  })

  const getListIntroducer = async () => {
    renderedTable.value = renderedTable.value + 1
    isLoading.value = true
    await HTTP_NO_AUTH.get(API.AUTH.COOKIE)
    await HTTP_NO_AUTH.get(`/introducer?page=${currentPage.value}`)
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

  const deleteIntroducer = async (id: Number) => {
    const resultDelete = await service.delete(`/introducer/${id}`)
    if (resultDelete.status) {
      init({ message: t('message_success.delete', {field: t('introducer.introducer_list_title')}), color: 'success' })
      getListIntroducer()
    } else {
      init({ message: resultDelete.message, color: 'danger' })
    }
  }

  const checkCreated = () => {
    if (GlobalStore.$state.isCreated) {
      init({ message: t('message_success.add', {field: t('introducer.introducer_list_title')}), color: 'success' })
      GlobalStore.setIsCreated()
    }
  }

  const checkUpdated = () => {
    if (GlobalStore.$state.isUpdated) {
      init({ message: t('message_success.edit', {field: t('introducer.introducer_list_title')}), color: 'success' })
      GlobalStore.setIsUpdated()
    }
  }

  const convertPresence = (value: any) => {
    if(value == PRESENSE_TYPE.HAVE) {
      return t("introducer.option_have")
    }
    return t("introducer.option_none")
  }

  const convertReferralClassification = (value: any) => {
    if(value == REFERRAL_CLASSIFICATION_TYPE.CLIENT) {
      return t("introducer.client")
    }
    return t("introducer.account")
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
      deleteIntroducer(id)
    } else {
      //click cancel, do something else
    }
  }

  watch(currentPage, getListIntroducer)
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
        top: 0;
        background-color: #ffffff;
        z-index: 1;
        tr:last-child {
          th:last-child {
            border-left: 1px solid #cccccc;
            position: sticky;
            right: 0;
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
          right: 0;
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
