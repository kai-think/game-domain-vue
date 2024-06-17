<template>
<v-card flat>
  <v-card-title>个人资料</v-card-title>
  <v-card-text>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <image-input v-model="avatarFile" :width="300" :height="200" :initSrc="form.avatar"/>

      <v-text-field
        v-model="form.nickname"
        :counter="10"
        label="昵称"
        :rules="rules"
      ></v-text-field>

      <v-select
        v-model="form.sex"
        :items="sexdic.children"
        item-text="name"
        item-value="value"
        required
        label="性别"
        :rules="rules"
      ></v-select>

      <v-text-field
        v-model="formInfo.email"
        :counter="20"
        label="邮箱"
      ></v-text-field>

      <v-text-field
        v-model="formInfo.phone"
        :counter="15"
        label="手机"
      ></v-text-field>

      <v-btn
        :disabled="!valid || loading"
        color="success"
        class="mr-4"
        @click="updateInfo"
      >
        保存
      </v-btn>
    </v-form>
  </v-card-text>
</v-card>
</template>
<script>
import ImageInput from "@/components/ImageInput.vue"
import uploadApi from "@/api/common/uploadApi"
import userApi from "@/api/user/userApi"
export default {
  components: { ImageInput },
  data: () => ({
    valid: false,

    form: {
      nickname: "",
      sex: 2,
      avatar: "",
    },

    formInfo: {
      email: "",
      phone: ""
    },

    rules: [
      v => !!v || '不能为空',
    ],
    avatarFile: null,

    sexdic: {children: []},

    loading: false,
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    user() {
      let u = this.$store.state.user
      return u ? u : {}
    },
    userinfo() {
      return this.user.etc.info;
    }
  },
  watch: {
    isLogin(newVal) {
      if (newVal) 
        this.initForm()
      else
        this.clear()
    }
  },
  methods: {
    async updateInfo() {
      if (!this.$refs.form.validate())
      {
        this.alert.error("验证失败");
        return;
      }

      this.loading = true;

      if (this.avatarFile) {
        let form = new FormData();
        form.append("file", this.avatarFile)
        let avatar = await uploadApi.mediumImage(form);
        console.log("updated avatar", avatar)
        this.form.avatar = avatar;
      }

      userApi.update(this.form, this.formInfo)
      .then(res => {
        this.alert.success("更新成功")
        console.log("res", res)
        this.$store.dispatch("login", {user: res, token: res.etc.Authorization})
        // location.reload();

        this.loading = false;
      })
      .catch(err => {
        this.alert.error(err)

        this.loading = false;
      })
    },
    initForm() {
      let form = this.form;
      let user = this.user
      form.nickname = user.nickname;
      form.sex = user.sex
      form.avatar = user.avatar

      this.formInfo.email = this.userinfo.email;
      this.formInfo.phone = this.userinfo.phone;
    },
    clear() {
      this.form = {
        nickname: "",
        sex: 2,
        avatar: "",
      }

      this.formInfo = {
        email: "",
        phone: ""
      }
    }
  },
  created() {
    this.getDic("性别")
    .then(res => {
      console.log("sexdic", res)
      this.sexdic = res;
    })

    if (this.isLogin) {
      this.initForm()
    }
  }
}
</script>