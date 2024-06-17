<template>
<v-main class="pt-0">
  <v-container>
    <v-card-title class="d-flex align-baseline pb-0">
      <div class="text-h5">
        {{forum.name}}
      </div>
      <div class="ml-8" style="width: 100px">
        <v-select class="pa-auto" dense placeholder="版块" hide-detail outlined :items="sectionList" item-text="name" item-value="id" v-model="postForm.sectionId"></v-select>
      </div>
      <div class="ml-8" style="width: 100px">
        <v-select class="pa-auto" dense placeholder="类型" hide-detail outlined :items="typeList" item-text="name" item-value="value" v-model="postForm.type" @change="onTypeChange"></v-select>
      </div>
      <div class="ml-8" style="width: 150px" v-if="postForm.type == -1">
        <v-select class="pa-auto" dense placeholder="活动类型" hide-detail outlined :items="activityTypeList" item-text="name" item-value="value" v-model="activity.type"></v-select>
      </div>
    </v-card-title>

    <div v-if="activity.type == 3">
      <v-row>
        <v-col>
          <date-time-picker :labelDate="'开始日期'" :labelTime="'开始时间'" v-model="activity.startTime" />
        </v-col>
        <v-col>
          <date-time-picker :labelDate="'结束日期'" :labelTime="'结束时间'" v-model="activity.endTime" />
        </v-col>
      </v-row>
      
      <luck-draw-editer @change="onLuckDrawChange" ref="luckDraw"/>
    </div>

    <image-input v-model="coverFile" :height="400" :initSrc="postForm.cover">
      <template #overlay>
        <v-icon large>mdi-tray-arrow-up</v-icon>
        上传头图
      </template>
    </image-input>
    
    <div class="mt-2">
      <v-card-title>上传推荐图</v-card-title>
      <muliple-image-input v-model="resourceFileList" :width="300" :height="200" :max-size="3" :initSrcList="resourceSrcList"></muliple-image-input>
    </div>

    <br/>
   
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field outlined label="标题" v-model="postForm.title"></v-text-field>
      </v-col>
      <v-col cols="12" md="8">
        <v-text-field outlined label="子标题" v-model="postForm.subtitle"></v-text-field>
      </v-col>
    </v-row>

    <wang-editor v-model="postContent"></wang-editor>

    <v-card-actions class="d-flex justify-end">
      <v-btn color="success" @click="saveDraft" :disabled="loading">保存草稿</v-btn>
      <v-btn color="primary" @click="beforePublish" :disabled="loading">发布</v-btn>
    </v-card-actions>

  </v-container>
</v-main>
</template>
<script>
import WangEditor from "../../components/WangEditor.vue"
import bbsApi from "@/api/bbs/bbsApi.js"
import uploadApi from "@/api/common/uploadApi.js"
import ImageInput from '../../components/ImageInput.vue'
import MulipleImageInput from '../../components/MulipleImageInput.vue'
import LuckDrawEditer from "./activity/LuckDrawEditer.vue"
import DateTimePicker from '../../components/DateTimePicker.vue'
export default {
  components: {
    WangEditor, ImageInput, MulipleImageInput,
    LuckDrawEditer,
    DateTimePicker
  },
  data: () => ({
    forum: {},
    sectionList: [],
    typeList: [
      {name: "普通", value: 0},
      {name: "活动", value: -1}
    ],
    activityTypeList: [
      {name: "幸运抽奖", value: 3}
    ],
    post: {},
    postForm: {
      circleId: null,
      forumId: null,
      sectionId: null,
      title: "",
      subtitle: "",
      cover: "",
      type: 0,  //帖子的类型，比如0为普通帖子，1为官方帖子，2为精华帖子，-1为活动
      status: 0,  //帖子状态，0：草稿，1：已发布，-1：用户删除，-2：管理员删除
    },
    //当帖子为活动时，使用该数据
    activity: {
      id: null,
      bbsId: null,
      type: null,   //0：没有活动 1：竞猜 2：投票 3：抽奖
      startTime: new Date(),
      endTime: new Date(),
      join_num: 0,
      status: 0,  //活动状态，0：新建 1：开始 2：结束 -1：中断
    },
    postContent: "",  //帖子内容

    resourceFileList: [],
    coverFile: null,
    resourceSrcList: [],

    loading: false,
  }),
  computed: {

  },
  watch: {
    
  },
  methods: {
    onTypeChange(type) {
      if (type != -1)
        this.activity.type = 0;
    },
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
      this.postForm.cover = result
    },
    async uploadResourceList() {
      let fileList = this.resourceFileList;
      
      for (let i in fileList) {
        let file = fileList[i]
        let formData = new FormData();
        formData.append("file", file)

        let result = await uploadApi.image(formData)
        console.log("result", result)
        this.resourceSrcList[i] = result
        this.alert.success("上传资源图" + i + " 成功");
      }
    },
    async saveDraft() {
      this.postForm.status = 0;
      
      this.loading = true;
      await this.uploadCover();
      await this.uploadResourceList();

      this.publish()
    },
    async beforePublish() {
      this.postForm.status = 1;

      this.loading = true;
      await this.uploadCover();
      await this.uploadResourceList();

      this.publish()
    },
    publish() {
      let resourceList = this.resourceSrcList.map(src => ({url: src, type: 0, absolute: false}));

      if (this.postForm.type === -1) {
        if (!this.$refs.luckDraw.validate()) {
          this.alert.error("验证失败")
          this.loading = false;
          return;
        }
        if (this.activity.type === 3) {
          let luckDraw = this.$refs.luckDraw.getLuckDraw();
          bbsApi.publishActivityLuckDraw({
            bbs: this.postForm, 
            content: this.postContent, 
            activity: this.activity, 
            luckDraw: luckDraw, 
            resourceList: resourceList
          })
          .then(res => {
            if (this.postForm.status == 0) {
              this.alert.success("保存成功");
            } else if (this.postForm.status == 1) {
              this.alert.success("发布成功");
              this.$router.go(-1)
            }
            this.loading = false;
          })
          .catch(err => {
            this.alert.error(err)
            this.loading = false;
          })
        }
      }
      else {
        bbsApi.publish(this.postForm, this.postContent, resourceList)
        .then(res => {
          if (this.postForm.status == 0) {
            this.alert.success("保存成功");
          } else if (this.postForm.status == 1) {
            this.alert.success("发布成功");
            this.$router.go(-1)
          }
          this.loading = false;
        })
        .catch(err => {
          this.alert.error(err)
          this.loading = false;
        })
      }
    },
    onClickCover() {
      console.log(this.$refs.inputCover)
      this.$refs.inputCover.focus();
      
    },
    onLuckDrawChange(luckDraw) {
      console.log("accept luckDraw", luckDraw)
    },
    getForumById(forumId) {
      bbsApi.getForumById(forumId)
      .then(res => {
        this.forum = res;
        this.postForm.forumId = res.id;
        this.postForm.circleId = res.circleId
      })
      .catch(err => this.alert.error(err))
    },
    getSectionListByFormId(forumId) {
      //得到论坛板块列表
      bbsApi.listForumSection(forumId)
      .then(res => {
        this.sectionList = res;
      })
      .catch(err => this.alert.error(err))
    }
  },
  mounted() {
    
    //编辑模式
    let postId = this.$router.currentRoute.params.postId
    if (postId != null && postId > 0) {
      bbsApi.getById(postId)
      .then(res => {
        this.post = res
        this.postContent = this.post.etc.content.content
        
        this.postForm = {
          id: res.id,
          forumId: res.forumId,
          sectionId: res.sectionId,
          circleId: res.circleId,
          title: res.title,
          subtitle: res.subtitle,
          type: res.type, //0为资讯，1为攻略，2为资源，3为视频
          cover: res.cover,
        }

        let resourceList = this.post.etc.resourceList;
        this.resourceSrcList = resourceList.map(r => r.url)

        this.getForumById(res.forumId)
        this.getSectionListByFormId(res.forumId)
      })
      .catch(err => {
        this.alert.error(err)
      })

      return;
    }

    //新增文章模式
    let forumId = this.$router.currentRoute.params.id
    if (forumId == null)
    {
      this.alert.error("无效论坛");
      return;
    }

    this.getForumById(forumId)
    this.getSectionListByFormId(forumId)
  }
}
</script>