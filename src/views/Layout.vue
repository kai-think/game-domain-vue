<template>
  <v-app id="inspire">
    <v-app-bar app>
      
      

      <div>
        <v-img src="@/assets/logo.png"  height="50px" width="200px" contain />
      </div>

      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-btn icon @click="$router.push('/')">
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <user-view />
    </v-app-bar>


    <!-- 路由视图 -->
    <router-view></router-view>
  </v-app>
</template>
<script>
import gameApi from "@/api/game/gameApi.js"
import LoginForm from './person/modules/form/LoginForm.vue';
import Login from './person/modules/Login.vue';
import UserView from './UserView.vue';
export default {
  components: {
    LoginForm,
    Login,
    UserView
  },
  data: () => ({
    drawer: null,
    logoutDialog: false,
    menuList: [
      {
        name: "首页",
        path: "/",
        icon: "mdi-history"
      },
      {
        name: "个人中心",
        path: "/person",
        icon: "mdi-heart"
      }
    ],
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  watch: {
    
  },
  methods: {
    to(path) {
      this.$router.push(path);
    },
    clickTest() {
      this.showConfirmDialog('test', 'testContent', this.test, this.testNo)
    },
    test() {
      console.log("print test")
    },
    testNo() {
      console.log("print test no")
    }
  },
}
</script>