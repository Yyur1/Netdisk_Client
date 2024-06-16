
<template>
  <div class="login">

    <div class="main">
      <div class="logoContainer">
        <div class="logo"><img src="~assets/img/logo.png" alt="" /></div>
        <div class="name">cloud-disk</div>
      </div>
      <div class="mainBox" :class="activeName == 'first' ? '' : 'mainBoxRegistered'">
        <el-tabs
            v-model="activeName"
            type="card"
            @tab-click="handleClick"
            stretch
        >
          <!--          用户名密码登录界面-->
          <el-tab-pane label="Login" name="first">
            <div class="loginInput">
              <el-form ref="form" :model="login" label-width="80px">
                <el-form-item >
                  <el-input
                      v-model="login.username"
                      placeholder="请输入用户名"
                      prefix-icon="el-icon-user"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                      v-model="login.password"
                      type="password"
                      placeholder="请输入密码"
                      prefix-icon="el-icon-lock"
                  ></el-input>
                </el-form-item>

                <!--                <el-form-item>-->
                <!--                  <el-button type="text" @click="test" >测试</el-button>-->
                <!--                </el-form-item>-->
                <el-form-item>
                  <el-button type="primary" @click="loginbtn">登录</el-button>
                  <el-button round class="forgetpwd" type="" @click="handleResetpwd" style="margin-left: 20px;margin-top: 0px" >
                    forget your password?
                  </el-button>
                </el-form-item>
<!--                <el-form-item>-->
<!--                  <el-button type="text" @click="codeMessage" >使用短信验证码登录</el-button>-->
<!--                </el-form-item>-->
              </el-form>
            </div>
          </el-tab-pane>

          <!--          注册界面-->
          <el-tab-pane label="Register" name="second" >
            <div class="registeredInput" >
              <el-form ref="form" :model="registered" label-width="80px" :rules="rules">
                <el-form-item  prop="mobile">
                  <el-input
                      v-model="registered.mobile"
                      placeholder="请输入手机号"
                  ></el-input>
                </el-form-item>
                <el-form-item   prop="username" >
                  <el-input
                      v-model="registered.username"
                      placeholder="请输入昵称"
                  ></el-input>
                </el-form-item>
                <el-form-item   prop="pwd" >
                  <el-input
                      v-model="registered.pwd"
                      placeholder="请输入密码"
                      type="password"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="confirmpwd">
                  <el-input
                      v-model="registered.confirmpwd"
                      placeholder="请确认密码"
                      type="password"
                  ></el-input>
                </el-form-item>
                <el-form-item  prop="email" >
                  <el-input
                      v-model="registered.email"
                      placeholder="请输入邮箱"
                  ></el-input>
                </el-form-item>

                <el-form-item  prop="code" class="codeContainer">
                  <el-input
                      v-model="registered.code"
                      placeholder="请输入邮箱验证码"
                  ></el-input>

                  <div class="codeButtonContainer">
                    <el-button
                        round
                        size="mini"
                        class="getcode"
                        v-if="!isCountDownShow"
                        :loading="codeLoading"
                        :disabled="isDisable"
                        v-model="registered.getemailcode"
                        @click="getcode"
                    >获取验证码</el-button
                    >
                    <span class="status">{{ statusMsg }}</span>
                    <!--                    <div class="countDown" v-else>{{ countDownSecond }} s</div>-->
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="clickRegistered()"
                  >注册</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <p class="login-copyright">© 2021 cloud-disk团队 版权所有</p>
  </div>
</template>

<script>
// 倒计时名称
let timer;
// import { getEmailCode } from '../../api/api.js'
import { postHeader } from "../../network/request";


export default {
  name: "Login",
  data() {
    return {
      statusMsg: '',
      codeLoading:false,
      isDisable:false,
      login: {
        username:"",
        password: "",
      },
      registered: {
        mobile: "",
        pwd: "",
        code: "",
        username: "",
        avatar: null,
        email: "",
        confirmpwd:"",
        getemailcode:""
      },
      activeName: "first",
      // 倒计时秒数
      countDownSecond: 60,
      // 是否显示秒数
      isCountDownShow: false,

      rules:{
        mobile:[
          {
            required: true,
            type: 'string',
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern:/^1[34578]\d{9}$/,
          }
        ],
        username: [
          {
            required: true,
            type: 'string',
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        email: [{
          required: true,
          type: 'email',
          message: '请输入邮箱',
          trigger: 'blur'
        },
          {
            pattern:/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/,
          }],
        pwd: [{
          required: true,
          message: '创建密码',
          trigger: 'blur'
        },
          {
            pattern: /^.*(?=.{6,20})(?=.*\d)(?=.*[A-Z]{1,})(?=.*[a-z]{1,})(?=.*[!@#$%^&*?\(\)]).*$/,
            message: '密码6-20位，必须包含大写字母，小写字母，数字及特殊字符'
          }],

        confirmpwd: [{
          required: true,
          message: '确认密码',
          trigger: 'blur'
        }, {
          validator: (rules, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.registered.pwd) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]

      }
    };
  },
  layout: 'blank',
  methods: {
    // 注册接口
    clickRegistered() {
      let registerdata = {
        method: 'register',
        body: {
          username: this.registered.username,
          password: this.registered.pwd,
          phone: this.registered.mobile,
          email: this.registered.email,
          codemsg: this.registered.code,
        }
      }
      postHeader(registerdata, true).then(
          res => {
            this.$notify.info({
              title: '提示',
              message: '注册成功！',
              duration: 0,
              offset: 100,
            })
            console.log(res)
            console.log(res.msg)
          }
      )

    },

    loginbtn(){
      let logindata = {
        method: 'login',
        body: {
          username:this.login.username,
          password:this.login.password,
        }
      }
      postHeader(logindata, true).then(
          res => {
            console.log(res.error_num);
            //
            if(res.error_num === 0){
              console.log('登录成功'),
                  this.$notify.info(
                      {
                        title: '提示',
                        message: '登录成功！',
                        duration: 0,
                        offset: 100,
                      }
                  ),
              //     this.$store.commit("updateUserInfo", res);
              //
              // // 将返回的用户信息保存至localstorage中
              // window.localStorage.setItem(
              //     "userInfo",
              //     JSON.stringify(res)
              // );
              //
              // // 将token存入本地
              // window.localStorage.setItem("token", res.error_num);
              this.$router.push('/index')
            }else if(res.error_num === 1){

              console.log('登录失败'),
                  this.$notify.info(
                      {
                        title: '提示',
                        message: '密码错误，请重新登录！',
                        duration: 0,
                        offset: 100,
                      }
                  ),
                  this.$router.push('/')
            }
          }
      )


    },

    // 获取验证码
    getcode() {
      let emaildata = {
        method: 'getcodemsg',
        body: {
          add:this.registered.email
        }
      }
      postHeader(emaildata, true).then(
          res => {
            this.$notify.info({
              title: '提示',
              message: '验证码已发送,请耐心等待，勿重复操作！',
              duration: 0,
              offset: 100,
            }),
                console.log(res),
                console.log(res.msg)
          }
      )

    },

    //   点击登录的回调
    //  onSubmit() {
    //   let res = this.$request(
    //       "/educenter/member/login",
    //       this.login,
    //       "post",
    //       "params"
    //   );
    //   console.log(res);
    //   if (res.status == 200 && res.data.success) {
    //     // 登陆成功
    //     // 将用户信息保存至vuex
    //     this.$store.commit("updateUserInfo", res.data.data.mem);
    //
    //     // 将返回的用户信息保存至localstorage中
    //     window.localStorage.setItem(
    //         "userInfo",
    //         JSON.stringify(res.data.data.mem)
    //     );
    //
    //     // 将token存入本地
    //     window.localStorage.setItem("token", res.data.data.token);
    //
    //     //   跳转至主界面
    //     this.$router.push("/index");
    //   } else if (res.status == 200 && !res.data.success) {
    //     this.$message.warning("登录失败,账号或密码错误!");
    //   }
    // },

    handleClick(e) {
      console.log(e.name);
    },

    handleResetpwd() {
      this.$router.push("/resetpwd")
    },
    codeMessage() {
      this.$router.push('/codemessage')
    },

    //获取邮箱验证码（暂不用）
    sendMsg() {
      const self = this
      let namePass
      let emailPass
      let timerid
      console.log(timerid)
      if (timerid) {
        return false
      }
      this.$refs['registered'].validateField('username', (valid) => {
        namePass = valid
      })
      self.statusMsg = ''
      if (namePass) {
        return false
      }
      this.$refs['registered'].validateField('email', (valid) => {
        emailPass = valid
      })

      // 向后台API验证码发送
      if (!namePass && !emailPass) {
        self.codeLoading = true
        self.statusMsg = '验证码发送中...'
        getEmailCode(self.registered.email).then(res => {
          this.$message({
            showClose: true,
            message: '发送成功，验证码有效期5分钟',
            type: 'success'
          })
          let count = 60
          self.registered.code = ''
          self.codeLoading = false
          self.isDisable = true
          self.statusMsg = `验证码已发送,${count--}秒后重新发送`
          timerid = window.setInterval(function () {
            self.statusMsg = `验证码已发送,${count--}秒后重新发送`
            if (count <= 0) {
              console.log('clear' + timerid)
              window.clearInterval(timerid)
              self.isDisable = false
              self.statusMsg = ''
            }
          }, 1000)
        }).catch(err => {
          this.isDisable = false
          this.statusMsg = ''
          this.codeLoading = false
          console.log(err.response.data.message)
        })
      }
    },


    // 获取验证码
    async getCode() {
      this.isCountDownShow = true;
      let res = await this.$request(
          `/edumsm/msm/send/${this.registered.email}`
      );
      console.log(res);
      if (res.data.success) {
        this.startCountDown();
      }
    },

    // 倒计时
    startCountDown() {
      this.countDownSecond = 60;
      timer = setInterval(() => {
        this.countDownSecond--;
        if (this.countDownSecond == 0) {
          clearInterval(timer);
          this.isCountDownShow = false;
        }
      }, 1000);
    },

    // 点击注册的回调
    // async clickRegistered() {
    //   let res = await this.$request(
    //     "/educenter/member/register",
    //     this.registered,
    //     "post",
    //     "params"
    //   );
    //   console.log(res);
    //   // 如果注册成功，清空所有数据并跳转至登录界面，自动填写手机号码
    //   if (res.data.success) {
    //     this.$message.success("注册成功!");
    //     this.login.email = this.registered.email;
    //     this.activeName = "first";
    //     this.registered = {
    //       email: "",
    //       mobile: "",
    //       password: "",
    //       code: "",
    //       nickname: "",
    //       avatar: null,
    //     };
    //   } else {
    //     this.$message.error("注册失败,请稍后重试!");
    //   }
  }


};
</script>

<style scoped>
.login {
  background-color: #ecefff;
  height: 100vh;
  background-image: url("../../assets/background_colors/2.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  margin: auto;
}

.logoContainer {
  display: flex;
  align-items: center;
  margin: auto;
  justify-content: center;
}

.logo {
  width: 50px;
}

.logo img {
  width: 100%;
}

.name {
  color: #25262b;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: bold;
  margin-left: 7px;
}

.main {
  width: 380px;
  height: 400px;
  right: 10vw;
  top: 15vh;
  margin: auto;

}

.mainBox {
  width: 380px;
  background-color: #fff;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 40px;


}

.mainBoxRegistered {
  height: 500px;
  width: 400px;
}

.el-form /deep/ .el-form-item__content {
  margin: 0 !important;
  padding: 0 20px;
}

.el-input /deep/ input {
  border-radius: 10px;
}

.loginInput {
  margin-top: 20px;
}

.el-tabs /deep/ .is-active,
.el-tabs /deep/ div:hover {
  color: #595bb3;
}

.el-tabs /deep/ .is-active {
  background-color: #fff;
}

.el-tabs /deep/ .el-tabs__item {
  border: none !important;
  font-size: 18px;
  height: 50px;
  line-height: 50px;
}

.el-tabs /deep/ .el-tabs__nav {
  border: none;
}

.el-tabs /deep/ .el-tabs__nav-scroll {
  background-color: #f5f5f6;
}

.el-input /deep/ .el-input__inner {
  height: 40px;
  font-size: 15px;
}


.codeContainer {
  position: relative;
}

.codeButtonContainer {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
}

.getcode {
  background-color: #6c6dbb;
  color: white;
  height: 35px;
  margin: 0;
}

.countDown {
  color: rgb(141, 141, 141);
}

.login-copyright {
  color: #eee;
  text-align: center;
  position: relative;
  z-index: 1;
}
@media screen and (min-height: 550px) {
  .login-copyright {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
  }
}

</style>
