<template>
  <v-row>
    <v-col :cols="3">
      <simple-image :src="cover" height="150"></simple-image>
    </v-col>
    <v-col :cols="9" class="pl-0 pt-1">
      <div class="fill-height d-flex flex-column justify-space-between">
        <v-card-title v-if="title" @click="onClickTitle" style="cursor: pointer">
          {{title}}
        </v-card-title>
        <v-card-subtitle class="mt-0" v-if="subtitle">
          {{ subtitle }}
        </v-card-subtitle>
        <v-card-actions class="pa-0 pb-1">
          <slot name="action">

          </slot>
        </v-card-actions>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import SimpleImage from './SimpleImage.vue';
export default {
  components: {
    SimpleImage,
  },
  props: {
    cover: {
      required: false,
      type: String,
      default: null
    },
    title: {
      required: false,
      type: String,
      default: null
    },
    subtitle: {
      required: false,
      type: String,
      default: null
    },
  },
  data: () => ({
    
  }),
  methods: {
    onClickTitle(event) {
      this.$emit("click:title", event);
    }
  }
}
</script>