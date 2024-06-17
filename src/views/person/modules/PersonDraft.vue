<template>
<v-container>
  <v-tabs background-color="blue-grey" dark class="rounded"  v-model="tab" @change="onTabChange">
    <v-tabs-slider color="blue darken-5"></v-tabs-slider>
    <v-tab>文章</v-tab>
    <v-tab>帖子</v-tab>
  </v-tabs>

  <v-card min-height="200px" color="mt-4 pb-4">
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <page-iterator ref="pageIt1" :provider="articleProvider">
          <template #default="{records}">
            <div v-for="(article, idx) in records" :key="article.id">
              <article-preview :article="article" :showThumbUp="false" :showReply="false" :showEdit="true" />
            </div>
          </template>
        </page-iterator>
      </v-tab-item>
      <v-tab-item>
        <page-iterator ref="pageIt2" :provider="postProvider">
          <template #default="{records}">
            <v-list>
              <v-list-item v-for="post in records" :key="post.id">
                <post-preview :post="post" :showThumbUp="false" :showReply="false" :showEdit="true"/>
              </v-list-item>
            </v-list>
          </template>
        </page-iterator>
      </v-tab-item>
    </v-tabs-items>

  </v-card>
</v-container>
</template>
<script>
import bbsApi from "@/api/bbs/bbsApi.js"
import articleApi from "@/api/article/articleApi.js"
import PageIterator from '@/components/PageIterator.vue';
import ArticlePreview from '@/components/ArticlePreview.vue';
import PostPreview from '@/components/PostPreview.vue';
export default {
  components: { PageIterator, ArticlePreview, PostPreview },
  data: () => ({
    tab: 0,
  }),
  computed: {
     isLogin() {
      return this.$store.getters.isLogin;
    },
    user() {
      let u = this.$store.state.user
      return u ? u : {}
    },
    postProvider() {
      if (!this.isLogin)
        return null

      return ({current, size}) => bbsApi.page({current, size, userId: this.user.id, status: 0})     //status: 0 表示草稿
    },
    articleProvider() {
      if (!this.isLogin)
        return null
      return ({current, size}) => articleApi.page({current, size, userId: this.user.id, status: 0}) //status: 0 表示草稿
    },
  },
  methods: {
    onTabChange(tab) {
      this.flushList()
    },
    flushList() {
      if (!this.isLogin) {
        this.alert.error("未登陆")
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
        default: {
          this.alert.error("未知选项卡")
          break;
        }
      }
    },
    onPageCurrentChange(current) {
      this.flushList()
    },
  },
  created() {
    
  }
}
</script>