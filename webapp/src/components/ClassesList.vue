<template>
  <v-card>
    <v-card-title class="pb-0">My Classes</v-card-title>
    <v-select
      :items="terms"
      dense
      solo
      item-text="text"
      item-value="term"
      v-model="term"
    ></v-select>
    <v-list dense>
      <v-list-item
        v-for="(c, i) in classes"
        :key="i"
      >
        <v-list-item-content class="pa-0">
          <v-col cols="auto" class="pa-0">
            <v-chip :color="c.color">{{ c.text }}</v-chip>
          </v-col>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { getCurTerm } from '@/util.js'

export default {
  name: 'ClassesList',

  props: {
    classes: { type: Array, required: true },
    terms: { type: Array, required: true },
  },

  watch: {
    terms() {
      if (this.terms.length > 0) {
        // set to current term
        this.term = getCurTerm()
      }
    },
  },

  data() {
    return {
      term: '',
    }
  },
}
</script>