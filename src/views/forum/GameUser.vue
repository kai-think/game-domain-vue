<template>
<v-main class="pt-0">
  <v-container>
    <v-card>
      <v-card-title>GameUser</v-card-title>
      <v-card-subtitle></v-card-subtitle>
      <v-divider />
      <v-card-text>
        
      </v-card-text>
    </v-card>
  </v-container>
</v-main>
</template>
<script>
import articleApi from "@/api/article/articleApi.js"
export default {
  components: {
    
  },
  data: () => ({
    article: {title: "这是文章标题", subtitle: "副标题"},
    content: {content: "<h5>一大串html</h5>"},
  }),
  computed: {

  },
  watch: {
    
  },
  methods: {
    
  },
  mounted() {

  }
}
</script>