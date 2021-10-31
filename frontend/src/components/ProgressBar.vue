<!-- The progress bar showing assignment completion progress -->
<template>
  <div class="inner-shadow progress-bar">
    <transition-group name="progress-blocks" tag="div" class="progress-blocks-container">
      <div
        v-for="block in progressBlocks"
        :key="block.courseId"
        :style="{
          backgroundColor: block.color,
          width: block.width, 
          height: '100%',
        }"
        class="inner-shadow progress-block"
      ></div>
    </transition-group>
  </div>
</template>

<style scoped>
.progress-bar {
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
}

.progress-blocks-container {
  width: 100%;
  display: flex;
} 

.progress-block {
  transition: width 0.2s ease-in-out;
}

.progress-blocks-enter-active, .progress-blocks-leave-active {
  transition: all 0.2s ease-in-out;
}

.progress-blocks-enter, .progress-blocks-leave-to {
  max-width: 0%;
}

.progress-blocks-enter-to, .progress-blocks-leave {
  max-width: 100%;
}
</style>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProgressBar',

  props: {
    assignmentsForWeek: { type: Array, required: true },
  },

  computed: {
    ...mapGetters({ classes: 'termClasses' }),
    progressBlocks() {
      /* Returns an object mapping the color to the percentage of the progress bar, e.g.,
       * {
       *    '#cceedd': '10%'
       * }
       */

      const assignments = this.assignmentsForWeek.flat()

      // Count the number of completed assignments per class
      const numCompletedAssignments = {}
      assignments.filter(a => a.done).forEach(a => {
        if (a.class.courseId in numCompletedAssignments) {
          numCompletedAssignments[a.class.courseId]++
        } else {
          numCompletedAssignments[a.class.courseId] = 1
        }
      })

      // Construct an array of objects containing class color and the width of the progress block as a percentage
      const progressBlocks = []
      const sortedCourseIds = Object.keys(numCompletedAssignments).sort() 
      for (const courseId of sortedCourseIds) {
        const color = this.colorByCourseId(courseId)
        const percentage = numCompletedAssignments[courseId] / assignments.length * 100
        progressBlocks.push({
          courseId,
          color,
          width: `${percentage}%`,
        })
      }

      return progressBlocks
    },
  },

  methods: {
    colorByCourseId(courseId) {
      // Returns the color of the class based on courseId
      const _class = this.classes.find(c => c.courseId === courseId)
      if (!_class)
        return 'white'
      return _class.color
    },
  },
}
</script>
