<template>
<v-card class="pa-3">
  <v-card-title>上传核酸报告</v-card-title>
  <v-divider></v-divider>
  <v-card-text>
    <v-file-input
      v-model="file"
      accept="image/*"
      label="上传图片"
    >
      <template v-slot:selection="{ text }">
        <v-chip
          small
          label
          color="primary"
        >
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>
  </v-card-text>
  <v-card-actions>
    <v-btn color="primary" @click="upload" class="ml-auto">上传</v-btn>
  </v-card-actions>
</v-card>
</template>
<script>
import uploadApi from "@/api/common/uploadApi.js"
export default {
  emit: ["success"],
  data: () => ({
    file: null,
    menu: false,
    date: "",
  }),
  methods: {
    upload() {
      if (this.file == null)
      {
        this.alert.error("没有选择图片");
        return;
      }

      if (this.date == "")
      {
        this.alert.error("没有填写日期");
        return;
      }

      uploadApi.image({
        file: this.file,
      })
      .then(res => {
        this.alert.success("上传成功");
        this.$emit("success")
        this.file = null
        this.date = ""
      })
      .catch(err => this.alert.error(err))
    }
  }
}
</script>