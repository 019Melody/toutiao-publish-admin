<template>
  <div class="login-container">
  <el-form class="login-form" ref="form" :model="user">
  <el-form-item>
    <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
  </el-form-item>
  <el-form-item>
    <el-input v-model="user.code" placeholder="请输入密码"></el-input>
  </el-form-item>
  <el-form-item>
    <el-checkbox v-model="checked">我已阅读并同意协议和隐私条款</el-checkbox>
  </el-form-item>
  <el-form-item>
    <el-button class="login-btn" type="primary" :loading="loginLoading" @click="onLogin">login</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      checked: false,
      loginLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      const user = this.user

      // 验证通过，提交登录
      this.loginLoading = true
      request({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        // data用来设置POST请求体
        data: user
      }).then(res => {
        console.log(res)
        // 登陆成功
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        this.loginLoading = false
      }).catch(err => {
        console.log('登录失败', err)
        this.$message.error('登录失败，手机号或验证码错误')
        this.loginLoading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-form {
  background-color: #fff ;
  padding: 50px;
  min-width: 300px;
}
.login-btn {
  width: 100%;
}
</style>
