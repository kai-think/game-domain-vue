<template>
<v-main>
  <v-dialog
    v-model="confirmDialogData.dialog"
    max-width="290"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ confirmDialogData.title }}
      </v-card-title>
      <v-card-text>
        {{ confirmDialogData.content }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="confirm"
        >
          确定
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          @click="cancel"
        >
          取消
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-main>
</template>
<script>
import confirmDialog from "@/common/confirmDialog.js"
export default {
  data: () => ({
    confirmDialogData: confirmDialog.data
  }),
  methods: {
    confirm() {
      this.confirmDialogData.confirmCallback()
      this.confirmDialogData.dialog = false
    },
    cancel() {
      this.confirmDialogData.cancelCallback()
      this.confirmDialogData.dialog = false
    }
  },
}
</script>
<style lang="scss">

</style>>