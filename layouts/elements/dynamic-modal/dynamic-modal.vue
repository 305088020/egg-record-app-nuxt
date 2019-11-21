<template>
  <Modal v-model="showModal" transfer width="240" @on-visible-change="handleChange">
    <p slot="header">
      输入动态路由参数
    </p>
    <Form ref="form" :model="params">
      <FormItem
        v-for="(key, index) in keys"
        :key="index"
        :prop="key"
        :rules="{ required: true, message: key + '不能为空', trigger: 'blur' }"
        :label-width="60"
        :label="key"
      >
        <Input v-model="params[key]"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" size="large" long @click="handleSubmit">
        跳转
      </Button>
    </div>
  </Modal>
</template>

<style scoped></style>

<script>
export default {
  name: 'DynamicModal',

  components: {},

  filters: {},

  props: {
    value: Boolean,
    keys: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {
      params: {},
      showModal: false
    }
  },

  computed: {},

  watch: {
    value(nv) {
      this.showModal = nv
    }
  },

  mounted() {
    this.showModal = this.value
  },

  methods: {
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('on-ok', this.params)
          this.showModal = false
        }
      })
    },
    handleChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>
