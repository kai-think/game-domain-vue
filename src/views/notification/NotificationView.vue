<template>
<v-slide-x-reverse-transition>
  <v-card v-if="show"
    class="rounded-0 d-flex flex-column"
    dark
    elevation=20 
    color="grey darken-3" 
    style="position: fixed; z-index: 900; right: 0px" 
    min-width="350px" width="30%" max-width="500px" 
    height="100%"
  >

    <v-card-title class="justify-space-between">
      <span>
        通知管理
      </span>

      <v-btn @click="close" text color="blue lighten-3" large>关闭</v-btn>
    </v-card-title>

    <v-card-subtitle class="mt-1 pb-2">
      未读
    </v-card-subtitle>
    <page-iterator :provider="pageUnReadContentProvider" ref="unreadList">
      <template #default="{records}">
        <v-slide-x-reverse-transition>
          <transition-group>
            <v-card 
              dark 
              class="mx-3 my-1" v-for="(item, i) in records" :key="item.id">
              <v-card-title>{{item.title}}</v-card-title>

              <v-card-text v-text="item.content">
                
              </v-card-text>

              <v-card-actions class="pl-4">
                <div class="text-caption">
                  {{ formatDate(item.notificationTime).diffFormat }}
                </div>

                <v-spacer />
                  <v-btn icon @click="read([item.id])">
                    <v-icon small>mdi-read</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                
              </v-card-actions>
            </v-card>
          </transition-group>

        </v-slide-x-reverse-transition>
      </template>
    </page-iterator>

    <v-card-subtitle class="mt-1 pb-2">
      已读
    </v-card-subtitle>
    <page-iterator :provider="pageHasReadContentProvider" ref="readedList">
      <template #default="{records}">
        
        <v-slide-x-reverse-transition>
          <transition-group>
          
            <v-card 
              dark 
              class="mx-3 my-1" v-for="(item, i) in records" :key="item.id">
              <v-card-title>{{item.title}}</v-card-title>

              <v-card-text v-text="item.content">
                
              </v-card-text>

              <v-card-actions class="pl-4">
                <div class="text-caption">
                  {{ formatDate(item.notificationTime).diffFormat }}
                </div>

                <v-spacer />
                  <v-btn icon @click="unread([item.id])">
                    <v-icon small>mdi-email-mark-as-unread</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                
              </v-card-actions>
            </v-card>
          </transition-group> 
        </v-slide-x-reverse-transition>
      </template>
    </page-iterator>
  </v-card>
</v-slide-x-reverse-transition>
</template>
<script>
import notifyApi from "@/api/notification/notificationApi"
import PageIterator from '../../components/PageIterator.vue';
export default {
  components: {PageIterator  },
  data: () => ({
    list: [],
    timeLoop: null,
  }),
  computed: {
    show() {
      return this.$store.state.showNotification;
    },
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  watch: {
    isLogin(newVal) {
      console.log(`isLogin has change: ${newVal}`);
      if (this.isLogin) {
        this.alertNewNotification()
        this.flushList()
      }
      else if (this.timeLoop)
        clearInterval(this.timeLoop)
    },
    show(newVal) {
      console.log("show change: " + newVal)
      if (newVal) {
        this.flushList()
      }
    },
  },
  methods: {
    close() {
      this.$store.commit("showNotification", false)
    },
    pageUnReadContentProvider({current, size}) {
      return notifyApi.pageUnRead({current, size});
    },
    pageHasReadContentProvider({current, size}) {
      return notifyApi.pageHasRead({current, size});
    },
    flushList() {
      if (!this.isLogin) {
        this.alert.error("未登陆")
        return;
      }
      if (!this.show)
        return;

      if (this.$refs.unreadList) {
        this.$refs.unreadList.flushList();
      }
      if (this.$refs.readedList) {
        this.$refs.readedList.flushList();
      }
    },
    read(ids) {
      notifyApi.readNotification(ids)
      .then(res => {
        this.alert.success("已读")
        this.flushList();
      })
      .catch(err => this.alert.error(err));
    },
    unread(ids) {
      notifyApi.setUnRead(ids)
      .then(res => {
        this.alert.success("未读")
        this.flushList();
      })
      .catch(err => this.alert.error(err));
    },
    alertNewNotification() {
      //当前有一个计时就返回
      if (this.timeLoop)
        return;

      this.doAlert()
      this.timeLoop = setInterval(() => {
          this.doAlert()
      }, 30000);  //30秒查一次是否有新通知
    },
    doAlert() {
      notifyApi.listUnSend()
      .then(res => {
        let list = res;
        for (let item of list) {
          this.alert.show({
            title: item.title,
            color: "primary",
            dark: true,
            timeout: 12000,
            icon: "mdi-email-alert",
            border: "left",
            dismissible: true,
          })
        }
      })
      .catch(err => this.alert.error(err))
    }
  },
  created() {
    if (this.isLogin) {
      this.alertNewNotification()
      this.flushList()
    }
  },
  destroyed() {
    if (this.timeLoop)
      clearInterval(this.timeLoop)
  }
}
</script>
<style lang="scss">
  
</style>