<template>
  <va-card class="flex">
    <va-card-content class="c-pb-50">
      <div class="title c-mb-36">{{ t('client.client_add_title') }}</div>
      <div class="d-flex flex gap-35">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.company_name') }}<span class="mark-required"> *</span></p>
          <va-input v-model="data.company_name"/>
          <p v-for="error of v$.company_name.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.represent_name') }}</p>
          <va-input v-model="data.represent_name" />
          <p v-for="error of v$.represent_name.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.email') }}</p>
          <va-input v-model="data.email"/>
          <p v-for="error of v$.email.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
          <div v-if="error">
            <span class="error-msg" style="color: red">{{ t("message_validate.email_exits") }}</span>
          </div>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.address') }}</p>
          <va-input v-model="data.address" />
          <p v-for="error of v$.address.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.presence') }}</p>
          <va-select
            v-model="data.presence"
            :placeholder="t('placeholder_input_select')"
            :options="selectPresense"
            clearable
            clearable-icon="cancel"
            :track-by="(selectPresense: any) => selectPresense.value"
          />
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.license_number') }}</p>
          <va-input v-model="data.license_number" />
          <p v-for="error of v$.license_number.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.total_year') }}</p>
          <va-select 
          v-model="data.total_year" 
          :placeholder="t('placeholder_input_select')" 
          :options="selectMonth"
          clearable
          clearable-icon="cancel"
          :value-by="(selectMonth: any) => selectMonth"
          />
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.contract_method') }}<span class="mark-required"> *</span></p>
          <va-select 
          v-model="data.contract_method" 
          :placeholder="t('placeholder_input_select')" 
          :options="selectContractMethod"
          clearable
          clearable-icon="cancel"
          :track-by="(selectContractMethod: any) => selectContractMethod.value"
          />
          <p v-for="error of v$.contract_method.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.contractor_id') }}<span class="mark-required"> *</span></p>
          <va-select 
          v-model="data.contractor_id" 
          :placeholder="t('placeholder_input_select')" 
          :options="selectContractor"
          clearable
          clearable-icon="cancel" 
          :value-by="(selectContractor: any) => selectContractor.value"
          />
          <p v-for="error of v$.contractor_id.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.service_name') }}<span class="mark-required"> *</span></p>
          <va-input v-model="data.service_name"/>
          <p v-for="error of v$.service_name.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.charge_fee_memo') }}</p>
          <va-input v-model="data.charge_fee_memo" />
          <p v-for="error of v$.charge_fee_memo.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.charge_fee_rate') }}<span class="mark-required"> *</span></p>
          <va-input v-model="data.charge_fee_rate" />
          <p v-for="error of v$.charge_fee_rate.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.settlement_fee_memo') }}</p>
          <va-input v-model="data.settlement_fee_memo" />
          <p v-for="error of v$.settlement_fee_memo.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client_detail.settlement_fee_rate') }}<span class="mark-required"> *</span></p>
          <va-input v-model="data.settlement_fee_rate" />
          <p v-for="error of v$.settlement_fee_rate.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.is_transfer_fee') }}<span class="mark-required"> *</span></p>
          <va-select 
          v-model="data.is_transfer_fee" 
          :placeholder="t('placeholder_input_select')" 
          :options="selectTransferFee"
          clearable
          clearable-icon="cancel"
          :track-by="(selectTransferFee: any) => selectTransferFee.value"
          />
          <p v-for="error of v$.is_transfer_fee.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.termination_date') }}</p>
          <SelectDatePicker 
          v-model="data.termination_date" 
          :is-input="true"
          :disabled-cus="'none'"
          />
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.client_id') }}<span class="mark-required"> *</span></p>
          <va-input v-model="data.client_id"/>
          <p v-for="error of v$.client_id.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
          <div v-if="isUniqueClient">
            <span class="error-msg" style="color: red">{{ t("message_validate.client_id_exist") }}</span>
          </div>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('client.sales_representative') }}</p>
          <va-input v-model="data.sales_representative"/>
          <p v-for="error of v$.sales_representative.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
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
  import { required, helpers, numeric, decimal, maxLength, email } from '@vuelidate/validators'
  import { ref, computed, reactive, toRefs, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { CommonService } from '../../../services/CommonService'
  import { PRESENSE_TYPE } from '../../../common/constants'
  import { validateRomaji, validateDecimal } from '../../../common/utils'
  import { CONTRACT_METHOD_TYPE, TRANSFER_FEE_TYPE, STRING_MAX_LENGTH, NUMBER_MAX_LENGTH } from '../../../common/constants'
  import ClientService from '../../../services/ClientService'
  import { SCREEN_COMMON } from '../../../router/router'
  import SelectDatePicker from '../../../components/select-date-picker/index.vue'

  const { t, locale } = useI18n()
  const service = new CommonService()
  const router = useRouter()
  const { init, close, closeAll } = useToast()
  const GlobalStore = useGlobalStore()
  const error = ref(false)
  const isUniqueClient = ref(false)

  const data = reactive({
    company_name: '',
    represent_name: '',
    email: '',
    address: '',
    presence: '' as any,
    license_number: '',
    total_year: '',
    contractor_id: '',
    service_name: '',
    contract_method: '' as any,
    client_id: '',
    charge_fee_rate: '',
    charge_fee_memo: '',
    settlement_fee_rate: '',
    settlement_fee_memo: '',
    is_transfer_fee: '' as any,
    termination_date: new Date(),
    sales_representative: '',
    user_edit_id: GlobalStore.userId,
  })

  const selectContractMethod = computed(() => {
    return [
      {
        text: t('client_detail.flat'),
        value: CONTRACT_METHOD_TYPE.FLAT
      },
      {
        text: t('client_detail.slide'),
        value: CONTRACT_METHOD_TYPE.SLIDE
      },
    ]
  })

  const selectContractor: any = ref()
  const selectPresense = computed(() => {
    return [
      {
        text: t('client.option_have'),
        value: PRESENSE_TYPE.HAVE,
      },
      {
        text: t('client.option_none'),
        value: PRESENSE_TYPE.NONE,
      },
    ]
  })
  const selectMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const selectTransferFee = computed(() => { 
    return [
      {
        text: t('client.can_be'),
        value: TRANSFER_FEE_TYPE.CAN_BE
      },
      {
        text: t('client.none'),
        value: TRANSFER_FEE_TYPE.NONE
      },
    ]
  })

  onMounted(() => {
    getListContractor()
  })

  watch(() => data.email, () => {
    if(data.email) {
      data.email = data.email.trim()
    }
  })

  watch(locale, () => {
    if(data.presence) {
      let presence = selectPresense.value.find((el: any) => el.value == data.presence.value)
      data.presence.text = presence?.text
    }
    if(data.contract_method) {
      let contract_method = selectContractMethod.value.find((el: any) => el.value == data.contract_method.value)
      data.contract_method.text = contract_method?.text
    }
    if(data.is_transfer_fee) {
      let is_transfer_fee = selectTransferFee.value.find((el: any) => el.value == data.is_transfer_fee.value)
      data.is_transfer_fee.text = is_transfer_fee?.text
    }
  })

  const rules = computed(() => {
    const Message = (i18nOptions: any, message: string) =>  t(`${message}`, i18nOptions)

    return {
      company_name: {
        required: helpers.withMessage(() => Message({field: t('client.company_name')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({ max: '50'}, 'message_validate.max'), maxLength(50),),
        custom: helpers.withMessage(() => Message(null,'message_validate.romaji')
          , (value: any) => {
          if(validateRomaji(value) || value.length == 0) {
            return true
          } else {
            return false
          }
        })
      },
      represent_name: {
        maxLength: helpers.withMessage(() => Message({ max: '30'}, 'message_validate.max'), maxLength(30),),
        custom: helpers.withMessage(() => Message(null,'message_validate.romaji')
          , (value: any) => {
          if(validateRomaji(value) || value.length == 0) {
            return true
          } else {
            return false
          }
        })
      },
      email: {
        maxLength: helpers.withMessage(() => Message({ max: '50'}, 'message_validate.max'), maxLength(50),),
        email: helpers.withMessage(() => Message(null, 'message_validate.email'), email),
      },
      address: {
        maxLength: helpers.withMessage(() => Message({ max: '100'}, 'message_validate.max'), maxLength(100),),
        custom: helpers.withMessage(() => Message(null,'message_validate.romaji')
          , (value: any) => {
          if(validateRomaji(value) || value.length == 0) {
            return true
          } else {
            return false
          }
        })
      },
      service_name: {
        required: helpers.withMessage(() => Message({field: t('client.service_name')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({ max: '30'}, 'message_validate.max'), maxLength(30),),
        custom: helpers.withMessage(() => Message(null,'message_validate.romaji')
          , (value: any) => {
          if(validateRomaji(value) || value.length == 0) {
            return true
          } else {
            return false
          }
        })
      },
      client_id: {
        required: helpers.withMessage(() => Message({field: t('client.client_id')}, 'message_validate.required'), required),
        numeric: helpers.withMessage(() => Message({field: t('client.client_id')}, 'message_validate.numeric'), numeric),
        maxLength: helpers.withMessage(() => Message({ max: NUMBER_MAX_LENGTH}, 'message_validate.max'), maxLength(NUMBER_MAX_LENGTH),),
      },
      charge_fee_rate: {
        required: helpers.withMessage(() => Message({field: t('client.charge_fee_rate')}, 'message_validate.required'), required),
        custom: helpers.withMessage(() => Message(null, 'message_validate.decimal'), (value: number) => {
            if(validateDecimal(value) || !value) {
              return true
            }
            return false
          }
        )
      },
      settlement_fee_rate: {
        required: helpers.withMessage(() => Message({field: t('client.settlement_fee_rate')}, 'message_validate.required'), required),
        custom: helpers.withMessage(() => Message(null, 'message_validate.decimal'), (value: number) => {
            if(validateDecimal(value) || !value) {
              return true
            }
            return false
          }
        )
      },
      is_transfer_fee: {
        required: helpers.withMessage(() => Message({field: t('client.is_transfer_fee')}, 'message_validate.required'), required),
      },
      contractor_id: {
        required: helpers.withMessage(() => Message({field: t('client.contractor_id')}, 'message_validate.required'), required),
      },
      contract_method: {
        required: helpers.withMessage(() => Message({field: t('client.contract_method')}, 'message_validate.required'), required),
      },
      settlement_fee_memo: {
        maxLength: helpers.withMessage(() => Message({ max: STRING_MAX_LENGTH}, 'message_validate.max'), maxLength(STRING_MAX_LENGTH),),
      },
      license_number: {
        maxLength: helpers.withMessage(() => Message({ max: STRING_MAX_LENGTH}, 'message_validate.max'), maxLength(STRING_MAX_LENGTH),),
      },
      charge_fee_memo: {
        maxLength: helpers.withMessage(() => Message({ max: STRING_MAX_LENGTH}, 'message_validate.max'), maxLength(STRING_MAX_LENGTH),),
      },
      sales_representative: {
        maxLength: helpers.withMessage(() => Message({ max: STRING_MAX_LENGTH}, 'message_validate.max'), maxLength(STRING_MAX_LENGTH),),
      },
    }
  })

  const v$ = useValidate(rules, data)

  const onAddClick = async () => {
    GlobalStore.setLoading(true)
    const validate = v$.value.$validate()
    if (v$.value.$error) {
      GlobalStore.setLoading(false)
      return
    }
    var isExistEmail = await isUniqueEmail(data.email)
    var isExistClient = await isUniqueClientId(data.client_id)
    error.value = isExistEmail ? true : false
    isUniqueClient.value = isExistClient ? true : false
    if(error.value || isUniqueClient.value) {
      GlobalStore.setLoading(false)
      return
    }
    const params = {...data}
    if(data.presence) {
      params.presence = JSON.parse(JSON.stringify(data.presence)).value
    }
    if(data.contract_method) {
      params.contract_method = JSON.parse(JSON.stringify(data.contract_method)).value
    }
    if(data.termination_date) {
      let date = new Date(data.termination_date).toLocaleDateString('fr-CA')
      params.termination_date = date
    }
    if(data.is_transfer_fee) {
      params.is_transfer_fee = JSON.parse(JSON.stringify(data.is_transfer_fee)).value
    }
    const result = await service.create(`${SCREEN_COMMON.CLIENT.CREATE}`, params)
    if (result.status) {
      GlobalStore.setLoading(false)
      router.push(`${SCREEN_COMMON.CLIENT.LIST}`)
      GlobalStore.setIsCreated()
      return
    }
    GlobalStore.setLoading(false)
    init({ message: result.message, color: 'danger' })
  }

  const getListContractor = async () => {
    try {
      const respone = await service.getListContractor({is_honsha: 1})
      selectContractor.value = respone.data.map((item: any) => {
        return {
          text: item.company_name,
          value: item.id
        };
      });
    } catch (error) {
      console.log(error)
    }
  }

  const isUniqueEmail = async (email: any) => {
    try {
      if(!email) return
      const response = await ClientService.checkUniqueEmail(email);
      return response.data === 1;
    } catch (error) {
      console.log(error)
    }
  };

  const isUniqueClientId = async (id: any) => {
    try {
      const response = await ClientService.checkUniqueClientId(id, null);
      return response.data === 1;
    } catch (error) {
      console.log(error)
    }
  };

  const onBackClick = () => {
    router.push(`${SCREEN_COMMON.CLIENT.LIST}`)
  }
</script>

<style lang="scss" scoped>
  .form-label {
    padding-top: 5px;
  }
</style>
