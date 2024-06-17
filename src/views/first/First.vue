<template>
<v-main class="grey lighten-4 pt-0">
  <v-container>
    <v-carousel 
      v-model="carousel.model"  
      cycle
      height="400"
    >
      <v-carousel-item
        v-for="(src, i) in formattedSrcList"
        :key="i"
      >
        <v-sheet
          height="100%"
          tile
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
            <!-- <div class="text-h2">
              Slide {{ i + 1 }}
            </div> -->
            <v-img :src="src" />
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

    <v-card-subtitle class="px-0">
      <v-text-field hide-details outlined v-model="search.name" label="搜索" append-icon="mdi-send" @click:append="searchGame"></v-text-field>
    </v-card-subtitle>

    <v-tabs>
      <v-tab @click="onTabsChange(idx)" v-for="(category, idx) in dic.category.children" :key="category.id">{{category.name}}</v-tab>
    </v-tabs>
    <v-sheet class="pa-2">
      <v-row>
          <v-col
            v-for="(gameInfo, idx) in gameList"
            :key="`${gameInfo.id}`"
            cols="6"
            md="3"
          >
            <div>
              <image-with-title :src="gameInfo.cover" :title="gameInfo.name" @click="toGameCircle(gameInfo.id)"></image-with-title>
            </div>
        </v-col>
      </v-row>
    </v-sheet>

    <v-card class="mt-2" v-show="search.show">
      <v-card-title>
        搜索结果
      </v-card-title>
      <v-divider />
      <v-card-text>
        <page-iterator ref="searchPageIt" :provider="searchProvider" :flushOnCreated="false">
          <template #default="{records}">
            <simple-preview :cover="item.cover" :title="item.name" :subtitle="item.introduction" v-for="(item) in records" :key="item.id" @click:title="toGameCircle(item.id)">
              <template #action>
                <div class="text-body-outline ml-2 red--text darken-5"> {{ formatCategory(item.category).name }}</div>
              </template>
            </simple-preview>
          </template>
        </page-iterator>
      </v-card-text>
    </v-card>
  </v-container>
</v-main>
</template>
<script>

import gameApi from "@/api/game/gameApi.js"
import ImageWithTitle from '../../components/ImageWithTitle.vue';
import SimpleImage from '../../components/SimpleImage.vue';
import PageIterator from '../../components/PageIterator.vue';
import SimplePreview from '../../components/SimplePreview.vue';
export default {
  components: {
    ImageWithTitle,
    SimpleImage,
    PageIterator,
    SimplePreview
  },
  data: () => ({
    carousel: {
      model: 0,
      srcs: [
        '/image/2166988_115638_1.jpg',
        '/image/cover%20-%20180e71b1cad.jpg',
        '/image/202106111511085807.jpg',
        '/image/cover%20-%20180e71d3e7e.jpg',
      ],
    },
    search: {
      show: false,
      name: "",
      list: [],
    },
    dic: {
      classification: {children: []},
      category: {children: []},
    },
    gameList: [],
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    formattedSrcList() {
      let srcs = [];
      for (let src of this.carousel.srcs) {
        srcs.push(this.formatSrc(src))
      }

      return srcs
    },
    searchProvider() {
      return ({current, size}) => gameApi.pageGameInfo({name: this.search.name, current, size});
    },
  },
  watch: {
    
  },
  methods: {
    onTabsChange(idx) {
      let category = this.dic.category.children[idx];
      console.log("category", category)
      this.getGameList(1, category.value)
    },
    getGameList(classification, category) {
      gameApi.pageGameInfo({classification, category})
      .then(res => {
        console.log("res.records", res.records)
        this.gameList = res.records;
      })
    },
    toGameCircle(id) {
      console.log("gameInfoId", id);
      this.$router.push({ name: 'game-circle', params: { id } })
      // this.$router.push({ name: "circle", params: { id: id } });
    },
    searchGame() {
      this.search.show = true
      this.$refs.searchPageIt.flushList();
    },
    formatClassification(value) {
      return this.dic.classification.children.find(cl => cl.value == value)
    },
    formatCategory(value) {
      return this.dic.category.children.find(cl => cl.value == value)
    },
  },
  mounted() {
    this.getDic("游戏分类")
    .then(res => {
      console.log("res", res)
      this.dic.classification = res;
    })

    this.getDic("游戏类型")
    .then(res => {
      console.log("res", res)
      this.dic.category = res;
      this.onTabsChange(0)
    })
  }
}
</script>
<style lang="sass">

</style>