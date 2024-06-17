<template>
<v-main class="pt-0">
<v-container>
  <v-card>
    <simple-image :src="bbsData.bbs.cover" :max-height="300" />

    <v-sheet class="px-3">
      <v-card-title class="mt-3 text-h4 fill-width">
        {{ bbsData.bbs.title }}
      </v-card-title>
      
      <v-card-title>
        <v-row class="pa-2" align="center">
          
          <simple-avatar :src="bbsData.user.avatar" width="42" height="42"  />
          <div class="text-h6 user-name font-weight-bold ml-4" @click="toUser">{{ bbsData.user.nickname }}</div>
          <v-chip class="ml-2" color="primary" small>楼主</v-chip>
          <v-chip color="yellow darken-2" dark small class="ml-2" v-if="isManu">官方</v-chip>
          <div class="text-body-1 ml-5">{{ formatDate(bbsData.bbs.createTime).diffFormat }}</div>
      
        </v-row>
      </v-card-title>

      <v-divider />

      <v-card-subtitle  class="text-h5 mt-8">
        {{ bbsData.bbs.subtitle }}
      </v-card-subtitle>
      
      <!-- 帖子内容 -->
      <v-card-text class="pt-6" v-html="bbsData.content.content"></v-card-text>

      <div v-if="bbsData.bbs.type === Constant.BbsType.Activity">
        <luck-draw-view :post="bbsData.bbs" />
      </div>
      

      <v-card-text>
        <v-row align="center" justify="center">
          <!-- 点赞按钮 -->
          <div>
            <v-btn icon class="ml-4" @click="toggleThumbUp(bbsData.bbs)" :disabled="loading.thumbUp">
              <v-icon color="#0D47A1">{{ bbsData.bbs.etc.thumbUp ? "mdi-thumb-up" : "mdi-thumb-up-outline" }}</v-icon>
            </v-btn>
            <span class="text-subtitle-1 font-weight-bold">
              {{ bbsData.bbs.thumbsUpCount }}
            </span>
          </div>
          <!-- 回复按钮 -->
          <div>
            <v-btn icon class="ml-4">
              <v-icon color="#0D47A1">mdi-message-reply-text</v-icon>
            </v-btn>
            <span class="text-subtitle-1 font-weight-bold">
              {{ bbsData.bbs.replyCount }}
            </span>
          </div>
          <!-- 收藏按钮 -->
          <div>
            <v-btn icon class="ml-4" @click="toggleLike(bbsData.bbs)" :disabled="loading.like">
              <v-icon color="#E53935">{{ bbsData.bbs.etc.like ? "mdi-star" : "mdi-star-outline" }}</v-icon>
            </v-btn>
          </div>
        </v-row>
      </v-card-text>
    </v-sheet>
  </v-card>
  <!-- 回复列表 -->

  <v-card class="mt-1 px-6">

    <v-card-subtitle class="font-weight-bold">全部回复</v-card-subtitle>
    <v-divider />
    <page-iterator :provider="replyProvider" ref="it">
      <template #default="{records}">
        <v-card-text v-for="(reply, idx) in records" :key="reply.id">
          <post-comment :reply="reply" :post="bbsData.bbs"></post-comment>
        </v-card-text>
      </template>
    </page-iterator>
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
import Constant from "@/common/constant.js"
import gameApi from "@/api/game/gameApi.js"
import bbsApi from "@/api/bbs/bbsApi.js"
import PostSimple from '@/components/forum/PostSimple.vue'
import WangEditor from '@/components/WangEditor.vue'
import SimpleEditor from '@/components/SimpleEditor.vue'
import PostComment from './PostComment.vue'
import SimpleImage from "@/components/SimpleImage.vue"
import SimpleAvatar from "@/components/SimpleAvatar.vue"
import LuckDrawView from "./activity/LuckDrawView"
import PageIterator from '@/components/PageIterator.vue'
export default {
  components: {
    PostSimple,
    WangEditor,
    SimpleEditor,
    PostComment,
    SimpleImage,
    SimpleAvatar,
    LuckDrawView,
    PageIterator
  },
   data: () => ({
    Constant,
    //当前帖子的数据
    bbsData: {
      bbs: {etc: {}, circleId: null},
      content: {},
      user: {},
      resourceList: {}
    },
    //编辑回复时使用的数据
    replyData: {
      replyId: null,
      content: "",
      type: 0,  //0为对主题的回复，1为对评论的回复，2为对评论的回复的回复
    },

    postTypeDic: {},
    postStatusDic: {},
    
    loading: {
      thumbUp: false,
      like: false,
    },

    isManu: false,
  }),
  computed: {
    replyProvider() {
      if (this.bbsData.bbs != null && this.bbsData.bbs.id > 0) {
        return ({current, size}) => bbsApi.pageReply({current, size, bbsId: this.bbsData.bbs.id, type: 0})  //只显示对主题的回复
      }

      return null
    },
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  watch: {
    
  },
  methods: {
    submitReply() {
      if (!this.isLogin)
        return;

      bbsApi.writeReply({bbsId: this.bbsData.bbs.id, ...this.replyData})
      .then(res => {
        this.alert.success("发布成功");
        this.replyData.content = ""
        this.flushReplyList()
      })
      .catch(err => this.alert.error(err))
    },
    toUser(user) {
      this.$router.push({
        name: "game-forum-user",
        params: {id: user.id}
      })
    },
    flushReplyList() {
      this.$refs.it.flushList()
    },
    toggleThumbUp(post) {
      if (!this.isLogin) {
        this.alert.error("请先登陆")
        return;
      }
      this.loading.thumbUp = true;

      let thumbUp = !post.etc.thumbUp;

      bbsApi.giveThumbs(post.id, thumbUp)
      .then(res => {
        this.alert.success(thumbUp ? "点赞成功" : "取消点赞")
        post.etc.thumbUp = thumbUp;
        
        post.thumbsUpCount = thumbUp ? post.thumbsUpCount + 1 : post.thumbsUpCount - 1;

        this.loading.thumbUp = false;
      })
      .catch(err => {
        this.alert.error(err)
        this.loading.thumbUp = false;  
      });
    },
    toggleLike(post) {
      if (!this.isLogin) {
        this.alert.error("请先登陆")
        return;
      }
      this.loading.like = true;

      let like = !post.etc.like;

      bbsApi.follow(post.id, like)
      .then(res => {
        this.alert.success(like ? "收藏成功" : "取消收藏")
        post.etc.like = like;
 
        this.loading.like = false;
      })
      .catch(err => {
        this.alert.error(err)
        this.loading.like = false;  
      });
    },
  },
  mounted() {
    let bbsId = this.$router.currentRoute.params.id
    
    if (bbsId == null)
    {
      this.alert.error("没有这个帖子")
      return;
    }

    //获得帖子类型字典
    this.getDic("帖子类型")
    .then(res => {
      this.postTypeDic = res;
    })
    
    //获得帖子状态字典
    this.getDic("帖子状态")
    .then(res => {
      this.postStatusDic = res;
    })

    //得到帖子详情
    bbsApi.getById(bbsId)
    .then(res => {
      let bbs = res;
      this.bbsData.bbs = bbs;
      this.bbsData.user = bbs.etc.user;
      this.bbsData.content = bbs.etc.content;
      this.bbsData.resourceList = bbs.etc.resourceList

      this.isManufacturer({userId: this.bbsData.user.id, circleId: bbs.circleId})
      .then(res => {
        this.isManu = res
      })
    })
    .catch(err => {
      this.alert.error(err)
    })
  }
}
</script>