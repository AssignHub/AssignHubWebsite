<script setup lang="ts">
import AddClassMenuSearchOld from './school_specific/AddClassMenuSearchOld.vue';

const menu = ref(false) 

</script>
      
<template>
  
  <v-menu transition="slide-y-transition" top right offset-x :close-on-content-click="false" :close-on-click="false"
    v-model="menu" min-width="300px" max-width="300px">
    <AddClassMenuSearchOld @hide="menu=false"></AddClassMenuSearchOld>
    <template v-slot:activator="{ props }">
      <v-btn class="tw-text-dark-gray tw-text-lg tw-w-32" @click="" variant="text" size="small" v-bind="props">
        + Add Class
      </v-btn>
    </template>
  </v-menu>

</template> 