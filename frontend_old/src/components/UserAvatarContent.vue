<template>
  <img 
    v-if="user.pic"
    :src="user.pic"
    :alt="user.firstName"
    referrerpolicy="no-referrer"
  >
  <span v-else class="white--text headline">{{ user.firstName[0] }}</span>
</template>

<script>
export default {
  name: 'UserAvatarContent',
  props: {
    user: Object,
  },
}
</script>