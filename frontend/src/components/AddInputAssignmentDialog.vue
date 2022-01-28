<!-- Contains a fab button that reveals the input assignment dialog -->

<template>
  <span>
    <v-slide-y-reverse-transition>
      <v-card
        v-show="value"
        ref="card"
        style="position: absolute; z-index: 50;"
        :style="style"
      >
        <div v-dragged="drag" id="drag-area" class="pa-1" >
          <v-spacer />
          <v-btn icon small @click="hide">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div 
          id="tut-add-assignment-form"
          style="position: relative;" 
        >
          <div class="add-btn-container">
            <v-badge
              bordered
              style="z-index: 51;"
              :content="_numPendingAssignments"
              :value="showInput && numPendingAssignments > 0"
              color="primary"
              overlap
              absolute
            >
              <v-btn
                icon
                style="z-index: 50;"
                @click="
                  showInput = !showInput
                  getPublicAssignments()
                "
              >
                <v-scale-transition leave-absolute origin="center">
                  <v-icon 
                    id="tut-crowdsource-btn"
                    v-if="showInput" 
                    key="plus-box-multiple" 
                  >mdi-plus-box-multiple</v-icon>
                  <v-icon v-else key="clipboard-plus">mdi-clipboard-plus</v-icon>
                </v-scale-transition>
              </v-btn>
            </v-badge>
          </div>
          <v-expand-transition>
            <InputAssignment v-if="showInput" :width="400" />
            <AddAssignment v-else :width="400" />
          </v-expand-transition>
        </div>
      </v-card>
    </v-slide-y-reverse-transition>


    <v-btn
      id="tut-add-assignment-btn"
      ref="button"
      fab
      color="primary"
      absolute
      bottom
      right
      class="mr-1 mb-1"
      style="bottom: 16px;"
      @click="show"
    ><v-badge
              bordered
              style="z-index: 51;"
              :value="numPendingAssignments > 0"
              color="blue"
              absolute
            >
      <v-icon>mdi-plus</v-icon>
</v-badge>
    </v-btn>
  </span>
</template>

<style scoped>
#drag-area {
  background-color: #eee;
  display: flex;
  cursor: move;
}

.add-btn-container {
  position: absolute;
  right: 16px;
  top: 16px;
}
</style>

<script>
import { mapState, mapActions } from 'vuex'

import InputAssignment from '@/components/InputAssignment'
import AddAssignment from '@/components/AddAssignment'

export default {
  name: 'AddInputAssignmentDialog',

  emits: ['input'],

  props: {
    value: { type: Boolean, required: true }, // whether to show dialog
  },

  components: {
    AddAssignment,
    InputAssignment,
  },

  watch: {
    value() {
      if (!this.value) {
        setTimeout(() => (this.showInput = true), 100)
      }
    },
  },

  data() {
    return {
      x: 0,
      y: 0,
      showInput: true,
    }
  },

  computed: {
    ...mapState(['numPendingAssignments']),
    _numPendingAssignments() {
      return this.numPendingAssignments > 99
        ? '99+'
        : this.numPendingAssignments
    },
    style() {
      // Style the position of the card
      return {
        top: `${this.y}px`,
        left: `${this.x}px`,
      }
    },
  },

  methods: {
    ...mapActions(['getPublicAssignments']),
    drag({ deltaX, deltaY }) {
      /* Move dialog box when dragged */
      const { clientHeight, clientWidth } = this.$refs.card.$el

      // Keep dialog box in bounds of window
      if (deltaX) {
        if (this.x + deltaX + clientWidth > window.innerWidth)
          this.x = window.innerWidth - clientWidth
        else if (this.x + deltaX < 0) this.x = 0
        else this.x += deltaX
      }
      if (deltaY) {
        if (this.y + deltaY + clientHeight > window.innerHeight)
          this.y = window.innerHeight - clientHeight
        else if (this.y + deltaY < 0) this.y = 0
        else this.y += deltaY
      }
    },
    resetPos() {
      /* Resets the position of dialog to be above fab */
      const card = this.$refs.card?.$el
      const button = this.$refs.button?.$el
      if (!card || !button) return

      const { clientHeight: btnHeight, clientWidth: btnWidth } = button

      // Show card temporarily to get width and height
      card.style.display = 'unset'
      const { clientHeight: cardHeight, clientWidth: cardWidth } = card
      if (!this.value) card.style.display = 'none'

      // Set position
      this.x = window.innerWidth - cardWidth - 16
      this.y = window.innerHeight - cardHeight - btnHeight - 2 * 16 // 16 is the margin surrounding the button
    },
    show() {
      /* Resets dialog box position then displays it */
      this.resetPos()

      if (!this.value) {
        // setTimeout is needed so the slide transition plays
        setTimeout(() => this.$emit('input', true))
        // Get public assignments so the numPendingAssignments number is correct
        this.getPublicAssignments()
      }
    },
    hide() {
      this.$emit('input', false)
    },
  },
}
</script>
