<template>
<v-main class="pt-0">

  <div class="d-flex">
    <div class="flex-grow-0 flex-shrink-1 d-flex justify-center">
      <simple-avatar :src="reply.etc.user.avatar" width="58" height="58" class="mt-5"  />
    </div>
    <div class="flex-grow-1">
      <v-card-title class="text-h6 pb-3">
          <!-- <v-chip color="yellow darken-2" dark small class="mr-2" v-if="isManufacturer(reply.etc.user)">官方</v-chip> -->
          {{ reply.etc.user.nickname }}

          <v-chip color="yellow darken-2" dark small class="ml-2" v-if="isManu">官方</v-chip>
      </v-card-title>
      <v-card-text class="text-body-2" v-html="reply.content">
      
      </v-card-text>
      <v-card-subtitle class="text-caption pt-0 d-flex align-center">
        <span>
          {{ formatDate(reply.replyTime).diffFormat }}
        </span>

        <v-btn text x-small class="px-1 ml-1" color="primary" @click="showReply1Editor = !showReply1Editor">回复</v-btn>

        <!-- 点赞按钮 -->
        <div>
          <thumb-up-btn-icon :thumbUp="reply.etc.thumbUp" :count="reply.thumbsUpCount" @click="toggleThumbUp" />
        </div>
      </v-card-subtitle>
      <v-card-text v-if="showReply1Editor">
        <simple-editor @submit="confirmReply" :submitText="'回复'"></simple-editor>
      </v-card-text>

      <v-card-text class="pl-1">
        <div v-if="reply2.loading">
          <div v-for="i in 3" :key="i" >
            <v-skeleton-loader type="list-item-avatar, list-item"></v-skeleton-loader>
          </div>
        </div>
        <div v-else>
          <!-- 回复的回复列表 -->
          <div v-for="(reply2, idx) in reply2.list" :key="reply2.id">
            <post-comment-reply :reply="reply2" :primaryReply="reply" :post="post" @change="flushReply2List"></post-comment-reply>
          </div>
          <div v-if="reply2.total > reply2Filter.size">
            <v-pagination
              v-model="reply2Filter.current"
              @input="onPageCurrentChange"
              circle
              :length="pageLength"
              :total-visible="5"
            ></v-pagination>
          </div>
        </div>
      </v-card-text>
    </div>
  </div>
</v-main>
</template>
<script>
import gameApi from "@/api/game/gameApi.js"
import bbsApi from "@/api/bbs/bbsApi.js"
import PostSimple from '../../components/forum/PostSimple.vue'
import SimpleEditor from '../../components/SimpleEditor.vue'
import PostCommentReply from './PostCommentReply.vue'
import SimpleAvatar from "@/components/SimpleAvatar.vue"
import ThumbUpBtnIcon from '../../components/ThumbUpBtnIcon.vue'
export default {
  props: {
    //要显示的评论
    reply: {
      required: true,
      type: Object,
      default: {}
    },
    post: {
      required: true,
      type: Object,
      default: {}
    }
  },
  components: {
    PostSimple,
    SimpleEditor,
    PostCommentReply,
    SimpleAvatar,
    ThumbUpBtnIcon
  },
  data: () => ({
    bbsId: null,

    //编辑回复时使用的数据
    replyData: {
      replyId: null,
      content2: "",
      type: 1,  //0为对主题的回复，1为对评论的回复，2为对评论的回复的回复
    },

    showReply1Editor: false,

    //获取回复时的过滤器
    reply2Filter: {
      current: 1,
      size: 5,
      bbsId: 0,
      replyId: 0, //对评论的id
    },

    //回复列表
    reply2: {
      list: [],
      data: [],
      total: 100,
      loading: false,
    },
    loading: {
      thumbUp: false,
    },

    isManu: false
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    pageLength() {
      let total = this.reply2.total;
      let size = this.reply2Filter.size;
      let mod = total % size
      return mod === 0 ? total / size : Math.floor(total / size) + 1;
    }
  },
  watch: {
    
  },
  methods: {
    // isManufacturer(user) {
    //   let manufacturer = this.$store.state.manufacturerMap[user.id]
    //   if (manufacturer == null) 
    //     return false;
      
    //   return manufacturer.circleId == this.post.circleId
    // },
    //对某个回复进行回复, type = 1
    confirmReply(content) {
      this.replyData.content2 = content;
      bbsApi.writeReply({bbsId: this.bbsId, ...this.replyData})
      .then(res => {
        this.alert.success("回复成功");
        this.replyData.content2 = "";
        this.showReply1Editor = false

        this.flushReply2List()
      })
      .catch(err => this.alert.error(err))
    },
    flushReply2List() {
      this.reply2.loading = true;
      this.reply2Filter.bbsId = this.reply.bbsId
      this.reply2Filter.replyId = this.reply.id
      bbsApi.pageReply({...this.reply2Filter})
      .then(res => {
        this.reply2.data = res.records;
        this.reply2.list = this.reply2.data;
        this.reply2.total = res.total;

        this.reply2.loading = false;
      })
    },
    toUser(user) {
      this.$router.push({
        name: "game-forum-user",
        params: {id: user.id}
      })
    },
    onPageCurrentChange(current) {
      this.flushReply2List()
    },
    toggleThumbUp() {
      if (!this.isLogin) {
        this.alert.error("请先登陆")
        return;
      }
      this.loading.thumbUp = true;

      let reply = this.reply
      let thumbUp = !reply.etc.thumbUp;

      bbsApi.giveReplyThumbs(reply.id, thumbUp)
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
    this.bbsId = this.reply.bbsId
    this.replyData.replyId = this.reply.id;
    this.flushReply2List();

    this.isManufacturer({userId: this.reply.etc.user.id, circleId: this.post.circleId})
    .then(res => {
      this.isManu = res
    })
  }
}
</script>