<template>
<v-app>
  <confirm-dialog></confirm-dialog>
  <alert></alert>
  <layout></layout>
  <notification-view></notification-view>
</v-app>
</template>
<script>
import { mapMutations } from 'vuex'
import axios from "axios"
import Layout from "@/views/Layout.vue"
import Login from './views/person/modules/Login.vue';
import Vue from "vue"
import Alert from "@/components/Alert.vue"
import propotypeExpand from '@/common/propotype_expand'
import ConfirmDialog from './components/ConfirmDialog.vue';
import NotificationView from './views/notification/NotificationView.vue';

export default {
  name: "App",

  components: {Layout, Login, Alert, ConfirmDialog, NotificationView},
  data: () => ({
    
  }),
  computed: {

  },
  methods: {
    
  },
  created() {
    propotypeExpand.expand();
  },
  mounted() {
    this.$store.dispatch("load")
  },
};
</script>
<style lang="scss">
  $color-pack: false;

  @import '~vuetify/src/styles/main.sass';
</style>