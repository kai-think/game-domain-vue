<template>
  <v-card>
    <v-card-title>{{circle.name}}</v-card-title>
    <v-divider />
    <v-card-text class="pa-2">
      <v-row>
        <v-col cols="5" class="pr-0">
          <simple-image :src="info.cover" :width="'100%'" :height="134" />
        </v-col>
        <v-col cols="7">
          <div>
            <span>
              游戏类型：
            </span>
            <span>
              {{info.category}}
            </span>
          </div>
          <div>
            <span>
              游戏制作：
            </span>
            <span>
              {{info.producer}}
            </span>
          </div>
          <div>
            <span>
              游戏发行：
            </span>
            <span>
              {{info.distributor}}
            </span>
          </div>
          <div>
            <span>
            游戏平台：
            </span>
            <span>
              {{info.platform}}
            </span>
          </div>
          <div>
            <span>
            上市时间：
            </span>
            <span>
              {{ formatDate(info.releaseDate).date }}
            </span>
          </div>
          <div>
            <span>
            官方网址：
            </span>
            <a :href="info.officialWebsite" target="_blank">
              点击进入
            </a>
          </div>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <div>游戏介绍：</div>
      <p style="text-indent: 2em" class="mt-1">
        {{info.introduction}}
      </p>
    </v-card-text>
  </v-card>
</template>
<script>
import userApi from "@/api/user/userApi.js"
import SimpleImage from '@/components/SimpleImage.vue'
export default {
  components: { SimpleImage },
  props: {
    circle: {
      required: true,
      type: Object,
      default: {}
    },
    info: {
      required: true,
      type: Object,
      default: {}
    }
  },
  watch: {

  },
  data: () => ({
    
  }),
  methods: {
    
  },
  created() {
    
  }
}
</script>