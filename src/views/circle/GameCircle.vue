<template>
<v-main class="pt-0">
  <v-container :class="{'none-max-width': bp.md, 'max-width-1185': bp.lg || bp.xl}">
    <simple-image :src="gameCircle.banner" :width="'100%'" :height="400" />
     <v-row class="mt-1">
        <v-col :cols="12" :sm="8">
          <v-card>
            <v-card-title class="d-flex align-center pt-2">
              {{ gameCircle.name }}

              <!-- 收藏按钮 -->
              <v-btn icon class="ml-4 mt-1" @click="toggleLike(gameCircle)" :disabled="loading.like" large>
                <v-icon color="#E53935">{{ gameCircle.etc.like ? "mdi-star" : "mdi-star-outline" }}</v-icon>
              </v-btn>
              
            </v-card-title>
            <v-card-text>
              <div>
                {{ gameCircle.introduction }}
              </div>
              <div class="text-right" v-if="isLogin">
                <v-btn color="primary" @click="toEditPage">发表文章</v-btn>
              </div>
            </v-card-text>

            <div class="d-flex justify-space-between align-center">
              <v-tabs v-model="currentTab">
                <v-tab @click="onTabsChange(idx)" v-for="(articleType, idx) in articleTypeDic.children" :key="articleType.id">
                  {{ articleType.name }}
                </v-tab>
                <v-tab @click="toForum">论坛</v-tab>
              </v-tabs>
            </div>
          
            <v-sheet class="pa-2">
              <page-iterator ref="pageIt" :provider="articleProvider" :flushOnCreated="false">
                <template #default="{records}">
                  <div v-for="(article, idx) in records" :key="article.id">
                    <simple-preview :cover="article.cover" :title="article.title" :subtitle="article.subtitle" @click:title="toArticle(article)">
                      <template #action>
                          <!-- 点赞按钮 -->
                          <div>
                            <thumb-up-btn-icon :thumbUp="article.etc.thumbUp" :count="article.thumbsUpCount" @click="toggleThumbUp(article)" :disabled="loading.thumbUp"/>
                          </div>
                          <!-- 回复按钮 -->
                          <div>
                            <v-btn icon class="ml-4">
                              <v-icon color="#0D47A1">mdi-message-reply-text</v-icon>
                            </v-btn>
                            <span class="text-subtitle-1 font-weight-bold">
                              {{ article.replyCount }}
                            </span>
                          </div>
                          <v-spacer />
                          <div class="indigo--text mr-3">
                            {{ formatDate(article.createTime).diffFormat }}
                          </div>
                      </template>
                    </simple-preview>
                  </div>
                </template>
              </page-iterator>
            </v-sheet>
          </v-card>
        </v-col>
        <v-col :cols="0" :sm="4" class="pl-0">
          <game-info-view :circle="gameCircle" :info="gameInfo" />
        </v-col>
      </v-row>
  </v-container>
</v-main>
</template>
<script>
import articleApi from "@/api/article/articleApi.js"
import gameApi from "@/api/game/gameApi.js"
import ImageWithTitle from '@/components/ImageWithTitle.vue'
import SimpleImage from '@/components/SimpleImage.vue'
import SimplePreview from '@/components/SimplePreview.vue'
import ThumbUpBtnIcon from '@/components/ThumbUpBtnIcon.vue'
import PageIterator from '@/components/PageIterator.vue'
import GameInfoView from "./subview/GameInfoView"
export default {
  components: {
    ImageWithTitle, SimpleImage, SimplePreview,
    ThumbUpBtnIcon, PageIterator,
    GameInfoView,
  },
  data: () => ({
    gameInfo: {},
    gameCircle: {etc: {like: false}},
    articleTypeDic: {},
    currentTab: 0,
    filter: {
      circleId: 0,
      type: 0,
    },
    total: 100,
    loading: {
      thumbUp: false,
      like: false,
    }
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    articleProvider() {
      return ({current, size}) => articleApi.page({current, size, ...this.filter})
    },
    bp() {
      return this.$vuetify.breakpoint;
    }
  },
  watch: {
    
  },
  methods: {
    onTabsChange(idx) {
      this.currentTab = idx;
      let articleType = this.articleTypeDic.children[idx];
      this.filter.type = articleType.value;
      if (this.filter.circleId)
        this.$refs.pageIt.resetList()
    },
    toForum() {
      this.$router.push({name: "game-forum", params: {id: this.gameCircle.id}})
    },
    toArticle(article) {
      this.$router.push({name: "game-circle-article", params: {id: article.id}});
    },
    toEditPage() {
      this.$router.push({name: "ArticleEditor", params: {id: this.gameCircle.id}});
    },
    toggleThumbUp(article) {
      if (!this.isLogin) {
        this.alert.error("请先登陆")
        return;
      }
      this.loading.thumbUp = true;

      let thumbUp = !article.etc.thumbUp;

      articleApi.giveThumbs(article.id, thumbUp)
      .then(res => {
        this.alert.success(thumbUp ? "点赞成功" : "取消点赞")
        article.etc.thumbUp = thumbUp;
        
        article.thumbsUpCount = thumbUp ? article.thumbsUpCount + 1 : article.thumbsUpCount - 1;

        this.loading.thumbUp = false;
      })
      .catch(err => {
        this.alert.error(err)
        this.loading.thumbUp = false;  
      });
    },
    toggleLike(circle) {
      if (!this.isLogin) {
        this.alert.error("请先登陆")
        return;
      }
      this.loading.like = true;

      let like = !circle.etc.like;

      gameApi.followCircle(circle.id, like)
      .then(res => {
        this.alert.success(like ? "收藏成功" : "取消收藏")
        circle.etc.like = like;
 
        this.loading.like = false;
      })
      .catch(err => {
        this.alert.error(err)
        this.loading.like = false;  
      });
    },
  },
  created() {
    let gameInfoId = this.$router.currentRoute.params.id

    if (gameInfoId == null)
    {
      this.alert.error("没有这个游戏")
      return;
    }

    //通过游戏id得到具体游戏信息与游戏圈信息
    gameApi.getGameInfoById(gameInfoId)
    .then(res => {
      // console.log("gameInfo", res)
      this.gameInfo = res;
      this.filter.circleId = this.gameInfo.circleId;
      
      //获得文章类型字典
      this.getDic("文章类型")
      .then(res => {
        this.articleTypeDic = res;
        this.onTabsChange(0)
      })
      
      gameApi.getGameCircleById(this.gameInfo.circleId)
      .then(res => {
        this.gameCircle = res;
      })
      .catch(err => {
        this.alert.error(err)
      })
    })
    .catch(err => {
      this.alert.error(err)
    })
  }
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