<template>
  <section class="container is-fluid">
    <b-tabs>
      <b-tab-item label="Table">
        <div class="level-right">
          <!-- <b-button @click="isImageModalActive = true" type="is-primary">新 增</b-button> -->
          <button class="button is-primary is-medium" @click="isComponentModalActive = true">
            Launch component modal
          </button>

          <b-modal :active.sync="isComponentModalActive" has-modal-card trap-focus aria-role="dialog" aria-modal>
            <modal-form v-bind="formProps" />
          </b-modal>
        </div>
        <b-table :data="bank" :columns="columns" :selected.sync="selected" :focusable="false" striped hoverable bordered />
      </b-tab-item>

      <b-tab-item label="Selected">
        <pre>{{ selected }}</pre>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
const ModalForm = {
  props: ['email', 'password'],
  template: `
            <div>ssd</div>
        `
}
export default {
  components: {
    ModalForm
  },
  data() {
    return {
      isComponentModalActive: false,
      formProps: {
        email: 'evan@you.com',
        password: 'testing'
      }
    }
  },
  methods: {
    clickMe() {
      this.$buefy.modal.open({
        parent: this,
        component: ModalForm,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2'
      })
      // this.$buefy.notification.open('Clicked!!')
    },

    async asyncData({ $axios }) {
      const bank = await $axios.$get('http://localhost:7001/bank')
      return {
        bank,
        selected: bank[1],
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
}
</script>
