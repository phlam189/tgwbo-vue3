<template>
  <va-modal v-model="open" max-width="1650px" class="modal_view" no-dismiss hide-default-actions no-esc-dismiss>
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
          <div v-if="props.dataHeader?.profit_include_wm" class="item-row">
            <div class="item-title">{{ t('modal.profit_loss_wm') }}:</div>
            <div class="item-content">{{ formatCurrency.func(props.dataHeader?.profit_include_wm) }}</div>
          </div>
        </div>
      </div>
      <TableEdit
        class="pb-2"
        :select-list-client="props.selectListClient"
        :data-income-expenditure="dataIncomeExpenditure"
        :type="type"
      />
      <div
        v-if="dataIncomeExpenditure && dataIncomeExpenditure.id && show"
        class="bottom-action"
        :style="{ width: setWidthModal + ' !important' }"
      >
        <va-button class="button-cancel" @click="cancelModal">{{ t('modal.cancel') }}</va-button>
        <div class="d-flex gap-3">
          <va-button class="button-create" @click="downloadIncome">{{ t('modal.download') }}</va-button>
          <va-button class="button-create" @click="submit">{{ t('edit') }}</va-button>
        </div>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, defineEmits, defineExpose, defineProps, onUpdated } from 'vue'
  import { useI18n } from 'vue-i18n'
  import TableEdit from '../../pages/admin/balance-manager/TableEdit.vue'
  import { convertMonthToString, formatCurrency } from '../../common/utils'
  const { t } = useI18n()
  const open = ref<boolean>(false)
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit'): void
    (e: 'downloadIncome', id: number): void
  }>()

  const props = defineProps<{
    type: boolean
    dataHeader: any
    dataIncomeExpenditure: any
    selectListClient: any
  }>()

  const show = ref<boolean>(false)
  const setWidthModal = ref<string>('')

  const openModal = () => {
    show.value = false
    open.value = !open.value
    setTimeout(() => {
      show.value = true
    }, 600)
  }

  const closeModal = () => {
    open.value = !open.value
    show.value = false
  }

  const cancelModal = () => {
    closeModal()
    emit('close')
  }

  const submit = () => {
    emit('submit')
  }

  const downloadIncome = () => {
    emit('downloadIncome', props.dataIncomeExpenditure.id)
  }

  onUpdated(() => {
    const dataWidth = document.getElementsByClassName('va-modal__inner')
    setWidthModal.value = dataWidth[0].clientWidth + 'px'
  })

  defineExpose({
    openModal,
    closeModal,
    downloadIncome,
  })
</script>

<style scoped lang="scss">
  .modal_view {
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
      padding: 0px 30px 10px 20px;
      align-items: center;
      background-color: #fff;
      justify-content: space-between;
      transform: translate(-50%, -50%);
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
  }
</style>
