<template>
  <v-menu
    transition="slide-x-transition"
    top
    right
    offset-x
    :close-on-content-click="false"
    :close-on-click="false"
    v-model="menu"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        block
        class="add-btn grey lighten-2"
        v-bind="attrs"
        v-on="on"
      >+ Add Friend</v-btn>
    </template>
    <v-card color="grey lighten-3">
      <v-card-text>
        <v-text-field 
          solo
          label="Search (name, email)"
          prepend-inner-icon="mdi-magnify"
          autocomplete="off"
          hide-details
        ></v-text-field>
      </v-card-text>
      <v-list class="overflow-y-auto" style="height: 200px">
      </v-list>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="menu = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<style scoped>
  .add-btn {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>

<script>
export default {
  name: 'AddFriendMenu',

  data() {
    return {
      menu: false,
    }
  },
}
</script>