<template>
  <v-dialog
    v-model="show"
    transition="fade-transition"
    bottom
    offset-x
    width="500"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <AssignmentCard
        class="mx-2 mb-2" 
        v-bind="{ ...$props, ...$attrs, ...attrs }"
        v-on="on"
      />
    </template>
    <v-card style="width: 500px;">
      <v-card-title>
        <InputItem type="input" v-model="tempAssignmentData.name" class="text-h6" maxlength="50"/>
      </v-card-title>
      <v-card-text>
        <table>
          <tr>
            <td>Class</td>
            <td>
              <ClassSelectInput 
                v-model="tempAssignmentData.class"
                :classes="classes"
                dense
              />
            </td>
          </tr>
          <tr>
            <td>Due</td>
            <td>
              <DateTimePickerDialog
                :date.sync="tempAssignmentData.date"
                :time.sync="tempAssignmentData.time"
              >
                <template v-slot:activator="{ on, attrs }">
                  <InputItem
                    class="pa-2 black--text"
                    cursor="pointer"
                    showHover
                    @focus="showDateSelector"
                    v-bind="attrs"
                    v-on="on"
                  >{{ `${dateString} at ${timeString}` }}</InputItem>
                </template>
              </DateTimePickerDialog>
            </td>
          </tr>
          <tr>
            <td style="vertical-align: top;">
              <div class="pt-2">Description</div>
            </td>
            <td>
              <InputItem 
                v-model="tempAssignmentData.description" 
                class="pa-2"
                placeholder="Empty" 
                showBorderOnEdit
                showHover
                type="textarea"
              />
            </td>
          </tr>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="error"
        >Delete</v-btn>
        <v-btn
          color="primary"
        >Mark as done</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  table {
    border-spacing: 20px 0px;
    margin: 0px -20px;
  }

  td {
    white-space: nowrap;
    vertical-align: middle;
  }

  td:nth-child(1) {
    text-align: right;
  }
  
  td:last-child {
    width: 100%;
  }
</style>

<script>
import { mapGetters, mapActions } from 'vuex'
import AssignmentCard from '@/components/AssignmentCard'
import ClassSelectInput from '@/components/ClassSelectInput'
import DateTimePickerDialog from '@/components/DateTimePickerDialog'
import InputAssignment from '@/components/InputAssignment'
import InputItem from '@/components/InputItem'
import { DAYS_OF_WEEK, MONTHS } from '@/constants'
import { getDateString, getTimeString, } from '@/utils/utils'

export default {
  name: 'AssignmentMenu',

  components: {
    AssignmentCard,
    ClassSelectInput,
    DateTimePickerDialog,
    InputAssignment,
    InputItem,
  },

  props: {
    assignment: {type: Object, required: true},
  },

  created() {
    //console.log(this.assignment)
    this.updateTempData()
  },

  watch: {
    show: {
      immediate: true,
      handler(show) {
        if (show) {
          this.updateTempData()
        }
      },
    },
  },

  data() {
    return {
      show: false,
      tempAssignmentData: null,
      console,
    }
  },

  computed: {
    ...mapGetters(['classColorById']),
    ...mapGetters({ classes: 'termClasses' }),
    classColor() {
      return this.classColorById(this.tempAssignmentData.class._id)
    },
    dueDate() {
      return new Date(Date.parse(this.tempAssignmentData.date + 'T' + this.tempAssignmentData.time))
    },
    dateString() {
      return `${DAYS_OF_WEEK[this.dueDate.getDay()]}, ${MONTHS[this.dueDate.getMonth()]} ${this.dueDate.getDate()}`
    },
    timeString() {
      return this.dueDate.toLocaleTimeString([], {timeStyle: 'short'})
    },
  },

  methods: {
    ...mapActions([ 'toggleAssignment' ]),
    toggle() {
      this.show = false
      this.toggleAssignment(this.assignment._id)
    },
    showDateSelector(e) {
      e.target.blur()
    },
    updateTempData() {
      // get date and time string
      const d = new Date(this.assignment.dueDate)
      const date = getDateString(d)
      const time = getTimeString(d)

      this.tempAssignmentData = { ...this.assignment, date, time }
    },
  },
}
</script>