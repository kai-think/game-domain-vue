<template>
<div :id="editorId">

</div>
</template>
<script>
import E from 'wangeditor'
import axios from 'axios';
import uploadApi from '@/api/common/uploadApi';
import vueConfig from '@/../vue.config'

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: false,
      type: String
    },
    editorId: {
      required: false,
      type: String,
      default: 'wang-editor',
    },
    disable: {
      required: false,
      type: Boolean,
      default: false,
    },
    width: {
      required: false,
      type: Number,
    },
    height: {
      required: false,
      type: Number,
      default: 500
    },
  },
  data: () => ({
    editor: null
  }),
  methods: {

  },
  mounted() {
    let vm = this;
    this.editor = new E('#' + this.editorId);
    //设置高度为 500px
    this.editor.config.height = this.height

    //配置 z-index
    this.editor.config.zIndex = 0

    // 配置 onchange 回调函数
    this.editor.config.onchange = function (newHtml) {
      vm.$emit("change", newHtml)
    };

    // 配置触发 onchange 的时间频率，默认为 200ms
    this.editor.config.onchangeTimeout = 5000; // 修改为 5000ms

    //自定义上传图片
    this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      let reqList = [];
      for (let file of resultFiles) {
        let form = new FormData();
        form.append('file', file)
        reqList.push(uploadApi.image(form));
      }

      axios.all(reqList)
      .then(axios.spread((...responses) => {
        let proxy = vueConfig.devServer.proxy;
        let servletPath = Object.keys(proxy)[0];
        let imgUrls = [];
        responses.forEach(res => {
          imgUrls.push(servletPath + "/static" + res);
        })
        // 上传图片，返回结果，将图片插入到编辑器中
        insertImgFn(imgUrls)
      }))
    }

    this.editor.config.customUploadVideo = function (resultFiles, insertVideoFn) {
      // resultFiles 是 input 中选中的文件列表
      // insertVideoFn 是获取视频 url 后，插入到编辑器的方法
      let reqList = [];
      for (let file of resultFiles) {
        let form = new FormData();
        form.append('file', file)
        reqList.push(uploadApi.video(form));
      }

      axios.all(reqList)
      .then(axios.spread((...responses) => {
        let proxy = vueConfig.devServer.proxy;
        let servletPath = Object.keys(proxy)[0];
        let videoUrls = [];
        responses.forEach(res => {
          videoUrls.push(servletPath + "/static" + res);
        })
        // 上传图片，返回结果，将图片插入到编辑器中
        insertVideoFn(videoUrls)
      }))
    }

    this.editor.create()
    this.editor.txt.html(this.value) //重新设置编辑器内容

    if (this.disable)
    {
      this.editor.disable();
      this.editor.config.menus = [];
    }
  },
  watch: {
    disable(newVal, oldVal) {
      if (newVal)
        this.editor.disable();
      else
        this.editor.enable();
    },
    value(newVal, oldVal) {
      this.editor.txt.html(newVal) //重新设置编辑器内容
    },
  }
} 
</script>
<style lang="lass" scoped>

</style>