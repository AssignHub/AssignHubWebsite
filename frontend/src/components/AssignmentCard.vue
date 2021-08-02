<template>
  <v-card
    :style="{opacity: disabled ? '50%' : 'unset', backgroundColor: color}"
    v-on="!toAdd ? { click } : {}"
    @contextmenu="(e) => $emit('contextmenu', e)"
    @mousedown="(e) => $emit('mousedown', e)"
    class="pa-0"
  >
    <div class="courseId pl-1">
      {{ assignment.class.courseId }}
    </div>
    <v-card-text>
      <v-row>
        <v-col class="pa-0">
          <div 
            class="text-caption font-weight-bold"
            :style="{textDecoration: disabled ? 'line-through' : 'unset'}"
          >{{ assignment.name }}</div>
          <div class="text-caption">{{ dateString }}{{ timeString }}</div>
          <div v-if="showCreator" class="text-caption">{{ creatorString }}</div>
        </v-col>
        <v-col 
          v-if="toAdd" 
          class="pa-1 elevation-2 rounded" 
          style="background-color: rgba(255, 255, 255, 0.3)" 
          cols="auto"
          align-self="start"  
        >
          <v-btn icon @click="add" small class="d-block">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn icon @click="remove" small class="d-block">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
  .courseId {
    font-size: 0.7rem;
    color: white;
    background-color: rgba(120, 120, 120, 0.4);
    /*position: absolute;
    bottom: 0;
    left: 0;
    transform-origin: 0 0;
    transform: rotate(270deg);*/
  }
</style>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AssignmentCard',

  props: {
    assignment: {type: Object, required: true},
    toAdd: {type: Boolean, default: false},
    showDate: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    showCreator: {type: Boolean, default: false},
  },

  emits: ['click', 'add', 'remove'],

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
    creatorString() {
      return 'Created by ' + this.assignment.creator.firstName + ' ' + this.assignment.creator.lastName
    },
    color() {
      const _class = this.classes.find(c => c.courseId === this.assignment.class.courseId)
      if (!_class)
        return 'white'
      return _class.color
    },
  },

  methods: {
    click(e) {
      this.$emit('click', e)
    },
    add(e) {
      this.$emit('add', e)
    },
    remove(e) {
      this.$emit('remove', e)
    }
  }
}
</script>