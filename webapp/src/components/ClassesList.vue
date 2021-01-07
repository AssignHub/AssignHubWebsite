<template>
  <v-card>
    <v-card-title class="pb-0">My Classes</v-card-title>
    <v-select
      :items="terms"
      dense
      outlined
      item-text="text"
      item-value="term"
      :value="term"
      @input="(term) => changeTerm(term)"
      hide-details
      class="mx-2"
    ></v-select>
    <v-list dense>
      <v-list-item
        v-for="(c, i) in classes"
        :key="i"
      >
        <v-list-item-content class="pa-0">
          <v-col cols="auto" class="pa-0">
            <v-chip :color="c.color">{{ c.courseId }}</v-chip>
          </v-col>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    
    <AddClassMenu />
  </v-card>
</template>

<script>
import AddClassMenu from '@/components/AddClassMenu'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ClassesList',

  components: {
    AddClassMenu,
  },

  computed: {
    ...mapState([ 'term', 'terms' ]),
    ...mapGetters({ classes: 'termClasses' }),
  },

  methods: {
    ...mapActions([ 'changeTerm' ]),
  },
}
</script>