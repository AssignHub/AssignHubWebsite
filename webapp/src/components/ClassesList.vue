<template>
  <v-card>
    <v-card-title class="pb-0">My Classes</v-card-title>
    <v-list dense>
      <v-list-item
        v-for="(c, i) in classes"
        :key="i"
      >
        <v-list-item-content class="pa-0">
          <v-chip :color="c.color">{{ c.name }}</v-chip>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'ClassesList',

  props: {
    classes: { type: Array, required: true }
  }
}
</script>