<template>
<div>
  <div v-if="isLogin">
    <v-row align="center">
      <simple-avatar :width="42" :height="42" :src="user.avatar"></simple-avatar>
      <div class="ml-2">
        {{ $store.state.user.nickname }}
      </div>

      <v-menu offset-y>
        <template #activator="{attrs, on}">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>

        <v-list class="py-3">
          <v-list-item link to="/personinfo">
            <v-list-item-icon class="mr-3">
              <v-icon>mdi-note</v-icon>
            </v-list-item-icon>
            <v-list-item-title>个人资料</v-list-item-title>
          </v-list-item>
          <v-list-item link :to="`/person/${user.id}/draft`">
            <v-list-item-icon class="mr-3">
              <v-icon>mdi-grease-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-title>草稿箱</v-list-item-title>
          </v-list-item>
          <v-list-item link :to="`/person/${user.id}/circle`">
            <v-list-item-icon class="mr-3">
              <v-icon>mdi-note</v-icon>
            </v-list-item-icon>
            <v-list-item-title>我的帖子</v-list-item-title>
          </v-list-item>
          <v-list-item link :to="`/person/${user.id}/follow`">
            <v-list-item-icon class="mr-3">
              <v-icon>mdi-star</v-icon>
            </v-list-item-icon>
            <v-list-item-title>我的收藏</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- 显示通知 -->
      <v-btn icon @click="$store.commit('showNotification', !$store.state.showNotification)">
        <v-icon color="green">mdi-email</v-icon>
      </v-btn>

      <v-dialog v-model="logoutDialog" max-width="400px">
        <template #activator="{on, attrs}">
          <v-btn icon v-on="on" v-bind="attrs">
            <v-icon>mdi-export</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-title>确定退出登陆？</v-card-title>
          <v-card-actions>
            <v-btn color="primary" text @click="$store.dispatch('logout'); logoutDialog = false;" class="ml-auto">确定</v-btn>
            <v-btn color="error" text @click="logoutDialog = false">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    
  </div>
  <div v-else>
    
    <v-avatar size="36px"><v-img :src="'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimages.669pic.com%2Felement_pic%2F6%2F84%2F58%2F74%2Ffb86f2dc61c757a8a0ab79fb8e343fec.jpg%21w700wb&refer=http%3A%2F%2Fimages.669pic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648201107&t=b0b1f60b08c6114b3908f76eb771d3fb'"></v-img></v-avatar>
    
    <v-dialog max-width="600px">
      <template #activator="{on, attrs}">
        <v-btn v-on="on" v-bind="attrs" text color="primary">登陆/注册</v-btn>
      </template>

      <login></login>
    </v-dialog>
  </div>
</div>
</template>
<script>
import Login from '@/views/person/modules/Login.vue';
import SimpleAvatar from '@/components/SimpleAvatar.vue';
export default {
   components: {
    Login,
    SimpleAvatar
  },
  data: () => ({
    logoutDialog: false,
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    user() {
      let u = this.$store.state.user
      return u ? u : {}
    }
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
  created() {
    
  }
}
</script>