<template>
  <va-modal v-model="open" no-outside-dismiss hide-default-actions no-esc-dismiss>
    <div style="width: 360px">
      <div class="c-mt-5">{{ t('edit') }}</div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_usage_fee.date') }}</p>
        <SelectDatePicker v-model="data.date" :is-input="true" placeholder="yyyy/mm/dd" />
        <p v-for="error of v$.date.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_usage_fee.number_2') }}</p>
        <va-input v-model="data.number" placeholder="1235028315345"></va-input>
        <p v-for="error of v$.number.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_usage_fee.note') }}</p>
        <va-input v-model="data.note" :placeholder="`${t('placeholder_please_enter')}`" type="textarea"></va-input>
        <p v-for="error of v$.note.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="d-flex gap-4 d-flex-end c-mt-22 c-mb-7">
        <va-button class="button-cancel" @click="closeModal">{{ t('modal.cancel') }}</va-button>
        <va-button type="submit" class="button-create" @click="submit">{{ t('modal.keep') }}</va-button>
      </div>
    </div>
  </va-modal>
  <ModalNotification ref="modalNotification" :message="t('account_usage_fee.duplicate_number')" />
</template>

<script setup lang="ts">
  import {
    ref,
    defineEmits,
    defineExpose,
    defineAsyncComponent,
    reactive,
    defineProps,
    computed,
    watch,
    nextTick,
  } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { InvoiceContractor } from '../../types/Invoice'
  import InvoiceService from '../../services/InvoiceService'
  import { helpers, maxLength, required } from '@vuelidate/validators'
  import useValidate from '@vuelidate/core'
  import { INVOICE_NOTE_MAX_LENGTH, INVOICE_NUMBER_MAX_LENGTH } from '../../common/constants'
  import ModalNotification from '../modal/ModalNotification.vue'

  const modalNotification = ref<InstanceType<typeof ModalNotification>>()
  const props = defineProps<{
    invoiceContractor: any
  }>()

  const SelectDatePicker = defineAsyncComponent(() => import('../../components/select-date-picker/index.vue'))

  const { t } = useI18n()
  const open = ref<boolean>(false)
  const emit = defineEmits<{
    (e: 'submit', data: object): void
  }>()
  const data = reactive({
    date: new Date(),
    number: '',
    note: '',
    invoice_prefix: '',
  })
  const contractor = ref<number>(0)
  const rules = computed(() => {
    const Message = (i18nOptions: any, message: string) => t(`${message}`, i18nOptions)

    return {
      date: {
        required: helpers.withMessage(
          () => Message({ field: t('account_usage_fee.date') }, 'message_validate.required_input'),
          required,
        ),
      },
      note: {
        maxLength: helpers.withMessage(() => Message({ max: '255' }, 'message_validate.max'), maxLength(255)),
      },
      number: {
        required: helpers.withMessage(
          () => Message({ field: t('account_usage_fee.number_2') }, 'message_validate.required_input'),
          required,
        ),
        // custom: helpers.withMessage(() => Message({ field: t('account_usage_fee.number_2') }, 'message_validate.required_input'), (value: string) => {
        //     const pattern = /^\d{1,}-\d{1,}$/
        //     return pattern.test(value)
        //   },
        // ),
      },
    }
  })
  var v$ = useValidate(rules, data)

  const openModal = (invoiceContractor?: InvoiceContractor, contractors?: any) => {
    open.value = true
    v$.value.$reset()
    contractor.value = contractors

    if (invoiceContractor && Object.keys(invoiceContractor).length > 0) {
      data.note = invoiceContractor.note || ''
      data.invoice_prefix = invoiceContractor.invoice_prefix || ''
      data.date = invoiceContractor.invoice_date ? new Date(invoiceContractor.invoice_date) : new Date()
      data.number = invoiceContractor.number || ''
    }
  }

  const closeModal = () => {
    open.value = false
    data.date = new Date()
    data.number = ''
    data.note = ''
    data.invoice_prefix = ''
  }

  const checkInvoiceNumber = () => {
    try {
      return InvoiceService.checkInvoiceContractorNumber(contractor.value, data.number)
    } catch (e) {
      console.log(e)
    }
  }

  const submit = async () => {
    v$.value.$validate()
    if (v$.value.$error) return

    if (props.invoiceContractor.id) {
      const response = await checkInvoiceNumber()
      if (response?.data.data.length > 0) {
        modalNotification.value?.openModal()
      } else {
        open.value = false
        emit('submit', { ...data })
      }
    } else {
      emit('submit', { ...data })
      open.value = false
    }
  }

  watch(
    () => data.number,
    () => {
      nextTick(() => {
        data.number = String(data.number).slice(0, INVOICE_NUMBER_MAX_LENGTH)
      })
    },
  )

  watch(
    () => data.note,
    () => {
      nextTick(() => {
        data.note = data.note.slice(0, INVOICE_NOTE_MAX_LENGTH)
      })
    },
  )

  defineExpose({
    openModal,
  })
</script>

<style scoped lang="scss">
  :deep(.va-input-wrapper__text) {
    textarea {
      min-height: 66px;
    }
  }
</style>
