<template>
<v-container>
  <v-card color="blue lighten-1" dark>

    <div class="d-flex flex-column justify-center align-center" style="height: 200px">
      <simple-avatar :width="80" :height="80" :src="user.avatar"></simple-avatar>
      <div class="text-h6 mt-2 font-weight-bold">{{ user.nickname }}</div>
    </div>
    <v-divider />

    <v-tabs v-model="tab" background-color="blue lighten-1" color="white">
      <v-tab @click="toMenu(menu)" v-for="(menu, idx) in menuList" :key="idx">
        {{ menu.name }}
      </v-tab>
    </v-tabs>
  </v-card>

  <!-- <v-card class="mt-4" min-height="350px"> -->
    
    <v-fab-transition>
      <router-view class="mt-4" :user="user" :isSelf="isSelf">
      </router-view>
    </v-fab-transition>
  <!-- </v-card> -->
</v-container>
</template>
<script>
import userApi from "@/api/user/userApi"
import SimpleAvatar from '@/components/SimpleAvatar.vue'
export default {
  components: { SimpleAvatar },
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    menuList() {
      let list = [
              {
                name: "圈子",
                path: `/person${'/' + this.user.id}/circle`,
                icon: "mdi-history"
              },
              {
                name: "收藏",
                path: `/person${'/' + this.user.id}/follow`,
                icon: "mdi-star"
              },
            ]

      if (this.isSelf) {
        list.push({
          name: "草稿",
          path: `/person${'/' + this.user.id}/draft`,
          icon: "mdi-grease-pencil"
        })

        list.push({
          name: "禁用帖子",
          path: `/person${'/' + this.user.id}/deleted`,
          icon: "mdi-grease-pencil"
        })
      }

      return list;
    },
    isSelf() {
      return this.isLogin && this.user.id == this.$store.state.user.id
    }
  },
  data: () => ({
    user: {},
    tab: 0,
  }),
  methods: {
    toMenu(menu) {
      this.$router.push(menu.path)
    }
  },
  created() {
    let path = this.$router.currentRoute.path;
    let idx = this.menuList.findIndex(m => m.path === path)
    this.tab = idx >= 0 ? idx : 0

    let userId = this.$router.currentRoute.params.userId

    if (userId != null) {
      console.log("getUserById", userId)
      userApi.getById(userId)
      .then(res => {
        this.user = res;
      })
      .catch(err => {
        this.alert.error(err)
      })
      return;
    }

    if (this.isLogin) {
      console.log("getUserFromStore", this.$store.state.user)
      this.user = this.$store.state.user
    }
    else {
      this.alert.error("未登陆")
    }
  }
}
</script>