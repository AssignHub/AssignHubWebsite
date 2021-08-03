<template>
  <v-card>
    <div class="outer-container">
      <v-container style="flex: 0 0 auto;" class="pa-0">
        <v-row align="center">
          <v-col cols="auto" class="pr-0">
            <v-card-title class="text-subtitle-2">My Classes</v-card-title>
          </v-col>
          <v-spacer />
          <v-col cols="auto" class="pl-0 pr-7">
            <img
              height="20"
              :src="schoolLogo"
              style="vertical-align: middle;"
            />
          </v-col>
        </v-row>
      </v-container>
      <div class="grey lighten-5 inner-shadow py-4 inner-container" style="flex: 1 1 auto; min-height: 0;">
        <v-select
          style="flex: 0 0 auto;"
          :items="terms"
          dense
          outlined
          item-text="text"
          item-value="term"
          :value="term"
          @input="_changeTerm"
          hide-details
          class="mx-4 white"
        ></v-select>
        <div v-if="classes.length === 0" class="text-center text-caption pt-6 px-2">
          You are not in any classes.
        </div>
        <v-list v-else dense class="grey lighten-5 mx-2 pb-0 overflow-y-auto" style="flex: 1 1 auto;">
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
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ClassesList',

  components: {
    AddClassMenu,
    ClassInfoMenu,
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