<template>
<div style="position: fixed; right: 20px; width: 30%; min-width: 230px; z-index: 999; top: 68px" elevation=24>
  <v-alert
    class="my-2"
    v-for="(alertData, idx) in alertList"
    :key="idx"
    v-model="alertData.show"
    :type="alertData.type"
    :prominent="alertData.prominent"
    :shaped="alertData.shaped"
    :color="alertData.color"
    :icon="alertData.icon"
    :dark="alertData.dark"
    :dismissible="alertData.dismissible"
    transition="scroll-x-reverse-transition"
  >
    {{ alertData.title }}
  </v-alert>
</div>
</template>
<script>
import alertObj from "@/common/alert.js"
export default {
  data: () => ({
    alertList: alertObj.alertList
  }),
}
</script>
<style lang="scss">

</style>>