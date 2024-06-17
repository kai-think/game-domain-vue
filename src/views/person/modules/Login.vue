<template>
<v-main class="pt-0">
  <v-card class="mt-2">
    <v-tabs
    v-model="tab"
    background-color="indigo"
    centered
    dark
    icons-and-text
  >
    <v-tabs-slider></v-tabs-slider>

    <v-tab href="#tab-1">
      登陆
      <v-icon>mdi-phone</v-icon>
    </v-tab>

    <!-- <v-tab href="#tab-2">
      手机登陆
      <v-icon>mdi-heart</v-icon>
    </v-tab> -->

    <v-tab href="#tab-3">
      注册
      <v-icon>mdi-account-box</v-icon>
    </v-tab>
  </v-tabs>
  <v-tabs-items v-model="tab">
      <v-tab-item value="tab-1">
        <login-form @submit="login"></login-form>
      </v-tab-item>
      <!-- <v-tab-item value="tab-2">
        <phone-login-form @submit="phoneLogin"></phone-login-form>
      </v-tab-item> -->
      <v-tab-item value="tab-3">
        <register-form @submit="register"></register-form>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</v-main>
</template>
<script>
import LoginForm from './form/LoginForm.vue'
import PhoneLoginForm from './form/PhoneLoginForm.vue'
import RegisterForm from './form/RegisterForm.vue'
import loginApi from '@/api/user/loginApi'
import alertData from '@/common/alert.js';
import uploadApi from "@/api/common/uploadApi.js"
export default {
  components: { LoginForm, RegisterForm, PhoneLoginForm },
  data: () => ({
    tab: 0,
  }),
  methods: {
    async uploadAvatar(file) {
      if (file == null)
      {
        this.alert.error("没有选择图片");
        return;
      }
      let formData = new FormData();
      formData.append("file", file)
      let result = await uploadApi.mediumImage(formData)
      this.alert.success("上传头像成功");
      return result;
    },
    login(form) {
      loginApi.login(form)
      .then(res => {
        this.save(res);
        this.alert.success("登陆成功")
      })
      .catch(err => {
        this.alert.error(err)
      })
    },
    async register(form) {
      let avatar = await this.uploadAvatar(form.avatarFile)
      form.bbsUser.avatar = avatar
      loginApi.register({bbsUser: form.bbsUser, userinfo: form.userinfo})
      .then(res => {
        this.save(res);
        this.alert.success("注册成功")
      })
      .catch(err => {
        this.alert.error(err)
      })
    },
    phoneLogin(form) {

    },
    save(user) {
      this.$store.dispatch("login", {user, token: user.etc.Authorization});
    },
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
  },
}
</script>