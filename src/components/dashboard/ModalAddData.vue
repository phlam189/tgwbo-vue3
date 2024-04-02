<template>
  <va-modal v-model="open" hide-default-actions no-esc-dismiss no-outside-dismiss>
    <div style="width: 600px">
      <div class="c-mt-5 modal-title">{{ !isEditForm ? t('dashboard.add_new_data') : t('dashboard.edit_data') }}</div>
      <div class="d-flex flex gap-2 c-mt-15 c-ml-4">
        <div class="charge-history-types">
          <va-radio
            v-for="chargeHistoryType in chargeHistoryTypes"
            :key="chargeHistoryType.value"
            v-model="data.type"
            :option="chargeHistoryType.value"
            :label="chargeHistoryType.label"
          />
        </div>
      </div>

      <div class="hr-line c-my-10"></div>
      <div class="c-ml-4">
        <va-radio
          v-model="data.type_client_aggregation"
          :option="DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT"
          :disabled="isDisabledTypeClientAggregationField"
          :label="t('dashboard.deposit_account')"
          class="c-mr-64"
        />
        <va-radio
          v-model="data.type_client_aggregation"
          :option="DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL"
          :disabled="isDisabledTypeClientAggregationField"
          :label="t('dashboard.withdrawal_account')"
        />
      </div>
      <div class="d-flex flex gap-2 c-mt-15">
        <div>
          <p class="lable-input">{{ t('dashboard.amount_of_money') }}</p>
          <va-input v-if="allowNegativeNumber" v-model="data.payment_amount" class="cus-input" placeholder="0" />
          <va-input
            v-else
            v-model="data.payment_amount"
            type="number"
            class="cus-input"
            min="0"
            @keydown="preventInvalidKeys($event, ['e'])"
          />
          <p v-if="isErrorPaymentAmount" class="pt-1" style="font-size: small; color: #bc0909">
            {{ t('message_validate.payment_amount_must_be_less_than_account_balance') }}
          </p>
        </div>
        <div>
          <p class="lable-input">{{ t('dashboard.commission') }}</p>
          <va-input
            v-if="allowNegativeNumber"
            v-model="data.charge_fee"
            :disabled="isDisabledChargeFeeField"
            class="cus-input"
            placeholder="0"
          />
          <va-input
            v-else
            v-model="data.charge_fee"
            :disabled="isDisabledChargeFeeField"
            type="number"
            class="cus-input"
            width="175px"
            min="0"
            @keydown="preventInvalidKeys($event, ['e', '-'])"
          />
          <p v-if="isError" class="pt-1" style="font-size: small; color: #bc0909">
            {{ t('message_validate.charge_fee_must_be_less_than_payment_amount') }}
          </p>
        </div>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('dashboard.account_number') }}</p>
        <va-select
          v-model="data.account_number"
          :no-options-text="`${t('list_no_data')}`"
          bordered
          :placeholder="t('placeholder.select')"
          :disabled="isDisabledAccountNumberField"
          :options="
            data.type_client_aggregation === DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT
              ? listArrangeDeposit
              : listArrangeWithdrawal
          "
        />
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('dashboard.memo') }}</p>
        <va-input v-model.trim="data.memo" :disabled="isDisabledMemoField" />
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('dashboard.admin_note') }}</p>
        <va-input v-model.trim="data.memo_internal" type="textarea" :disabled="isDisabledAdminNoteField" />
      </div>

      <div class="d-flex gap-4 d-flex-end c-mt-22 c-mb-7">
        <va-button class="button-cancel" @click="closeModal">{{ t('modal.cancel') }}</va-button>
        <va-button
          class="button-create"
          :disabled="!isReadyToSubmit || isError || isErrorPaymentAmount"
          @click="onSubmit"
          >{{ !isEditForm ? t('modal.addition') : t('modal.edit') }}</va-button
        >
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { reactive, ref, watch, computed, defineEmits, defineProps } from 'vue'
  import { useI18n } from 'vue-i18n'
  import moment from 'moment'
  import { ChargeHistoryCreationParams } from '../../types/ChargeHistory'
  import ChargeHistoryService from '../../services/ChargeHistoryService'
  import AccountNumberService from '../../services/AccountNumberService'
  import {
    YYYY_MM_DD,
    CHARGE_HISTORY_TYPE,
    DEPOSIT_AND_WITHDRAWAL_CODE,
    DEPOSIT_AND_WITHDRAWAL_TEXT,
    CHARGE_HISTORY_PAYMENT_AMOUNT_MAX_LENGTH,
    CHARGE_HISTORY_TYPE_TEXT,
  } from '../../common/constants'
  import { Client } from '../../types/Client'
  import { nextTick } from 'vue'
  import { useModal, useToast } from 'vuestic-ui'
  import { ChargeHistoryItem } from '../../types/ChargeHistory'
  import { useGlobalStore } from '../../stores/global-store'
  import { roundUp } from '../../common/utils'

  const { t } = useI18n()
  const { confirm } = useModal()
  const { init } = useToast()
  const globalStore = useGlobalStore()

  const props = defineProps<{
    depositAccountBalance: number
  }>()
  const emit = defineEmits<{
    (e: 'success', data: ChargeHistoryCreationParams): void
  }>()

  const open = ref(false)
  const isError = ref(false)
  const isErrorPaymentAmount = ref(false)
  const isDisableDeposit = ref()
  const isDisableWithdrawal = ref()

  // const latestClientDetail = ref<ClientDetailItem | null>(null)
  const clientDetailData = ref<Client | null>(null)
  const isEditForm = ref(false)

  const listAccountNumber = ref<any>([])
  const listArrangeDeposit = ref<any>([])
  const listArrangeWithdrawal = ref<any>([])
  const allowNegativeNumber = ref(false)

  const data = reactive<Partial<ChargeHistoryCreationParams>>({
    id: undefined,
    client_id: undefined,
    client_aggregation_id: 0,
    type: undefined,
    type_client_aggregation: undefined,
    payment_amount: '',
    transfer_amount: '0',
    charge_fee: 0,
    memo: '',
    memo_internal: '',
    create_date: '',
    account_number: undefined,
  })
  const chargeHistoryTypesAllowNegativeNumber = ref([
    CHARGE_HISTORY_TYPE.MISC,
    // CHARGE_HISTORY_TYPE.DEPOSITS_AND_WITHDRAWALS,
  ])

  const chargeHistoryTypes = computed(() => {
    return [
      {
        value: CHARGE_HISTORY_TYPE.INTEREST,
        label: t(CHARGE_HISTORY_TYPE_TEXT.INTEREST),
      },
      {
        value: CHARGE_HISTORY_TYPE.SETTLEMENT,
        label: t(CHARGE_HISTORY_TYPE_TEXT.SETTLEMENT),
      },
      {
        value: CHARGE_HISTORY_TYPE.BORROWING,
        label: t(CHARGE_HISTORY_TYPE_TEXT.BORROWING),
      },
      {
        value: CHARGE_HISTORY_TYPE.REFUND,
        label: t(CHARGE_HISTORY_TYPE_TEXT.REFUND),
      },
      {
        value: CHARGE_HISTORY_TYPE.CHARGE,
        label: t(CHARGE_HISTORY_TYPE_TEXT.CHARGE),
      },
      {
        value: CHARGE_HISTORY_TYPE.REPAYMENT,
        label: t(CHARGE_HISTORY_TYPE_TEXT.REPAYMENT),
      },
      {
        value: CHARGE_HISTORY_TYPE.TRANSFER,
        label: t(CHARGE_HISTORY_TYPE_TEXT.TRANSFER),
      },
      {
        value: CHARGE_HISTORY_TYPE.MISC,
        label: t(CHARGE_HISTORY_TYPE_TEXT.MISC),
      },
      {
        value: CHARGE_HISTORY_TYPE.DEPOSITS_AND_WITHDRAWALS,
        label: t(CHARGE_HISTORY_TYPE_TEXT.DEPOSITS_AND_WITHDRAWALS),
      },
    ]
  })

  const chargeHistoryTypesDisableClientAggregationType = [CHARGE_HISTORY_TYPE.TRANSFER, CHARGE_HISTORY_TYPE.CHARGE]

  const chargeHistoryTypesDisableChargeFee = [
    CHARGE_HISTORY_TYPE.INTEREST,
    CHARGE_HISTORY_TYPE.BORROWING,
    CHARGE_HISTORY_TYPE.REPAYMENT,
  ]

  const chargeHistoryTypesDisableMemo = [
    CHARGE_HISTORY_TYPE.INTEREST,
    CHARGE_HISTORY_TYPE.MISC,
    CHARGE_HISTORY_TYPE.BORROWING,
    CHARGE_HISTORY_TYPE.REPAYMENT,
  ]

  const chargeHistoryTypesDisableAdminNote = [CHARGE_HISTORY_TYPE.INTEREST]

  const isDisabledTypeClientAggregationField = computed(() => {
    if (data.type == undefined) {
      return false
    }

    return chargeHistoryTypesDisableClientAggregationType.includes(data.type)
  })

  const isDisabledChargeFeeField = computed(() => {
    if (data.type == undefined) {
      return false
    }

    if (
      (data.type === CHARGE_HISTORY_TYPE.DEPOSITS_AND_WITHDRAWALS &&
        data.type_client_aggregation === DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT) ||
      (data.type == CHARGE_HISTORY_TYPE.TRANSFER && clientDetailData.value?.is_transfer_fee == 0)
    ) {
      return true
    }

    return chargeHistoryTypesDisableChargeFee.includes(data.type)
  })

  const isDisabledMemoField = computed(() => {
    if (data.type == undefined) {
      return false
    }

    return chargeHistoryTypesDisableMemo.includes(data.type)
  })

  const isDisabledAdminNoteField = computed(() => {
    if (data.type == undefined) {
      return false
    }

    return chargeHistoryTypesDisableAdminNote.includes(data.type)
  })

  const checkTypeInclude = computed(() => {
    return [
      CHARGE_HISTORY_TYPE.DEPOSITS_AND_WITHDRAWALS,
      CHARGE_HISTORY_TYPE.INTEREST,
      CHARGE_HISTORY_TYPE.BORROWING,
      CHARGE_HISTORY_TYPE.REPAYMENT,
      CHARGE_HISTORY_TYPE.MISC,
      CHARGE_HISTORY_TYPE.TRANSFER,
      CHARGE_HISTORY_TYPE.CHARGE,
      CHARGE_HISTORY_TYPE.SETTLEMENT,
      CHARGE_HISTORY_TYPE.REFUND,
    ].includes(Number(data.type))
  })

  const isDisabledAccountNumberField = computed(() => {
    if (data.type == undefined || !data.type_client_aggregation) {
      return true
    }

    if (
      data.type === CHARGE_HISTORY_TYPE.CHARGE ||
      (checkTypeInclude.value && data.type_client_aggregation == DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT)
    ) {
      return true
    }

    return false
  })

  const isReadyToSubmit = computed(() => {
    const exceptChargeHistory = [
      CHARGE_HISTORY_TYPE.INTEREST,
      CHARGE_HISTORY_TYPE.MISC,
      CHARGE_HISTORY_TYPE.BORROWING,
      CHARGE_HISTORY_TYPE.REPAYMENT,
    ]
    const depositAndWithdrawal = [DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT, DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL]

    if (!isDisabledTypeClientAggregationField.value && !data.type_client_aggregation) {
      return false
    }

    if (data.type === undefined) {
      return false
    }

    if (!data.payment_amount) {
      return false
    }

    if (!exceptChargeHistory.includes(data.type) && depositAndWithdrawal.includes(data.type_client_aggregation ?? 0)) {
      if (!data.account_number && !isDisabledAccountNumberField.value) {
        return false
      }
    }

    return true
  })

  const getAccountNumber = async (id: number) => {
    globalStore.setLoading(true)
    try {
      const result = await AccountNumberService.getAccountNumberByClientId(id)
      listAccountNumber.value = result.data
      listArrangeDeposit.value = listAccountNumber.value
        .filter((item: any) => item.service_type == DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT)
        .map((item: any) => item.account_number)
      listArrangeWithdrawal.value = listAccountNumber.value
        .filter((item: any) => item.service_type == DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL)
        .map((item: any) => item.account_number)
    } catch (error) {
      console.log(error)
    } finally {
      globalStore.setLoading(false)
    }
  }

  const openModal = async ({
    clientData,
    createDate,
    typeClientAggregation,
    isEdit,
    chargeHistoryItem,
    numberTransDeposit,
    numberTransWithdrawal,
  }: {
    clientData: Client
    createDate?: string
    typeClientAggregation?: string
    isEdit?: boolean
    chargeHistoryItem?: ChargeHistoryItem
    numberTransDeposit?: any
    numberTransWithdrawal?: any
  }) => {
    isErrorPaymentAmount.value = false
    clientDetailData.value = clientData
    await getAccountNumber(clientData.client_id)
    if (isEdit && chargeHistoryItem) {
      isEditForm.value = true
      data.create_date = moment(chargeHistoryItem.create_date).format(YYYY_MM_DD)
      data.id = chargeHistoryItem.id
      data.client_id = chargeHistoryItem.client_id
      data.client_aggregation_id = chargeHistoryItem.client_aggregation_id
      data.type = chargeHistoryItem.type
      data.type_client_aggregation = chargeHistoryItem.type_client_aggregation
      data.payment_amount = `${roundUp(chargeHistoryItem.payment_amount)}`
      data.transfer_amount = `${roundUp(chargeHistoryItem.transfer_amount)}`
      data.charge_fee = roundUp(chargeHistoryItem.charge_fee)
      data.memo = chargeHistoryItem.memo
      data.memo_internal = chargeHistoryItem.memo_internal
      data.account_number = chargeHistoryItem.account_number
    } else {
      isEditForm.value = false
      data.client_id = clientData.client_id
      isDisableDeposit.value = numberTransDeposit
      isDisableWithdrawal.value = numberTransWithdrawal

      const today = moment()
      data.create_date = createDate ? moment(createDate).format(YYYY_MM_DD) : today.format(YYYY_MM_DD)

      if (typeClientAggregation === DEPOSIT_AND_WITHDRAWAL_TEXT.DEPOSIT) {
        data.type_client_aggregation = DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT
      }

      if (typeClientAggregation === DEPOSIT_AND_WITHDRAWAL_TEXT.WITHDRAWAL) {
        data.type_client_aggregation = DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL
      }

      if (typeClientAggregation === DEPOSIT_AND_WITHDRAWAL_TEXT.ALL) {
        data.type = CHARGE_HISTORY_TYPE.DEPOSITS_AND_WITHDRAWALS
      }
    }

    open.value = true
  }

  const closeModal = () => {
    data.client_id = undefined
    data.client_aggregation_id = 0
    data.type = undefined
    data.type_client_aggregation = undefined
    data.payment_amount = ''
    data.transfer_amount = '0'
    data.charge_fee = 0
    data.memo = ''
    data.memo_internal = ''
    data.create_date = ''
    open.value = false
  }

  // const getClientDetail = async (clientId: number) => {
  //   const data = await ClientService.getClientDetail(clientId)

  //   if (!data.data.length) {
  //     return
  //   }

  //   let latest = data.data[0]
  //   data.data.forEach((item) => {
  //     const itemContractDate = moment(item.contract_date)
  //     const latestContractDate = moment(latest.contract_date)
  //     const now = moment()

  //     if (itemContractDate.isAfter(latestContractDate, 'day') && itemContractDate.isBefore(now, 'day')) {
  //       latest = item
  //     }
  //   })

  //   latestClientDetail.value = latest
  // }

  const recalcChargeFee = () => {
    if (!clientDetailData.value) {
      return
    }

    if (data.type === CHARGE_HISTORY_TYPE.CHARGE) {
      const rate = Number(clientDetailData.value.charge_fee_rate)
      return (data.charge_fee = roundUp(Number(data.payment_amount) * rate) / 100 || 0)
    }

    if (data.type === CHARGE_HISTORY_TYPE.SETTLEMENT) {
      const rate = Number(clientDetailData.value.settlement_fee_rate)
      return (data.charge_fee = roundUp(Number(data.payment_amount) * rate) / 100 || 0)
    }

    if (data.type === CHARGE_HISTORY_TYPE.INTEREST) {
      const rate = Number(clientDetailData.value.interest_rate)
      return (data.charge_fee = roundUp(Number(data.payment_amount) * rate) / 100 || 0)
    }
  }

  const onSubmit = async () => {
    const submittedData: ChargeHistoryCreationParams = {
      client_id: Number(data.client_id),
      client_aggregation_id: Number(data.client_aggregation_id),
      type: Number(data.type),
      type_client_aggregation: Number(data.type_client_aggregation),
      payment_amount: roundUp(data.payment_amount).toString() || '0',
      transfer_amount: roundUp(data.transfer_amount).toString() || '0',
      charge_fee: roundUp(data.charge_fee) || 0,
      memo: data.memo || '',
      memo_internal: data.memo_internal || '',
      create_date: String(data.create_date),
      account_number: data.account_number,
    }

    const result = await confirm({
      message: t('confirm_modal'),
      okText: t('modal.confirm'),
      cancelText: t('cancel'),
      noDismiss: true,
      noOutsideDismiss: true,
    })

    if (result) {
      const response = !isEditForm.value
        ? await ChargeHistoryService.createChargeHistory(submittedData)
        : await ChargeHistoryService.updateChargeHistory({ ...submittedData, id: data.id })

      if (response) {
        emit('success', { ...submittedData })
        init({ message: t('toast.success'), color: 'success' })
        closeModal()
      } else {
        init({ message: response.message, color: 'danger' })
      }
    }
  }

  const preventInvalidKeys = (event: KeyboardEvent, keys: string[]) => {
    if (keys.includes(event.key)) {
      event.preventDefault()
    }
  }

  const checkValidateComission = () => {
    if (Number(data.charge_fee) > Number(data.payment_amount)) {
      isError.value = true
    } else {
      isError.value = false
    }
  }

  const checkValidatePaymentAmount = () => {
    if (data.payment_amount && +data.payment_amount > 0) {
      isErrorPaymentAmount.value = +data.payment_amount > props.depositAccountBalance
    }
  }

  const isValidNegativeAndPlusNumber = (value) => {
    const pattern = /^-?\d+$/
    return pattern.test(value)
  }

  watch(
    () => data.payment_amount,
    () => {
      nextTick(() => {
        let newValue = data.payment_amount
          ?.toString()
          .slice(0, data.payment_amount?.charAt(0) === '-' ? 10 : CHARGE_HISTORY_PAYMENT_AMOUNT_MAX_LENGTH)

        if (!chargeHistoryTypesAllowNegativeNumber.value.includes(data.type ?? 0)) {
          newValue = newValue.replace(/-/g, '')
          if (newValue && newValue[newValue.length - 1] !== '.') {
            data.payment_amount = roundUp(Number(newValue)).toString()
          } else {
            data.payment_amount = Number(newValue?.slice(0, -1)).toString()
          }
        } else {
          const pattern = /\D(?<!-)/g
          if (newValue.charAt(0) !== '-') {
            data.payment_amount = isValidNegativeAndPlusNumber(newValue)
              ? roundUp(+newValue ?? 0).toString()
              : roundUp(Number(newValue.replace(pattern, '') ?? 0)).toString()
            data.payment_amount = data.payment_amount == 0 ? '' : data.payment_amount
          } else {
            if (newValue.length >= 2) {
              data.payment_amount = isValidNegativeAndPlusNumber(newValue)
                ? roundUp(+newValue ?? 0).toString()
                : roundUp(Number(newValue.replace(pattern, '') ?? 0)).toString()
            }
          }
        }
        checkValidatePaymentAmount()
        checkValidateComission()
      })
    },
  )

  watch(
    () => data.charge_fee,
    () => {
      nextTick(() => {
        let newValue: string | number = data.charge_fee ?? 0

        if (!chargeHistoryTypesAllowNegativeNumber.value.includes(data.type ?? 0)) {
          newValue = String(newValue).replace(/-/g, '')
          if (newValue && newValue[newValue.length - 1] !== '.') {
            data.charge_fee = roundUp(Number(newValue)).toString()
          } else {
            data.charge_fee = Number(newValue?.slice(0, -1)).toString()
          }
        } else {
          const pattern = /\D(?<!-)/g
          if (String(newValue).charAt(0) !== '-') {
            data.charge_fee = isValidNegativeAndPlusNumber(newValue)
              ? roundUp(+newValue ?? 0).toString()
              : roundUp(Number(String(newValue).replace(pattern, '') ?? 0)).toString()
            data.charge_fee = data.charge_fee == 0 ? '' : data.charge_fee
          } else {
            if (String(newValue).length >= 2) {
              data.charge_fee = isValidNegativeAndPlusNumber(newValue)
                ? roundUp(+newValue ?? 0).toString()
                : roundUp(Number(String(newValue).replace(pattern, '') ?? 0)).toString()
            }
          }
        }

        checkValidateComission()
      })
    },
  )

  watch(isDisabledTypeClientAggregationField, (newValue) => {
    if (newValue) {
      data.type_client_aggregation = 0
    }
  })

  watch(isDisabledChargeFeeField, (newValue) => {
    if (newValue) {
      data.charge_fee = 0
    }
  })

  watch(isDisabledMemoField, (newValue) => {
    if (newValue) {
      data.memo = ''
    }
  })

  watch(isDisabledAdminNoteField, (newValue) => {
    if (newValue) {
      data.memo_internal = ''
    }
  })

  watch(
    () => data.payment_amount,
    (newValue, oldValue) => {
      if (Number(oldValue) !== 0) {
        recalcChargeFee()
      }
    },
  )

  watch(
    () => data.type,
    (newValue, oldValue) => {
      allowNegativeNumber.value = chargeHistoryTypesAllowNegativeNumber.value.includes(newValue ?? 0)
      if (allowNegativeNumber.value) {
        data.payment_amount = data.payment_amount != 0 ? data.payment_amount : ''
        data.charge_fee = data.charge_fee != 0 ? data.charge_fee : ''
      } else {
        data.payment_amount = Math.sign(+data.payment_amount ?? 0) === 1 ? data.payment_amount : ''
        data.charge_fee = Math.sign(+data.charge_fee ?? 0) === 1 ? data.charge_fee : ''
      }
      nextTick(() => {
        if (oldValue !== undefined) {
          recalcChargeFee()
        }
        if (
          data.type &&
          chargeHistoryTypesDisableClientAggregationType.includes(data.type) &&
          isDisabledTypeClientAggregationField.value
        ) {
          data.account_number = listAccountNumber.value.find(
            (item: any) => item.service_type === DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL,
          )?.account_number
        }
      })
    },
  )

  watch(
    () => data.type_client_aggregation,
    (newValue, oldValue) => {
      if (data.type_client_aggregation === undefined) {
        data.memo = ''
        data.memo_internal = ''
        data.account_number = ''
        data.payment_amount = ''
        data.charge_fee = 0
      }
      nextTick(() => {
        if (data.type_client_aggregation === DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT) {
          data.account_number = listAccountNumber.value.find(
            (item: any) => item.service_type === DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT,
          )?.account_number
        }
        if (Number(newValue) > Number(oldValue)) {
          data.account_number = ''
          data.payment_amount = ''
          data.memo_internal = ''
          data.charge_fee = 0
          data.memo = ''
        }

        if (Number(newValue) < Number(oldValue)) {
          data.memo = ''
          data.charge_fee = 0
          data.memo_internal = ''
          data.payment_amount = ''
        }
      })
    },
  )

  defineExpose({
    openModal,
  })
</script>

<style scoped lang="scss">
  :deep(.cus-input) {
    .va-input-wrapper__field {
      width: 174px;
    }
  }
  :deep(.va-radio__text) {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #788b9a;
  }
  :deep(.va-checkbox__label) {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #788b9a;
  }
  :deep(.va-checkbox__square) {
    border: 1px solid #788b9a;
    scale: 0.8;
  }
  :deep(.va-radio__icon) {
    border: 1px solid #788b9a;
    scale: 0.7;
  }

  :deep(.charge-history-types) {
    display: flex;
    flex-wrap: wrap;

    > * {
      margin-right: 0;
      width: calc(100% / 3);

      .va-radio__text {
        white-space: nowrap;
      }
    }
  }

  .va-radio {
    margin-top: 0.5rem;
  }

  .modal-title {
    font-weight: 700;
  }

  :deep(.va-input__content__input::placeholder) {
    color: black;
  }
</style>
