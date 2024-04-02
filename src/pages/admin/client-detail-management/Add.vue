<template>
  <va-card class="flex">
    <va-card-content class="c-pb-50">
      <div class="title c-mb-36">{{ t('client_detail.client_detail_add_title') }}</div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('client_detail.service_type') }}<span class="mark-required"> *</span></div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-select
            v-model="data.service_type"
            :placeholder="t('placeholder_input_select')"
            :options="selectServiceType"
            clearable
            clearable-icon="cancel"
            :track-by="(selectServiceType: any) => selectServiceType.value"
            />
            <p v-for="error of v$.service_type.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('client_detail.is_minimun_charge') }}<span class="mark-required"> *</span></div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-select
            v-model="data.is_minimun_charge"
            :placeholder="t('placeholder_input_select')"
            :options="selectMimimum"
            clearable
            clearable-icon="cancel"
            :track-by="(selectMimimum: any) => selectMimimum.value"
            />
            <p v-for="error of v$.is_minimun_charge.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('client_detail.usage_fee_amount') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input
            v-model="data.usage_fee_amount"
            :disabled="isDisabled"
            />
            <p v-for="error of v$.usage_fee_amount.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('client_detail.contract_rate') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.contract_rate" />
            <p v-for="error of v$.contract_rate.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('client_detail.contract_date') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <SelectDatePicker
            v-model="data.contract_date"
            placeholder="yyyy/mm/dd"
            :is-input="true"
            :disabled-cus="'none'"
            />
          </div>
      </div>
      <div class="row va-gutter-1" v-if="route.query.method == '1'">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('client_detail.max_amount') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.max_amount" />
            <p v-for="error of v$.max_amount.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('client_detail.description') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.description"/>
            <p v-for="error of v$.description.$errors" :key="error.$uid">
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
  import { useRoute, useRouter } from 'vue-router'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import useValidate from '@vuelidate/core'
  import { required, helpers, numeric, integer, maxLength, decimal } from '@vuelidate/validators'
  import { ref, computed, reactive, toRefs, watch, watchEffect } from 'vue'
  import { CommonService } from '../../../services/CommonService'
  import { SERVICE_TYPE, MIMIMUM_TYPE, TRANSFER_FEE_TYPE, MAX_AMOUNT_NULL } from '../../../common/constants'
  import { convertCurrency, isCurrency, isTypingNumber } from '../../../common/utils'
  import { SCREEN_COMMON } from '../../../router/router'
  import SelectDatePicker from '../../../components/select-date-picker/index.vue'
  import { validateDecimal } from '../../../common/utils'
  import { HTTP } from '../../../common/HTTP-common'
  import ClientDetailService from '../../../services/ClientDetailService'

  const { t, locale } = useI18n()
  const service = new CommonService()
  const { init, close, closeAll } = useToast()
  const GlobalStore = useGlobalStore()
  const route = useRoute()
  const router = useRouter()
  const isDisabled = ref(true)

  const data = reactive({
    client_id: route.query.id,
    service_type: '',
    is_minimun_charge: '' as any,
    contract_rate: '',
    contract_date: new Date(),
    max_amount: '0',
    user_edit_id: GlobalStore.userId,
    usage_fee_amount: '',
    description: ''
  })

  const selectServiceType = [
    {
      text: t('client_detail.deposit'),
      value: SERVICE_TYPE.DEPOSIT
    },
    {
      text: t('client_detail.withdrow'),
      value: SERVICE_TYPE.WITHDROW
    },
  ]

  var selectMimimum = computed(() => {
    return [
      {
        text: t('client_detail.can_be'),
        value: MIMIMUM_TYPE.CAN_BE
      },
      {
        text: t('client_detail.none'),
        value: MIMIMUM_TYPE.NONE
      },
   ]
  })

  watch(locale, () => {
    if(data.is_minimun_charge) {
      let is_minimun_charge = selectMimimum.value.find((el: any) => el.value == data.is_minimun_charge?.value)
      data.is_minimun_charge.text = is_minimun_charge?.text
    }
  })

  watch(() => data.usage_fee_amount, (currentValue, oldValue) => {
    if(isCurrency(currentValue)) {
      data.usage_fee_amount = convertCurrency(currentValue)
    }
  })

  watch(() => data.max_amount, (currentValue, oldValue) => {
    if(isCurrency(currentValue)) {
      data.max_amount = convertCurrency(currentValue)
    }
  })

  // watch(() => data.max_amount, (currentValue) => {
  //   if(data.max_amount) {
  //     data.description = `～￥${data.max_amount}`
  //   }
  //   if(data.max_amount == '0') {
  //     data.description = MAX_AMOUNT_NULL
  //   }
  //   if(!data.max_amount) data.max_amount = '0'
  // })

  const rules = computed(() => {
    const Message = (i18nOptions: any, message: string) =>  t(`${message}`, i18nOptions)
    return {
      service_type: {
        required: helpers.withMessage(() => Message({field: t('client_detail.service_type')}, 'message_validate.required'), required),
      },
      is_minimun_charge: {
        required: helpers.withMessage(() => Message({field: t('client_detail.is_minimun_charge')}, 'message_validate.required'), required),
      },
      contract_rate: {
        custom: helpers.withMessage(() => Message(null, 'message_validate.decimal'), (value: number) => {
            if(validateDecimal(value) || !value) {
              return true
            }
            return false
          }
        )
      },
      usage_fee_amount: {
        required: helpers.withMessage(() => Message({field: t('client_detail.usage_fee_amount')}, 'message_validate.required'), (value: any) => {
          if(isDisabled.value || data.usage_fee_amount.length > 0) {
            return true
          } else {
            return false
          }
        }),
        custom: helpers.withMessage(() => Message({field: t('client_detail.usage_fee_amount')}, 'message_validate.numeric'), (value: any) => {
            const newValue = value.replaceAll(',','')
            if(isTypingNumber(newValue) || newValue.length === 0 || isDisabled.value) {
              return true
            } else {
              return false
            }
          }
        ),
      },
      max_amount: {
        custom: helpers.withMessage(() => Message({field: t('client_detail.max_amount')}, 'message_validate.numeric'), (value: any) => {
            const newValue = value.replaceAll(',','')
            if(isTypingNumber(newValue) || newValue.length === 0) {
              return true
            } else {
              return false
            }
          }
        ),
      },
      description: {
        maxLength: helpers.withMessage(() => Message({ max: '25'}, 'message_validate.max'), maxLength(25),),
      },
    }
  })

  const v$ = useValidate(rules, data)

  watch(() => data.is_minimun_charge, (currentValue) => {
    if(data.is_minimun_charge) {
      var minimunCharge = JSON.parse(JSON.stringify(data.is_minimun_charge))
      isDisabled.value = minimunCharge.value == 2 ? true : false
    } else {
      isDisabled.value = true
    }
  })

  const onAddClick = async () => {
    GlobalStore.setLoading(true)
    const validate = v$.value.$validate()
    if (v$.value.$error) {
      GlobalStore.setLoading(false)
      return
    }
    const params = { ...data }
    if(data.usage_fee_amount) {
      params.usage_fee_amount = Number(data.usage_fee_amount.replaceAll(',',''))
    }
    if(data.max_amount) {
      params.max_amount = Number(data.max_amount.replaceAll(',',''))
    }
    if(data.is_minimun_charge) {
      params.is_minimun_charge = JSON.parse(JSON.stringify(data.is_minimun_charge)).value
    }
    if(data.service_type) {
      params.service_type = JSON.parse(JSON.stringify(data.service_type)).value
    }
    if(data.contract_date) {
      let date = new Date(data.contract_date).toLocaleDateString('fr-CA')
      params.contract_date = date
    }
    const isExist = await ClientDetailService.checkContractExist(params)
    if(isExist.status) {
      var message = ''
      switch(isExist.message_code) {
        case 'RECORD_FLAT_EXIST':
          message = t('message_validate.record_flat_exist')
          break
        case 'RECORD_SLIDE_EXIST':
          message = t('message_validate.contract_with_max_amount_exist')
          break
        case 'CONTRACT_WITH_MAX_AMOUNT_0_EXIST':
          message = t('message_validate.record_slide_exist')
          break
      }
      GlobalStore.setLoading(false)
      init({ message: message, color: 'danger' })
      return
    }
    const result = await service.create(`/client_details`, params)
    if (result.status) {
      GlobalStore.setLoading(false)
      router.push(`${SCREEN_COMMON.CLIENT.EDIT(route.query.contract_detail)}`)
      GlobalStore.setIsCreated()
      return
    }
    GlobalStore.setLoading(false)
    init({ message: result.message, color: 'danger' })
  }

  const onBackClick = () => {
    router.push(`${SCREEN_COMMON.CLIENT.EDIT(route.query.contract_detail)}`)
  }
</script>

<style lang="scss" scoped>
  .form-label {
    padding-top: 5px;
  }
</style>
