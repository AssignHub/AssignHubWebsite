<template>
  <v-card
    :style="{opacity: disabled ? '50%' : 'unset', backgroundColor: color}"
    v-on="!toAdd ? { click } : {}"
    @contextmenu="(e) => $emit('contextmenu', e)"
    @mousedown="(e) => $emit('mousedown', e)"
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
import { mapGetters } from 'vuex'

export default {
  name: 'AssignmentCard',

  props: {
    assignment: {type: Object, required: true},
    toAdd: {type: Boolean, default: false},
    showDate: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
  },

  computed: {
    ...mapGetters({ classes: 'termClasses' }),
    dueDate() {
      return new Date(this.assignment.dueDate)
    },
    dateString() {
      return this.showDate ? (this.dueDate.getMonth() + 1) + '/' + this.dueDate.getDate() + ' | ' : ''
    },
    timeString() {
      return this.dueDate.toLocaleTimeString([], {timeStyle: 'short'})
    },
    color() {
      if (this.classes.length === 0)
        return 'white'
      return this.classes.find(c => c.courseId === this.assignment.course.courseId).color
    },
  },

  methods: {
    click(e) {
      this.$emit('click', e)
    },
    add(e) {
      this.$emit('add', e)
    },
  }
}
</script>