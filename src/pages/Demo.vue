<template>
  <div>
    <div class="d-flex gap-2">
      <va-button @click="showModalAddData()"> Show modal (ADM_001_5) </va-button>
      <va-button @click="showModalEditAccountUsageFee()"> Show modal (ADM_002 account usage fee) </va-button>
      <va-button @click="showModalAddAccountBalance()"> Show modal (ADM_003 account balance) </va-button>
      <va-button @click="showModalConfirm()"> Show modal (ADM_005) </va-button>
    </div>
    <ModalAddAccountBalance ref="modalAddAccountBalance" @submit="submit" />
    <ModalEditAccountUsageFee ref="modalEditAccountUsageFee" />
    <ModalConfirm ref="modalConfirm" :message="t('introducer.message_comfirm_submit')" />
    <ModalAddData ref="modalAddData" />

    <va-card class="flex" stripe-color="info">
      <va-card-content class="c-pb-50">
        <div class="title c-mb-36">紹介者情報</div>
        <div class="d-flex flex gap-35">
          <div>
            <p class="lable-input">会社名</p>
            <va-input placeholder="テキストを入力" v-model="data.company_name" />
          </div>
          <div>
            <p class="lable-input">契約先</p>
            <va-input placeholder="テキストを入力" v-model="data.address" />
          </div>
        </div>
        <div class="d-flex flex gap-35 c-mt-15">
          <div>
            <p class="lable-input">代表者名</p>
            <va-input placeholder="テキストを入力" v-model="data.address" />
          </div>
          <div>
            <p class="lable-input">契約書の有無</p>
            <va-input placeholder="テキストを入力" v-model="data.address" />
          </div>
        </div>
        <div class="d-flex flex gap-35 c-mt-15">
          <div>
            <p class="lable-input">メールアドレス</p>
            <va-input placeholder="テキストを入力" v-model="data.address" />
          </div>
          <div>
            <p class="lable-input">紹介分類</p>
            <va-select v-model="data.manager" placeholder="Select" :options="listOption" searchable @updateSearch="handleSearch" />
          </div>
        </div>
        <div class="d-flex flex gap-35 c-mt-15">
          <div>
            <p class="lable-input">住所</p>
            <va-input placeholder="テキストを入力" v-model="data.address" />
          </div>
          <div>
            <p class="lable-input">紹介先名</p>
            <va-input placeholder="テキストを入力" v-model="data.address" />
          </div>
        </div>
        <div class="d-flex flex gap-35 c-mt-15">
          <div>
            <p class="lable-input">契約日</p>
            <va-date-input class="w-full" placeholder="yyyy/mm/dd" v-model="data.date" />
          </div>
          <div>
            <p class="lable-input">紹介料率</p>
            <va-input placeholder="テキストを入力" v-model="data.address" />
          </div>
        </div>
        <div class="hr-line c-mt-40"></div>
        <div class="d-flex gap-4 d-flex-end c-mt-25">
          <va-button class="button-cancel">キャンセル</va-button>
          <va-button class="button-create">作成</va-button>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { reactive, ref } from 'vue'
  import ModalAddAccountBalance from '../components/account-balance-management/ModalAdd.vue'
  import ModalEditAccountUsageFee from '../components/account-usage-fee/ModalEdit.vue'
  import ModalConfirm from '../components/modal/ModalConfirm.vue'
  import ModalAddData from '../components/dashboard/ModalAddData.vue'
  const { t } = useI18n()

  const data = reactive({
    id: '',
    company_name: '',
    manager: '',
    email: '',
    address: '',
    invoice_prefix: '',
    date: null,
    open: true,
  })

  const modalAddAccountBalance = ref<InstanceType<typeof ModalAddAccountBalance>>()
  const modalEditAccountUsageFee = ref<InstanceType<typeof ModalEditAccountUsageFee>>()
  const modalConfirm = ref<InstanceType<typeof ModalConfirm>>()
  const modalAddData = ref<InstanceType<typeof ModalAddData>>()

  const showModalAddData = () => {
    modalAddData.value?.openModal()
  }

  const showModalAddAccountBalance = () => {
    modalAddAccountBalance.value?.openModal()
  }

  const showModalEditAccountUsageFee = () => {
    modalEditAccountUsageFee.value?.openModal()
  }

  const showModalConfirm = () => {
    modalConfirm.value?.openModal()
  }

  const submit = (form: object) => {
    console.log(form)
  }

  const handleSearch  = (value: string) => {
    console.log(value)
  }

  const listOption = reactive(['option 1', 'option 2'])
</script>

<style scoped></style>
