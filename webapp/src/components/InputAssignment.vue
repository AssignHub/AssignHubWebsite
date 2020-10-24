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
      <!--<v-textarea
        hide-details
        filled  
        autocomplete="off" 
        label="Description (optional)"
        class="mb-4"
      ></v-textarea>-->
      <v-row>
        <v-col cols="12" md="6" class="py-0">
          <ClassSelect
            :classes="classes" 
            v-model="curClass" 
          />
        </v-col>
        <v-col cols="12" md="6" class="py-0">
          <v-text-field
            hide-details
            filled
            autocomplete="off"
            label="Due date/time"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-checkbox
        label="Publish"
        class="mt-0"
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
import ClassSelect from '@/components/ClassSelect'

export default {
  name: 'InputAssignment',

  props: {
    classes: {type: Array, required: true},
  },

  components: {
    ClassSelect
  },

  data() {
    return {
      curClass: '',
    }
  },
}
</script>