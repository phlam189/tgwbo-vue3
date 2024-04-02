<template>
  <va-modal v-model="open" no-outside-dismiss hide-default-actions no-esc-dismiss>
    <div :style="`width: 360px; ${v$.errors?.length > 0 ? 'height: 600px' : ''}`">
      <div>{{ !edit ? t('add_new') : t('edit') }} ({{ t('account_balance.balance_entry_history') }})</div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.date') }}</p>
        <SelectDatePicker v-model="data.date_history" class="w-full" placeholder="yyyy/mm/dd" :is-input="true" />
        <p v-for="error of v$.date_history.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.client_name') }}</p>
        <va-select
          v-model="data.client_id"
          :placeholder="t('placeholder.select')"
          :no-options-text="`${t('list_no_data')}`"
          bordered
          clearable
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
<!--          :value-by="(option: any) => option.id"-->
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
<!--          :value-by="(option: any) => option.id"-->
<!--        />-->
        <va-input v-model="data.branch_name" disabled></va-input>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.account_number') }}</p>
        <va-select
          v-model="data.account_number"
          :disabled="!data.client_id || selectListAccountNumber.options.length === 0"
          :placeholder="t('placeholder.select')"
          :no-options-text="`${t('list_no_data')}`"
          bordered
          clearable
          :options="selectListAccountNumber.options"
          :value-by="(option: any) => option.text"
        />
        <p v-for="error of v$.account_number.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="c-mt-10">
        <p class="lable-input">{{ t('account_balance.amount_of_money') }}</p>
        <va-input v-model="data.balance" mask="numeral">
          <template #prependInner>
            <span style="color: #788b9a">¥</span>
          </template>
        </va-input>
        <p v-for="error of v$.balance.$errors" :key="error.$uid">
          <span class="error-msg" style="color: red">{{ error.$message }}</span>
        </p>
      </div>
      <div class="d-flex gap-4 d-flex-end c-mt-25">
        <va-button class="button-cancel" @click="closeModal">{{ t('modal.cancel') }}</va-button>
        <va-button class="button-create" @click="submit">{{ !edit ? t('modal.create') : t('edit') }}</va-button>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watchEffect, watch, nextTick } from 'vue'
  import { reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { AccountBalanceDTO } from '../../types/AccountBalanceDTO'
  import ClientService from '../../services/ClientService'
  import accountNumberAndBranchAndBank from '../../services/AccountNumberService'
  import { helpers, required } from '@vuelidate/validators'
  import useValidate from '@vuelidate/core'
  import { BALANCE_BALANCE_ENTRY_HISTORY } from '../../common/constants'
  import SelectDatePicker from '../../components/select-date-picker/index.vue'
  import { formatCurrency } from '../../common/utils'

  const { t } = useI18n()
  const open = ref<boolean>(false)
  const edit = ref<boolean>(false)
  const emit = defineEmits<{
    (e: 'submit', data: object): void
  }>()

  const selectListClient = reactive({
    value: [],
    options: [] as Record<string, string | number>[],
  })

  const data = ref<AccountBalanceDTO>({
    date_history: null,
    represent_name: null,
    bank_name: null,
    branch_name: null,
    account_number: '',
    balance: '',
    client_id: null as any,
    account_holder: null,
    representative_account: null,
  })
  // const selectListBankName = reactive({
  //   value: [],
  //   options: [] as Record<string, string | number>[],
  // })
  // const selectListBranch = reactive({
  //   value: [],
  //   options: [] as Record<string, string | number>[],
  // })
  const selectListAccountNumber = reactive({
    value: [],
    options: [],
  })
  const rules = computed(() => {
    const Message = (i18nOptions: any, message: string) => t(`${message}`, i18nOptions)
    return {
      date_history: {
        required: helpers.withMessage(() => Message({ field: t("account_balance.date") }, "message_validate.required_input"), required)
      },
      client_id: {
        required: helpers.withMessage(() => Message({ field: t("account_balance.client_name") }, "message_validate.required_select_client"), required)
      },
      account_number: {
        required: helpers.withMessage(() => Message({ field: t("account_balance.account_number") }, "message_validate.required_input"), required)
      },
      balance: {
        required: helpers.withMessage(() => Message({ field: t("account_balance.amount_of_money") }, "message_validate.required_input"), required)
      },
    }
  })
  var v$ = useValidate(rules, data)

  const openModal = (value?: object) => {
    open.value = !open.value
    data.value = {
      date_history: null,
      represent_name: null,
      bank_name: null,
      branch_name: null,
      account_number: '',
      balance: '',
      client_id: null as any,
      account_holder: null,
      representative_account: null,
    }
    if (value) {
      data.value = {
        ...data.value,
        ...value,
      }
      data.value.balance = formatCurrency
        .func(data.value.balance)
        ?.replace(/[,.¥]/g, '')
        .replace(/[.-]/g, '')
        .slice(0, BALANCE_BALANCE_ENTRY_HISTORY)
      edit.value = true
      getAccountNumberByClient()
    }
  }

  const getCLientList = async () => {
    try {
      const { data } = await ClientService.getListClient()
      const listClient: Record<string, string | number>[] = []
      data.data.forEach((value: { client_id: number; represent_name: string }) => {
        listClient.push({ text: value.represent_name, id: value.client_id })
      })
      selectListClient.options = listClient
    } catch (error) {
      console.log(error)
    }
  }

  const closeModal = () => {
    open.value = !open.value
    edit.value = false
  }

  const submit = async () => {
    v$.value.$validate()
    if (v$.value.$error) return

    emit('submit', {
      data: data,
      edit: edit.value,
    })
    closeModal()
  }

  watchEffect(() => {
    if (data.value.client_id) {
      if (!edit.value) {
        data.value.bank_name = ''
        data.value.branch_name = ''
        data.value.account_number = ''
      }
      getAccountNumberByClient()
    }
  })

  const getAccountNumberByClient = async () => {
    try {
      const response = await accountNumberAndBranchAndBank.getAccountNumberByClientId(data.value.client_id)

      // selectListBankName.options = response.data.map((item: AccountNumber) => ({
      //   text: item.bank_name,
      //   id: item.id,
      // })) as Record<string, string | number>[]
      //
      // selectListBranch.options = response.data.map((item: AccountNumber) => ({
      //   text: item.branch_name,
      //   id: item.id,
      // })) as Record<string, string | number>[]

      const options = response.data.map((item) => ({
        text: item.account_number,
        id: item.id,
        bank_name: item.bank_name,
        branch_name: item.branch_name,
      }))

      const selectedOption = options.find((item) => item.text === data.value.account_number)
      if (selectedOption) {
        data.value.bank_name = selectedOption.bank_name
        data.value.branch_name = selectedOption.branch_name
      }
      selectListAccountNumber.options = options
    } catch (e) {
      console.log(e)
    }
  }

  const resetValidateForm = () => {
    v$.value.$reset()
  }

  watch(
    () => data.value.balance,
    () => {
      nextTick(() => {
        data.value.balance = data.value.balance.replace(/[.-]/g, '').slice(0, BALANCE_BALANCE_ENTRY_HISTORY)
      })
    },
  )

  watch(
    () => data.value.account_number,
    (accountNumber) => {
      data.value.bank_name = ''
      data.value.branch_name = ''

      if (accountNumber) {
        selectListAccountNumber.options.forEach((item) => {
          if (item.text === accountNumber) {
            data.value.bank_name = item.bank_name
            data.value.branch_name = item.branch_name
          }
        })
      }
    },
  )

  onMounted(() => {
    getCLientList()
  })

  defineExpose({
    openModal,
    resetValidateForm,
  })
</script>

<style scoped></style>
