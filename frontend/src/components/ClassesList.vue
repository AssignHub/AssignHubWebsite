<template>
  <v-card>
    <div class="outer-container">
      <v-container style="flex: 0 0 auto;" class="pa-0">
        <div class="tw-flex tw-items-center">
          <v-card-title class="text-subtitle-2">My Classes</v-card-title>
          <v-spacer/>
          <img 
            class="tw-h-5 tw-mr-5"
            :src="schoolLogo"
          >
        </div>
      </v-container>
      <div class="grey lighten-5 inner-shadow py-4 inner-container" style="flex: 1 1 auto; min-height: 0;">
        <div style="flex: 0 0 auto; display: flex; justify-content: center; align-items: center;">
          <v-select
            :items="terms"
            dense
            outlined
            item-text="text"
            item-value="term"
            :value="term"
            @input="_changeTerm"
            hide-details
            class="ml-4 white"
          ></v-select>
          <ScheduleDialog>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                class="mx-2"
              >
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                    >mdi-calendar</v-icon>
                  </template>
                  <span>My schedule</span>
                </v-tooltip>
              </v-btn>
            </template>
          </ScheduleDialog>
        </div>
        <div v-if="classes.length === 0" class="text-center text-caption pt-6 px-2 d-flex" style="height: 100%; flex-direction: column; align-items: center;">
          <div>
          You are not in any classes.
          </div>
          <div style="flex: 5"/>
          <div class="mb-2">
            Start by adding one below!
          </div>

          <!-- Arrow -->
          
          <img 
            draggable="false"
            width="80"
            :src="require('@/assets/add_class_arrow.svg')"
          />
          
        </div>
        <v-list v-else dense class="grey lighten-5 mx-2 pb-0 overflow-y-auto" style="flex: 1 1 auto;">
          <v-list-item
            v-for="_class in classes"
            :key="_class._id"
            class="mt-3"
          >
            <v-list-item-content class="pa-0">
              <v-col cols="auto" class="pa-0">
                <ClassInfoMenu :_class="_class" />
              </v-col>
            </v-list-item-content>
          </v-list-item>

          <!--
          <v-list-item
            v-for="_class in classes"
            :key="_class._id"
          >
            <v-list-item-content class="pa-0">
              <v-col cols="auto" class="pa-0">
                <ClassInfoMenu :_class="_class" />
              </v-col>
            </v-list-item-content>
          </v-list-item>
          -->

        </v-list>
      </div>
      
      <AddClassMenu btn-style="flex: 0 0 auto;" />
    </div>
  </v-card>
</template>

<style scoped>
.outer-container {
  display: flex;
  flex-flow: column;
  height: 100%;
}

.inner-container {
  display: flex;
  flex-flow: column;
}
</style>

<script>
import AddClassMenu from '@/components/AddClassMenu'
import ClassInfoMenu from '@/components/ClassInfoMenu'
import ScheduleDialog from '@/components/ScheduleDialog'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ClassesList',

  components: {
    AddClassMenu,
    ClassInfoMenu,
    ScheduleDialog,
  },

  computed: {
    ...mapState([ 'authUser', 'term', 'terms' ]),
    ...mapGetters({ classes: 'termClasses' }),
    schoolLogo() {
      // Return school logo path if it exists
      try {
        return require(`@/assets/school_specific/${this.authUser.school}/logo.png`)
      } catch (e) {
        return ''
      }
    },
  },

  methods: {
    ...mapActions([ 'changeTerm' ]),
    _changeTerm(term) {
      window.localStorage.setItem('term', term)
      this.changeTerm(term)
    },
  },
}
</script>