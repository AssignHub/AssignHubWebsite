<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <span class="text-h4">AssignHub</span>
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

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
