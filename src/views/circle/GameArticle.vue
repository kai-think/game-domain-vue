<template>
<v-main class="pt-0">
  <v-container>
    <v-card>
      <v-card-title>{{ article.title }}</v-card-title>
      <v-card-subtitle>{{ article.subtitle }}</v-card-subtitle>
      <v-divider />
      <v-card-text v-html='contentHtml'>
      </v-card-text>
      <v-card-text>
        <v-row align="center" justify="center">
          <!-- 点赞按钮 -->
          <div>
            <thumb-up-btn-icon :thumbUp="article.etc.thumbUp" :count="article.thumbsUpCount" @click="toggleThumbUp(article)" :disabled="loading.thumbUp"/>
          </div>
          <!-- 回复按钮 -->
          <div>
            <v-btn icon class="ml-4">
              <v-icon color="#0D47A1">mdi-message-reply-text</v-icon>
            </v-btn>
            <span class="text-subtitle-1 font-weight-bold">
              {{ article.replyCount }}
            </span>
          </div>
          <!-- 收藏按钮 -->
          <div>
            <v-btn icon class="ml-4" @click="toggleLike(article)" :disabled="loading.like">
              <v-icon color="#E53935">{{ article.etc.like ? "mdi-star" : "mdi-star-outline" }}</v-icon>
            </v-btn>
          </div>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-2">
      <v-card-title>评论区</v-card-title>
      <v-divider />
      <v-card-text>

        <page-iterator :provider="replyPageProvider" ref="pageIt" :flushOnCreated="false">
          <template #default="{records}">
            <div>
              <comment :replyDetail="item"  v-for="(item, idx) in records" :key="item.id" />
            </div>
          </template>
        </page-iterator>
      </v-card-text>

      <v-divider />
      <v-card-subtitle class="font-weight-bold">发表回复</v-card-subtitle>
      <wang-editor class="mx-2" v-model="replyData.content" :height="200"></wang-editor>
      <v-card-actions>
        <v-btn color="primary" @click="submitReply" :disabled="!isLogin">提交</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</v-main>
</template>
<script>
import articleReplyApi from "@/api/article/articleReplyApi.js"
import articleApi from "@/api/article/articleApi.js"
import PageIterator from '@/components/PageIterator.vue';
import SimpleAvatar from '@/components/SimpleAvatar.vue';
import Comment from './Comment.vue';
import WangEditor from '../../components/WangEditor.vue'
import ThumbUpBtnIcon from '../../components/ThumbUpBtnIcon.vue';
export default {
  components: {
    PageIterator,
    SimpleAvatar,
    Comment,
    WangEditor,
    ThumbUpBtnIcon
  },
  data: () => ({
    articleId: 0,
    article: {title: "这是文章标题", subtitle: "副标题", etc: {}},
    content: {content: "<h5>一大串html</h5>"},
    articleTypeDic: {},

    replyData: {
      type: 0,
      content: null
    },
    loading: {
      thumbUp: false,
      like: false,
    }
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    contentHtml() {
      return this.content ? this.content.content : ""
    },
    replyPageProvider() {
      return ({current, size}) => articleReplyApi.page({current, size, type: 0, articleId: this.articleId, ascByReplyTime: true});
    },
  },
  watch: {
    
  },
  methods: {
    flushReplyPage() {
      this.replyFilter.current = 0;
      this.nextReplyPage();
    },
    nextReplyPage() {
      this.replyFilter.current++;

      articleReplyApi.page({...this.replyFilter, articleId: this.article.id})
      .then(res => {
        this.replyTotal = res.total;
        this.replyList = res.records;
      })
      .catch(err => {
        this.alert.error(err)
      })
    },
    submitReply() {
      if (!this.isLogin)
        return;

      articleApi.writeReply({articleId: this.articleId, ...this.replyData})
      .then(res => {
        this.alert.success("发布成功");
        this.replyData.content = ""
        this.flushReplyList()
      })
      .catch(err => this.alert.error(err))
    },
    flushReplyList() {
      this.$refs.pageIt.flushList()
    },
    toggleThumbUp(article) {
      if (!this.isLogin) {
        this.alert.error("请先登陆")
        return;
      }
      this.loading.thumbUp = true;

      let thumbUp = !article.etc.thumbUp;

      articleApi.giveThumbs(article.id, thumbUp)
      .then(res => {
        this.alert.success(thumbUp ? "点赞成功" : "取消点赞")
        article.etc.thumbUp = thumbUp;
        
        article.thumbsUpCount = thumbUp ? article.thumbsUpCount + 1 : article.thumbsUpCount - 1;

        this.loading.thumbUp = false;
      })
      .catch(err => {
        this.alert.error(err)
        this.loading.thumbUp = false;  
      });
    },
    toggleLike(article) {
      if (!this.isLogin) {
        this.alert.error("请先登陆")
        return;
      }
      this.loading.like = true;

      let like = !article.etc.like;

      articleApi.follow(article.id, like)
      .then(res => {
        this.alert.success(like ? "收藏成功" : "取消收藏")
        article.etc.like = like;
 
        this.loading.like = false;
      })
      .catch(err => {
        this.alert.error(err)
        this.loading.like = false;  
      });
    },
  },
  mounted() {
    let articleId = this.$router.currentRoute.params.id
    if (articleId == null)
    {
      this.alert.error("没有这个文章")
      return;
    }

    this.articleId = parseInt(articleId);
    //获得文章类型字典
    // this.getDic("文章类型")
    // .then(res => {
    //   this.articleTypeDic = res;
    // })


    articleApi.getById(articleId)
    .then(res => {
      console.log("articleInfo", res)
      this.article = res;
      this.content = res.etc.content

      this.flushReplyList()
    })
    .catch(err => {
      this.alert.error(err)
    })
  }
}
</script>