<template>
<v-main class="pt-0">
  <div class="d-flex">
    <div class="flex-grow-0 flex-shrink-1 d-flex justify-center">
      <simple-avatar :src="reply.etc.user.avatar" width="58" height="58" class="mt-5"  />
    </div>
    <div class="flex-grow-1">
      <v-card-title class="text-h6 pb-3">
        <div>
          {{ reply.etc.user.nickname }}
        </div>
      </v-card-title>

      <v-card-text class="text-body-2" v-html="reply.content"></v-card-text>

      <v-card-subtitle class="text-caption pt-0 d-flex align-center">
        <span>
          {{ formatDate(reply.replyTime).diffFormat }}
        </span>

        <v-spacer />

        <v-btn icon color="red" @click="del" v-if="showDelete">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-subtitle>

      <v-card-text class="px-4 py-2 background-color grey lighten-3 rounded">
        文章: {{ article.title }}
      </v-card-text>
    </div>
  </div>
</v-main>
</template>
<script>
import gameApi from "@/api/game/gameApi.js"
import articleApi from "@/api/article/articleApi.js"
import SimpleAvatar from '@/components/SimpleAvatar.vue';
export default {
  props: {
    //要显示的评论
    reply: {
      required: true,
      type: Object,
      default: {}
    },
    "showDelete": {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  components: {
    SimpleAvatar
  },
  data: () => ({
    article: {},
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  watch: {
    
  },
  methods: {
    del() {
      this.showConfirmDialog('确认删除回复?',  "", 
        () => {
          articleApi.deleteReply(this.reply.id)
          .then(res => {
            this.alert.success("删除成功")
            this.$emit("deleted")
          })
          .catch(err => this.alert.error(err))
        }
      )
    },
  },
  created() {
    //初始化
    articleApi.getById(this.reply.articleId)
    .then(res => {
      this.article = res;
    })
    .catch(err => this.alert.error(err))
  }
}
</script>