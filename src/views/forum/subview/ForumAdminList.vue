<template>
  <v-card>
    <v-card-title>管理员用户</v-card-title>
    <v-divider />
    <v-list>
      <v-list-item v-for="(item, idx) in list" :key="item.id" class="mb-4">
        <simple-avatar :src="item.avatar"></simple-avatar>
        <div class="ml-4" @click="toUser(item)" style="cursor: pointer">
          {{ item.nickname }}
        </div>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
import userApi from "@/api/user/userApi.js"
import SimpleAvatar from '@/components/SimpleAvatar.vue'
export default {
  components: { SimpleAvatar },
  props: {
    forum: {
      required: true,
      type: Object,
      default: {}
    }
  },
  watch: {
    forum(newVal) {
      if (newVal.id) {
        this.getList()
      }
    }
  },
  data: () => ({
    list: [],
  }),
  methods: {
    toUser(user) {
      this.$router.push({
        name: "OtherPersonCircle",
        params: {userId: user.id}
      })
    },
    getList() {
      userApi.listManufacturer(this.forum.circleId)
      .then(res => {
        this.list = res
      })
      .catch(err => {
        this.alert.error(err)
      })
    }
  },
  created() {
    if (this.forum.id) {
      this.getList()
    }
  }
}
</script>