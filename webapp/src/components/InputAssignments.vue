<template>
  <v-card>
    <v-card-title>Input Assignments</v-card-title>
    <v-card-text>
      <v-text-field
        hide-details
        filled  
        autocomplete="off" 
        label="Assignment name"
        class="mb-4"
      ></v-text-field>
      <v-textarea
        hide-details
        filled  
        autocomplete="off" 
        label="Description (optional)"
        class="mb-4"
      ></v-textarea>
      <v-select
        hide-details
        filled 
        label="Class"
        :items="classes"
        small-chips
        v-model="curClass"
        class="mb-4"
      >
        <template v-slot:item="{ item }">
          <v-chip small :color="item.color">
            {{ item.text }}
          </v-chip>
        </template>
        <template v-slot:selection="{ attrs, item, selected }">
          <v-chip small :color="item.color" :input-value="selected" v-bind="attrs">
            {{ item.text }}
          </v-chip>
        </template>
      </v-select>
      <v-text-field
        hide-details
        filled
        autocomplete="off"
        label="Due date/time"
      ></v-text-field>
      <v-checkbox
        label="Publish"
        hint="Let others use this assignment"
        persistent-hint
      >
      </v-checkbox>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn>Submit</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'InputAssignments',

  props: {
    classes: {type: Array, required: true},
  },

  data() {
    return {
      curClass: null,
    }
  },

  methods: {
    filter(item, queryText, itemText) {
      const hasValue = val => val != null ? val : ''

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text.toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1
    },
  }
}
</script>