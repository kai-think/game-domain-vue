<template>
<div>
  <v-row>
    <v-col>
      <v-text-field type="date" v-model="date" :label="labelDate" @change="onChange"/>
    </v-col>
    <v-col>
      <v-text-field type="time" v-model="time" :label="labelTime" @change="onChange"/>
    </v-col>
  </v-row>
</div>
</template>
<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    labelDate: {
      required: false, 
      type: String,
      default: "日期"
    },
    labelTime: {
      required: false, 
      type: String,
      default: "时间"
    }
  },
  data: () => ({
    date: null,
    time: null,
  }),
  watch: {
    value(newVal) {
      console.log("datetime watch", newVal)
    }
  },
  methods: {
    onChange() {
      let datetime = this.date + " " + this.time
      console.log("datetime emit", datetime)
      this.$emit("change", datetime)
    }
  }
}
</script>