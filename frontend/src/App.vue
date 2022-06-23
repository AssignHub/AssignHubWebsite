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
html {
  overscroll-behavior: none;
  overflow-y: auto !important;
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
