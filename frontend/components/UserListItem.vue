<!-- A list item that displays the user's profile picture, their name, and their email -->
<script setup lang="ts">
  import { User } from '~~/types';

  const props = defineProps({
    user: { type: Object as () => User, required: true },
    noPadding: { type: Boolean, default: false },
  })

  const name = computed((): string => `${props.user.firstName} ${props.user.lastName}`)
</script>

<template>
  <v-list-item
    :title="name"
    :subtitle="props.user.email"
    :class="{ 'tw-p-0': noPadding }"
  >
    <template v-slot:prepend>
      <v-avatar>
        <UserAvatarContent :user="user" />
      </v-avatar>
    </template>
    <template v-slot:append>
      <slot name="append"></slot>
    </template>
  </v-list-item>
</template>