<template>
<div>
  <v-hover>
    <template #default="{hover}">
      <v-img
        class="rounded"
        style="cursor: pointer"
        :src="computedSrc"
        :contain="contain"
        :min-width="minWidth"
        :min-height="minHeight"
        :max-width="maxWidth"
        :max-height="maxHeight"
        :width="width"
        :height="height"
        @click="onImageClick"
      >
        <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0 image-none"
              align="center"
              justify="center"
            >
              <slot name="overlay">
                <v-icon large>mdi-tray-arrow-up</v-icon>
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
                <v-icon large>mdi-tray-arrow-up</v-icon>
              </slot>
            </v-row>
          </v-overlay>
        </v-fade-transition>
      </v-img>
    </template>
  </v-hover>
</div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    initSrc: {
      required: false,
      type: String,
      default: ""
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
    computedSrc() {
      return this.src ? this.src : this.formatSrc(this.initSrc);
    }
  },
  data: () => ({
    inputEl: null,
    src: null,
    file: null,
  }),
  methods: {
    onImageClick() {
      // this.$refs.imageInput.click();
      this.inputEl.click();
    },
    onChange(event) {
      let fileReader = new FileReader();
      fileReader.onloadend = (ev) => {
        this.src = fileReader.result
      }

      fileReader.readAsDataURL(this.inputEl.files[0]);

      this.$emit("change", this.inputEl.files[0])
    }
  },
  created() {
    let input = document.createElement("input");
    input.type = "file"
    input.access = "image"
    input.onchange = this.onChange
    this.inputEl = input
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