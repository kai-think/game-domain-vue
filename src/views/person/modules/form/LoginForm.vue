<template>
<v-container>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="form.username"
      :counter="10"
      :rules="usernameRules"
      label="用户名"
      required
    ></v-text-field>

    <v-text-field
      v-model="form.password"
      :rules="passwordRules"
      label="密码"
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
        登陆
      </v-btn>
    </div>
  </v-form>
</v-container>
</template>
<script>
export default {
  emits: ["submit"],
  data: () => ({
    valid: false,

    form: {
      username: "",
      password: "",
    },

    usernameRules: [
      v => !!v || '不能为空',
    ],
    passwordRules: [
      v => !!v || '不能为空',
    ],
  }),
  methods: {
    submit() {
      if (this.$refs.form.validate())
        this.$emit("submit", this.form);
    }
  }
}
</script>