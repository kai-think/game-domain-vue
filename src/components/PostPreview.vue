<template>
<v-main class="pt-0">
  <v-container class="px-0 py-1">
    <v-card flat>
      <v-card-title>
        <v-row>
          <simple-avatar :src="post.etc.user.avatar" width="52" height="52"  />

          <div class="ml-4">
            <div class="text-h6 user-name d-flex align-center" @click="toUser(post.etc.user)">
              <v-chip color="yellow darken-2" dark small class="mr-2" v-if="isManufacturer(post.etc.user)">官方</v-chip>
              <div>
                {{ post.etc.user.nickname }}
              </div>
              
            </div>
            <div class="text-body-2">{{ formatDate(post.createTime).diffFormat }}</div>
          </div>
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
          <div v-if="showThumbUp">
            <v-btn icon class="ml-4" @click="toggleThumbUp(post)" :disabled="loading.thumbUp">
              <v-icon color="#0D47A1">{{ post.etc.thumbUp ? "mdi-thumb-up" : "mdi-thumb-up-outline" }}</v-icon>
            </v-btn>
            <span class="text-subtitle-1 font-weight-bold">
              {{ post.thumbsUpCount }}
            </span>
          </div>
          <!-- 回复按钮 -->
          <div v-if="showReply">
            <v-btn icon class="ml-4" @click="toPostDetail">
              <v-icon color="#0D47A1">mdi-message-reply-text</v-icon>
            </v-btn>
            <span class="text-subtitle-1 font-weight-bold">
              {{ post.replyCount }}
            </span>
          </div>
          <div v-if="showEdit">
            <v-btn icon class="ml-4" @click="toEdit(post)">
              <v-icon color="red">mdi-pencil</v-icon>
            </v-btn>
          </div>
          <div v-if="showLike">
            <v-btn icon class="ml-4" @click="toggleLike(post)" :disabled="loading.like">
              <v-icon color="red">{{ post.etc.like ? "mdi-star" : "mdi-star-outline" }}</v-icon>
            </v-btn>
          </div>
          <div v-if="showDelete">
            <v-btn icon class="ml-4" @click="deletePost(post)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</v-main>
</template>
<script>
import bbsApi from "@/api/bbs/bbsApi.js"
import SimpleImage from '@/components/SimpleImage.vue';
import SimpleAvatar from "@/components/SimpleAvatar.vue"
export default {
  emits: ["to-user"],
  props: {
    post: {
      required: true,
      type: Object,
      default: {etc: {resourceList: []}}
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
      return this.post.etc.resourceList.map(resource => resource.url);
    },
    isLogin() {
      return this.$store.getters.isLogin;
    }
  },
  watch: {
    
  },
  methods: {
    isManufacturer(user) {
      let manufacturer = this.$store.state.manufacturerMap[user.id]
      if (manufacturer == null) 
        return false;
      
      return manufacturer.circleId == this.post.circleId
    },
    toUser(user) {
      this.$router.push({
        name: "OtherPersonCircle",
        params: {userId: user.id}
      })
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
    toPostDetail() {
      this.$router.push({
        name: "game-forum-post",
        params: {id: this.post.id}
      })
    },
    deletePost(post) {
      this.showConfirmDialog('确认删除',  post.title + " ?", 
        () => {
          bbsApi.delete(post.id)
          .then(res => {
            this.alert.success("删除成功")
            this.$emit("delete")
          })
          .catch(err => this.alert.error(err))
        }
      )
    },
    toEdit(post) {
      this.$router.push({name: "PostEditor", params: {postId: post.id}});
    }
  },
  mounted() {

  }
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