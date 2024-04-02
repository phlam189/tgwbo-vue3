<template>
    <va-card class="flex">
      <va-card-content class="c-pb-50">
        <div class="title c-mb-36">{{ t('contractor.account_contractor_add_title') }}</div>
        <div class="d-flex flex gap-35">
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.company_type') }}<span class="mark-required"> *</span></p>
            <va-select 
            v-model="data.company_type" 
            :options="selectConpanyType" 
            clearable 
            clearable-icon="cancel"
            :track-by="(selectConpanyType: any) => selectConpanyType.value"
            />
            <p v-for="error of v$.company_type.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p> 
          </div>
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.date_of_birth') }}<span class="mark-required"> *</span></p>
            <SelectDatePicker 
            v-model="data.date_of_birth" 
            :is-input="true"
            :disabled-cus="'none'"
            />
            <p v-for="error of v$.date_of_birth.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
        </div>
        </div>
        <div class="d-flex flex gap-35 c-mt-15">
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.company_name') }}<span class="mark-required"> *</span></p>
            <va-input v-model="data.company_name"/>
            <p v-for="error of v$.company_name.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.representative_name') }}<span class="mark-required"> *</span></p>
            <va-input v-model="data.representative_name" />
            <p v-for="error of v$.representative_name.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
        </div>
        <div class="d-flex flex gap-35 c-mt-15">
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.email') }}</p>
            <va-input v-model="data.email"/>
            <p v-for="error of v$.email.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
            <div v-if="error">
              <span class="error-msg" style="color: red">{{ t("message_validate.email_exits") }}</span>
            </div>
          </div>
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.address') }}<span class="mark-required"> *</span></p>
            <va-input v-model="data.address" />
            <p v-for="error of v$.address.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
        </div>
        <div class="d-flex flex gap-35 c-mt-15">
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.contract_date') }}</p>
            <SelectDatePicker 
            v-model="data.contract_date" 
            :is-input="true"
            :disabled-cus="'none'"
            />
          </div>
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.existence_secondment_contract') }}<span class="mark-required"> *</span></p>
            <va-select 
            v-model="data.existence" 
            :options="selectExistenceSecondmentContract" 
            clearable 
            clearable-icon="cancel"
            :track-by="(selectExistenceSecondmentContract: any) => selectExistenceSecondmentContract.value"
            />
            <p v-for="error of v$.existence.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
        </div>
        <div class="d-flex flex gap-35 c-mt-15">
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.presence') }}<span class="mark-required"> *</span></p>
            <va-select 
            v-model="data.presence" 
            :options="selectPresense" 
            clearable 
            clearable-icon="cancel"
            :track-by="(selectPresense: any) => selectPresense.value"
            />
            <p v-for="error of v$.presence.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.parent_id') }}</p>
            <va-select 
            v-model="data.parent_id" 
            :no-options-text="`${t('list_no_data')}`" 
            :options="selectContractor" 
            clearable 
            clearable-icon="cancel"
            :value-by="(selectContractor: any) => selectContractor.value"
            />
          </div>
        </div>
        <div class="d-flex flex gap-35 c-mt-15">
          <div class="flex flex-col md6">
            <p class="lable-input">{{ t('contractor.invoice_prefix') }}</p>
            <va-input v-model="data.invoice_prefix" />
            <p v-for="error of v$.invoice_prefix.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
          <div class="flex flex-col md6">
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
  import { required, helpers, integer, maxLength, email } from '@vuelidate/validators'
  import { ref, computed, reactive, toRefs, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { HTTP } from '../../../common/HTTP-common'
  import { CommonService } from '../../../services/CommonService'
  import { validateRomaji } from '../../../common/utils'
  import SelectDatePicker from '../../../components/select-date-picker/index.vue'
  import { FormCreateAccountContractor } from '../../../types/Contractor'
  import { PRESENSE_TYPE, COMPANY_TYPE } from '../../../common/constants'
  import { SCREEN_COMMON } from '../../../router/router'
  import { API } from '../../../services/apis/apis'
  import ContractorService from '../../../services/ContractorService'

  const { t, locale } = useI18n()
  const service = new CommonService()
  const router = useRouter()
  const { init, close, closeAll } = useToast()
  const GlobalStore = useGlobalStore()
  const error = ref(false)

  const data = reactive(<FormCreateAccountContractor>{})
  const selectContractor: any = ref()
  const selectPresense = computed(() => {
    return [
      {
        text: t('contractor.option_have'),
        value: PRESENSE_TYPE.HAVE
      },
      {
        text: t('contractor.option_none'),
        value: PRESENSE_TYPE.NONE
      },
    ]
  })
  const selectExistenceSecondmentContract = computed(() => {
    return [
        {
          text: t('contractor.option_have'),
          value: PRESENSE_TYPE.HAVE
        },
        {
          text: t('contractor.option_none'),
          value: PRESENSE_TYPE.NONE
        },
    ]
  })
  const selectConpanyType = computed(() => {
    return [
        {
          text: t('contractor.former_stock'),
          value: COMPANY_TYPE.FORMER_STOCK
        },
        {
          text: t('contractor.back_stock'),
          value: COMPANY_TYPE.BACK_STOCK
        },
        {
          text: t('contractor.front'),
          value: COMPANY_TYPE.FRONT
        },
        {
          text: t('contractor.back'),
          value: COMPANY_TYPE.BACK
        },
        {
          text: t('contractor.preexisting'),
          value: COMPANY_TYPE.PREEXISTING
        },
        {
          text: t('contractor.later'),
          value: COMPANY_TYPE.LATER
        },
        {
          text: t('contractor.none'),
          value: COMPANY_TYPE.NONE
        },
    ]
  })

  watch(locale, () => {
    if(data.presence) {
      let presence = selectPresense.value.find((el: any) => el.value == data.presence.value)
      data.presence.text = presence?.text
    }
    if(data.existence) {
      let existence_secondment_contract = selectExistenceSecondmentContract.value.find((el: any) => el.value == data.existence.value)
      data.existence.text = existence_secondment_contract?.text
    }
    if(data.company_type) {
      let company_type = selectConpanyType.value.find((el: any) => el.value == data.company_type.value)
      data.company_type.text = company_type?.text
    }
  })

  watch(() => data.email, () => {
    if(data.email) {
      data.email = data.email.trim()
    }
  })

  const rules = computed(() => {
  const Message = (i18nOptions: any, message: string) =>  t(`${message}`, i18nOptions)
    return {
      company_type: {
        required: helpers.withMessage(() => Message({field: t('contractor.company_type')}, 'message_validate.required'), required),
      },
      date_of_birth: {
        required: helpers.withMessage(() => Message({field: t('contractor.date_of_birth')}, 'message_validate.required'), required),
      },
      company_name: {
        required: helpers.withMessage(() => Message({field: t('contractor.company_name')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({max: '50'}, 'message_validate.max'), maxLength(50),),
        custom: helpers.withMessage(() => Message(null, 'message_validate.romaji'), (value: any) => {
        if(validateRomaji(value) || value.length == 0) {
          return true
        } else {
          return false
        }
        })
      },
      representative_name: {
        required: helpers.withMessage(() => Message({field: t('contractor.representative_name')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({max: '30'}, 'message_validate.max'), maxLength(30),),
        custom: helpers.withMessage(() => Message(null, 'message_validate.romaji'), (value: any) => {
        if(validateRomaji(value) || value.length == 0) {
          return true
        } else {
          return false
        }
        })
      },
      email: {
        maxLength: helpers.withMessage(() => Message({max: '50'}, 'message_validate.max'), maxLength(50),),
        email: helpers.withMessage(() => Message(null, 'message_validate.email'), email),
      },
      address: {
        required: helpers.withMessage(() => Message({field: t('contractor.address')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({max: '100'}, 'message_validate.max'), maxLength(100),),
        custom: helpers.withMessage(() => Message(null, 'message_validate.romaji'), (value: any) => {
        if(validateRomaji(value) || value.length == 0) {
          return true
        } else {
          return false
        }
        })
      },
      presence: {
        required: helpers.withMessage(() => Message({field: t('contractor.presence')}, 'message_validate.required'), required),
      },
      existence: {
        required: helpers.withMessage(() => Message({field: t('contractor.existence_secondment_contract')}, 'message_validate.required'), required),
      },
      invoice_prefix: {
        maxLength: helpers.withMessage(() => Message({max: '2'}, 'message_validate.max'), maxLength(2),),
      },
    }
  })

  const v$ = useValidate(rules, data)

  onMounted(() => {
    data.contract_date = new Date()
    data.date_of_birth = new Date()
    getListContractor()
  })

  const isUniqueEmail = async (email: any) => {
    if(!email) return
    const response = await ContractorService.checkUniqueEmail(email, null);
    return response.data === 1;
  };

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

  const onAddClick = async () => {
    GlobalStore.setLoading(true)
    const validate = await v$.value.$validate()
    if (v$.value.$error) {
      GlobalStore.setLoading(false)
      return
    }
    var isExit = await isUniqueEmail(data.email);
    error.value = isExit ? true : false
    if(error.value) {
      GlobalStore.setLoading(false)
      return
    }
    data.user_edit_id = Number(GlobalStore.userId)
    data.is_honsha = 0
    const params = {...data}
    params.company_type = JSON.parse(JSON.stringify(data.company_type)).value
    params.presence = JSON.parse(JSON.stringify(data.presence)).value
    params.existence = JSON.parse(JSON.stringify(data.existence)).value
    params.date_of_birth = new Date(data.date_of_birth).toLocaleDateString('fr-CA')
    if(data.contract_date) {
      let date = new Date(data.contract_date).toLocaleDateString('fr-CA')
      params.contract_date = date
    }
    const result = await service.create(`${API.MANAGEMENT_COMMON.CONTRACTOR.CREATE}`, params)
    if (result.status) {
      GlobalStore.setLoading(false)
      GlobalStore.$state.isCreated = true
      router.push(`${SCREEN_COMMON.ACCOUNT_CONTRACTOR.LIST}`)
      return
    }
    GlobalStore.setLoading(false)
    init({ message: result.message, color: 'danger' })
  }
  const onBackClick = () => {
    router.push(`${SCREEN_COMMON.ACCOUNT_CONTRACTOR.LIST}`)
  }
</script>

<style lang="scss" scoped>
  .form-label {
    padding-top: 5px;
  }
</style>
  