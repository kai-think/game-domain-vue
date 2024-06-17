<template>
<v-sheet>
  <v-textarea
    clearable
    dense
    filled
    rows="2"
    label="回复内容"
    v-model="content"
    counter="255"
    @blur="$emit('blur', $event)"
  ></v-textarea>
  
  <v-btn color="primary" @click="onSubmit">{{ submitText }}</v-btn>

  <!-- <v-btn color="error" @click="onCancel">取消</v-btn> -->
</v-sheet>
</template>
<script>
export default {
  props: {
    submitText: {
      required: false,
      type: String,
      default: "评论"
    }
  },
  data: () => ({
    content: null
  }),
  methods: {
    onSubmit() {
      this.$emit("submit", this.content);
    },
  },
}
</script>
<style lang="scss" scoped>

</style>