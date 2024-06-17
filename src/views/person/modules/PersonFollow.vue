<template>
<v-container class="pa-0">
  <v-tabs background-color="blue-grey" dark class="rounded"  v-model="tab" @change="onTabChange">
    <v-tabs-slider color="blue darken-5"></v-tabs-slider>
    <v-tab>文章</v-tab>
    <v-tab>帖子</v-tab>
    <v-tab>游戏圈</v-tab>
    <v-tab>论坛</v-tab>
  </v-tabs>

  <v-card min-height="200px" color="mt-4 pb-4 pa-3">
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <page-iterator ref="pageIt1" :provider="followArticleProvider">
          <template #default="{records}">
            <div v-for="(article, idx) in records" :key="article.id">
              <article-preview :article="article" :showLike="true" />
            </div>
          </template>
        </page-iterator>
      </v-tab-item>
      <v-tab-item>
        <page-iterator ref="pageIt2" :provider="followPostProvider">
          <template #default="{records}">
            <v-list>
              <v-list-item v-for="post in records" :key="post.id">
                <post-preview :post="post" :showLike="true" />
              </v-list-item>
            </v-list>
          </template>
        </page-iterator>
      </v-tab-item>
      <v-tab-item>
        <page-iterator ref="pageIt3" :provider="followCircleProvider">
          <template #default="{records}">
            <v-row>
              <v-col cols="6" sm="4" md="4" lg="3" xl="2" v-for="circle in records" :key="circle.id">
                <image-with-title :src="circle.banner" :title="circle.name" @click="toCircle(circle.id)" />
              </v-col>
            </v-row>
          </template>
        </page-iterator>
      </v-tab-item>
       <v-tab-item>
        <page-iterator ref="pageIt4" :provider="followForumProvider">
          <template #default="{records}">
            <v-row>
              <v-col cols="6" sm="4" md="4" lg="3" xl="2" v-for="forum in records" :key="forum.id">
                <image-with-title :src="forum.cover" :title="forum.name" @click="toForum(forum.circleId)" />
              </v-col>
            </v-row>
          </template>
        </page-iterator>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</v-container>
</template>
<script>
import gameApi from "@/api/game/gameApi.js"
import userApi from "@/api/user/userApi"
import bbsApi from "@/api/bbs/bbsApi.js"
import articleApi from "@/api/article/articleApi.js"
import PageIterator from '@/components/PageIterator.vue';
import ArticlePreview from '@/components/ArticlePreview.vue';
import PostPreview from '@/components/PostPreview.vue';
import ImageWithTitle from '@/components/ImageWithTitle.vue'
export default {
  components: { PageIterator, ArticlePreview, PostPreview, ImageWithTitle },
  props: {
    user: {
      required: true,
      type: Object,
      default: null
    }
  },
  data: () => ({

    tab: 0,
  }),
  computed: {
     isLogin() {
      return this.$store.getters.isLogin;
    },
    followArticleProvider() {
      if (this.user && this.user.id)
        return ({current, size}) => articleApi.pageFollow({current, size, userId: this.user.id})

      return null;
    },
    followPostProvider() {
      if (this.user && this.user.id)
        return ({current, size}) => bbsApi.pageFollow({current, size, userId:this.user.id})
      
      return null;
    },
    followCircleProvider() {
      if (this.user && this.user.id)
        return ({current, size}) => gameApi.pageFollowCircle({current, size, userId:this.user.id})
      
      return null;
    },
    followForumProvider() {
      if (this.user && this.user.id)
        return ({current, size}) => bbsApi.pageFollowForum({current, size, userId:this.user.id})
      
      return null;
    }
  },
  watch: {
    user(newVal) {
      this.init();
    }
  },
  methods: {
    onTabChange(tab) {
      this.flushList()
    },
    flushList() {
      if (this.user == null || this.user.id == null) {
        // this.alert.error("错误用户")
        return;
      }
      
      switch(this.tab) {
        case 0: {
          if (this.$refs.pageIt1)
            this.$refs.pageIt1.resetList()
          break
        }
        case 1: {
          if (this.$refs.pageIt2)
            this.$refs.pageIt2.resetList()
          break
        }
        case 2: {
          if (this.$refs.pageIt3)
            this.$refs.pageIt3.resetList()
          break
        }
        case 3: {
          if (this.$refs.pageIt4)
            this.$refs.pageIt4.resetList()
          break
        }
        default: {
          this.alert.error("未知选项卡")
          break;
        }
      }
    },
    toCircle(circleId) {
      this.$router.push({ name: 'game-circle', params: { id: circleId } })
    },
    toForum(forumId) {
      this.$router.push({name: "game-forum", params: {id: forumId}})
    },
    onPageCurrentChange(current) {
      this.flushList()
    },
    init() {

    }
  },
  created() {
    // let userId = this.$router.currentRoute.params.userId
    // if (userId == null) {
    //   this.user = this.$store.user
    //   return;
    // }

    // userApi.getById(userId)
    // .then(res => {
    //   this.user = res;
    // })
    // .catch(err => {
    //   this.alert.error(err)
    // })
  }
}
</script>