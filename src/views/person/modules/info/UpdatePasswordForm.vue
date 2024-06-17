<template>
<v-container>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="form.oldPassword"
      :counter="20"
      :rules="passwordRules"
      label="旧密码"
      type="password"
      required
    ></v-text-field>

    <v-text-field
      v-model="form.password1"
      :rules="passwordRules"
      :counter="20"
      label="新密码"
      type="password"
      required
    ></v-text-field>

    <v-text-field
      v-model="form.password2"
      :rules="password2Rules"
      :counter="20"
      label="重复密码"
      type="password"
      required
    ></v-text-field>
    <div>
      <v-btn
        :disabled="!valid"
        color="success"
        class="ml-auto"
        @click="submit"
      >
        保存
      </v-btn>
    </div>
  </v-form>
</v-container>
</template>
<script>
import userApi from "@/api/user/userApi"
export default {
  data: () => ({
    valid: false,

    form: {
      oldPassword: "",
      password1: "",
      password2: "",
    },

    passwordRules: [
      v => !!v || '不能为空',
    ],

    password2Rules: [],

    loading: false,
  }),
  computed: {
    user() {
      let u = this.$store.state.user
      return u ? u : {}
    },
    userinfo() {
      return this.user.etc.info;
    }
  },
  methods: {
    submit() {
      if (!this.$refs.form.validate())
      {
        this.alert.error("验证失败");
        return;
      }

      userApi.updatePassword(this.form.oldPassword, this.form.password1)
      .then(res => {
        this.alert.success("修改成功");
        this.alert.success("请重新登陆");
        this.$store.dispatch("logout")
        this.clear()
      })
      .catch(err => {
        this.alert.error(err)
      })
    },
    clear() {
      this.form.oldPassword = this.form.password1 = this.form.password2 = ""
    }
  },
  created() {
    this.password2Rules = [
      v => !!v || '不能为空',
      v => v === this.form.password1 || "密码不一致",
    ]
  }
}
</script>