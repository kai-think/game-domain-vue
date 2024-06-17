<template>
<div style="display: flex; align-items: center;">
  <v-btn icon class="ml-4" @click="$emit('click', $event)" :disabled="disabled" small>
    <v-icon color="#0D47A1">{{ thumbUp ? "mdi-thumb-up" : "mdi-thumb-up-outline" }}</v-icon>
  </v-btn>
  <span class="ml-1 text-subtitle-1 font-weight-bold">
    {{ count }}
  </span>
</div>
</template>
<script>
export default {
  components: {
  },
  props: {
    thumbUp: {
      required: true,
      type: Boolean,
      default: false
    },
    count: {
      required: false,
      type: Number,
      default: 0
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    
  }),
  methods: {
    
  }
}
</script>