<!-- The progress bar showing assignment completion progress -->
<template>
  <div class="tw-shadow-inner-lg progress-bar tw-bg-white">
    <TransitionGroup name="progress-blocks" tag="div" class="progress-blocks-container">
      <div
        v-for="block in progressBlocks"
        :key="block.courseId"
        :style="{
          backgroundColor: block.color,
          width: block.width, 
          height: '100%',
        }"
        class="tw-shadow-inner progress-block"
      ></div>
    </TransitionGroup>
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

.progress-blocks-enter-from, .progress-blocks-leave-to {
  max-width: 0%;
}

.progress-blocks-enter-to, .progress-blocks-leave-from {
  max-width: 100%;
}
</style>

<script lang="ts">
import { useClassesStore } from '~~/stores/classes'
import { Assignment, Class } from '~~/types'

export default {
  name: 'ProgressBar',

  props: {
    assignmentsForWeek: { type: Array, required: true },
  },

  setup() {
    const classes = useClassesStore()
    return {
      classes
    }
  },

  watch: {
    // TODO: fix this logic, right now, shows confetti even on month change!
    /*progressBlocks() {
      if (this.progressTotal == 100) {
        // If 100% complete, display confetti!
        confetti({
          startVelocity: 30,
          particleCount: 100,
          spread: 360,
          angle: 270,
        })
      }
    },*/
  },

  computed: {
    // ...mapGetters({ classes: 'termClasses' }),
    progressBlocks() {
      /* Returns an object mapping the color to the percentage of the progress bar, e.g.,
       * {
       *    '#cceedd': '10%'
       * }
       */

      const assignments = this.assignmentsForWeek.flat()

      // Count the number of completed assignments per class
      const numCompletedAssignments = {}
      assignments.filter((a: Assignment) => a.done).forEach((a: Assignment) => {
        const courseId = a.class?.courseId ?? 'TASK'
        if (courseId in numCompletedAssignments) {
          numCompletedAssignments[courseId]++
        } else {
          numCompletedAssignments[courseId] = 1
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
    progressTotal() {
      /* Returns a single number representing the total progress */
      let total = 0 
      for (const block of this.progressBlocks) {
        total += parseFloat(block.width)
      }

      return total
    },
  },

  methods: {
    colorByCourseId(courseId: string) {
      /* Returns the color of the class based on courseId */
      const _class = this.classes.byCourseId.get(courseId)
      if (!_class)
        return '#eee'
      return _class.color
    },
  },
}
</script>
