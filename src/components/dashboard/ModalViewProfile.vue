<template>
  <va-modal v-model="open" hide-default-actions no-esc-dismiss>
    <div style="width: 600px">
      <div class="c-mt-5 c-mb-18 title-modal">{{ t('client_detail.client_info') }}</div>
      <hr class="underline-title mt-3 mb-3" />
      <div class="c-pb-30">
        <div class="d-flex flex">
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-city" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.company_name') }}
            </div>
            <div class="text-value">{{ client.company_name }}</div>
          </div>
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-circle-user" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.representative_name') }}
            </div>
            <div class="text-value">{{ client.represent_name }}</div>
          </div>
        </div>
      </div>
      <div class="c-pb-30">
        <div class="d-flex flex">
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-location-dot" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.address') }}
            </div>
            <div class="text-value">{{ client.address }}</div>
          </div>
        </div>
      </div>
      <div class="c-pb-30">
        <div class="d-flex flex">
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-envelope" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.email') }}
            </div>
            <div class="text-value">{{ client.email }}</div>
          </div>
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-calendar" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.total_year') }}
            </div>
            <div class="text-value">{{ client.total_year }}月</div>
          </div>
        </div>
      </div>
      <div class="c-pb-30">
        <div class="d-flex flex">
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-hand-holding-dollar" class="va-sidebar-item__icon mr-3" />
              {{ t('client_detail.used_service') }}
            </div>
            <div class="text-value">{{ client.service_name }}</div>
          </div>
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-file-signature" class="va-sidebar-item__icon mr-3" />
              {{ t('client.contract_method') }}
            </div>
            <div v-if="client.contract_method === CONTRACT_METHOD_TYPE.FLAT" class="text-value">Flat</div>
            <div v-else-if="client.contract_method === CONTRACT_METHOD_TYPE.SLIDE" class="text-value">Slide</div>
          </div>
        </div>
      </div>
      <div>
        <div class="d-flex flex">
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-file-contract" class="va-sidebar-item__icon mr-3" />
              {{ t('client_detail.contract_rate') }}
            </div>
            <div v-if="clientDeposit.length > 0" class="contract-content">
              <div class="deposit mb-3">
                <div class="text-value mb-2">{{ t('client_detail.deposit') }}:</div>
                <ul>
                  <li v-for="(item, index) in clientDeposit" :key="index" class="text-value">
                    <div v-if="client.contract_method === CONTRACT_METHOD_TYPE.FLAT">
                      {{ t('client_detail.max_amount') }}: {{ item.contract_rate || 0 }}%
                    </div>
                    <div v-else-if="client.contract_method === CONTRACT_METHOD_TYPE.SLIDE && item.max_amount">
                      {{ t('client_detail.max_amount') }}: {{ formatCurrency.func(item.max_amount) || 0 }} -
                      {{ item.contract_rate || 0 }}%
                    </div>
                    <div v-else>{{ t('client_detail.other_amounts') }}：{{ item.contract_rate }}%</div>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="clientWithdrawal.length > 0" class="contract-content">
              <div class="withdrawal mb-3">
                <div class="text-value mb-2">{{ t('client_detail.withdrow') }}:</div>
                <ul>
                  <li v-for="(item, index) in clientWithdrawal" :key="index" class="text-value">
                    <div v-if="client.contract_method === CONTRACT_METHOD_TYPE.FLAT">
                      {{ t('client_detail.max_amount') }}: {{ item.contract_rate || 0 }}%
                    </div>
                    <div v-else-if="client.contract_method === CONTRACT_METHOD_TYPE.SLIDE && item.max_amount">
                      {{ t('client_detail.max_amount') }}: {{ formatCurrency.func(item.max_amount) || 0 }} -
                      {{ item.contract_rate || 0 }}%
                    </div>
                    <div v-else>{{ t('client_detail.other_amounts') }}：{{ item.contract_rate }}%</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-coins" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.contract_date') }}
            </div>
            <div class="text-value">
              <div v-if="contractDateDeposit.length > 0" class="contract-content">
                <div class="deposit mb-3">
                  <div class="text-value mb-2">{{ t('client_detail.deposit') }}:</div>
                  <ul>
                    <li v-for="(item, index) in contractDateDeposit" :key="index" class="text-value">
                      {{ convertDateToString(item) }}
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="contractDateWithdrawal.length > 0" class="contract-content">
                <div class="deposit mb-3">
                  <div class="text-value mb-2">{{ t('client_detail.withdrow') }}:</div>
                  <ul>
                    <li v-for="(item, index) in contractDateWithdrawal" :key="index" class="text-value">
                      {{ convertDateToString(item) }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr class="underline-title mt-3 mb-3" />
      <div class="c-pb-30">
        <div class="d-flex flex">
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-coins" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.deposit_charge_fee') }}
            </div>
            <div class="text-value">{{ client.charge_fee_memo }}</div>
          </div>
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-coins" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.deposit_charge_fee_rate') }}
            </div>
            <div class="text-value">{{ client.charge_fee_rate }}</div>
          </div>
        </div>
      </div>
      <div class="c-pb-30">
        <div class="d-flex flex">
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-coins" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.settlement_fee') }}
            </div>
            <div class="text-value">{{ client.settlement_fee_memo }}</div>
          </div>
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-coins" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.settlement_fee_rate') }}
            </div>
            <div class="text-value">{{ client.settlement_fee_rate }}</div>
          </div>
        </div>
      </div>
      <div class="c-pb-30">
        <div class="d-flex flex">
          <div class="flex flex-col md6">
            <div :style="{ 'min-width': widthLabel }" class="text-label mb-3">
              <va-icon name="fa-light fa-coins" class="va-sidebar-item__icon mr-3" />
              {{ t('dashboard.transfer_fee_burden') }}
            </div>
            <div v-if="client.is_transfer_fee === TRANSFER_FEE_TYPE.CAN_BE" class="text-value">
              {{ t('dashboard.can_be') }}
            </div>
            <div v-else-if="client.is_transfer_fee === TRANSFER_FEE_TYPE.NONE" class="text-value">
              {{ t('dashboard.none') }}
            </div>
          </div>
        </div>
      </div>
      <div class="gap-2 d-flex-center c-mt-40 c-mb-10">
        <va-button class="button-create c-w-96" @click="closeModal">OK</va-button>
      </div>
    </div>
  </va-modal>
</template>

<script setup lang="ts">
  import { watch } from 'vue'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Client } from '../../types/Client'
  import { CONTRACT_METHOD_TYPE, SERVICE_TYPE, TRANSFER_FEE_TYPE } from '../../common/constants'
  import { convertDateToString, formatCurrency } from '../../common/utils'
  const { t, locale } = useI18n()
  const open = ref<boolean>(false)
  const clientDeposit = ref([] as any[])
  const clientWithdrawal = ref([] as any[])
  const contractDateDeposit = ref([] as any[])
  const contractDateWithdrawal = ref([] as any[])

  const props = defineProps<{
    client: Client
  }>()

  const widthLabel = ref<string>('100px')

  const openModal = () => {
    open.value = true
    handleClientDetails()
  }

  const closeModal = () => {
    open.value = false
  }

  watch(locale, () => {
    if (locale.value === 'gb') {
      widthLabel.value = '140px'
    } else {
      widthLabel.value = '100px'
    }
  })

  const handleClientDetails = async () => {
    clientDeposit.value = []
    clientWithdrawal.value = []

    let client_details = props.client.client_detail
    let { contract_method } = props.client
    if (client_details && client_details.length > 0) {
      if (contract_method === CONTRACT_METHOD_TYPE.FLAT) {
        clientDeposit.value = [...client_details.filter((item) => item.service_type === SERVICE_TYPE.DEPOSIT)]
        clientWithdrawal.value = [...client_details.filter((item) => item.service_type === SERVICE_TYPE.WITHDROW)]
      } else if (contract_method === CONTRACT_METHOD_TYPE.SLIDE) {
        clientDeposit.value = [...client_details.filter((item) => item.service_type === SERVICE_TYPE.DEPOSIT)]
        clientWithdrawal.value = [...client_details.filter((item) => item.service_type === SERVICE_TYPE.WITHDROW)]
      }
    }

    client_details?.forEach((item) => {
      if (item.service_type === SERVICE_TYPE.OTHER) {
        clientDeposit.value.push(item)
        clientWithdrawal.value.push(item)
      }
    })

    contractDateDeposit.value = []
    contractDateWithdrawal.value = []
    client_details?.forEach((item) => {
      if (item['service_type'] === SERVICE_TYPE.DEPOSIT) {
        contractDateDeposit.value.push(item['contract_date'])
      } else if (item['service_type'] === SERVICE_TYPE.WITHDROW) {
        contractDateWithdrawal.value.push(item['contract_date'])
      }
    })
  }

  defineExpose({
    openModal,
    closeModal,
  })
</script>

<style scoped lang="scss">
  .title-modal {
    font-weight: 700;
    color: var(--va-primary);
    font-size: 24px;
  }
  .text-label {
    color: #06152b;
    font-size: 14px;
    margin-right: 14px;
    font-weight: 400;
    line-height: 20px;
  }
  .text-value {
    color: #435564;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }

  .va-sidebar-item__icon {
    color: var(--va-primary);
  }

  hr.underline-title {
    border-top: 1px solid #788b9a;
  }
</style>
