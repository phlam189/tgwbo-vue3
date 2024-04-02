<template>
  <va-modal v-model="open" max-width="1650px" class="modal_edit" no-dismiss hide-default-actions no-esc-dismiss>
    <div class="pd">
      <div class="modal-header">
        <div class="modal-title__left">
          {{ `LionGateWay ` + convertMonthToString(props.dataHeader?.date) + ' ' + t('balance_manager.report') }}
        </div>
        <div class="modal-title__right">
          <div class="item-row">
            <div class="item-title">{{ t('modal.duration') }}:</div>
            <div class="item-content">{{ props.dataHeader?.duration }}</div>
          </div>
          <div class="item-row">
            <div class="item-title">{{ t('modal.total_income') }}:</div>
            <div class="item-content">{{ formatCurrency.func(props.dataHeader?.totalBalance) }}</div>
          </div>
          <div class="item-row">
            <div class="item-title">{{ t('modal.total_expenditure') }}:</div>
            <div class="item-content">{{ formatCurrency.func(props.dataHeader?.totalSpending) }}</div>
          </div>
          <div class="item-row">
            <div class="item-title">{{ t('modal.profit_loss') }}:</div>
            <div class="item-content">{{ formatCurrency.func(props.dataHeader?.profit) }}</div>
          </div>
          <div class="item-row pt-1 pb-2">
            <div class="item-title">WM:</div>
            <div class="item-content">
              <va-input
                v-model.trim="$props.dataHeader.profit_wm"
                v-replace-wm
                mask="numeral"
                style="max-width: 180px"
                name="number_trans"
              >
                <template #prependInner>
                  <span style="color: #788b9a">¥</span>
                </template>
              </va-input>
            </div>
          </div>
          <div v-if="props.dataHeader?.profit_wm" class="item-row">
            <div class="item-title">{{ t('modal.profit_loss_wm') }}:</div>
            <div class="item-content">
              <va-input :model-value="formatNumber(profit_include_wm)" mask="numeral" style="max-width: 180px" disabled>
                <template #prependInner>
                  <span style="color: #788b9a">¥</span>
                </template>
              </va-input>
            </div>
          </div>
        </div>
      </div>
      <TableEdit
        ref="tableEdit"
        :select-list-client="selectListClient"
        :data-income-expenditure="dataIncomeExpenditure"
        :type="type"
        @delete-rows="deleteRows"
      />
      <div v-if="show" class="bottom-action" :style="{ width: setWidthModal + ' !important' }">
        <va-button class="button-cancel" @click="onClose">{{ t('modal.cancel') }}</va-button>
        <va-button
          :disabled="tableEdit?.isErrorBreakdown || tableEdit?.isErrorIncome"
          class="button-create"
          @click="submit()"
          >{{ t('save') }}</va-button
        >
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, nextTick, watch, defineEmits, defineProps, defineExpose, onUpdated } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { convertMonthToString, formatCurrency, formatNumber, roundDown, roundUp } from '../../common/utils'
  import TableEdit from '../../pages/admin/balance-manager/TableEdit.vue'
  import { useModal } from 'vuestic-ui'

  const { t } = useI18n()
  const open = ref<boolean>(false)
  const emit = defineEmits<{
    (e: 'submit', value: any): void
    (e: 'close'): void
    (e: 'delete-rows', value: any): void
  }>()

  const { confirm } = useModal()
  const tableEdit = ref<InstanceType<typeof TableEdit>>()

  const profit_include_wm = ref<number>(0)
  const show = ref(false)
  const setWidthModal = ref<string>('')

  const props = defineProps<{
    type: boolean
    dataHeader: any
    dataIncomeExpenditure: any
    selectListClient: any
  }>()

  const openModal = () => {
    show.value = false
    open.value = !open.value
    setTimeout(() => {
      show.value = true
    }, 550)
  }

  const closeModal = () => {
    show.value = false
    profit_include_wm.value = props.dataHeader?.profit
    open.value = !open.value
  }

  watch(
    () => props.dataIncomeExpenditure,
    (val) => {
      nextTick(() => {
        profit_include_wm.value = roundDown(val?.profit_include_wm) || 0
      })
    },
    { immediate: true },
  )

  watch(
    () => props.dataHeader?.profit_wm,
    () => {
      profit_include_wm.value = roundUp(+props.dataHeader?.profit) + roundUp(+props.dataHeader?.profit_wm)
    },
  )

  const onClose = () => {
    emit('close')
  }

  const submit = async () => {
    const result = await confirm({
      message: t('confirm_modal'),
      okText: t('modal.confirm'),
      cancelText: t('cancel'),
      noDismiss: true,
      noOutsideDismiss: true,
    })

    if (result) {
      const dataOther = tableEdit.value?.pushDataToSubmit()
      const reqData = props.dataIncomeExpenditure
      if (dataOther && dataOther.length > 0) {
        reqData.income_expenditure_details.push(...dataOther)
      }

      reqData.profit_wm = props.dataHeader?.profit_wm ? props.dataHeader?.profit_wm : 0

      reqData.profit_include_wm = props.dataHeader?.profit_wm
        ? profit_include_wm.value
        : props.dataHeader?.profit_include_wm
      emit('submit', reqData)
    }
  }

  const deleteRows = async (data: any) => {
    const result = await confirm({
      message: t('delete_confirm'),
      okText: t('modal.confirm'),
      cancelText: t('cancel'),
      noDismiss: true,
      noOutsideDismiss: true,
    })

    if (result) {
      emit('delete-rows', data)
    }
  }

  onUpdated(() => {
    setTimeout(() => {
      const dataWidth = document.getElementsByClassName('va-modal__inner')

      if (dataWidth && dataWidth.length > 1) {
        setWidthModal.value = dataWidth[1].clientWidth + 'px'
      } else {
        setWidthModal.value = dataWidth[0].clientWidth + 'px'
      }
    }, 100)
  })

  defineExpose({
    openModal,
    closeModal,
  })
</script>

<style scoped lang="scss">
  .modal_edit {
    .pd {
      padding: 0 10px;
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;
        .modal-title {
          &__left {
            font-size: 20px;
            font-weight: 700;
            line-height: 29px;
            color: #06152b;
          }
          &__right {
            text-align: right;

            .item-row {
              display: flex;
              font-weight: 500;
              font-size: 16px;
              line-height: 23px;
              align-items: center;
              .item-title {
                width: 250px;
                color: #788b9a;
                text-align: right;
                margin-right: 10px;
              }

              .item-content {
                color: #06152b;
              }
            }
          }
        }
      }
    }
    .bottom-action {
      left: 50.19%;
      outline: 0;
      z-index: 2;
      height: 60px;
      bottom: -14px;
      display: flex;
      position: fixed;
      padding: 0px 30px 0 20px;
      align-items: center;
      background-color: #fff;
      justify-content: space-between;
      transform: translate(-50%, -50%);
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  }
</style>
