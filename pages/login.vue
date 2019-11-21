<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <LoginForm @on-success-valid="handleSubmit"></LoginForm>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<style lang="less">
@import '../assets/login.less';
</style>

<script>
import { mapActions } from 'vuex'
import LoginForm from '../components/login-form'

export default {
  name: 'Login',

  layout: 'normal',

  components: {
    LoginForm
  },

  filters: {},

  props: {},

  data() {
    return {}
  },

  computed: {},

  watch: {},

  mounted() {},

  methods: {
    ...mapActions({
      handleLogin: 'user/handleLogin',
      getUserInfo: 'user/getUserInfo'
    }),

    async handleSubmit({ username, password }) {
      await this.handleLogin({ username, password })
      await this.getUserInfo()
      this.$router.push({
        path: this.$config.homePath
      })
    }
  }
}
</script>
