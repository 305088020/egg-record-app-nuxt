<template>
  <section>
    <button :disabled="!selected" class="button field is-danger" @click="selected = null">
      <b-icon icon="close" />
      <span>Clear selected</span>
    </button>

    <b-tabs>
      <b-tab-item label="Table">
        <b-table :data="person" :columns="columns" :selected.sync="selected" focusable />
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
    const person = await $axios.$get('http://localhost:7001/person')

    return {
      person,
      selected: person[1],
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: true
        },
        {
          field: 'name',
          label: 'Name'
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
