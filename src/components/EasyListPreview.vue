<template>
<v-card>
  <v-card-subtitle class="pb-2">
    <slot name="title">
      <strong>
        预览
      </strong>
      {{ `共${items.length}个` }}
    </slot>
  </v-card-subtitle>
  <v-virtual-scroll
    :items="items"
    height="246"
    item-height="40"
  >
    <template v-slot:default="{ item, index }">
      <v-list-item :key="item">
        <v-list-item-action class="mr-4">
          <v-btn
            fab
            x-small
            depressed
            color="primary"
          >
            {{ index + 1 }}
          </v-btn>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>
            <strong>{{ item }}</strong>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-virtual-scroll>
</v-card>
</template>
<script>
export default {
  components: {},
  props: {
    items: {
      required: true,
      type: Array,
      default: []
    },
    
  },
  computed: {
    
  },
  data: () => ({
    
  }),
  methods: {

  },
  created() {

  }
}
</script>