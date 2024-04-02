<template>
  <div class="markup-tables flex">
    <div>
      <h1 class="page-title">{{ t('action_log.action_log_title') }}</h1>
    </div>
    <va-card class="flex c-mt-30">
      <va-card-content>
        <div class="c-mb-20 d-flex-between">
          <h3 class="section-title">{{ t('action_log.list_action_log_title') }}</h3>
        </div>
        <div class="cus-tabel-wrapper">
          <table>
            <thead>
              <tr>
                <th class="c-w-70" style="min-width: 70px">{{ t('action_log.task_id') }}</th>
                <th class="c-w-200" style="min-width: 150px">{{ t('action_log.client_name') }}</th>
                <th class="c-w-200" style="min-width: 150px">{{ t('action_log.sync_up_date') }}</th>
                <th class="c-w-80" style="min-width: 80px">{{ t('action_log.status') }}</th>
                <th class="c-w-150" style="min-width: 150px">{{ t('action_log.number_execution') }}</th>
                <!-- <th class="c-w-150" style="min-width: 150px;">{{ t('bank.contract_condition_number') }}</th> -->
                <th class="c-w-150" style="min-width: 180px">{{ t('action_log.created_date') }}</th>
                <th class="c-w-150" style="min-width: 180px">{{ t('action_log.updated_date') }}</th>
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
              <template v-else-if="data.length > 0">
                <tr v-for="item in data" :key="item.id">
                  <td class="va-text-right vertical-middle">
                    {{ item.id }}
                  </td>
                  <td class="va-text-left c-w-200">
                    {{ item.client_name }}
                  </td>
                  <td class="va-text-left c-w-200">
                    {{ convertDateToString(item.date_sync) }}
                  </td>
                  <td class="va-text-left c-w-80">
                    <div class="d-flex" style="width: 100% !important;height: auto;">
                      <span :style="`color: ${statusStyle(item.status)}`">{{ convertStatus(item.status) }}</span>
                    <!-- <div style="height: 100%;"> 
                      <va-button-dropdown
                      preset="plain"
                    >
                      <va-list-item-label :style="`color: ${STATUS_TASK_MANAGEMENT.RUNNING.COLOR}`" class="mb-2" @click="handleUpdateStatus(item.id, STATUS_TASK_MANAGEMENT.RUNNING.VALUE)">
                        {{ t('action_log.status_running') }}
                      </va-list-item-label>
                      <va-list-item-label class="mb-2" :style="`color: ${STATUS_TASK_MANAGEMENT.SUCCESS.COLOR}`" @click="handleUpdateStatus(item.id, STATUS_TASK_MANAGEMENT.SUCCESS.VALUE)">
                        {{ t('action_log.status_success') }}
                      </va-list-item-label>
                      <va-list-item-label :style="`color: ${STATUS_TASK_MANAGEMENT.FAIL.COLOR}`" @click="handleUpdateStatus(item.id, STATUS_TASK_MANAGEMENT.FAIL.VALUE)">
                        {{ t('action_log.status_fail') }}
                      </va-list-item-label>
                    </va-button-dropdown>
                    </div> -->
                    </div>
                  </td>
                  <td class="va-text-right c-w-150">
                    {{ item.count }}
                  </td>
                  <td class="va-text-left c-w-150">{{ convertDateTimeToString(item.created_at) }}</td>
                  <td class="va-text-left c-w-150">{{ convertDateTimeToString(item.updated_at) }}</td>
                  <td class="c-w-60 va-text-center" style="min-width: 60px;" :class="disabledBlock(item.status)">
                    <a href="#" class="cus-link-primary fw-500" :class="disabled(item.status)" @click="update(item.id)">
                      {{ t('action_log.re_migration') }}
                    </a>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="10" class="va-text-center va-text-danger" style="border-left: none">
                  {{ t('list_no_data') }}
                </td>
              </tr>
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
  import { useI18n } from 'vue-i18n'
  import { TaskManagement } from '../../../types/TaskManagement'
  import { ref, onMounted, computed, watch } from 'vue'
  import type { Ref } from 'vue'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { convertDateToString, convertDateTimeToString } from '../../../common/utils'
  import Pagination from '../../../components/pagination/Pagination.vue'
  import ActionLogService from '../../../services/ActionLogService'
  import { STATUS_TASK_MANAGEMENT } from '../../../common/constants'

  const { t } = useI18n()

  const { init } = useToast()
  const GlobalStore = useGlobalStore()
  const isLoading = ref(false)

  const currentPage: Ref<number> = ref(1)
  const lastPage = ref(0)
  const totalRecords: Ref<number> = ref(0)
  const visiblePages: Ref<number> = ref(5)
  const statusColor = ref()

  const data: Ref<TaskManagement[]> = ref([])

  const checkPaginate = computed(() => {
    return lastPage.value > 1 ? true : false
  })

  const disabled = (value: any) => {
    return (value !== STATUS_TASK_MANAGEMENT.FAIL.VALUE) ? "disabled" : ""
  }

  const disabledBlock = (value: any) => {
    return (value !== STATUS_TASK_MANAGEMENT.FAIL.VALUE) ? "cursor" : ""
  }

  onMounted(async () => {
    await getListTaskManagement()
  })

  watch(data, () => {
    if (lastPage.value > 1 && data.value.length == 0) {
      --currentPage.value
    }
  })

  const statusStyle = (value: any) => {
    switch (value) {
      case STATUS_TASK_MANAGEMENT.RUNNING.VALUE:
        return (statusColor.value = STATUS_TASK_MANAGEMENT.RUNNING.COLOR)
      case STATUS_TASK_MANAGEMENT.SUCCESS.VALUE:
        return (statusColor.value = STATUS_TASK_MANAGEMENT.SUCCESS.COLOR)
      default:
        return (statusColor.value = STATUS_TASK_MANAGEMENT.FAIL.COLOR)
    }
  }

  const convertStatus = (value: number) => {
    if (value == STATUS_TASK_MANAGEMENT.RUNNING.VALUE) {
      return t('action_log.status_running')
    }
    if (value == STATUS_TASK_MANAGEMENT.SUCCESS.VALUE) {
      return t('action_log.status_success')
    }
    return t('action_log.status_fail')
  }

  // const handleUpdateStatus = async (id: number, status: number) => {
  //   isLoading.value = true
  //   await ActionLogService.updateStatus(id, status)
  //   .then((res) => {
  //     data.value.forEach((item: any, index: number) => {
  //       if(item.id == id) {
  //         data.value[index].status = res.status
  //       }        
  //     });
      
  //   })
  //   .finally(() => {
  //     isLoading.value = false
  //   })
  // }

  const getListTaskManagement = async () => {
    isLoading.value = true
    await ActionLogService.getListLog(currentPage.value)
      .then((res) => {
        data.value = res.data.data
        totalRecords.value = res.data.total
        currentPage.value = res.data.current_page
        lastPage.value = res.data.last_page
      })
      .catch(() => {
        var message = ''
        message = t('message_error.Unknown_error')
        init({ message: message, color: 'danger' })
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  const update = async (id: number) => {
    GlobalStore.setLoading(true)
    await ActionLogService.update(id)
      .then(() => {
        GlobalStore.setLoading(false)
        getListTaskManagement()
      })
      .catch(() => {
        init({ message: t('message_error.500'), color: 'danger' })
        GlobalStore.setLoading(false)
      })
  }

  watch(currentPage, getListTaskManagement)
</script>

<style lang="scss" scoped>

  .disabled {
    color: gray !important;
    pointer-events: none;
  }

  .cursor {
    cursor: not-allowed;
  }

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
