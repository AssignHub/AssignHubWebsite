<template>
  <v-card>
    <div class="d-flex">
      <v-tabs v-model="tab">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab @click="show = true">Input assignment</v-tab>
        <v-tab @click="show = true">Add crowdsourced assignment</v-tab>
      </v-tabs>
      <v-spacer />
      <v-btn icon class="ma-2" @click="show = !show">
        <v-icon v-if="show">mdi-chevron-down</v-icon>
        <v-icon v-else>mdi-chevron-up</v-icon>
      </v-btn>
    </div>
    <v-expand-transition>
      <v-tabs-items v-model="tab" v-show="show">
        <v-tab-item class="pa-1 mx-auto">
          <InputAssignment class="mx-auto" style="max-width: 400px;" />
        </v-tab-item>
        <v-tab-item class="pa-1">
          <AddAssignment class="mx-auto" style="max-width: 600px;" />
        </v-tab-item>
      </v-tabs-items>
    </v-expand-transition>
  </v-card>
</template>

<script>
import InputAssignment from '@/components/InputAssignment'
import AddAssignment from '@/components/AddAssignment'

export default {
  name: 'AddInputAssignment',

  components: {
    AddAssignment,
    InputAssignment,
  },

  data() {
    return {
      tab: 0,
      show: true,
    }
  },
}
</script>