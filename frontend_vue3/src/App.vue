<script lang="ts" setup>
</script>

<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

html {
  overscroll-behavior: none;
  overflow-y: auto !important;
}

* {
  font-family: 'Inter';
}

.v-btn {
  font-weight: 500 !important;
  letter-spacing: unset !important;
  text-transform: unset !important;
  font-size: 1rem !important;
}

.v-btn--variant-outlined {
  border-color: lightgray !important;
}
</style>
