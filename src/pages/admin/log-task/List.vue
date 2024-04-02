<template>
    <div class="markup-tables flex">
      <div>
        <h1 class="page-title">{{ t('log_task.log_task_title') }}</h1>
      </div>
      <va-card class="flex c-mt-30">
        <va-card-content>
          <div class="c-mb-20 d-flex-between">
            <h3 class="section-title">{{ t('log_task.list_log_task_title') }}</h3>
          </div>
          <div class="cus-tabel-wrapper">
            <table>
              <thead>
                <tr>
                  <th class="c-w-50" style="min-width: 50px;">{{ t('log_task.id') }}</th>
                  <th class="c-w-70" style="min-width: 70px;">{{ t('log_task.task_id') }}</th>
                  <th class="c-w-200" style="min-width: 200px;">{{ t('log_task.message') }}</th>
                  <th class="c-w-150" style="min-width: 150px;">{{ t('log_task.created_date') }}</th>
                  <th class="c-w-150" style="min-width: 150px;">{{ t('log_task.updated_date') }}</th>
                  <!-- <th class="c-w-60 va-text-center"></th> -->
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
                    <td class="va-text-right vertical-middle c-w-50">
                      {{ item.id }}
                    </td>
                    <td class="va-text-right c-w-70">
                      {{ item.task_id }}
                    </td>
                    <td class="va-text-left c-w-100" style="max-width: 350px !important;">
                      <va-popover placement="top" >
                      <div class="c-w-600 content-dot" style="width: 100% !important;">
                        {{  item.message }}
                      </div>
                      <template #body>
                        <p style="color: #788b9a">{{ item.message }}</p>
                      </template>
                    </va-popover>
                    </td>
                    <td class="va-text-left c-w-150">{{ convertDateTimeToString(item.created_at) }}</td>
                    <td class="va-text-left c-w-150">{{ convertDateTimeToString(item.updated_at) }}</td>
                    <!-- <td class="c-w-60 va-text-center" style="min-width: 60px;">
                      <a href="#" class="cus-link-primary fw-500" >
                        {{ t('action_log.re_migration') }}
                      </a>
                    </td> -->
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
    import { LogTask } from '../../../types/LogTask'
    import { ref, onMounted, computed, watch } from 'vue'
    import type { Ref } from 'vue'
    import { useToast } from 'vuestic-ui'
    import { useGlobalStore } from '../../../stores/global-store'
    import { convertDateToString, convertDateTimeToString } from '../../../common/utils'
    import Pagination from '../../../components/pagination/Pagination.vue'
    import LogTaskService from '../../../services/LogTaskService'
    import { STATUS_TASK_MANAGEMENT } from '../../../common/constants'
  
    const { t } = useI18n()
  
    const { init } = useToast()
    const GlobalStore = useGlobalStore()
    const isLoading = ref(false)
  
    const currentPage: Ref<number> = ref(1)
    const lastPage = ref(0)
    const totalRecords: Ref<number> = ref(0)
    const visiblePages: Ref<number> = ref(5)
  
    const data: Ref<LogTask[]> = ref([])
  
    const checkPaginate = computed(() => {
      return lastPage.value > 1 ? true : false
    })
  
    onMounted(async () => {
      await getListLogTask()
    })
  
    watch(data, () => {
      if(lastPage.value > 1 && data.value.length == 0) {
        --currentPage.value
      }
    })
  
    const getListLogTask = async () => {
      isLoading.value = true
      await LogTaskService.getListLogTask(currentPage.value)
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
        }).finally(() => {
        isLoading.value = false
        })
    }
  
    watch(currentPage, getListLogTask)
  </script>
  
  <style lang="scss" scoped>
    .markup-tables {
      .table-wrapper {
        // overflow: auto;
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
          // td:last-child {
          //   border-left: 1px solid #cccccc;
          //   position: sticky;
          //   right: 0px;
          //   background-color: #ffffff;
          // }
          .boder-line {
            td {
              border-bottom: 1px solid #cccccc !important;
            }
          }
        }
      }
    }
  </style>
  