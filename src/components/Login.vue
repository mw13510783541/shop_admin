<template>
  <div class="login">
    <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img src="../assets/avatar.jpg" alt srcset />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" type="password" @keyup.enter.native='submitForm' v-model="form.password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入axios
// import axios from 'axios'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },

      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 3 到 5 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // onSubmit () {
    //   console.log('submit!')
    // },
    resetForm() {
      this.$refs.form.resetFields()
    },
    submitForm (form) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 提交表单
          let res = await this.axios({
            url: 'login',
            method: 'post',
            data: this.form
          })
          console.log(res.data)
          if (res.data.meta.status === 200) {
            // 登陆成功，跳转到首页
            //  console.log('登陆成功');
            this.$message({
              message: '登陆成功',
              type: 'success',
              duration: 1000
            })
            // 浏览器储存token
            // console.log(res.data.data.token)
            localStorage.setItem('token', res.data.data.token)
            // 跳转首页
            this.$router.push('/home')
          } else {
            // 登陆失败
            this.$message.error('登陆失败')
            // console.log("登陆失败")
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style  lang='less'>
.login {
  background-color: #545c64;
  height: 100%;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 200px auto;
    background-color: #fff;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button:last-child {
      margin-left: 100px;
    }
  }
}
</style>
