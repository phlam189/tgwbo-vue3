<template>
    <va-card class="flex">
      <va-card-content class="c-pb-50">
        <div class="title c-mb-36">{{ t('expense.expense_edit_title') }}</div>
        <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('expense.expense_name') }}<span class="mark-required"> *</span></div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.expense_name"/>
            <p v-for="error of v$.expense_name.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('expense.client_id') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-select
            v-model="data.client_id"
            :placeholder="t('placeholder_input_select')"
            :options="selectClientId"
            clearable
            clearable-icon="cancel"
            :no-options-text="`${t('list_no_data')}`"
            :value-by="(selectClientId: any) => selectClientId.value"
            />
          </div>
      </div>
      <!-- <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('expense.account_id') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-select 
            v-model="data.account_id"
            :placeholder="t('placeholder_input_select')"
            :options="selectAccountId"
            clearable
            clearable-icon="cancel"
            :no-options-text="`${t('list_no_data')}`"
            />
          </div>
      </div> -->
      <div class="row va-gutter-1" v-if="selectAccountId">
          <div class="flex md4 lg2 sm6 xs12 form-label">
            <div>{{ t('expense.account_id') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-list-item-label style="color: #262824">
              {{ t('expense.company_name') + ':' + (selectAccountId[0].client_company_name ?? '') }}
            </va-list-item-label>
            <div class="c-mt-10">
              <va-list-item-label v-for="item in selectAccountId" style="color: #262824">
                {{ convertTextDisplayAccountNumber(item.bank_name, item.account_number) }}
              </va-list-item-label>
            </div>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('expense.interest_rate') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.interest_rate" />
            <p v-for="error of v$.interest_rate.$errors" :key="error.$uid">
              <span class="error-msg" style="color: red">{{ error.$message }}</span>
            </p>
          </div>
      </div>
      <div class="row va-gutter-1">
          <div class="flex md4 lg2 sm6 xs12 form-label align-self-center">
            <div>{{ t('expense.memo') }}</div>
          </div>
          <div class="flex lg10 md8 sm6 xs12">
            <va-input v-model="data.memo"/>
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

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, computed, reactive, toRefs, onMounted, watchEffect } from 'vue'
  import { required, helpers, numeric, decimal, maxLength} from '@vuelidate/validators'
  import type { Ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useToast } from 'vuestic-ui'
  import { useGlobalStore } from '../../../stores/global-store'
  import useValidate from '@vuelidate/core'
  import { CommonService } from '../../../services/CommonService'
  import ExpenseService from '../../../services/ExpenseService'
  import { FormUpdateExpense } from '../../../types/Expense'
  import { validateDecimal } from '../../../common/utils'
  import { API } from '../../../services/apis/apis'
  import { SCREEN_COMMON } from '../../../router/router'
  import AccountNumberService from '../../../services/AccountNumberService'

  const { t } = useI18n()
  const service = new CommonService()
  const router = useRouter()
  const { init, close, closeAll } = useToast()
  const GlobalStore = useGlobalStore()
  const route = useRoute()

  const data = reactive(<FormUpdateExpense>{}) 
  const selectClientId: any = ref()
  const selectAccountId: any = ref()

  const rules = computed(() => {
    const Message = (i18nOptions: any, message: string) =>  t(`${message}`, i18nOptions)
    return {
      expense_name: {
        required: helpers.withMessage(() => Message({field: t('expense.expense_name')}, 'message_validate.required'), required),
        maxLength: helpers.withMessage(() => Message({ max: '10' }, 'message_validate.max'), maxLength(10),),
      },
      interest_rate: {
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

  onMounted(async () =>{
    await getListSelectClient()
    getExpenseById()
  })

  watchEffect(() => {
    if(data.client_id) {
      getAccountNumberByClientId(data.client_id)
    } else {
      data.account_id = ''
      selectAccountId.value = null
    }
  })

  const getListSelectClient = async () => {
    try {
      const respone = await service.getListClient()
      selectClientId.value = respone.data.map(item => {
        return {
          text: item.company_name,
          value: item.client_id
        };
      });
    } catch (error) {
      console.log(error)
    }
  }

  // const handleSearch = async (value: any) => {
  //   try {
  //     if(value.length > 3){
  //       var respone = await service.getListAcount(value)
  //       selectAccountId.value = respone.data.map(item => {
  //         return {
  //           text: item.account_number,
  //           value: item.id
  //         };
  //       })
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const getAccountNumberByClientId = async (client_id: any) => {
    try {
      const respone = await AccountNumberService.getAccountNumberByClientId(client_id)
      // selectAccountId.value = respone.data.map((item: any) => {
      //     return {
      //       text: item.account_number,
      //       value: item.id
      //     };
      //   });
      if(respone.data.length > 0) {
        selectAccountId.value = respone.data
      } else {
        selectAccountId.value = null
      }
    } catch(error) {
      console.log(error)
    }
  }

  const convertTextDisplayAccountNumber = (bank: string, number: string) =>{
    let result = `
      ${t('expense.bank_name')}: ${(bank ?? '_')} - 
      ${t('expense.account_number')}: ${(number ?? '_')}`
    return result
  }

  const getExpenseById = async () => {
    try {
      const result = await ExpenseService.getExpenseById(route.params.id)
        .then((res) =>{
          return res.data
        })
      Object.assign(data, result)
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
    data.user_edit_id = Number(GlobalStore.userId)
    const params = {...data}
    const result = await service.update(`${API.MANAGEMENT_COMMON.EXPENSE.UPDATE(params.id)}`, params)
    if (result.status) {
      GlobalStore.setLoading(false)
      router.push(`${SCREEN_COMMON.EXPENSE.LIST}`)
      GlobalStore.setIsUpdated()
      return
    }
    GlobalStore.setLoading(false)
    init({ message: result.message, color: 'danger' })
  }
  const onBackClick = () => {
    router.push(`${SCREEN_COMMON.EXPENSE.LIST}`)
  }
</script>

<style lang="scss" scoped>
  .form-label {
    padding-top: 5px;
  }
</style>
