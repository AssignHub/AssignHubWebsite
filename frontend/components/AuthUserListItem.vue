<!-- Displays the authUser as a list item with a menu to sign out -->
<script setup lang="ts">
  import { useAuthUserStore } from '~~/stores/authUser';

  const authUser = useAuthUserStore()

  function signOut() {
    authUser.signOut()
  }
</script>

<template>
  <UserListItem 
    v-if="authUser.user" 
    :user="authUser.user"
    no-padding
  >
    <template v-slot:append>
      <v-btn icon variant="text">
        <v-icon>mdi-dots-vertical</v-icon>

        <v-menu activator="parent">
          <v-list>
            <v-list-item @click="signOut">
              <v-list-item-title class="tw-text-red">Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </template>
  </UserListItem>
</template>