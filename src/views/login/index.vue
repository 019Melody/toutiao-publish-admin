<template>
  <div class="login-container">
  <el-form class="login-form" ref="login-form" :model="user" :rules="formRules">
  <el-form-item prop="mobile">
    <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
  </el-form-item>
  <el-form-item prop="code">
    <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
  </el-form-item>
  <el-form-item prop="agree">
    <el-checkbox v-model="user.agree">我已阅读并同意协议和隐私条款</el-checkbox>
  </el-form-item>
  <el-form-item>
    <el-button class="login-btn" type="primary" :loading="loginLoading" @click="onLogin">login</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: true // 是否同意协议
      },
      // checked: false,
      loginLoading: false,
      formRules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /\d{6}$/, message: '请输入正确的验证码格式' }
        ],
        agree: [
          { // 自定义校验规则
            // 验证通过：callback（）
            // 验证失败：callback（new Error('错误消息')）
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      // const user = this.user

      // 表单验证
      // validate 方法是异步的
      this.$refs['login-form'].validate((valid) => {
        // 如果表单验证失败，停止请求提交
        if (!valid) {
          return
        }

        // 验证通过，请求登录
        this.login()
      })
    },

    login () {
      // 开启登陆中 loading
      this.loginLoading = true
      login(this.user).then(res => {
        console.log(res)
        // 登陆成功
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        this.loginLoading = false
        // 将接口返回的用户相关数据放到本地存储，方便应用
        // 本地存储只能存储字符串
        // 如果需要存储对象、数组类型的数据，则把他们转为JSON类型字符串进行存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        // 跳转到首页
        this.$router.push({
          name: 'home'
        })
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
