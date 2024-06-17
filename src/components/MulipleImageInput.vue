<template>
<div>
  <div class="d-flex flex-wrap">
    <v-hover v-for="(src, idx) in srcs" :key="idx">
      <template #default="{hover}">
        <v-img
          style="flex: none"
          class="rounded mx-1"
          :src="src"
          :contain="contain"
          :min-width="minWidth"
          :min-height="minHeight"
          :max-width="maxWidth"
          :max-height="maxHeight"
          :width="width"
          :height="height"
        >
          <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0 image-none"
                align="center"
                justify="center"
              >
                <slot name="overlay">
                  
                    <v-icon large >mdi-tray-arrow-up</v-icon>
              
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
                  <v-btn icon @click="onUpload(idx)">
                    <v-icon large >mdi-tray-arrow-up</v-icon>
                  </v-btn>
                  <v-btn icon @click="onDelete(idx)" v-if="src">
                    <v-icon large>mdi-delete</v-icon>
                  </v-btn>
                </slot>
              </v-row>
            </v-overlay>
          </v-fade-transition>
        </v-img>
      </template>
    </v-hover>

    <v-hover v-if="srcs.length < maxSize">
      <template #default="{hover}">
        <v-img
          style="flex: none"
          class="rounded"
          :src="null"
          :contain="contain"
          :width="width"
          :height="height"
        >
          <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0 image-none"
                align="center"
                justify="center"
              >
                <slot name="overlay">
                  <v-icon large >mdi-tray-arrow-up</v-icon>
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
                  <v-btn icon @click="onUpload(-1)">
                    <v-icon large >mdi-tray-arrow-up</v-icon>
                  </v-btn>
                </slot>
              </v-row>
            </v-overlay>
          </v-fade-transition>
        </v-img>
      </template>
    </v-hover>
  </div>
</div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    initSrcList: {
      required: false,
      type: Array,
      default: []
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
    },
    maxSize: {
      required: false,
      type: Number,
      default: 3,
    }
  },
  data: () => ({
    inputEl: null,
    srcs: [],
    files: [],
    currentIdx: 0,
  }),
  computed: {

  },
  watch: {
    initSrcList(newVal) {
      this.initSrcs()
    }
  },
  methods: {
    onUpload(idx) {
      if (idx < 0) {
        if (this.files.length >= this.maxSize) {
          this.alert.error("图片数量超过" + this.maxSize + "个")
          return;
        }

        this.currentIdx = this.srcs.length;
      }
      else {
        this.currentIdx = idx;
      }
      
      this.inputEl.click();
    },
    onDelete(idx) {
      this.srcs.splice(idx, 1);
      this.files.splice(idx, 1);
    },
    onChange(event) {
      let fileReader = new FileReader();
      let file = this.inputEl.files[0];
      fileReader.onloadend = (ev) => {
        this.$set(this.srcs, this.currentIdx, fileReader.result)
        this.$set(this.files, this.currentIdx, file)
      }

      fileReader.readAsDataURL(this.inputEl.files[0]);

      this.$emit("change", this.files)
    },
    initSrcs() {
      let initSrcList = this.initSrcList.map(src => this.formatSrc(src));
      this.srcs = initSrcList
    }
  },
  created() {
    let input = document.createElement("input");
    input.type = "file"
    input.access = "image/*"
    input.onchange = this.onChange
    this.inputEl = input
    this.initSrcs()
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