<template>
<v-container class="pt-0">
  <v-card-title>
    个人设置
  </v-card-title>
  <v-tabs vertical v-model="tab" >
      <v-tab v-for="(menu, idx) in menuList" :key="idx">
        <v-icon left>
          {{ menu.icon }}
        </v-icon>
        {{ menu.name }}
      </v-tab>

      <v-tab-item>
        <update-info-form />
      </v-tab-item>

      <v-tab-item>
        <update-password-form />
      </v-tab-item>
    </v-tabs>
</v-container>
</template>
<script>
import UpdatePasswordForm from './modules/info/UpdatePasswordForm.vue'
import UpdateInfoForm from './modules/info/UpdateInfoForm.vue'
export default {
  components: { UpdatePasswordForm, UpdateInfoForm },
  data: () => ({
    tab: 0,
    menuList: [
      {
        name: "基本信息",
        icon: "mdi-account"
      },
      {
        name: "更改密码",
        icon: "mdi-security"
      },
    ],
    
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  methods: {
    
  },
  created() {
    if (!this.isLogin) {
      this.alert.error("请登陆！")
      return;
    }
  }
}
</script>