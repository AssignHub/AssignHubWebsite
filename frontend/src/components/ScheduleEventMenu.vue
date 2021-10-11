<template>
  <v-menu
    v-if="event"
    :value="value"
    @input="val => $emit('input', val)"
    v-bind="{ ...$attrs }"
  >
    <v-card>
      <v-card-title>
        <v-text-field
          :value="event.name"
          autofocus
          dense
        />
      </v-card-title>
      <v-card-text>watwat</v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'ScheduleEventMenu',

  emits: ['input', 'change-event'],

  props: {
    event: { type: Object },
    value: { type: Boolean, required: true },
  },

  data() {
    return {
      show: false,
    }
  },
}
</script>