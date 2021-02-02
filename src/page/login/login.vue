<template>
  <div id="login">
    <div class="login_container">
      <div class="contain_logo">
        <img
          src="@/assets/image/index/logo.svg"
          style="height: 40px"
          alt=""
        />
        <i class="" style="color: #00FFFF;"></i>
        <p style="margin-left:10px;font-weight: bold;font-size: 23px;">Kiali</p>
      </div>
      <div class="img">
        <img src="@/assets/image/bg.jpg" alt="" style="width: 100%;">
        <div class="tipMes">版权所有©中科曙光</div>
      </div>
      <div class="login_panel">
        <div style="height: 300px; width: 80%; margin: 0 auto">
          <div class="login_title" style="">欢迎登录</div>
          <el-form
            :model="loginForm"
            status-icon
            class="demo-ruleForm form-box"
            ref="form"
            :rules="rules"
          >
            <el-form-item label="" prop="username">
              <el-input
                prefix-icon="el-icon-user"
                AUTOCOMPLETE="off"
                type="text"
                v-model="loginForm.username"
                auto-complete="off"
                placeholder="请输入登录账号"
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input
                v-if="passwordType"
                prefix-icon="el-icon-lock"
                AUTOCOMPLETE="off"
                type="password"
                v-model="loginForm.password"
                @keyup.enter.native="submitForm"
                auto-complete="off"
                placeholder="请输入登录密码"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                class="subBtn"
                type="primary"
                v-if="!isLogin"
                @click="submitForm"
                >登 录</el-button
              >
              <el-button
                class="subBtn"
                type="primary"
                v-if="isLogin"
                :loading="true"
                >登 录 中</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <canvas id="canvas"></canvas>
  </div>
</template>
<script>
import static_name from '../../../static/all_path'
import Qs from 'qs'
export default {
  components: {},
  data() {
    return {
      passwordType: true,
      smdl: true,
      loginForm: {
        username: '',
        password: '',
        grant_type: 'password'
      },
      isLogin: false,
      rules: {
        username: [
          { required: true, message: '请填写用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请填写密码', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  methods: {
    submitForm() {
      const that = this
      that.$refs['form'].validate(valid => {
        if (valid) {
          that.isLogin = true
          that.$store.dispatch('login', that.loginForm)
            .then(res => {
              if (res.status === 200 && res.data) {
                that.$router.push('/serviceGovernance')
              } else {
                that.$message({
                  type: 'error',
                  message: res.data.status_mes
                })
              }
              that.isLogin = false
            }).catch(err => {
              that.isLogin = false
              if (err.status_code === 0) {
                that.$message({
                  type: 'error',
                  message: err.status_mes
                })
                return
              }
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login_container .el-input__inner {
  border-width: 0 0 1px 0;
  border-color: blue;
  background: rgba(11, 19, 30, 0.5);
  font-size: 14px;
}
#login {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 10;
  justify-content: flex-start;
  .header {
    width: 100%;
    height: 50px;
    background: rgb(30, 175, 197);
    .left {
      color: #fff;
      font-size: 20px;
      width: 70%;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
  .login_container {
    width: 100%;
    height: 100%;
    // height: 700px;
    margin: auto;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 10;
    .contain_logo {
      font-size: 18px;
      color: #fff;
      display:flex;
      flex-direction:row;
      align-items:center;
      position: absolute;
      left: 17px;
      top: 10px;
      z-index: 9;
      i {
        font-size: 20px;
      }
    }
    .img {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
      video {
        position: absolute;
        right: 0;
        bottom: 0;
        min-width: 100%;
        min-height: 100%;
        width: auto;
        height: auto;
        z-index: -9999;
        /*灰色调*/
        /*-webkit-filter:grayscale(100%)*/
      }
      // img{
      //   width: 100%;
      //   height: 100%;
      // }
    }
    .tipMes {
      color: #c5c5c6;
      position: absolute;
      bottom: 30px;
    }
    .login_panel {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 20%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      .login_title {
        color: #e7e7e7;
        text-align: center;
        font-size: 20px;
        margin-bottom: 50px;
      }
    }
  }

  .login-footer {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: 1d202d;
    font-size: 12px;
    color: #fff;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
  }
}
.subBtn {
  width: 100%;
  background: #4490fa;
  color: #fff;
  border: none;
  box-shadow: 0 0 7px #65a6fa;
  margin-top: 30px;
}
#canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
