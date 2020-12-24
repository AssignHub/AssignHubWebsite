<template>
  <v-select
    class="mb-4"
    hide-details
    outlined 
    small-chips
    no-data-text="You are not in any classes!"
    :label="label"
    :items="classes"
    :clearable="clearable"
    :multiple="multiple"
    :value="value"
    @input="updateValue"
  >
    <template v-slot:item="{ item }">
      <v-chip small :color="item.color">
        {{ item.class.courseId }}
      </v-chip>
    </template>
    <template v-slot:selection="{ attrs, item, selected }">
      <v-chip small :color="item.color" :input-value="selected" v-bind="attrs">
        {{ item.class.courseId }}
      </v-chip>
    </template>
  </v-select>
</template>

<style scoped>
.v-chip {
  cursor: pointer;
}
</style>

<script>
export default {
  name: 'ClassSelect',

  props: {
    classes: {type: Array, required: true},
    clearable: {type: Boolean, default: false},
    label: {type: String, default: 'Class'},
    multiple: {type: Boolean, default: false},
    value: {},
  },

  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },
  },
}
</script>