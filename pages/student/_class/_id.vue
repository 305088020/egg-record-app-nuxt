<template>
  <div>Component: {{ params }}</div>
</template>

<style scoped></style>

<script>
export default {
  name: 'Id',

  components: {},

  filters: {},

  props: {},

  asyncData({ params }) {
    return {
      params
    }
  },

  data() {
    return {}
  },

  computed: {},

  watch: {},

  mounted() {},

  methods: {}
}
</script>
