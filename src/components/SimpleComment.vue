<template>
<v-main class="pt-0">

  <div class="d-flex">
    <div class="flex-grow-0 flex-shrink-1 d-flex justify-center">
      <simple-avatar :src="replyDetail.avatar" width="58" height="58" class="mt-5"  />
    </div>
    <div class="flex-grow-1">
      <v-card-title class="text-h6 pb-3">
          {{ replyDetail.nickname }}
      </v-card-title>
      <v-card-text class="text-body-2" v-html="replyDetail.content">
      
      </v-card-text>
      <v-card-subtitle class="text-caption pt-0 d-flex align-center">
        <span>
          {{ formatDate(replyDetail.replyTime).diffFormat }}
        </span>

        <v-btn text x-small class="px-1 ml-1" color="primary" @click="showReply1Editor = !showReply1Editor">回复</v-btn>
      </v-card-subtitle>
      <v-card-text v-if="showReply1Editor">
        <simple-editor @submit="confirmReply" :submitText="'回复'"></simple-editor>
      </v-card-text>
    </div>
  </div>
</v-main>
</template>
<script>
import gameApi from "@/api/game/gameApi.js"
import articleApi from "@/api/article/articleApi.js"
import articleReplyApi from "@/api/article/articleReplyApi.js"
import SimpleEditor from '../../components/SimpleEditor.vue'
import CommentReply from './CommentReply.vue'
import SimpleAvatar from "@/components/SimpleAvatar.vue"
import PageIterator from '../../components/PageIterator.vue'
export default {
  props: {
    //要显示的评论
    title: {
      required: true,
      type: String,
      default: "标题"
    },
    img: {
      required: true,
      type: String,
      default: ""
    },
    content: {
      required: true,
      type: String,
      default: "内容"
    },
  },
  components: {
    SimpleEditor,
    CommentReply,
    SimpleAvatar,
    PageIterator
  },
  data: () => ({
    //编辑回复时使用的数据
    replyData: {
      replyId: null,
      content2: "",
      type: 1,  //0为对主题的回复，1为对评论的回复，2为对评论的回复的回复
    },

    showReply1Editor: false,
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  watch: {
    
  },
  methods: {
    //对某个回复进行回复, type = 1
    confirmReply(content) {
      this.replyData.content2 = content;
      articleApi.writeReply({articleId: this.articleId, ...this.replyData})
      .then(res => {
        this.alert.success("回复成功");
        this.replyData.content2 = "";
        this.showReply1Editor = false

        this.flushReply2List()
      })
      .catch(err => this.alert.error(err))
    },
    toUser(user) {
      this.$router.push({
        name: "OtherPerson",
        params: {userId: user.id}
      })
    },
    reply2PageProvider({current, size}) {
      return articleReplyApi.page({current, size, articleId: this.replyDetail.articleId, replyId: this.replyDetail.id});
    }
  },
}
</script>