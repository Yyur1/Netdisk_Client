<template>
  <div class="resetPassword">
    <div class="container">
      <el-steps :active="active" :space="200" finish-status="success"  align-center>
        <el-step title="验证邮箱" icon="el-icon-edit"></el-step>
        <el-step title="输入验证码" icon="el-icon-s-promotion"></el-step>
        <el-step title="设置新密码" icon="el-icon-key"></el-step>
      </el-steps>
      <div v-if="active === 0" class="common_div">
        <el-form :model="Form"  class="user-container" label-position="left" label-width="60px" size="medium">
          <el-form-item style="float: right; width: 80%" label="邮箱号">
            <el-input type="text" v-model="Form.email" autofocus ref="email" auto-complete="off"
                      placeholder="请输入用来找回密码的邮箱" prefix-icon="el-icon-message" spellcheck="false" :disabled="!isUsername">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active === 1" class="common_div">
        <el-form :model="codeForm"  class="user-container" label-position="left" label-width="60px" size="medium">
          <el-form-item  style="float: right; width: 80%" label="验证码">
            <el-input type="text" v-model="codeForm.code" autofocus ref="code" auto-complete="off"
                      placeholder="请输入邮箱验证码" prefix-icon="el-icon-s-promotion" spellcheck="false">
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="active === 2" class="common_div">
        <el-form :model="passwordForm"  class="user-container" label-position="left" label-width="60px" size="medium">
          <el-form-item  style="float: right; width: 80%" label="新密码">
            <el-input type="password" v-model="passwordForm.password" autofocus ref="password"
                      auto-complete="off" placeholder="请输入新密码" prefix-icon="el-icon-key" >
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="common_div">
        <el-button  @click="next" :disabled="disabled" class="action_button">下一步</el-button>
        <el-button @click="cancel" style="margin-left: 50px">取消</el-button>
      </div>
    </div>
    <p class="login-copyright">© 2021 cloud-disk团队 版权所有</p>
  </div>
</template>

<script>
import { postHeader } from "../../network/request";
export default {
  name: "ResetPassword",

  data() {
    return {
      active: 0,
      Form: {
        username: '',
        email: '',
      },
      codeForm: {
        code: '',
      },
      passwordForm: {
        password: '',
      },
      disabled: false,
      isUsername: false,
    }
  },
  created() {
    let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if (regEmail.test(this.$route.query.username)) {
      console.log("传来了邮箱")
      this.Form.email = this.$route.query.username;
      // this.isUsername = false;
    } else {
      console.log("准备输入邮箱重置密码")
      // // 传来的不是邮箱，那就是用户名
      // console.log("传来了用户名")
      this.Form.username = this.$route.query.username;
      this.isUsername = true;
    }

  },
  methods: {
    isEmail() {
      let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (!regEmail.test(this.Form.email)) {
        this.$message({
          message: '邮箱格式不正确',
          type: 'error'
        });
        return false;
      }
      return true;
    },
    beforePost () {
      if (this.Form.email === '') {
        // 重置密码时，如果邮箱未输入，那么提醒用户输入
          this.$message({
            message: '警告, 邮箱未输入哦',
            type: 'warning'
          });
          this.$refs.email.focus();

      }else {
        this.$message({
          message: '邮箱已输入',
          type: 'success'
        });
        //进行邮箱格式的检测
        this.active++;
        return this.isEmail();
      }
    },
    next() {
      // 当面板为0时，先判断用户名和邮箱是否输入，进行相关的验证
      if (this.active === 0) {
        let isFinished = this.beforePost();
        if (isFinished) {
          //数据输入正确后，将按钮禁掉，并提示相关信息，然后数据发送到后台
          this.$notify.info({
            title: '提示',
            message: '数据正确发送，请耐心等待，勿重复操作！',
            duration: 0,
            offset: 100,
          });
          this.post();

        }
      }
      // 当面板为1时，则到了用户输入验证码的时候, 将验证码传入后台
      if (this.active === 1) {
        // 如果验证码未输入，提示用户
        if (this.codeForm.code === '') {
          this.$notify({
            title: '警告',
            message: '警告, 验证码未输入，请去您邮箱中查看!',
            type: 'warning',
            offset: 100,
          });
          this.$refs.code.focus();
        }else {
          this.disabled= false;
          // 用户输入验证码
          let codemail={
            method:"checkcode",
            body:{
              email :this.Form.email,
              code: this.codeForm.code
            }
          }
          postHeader(codemail,true).
          then(res => {

            if (res.error_num === 0) {
              //验证码输入正确，
              this.active++;
              this.$notify({
                title: '成功',
                message: '验证码匹配正确！',
                type: 'success',
                duration: 0,
                offset: 100,
              });
            }else if (res.error_num === 2) {
              //验证码匹配错误返回对应信息
              this.$message.error("验证码输入错误");
            }else{
              this.$message.error("验证码后端异常");
            }
          }).catch(failResponse => {

          })

        }
      }
      // 当面板为2时，则到了用户输入密码的时候, 将密码传入后台
      if (this.active === 2) {
        //在发送密码之前，先校验一下是否输入了，不能让用户不小心输入了空密码
        if (this.passwordForm.password === '') {
          this.$notify({
            title: '警告',
            message: '警告, 新密码未输入',
            type: 'warning',
            offset: 100,
          });
          this.$refs.password.focus();
        }else {
          let password_md5 = this.$md5(this.passwordForm.password);
          let newpwd={
            method:"resetpassword",
            body:{
              newpass: this.passwordForm.password,
              email: this.Form.email
            }
          }
          postHeader(newpwd,true).
          then(successResponse => {
            console.log(successResponse)
            if (successResponse.error_num=== 0) {
              //密码修改成功
              this.$notify({
                title: '成功',
                message: '该账号密码修改正确！',
                type: 'success',
                duration: 0,
                offset: 100,
              });
              let path = this.$route.query.redirect;
              this.$router.replace({path: path === '/' || path === undefined ? '/login' : path})
            }else if (successResponse.error_num === 1) {
              //修改密码失败，返回对应信息
              this.$message.error("修改密码失败");
            }
          }
          ).catch(failResponse => {
          }
          )
        }
      }
    },
    post(){
      console.log(this.Form.email)
      // 发送邮箱
      let myemaildata={
        method:"forgetpassword",
        body:{
          add: this.Form.email
        }
      }
      postHeader(myemaildata,true)
        .then( res => {
          console.log(res.error_num);
          if (res.error_num === 0) {
            // 如果返回的结果正确，那么需要发送邮件到对应的用户邮箱中，用户自己登录邮箱后找到对应的链接后才可以输入新密码
            this.$notify({
              title: '成功',
              message: 'Success！ 已向'+ this.Form.email + '发送验证码，请在5分钟之内修改密码，否则验证码失效',
              type: 'success',
              duration: 0,
              offset: 100
            });

          }else if (res.error_num === -1) {
            this.$notify({
              title: '失败',
              message: res.error_num + "未知错误！",
              type: 'error',
              duration: 0,
              offset: 100,
            });
            this.disabled = false;
          }
        })
        .catch(failResponse => {
        })
    },
    cancel(){
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.resetPassword{
  background-image: url("../../assets/background_colors/2.jpg");
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}
.container{
  border-radius: 15px;
  background-clip: padding-box;
  margin: 10% auto;
  width: 30%;
  padding: 25px 30px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  opacity: 0.7;
}
.common_div{
  margin-top: 5%;
}
.user-container {
  width: 80%;
  background: #fff;

}
.action_button {
  width: 20%;
  margin-top: 3%;
  text-align: center;
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

