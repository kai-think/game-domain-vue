<template>
<v-main class="pt-0">

  <div class="d-flex">
    <div class="flex-grow-0 flex-shrink-1 d-flex justify-center">
      <simple-avatar :src="replyDetail.avatar" width="58" height="58" class="mt-5"  />
    </div>
    <div class="flex-grow-1">
      <v-card-title class="text-h6 pb-3" @click="toUser(replyDetail.userId)" style="cursor: pointer">
          {{ replyDetail.nickname }}
      </v-card-title>
      <v-card-text class="text-body-2" v-html="replyDetail.content">
      
      </v-card-text>
      <v-card-subtitle class="text-caption pt-0 d-flex align-center">
        <span>
          {{ formatDate(replyDetail.replyTime).diffFormat }}
        </span>

        <v-btn text x-small class="px-1 ml-1" color="primary" @click="showReply1Editor = !showReply1Editor">回复</v-btn>

        <div>
          <thumb-up-btn-icon :thumbUp="replyDetail.etc.thumbUp" :count="replyDetail.thumbsUpCount" @click="toggleThumbUp" :disabled="loading.thumbUp" />
        </div>
      </v-card-subtitle>
      <v-card-text v-if="showReply1Editor">
        <simple-editor @submit="confirmReply" :submitText="'回复'"></simple-editor>
      </v-card-text>

      <v-card-text class="pl-1">
        <page-iterator :provider="reply2PageProvider" ref="replyPageIt">
            <template #default="{records}">
              <div v-for="(reply, idx) in records" :key="reply.id">
                <simple-reply :small="true" :avatar="reply.avatar" :nickname="reply.nickname" :content="reply.content" :replyTime="reply.replyTime" />
              </div>
            </template>
          </page-iterator>
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
import SimpleReply from '../../components/SimpleReply.vue'
import ThumbUpBtnIcon from '../../components/ThumbUpBtnIcon.vue'
export default {
  props: {
    //要显示的评论
    replyDetail: {
      required: true,
      type: Object,
      default: {etc: {}}
    },
  },
  components: {
    SimpleEditor,
    CommentReply,
    SimpleAvatar,
    PageIterator,
    SimpleReply,
    ThumbUpBtnIcon
  },
  data: () => ({
    //编辑回复时使用的数据
    replyData: {
      articleId: null,
      replyId: null,
      content: "",
      type: 1,  //0为对主题的回复，1为对评论的回复，2为对评论的回复的回复
    },

    showReply1Editor: false,
    loading: {
      thumbUp: false,
    }
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  watch: {
    
  },
  methods: {
    toUser(userId) {
      this.$router.push({
        name: "OtherPersonCircle",
        params: {userId}
      })
    },
    //对某个回复进行回复, type = 1
    confirmReply(content) {
      this.replyData.content = content;
      articleApi.writeReply({...this.replyData})
      .then(res => {
        this.alert.success("回复成功");
        this.replyData.content = "";
        this.showReply1Editor = false

        this.flushReplyList()
      })
      .catch(err => this.alert.error(err))
    },
    reply2PageProvider({current, size}) {
      return articleReplyApi.page(
        {
          current, size, 
          articleId: this.replyDetail.articleId, 
          replyId: this.replyDetail.id, 
          type: 1, 
          descByReplyTime: true
        });
    },
    flushReplyList() {
      this.$refs.replyPageIt.flushList()
    },

    toggleThumbUp() {
      if (!this.isLogin) {
        this.alert.error("请先登陆")
        return;
      }
      this.loading.thumbUp = true;

      let reply = this.replyDetail
      let thumbUp = !reply.etc.thumbUp;

      articleApi.giveReplyThumbs(reply.id, thumbUp)
      .then(res => {
        this.alert.success(thumbUp ? "点赞成功" : "取消点赞")
        reply.etc.thumbUp = thumbUp;
        
        reply.thumbsUpCount = thumbUp ? reply.thumbsUpCount + 1 : reply.thumbsUpCount - 1;

        this.loading.thumbUp = false;
      })
      .catch(err => {
        this.alert.error(err)
        this.loading.thumbUp = false;  
      });
    },
  },
  mounted() {
    //初始化
    this.replyData.articleId = this.replyDetail.articleId;
    this.replyData.replyId = this.replyDetail.id;
  }
}
</script>