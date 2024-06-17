<template>
<v-container class="pa-0">
 
  <v-tabs background-color="blue-grey" dark class="rounded"  v-model="tab" @change="onTabChange">
    <v-tabs-slider color="blue darken-5"></v-tabs-slider>
    <v-tab>帖子</v-tab>
    <v-tab>回复</v-tab>
    <v-tab>文章</v-tab>
    <v-tab>回复</v-tab>
  </v-tabs>

  <v-card min-height="200px" color="mt-4 pb-4">
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <page-iterator ref="pageIt1" :provider="postProvider">
          <template #default="{records}">
            <v-list>
              <v-list-item v-for="post in records" :key="post.id">
                <post-preview :post="post" @delete="flushList" :showDelete="isSelf" />
              </v-list-item>
            </v-list>
          </template>
        </page-iterator>
      </v-tab-item>
      <v-tab-item>
        <page-iterator ref="pageIt2" :provider="postReplyProvider">
          <template #default="{records}">
            <v-list>
              <v-list-item v-for="reply in records" :key="reply.id">
                <post-reply-preview :reply="reply" @deleted="flushList" :showDelete="isSelf"/>
              </v-list-item>
            </v-list>
          </template>
        </page-iterator>
      </v-tab-item>
      <v-tab-item>
        <page-iterator ref="pageIt3" :provider="articleProvider">
          <template #default="{records}">
            <div v-for="article in records" :key="article.id">
              <article-preview :article="article" @delete="flushList" :showDelete="isSelf" />
            </div>
          </template>
        </page-iterator>
      </v-tab-item>
       <v-tab-item>
        <page-iterator ref="pageIt4" :provider="articleReplyProvider">
          <template #default="{records}">
            <v-list>
              <v-list-item v-for="reply in records" :key="reply.id">
                <article-reply-preview :reply="reply" @deleted="flushList" :showDelete="isSelf"/>
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
import articleReplyApi from "@/api/article/articleReplyApi.js"
import articleApi from "@/api/article/articleApi.js"
import bbsApi from "@/api/bbs/bbsApi.js"
import PageIterator from '@/components/PageIterator.vue';
import PostSimple from '@/components/forum/PostSimple.vue';
import SimplePreview from '@/components/SimplePreview.vue'
import PostReplyPreview from '@/components/PostReplyPreview.vue';
import ThumbUpBtnIcon from '@/components/ThumbUpBtnIcon.vue'
import Comment from '@/views/circle/Comment.vue';
import ArticlePreview from '@/components/ArticlePreview.vue';
import PostPreview from '@/components/PostPreview.vue';
import ArticleReplyPreview from '@/components/ArticleReplyPreview.vue';
export default {
  components: {PostSimple, PostReplyPreview, PageIterator, SimplePreview, ThumbUpBtnIcon, Comment, ArticlePreview, PostPreview,  ArticleReplyPreview},
  props: {
    user: {
      required: true,
      type: Object,
      default: null
    },
    isSelf: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    tab: 0,
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    postProvider() {
      if (this.user && this.user.id)
        return ({current, size}) => bbsApi.page({current, size, userId: this.user.id, status: -2})

      return null
    },
    postReplyProvider() {
      if (this.user && this.user.id)
        return ({current, size}) => bbsApi.pageReply({current, size, userId: this.user.id, status: -2})

      return null
    },
    articleProvider() {
      if (this.user && this.user.id)
        return ({current, size}) => articleApi.page({current, size, userId: this.user.id, status: -2})

      return null
    },
    articleReplyProvider() {
      if (this.user && this.user.id)
        return ({current, size}) => articleReplyApi.page({current, size, userId: this.user.id, descByReplyTime: true, status: -2})

      return null
    },
  },
  methods: {
    onTabChange(tab) {
      this.flushList()
    },
    flushList() {
      // if (!this.isLogin) {
      //   this.alert.error("未登陆")
      //   return;
      // }
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
    onPageCurrentChange(current) {
      this.flushList()
    },
  },
  mounted() {
    this.flushList();
  }
}
</script>