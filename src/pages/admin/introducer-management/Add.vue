<template>
  <va-card class="flex">
    <va-card-content class="c-pb-50">
      <div class="title c-mb-36">{{ t('introducer.introducer_add_title') }}</div>
      <div class="d-flex flex gap-35">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('introducer.company_name') }}<span class="mark-required"> *</span></p>
          <va-input v-model="data.company_name"/>
          <div v-for="error of v$.company_name.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </div>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('introducer.representative_name') }}</p>
          <va-input v-model="data.representative_name" />
          <div v-for="error of v$.representative_name.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('introducer.email') }}</p>
          <va-input v-model="data.email" />
          <div v-for="error of v$.email.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </div>
          <div v-if="error">
            <span class="error-msg" style="color: red">{{ t("message_validate.email_exits") }}</span>
          </div>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('introducer.address') }}</p>
          <va-input v-model="data.address" />
          <div v-for="error of v$.address.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('introducer.contract_date') }}</p>
          <!-- <va-date-input class="w-full" placeholder="yyyy/mm/dd" v-model="data.contract_date" :format="formatDate" manual-input/> -->
          <SelectDatePicker v-model="data.contract_date" :is-input="true" manual-input :disabled-cus="'none'"
      clearable/>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('introducer.contractor_id') }}</p>
          <va-select
          v-model="data.contractor_id"
          :placeholder="t('placeholder_input_select')"
          :options="selectContractor"
          clearable
          clearable-icon="cancel"
          :value-by="(selectContractor: any) => selectContractor.value"
          />
          <!-- <div v-for="error of v$.contractor_id.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </div> -->
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('introducer.presence') }}<span class="mark-required"> *</span></p>
          <va-select 
          v-model="data.presence" 
          :options="selectPresense"
          :placeholder="t('placeholder_input_select')"
          clearable
          clearable-icon="cancel"
          :track-by="(selectPresense: any) => selectPresense.value"
          />
          <div v-for="error of v$.presence.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </div>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('introducer.referral_classification') }}<span class="mark-required"> *</span></p>
          <va-select 
          v-model="data.referral_classification"
          :placeholder="t('placeholder_input_select')"
          :options="selectReferralClassification"
          clearable
          clearable-icon="cancel"
          :track-by="(selectReferralClassification: any) => selectReferralClassification.value"
          />
          <div v-for="error of v$.referral_classification.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('introducer.referral_fee') }}</p>
          <va-input v-model="data.referral_fee" />
          <div v-for="error of v$.referral_fee.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </div>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input" v-if="data.referral_classification">{{ t('introducer.referral_name') }}<span class="mark-required"> *</span></p>
          <va-select 
          v-model="data.client_id"
          :placeholder="t('placeholder_input_select')"
          :options="selectClientId"
          clearable
          clearable-icon="cancel"
          :value-by="(selectClientId: any) => selectClientId.value"
          v-if="data.referral_classification?.value == REFERRAL_CLASSIFICATION_TYPE.CLIENT"
          />
          <va-select 
          v-model="data.account_contractor_id"
          :placeholder="t('placeholder_input_select')"
          :options="selectAccountContractor"
          clearable
          clearable-icon="cancel"
          :value-by="(selectAccountContractor: any) => selectAccountContractor.value"
          v-if="data.referral_classification?.value == REFERRAL_CLASSIFICATION_TYPE.ACCOUNT"
          />
          <div v-for="error of v$.referral_name.$errors" :key="error.$uid">
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
  import { required, helpers, decimal, numeric, minLength, maxLength, email, createI18nMessage } from '@vuelidate/validators'
  import { ref, computed, reactive, toRefs, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { HTTP } from '../../../common/HTTP-common'
  import { CommonService } from '../../../services/CommonService'
  import IntroducerService from '../../../services/IntroducerService'
  import { REFERRAL_CLASSIFICATION_TYPE, PRESENSE_TYPE } from '../../../common/constants'
  import { validateRomaji, validateDecimal } from '../../../common/utils'
  import { API } from '../../../services/apis/apis'
  import { SCREEN_COMMON } from '../../../router/router'
  import SelectDatePicker from '../../../components/select-date-picker/index.vue'

  const { t, locale } = useI18n()
  const service = new CommonService()
  const router = useRouter()
  const { init, close, closeAll } = useToast()
  const GlobalStore = useGlobalStore()
  const error = ref(false)

  const data = reactive({
    company_name: '',
    representative_name: '',
    email: '',
    contract_date: new Date(),
    contractor_id: '',
    address: '',
    presence: '' as any,
    referral_classification: '' as any,
    referral_name: '',
    referral_fee: '',
    user_edit_id: GlobalStore.userId,
    client_id: '' as any,
    account_contractor_id: '' as any
  })

  const selectContractor: any = ref()
  const selectClientId: any = ref()
  const selectAccountContractor: any = ref()

  const selectPresense = computed(() =>{
    return [
      {
        text: t('introducer.option_have'),
        value: PRESENSE_TYPE.HAVE
      },
      {
        text: t('introducer.option_none'),
        value: PRESENSE_TYPE.NONE
      },
    ]
  })

  const selectReferralClassification = computed(() =>{
    return [
      {
        text: t('introducer.client'),
        value: REFERRAL_CLASSIFICATION_TYPE.CLIENT
      },
      {
        text: t('introducer.account'),
        value: REFERRAL_CLASSIFICATION_TYPE.ACCOUNT
      },
    ]
    })

  watch(locale, () => {
    if(data.presence) {
      let presence = selectPresense.value.find((el: any) => el.value == data.presence.value)
      data.presence.text = presence?.text
    }
    if(data.referral_classification) {
      let referral_classification = selectReferralClassification.value.find((el: any) => el.value == data.referral_classification.value)
      data.referral_classification.text = referral_classification?.text
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
      company_name: {
        required: helpers.withMessage(() => Message({field: t('introducer.company_name')}, 'message_validate.required'), required),
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
      representative_name: {
        maxLength: helpers.withMessage(() => Message({ max: '30' }, 'message_validate.max'),
          maxLength(30),
        ),
        custom: helpers.withMessage(() => Message(null, 'message_validate.romaji'), (value: any) => {
          if(validateRomaji(value) || value.length == 0) {
            return true
          } else {
            return false
          }
        })
      },
      email: {
        maxLength: helpers.withMessage(() => Message({ max: '50' }, 'message_validate.max'),
          maxLength(50),
        ),
        email: helpers.withMessage(() => Message(null, 'message_validate.email'), email),
      },
      address: {
        maxLength: helpers.withMessage(() => Message({ max: '100' }, 'message_validate.max'),
          maxLength(100),
        ),
        custom: helpers.withMessage(() => Message(null, 'message_validate.romaji'), (value: any) => {
          if(validateRomaji(value) || value.length == 0) {
            return true
          } else {
            return false
          }
        })
      },
      referral_classification: {
        required: helpers.withMessage(() => Message({ field: t('introducer.referral_classification') }, 'message_validate.required'),
          required,
        ),
      },
      referral_name: {
        required: helpers.withMessage(() => Message({ field: t('introducer.referral_name') }, 'message_validate.required'), (value: any) => {
          if(!data.referral_classification 
              || (data.referral_classification?.value == REFERRAL_CLASSIFICATION_TYPE.CLIENT && data.client_id)
              || (data.referral_classification?.value == REFERRAL_CLASSIFICATION_TYPE.ACCOUNT && data.account_contractor_id)
          ) {
            return true
          } else {
            return false
          }
        }),
      },
      presence: {
        required: helpers.withMessage(() => Message({ field: t('introducer.presence') }, 'message_validate.required'), required),
      },
      referral_fee: {
        custom: helpers.withMessage(() => Message(null, 'message_validate.decimal'), (value: number) => {
            if(validateDecimal(value) || !value) {
              return true
            }
            return false
          }
        )
      },
    }
  })

  onMounted(() => {
    getListContractor()
    getListSelectClient()
    getListAccountContractor()
  })

  const v$ = useValidate(rules, data)

  // watch(rules, () => {
  //   v$.value = unref(useValidate(rules, data))
  // })
  

  const onAddClick = async () => {
    GlobalStore.setLoading(true)
    const validate = v$.value.$validate()
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
    const params = {...data}
    params.presence = JSON.parse(JSON.stringify(data.presence)).value
    params.referral_classification = JSON.parse(JSON.stringify(data.referral_classification)).value
    if(data.contract_date) {
      let date = new Date(data.contract_date).toLocaleDateString('fr-CA')
      params.contract_date = date
    }
    const result = await service.create(`${API.MANAGEMENT_COMMON.INTRODUCER.CREATE}`, params)
    if (result.status) {
      GlobalStore.setLoading(false)
      GlobalStore.$state.isCreated = true
      router.push(`${SCREEN_COMMON.INTRODUCER.LIST}`)
      return
    }
    GlobalStore.setLoading(false)
    init({ message: result.message, color: 'danger' })
  }

  const isUniqueEmail = async (email: any) => {
    try {
      if(!email) return
      const response = await IntroducerService.checkUniqueEmail(email);
      return response.data === 1;
    }
    catch(error) {
      console.log(error)
    }
  };

  const onBackClick = () => {
    router.push(`${SCREEN_COMMON.INTRODUCER.LIST}`)
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

  const getListSelectClient = async () => {
    try {
      const respone = await service.getListClient()
      selectClientId.value = respone.data.map((item: any) => {
        return {
          text: item.represent_name,
          value: item.client_id
        };
      });
    } catch (error) {
      console.log(error)
    }
  }

  const getListAccountContractor = async () => {
    try {
      const respone = await service.getListContractor(null)
      selectAccountContractor.value = respone.data.map((item: any) => {
        return {
          text: item.representative_name,
          value: item.id
        };
      });
    } catch (error) {
      console.log(error)
    }
  }
</script>

<style lang="scss" scoped>
  .form-label {
    padding-top: 5px;
  }
</style>
