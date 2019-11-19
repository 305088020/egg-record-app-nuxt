<template>
  <section>
    <button
      :disabled="!selected"
      @click="selected = null"
      class="button field is-danger"
    >
      <b-icon icon="close" />
      <span>Clear selected</span>
    </button>

    <b-tabs>
      <b-tab-item label="Table">
        <b-table
          :data="cards"
          :columns="columns"
          :selected.sync="selected"
          focusable
        />
      </b-tab-item>

      <b-tab-item label="Selected">
        <pre>{{ selected }}</pre>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const cards = await $axios.$get('http://localhost:7001/card')

    return {
      cards,
      selected: cards[1],
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: true
        },
        {
          field: 'person.name',
          label: '用户'
        },

        {
          field: 'bank.name',
          label: 'Bank'
        },
        {
          field: 'code',
          label: '卡号'
        },
        {
          field: 'password',
          label: '密码'
        },
        {
          field: 'quota',
          label: '额度'
        },
        {
          field: 'amount',
          label: '可用额度'
        },
        {
          field: 'interest',
          label: '费率'
        },
        {
          field: 'billing_day',
          label: '账单日'
        },
        {
          field: 'repayment_day',
          label: '还款日'
        },
        {
          field: 'created_at',
          label: '创建时间'
        }
      ]
    }
  }
}
</script>
