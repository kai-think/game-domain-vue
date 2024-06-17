<template>
<v-container :class="{'none-max-width': bp.md, 'max-width-1185': bp.lg || bp.xl}">
  <v-row>
    <v-col :cols="12" :sm="8">
      <v-card>
        <v-card-title class="d-flex align-stretch flex-nowrap">
          <simple-image :src="gameForum.cover" width="120px" height="120px" />
          <div class="d-flex flex-column justify-space-between flex-grow-1">
            <v-card-title class="d-flex justify-space-between align-center py-0">
              <div>
                论坛: {{ gameForum.name }}
              </div>
              <!-- 收藏按钮 -->
              <v-btn icon class="ml-4" @click="toggleLike(gameForum)" :disabled="loading.like" large>
                <v-icon color="#E53935">{{ gameForum.etc.like ? "mdi-star" : "mdi-star-outline" }}</v-icon>
              </v-btn>
              <v-spacer />
              <div v-if="isLogin">
                <v-btn color="primary" @click="toPostEditor">发帖</v-btn>
              </div>
            </v-card-title>
            <v-card-text class="text-body-2" style="max-height: 42px; text-overflow: ellipsis; overflow: hidden;">
              介绍: {{ gameForum.introduction }}
            </v-card-text>
            <v-card-text class="py-0 text-overline">
              帖子数量：{{ gameForum.postNum }}
              关注：{{ gameForum.likeNum }}
            </v-card-text>
          </div>
        </v-card-title>

        <v-tabs>
          <v-tab @click="onTabsChange(idx)" v-for="(section, idx) in sectionList" :key="section.id">
            {{ section.name }}
          </v-tab>
          
          <v-spacer />
          <div style="line-height: 3" class="mr-4">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  text
                >
                  {{ sortType == 0 ? '回复时间' : '发帖时间'}}
                </v-btn>
              </template>
              <v-list>
                <v-list-item link @click="changeSortType(0)">
                  <v-list-item-title>回复时间</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="changeSortType(1)">
                  <v-list-item-title>发帖时间</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-tabs>
      </v-card>
      
      <v-card class="mt-2 px-6">
        <page-iterator ref="pageIt" :provider="postPageProvider" :flushOnCreated="false">
          <template #default="{records}">
            <div v-for="(p, idx) in records" :key="p.id">
              <post-preview :post="p" />
              <v-divider class="mt-3" />
            </div>
          </template>
        </page-iterator>
      </v-card>
    </v-col>
    <v-col :cols="0" :sm="4">
      <forum-top-post :forum="gameForum"></forum-top-post>

      <forum-ongoing-activities :forum="gameForum" class="mt-4" />

      <forum-admin-list class="mt-4" :forum="gameForum" />
    </v-col>
  </v-row>
</v-container>
</template>
<script>
import gameApi from "@/api/game/gameApi.js"
import bbsApi from "@/api/bbs/bbsApi.js"
import PostSimple from '@/components/forum/PostSimple.vue'
import PageIterator from '@/components/PageIterator.vue'
import PostPreview from '@/components/PostPreview.vue';
import ForumTopPost from './subview/ForumTopPost.vue'
import ForumAdminList from './subview/ForumAdminList.vue'
import ForumOngoingActivities from './subview/ForumOngoingActivities.vue'
import SimpleImage from '@/components/SimpleImage.vue'
export default {
  components: {
    PostSimple,
    PageIterator,
    ForumTopPost,
    PostPreview,
    ForumAdminList,
    ForumOngoingActivities,
    SimpleImage
  },
  data: () => ({
    circleId: null,
    gameForum: {etc: {like: false}},
    postTypeDic: {},
    postStatusDic: {},
    sectionList: [],
    currentSection: {},

    postFilter: {
      sectionId: 0,
    },
    post: {
      data: [],
      total: 100,
    },
    sortType: 0,  //0：回复时间降序，1：发帖时间降序
    loading: {
      like: false
    }
  }),
  computed: {
     isLogin() {
      return this.$store.getters.isLogin;
    },
    postPageProvider() {
      let params = {...this.postFilter};
      if (!params.sectionId)
        return null;

      switch (this.sortType) {
        case 0:
          params.descByLastReplyTime = true;
          break;
        case 1:
          params.descByCreateTime = true;
          break;
      }

      return ({current, size}) => bbsApi.page({current, size, ...params})
    },
    bp() {
      return this.$vuetify.breakpoint;
    }
  },
  watch: {
    
  },
  methods: {
    changeSortType(type) {
      if (type == this.sortType)
        return;

      this.sortType = type;
      switch (this.sortType) {
        case 0:
          
          break;
        case 1:

          break;
      }
    },
    toPostEditor() {
      let forum = this.gameForum;
      this.$router.push(`/forum/${forum.id}/post/edit`)
    },
    onTabsChange(idx) {
      if (this.sectionList.length <= idx)
      {
        this.alert.error("板块出界")
        return;
      }
      this.currentSection = this.sectionList[idx];
      this.postFilter.sectionId = this.currentSection.id

      //刷新帖子
      // this.resetPostList();
    },
    resetPostList() {
      this.$refs.pageIt.resetList()
    },
    toPostDetail(post) {
      this.$router.push({
        name: "game-forum-post",
        params: {id: post.id}
      })
    },
    toggleLike(forum) {
      if (!this.isLogin) {
        this.alert.error("请先登陆")
        return;
      }
      this.loading.like = true;1

      let like = !forum.etc.like;

      bbsApi.followForum(forum.id, like)
      .then(res => {
        this.alert.success(like ? "收藏成功" : "取消收藏")
        forum.etc.like = like;
 
        this.loading.like = false;
      })
      .catch(err => {
        this.alert.error(err)
        this.loading.like = false;  
      });
    },
  },
  mounted() {
    let gameCircleId = this.$router.currentRoute.params.id
    
    if (gameCircleId == null)
    {
      this.alert.error("没有这个游戏圈")
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

    //得到论坛
    bbsApi.getForumByCircleId(gameCircleId)
    .then(res => {
      this.gameForum = res;

      //得到论坛板块列表
      bbsApi.listForumSection(this.gameForum.id)
      .then(res => {
        this.sectionList = res;
        this.onTabsChange(0);
      })
      .catch(err => this.alert.error(err))
    })
    .catch(err => {
      this.alert.error(err)
    })
  },
}
</script>
<style lang="scss">
.none-max-width {
  max-width: none;
}

.max-width-1185 {
  max-width: 1185px;
}
</style>