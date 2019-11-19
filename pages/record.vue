<template>
  <section>
    <button
      class="button field is-danger"
      :disabled="!selected"
      @click="selected = null"
    >
      <b-icon icon="close" />
      <span>Clear selected</span>
    </button>

    <b-tabs>
      <b-tab-item label="Table">
        <b-table
          :data="records"
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
    const records = await $axios.$get('http://localhost:7001/record')
    records.map((element) => {
      element.cardlist =
        element.card.code +
        '-' +
        element.card.person.name +
        '-' +
        element.card.bank.name
    })
    return {
      records,
      selected: records[1],
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: true
        },

        {
          field: 'cardlist',
          label: 'card'
        },
        {
          field: 'record_amount',
          label: '金额'
        },
        {
          field: 'record_handling_fee',
          label: '手续费'
        },
        {
          field: 'record_day',
          label: '刷卡日期'
        },
        {
          field: '已还',
          label: 'is_flag'
        },
        {
          field: 'last_repayment_date',
          label: '最后还款日期'
        },
        {
          field: 'note',
          label: '备注'
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
