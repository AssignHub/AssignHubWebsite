<!-- Displays the user's profile pic or the first letter of their name if the avatar doesn't exist -->
<script setup lang="ts">
  import { User } from '~~/types';

  const props = defineProps({
    user: { type: Object as () => User, required: true },
  })
</script>

<template>
  <img 
    v-if="props.user.pic"
    :src="props.user.pic"
    :alt="props.user.firstName"
    referrerpolicy="no-referrer"
  >
  <span v-else class="white--text headline">{{ user.firstName[0] }}</span>
</template>
