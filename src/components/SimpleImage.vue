<template>
<div>
  <v-hover>
    <template #default="{hover}">
      <v-img
        :class="{rounded: rounded, roundedCircle: roundedCircle}"
        style="cursor: pointer"
        :src="thumbnailSrc"
        :contain="contain"
        :min-width="minWidth"
        :min-height="minHeight"
        :max-width="maxWidth"
        :max-height="maxHeight"
        :width="width"
        :height="height"
        @click="showBigImage"
      >
        <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0 image-none"
              align="center"
              justify="center"
            >
              <slot name="overlay">
                <v-icon large>mdi-alert-circle-outline</v-icon>
              </slot>
            </v-row>
        </template>
        <v-fade-transition>
          <v-overlay v-if="hover" absolute>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <slot name="overlay">
                
              </slot>
            </v-row>
          </v-overlay>
        </v-fade-transition>
      </v-img>
    </template>
  </v-hover>

  <v-dialog v-model="preview" class="text-center">
    
    <v-img :lazy-src="thumbnailSrc" :src="realSrc" @click="preview = false" :max-height="$vuetify.breakpoint.height" :max-width="$vuetify.breakpoint.width">
      <template #placeholder>
        <v-row class="fill-height" justify="center" align="center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </v-dialog>
</div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    rounded: {
      required: false,
      type: Boolean,
      default: true,
    },
    roundedCircle: {
      required: false,
      type: Boolean,
      default: false,
    },
    src: {
      required: false,
      type: String,
      default: null,
    },
    width: {
      required: false,
      type: String | Number,
      default: ""
    },
    height: {
      required: false,
      type: String | Number,
      default: ""
    },
    "min-width": {
      required: false,
      type: String | Number,
      default: ""
    },
    "min-height": {
      required: false,
      type: String | Number,
      default: ""
    },
    "max-width": {
      required: false,
      type: String | Number,
      default: ""
    },
    "max-height": {
      required: false,
      type: String | Number,
      default: ""
    },
    contain: {
      required: false,
      type: Boolean,
      default: false,
    }
  },
  computed: {
    thumbnailSrc() {
      return this.src ? this.formatThumbnailSrc(this.src) : null
    },
    realSrc() {
      return this.src ? this.formatSrc(this.src) : null
    }
  },
  data: () => ({
    preview: false,
  }),
  methods: {
    showBigImage() {
      this.preview = true;
    },
  },
  created() {

  },
}
</script>

<style>
.input-image-style {
  width: 300px;
  height: 200px;
}
.image-none {
  border: 1px dashed #1a237e61;
}
</style>