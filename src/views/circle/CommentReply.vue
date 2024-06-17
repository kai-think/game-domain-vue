<template>
<v-main class="pt-0">

  <div class="d-flex">
    <div style="width: 50px" class="flex-grow-0 flex-shrink-1 d-flex justify-center">
      <simple-avatar :src="reply.etc.user.avatar" width="42" height="42" class="mt-5"  />
    </div>
    <div class="flex-grow-1">
      <v-card-title class="text-subtitle-1 pb-1">
          {{ reply.etc.user.nickname }}
      </v-card-title>
      <v-card-text class="text-body-2 pb-1">
        <span v-if="reply.replyId2">
          <span style="color: #757575">
            回复
          </span>
          <strong>{{reply.etc.user2.nickname}}</strong>
          :
        </span>
        <span>
          {{ reply.content2 }}
        </span>
      </v-card-text>
      <v-card-subtitle class="text-caption pt-0 d-flex align-center pb-1">
        <span>
          {{ formatDate(reply.replyTime).diffFormat }}
        </span>
        <v-btn text x-small class="px-1 ml-1" color="primary" @click="showReplyEditor = !showReplyEditor">回复</v-btn>
      </v-card-subtitle>
      <v-card-text v-if="showReplyEditor" class="pb-1">
        <simple-editor @submit="confirmReply" :submitText="'回复'"></simple-editor>
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
import SimpleAvatar from "@/components/SimpleAvatar.vue"
export default {
  props: {
    primaryReply: {
      required: true,
      type: Object,
      default: {}
    },
    reply: {
      required: true,
      type: Object,
      default: {}
    },
  },
  components: {
    PostSimple,
    SimpleEditor,
    SimpleAvatar
  },
  data: () => ({
    bbsId: null,
    //编辑回复时使用的数据
    replyData: {
      replyId: null,
      replyId2: null,
      content2: "",
      type: 2,  //0为对主题的回复，1为对评论的回复，2为对评论的回复的回复
    },

    showReplyEditor: false,

    //获取回复时的过滤器
    replyFilter: {
      current: 1,
      size: 15,
      bbsId: 0,
      replyId: 0, //对评论的id
    },
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  watch: {
    
  },
  methods: {
    confirmReply(content) {
      this.replyData.content2 = content;
      bbsApi.writeReply({bbsId: this.bbsId, ...this.replyData})
      .then(res => {
        this.alert.success("回复成功");
        this.replyData.content2 = "";
        this.showReplyEditor = false

        this.$emit("change");
      })
      .catch(err => this.alert.error(err))
    },
    toUser(user) {
      this.$router.push({
        name: "game-forum-user",
        params: {id: user.id}
      })
    },
  },
  mounted() {
    this.bbsId = this.reply.bbsId
    this.replyData.replyId = this.primaryReply.id;
    this.replyData.replyId2 = this.reply.id;
  }
}
</script>