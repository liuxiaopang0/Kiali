<template>
  <div id="login">
    
    <!-- <div class="header">
      <div class="left">
        <img src="@/assets/image/police.png" alt="">
      </div>
    </div> -->
    <div class="login_container">
      <div class="contain_logo">
        <i class="iconxuanyuanlogo-04 iconfont" style="color: #00FFFF;"></i> 轩辕大数据
      </div>
      <div class="img">
        <img src="@/assets/image/bg.jpg" alt="">
        <div class="tipMes">
          推荐分辨率为1366*768或者更高。推荐使用Chrome50+、Firefox48+及其以上版本的浏览器。
        </div>
      </div>
      <div class="login_panel">
        <div style="height:300px; width:80%; margin: 0 auto;">
          <div class="login_title" style="">欢迎登录</div>
          <el-form :model="loginForm" status-icon class="demo-ruleForm form-box" ref="form" :rules="rules">
            <el-form-item label="" prop="username">
              <el-input prefix-icon="el-icon-user" AUTOCOMPLETE="off" type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入登录账号"></el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input v-if="passwordType" prefix-icon="el-icon-lock" AUTOCOMPLETE="off" type="password" v-model="loginForm.password" @keyup.enter.native="submitForm" auto-complete="off" placeholder="请输入登录密码" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="subBtn" type="primary" v-if="!isLogin" @click="submitForm">登 录</el-button>
              <el-button class="subBtn" type="primary" v-if="isLogin" :loading="true">登 录 中</el-button>
            </el-form-item>
          </el-form>
        </div>
        
      </div>
    </div>
    <!-- <div class="login-footer">
      Copyright © 2019 乌鲁木齐中科曙光云计算有限公司
    </div> -->
    <canvas id="canvas"></canvas>
  </div>
</template>
<script>
// import {animation} from './star'
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
        password: ''
      },
      isLogin: false,
      rules: {
        username: [
          { required: true, message: '请填写用户名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // var test = require('./star')
      // test.animation()
      // setTimeout(()=>{
      //   // animation()
      // },3000)
      var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,

        hue = 217,
        stars = [],
        count = 0,
        maxStars = 1666 // 星星数量,默认1300
      var canvas2 = document.createElement('canvas'), // 蓝白色星星
        ctx2 = canvas2.getContext('2d')
      canvas2.width = 100
      canvas2.height = 100
      var half = canvas2.width / 2,
        gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
      gradient2.addColorStop(0.025, '#ccc')
      gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)')
      gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)')
      gradient2.addColorStop(1, 'transparent')

      ctx2.fillStyle = gradient2
      ctx2.beginPath()
      ctx2.arc(half, half, half, 0, Math.PI * 2)
      ctx2.fill()

      var canvas3 = document.createElement('canvas'), // 红色星星
        ctx3 = canvas3.getContext('2d')
      canvas3.width = 100
      canvas3.height = 100
      var half = canvas3.width / 2,
        gradient2 = ctx3.createRadialGradient(half, half, 0, half, half, half)
      gradient2.addColorStop(0.025, '#ccc')
      gradient2.addColorStop(0.1, 'hsl(' + 30 + ', 61%, 33%)')
      gradient2.addColorStop(0.25, 'hsl(' + 30 + ', 64%, 6%)')
      gradient2.addColorStop(1, 'transparent')

      ctx3.fillStyle = gradient2
      ctx3.beginPath()
      ctx3.arc(half, half, half, 0, Math.PI * 2)
      ctx3.fill()

      // var canvas3 = document.createElement('canvas'),//红色星星
      // 		ctx3 = canvas3.getContext('2d');
      // canvas3.width = 100;
      // canvas3.height = 100;
      // var half = canvas3.width / 2,
      // gradient2 = ctx3.createRadialGradient(half, half, 0, half, half, half);
      // gradient2.addColorStop(0.025, 'red');
      // gradient2.addColorStop(0.1, 'hsl(' + 360 + ', 61%, 33%)');
      // gradient2.addColorStop(0.25, 'hsl(' + 360 + ', 64%, 6%)');
      // gradient2.addColorStop(1, 'transparent');

      // ctx3.fillStyle = gradient2;
      // ctx3.beginPath();
      // ctx3.arc(half, half, half, 0, Math.PI * 2);
      // ctx3.fill();
      // End cache
      function random(min, max) {
		 if (arguments.length < 2) {
		  max = min
		  min = 0
		 }

		 if (min > max) {
		  var hold = max
		  max = min
		  min = hold
		 }

		 return Math.floor(Math.random() * (max - min + 1)) + min
      }

      function maxOrbit(x, y) {
		 var max = Math.max(x, y),
		 diameter = Math.round(Math.sqrt(max * max + max * max))
		 return diameter / 2
		 // 星星移动范围，值越大范围越小，
      }

      var Star = function() {
		 this.orbitRadius = random(maxOrbit(w, h))
		 this.radius = random(60, this.orbitRadius) / 25 // 星星大小,值越大星星越小,默认8

		 this.orbitX = w / 2
		 this.orbitY = h / 2
		 this.timePassed = random(0, maxStars)
		 this.speed = random(this.orbitRadius) / 1000000 // 星星移动速度,值越大越慢,默认5W

		 this.alpha = random(2, 10) / 10
		 var arr = [canvas2, canvas3]
		 var index = Math.floor(Math.random() * 2)
		 this.canvas = arr[index]
		 count++
		 stars[count] = this
      }

      Star.prototype.draw = function() {
		 var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
		 y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
		 twinkle = random(10)

		 if (twinkle === 1 && this.alpha > 0) {
		  this.alpha -= 0.05
		 } else if (twinkle === 2 && this.alpha < 1) {
		  this.alpha += 0.05
		 }

		 ctx.globalAlpha = this.alpha
		 ctx.drawImage(this.canvas, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius)
        this.timePassed += this.speed
      }

      for (var i = 0; i < maxStars; i++) {
		 new Star()
      }

      const animation = function() {
		 ctx.globalCompositeOperation = 'source-over'
		 ctx.globalAlpha = 0.5 // 尾巴
		 ctx.fillStyle = '#112032'
		 ctx.fillRect(0, 0, w, h)

		 ctx.globalCompositeOperation = 'lighter'
		 for (var i = 1,
		 l = stars.length; i < l; i++) {
		  stars[i].draw()
		 }

		 window.requestAnimationFrame(animation)
      }
		 animation()
    })
  },
  methods: {
    submitForm() {
      const that = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.isLogin = true
          this.$store.dispatch('login', this.loginForm).then((data) => {
            this.isLogin = false
            this.$handle_http_back(data, true, false).then((res) => {
              if (this.$route.query.app) {
                var api_header = JSON.parse(localStorage.getItem('api_header'))
                if (this.$route.query.workspaceId) {
                  api_header.workspaceId = this.$route.query.workspaceId
                }
                var path_name = this.$route.query.app
                var path = static_name.all_path.filter((item) => item.name === path_name)[0].path + '?' + Qs.stringify(api_header) + '&app=' + path_name
                window.open(path, '_self')
              } else {
                this.$router.push('/HomeIndex')
              }
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login_container .el-input__inner{
  border-width: 0 0 1px 0;
  border-color: #9A9A9A;
  background:rgba(11,19,30,.5);
  font-size: 14px;
}
</style>
<style lang="scss" scoped>
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
    .contain_logo{
        font-size:18px; 
        color:#fff;
        position: absolute;
        left: 35px;
        top: 35px;
        i{
          font-size:20px
        }
    }
    .img {
      width:70%;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 65%;
      }
    }
    .tipMes{
      color:#c5c5c6; 
      position: absolute; 
      bottom:30px;
    }
    .login_panel{
        position:absolute;
        top:0;
        right:0;
        bottom:0;
        width:30%; 
        background:rgba(11,19,30,.5);
        display: flex;
        align-items: center;
        .login_title{
          color:#E7E7E7; 
          text-align:center; 
          font-size:20px; 
          margin-bottom:50px;
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
  background: #4490FA;
  color: #fff;
  border: none;
  box-shadow: 0 0 7px #65A6FA;
  margin-top:30px;
}
#canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
