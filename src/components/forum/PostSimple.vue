<template>
<v-main class="pt-0">
  <v-container class="px-0 py-1">
    <v-card flat>
      <v-card-title>
        <v-row>
          <v-col cols="1" class="pa-2" justify="center" align-self="center">
            <simple-avatar :src="user.avatar" width="52" height="52"  />
          </v-col>
          <v-col cols="11">
            <div class="text-h6 user-name" @click="toUser">{{ user.nickname }}</div>
            <div class="text-body-2">{{ formatDate(post.createTime).diffFormat }}</div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-title class="pt-0 text-h6 post font-weight-bold pb-0" @click="toPostDetail">
        {{ post.title }}
      </v-card-title>
      <v-card-subtitle class="text-subtitle-1 mt-1 pb-1"  @click="toPostDetail">
        {{ post.subtitle }}
      </v-card-subtitle>
      <v-card-subtitle class="pl-5">
        <v-row>
          <v-col v-for="(src, idx) in srcList" :key="idx" cols="3" class="pa-1">
            <simple-image :src="src" height="140"></simple-image>
            <!-- <v-img :src="src" height="140" class="rounded"></v-img> -->
          </v-col>
        </v-row>
      </v-card-subtitle>

      <v-card-text>
        <v-row align="center" justify="end">
          <v-btn icon class="ml-4" @click="toggleThumbUp(post)" :disabled="loading.thumbUp">
            <v-icon color="#0D47A1">{{ post.etc.thumbUp ? "mdi-thumb-up" : "mdi-thumb-up-outline" }}</v-icon>
          </v-btn>
          <span class="text-subtitle-1 font-weight-bold">
            {{ post.thumbsUpCount }}
          </span>
          <!-- 回复按钮 -->
          <div>
            <v-btn icon class="ml-4" @click="toPostDetail">
              <v-icon color="#0D47A1">mdi-message-reply-text</v-icon>
            </v-btn>
            <span class="text-subtitle-1 font-weight-bold">
              {{ post.replyCount }}
            </span>
          </div>
          <slot name="action-extra"></slot>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</v-main>
</template>
<script>
import bbsApi from "@/api/bbs/bbsApi.js"
import SimpleImage from '../SimpleImage.vue';
import SimpleAvatar from "@/components/SimpleAvatar.vue"
export default {
  emits: ["to-user", "to-post-detail"],
  props: {
    post: {
      required: true,
      type: Object
    },
    user: {
      required: true,
      type: Object
    },
    postResourceList: {
      required: false,
      type: Array,
      default: []
    },
  },
  components: {
    SimpleImage, SimpleAvatar
    
  },
  data: () => ({
    loading: {
      thumbUp: false,
    }
  }),
  computed: {
    srcList() {
      return this.postResourceList.map(resource => resource.url);
    },
    isLogin() {
      return this.$store.getters.isLogin;
    }
  },
  watch: {
    
  },
  methods: {
    toUser() {
      this.$emit("to-user", this.user);
    },
    toPostDetail() {
      this.$emit("to-post-detail", this.post);
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
  },
}
</script>
<style lang="scss" scoped>
.user-name {
  cursor: pointer;
  &:hover {
    color: #1E88E5;
  } 
}

.post {
  cursor: pointer;
}
</style>