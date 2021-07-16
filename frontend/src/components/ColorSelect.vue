<template>
  <v-select
    v-bind="attrs"
    menu-props="auto"
    outlined
    dense
    hide-details
    label="Color"
    :items="colors"
    :value="value"
    @input="(val) => $emit('input', val)"
    style="width: 80px;"
    :disabled="disabled"
  >
    <template v-slot:selection="{ item }">
      <div :style="`height: 20px; width: 20px; border-radius: 50%; background-color: ${item}`">
      </div>
    </template>
    <template v-slot:item="{ item }">
      <div :style="`height: 20px; width: 20px; border-radius: 50%; background-color: ${item}`">
      </div>
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'ColorSelect',

  props: {
    value: { type: String, required: true },
    colors: { type: Array, default: null },
    disabled: { type: Boolean, default: false },
    attrs: Object,
  },
}
</script>