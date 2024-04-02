<template>
  <va-card class="flex">
    <va-card-content class="c-pb-50">
      <div class="title c-mb-36">{{ t('account.account_edit_title') }}</div>
      <div class="d-flex flex gap-35">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.category_name') }}<span class="mark-required"> *</span></p>
          <va-select
          v-model="data.category_name"
          :placeholder="t('placeholder_input_select')"
          :options="selectCategory"
          clearable
          clearable-icon="cancel"
          :value-by="(selectCategory: any) => selectCategory.value"
          />
          <p v-for="error of v$.category_name.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.service_type') }}</p>
          <va-input v-if="data.service_type"
          v-model="data.service_type"
          disabled/>
          <va-input v-else
          disabled/>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.bank_name') }}<span class="mark-required"> *</span></p>
          <va-select
          v-model="data.bank_id"
          :placeholder="t('placeholder_input_select')"
          :options="selectBankId"
          clearable
          clearable-icon="cancel"
          :value-by="(selectBankId: any) => selectBankId.value"

          />
          <p v-for="error of v$.bank_name.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
        <div class="flex flex-col md6">
          <!-- <p class="lable-input">{{ t('account.bank_name') }}</p>
          <va-input :placeholder="t('placeholder_input_text')" v-model="data.bank_name" disabled/> -->
          <!-- <p v-for="error of v$.branch_name.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p> -->
          <p class="lable-input">{{ t('account.branch_name') }}<span class="mark-required"> *</span></p>
          <va-input v-model="data.branch_name" />
          <p v-for="error of v$.branch_name.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.bank_code') }}</p>
          <va-input  v-model="bankCode" disabled/>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.branch_code') }}<span class="mark-required"> *</span></p>
          <va-input  v-model="data.branch_code" />
          <p v-for="error of v$.branch_code.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.acount_holder') }}<span class="mark-required"> *</span></p>
          <va-input v-model="data.account_holder" />
          <p v-for="error of v$.account_holder.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.commission_rate') }}<span class="mark-required"> *</span></p>
          <va-input v-model="data.commission_rate" />
          <p v-for="error of v$.commission_rate.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.client_used') }}</p>
          <va-select
          v-model="data.client_id"
          :placeholder="t('placeholder_input_select')"
          :options="selectClientId"
          clearable
          clearable-icon="cancel"
          :value-by="(selectClientId: any) => selectClientId.value"
          />
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.account_number') }}<span class="mark-required"> *</span></p>
          <va-input v-model="data.account_number" />
          <p v-for="error of v$.account_number.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
          <div v-if="isUniqueAccount">
            <span class="error-msg" style="color: red">{{ t("message_validate.account_number_exist") }}</span>
          </div>
          <!-- <p class="lable-input">{{ t('account.balance') }}</p>
          <va-input :placeholder="t('placeholder_input_text')" v-model="data.balance" /> -->
          <!-- <p v-for="error of v$.balance.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p> -->
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.contractor_id') }}<span class="mark-required"> *</span></p>
          <va-select
          v-model="data.contractor_id"
          :placeholder="t('placeholder_input_select')"
          :options="selectContractorId"
          clearable
          clearable-icon="cancel"
          :value-by="(selectContractorId: any) => selectContractorId.value"
          />
          <p v-for="error of v$.contractor_id.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.representative_account') }}</p>
          <va-input v-model="data.representative_account" />
          <p v-for="error of v$.representative_account.$errors" :key="error.$uid">
            <span class="error-msg" style="color: red">{{ error.$message }}</span>
          </p>
        </div>
      </div>
      <div class="d-flex flex gap-35 c-mt-15">
        <div class="flex flex-col md6">
          <p class="lable-input">{{ t('account.balance') }}</p>
          <va-input v-model="data.balance" disabled/>
        </div>
        <div class="flex flex-col md6">
        </div>
      </div>
      <div class="hr-line c-mt-40"></div>
      <div class="d-flex gap-4 d-flex-end c-mt-25">
        <va-button class="button-cancel" @click="onBackClick">{{ t('back') }}</va-button>
        <va-button class="button-create" @click="onEditClick">{{ t('save') }}</va-button>
      </div>
    </va-card-content>
  </va-card>
</template>

<script setup lang="ts" scoped>
  import { useI18n } from 'vue-i18n'
  import { ref, computed, reactive, onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { FormUpdateAccount } from '../../../types/Account'
  import { SERVICE_TYPE, CATEGORY_NAME } from '../../../common/constants'
  import { validateDecimal, isCurrency, convertCurrency, isTypingNumber } from '../../../common/utils'
  import { required, helpers, numeric, maxLength, integer, decimal } from '@vuelidate/validators'
  import useValidate from '@vuelidate/core'
  import AccountService from '../../../services/AccountService'
  import { CommonService } from '../../../services/CommonService'
  import { useGlobalStore } from '../../../stores/global-store'
  import { useToast } from 'vuestic-ui'
  import { SCREEN_COMMON } from '../../../router/router'
  import { API } from '../../../services/apis/apis'
  import { formatCurrency } from '../../../common/utils'

  const { t } = useI18n()
  const router = useRouter()
  const service = new CommonService()
  const route = useRoute()
  const GlobalStore = useGlobalStore()
  const { init } = useToast()

  const data = reactive(<FormUpdateAccount>{})
  const selectClientId = ref([])
  const selectBankId = ref([])
  const selectContractorId = ref([])
  const isUniqueAccount = ref(false)
  const bankCode = ref()

  const selectCategory = computed(() => [
    t('account.deposit'),
    t('account.withdrow'),
    t('account.other')
  ])
    // return [
    //   {
    //     text: t('account.deposit'),
    //     value: SERVICE_TYPE.DEPOSIT
    //   },
    //   {
    //     text: t('account.withdrow'),
    //     value: SERVICE_TYPE.WITHDROW
    //   },
    //   {
    //     text: t('account.other'),
    //     value: SERVICE_TYPE.OTHER
    //   },
    // ]
  // })

  const rules = computed(() => {
    const Message = (i18nOptions: any, message: string) =>  t(`${message}`, i18nOptions)
    return {
      category_name: {
        required: helpers.withMessage(() => Message({field: t('account.category_name')}, 'message_validate.required'), required),
      },
      // service_type: {
      //   required: helpers.withMessage(() => Message({field: t('account.service_type')}, 'message_validate.required'), required),
      // },
      bank_name: {
        required: helpers.withMessage(() => Message({field: t('account.bank_name')}, 'message_validate.required'), required),
      },
      branch_name: {
        required: helpers.withMessage(() => Message({field: t('account.branch_name')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({ max: '10' }, 'message_validate.max'), maxLength(10),),
      },
      representative_account: {
        maxLength: helpers.withMessage(() => Message({ max: '7' }, 'message_validate.max'), maxLength(7),),
        numeric: helpers.withMessage(() => Message({ field: t('account.representative_account') }, 'message_validate.numeric'),
          numeric,
        ),
      },
      branch_code: {
        required: helpers.withMessage(() => Message({field: t('account.branch_code')}, 'message_validate.required'), required),
        numeric: helpers.withMessage(() => Message({ field: t('account.branch_code') }, 'message_validate.numeric'),
          numeric,
        ),
      },
      account_number: {
        required: helpers.withMessage(() => Message({field: t('account.account_number')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({ max: '7' }, 'message_validate.max'), maxLength(7),),
        numeric: helpers.withMessage(() => Message({ field: t('account.account_number') }, 'message_validate.numeric'),
          numeric,
        ),
      },
      account_holder: {
        required: helpers.withMessage(() => Message({field: t('account.acount_holder')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({ max: '20' }, 'message_validate.max'), maxLength(20),),
      },
      contractor_id: {
        required: helpers.withMessage(() => Message({field: t('account.contractor_id')}, 'message_validate.required'), required),
      },
      commission_rate: {
        required: helpers.withMessage(() => Message({field: t('account.commission_rate')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({ max: '20' }, 'message_validate.max'), maxLength(20),),
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

  const v$ = useValidate(rules, data)

  onMounted(async () => {
    getListSelectClient()
    getListContractor()
    await getListSelectBank()
    getAccountById()
  })

  watch(() => data.bank_id, (currentValue) => {
    // if(data.bank_id.bank_code) {
    //   data.bank_name = currentValue.text
    //   bankCode.value = currentValue.bank_code
    // } else {
    //   data.bank_name = ''
    //   bankCode.value = null
    // }
    let bank = selectBankId.value.find((item: any) => item.value == data.bank_id)
    data.bank_name = bank?.text
    bankCode.value = bank?.bank_code
  })

  watch(() => data.category_name, (currentValue) => {
     data.service_type = data.category_name
     if(data.category_name == CATEGORY_NAME.OTHER) {
      data.service_type = null
     }
  })

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

  const getListSelectBank = async () => {
    try {
      const response = await service.getListSelectBank()
      selectBankId.value = response.data.map((item: any) => {
        return {
          text: item.bank_name,
          value: item.id,
          bank_code: item.bank_code
        };
      });
    } catch (error) {
      console.log(error)
    }
  }

  const isUniqueAccountNumber = async (account_number: any, id: any) => {
    try {
      const response = await AccountService.checkUniqueAccountNumber(account_number, id);
      return response.data === 1;
    } catch (error) {
      console.log(error)
    }
  };

  const getListContractor = async () => {
    try {
      const respone = await service.getListContractor(null)
      selectContractorId.value = respone.data.map((item: any) => {
        return {
          text: item.company_name,
          value: item.id
        };
      });
    } catch (error) {
      console.log(error)
    }
  }

  const getAccountById = async () => {
    try {
      const result = await AccountService.getAccountById(route.params.id)
        .then((res) =>{
          return res.data
        })
      Object.assign(data, result)
      if(data.category_name){
        switch (data.category_name) {
          case CATEGORY_NAME.DEPOSIT:
            data.category_name = t('account.deposit')
            break
          case CATEGORY_NAME.WITHDROW:
            data.category_name = t('account.withdrow')
            break
          default:
            data.category_name = t('account.other')
            break
        }
      }
      // if(data.client_id) {
      //   data.client_id = {
      //     text: data.client.represent_name,
      //     value: data.client_id
      //   }
      // }
      // if(data.contractor_id) {
      //   data.contractor_id = {
      //     text: data.contractor.company_name,
      //     value: data.contractor_id
      //   }
      // }
      // if(data.bank_id) {
      //   data.bank_id = {
      //     text: data.bank_name,
      //     value: data.bank_id
      //   }
      // }
      // if(data.service_type) {
      //   data.service_type = data.service_type == SERVICE_TYPE.DEPOSIT
      //     ? t('account.deposit')
      //     : t('account.withdrow')
      // }
      data.balance = formatCurrency.func(data.balance)
    } catch(error) {
      console.log(error)
    }
  }

  const onEditClick = async () => {
    GlobalStore.setLoading(true)
    const validate = v$.value.$validate()
    if (v$.value.$error) {
      GlobalStore.setLoading(false)
      return
    }
    var isExistAccount = await isUniqueAccountNumber(data.account_number, route.params.id)
    isUniqueAccount.value = isExistAccount ? true : false
    if (isUniqueAccount.value) {
      GlobalStore.setLoading(false)
      return
    }
    data.user_edit_id = Number(GlobalStore.userId)
    const params = {...data}
    delete params.balance
    switch (data.service_type) {
      case CATEGORY_NAME.DEPOSIT:
        params.service_type = SERVICE_TYPE.DEPOSIT
        break
      case CATEGORY_NAME.WITHDROW:
        params.service_type = SERVICE_TYPE.WITHDROW
        break
      default:
        params.service_type = SERVICE_TYPE.OTHER
        break
    }
    // params.bank_id = JSON.parse(JSON.stringify(data.bank_id)).value
    // params.contractor_id = JSON.parse(JSON.stringify(data.contractor_id)).value
    // if(data.client_id) {
    //   params.client_id = JSON.parse(JSON.stringify(data.client_id)).value
    // }
    const result = await service.update(`${API.MANAGEMENT_COMMON.ACCOUNT.UPDATE(route.params.id)}`, params)
    if (result.status) {
      GlobalStore.setLoading(false)
      router.push(`${SCREEN_COMMON.ACCOUNT.LIST}`)
      GlobalStore.setIsUpdated()
      return
    }
    GlobalStore.setLoading(false)
    init({ message: result.message, color: 'danger' })
  }
  const onBackClick = () => {
    router.push(`${SCREEN_COMMON.ACCOUNT.LIST}`)
  }
</script>

<style lang="scss">
  .form-label {
    padding-top: 5px;
  }
</style>
