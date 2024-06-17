<template>
<v-card width="420">
  <v-card-title class="d-flex justify-space-between">
    <div>
      幸运抽奖！
    </div>

    <v-chip-group>
      <v-chip v-if="isCreate" dark color="indigo">未开始</v-chip>
      <v-chip v-else-if="isStart" dark color="green">进行中</v-chip>
      <v-chip v-else-if="isEnd" dark color="red">已结束</v-chip>
      <v-chip v-else-if="isCancel" dark>取消</v-chip>
    </v-chip-group>
  </v-card-title>
  
  <v-card-subtitle class="pb-2" >
    <span class="mr-3">参与人数</span>
    <strong class="font-weight-bold">{{ activity.joinNum }}</strong>
  </v-card-subtitle>
  <v-divider />
  <v-card-text>
    <div v-if="isCreate || isEnd">开始时间 {{ formatDate(activity.startTime).dateFormat }}</div>
    <div v-if="isStart  || isEnd">结束时间 {{ formatDate(activity.endTime).dateFormat }}</div>
    <div>奖品数量 {{ luckDraw.prizeNum }}</div>
  </v-card-text>

  <v-card-actions >
    <v-spacer />
    <div v-if="isLogin && situation.id">
      <span class="pa-2">参与中...</span>
    </div>
    <div v-else-if="isStart">
      <v-btn text color="primary" @click="joinLuckDraw">参与抽奖</v-btn>
    </div>
  </v-card-actions>

</v-card>
</template>
<script>
import Constant from "@/common/constant.js"
import luckDrawApi from "@/api/bbs/activity/luckDrawApi"
export default {
  props: {
    post: {
      required: true,
      type: Object,
    }
  },
  components: {  },
  data: () => ({
    Constant,
    activity: {
      id: null,
      bbsId: null,
      type: null,
      startTime: "",
      endTime: "",
      joinNum: 0,
      status: null,
    },
    luckDraw: {
      activityId: null,
      prizeNum: null,
      winNoticeTitle: null,
      winNoticeContentTemplate: null,
      winNoticeContentVariable: null,
      prizeList: [],
    }, 
    situation: {
      targetId: null,
      userId: null,
      status: null,
      winPrize: null,
    },
  }),
  computed: {
    isLogin() {
      return this.$store.getters.isLogin;
    },
    isCreate() {
      return this.activity.status === Constant.ActivityStatus.CREATED;
    },
    isStart() {
      return this.activity.status === Constant.ActivityStatus.START;
    },
    isEnd() {
      return this.activity.status === Constant.ActivityStatus.END;
    },
    isCancel() {
      return this.activity.status === Constant.ActivityStatus.CANCEL;
    }
  },
  watch: {
    isLogin(newVal) {
      if (!newVal) {
        this.situation = {};
        return
      }

      this.getSituation();
    }
  },
  methods: {
    joinLuckDraw() {
      if (!this.isLogin) {
        this.alert.warning("请先登陆");
        return
      }

      luckDrawApi.joinLuckDraw(this.activity.id, this.luckDraw.id)
      .then(res => {
        this.situation = res
        this.alert.success("参与成功！");

        this.activity.joinNum++;
      })
      .catch(err => this.alert.error(err))
    },
    getSituation() {
      if (!this.isLogin) 
        return;
      
      luckDrawApi.getSituation(this.luckDraw.id)
      .then(res => {
        
        this.situation = res ? res : {}
      })
      .catch(err => this.alert.error(err))
    }
  },
  mounted() {
    luckDrawApi.getByBbsId(this.post.id)
    .then(res => {
      this.luckDraw = res;
      this.activity = res.etc.activity;

      this.getSituation();
    })
    .catch(err => this.alert.error(err))
  }
}
</script>