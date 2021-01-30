<template>
  <v-select
    hide-details
    outlined 
    small-chips
    no-data-text="You are not in any classes!"
    :label="label"
    :items="classes"
    item-value="_id"
    :clearable="clearable"
    :multiple="multiple"
    :disabled="disabled"
    :dense="dense"
    :value="value"
    @input="updateValue"
  >
    <template v-slot:item="{ item }">
      <v-chip small :color="item.color">
        {{ item.courseId }}
      </v-chip>
    </template>
    <template v-slot:selection="{ item }">
      <v-chip small :color="item.color" :close="multiple" @click:close="deselect(item._id)">
        {{ item.courseId }}
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
    disabled: {type: Boolean, default: false},
    dense: {type: Boolean, default: false},
    value: {},
  },

  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },
    deselect(id) {
      this.updateValue(this.value.filter(classId => classId !== id))
    },
  },
}
</script>