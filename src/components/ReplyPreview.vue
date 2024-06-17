<template>
<v-main class="pt-0">
  <div class="d-flex">
    <div class="flex-grow-0 flex-shrink-1 d-flex justify-center">
      <simple-avatar :src="reply.etc.user.avatar" width="58" height="58" class="mt-5"  />
    </div>
    <div class="flex-grow-1">
      <v-card-title class="text-h6 pb-3">
          {{ reply.etc.user.nickname }}
      </v-card-title>

      <v-card-text v-if="reply.type == 0" class="text-body-2" v-html="reply.content"></v-card-text>
      <v-card-text v-else class="text-body-2">
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

      <v-card-subtitle class="text-caption pt-0 d-flex align-center">
        <span>
          {{ formatDate(reply.replyTime).diffFormat }}
        </span>
      </v-card-subtitle>

      <v-card-text class="px-4 py-2 background-color grey lighten-3 rounded">
        帖子: {{ bbs.title }}
      </v-card-text>
    </div>
  </div>
</v-main>
</template>
<script>
import gameApi from "@/api/game/gameApi.js"
import bbsApi from "@/api/bbs/bbsApi.js"
import SimpleAvatar from '@/components/SimpleAvatar.vue';
export default {
  props: {
    //要显示的评论
    reply: {
      required: true,
      type: Object,
      default: {}
    }
  },
  components: {
    SimpleAvatar
  },
  data: () => ({
    bbsId: null,
    bbs: {},
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
    
  },
  created() {
    //初始化
    this.bbsId = this.reply.bbsId
    bbsApi.page({id: this.bbsId})
    .then(res => {
      this.bbs = res.records[0];
    })
    .catch(err => this.alert.error(err))
  }
}
</script>