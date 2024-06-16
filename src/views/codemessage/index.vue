<template>
  <div class="login">
    <div class="main">
      <div class="logoContainer">
        <div class="logo"><img src="~assets/img/logo.png" alt="" /></div>
        <div class="name">cloud-disk</div>
      </div>
      <div class="mainBox" >
            <div class="registeredInput" style="margin-top: 60px">
              <el-form ref="form" :model="login" label-width="80px">
                <el-form-item>
                  <el-input
                      v-model="registered.mobile"
                      placeholder="请输入手机号码"
                  ></el-input>
                </el-form-item>

                <el-form-item class="codeContainer">
                  <el-input
                      v-model="registered.code"
                      placeholder="请输入验证码"
                  ></el-input>
                  <div class="codeButtonContainer">
                    <el-button
                        size="mini"
                        class="getcode"
                        v-if="!isCountDownShow"
                        @click="getCode"
                    >获取验证码</el-button
                    >
                    <div class="countDown" v-else>{{ countDownSecond }} s</div>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="clickRegistered"
                  >登录</el-button
                  >
                  <el-button plain type="text" @click="backtologin" style="margin-left: 60px">回到用户名登录</el-button>
                </el-form-item>
              </el-form>
            </div>

      </div>
    </div>
  </div>
</template>

<script>
// 倒计时名称
let timer;

export default {
  name: "Login",
  data() {
    return {
      login: {
        username:"",
        mobile: "",
        password: "",
      },
      registered: {
        mobile: "",
        password: "",
        code: "",
        nickname: "",
        avatar: null,
      },
      activeName: "first",
      // 倒计时秒数
      countDownSecond: 60,
      // 是否显示秒数
      isCountDownShow: false,
    };
  },
  methods: {
    //   点击登录的回调
    async onSubmit() {
      let res = await this.$request(
          "/educenter/member/login",
          this.login,
          "post",
          "params"
      );
      console.log(res);
      if (res.status == 200 && res.data.success) {
        // 登陆成功
        // 将用户信息保存至vuex
        this.$store.commit("updateUserInfo", res.data.data.mem);

        // 将返回的用户信息保存至localstorage中
        window.localStorage.setItem(
            "userInfo",
            JSON.stringify(res.data.data.mem)
        );

        // 将token存入本地
        window.localStorage.setItem("token", res.data.data.token);

        //   跳转至主界面
        this.$router.push("/index");
      } else if (res.status == 200 && !res.data.success) {
        this.$message.warning("登录失败,账号或密码错误!");
      }
    },
    backtologin(){
      this.$router.push('/login')
    },
    handleClick(e) {
      console.log(e.name);
    },

    handleResetpwd() {
      this.$router.push("/resetpwd")
    },
    codeMessage(){
      this.$router.push('/codemessage')
    },

    // 获取验证码
    async getCode() {
      this.isCountDownShow = true;
      let res = await this.$request(
          `/edumsm/msm/send/${this.registered.mobile}`
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

  },
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
  width: 350px;
  height: 400px;
  /*position: relative;*/
  right: 10vw;
  top: 15vh;
  margin: auto;

}

.mainBox {
  width: 350px;
  background-color: #fff;
  height: 330px;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 60px;


}

.mainBoxRegistered {
  height: 430px;
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
  height: 48px;
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
</style>
