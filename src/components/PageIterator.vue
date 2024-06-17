<template>
<div>
  <v-card-subtitle v-if="total == 0 && !loading">
    无
  </v-card-subtitle>

  <div v-if="loading">
    <v-skeleton-loader
      v-for="i in skeletonSize"
      :key="i"
      v-bind="attrs"
      type="list-item-avatar-two-line"
    ></v-skeleton-loader>
  </div>

  <slot name="default" :records="list" :current="current" :size="size" :total="total">
    <div v-for="(item, idx) in list" :key="idx">
      <div>{{item}}</div>
    </div>
  </slot>

  <div v-if="total > size">
    <v-pagination
      v-model="current"
      @input="onPageCurrentChange"
      circle
      :length="pageLength"
      :total-visible="7"
    ></v-pagination>
  </div>
</div>
</template>
<script>
export default {
  props: {
    provider: {
      required: true,
      type: Function | null,
      default: ({current, size}) => ({total: 0, records: []})
    },
    getTotal: {
      required: false,
      type: Function,
      default: (res) => res.total
    },
    getRecords: {
      required: false,
      type: Function,
      default: (res) => res.records
    },
    flushOnCreated: {
      required: false,
      type: Boolean,
      default: true,
    },
    size: {
      required: false,
      type: Number,
      default: 7,
    },
    skeletonSize: {
      required: false,
      type: Number,
      default: 7,
    }
  },
  components: { },
  data: () => ({
    list: [],

    current: 1,
    
    total: 0,
    
    loading: false,
    attrs: {
      class: 'mb-0',
      boilerplate: false,
      elevation: 0,
    },
  }),
  computed: {
    pageLength() {
      let total = this.total;
      let size = this.size;
      let mod = total % size
      return mod === 0 ? total / size : Math.floor(this.total / this.size) + 1;
    }
  },
  watch: {
    provider(newVal) {
      console.log("provider change")
      this.resetList()
    }
  },
  methods: {
    flushList() {
      if (typeof this.provider !== "function") {
        console.error("provider is not a function")
        return;
      }

      let request = this.provider({current: this.current, size: this.size})

      if (!(request instanceof Promise)) {
        this.alert.error("数据提供者没有返回Promise")
        return;
      }
      // this.list = []
      this.loading = true
      request.then(res => {
        this.total = this.getTotal(res)
        this.list = this.getRecords(res)
        this.loading = false
      })
      .catch(err => {
        this.alert.error(err)
        this.loading = false
      });
    },
    resetList() {
      this.total = 0;
      this.current = 1;
      this.flushList()
    },
    onPageCurrentChange(current) {
      this.flushList()
    },
  },
  mounted() {
    if (this.flushOnCreated) {
      console.log("flushOnCreated")
      this.flushList();
    }
  },
}
</script>
<style lang="scss">
  
</style>