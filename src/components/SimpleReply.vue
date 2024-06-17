<template>
<v-main class="pt-0">
  <div class="d-flex">
    <div class="flex-grow-0 flex-shrink-1 d-flex justify-center">
      <simple-avatar :src="avatar" :width="avatarSize" :height="avatarSize" class="mt-5"  />
    </div>
    <div class="flex-grow-1">
      <v-card-title :class="{'text-h6': !small, 'text-subtitle-1': small, 'pb-3': !small, 'pb-1': small}">
          {{ nickname }}
      </v-card-title>

      <v-card-text :class="{'text-body-2': true, 'pb-1': small}">
          {{ content }}
      </v-card-text>

      <v-card-subtitle class="text-caption pt-0 d-flex align-center">
        <span>
          {{ formatDate(replyTime).diffFormat }}
        </span>
      </v-card-subtitle>
    </div>
  </div>
</v-main>
</template>
<script>
import SimpleAvatar from '@/components/SimpleAvatar.vue';
export default {
  props: {
    //要显示的评论
    avatar: {
      required: false,
      type: String,
      default: null
    },
    nickname: {
      required: false,
      type: String,
      default: "昵称"
    },
    content: {
      required: false,
      type: String,
      default: "内容"
    },
    replyTime: {
      required: false,
      type: Array,
      default: null
    },
    small: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  components: {
    SimpleAvatar
  },
  data: () => ({
    
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    avatarSize() {
      let size = [42, 58]
      return this.small ? size[0] : size[1]
    },
  },
  watch: {
    
  },
  methods: {

  },
  created() {
    //初始化

  }
}
</script>