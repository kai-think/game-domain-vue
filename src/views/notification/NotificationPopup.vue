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
    <page-iterator :provider="pageUnReadContentProvider">
      <template #default="{records}">

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
              <v-btn icon>
                <v-icon small>mdi-read</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            
          </v-card-actions>
        </v-card>
        
      </template>
    </page-iterator>

    <v-card-subtitle class="mt-1 pb-2">
      已读
    </v-card-subtitle>
    <page-iterator :provider="pageHasReadContentProvider">
      <template #default="{records}">

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
              <v-btn icon>
                <v-icon small>mdi-email-mark-as-unread</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            
          </v-card-actions>
        </v-card>
        
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

  }),
  computed: {
    show() {
      return this.$store.state.showNotification;
    }
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
  },
  created() {
    
  }
}
</script>
<style lang="scss">
  
</style>