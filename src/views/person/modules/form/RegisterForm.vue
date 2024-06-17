<template>
<v-container>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <image-input v-model="avatarFile" :width="200" :height="200">
      <template #overlay>
        <v-icon large>mdi-tray-arrow-up</v-icon>
        上传头像
      </template>
    </image-input>
    
    <v-text-field
      v-model="bbsUser.username"
      :counter="10"
      :rules="[rules.required]"
      label="用户名"
      required
    ></v-text-field>

    <v-text-field
      v-model="userinfo.password"
      :rules="[rules.required]"
      label="密码"
      type="password"
      required
    ></v-text-field>

    <v-text-field
      v-model="password2"
      :rules="[rules.required]"
      label="重复密码"
      type="password"
      required
    ></v-text-field>

    <v-text-field
      v-model="bbsUser.nickname"
      :rules="[rules.required]"
      label="昵称"
      required
    ></v-text-field>

    <v-text-field
      v-model="userinfo.email"
      :rules="[rules.required]"
      label="邮箱"
      required
    ></v-text-field>

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="submit"
    >
      注册
    </v-btn>
  </v-form>
</v-container>
</template>
<script>
import uploadApi from "@/api/common/uploadApi.js"
import validateUtil from "@/common/validateUtil.js"
import ImageInput from '../../../../components/ImageInput.vue';
export default {
  components: { ImageInput },
  emits: ["submit"],
  data: () => ({
    valid: false,
    
    bbsUser: {
      username: null, 
      nickname: null, 
      avatar: null
    },
    userinfo: {
      password: null, 
      email: null, 
      phone: null, 
      address: null, 
      homepage: null
    },
    password2: null,
    rules: {
      ...validateUtil.vRules
    },
    avatarFile: {},
  }),
  methods: {
    submit() {
      if (this.$refs.form.validate())
        this.$emit("submit", {bbsUser: this.bbsUser, userinfo: this.userinfo, avatarFile: this.avatarFile});
    }
  }
}
</script>