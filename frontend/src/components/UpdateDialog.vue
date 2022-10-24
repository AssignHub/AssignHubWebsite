<template>
  <v-dialog
    :value="value"
    @input="v => $emit('input', v)"
    persistent
    width="300"
  >
    <v-card>
      <v-card-title>Update available</v-card-title>
      <v-card-text>
        A new update for AssignHub is available, would you like to reload the page?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="reload">Reload</v-btn> 
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UpdateDialog',

  props: {
    value: { type: Boolean },
  },

  methods: {
    close() {
      this.$emit('input', false)
    },
    reload() {
      this.$emit('accept')
      this.close()
    },
  },
}
</script>