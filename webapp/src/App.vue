<template>
  <v-app>
    <v-app-bar
      app
      color="white darken-2"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-avatar>
        <img src="https://lh3.googleusercontent.com/ogw/ADGmqu-Zu6BCGm76JhjQpuTITJZAU458l7wy3YUPsBq2=s83-c-mo">
      </v-avatar>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
html {
  overflow-y: auto !important;
}
</style>

<script>
export default {
  name: 'App',
};
</script>
