<template>
  <va-modal v-model="open" no-outside-dismiss hide-default-actions no-esc-dismiss>
    <div style="width: 360px">
      <div>{{ !edit ? t('add_new') : t('edit') }} ({{ t('account_balance.loan_history') }})</div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.date') }}</p>
        <SelectDatePicker v-model="data.create_date" class="w-full" placeholder="yyyy/mm/dd" :is-input="true" />
        <p v-for="error of v$.create_date.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.kinds') }}</p>
        <va-select
          v-model="data.kinds"
          :placeholder="t('placeholder.select')"
          :no-options-text="`${t('list_no_data')}`"
          bordered
          clearable
          :options="selectKinds.options"
          :value-by="(option: any) => option.id"
        />
        <p v-for="error of v$.kinds.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.client_name') }}</p>
        <va-select
          v-model="data.client_id"
          :no-options-text="`${t('list_no_data')}}`"
          bordered
          clearable
          :placeholder="t('placeholder.select')"
          :options="selectListClient.options"
          :value-by="(option: any) => option.id"
        />
        <p v-for="error of v$.client_id.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.bank_name') }}</p>
        <!--        <va-select-->
        <!--          v-model="data.bank_name"-->
        <!--          :disabled="!data.client_id || selectListBankName.options.length === 0"-->
        <!--          :placeholder="t('placeholder.select')"-->
        <!--          :no-options-text="`${t('list_no_data')}`"-->
        <!--          bordered-->
        <!--          clearable-->
        <!--          :options="selectListBankName.options"-->
        <!--          :value-by="(option: any) => option.text"-->
        <!--        />-->
        <va-input v-model="data.bank_name" disabled></va-input>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.branch_name') }}</p>
        <!--        <va-select-->
        <!--          v-model="data.branch_name"-->
        <!--          :disabled="!data.client_id || selectListBranch.options.length === 0"-->
        <!--          :placeholder="t('placeholder.select')"-->
        <!--          :no-options-text="`${t('list_no_data')}`"-->
        <!--          bordered-->
        <!--          clearable-->
        <!--          :options="selectListBranch.options"-->
        <!--          :value-by="(option: any) => option.text"-->
        <!--        />-->
        <va-input v-model="data.branch_name" disabled></va-input>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.account_number') }}</p>
        <va-select
          v-model="data.account_number"
          :disabled="!data.client_id || selectListAccountNumber.length === 0 || checkIncludeData"
          :placeholder="t('placeholder.select')"
          :no-options-text="`${t('list_no_data')}`"
          bordered
          clearable
          :options="dataSelectAccountNumber"
          :value-by="(option: any) => option.text"
        />
        <p v-for="error of v$.account_number.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.amount_of_money') }}</p>
        <va-input
          id="payment-amount"
          v-model="data.payment_amount"
          mask="numeral"
          @change="onChangeFormatPaymentAmount"
        >
          <template #prependInner>
            <span style="color: #788b9a">¥</span>
          </template>
        </va-input>
        <p v-for="error of v$.payment_amount.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.memo') }}</p>
        <va-input v-model="data.memo" :placeholder="`${t('placeholder_input_text')}`"> </va-input>
      </div>
      <div class="d-flex gap-4 d-flex-end c-mt-25">
        <va-button class="button-cancel" @click="closeModal">{{ t('modal.cancel') }}</va-button>
        <va-button class="button-create" @click="submit">{{ !edit ? t('modal.create') : t('edit') }}</va-button>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { computed, defineExpose, defineProps, onMounted, ref, watch } from 'vue'
  import { reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { CommonService } from '../../services/CommonService'
  import accountNumberAndBranchAndBank from '../../services/AccountNumberService'
  import useValidate from '@vuelidate/core'
  import { helpers, required } from '@vuelidate/validators'
  import {
    CHARGE_HISTORY_PAYMENT_AMOUNT_MAX_LENGTH,
    DEPOSIT_AND_WITHDRAWAL_CODE,
    KINDS_TYPE,
  } from '../../common/constants'
  import SelectDatePicker from '../../components/select-date-picker/index.vue'
  import { formatCurrency } from '../../common/utils'

  const props = defineProps<{
    kinds: Array<any>
  }>()

  const { t } = useI18n()
  const open = ref<boolean>(false)
  const edit = ref<boolean>(false)
  const emit = defineEmits<{
    (e: 'submit', data: object): void
  }>()

  const data = ref({
    create_date: null,
    kinds: '',
    client_name: null,
    bank_name: null,
    branch_name: null,
    account_number: null,
    payment_amount: '',
    memo: '',
    client_id: null as any,
  })
  const service = new CommonService()
  const selectKinds = reactive({
    value: [],
    options: [] as Record<string, string | number>[],
  })
  const selectListClient = reactive({
    value: [],
    options: [] as Record<string, string | number>[],
  })
  // const selectListBankName = reactive({
  //   value: [],
  //   options: [] as Record<string, string | number>[],
  // })
  // const selectListBranch = reactive({
  //   value: [],
  //   options: [] as Record<string, string | number>[],
  // })
  const selectListAccountNumber = ref([] as any[])

  const selectListAccountNumberDeposit = reactive({
    value: [] as any[],
    options: [] as any[],
  })

  const selectListAccountNumberWihthdrawal = reactive({
    value: [] as any[],
    options: [] as any[],
  })

  const rules = computed(() => {
    const Message = (i18nOptions: any, message: string) => t(`${message}`, i18nOptions)
    return {
      client_id: {
        required: helpers.withMessage(
          () => Message({ field: t('account_balance.client_name') }, 'message_validate.required_select_client'),
          required,
        ),
      },
      create_date: {
        required: helpers.withMessage(
          () => Message({ field: t('account_balance.date') }, 'message_validate.required_input'),
          required,
        ),
      },
      account_number: {
        required: helpers.withMessage(
          () => Message({ field: t('account_balance.account_number') }, 'message_validate.required_input'),
          required,
        ),
      },
      payment_amount: {
        required: helpers.withMessage(
          () => Message({ field: t('account_balance.amount_of_money') }, 'message_validate.required_input'),
          required,
        ),
      },
      kinds: {
        required: helpers.withMessage(
          () => Message({ field: t('account_balance.kinds') }, 'message_validate.required_input'),
          required,
        ),
      },
    }
  })
  var v$ = useValidate(rules, data)

  const openModal = async (value?: any) => {
    open.value = !open.value
    data.value = {
      create_date: null,
      kinds: '',
      client_name: null,
      bank_name: null,
      branch_name: null,
      account_number: null,
      payment_amount: '',
      memo: '',
      client_id: null as any,
    }
    if (value) {
      await getAccountNumberByClient(value.client_id)

      data.value = {
        ...data.value,
        ...value,
      }

      data.value.create_date = data.value.create_date ? (new Date(data.value.create_date) as any) : null
      data.value.kinds = data.value.kinds
        ? (selectKinds.options.find((kind) => kind.text === data.value.kinds) as any).id
        : ''
      data.value.payment_amount = formatCurrency.func(data.value.payment_amount)?.replace('¥', '')
      edit.value = true

      document.getElementById('payment-amount').addEventListener('input', onInputFormatPaymentAmount)
    }
  }

  const checkIncludeData = computed(() => {
    return [KINDS_TYPE.BORROWING_DEPOSIT_ACCOUNT, KINDS_TYPE.REPAYMENT_DEPOSIT_ACCOUNT].includes(data.value?.kinds)
  })

  const dataSelectAccountNumber = computed(() => {
    if (!data.value.kinds) {
      return selectListAccountNumber.value
    } else {
      return checkIncludeData.value
        ? selectListAccountNumberDeposit.options
        : selectListAccountNumberWihthdrawal.options
    }
  })

  const closeModal = () => {
    open.value = !open.value
    edit.value = false
    document.getElementById('payment-amount').removeEventListener('input', onInputFormatPaymentAmount)
  }

  const submit = () => {
    v$.value.$validate()
    if (v$.value.$error) return

    emit('submit', {
      data: data,
      edit: edit.value,
    })
    closeModal()
  }

  const getListClient = () => {
    service
      .getListClient()
      .then((response) => {
        selectListClient.options = response.data.map((item: any) => ({
          text: item.represent_name,
          id: item.client_id,
        })) as Record<string, string | number>[]
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const getAccountNumberByClient = async (id: number) => {
    selectListAccountNumber.value = []
    selectListAccountNumberDeposit.options = []
    selectListAccountNumberWihthdrawal.options = []
    try {
      const response = await accountNumberAndBranchAndBank.getAccountNumberByClientId(id)

      // selectListBankName.options = response.data.map((item: AccountNumber) => ({
      //   text: item.bank_name,
      //   id: item.id,
      // })) as Record<string, string | number>[]
      //
      // selectListBranch.options = response.data.map((item: AccountNumber) => ({
      //   text: item.branch_name,
      //   id: item.id,
      // })) as Record<string, string | number>[]

      data.value.branch_name = null
      data.value.bank_name = null

      const options = response.data.map((item: any) => ({
        text: item.account_number,
        id: item.id,
        bank_name: item.bank_name,
        branch_name: item.branch_name,
        service_type: item.service_type,
      }))

      const selectedOption = options.find((item: any) => item.text === data.value.account_number)
      if (selectedOption) {
        data.value.bank_name = selectedOption.bank_name
        data.value.branch_name = selectedOption.branch_name
      } else {
        data.value.account_number = null
      }
      selectListAccountNumber.value = options

      selectListAccountNumberDeposit.options = options.filter(
        (item: any) => item.service_type == DEPOSIT_AND_WITHDRAWAL_CODE.DEPOSIT,
      )
      selectListAccountNumberWihthdrawal.options = options.filter(
        (item: any) => item.service_type == DEPOSIT_AND_WITHDRAWAL_CODE.WITHDRAWAL,
      )
    } catch (e) {
      console.log(e)
    }
  }

  const resetValidateForm = () => {
    v$.value.$reset()
  }

  watch(
    () => data.value.client_id,
    async (value) => {
      await getAccountNumberByClient(value)
      if (checkIncludeData.value) {
        data.value.account_number = selectListAccountNumberDeposit.options[0]?.text
      }
    },
  )

  watch(
    () => data.value.account_number,
    (accountNumber) => {
      if (!data.value.kinds) {
        data.value.account_number = null
      }
      data.value.bank_name = null
      data.value.branch_name = null

      if (accountNumber !== undefined) {
        selectListAccountNumber.value.forEach((item) => {
          if (item.text === accountNumber) {
            data.value.bank_name = item.bank_name
            data.value.branch_name = item.branch_name
          }
        })
      }
    },
  )

  watch(
    () => data.value.kinds,
    () => {
      if (!data.value.kinds) {
        data.value.account_number = null
      }
      if (checkIncludeData.value) {
        data.value.account_number = selectListAccountNumberDeposit.options[0]?.text
      }
    },
  )

  watch(
    () => checkIncludeData.value,
    (oldVal, newVal) => {
      if (!oldVal && newVal) {
        data.value.account_number = null
      }
    },
  )

  const onChangeFormatPaymentAmount = () => {
    data.value.payment_amount = formatCurrency.func(data.value.payment_amount).replace('¥', '')
  }

  const onInputFormatPaymentAmount = () => {
    data.value.payment_amount = data.value.payment_amount
      .replace(/[.-]/g, '')
      .slice(0, CHARGE_HISTORY_PAYMENT_AMOUNT_MAX_LENGTH)
  }

  onMounted(() => {
    getListClient()
    Object.values(props.kinds).forEach((item) => {
      selectKinds.options.push(item)
    })
  })

  defineExpose({
    openModal,
    resetValidateForm,
  })
</script>

<style scoped></style>
