<template>
  <simple-preview :cover="article.cover" :title="article.title" :subtitle="article.subtitle" @click:title="toArticle(article)">
    <template #action>
        <!-- 点赞按钮 -->
        <div v-if="showThumbUp">
          <thumb-up-btn-icon :thumbUp="article.etc.thumbUp" :count="article.thumbsUpCount" @click="toggleThumbUp(article)" :disabled="loading.thumbUp"/>
        </div>
        <!-- 回复按钮 -->
        <div v-if="showReply">
          <v-btn icon class="ml-4">
            <v-icon color="#0D47A1">mdi-message-reply-text</v-icon>
          </v-btn>
          <span class="text-subtitle-1 font-weight-bold">
            {{ article.replyCount }}
          </span>
        </div>
        <div v-if="showEdit">
          <v-btn icon class="ml-4" @click="toEdit(article)">
            <v-icon color="red">mdi-pencil</v-icon>
          </v-btn>
        </div>
        <div v-if="showLike">
          <v-btn icon class="ml-4" @click="toggleLike(article)" :disabled="loading.like">
            <v-icon color="red">{{ article.etc.like ? "mdi-star" : "mdi-star-outline" }}</v-icon>
          </v-btn>
        </div>
        <div v-if="showDelete">
          <v-btn icon class="ml-4" @click="deleteArticle(article)">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </div>
        <v-spacer />
        <div class="indigo--text mr-3">
          {{ formatDate(article.createTime).diffFormat }}
        </div>
    </template>
  </simple-preview>
</template>
<script>
import articleApi from "@/api/article/articleApi.js"
import SimplePreview from '@/components/SimplePreview.vue'
import ThumbUpBtnIcon from '@/components/ThumbUpBtnIcon.vue'
export default {
  components: {
   SimplePreview, ThumbUpBtnIcon
  },
  props: {
    article: {
      required: true,
      type: Object,
      default: {etc: {}},
    },
    "showThumbUp": {
      required: false,
      type: Boolean,
      default: true,
    },
    "showReply": {
      required: false,
      type: Boolean,
      default: true,
    },
    "showEdit": {
      required: false,
      type: Boolean,
      default: false,
    },
    "showLike": {
      required: false,
      type: Boolean,
      default: false,
    },
    "showDelete": {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    loading: {
      thumbUp: false,
      like: false,
    },
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    }
  },
  methods: {
    toArticle(article) {
      this.$router.push({name: "game-circle-article", params: {id: article.id}});
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
    deleteArticle(article) {
      this.showConfirmDialog('确认删除',  article.title + " ?", 
        () => {
          articleApi.delete([article.id])
          .then(res => {
            this.alert.success("删除成功")
            this.$emit("delete")
          })
          .catch(err => this.alert.error(err))
        }
      )
    },
    toEdit(article) {
      this.$router.push({name: "ArticleEditorDraft", params: {articleId: this.article.id}});
    }
  }
}
</script>