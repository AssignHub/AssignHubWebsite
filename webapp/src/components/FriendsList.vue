<template>
  <v-card>
    <v-card-title class="pb-0">My Friends</v-card-title>
    <v-list dense>
      <v-list-item v-for="(f, i) in friends" :key="i">
        <v-list-item-content>
          {{ f.firstName }} {{ f.lastName }}
        </v-list-item-content>
        <v-list-item-icon>
          <img :src="emojis[f.emojiIndex]" style="height: 30px;">
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'FriendsList',

  props: {
    friends: { type: Array, required: true },
    emojis: { type: Array, required: true },
  },
}
</script>