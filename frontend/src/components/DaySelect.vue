<template>
  <v-btn-toggle 
    :value="value"
    @change="val => $emit('input', val)"
    color="primary" 
    multiple 
    borderless 
    rounded 
    dense
  >
    <v-btn
      icon
      v-for="(d, i) in days" :key="i"
    >{{ d }}</v-btn>
  </v-btn-toggle>
</template>

<style scoped>
._container {
  display: flex;
  justify-content: space-between;
}

.v-btn-toggle {
  display: flex;
  justify-content: space-between;
}

.v-btn-toggle > .v-btn.v-btn {
  border-radius: 28px;
}

.v-btn-toggle--rounded {
  border-radius: 28px;
}
</style>

<script>
export default {
  name: 'DaySelect',

  emits: ['input'],

  props: {
    disabled: { type: Boolean, default: false },
    value: { type: Array, default: [] },
  },

  data() {
    return {
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    }
  },
}
</script>
