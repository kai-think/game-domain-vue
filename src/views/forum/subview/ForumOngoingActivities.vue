<template>
  <v-card>
    <v-card-title>正在进行的活动</v-card-title>
    <v-divider />

    <page-iterator :provider="activityProvider" :size="5" :skeletonSize="5">
      <template #default="{records}">
        <v-list>
          <v-list-item v-for="(p, idx) in records" :key="p.id" class="d-flex align-start mb-6" style="width: 100%">
            <div>
              <v-btn color="green" outlined small class="px-1" @click="toPostDetail(p)">
                <v-icon small class="mx-1">mdi-gift</v-icon>
                活动
              </v-btn>
            </div>
            <div class="d-flex flex-column ml-3" style="width: 100%">
              <div style="white-space: nowrap; width: calc(100% - 72px); overflow: hidden; text-overflow: ellipsis; cursor: pointer;" @click="toPostDetail(p)">
                {{ p.title }}
              </div>

              <div class="d-flex text-subtitle-2 mt-2" style="width: 100%;">
                <div>
                  <v-icon small color="blue">mdi-human-male</v-icon>
                  <span >
                    {{ p.joinNum }}
                  </span>
                </div>
                <div class="ml-3">
                  <v-icon small color="red">mdi-timer-off-outline</v-icon>
                  <span class="ml-1">{{ formatDate(p.endTime).dateFormat }} </span>
                </div>
              </div>
            </div>
          </v-list-item>
        </v-list>
      </template>
    </page-iterator>
  </v-card>
</template>
<script>
import activityApi from "@/api/bbs/activityApi.js"
import PageIterator from '../../../components/PageIterator.vue'
export default {
  components: { PageIterator },
  props: {
    forum: {
      required: true,
      type: Object,
      default: {}
    }
  },
  computed: {
    activityProvider() {
      if (this.forum && this.forum.id)
        return ({current, size}) => activityApi.page({current, size, forumId: this.forum.id, status: 1})

      return null
    }
  },
  data: () => ({
    list: [],
  }),
  watch: {

  },
  methods: {
    toPostDetail(activity) {
      this.$router.push({
        name: "game-forum-post",
        params: {id: activity.bbsId}
      })
    },
  },
  created() {

  }
}
</script>