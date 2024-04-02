<template>
  <va-card class="flex">
    <va-card-content class="c-pb-50">
      <div class="title c-mb-36">{{ t('bank.bank_add_title') }}</div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('bank.bank_name') }}<span class="mark-required"> *</span></div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.bank_name"/>
            <div v-for="error of v$.bank_name.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </div>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('bank.client_withdrawal_fee_1') }}<span class="mark-required"> *</span></div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.client_withdrawal_fee_2"/>
            <div v-for="error of v$.client_withdrawal_fee_2.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </div>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('bank.client_withdrawal_fee_2') }}<span class="mark-required"> *</span></div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.client_withdrawal_fee_1" />
            <div v-for="error of v$.client_withdrawal_fee_1.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </div>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('bank.contract_withdrawal_fee_1') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.contract_withdrawal_fee_2"/>
            <div v-for="error of v$.contract_withdrawal_fee_2.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </div>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('bank.contract_withdrawal_fee_2') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.contract_withdrawal_fee_1"/>
            <div v-for="error of v$.contract_withdrawal_fee_1.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </div>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('bank.bank_list_name') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input
            v-model="data.input_bank_list_name"
            class="mb-6"
            v-on:keyup.enter="handlerKeyupEnter"
            />
            <div v-for="error of validate$.input_bank_list_name.$errors" :key="error.$uid">
              <p class="error-msg" style="color: red">{{ error.$message }}</p>
            </div>
            <div class="c-mt-2">
              <va-chip
              v-for="(data, index) of arrayBankListName"
              :key="index"
              @click="handlerCloseChip(index)"
              class="c-mb-2"
              >
              {{data}}
              <va-icon name="cancel"/>
              </va-chip>
            </div>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('bank.bank_code') }}<span class="mark-required"> *</span></div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.bank_code"/>
            <div v-for="error of v$.bank_code.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </div>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('bank.difference_fee') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.difference_fee"/>
            <div v-for="error of v$.difference_fee.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </div>
          </div>
      </div>
      <div class="hr-line c-mt-40"></div>
      <div class="d-flex gap-4 d-flex-end c-mt-25">
        <va-button class="button-cancel" @click="onBackClick">{{ t('back') }}</va-button>
        <va-button class="button-create" @click="onAddClick">{{ t('save') }}</va-button>
      </div>
    </va-card-content>
  </va-card>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import useValidate from '@vuelidate/core'
  import { required, helpers, numeric, integer, minLength, maxLength, decimal } from '@vuelidate/validators'
  import { ref, computed, reactive, toRefs, watch, nextTick } from 'vue'
  // import Bank from '@/types/Bank';
  import type { Ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { CommonService } from '../../../services/CommonService'
  import { convertCurrency, isCurrency, isTypingNumber } from '../../../common/utils'
  import { SCREEN_COMMON } from '../../../router/router'

  const { t } = useI18n()
  const service = new CommonService()
  const router = useRouter()
  const { init, close, closeAll } = useToast()
  const GlobalStore = useGlobalStore()
  const arrayBankListName = ref([])

  var data = reactive({
    bank_name: '',
    client_withdrawal_fee_1: '',
    client_withdrawal_fee_2: '',
    contract_withdrawal_fee_1: '',
    contract_withdrawal_fee_2: '',
    bank_list_name: '',
    user_edit_id: GlobalStore.userId,
    input_bank_list_name: '',
    bank_code: '',
    difference_fee: '' as any,
  })

  watch(() => data.input_bank_list_name, (currentValue: any) => {
    if(data.input_bank_list_name){
      validate$.value.$validate()
    }
  })

  watch(() => data.client_withdrawal_fee_1, (currentValue, oldValue) => {
    if(isCurrency(currentValue)) {
      data.client_withdrawal_fee_1 = convertCurrency(currentValue)
    }
  })

  watch(() => data.client_withdrawal_fee_2, (currentValue, oldValue) => {
    if(isCurrency(currentValue)) {
      data.client_withdrawal_fee_2 = convertCurrency(currentValue)
    }
  })

  watch(() => data.contract_withdrawal_fee_1, (currentValue, oldValue) => {
    if(isCurrency(currentValue)) {
      data.contract_withdrawal_fee_1 = convertCurrency(currentValue)
    }
  })

  watch(() => data.contract_withdrawal_fee_2, (currentValue, oldValue) => {
    if(isCurrency(currentValue)) {
      data.contract_withdrawal_fee_2 = convertCurrency(currentValue)
    }
  })

  watch(() => data.difference_fee, (currentValue, oldValue) => {
    if(isCurrency(currentValue)) {
      data.difference_fee = convertCurrency(currentValue)
    }
  })

  const handlerKeyupEnter = () => {
    if(validate$.value.$error) return
    arrayBankListName.value.push(data.input_bank_list_name)
    data.input_bank_list_name = ''
  }

  const handlerCloseChip = (value: any) => {
    arrayBankListName.value.splice(value, 1)
  }

  const validateBankListName = computed(() => {
    const Message = (i18nOptions: any, message: string) =>  t(`${message}`, i18nOptions)
    return {
      input_bank_list_name: {
        custom: helpers.withMessage(() => Message(null, 'message_validate.bank_list_name'),
          (value: string) => {
            const convertValueToString = JSON.parse(JSON.stringify(arrayBankListName.value))
            if(!convertValueToString.includes(data.input_bank_list_name) || !data.input_bank_list_name) {
              return true
            } else {
              return false
            }
          },
        ),
      }
    }
  })

  const rules = computed(() => {
    const Message = (i18nOptions: any, message: string) =>  t(`${message}`, i18nOptions)
    return {
      bank_name: {
        required: helpers.withMessage(() => Message({field: t('bank.bank_name')}, 'message_validate.required'), required),
      },
      bank_code: {
        required: helpers.withMessage(() => Message({field: t('bank.bank_code')}, 'message_validate.required'), required),
        numeric: helpers.withMessage(() => Message({ field: t('bank.bank_code') }, 'message_validate.numeric'),
          numeric,
        ),
      },
      client_withdrawal_fee_1: {
        required: helpers.withMessage(() => Message({field: t('bank.client_withdrawal_fee_1')}, 'message_validate.required'), required),
        custom: helpers.withMessage(() => Message({field: t('bank.client_withdrawal_fee_1')}, 'message_validate.numeric'), (value: any) => {
            const newValue = value.replaceAll(',','')
            if(isTypingNumber(newValue) || newValue.length === 0) {
              return true
            } else {
              return false
            }
          }
        ),
        maxLength: helpers.withMessage(() => Message({max: '3'}, 'message_validate.max'), maxLength(3),),
      },
      client_withdrawal_fee_2: {
        required: helpers.withMessage(() => Message({field: t('bank.client_withdrawal_fee_2')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({max: '3'}, 'message_validate.max'), maxLength(3),),
        custom: helpers.withMessage(() => Message({field: t('bank.client_withdrawal_fee_2')}, 'message_validate.numeric'), (value: any) => {
            const newValue = value.replaceAll(',','')
            if(isTypingNumber(newValue) || newValue.length === 0) {
              return true
            } else {
              return false
            }
          }
        ),
      },
      contract_withdrawal_fee_1: {
        // required: helpers.withMessage(() => Message({field: t('bank.contract_withdrawal_fee_1')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({max: '3'}, 'message_validate.max'), maxLength(3),),
        custom: helpers.withMessage(() => Message({field: t('bank.contract_withdrawal_fee_1')}, 'message_validate.numeric'), (value: any) => {
            const newValue = value.replaceAll(',','')
              if(isTypingNumber(newValue) || newValue.length === 0) {
                return true
              } else {
                return false
              }
          }
        ),
      },
      contract_withdrawal_fee_2: {
        // required: helpers.withMessage(() => Message({field: t('bank.contract_withdrawal_fee_2')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({max: '3'}, 'message_validate.max'), maxLength(3),),
        custom: helpers.withMessage(() => Message({field: t('bank.contract_withdrawal_fee_2')}, 'message_validate.numeric'), (value: any) => {
            const newValue = value.replaceAll(',','')
            if(isTypingNumber(newValue) || newValue.length === 0) {
              return true
            } else {
              return false
            }
          }
        ),
      },
      difference_fee: {
        maxLength: helpers.withMessage(() => Message({max: '5'}, 'message_validate.max'), maxLength(6),),
        custom: helpers.withMessage(() => Message({field: t('bank.difference_fee')}, 'message_validate.numeric'), (value: any) => {
            const newValue = value.replaceAll(',','')
            if(isTypingNumber(newValue) || newValue.length === 0) {
              return true
            } else {
              return false
            }
          }
        ),
      },
    }
  })

  const v$ = useValidate(rules, data)
  const validate$ = useValidate(validateBankListName, data)

  const onAddClick = async () => {
    GlobalStore.setLoading(true)
    const validate = v$.value.$validate()
    if (v$.value.$error) {
      GlobalStore.setLoading(false)
      return
    }
    if(arrayBankListName) {
      data.bank_list_name = arrayBankListName.value.toString()
    }
    const params = {...data}
    params.difference_fee = data.difference_fee
      ? Number(data.difference_fee.replaceAll(',',''))
      : 0
    params.client_withdrawal_fee_1 = Number(data.client_withdrawal_fee_1.replaceAll(',',''))
    params.client_withdrawal_fee_2 = Number(data.client_withdrawal_fee_2.replaceAll(',',''))
    params.contract_withdrawal_fee_1 = Number(data.contract_withdrawal_fee_1.replaceAll(',',''))
    params.contract_withdrawal_fee_2 = Number(data.contract_withdrawal_fee_2.replaceAll(',',''))
    const result = await service.create(`/banks`, params)
    if (result.status) {
      GlobalStore.setLoading(false)
      router.push(SCREEN_COMMON.BANK.LIST)
      GlobalStore.$state.isCreated = true
      return
    }
    GlobalStore.setLoading(false)
    init({ message: result.message, color: 'danger' })
  }
  const onBackClick = () => {
    router.push(SCREEN_COMMON.BANK.LIST)
  }
</script>

<style lang="scss" scoped>
  .form-label {
    padding-top: 5px;
  }
</style>
