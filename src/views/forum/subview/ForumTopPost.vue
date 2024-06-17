<template>
  <v-card>
    <v-card-title>热门帖子</v-card-title>
    <v-divider />
    <v-list>
      <v-list-item v-for="(p, idx) in topPostList" :key="p.id">
        <v-btn color="orange" outlined small class="px-1" @click="toPostDetail(p)">
          <v-icon>mdi-pin</v-icon>
          置顶
        </v-btn>
        <!-- <strong class="red lighten-4 rounded red--text text--darken-1 text-center" style="width: 50px">置顶</strong> -->
        <div class="ml-1" style="white-space: nowrap; width: 100%; overflow: hidden; text-overflow: ellipsis; cursor: pointer;"  @click="toPostDetail(p)">
          {{ p.title }}
        </div>
      </v-list-item>
    </v-list>

    <v-list>
      <v-list-item v-for="(p, idx) in hotPostList" :key="p.id" class="d-flex align-start mb-6" style="width: 100%">
        <div>
          <v-btn color="red" outlined small class="px-1" @click="toPostDetail(p)">
            <v-icon>mdi-fire</v-icon>
            热门
          </v-btn>
        </div>
        <div class="d-flex flex-column ml-3" style="width: 100%">
          <!-- <strong class="red lighten-4 rounded red--text text--darken-1 text-center" style="width: 50px">置顶</strong> -->
          <div style="white-space: nowrap; width: calc(100% - 72px); overflow: hidden; text-overflow: ellipsis; cursor: pointer;" @click="toPostDetail(p)">
            {{ p.title }}
          </div>

          <div class="d-flex text-subtitle-2 mt-2" style="width: 100%;">
            <div>
              <v-icon small color="blue">mdi-eye</v-icon>
              <span class="ml-1">
                {{ p.viewNum }}
              </span>
            </div>
            <div class="ml-3">
              <v-icon small color="red">mdi-fire</v-icon>
              <span class="ml-1">{{ p.hotNum }} </span>
            </div>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
import bbsApi from "@/api/bbs/bbsApi.js"
export default {
  props: {
    forum: {
      required: true,
      type: Object,
      default: {}
    }
  },
  data: () => ({
    topPostList: [],
    hotPostList: [],
  }),
  watch: {
    forum(newVal) {
      if (newVal.id) {
        this.getList()
      }
    }
  },
  methods: {
    toPostDetail(post) {
      this.$router.push({
        name: "game-forum-post",
        params: {id: post.id}
      })
    },
    getList() {
      bbsApi.page({
        current: 1,
        size: 3,
        forumId: this.forum.id,
        topping: true,
      })
      .then(res => {
        this.topPostList = res.records
      })
      .catch(err => {
        this.alert.error(err)
      })

      bbsApi.page({
        current: 1,
        size: 5,
        forumId: this.forum.id,
        descByHotNum: true,
      })
      .then(res => {
        this.hotPostList = res.records
      })
      .catch(err => {
        this.alert.error(err)
      })
    },
  },
  created() {
    if (this.forum.id) {
      this.getList()
    }
  }
}
</script>