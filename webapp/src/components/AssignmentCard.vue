<template>
  <v-card
    :class="getClassColor(assignment.classUid)"
    :style="{opacity: disabled ? '50%' : 'unset'}"
    v-on="!toAdd ? { click } : {}"
  >
    <v-card-text class="py-1">
      <v-row>
        <v-col class="pa-0">
          <div 
            class="text-caption font-weight-bold"
            :style="{textDecoration: disabled ? 'line-through' : 'unset'}"
          >{{ assignment.name }}</div>
          <div class="text-caption">{{ dateString }}{{ timeString }}</div>
        </v-col>
        <v-col v-if="toAdd" class="pa-0" cols="auto">
          <v-btn icon @click="add">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'AssignmentCard',

  props: {
    assignment: {type: Object, required: true},
    classes: {type: Array, required: true},
    toAdd: {type: Boolean, default: false},
    showDate: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
  },

  computed: {
    dueDate() {
      return new Date(this.assignment.dueDate)
    },
    dateString() {
      return this.showDate ? (this.dueDate.getMonth() + 1) + '/' + this.dueDate.getDate() + ' | ' : ''
    },
    timeString() {
      return this.dueDate.toLocaleTimeString([], {timeStyle: 'short'})
    },
  },

  methods: {
    getClassColor(classUid) {
      return this.classes.find(c => c.uid === classUid).color
    },
    click() {
      this.$emit('click')
    },
    add() {
      this.$emit('add')
    },
  }
}
</script>