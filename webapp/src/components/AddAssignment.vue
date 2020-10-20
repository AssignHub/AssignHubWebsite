<template>
  <v-card>
    <v-card-title>Add Crowdsourced Assignment</v-card-title>
    <v-card-text>
      <ClassSelect
        label="Sort by class"
        :classes="classes" 
        v-model="curClass" 
        clearable
        multiple
      />

      <v-card class="grey lighten-5 inner-shadow">
        <v-card-text class="py-2">
          <v-row>
            <v-col 
              v-for="(a, i) in assignmentsToAdd" 
              :key="i"
              cols="4"
              class="pa-0"
            >
              <AssignmentCard
                :assignment="a"
                :classes="classes"
                class="mx-1 mb-2"
                @add="add(i)"
                toAdd
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.inner-shadow {
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.25) !important;
}
</style>

<script>
import AssignmentCard from '@/components/AssignmentCard'
import ClassSelect from '@/components/ClassSelect'

export default {
  name: 'AddAssignment',

  props: {
    classes: {type: Array, required: true},
    assignmentsToAdd: {type: Array, required: true},
  },

  components: {
    AssignmentCard,
    ClassSelect,
  },

  data() {
    return {
      curClass: '',
    }
  },

  methods: {
    add(i) {
      console.log(i)
    },
  },
}
</script>