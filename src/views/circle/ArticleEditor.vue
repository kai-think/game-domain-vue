<template>
<v-main class="pt-0">
  <v-container>
    <v-card-title class="d-flex align-baseline pb-0">
      <div class="text-h5">
        {{circle.name}}
      </div>
      <div class="ml-8" style="width: 100px">
        <v-select class="pa-auto" dense placeholder="类型" hide-detail outlined :items="typeList" item-text="name" item-value="value" v-model="articleForm.type"></v-select>
      </div>
    </v-card-title>

    <image-input v-model="coverFile" :initSrc="article.cover" :height="200">
      <template #overlay>
        <v-icon large>mdi-tray-arrow-up</v-icon>
        上传封面
      </template>
    </image-input>
    <br/>
   
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field outlined label="标题" v-model="articleForm.title"></v-text-field>
      </v-col>
      <v-col cols="12" md="8">
        <v-text-field outlined label="子标题" v-model="articleForm.subtitle"></v-text-field>
      </v-col>
    </v-row>

    <wang-editor v-model="articleContent"></wang-editor>

    <v-card-actions class="d-flex justify-end">
      <v-btn color="success" @click="saveDraft" :disabled="loading">保存草稿</v-btn>
      <v-btn color="primary" @click="beforePublish" :disabled="loading">发布</v-btn>
    </v-card-actions>

  </v-container>
</v-main>
</template>
<script>
import WangEditor from "@/components/WangEditor.vue"
import gameApi from "@/api/game/gameApi.js"
import articleApi from "@/api/article/articleApi.js"
import uploadApi from "@/api/common/uploadApi.js"
import ImageInput from '@/components/ImageInput.vue'
import MulipleImageInput from '@/components/MulipleImageInput.vue'
export default {
  components: {
    WangEditor, ImageInput, MulipleImageInput,
  },
  data: () => ({
    typeList: [
      {name: "普通", value: 0},
      {name: "活动", value: -1}
    ],
    circle: {},
    article: {},  //如果是草稿的话，会有这个属性

    articleForm: {
      userId: null,
      circleId: null,
      title: null,
      subtitle: null,
      type: null, //0为资讯，1为攻略，2为资源，3为视频
      cover: null,
      status: 0,
    },

    articleContent: "",  //文章内容

    coverFile: null,
    loading: false,
  }),
  methods: {
    async uploadCover() {
      let file = this.coverFile;
      if (file == null)
      {
        this.alert.error("没有选择图片");
        return;
      }
      let formData = new FormData();
      formData.append("file", file)
      let result = await uploadApi.bigImage(formData)

      console.log("result", result)
      this.alert.success("上传头图成功");
      this.articleForm.cover = result
    },
    async saveDraft() {
      //草稿状态
      this.loading = true;
      await this.uploadCover();

      this.articleForm.status = 0; 
      articleApi.publish(this.articleForm, this.articleContent)
      .then(res => {
        this.alert.success("保存成功");
        this.loading = false;
      })
      .catch(err => {
        this.alert.error(err)
        this.loading = false;
      })
    },
    async beforePublish() {
      this.loading = true;
      await this.uploadCover();

      this.articleForm.status = 1;  //已发布状态
      articleApi.publish(this.articleForm, this.articleContent)
      .then(res => {
        this.loading = false;
        this.alert.success("发布成功");
        this.$router.go(-1)
      })
      .catch(err => {
        this.loading = false;
        this.alert.error(err)
      })
    },
    getGameCircle(circleId) {
      gameApi.getGameCircleById(circleId)
      .then(res => {
        this.circle = res;
        this.articleForm.circleId = res.id
      })
      .catch(err => {
        this.alert.error(err)
      })
    }
  },
  mounted() {
    //得到文章类型字典列表
    this.getDic("文章类型")
    .then(res => {
      this.typeList = res.children;
    })
    .catch(err => this.alert.error(err))

    //编辑文章模式
    let articleId = this.$router.currentRoute.params.articleId
    if (articleId != null && articleId > 0) {
      articleApi.getById(articleId)
      .then(res => {
        this.article = res
        this.articleContent = this.article.etc.content.content

        this.articleForm = {
          id: res.id,
          userId: res.userId,
          circleId: res.circleId,
          title: res.title,
          subtitle: res.subtitle,
          type: res.type, //0为资讯，1为攻略，2为资源，3为视频
          cover: res.cover,
        }

        this.getGameCircle(this.article.circleId)
      })
      .catch(err => {
        this.alert.error(err)
      })

      return;
    }
    //新增文章模式
    let circleId = this.$router.currentRoute.params.id
    if (circleId == null)
    {
      this.alert.error("无效论坛");
      return;
    }
    this.getGameCircle(circleId)
  }
}
</script>