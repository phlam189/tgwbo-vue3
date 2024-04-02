<template>
  <va-card class="flex">
    <va-card-content class="c-pb-50">
      <div class="title c-mb-36">{{ t('contractor.contractor_add_title') }}</div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('contractor.company_name') }}<span class="mark-required"> *</span></div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.company_name"/>
            <p v-for="error of v$.company_name.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('contractor.manager') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.manager" />
            <p v-for="error of v$.manager.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('contractor.email') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model.trim="data.email"/>
            <p v-for="error of v$.email.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
            <div v-if="error">
              <span class="error-msg" style="color: red">{{ t("message_validate.email_exits") }}</span>
            </div>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('contractor.address') }}<span class="mark-required"> *</span></div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.address" />
            <p v-for="error of v$.address.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('contractor.invoice_prefix') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.invoice_prefix"/>
            <p v-for="error of v$.invoice_prefix.$errors" :key="error.$uid">
              <p class="error-msg" style="color: red">{{ error.$message }}</p>
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
  import { required, helpers, maxLength, email } from '@vuelidate/validators'
  import { ref, computed, reactive } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import { FormUpdateContractor } from '../../../types/Contractor'
  import ContractorService from '../../../services/ContractorService'
  import { CommonService } from '../../../services/CommonService'
  import { validateRomaji } from '../../../common/utils'
  import { SCREEN_COMMON } from '../../../router/router'
  import { API } from '../../../services/apis/apis'

  const { t } = useI18n()
  const service = new CommonService()
  const router = useRouter()
  const { init } = useToast()
  const GlobalStore = useGlobalStore()
  const error = ref(false)

  const data = reactive(<FormUpdateContractor>{})


    const rules = computed(() => {
    const Message = (i18nOptions: any, message: string) =>  t(`${message}`, i18nOptions)
    return {
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
      manager: {
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
      invoice_prefix: {
        maxLength: helpers.withMessage(() => Message({max: '2'}, 'message_validate.max'), maxLength(2),),
      },
    }
  })

  var v$ = useValidate(rules, data)

  const isUniqueEmail = async (email: any) => {
    try {
      if(!email) return
      const response = await ContractorService.checkUniqueEmail(email);
      return response.data === 1;
    }
    catch(error) {
      console.log(error)
    }
  };

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
    data.user_edit_id = Number(GlobalStore.userId)
    const params = {...data} as any
    params.company_type = null
    params.is_honsha = 1
    params.company_type = null

    const result = await service.create(`${API.MANAGEMENT_COMMON.CONTRACTOR.CREATE}`, params)
    if (result.status) {
      GlobalStore.setLoading(false)
      GlobalStore.setIsCreated()
      router.push(`${SCREEN_COMMON.CONTRACTOR.LIST}`)
      return
    }
    GlobalStore.setLoading(false)
    init({ message: result.message, color: 'danger' })
  }
  const onBackClick = () => {
    router.push(`${SCREEN_COMMON.CONTRACTOR.LIST}`)
  }
</script>

<style lang="scss" scoped>
  .form-label {
    padding-top: 5px;
  }
</style>
