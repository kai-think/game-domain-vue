<template>
<div>
  <v-hover>
    <template #default="{hover}">
      <simple-image :src="src" height="160" min-width="200" style="cursor: pointer">
        <template #placeholder>
          <v-row class="fill-height" justify="center" align="center">
            <v-icon large>mdi-alert-circle-outline</v-icon>
          </v-row>
        </template>

        <v-fade-transition>
          <v-overlay v-if="hover" absolute>
          </v-overlay>
        </v-fade-transition>
      </simple-image>

    </template>
  </v-hover>
  
  <v-hover>
    <template #default="{hover}">
      <div :class="{'text-body-2 text-center mt-1': true, 'blue--text': hover}" @click="$emit('click')" style="cursor: pointer">
        {{ title }}
      </div>
    </template>
  </v-hover>
</div>
</template>
<script>
import SimpleImage from './SimpleImage.vue'
export default {
  components: {
    SimpleImage
  },
  props: {
    src: {
      required: true,
      type: String
    },
     title: {
      required: true,
      type: String
    },
  },

}
</script>