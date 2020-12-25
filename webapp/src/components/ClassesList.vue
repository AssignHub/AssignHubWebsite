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
      @input="(term) => $emit('update:term', term)"
      hide-details
      class="mx-2"
    ></v-select>
    <v-list dense>
      <v-list-item
        v-for="(c, i) in termClasses"
        :key="i"
      >
        <v-list-item-content class="pa-0">
          <v-col cols="auto" class="pa-0">
            <v-chip :color="c.color">{{ c.class.courseId }}</v-chip>
          </v-col>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    
    <AddClassMenu 
      :term="term" 
      :classes="termClasses" 
      @error="error => $emit('error', error)" 
      @info="info => $emit('info', info)" 
      @addedClass="() => $emit('addedClass')"
    />
  </v-card>
</template>

<script>
import AddClassMenu from '@/components/AddClassMenu'

export default {
  name: 'ClassesList',

  props: {
    classes: { type: Array, required: true },
    terms: { type: Array, required: true },
    term: { type: String, required: true },
  },

  components: {
    AddClassMenu,
  },

  computed: {
    termClasses() {
      return this.classes.filter(c => c.class.term === this.term)
    },
  },
}
</script>